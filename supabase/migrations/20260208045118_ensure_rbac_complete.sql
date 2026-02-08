-- Migration: Ensure RBAC (Role-Based Access Control) is complete
-- This migration ensures all RBAC components exist on the remote database

-- =============================================
-- 1. ENUM TYPES
-- =============================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'teacher', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.class_member_role AS ENUM ('teacher', 'assistant', 'student');
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.class_member_status AS ENUM ('active', 'pending', 'removed');
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

-- =============================================
-- 2. PREREQUISITE TABLES (for functions)
-- =============================================

-- Table: classes (needed for can_manage_class function)
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  class_code text NOT NULL DEFAULT upper(SUBSTRING(md5((random())::text) FROM 1 FOR 6)),
  creator_id uuid NOT NULL,
  cover_image text,
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT classes_class_code_key UNIQUE (class_code)
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Table: class_members (needed for is_class_member and can_manage_class functions)
CREATE TABLE IF NOT EXISTS public.class_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role public.class_member_role NOT NULL DEFAULT 'student'::class_member_role,
  status public.class_member_status NOT NULL DEFAULT 'active'::class_member_status,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT class_members_class_id_user_id_key UNIQUE (class_id, user_id)
);

DO $$ BEGIN
  ALTER TABLE public.class_members ADD CONSTRAINT class_members_class_id_fkey 
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- Table: audit_logs (needed for create_audit_log function)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. RBAC TABLES
-- =============================================

-- Table: permissions
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general'::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Add unique constraint if not exists
DO $$ BEGIN
  ALTER TABLE public.permissions ADD CONSTRAINT permissions_name_key UNIQUE (name);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
WHEN others THEN NULL;
END $$;

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Table: role_permissions
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  permission_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE public.role_permissions ADD CONSTRAINT role_permissions_role_permission_id_key UNIQUE (role, permission_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.role_permissions ADD CONSTRAINT role_permissions_permission_id_fkey 
    FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Table: user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user'::app_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. CORE RBAC FUNCTIONS
-- =============================================

-- Function: has_role - Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Function: has_permission - Check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id
      AND p.name = _permission
  )
$function$;

-- Function: get_user_permissions - Get all permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id uuid)
 RETURNS TABLE(permission_name text, permission_category text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT DISTINCT p.name, p.category
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role = rp.role
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = _user_id
  ORDER BY p.category, p.name
$function$;

-- Function: is_class_member - Check if user is a member of a class
CREATE OR REPLACE FUNCTION public.is_class_member(_user_id uuid, _class_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_id = _class_id 
      AND user_id = _user_id 
      AND status = 'active'
  )
$function$;

-- Function: can_manage_class - Check if user can manage a class
CREATE OR REPLACE FUNCTION public.can_manage_class(_user_id uuid, _class_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.classes WHERE id = _class_id AND creator_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_id = _class_id 
      AND user_id = _user_id 
      AND role IN ('teacher', 'assistant')
      AND status = 'active'
  ) OR has_role(_user_id, 'admin')
$function$;

-- Function: is_user_expired - Check if user account is expired
CREATE OR REPLACE FUNCTION public.is_user_expired(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
  )
$function$;

-- Function: create_audit_log - Create an audit log entry
CREATE OR REPLACE FUNCTION public.create_audit_log(
  _action text, 
  _entity_type text, 
  _entity_id text DEFAULT NULL::text, 
  _old_value jsonb DEFAULT NULL::jsonb, 
  _new_value jsonb DEFAULT NULL::jsonb, 
  _metadata jsonb DEFAULT '{}'::jsonb
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, metadata)
  VALUES (auth.uid(), _action, _entity_type, _entity_id, _old_value, _new_value, _metadata)
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$function$;

-- =============================================
-- 4. RLS POLICIES FOR RBAC TABLES
-- =============================================

-- Permissions table policies
DO $$ BEGIN
  CREATE POLICY "Permissions viewable" ON public.permissions 
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage permissions" ON public.permissions 
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

-- Role permissions table policies
DO $$ BEGIN
  CREATE POLICY "Role permissions viewable" ON public.role_permissions 
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage role permissions" ON public.role_permissions 
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

-- User roles table policies
DO $$ BEGIN
  CREATE POLICY "Users can view their own roles" ON public.user_roles 
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can manage all roles" ON public.user_roles 
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL;
END $$;

-- =============================================
-- 5. SEED DEFAULT PERMISSIONS
-- =============================================

-- Insert default permissions if they don't exist
INSERT INTO public.permissions (name, description, category) VALUES
  -- User management permissions
  ('users.view', 'View user list and details', 'users'),
  ('users.create', 'Create new users', 'users'),
  ('users.update', 'Update user information', 'users'),
  ('users.delete', 'Delete users', 'users'),
  ('users.manage_roles', 'Assign and remove user roles', 'users'),
  
  -- Content management permissions
  ('content.view', 'View all content', 'content'),
  ('content.create', 'Create new content', 'content'),
  ('content.update', 'Update existing content', 'content'),
  ('content.delete', 'Delete content', 'content'),
  ('content.publish', 'Publish content', 'content'),
  ('content.moderate', 'Moderate user-generated content', 'content'),
  
  -- Exam management permissions
  ('exams.view', 'View all exams', 'exams'),
  ('exams.create', 'Create new exams', 'exams'),
  ('exams.update', 'Update existing exams', 'exams'),
  ('exams.delete', 'Delete exams', 'exams'),
  ('exams.grade', 'Grade exam submissions', 'exams'),
  
  -- Course management permissions
  ('courses.view', 'View all courses', 'courses'),
  ('courses.create', 'Create new courses', 'courses'),
  ('courses.update', 'Update existing courses', 'courses'),
  ('courses.delete', 'Delete courses', 'courses'),
  
  -- Class management permissions
  ('classes.view', 'View all classes', 'classes'),
  ('classes.create', 'Create new classes', 'classes'),
  ('classes.update', 'Update existing classes', 'classes'),
  ('classes.delete', 'Delete classes', 'classes'),
  ('classes.manage_members', 'Manage class members', 'classes'),
  
  -- Reports and analytics permissions
  ('reports.view', 'View reports and analytics', 'reports'),
  ('reports.export', 'Export reports', 'reports'),
  
  -- System settings permissions
  ('settings.view', 'View system settings', 'settings'),
  ('settings.update', 'Update system settings', 'settings'),
  
  -- Article management permissions
  ('articles.view', 'View all articles', 'articles'),
  ('articles.create', 'Create new articles', 'articles'),
  ('articles.update', 'Update existing articles', 'articles'),
  ('articles.delete', 'Delete articles', 'articles'),
  ('articles.approve', 'Approve/reject articles', 'articles')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 6. ASSIGN PERMISSIONS TO ROLES
-- =============================================

-- Admin role gets all permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::app_role, id FROM public.permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Moderator permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'moderator'::app_role, id FROM public.permissions 
WHERE name IN (
  'users.view',
  'content.view', 'content.moderate',
  'articles.view', 'articles.approve',
  'reports.view'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- Teacher permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'teacher'::app_role, id FROM public.permissions 
WHERE name IN (
  'content.view', 'content.create', 'content.update',
  'exams.view', 'exams.create', 'exams.update', 'exams.grade',
  'courses.view', 'courses.create', 'courses.update',
  'classes.view', 'classes.create', 'classes.update', 'classes.manage_members',
  'articles.view', 'articles.create', 'articles.update',
  'reports.view'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- User (basic) permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'user'::app_role, id FROM public.permissions 
WHERE name IN (
  'content.view',
  'exams.view',
  'courses.view',
  'articles.view', 'articles.create'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- =============================================
-- 7. HELPER FUNCTIONS FOR PERMISSIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.has_any_permission(_user_id uuid, _permissions text[])
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id
      AND p.name = ANY(_permissions)
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_all_permissions(_user_id uuid, _permissions text[])
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (
    SELECT COUNT(DISTINCT p.name)
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id
      AND p.name = ANY(_permissions)
  ) = array_length(_permissions, 1)
$function$;

-- =============================================
-- 8. FUNCTION TO GET USER'S ROLES
-- =============================================

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
 RETURNS TABLE(role app_role)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$function$;

-- =============================================
-- 9. CONVENIENCE FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT has_role(_user_id, 'admin'::app_role)
$function$;

CREATE OR REPLACE FUNCTION public.is_moderator(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT has_role(_user_id, 'moderator'::app_role)
$function$;

CREATE OR REPLACE FUNCTION public.is_teacher(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT has_role(_user_id, 'teacher'::app_role)
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT has_role(_user_id, 'admin'::app_role) OR has_role(_user_id, 'moderator'::app_role)
$function$;

-- =============================================
-- PART 5: STUDY GROUPS SYSTEM (COMPLETE)
-- =============================================

-- Study Groups (main table first)
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  creator_id UUID NOT NULL,
  is_public BOOLEAN DEFAULT true,
  max_members INTEGER DEFAULT 50,
  member_count INTEGER DEFAULT 1,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public study groups viewable" ON public.study_groups FOR SELECT USING (is_public = true OR creator_id = auth.uid());
CREATE POLICY "Auth users create study groups" ON public.study_groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners update study groups" ON public.study_groups FOR UPDATE USING (creator_id = auth.uid());
CREATE POLICY "Owners delete study groups" ON public.study_groups FOR DELETE USING (creator_id = auth.uid());
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON public.study_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Study Group Members
CREATE TABLE public.study_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable for public groups" ON public.study_group_members FOR SELECT USING (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.is_public = true) OR auth.uid() = user_id);
CREATE POLICY "Users join study groups" ON public.study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave study groups" ON public.study_group_members FOR DELETE USING (auth.uid() = user_id);

-- Study Group Messages
CREATE TABLE public.study_group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages viewable by members" ON public.study_group_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = study_group_messages.group_id AND user_id = auth.uid()));
CREATE POLICY "Members post messages" ON public.study_group_messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = study_group_messages.group_id AND user_id = auth.uid()));
CREATE POLICY "Delete own messages" ON public.study_group_messages FOR DELETE USING (user_id = auth.uid());

-- Study Group Resources
CREATE TABLE public.study_group_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT DEFAULT 'link' CHECK (resource_type IN ('link', 'file', 'note', 'exam', 'flashcard')),
  resource_url TEXT,
  resource_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_group_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources viewable by members" ON public.study_group_resources FOR SELECT USING (EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = study_group_resources.group_id AND user_id = auth.uid()));
CREATE POLICY "Members share resources" ON public.study_group_resources FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = study_group_resources.group_id AND user_id = auth.uid()));
CREATE POLICY "Delete own resources" ON public.study_group_resources FOR DELETE USING (user_id = auth.uid());

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  points_reward INTEGER NOT NULL DEFAULT 10,
  badge_color TEXT NOT NULL DEFAULT 'gold',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements viewable" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User Achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User achievements viewable" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permissions
CREATE TABLE public.permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permissions viewable" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "Admins manage permissions" ON public.permissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Role Permissions
CREATE TABLE public.role_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role app_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (role, permission_id)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Role permissions viewable" ON public.role_permissions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage role permissions" ON public.role_permissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Auth users create logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Smart Recommendations
CREATE TABLE public.user_smart_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  recommendations jsonb NOT NULL,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_smart_recommendations ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_smart_recommendations_user_id ON public.user_smart_recommendations(user_id);
CREATE POLICY "View own recommendations" ON public.user_smart_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own recommendations" ON public.user_smart_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own recommendations" ON public.user_smart_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Permission functions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id
      AND p.name = _permission
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id uuid)
RETURNS TABLE(permission_name text, permission_category text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT p.name, p.category
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role = rp.role
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = _user_id
  ORDER BY p.category, p.name
$$;

CREATE OR REPLACE FUNCTION public.create_audit_log(
  _action TEXT,
  _entity_type TEXT,
  _entity_id TEXT DEFAULT NULL,
  _old_value JSONB DEFAULT NULL,
  _new_value JSONB DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, metadata)
  VALUES (auth.uid(), _action, _entity_type, _entity_id, _old_value, _new_value, _metadata)
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$$;
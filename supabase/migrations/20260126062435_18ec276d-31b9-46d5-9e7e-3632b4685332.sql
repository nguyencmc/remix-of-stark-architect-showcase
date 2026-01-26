-- Create enum for class member roles
CREATE TYPE public.class_member_role AS ENUM ('teacher', 'assistant', 'student');

-- Create enum for class member status
CREATE TYPE public.class_member_status AS ENUM ('active', 'pending', 'removed');

-- Create enum for assignment types
CREATE TYPE public.assignment_type AS ENUM ('exam', 'practice', 'book', 'podcast');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'submitted', 'graded', 'late');

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  class_code TEXT UNIQUE NOT NULL DEFAULT upper(substring(md5(random()::text) from 1 for 6)),
  creator_id UUID NOT NULL,
  cover_image TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Class members table
CREATE TABLE public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role class_member_role NOT NULL DEFAULT 'student',
  status class_member_status NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, user_id)
);

-- Class courses (many-to-many)
CREATE TABLE public.class_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, course_id)
);

-- Class assignments
CREATE TABLE public.class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type assignment_type NOT NULL,
  ref_id UUID NOT NULL,
  due_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.class_assignments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending',
  score NUMERIC,
  attempt_id UUID,
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user can manage class
CREATE OR REPLACE FUNCTION public.can_manage_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes WHERE id = _class_id AND creator_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_id = _class_id 
      AND user_id = _user_id 
      AND role IN ('teacher', 'assistant')
      AND status = 'active'
  ) OR has_role(_user_id, 'admin')
$$;

-- Helper function: check if user is class member
CREATE OR REPLACE FUNCTION public.is_class_member(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_members 
    WHERE class_id = _class_id 
      AND user_id = _user_id 
      AND status = 'active'
  )
$$;

-- RLS Policies for classes
CREATE POLICY "Admin full access to classes"
ON public.classes FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can create classes"
ON public.classes FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'))
  AND creator_id = auth.uid()
);

CREATE POLICY "Class managers can update"
ON public.classes FOR UPDATE
USING (can_manage_class(auth.uid(), id));

CREATE POLICY "Class managers can delete"
ON public.classes FOR DELETE
USING (can_manage_class(auth.uid(), id));

CREATE POLICY "Members can view their classes"
ON public.classes FOR SELECT
USING (
  creator_id = auth.uid() 
  OR is_class_member(auth.uid(), id)
  OR has_role(auth.uid(), 'admin')
);

-- RLS Policies for class_members
CREATE POLICY "Admin full access to class_members"
ON public.class_members FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Class managers can manage members"
ON public.class_members FOR ALL
USING (can_manage_class(auth.uid(), class_id));

CREATE POLICY "Students can join class"
ON public.class_members FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'student'
  AND status = 'active'
);

CREATE POLICY "Members can view class members"
ON public.class_members FOR SELECT
USING (is_class_member(auth.uid(), class_id) OR can_manage_class(auth.uid(), class_id));

-- RLS Policies for class_courses
CREATE POLICY "Admin full access to class_courses"
ON public.class_courses FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Class managers can manage courses"
ON public.class_courses FOR ALL
USING (can_manage_class(auth.uid(), class_id));

CREATE POLICY "Members can view class courses"
ON public.class_courses FOR SELECT
USING (is_class_member(auth.uid(), class_id));

-- RLS Policies for class_assignments
CREATE POLICY "Admin full access to assignments"
ON public.class_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Class managers can manage assignments"
ON public.class_assignments FOR ALL
USING (can_manage_class(auth.uid(), class_id));

CREATE POLICY "Members can view published assignments"
ON public.class_assignments FOR SELECT
USING (
  is_class_member(auth.uid(), class_id) 
  AND is_published = true
);

-- RLS Policies for assignment_submissions
CREATE POLICY "Admin full access to submissions"
ON public.assignment_submissions FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can manage own submissions"
ON public.assignment_submissions FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Class managers can view all submissions"
ON public.assignment_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.class_assignments ca
    WHERE ca.id = assignment_id
    AND can_manage_class(auth.uid(), ca.class_id)
  )
);

CREATE POLICY "Class managers can grade submissions"
ON public.assignment_submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.class_assignments ca
    WHERE ca.id = assignment_id
    AND can_manage_class(auth.uid(), ca.class_id)
  )
);

-- Update trigger for classes
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for class_assignments
CREATE TRIGGER update_class_assignments_updated_at
BEFORE UPDATE ON public.class_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
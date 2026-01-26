-- Add creator_id to book_categories
ALTER TABLE public.book_categories 
ADD COLUMN creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add creator_id to course_categories
ALTER TABLE public.course_categories 
ADD COLUMN creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add creator_id to exam_categories
ALTER TABLE public.exam_categories 
ADD COLUMN creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add creator_id to podcast_categories
ALTER TABLE public.podcast_categories 
ADD COLUMN creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies for book_categories
DROP POLICY IF EXISTS "Teachers can create book categories" ON public.book_categories;
CREATE POLICY "Teachers can create book categories"
ON public.book_categories FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  AND (creator_id = auth.uid() OR creator_id IS NULL)
);

DROP POLICY IF EXISTS "Teachers can update book categories" ON public.book_categories;
CREATE POLICY "Teachers can update book categories"
ON public.book_categories FOR UPDATE
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Teachers can delete book categories" ON public.book_categories;
CREATE POLICY "Teachers can delete book categories"
ON public.book_categories FOR DELETE
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Update RLS policies for course_categories
DROP POLICY IF EXISTS "Teachers can create course categories" ON public.course_categories;
CREATE POLICY "Teachers can create course categories"
ON public.course_categories FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  AND (creator_id = auth.uid() OR creator_id IS NULL)
);

DROP POLICY IF EXISTS "Admins can manage course categories" ON public.course_categories;
CREATE POLICY "Admins and owners can manage course categories"
ON public.course_categories FOR ALL
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Update RLS policies for exam_categories
DROP POLICY IF EXISTS "Teachers can create exam categories" ON public.exam_categories;
CREATE POLICY "Teachers can create exam categories"
ON public.exam_categories FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  AND (creator_id = auth.uid() OR creator_id IS NULL)
);

DROP POLICY IF EXISTS "Teachers can update exam categories" ON public.exam_categories;
CREATE POLICY "Teachers can update exam categories"
ON public.exam_categories FOR UPDATE
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Teachers can delete exam categories" ON public.exam_categories;
CREATE POLICY "Teachers can delete exam categories"
ON public.exam_categories FOR DELETE
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add RLS policies for podcast_categories (if not exist)
DROP POLICY IF EXISTS "Teachers can create podcast categories" ON public.podcast_categories;
CREATE POLICY "Teachers can create podcast categories"
ON public.podcast_categories FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  AND (creator_id = auth.uid() OR creator_id IS NULL)
);

DROP POLICY IF EXISTS "Teachers can update podcast categories" ON public.podcast_categories;
CREATE POLICY "Teachers can update podcast categories"
ON public.podcast_categories FOR UPDATE
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Teachers can delete podcast categories" ON public.podcast_categories;
CREATE POLICY "Teachers can delete podcast categories"
ON public.podcast_categories FOR DELETE
USING (
  (creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);
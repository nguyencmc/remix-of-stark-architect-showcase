-- Drop course_id column (bỏ liên kết khóa học)
ALTER TABLE public.question_sets DROP COLUMN IF EXISTS course_id;

-- Drop existing RLS policies for question_sets
DROP POLICY IF EXISTS "Published question sets are viewable by everyone" ON public.question_sets;
DROP POLICY IF EXISTS "Teachers can manage their own question sets" ON public.question_sets;

-- Create new RLS policies for practice system
-- 1. Users can view their own question sets (private)
CREATE POLICY "Users can view their own question sets"
ON public.question_sets FOR SELECT
USING (creator_id = auth.uid());

-- 2. Users can view public/published question sets
CREATE POLICY "Anyone can view public question sets"
ON public.question_sets FOR SELECT
USING (is_published = true);

-- 3. Authenticated users can create their own question sets
CREATE POLICY "Users can create their own question sets"
ON public.question_sets FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- 4. Users can update their own question sets
CREATE POLICY "Users can update their own question sets"
ON public.question_sets FOR UPDATE
USING (creator_id = auth.uid());

-- 5. Users can delete their own question sets
CREATE POLICY "Users can delete their own question sets"
ON public.question_sets FOR DELETE
USING (creator_id = auth.uid());

-- 6. Admins can manage all question sets
CREATE POLICY "Admins can manage all question sets"
ON public.question_sets FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Similar policies for practice_questions
DROP POLICY IF EXISTS "Users can view practice questions from published sets" ON public.practice_questions;
DROP POLICY IF EXISTS "Teachers can manage practice questions" ON public.practice_questions;

-- Users can view questions from their own sets or published sets
CREATE POLICY "Users can view practice questions"
ON public.practice_questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.question_sets 
    WHERE question_sets.id = practice_questions.set_id 
    AND (question_sets.creator_id = auth.uid() OR question_sets.is_published = true)
  )
);

-- Users can manage questions in their own sets
CREATE POLICY "Users can insert practice questions"
ON public.practice_questions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.question_sets 
    WHERE question_sets.id = practice_questions.set_id 
    AND question_sets.creator_id = auth.uid()
  )
);

CREATE POLICY "Users can update practice questions"
ON public.practice_questions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.question_sets 
    WHERE question_sets.id = practice_questions.set_id 
    AND question_sets.creator_id = auth.uid()
  )
);

CREATE POLICY "Users can delete practice questions"
ON public.practice_questions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.question_sets 
    WHERE question_sets.id = practice_questions.set_id 
    AND question_sets.creator_id = auth.uid()
  )
);

-- Admins can manage all questions
CREATE POLICY "Admins can manage all practice questions"
ON public.practice_questions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
-- =============================================
-- FIX PRACTICE SYSTEM TABLE SCHEMAS
-- The first migration (20260121165516) created tables with an old schema.
-- The second migration (20260124022237) tried to CREATE TABLE again but
-- was repaired to "applied" without actually executing.
-- This migration transforms the tables to match the expected schema.
-- =============================================

-- -----------------------------------------------
-- 1. FIX question_sets: add missing columns
-- -----------------------------------------------
-- Add slug column (from migration 20260125182603 that didn't run)
ALTER TABLE public.question_sets ADD COLUMN IF NOT EXISTS slug TEXT;
-- Add duration_minutes column (from migration 20260125182603 that didn't run)
ALTER TABLE public.question_sets ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
-- Add creator_id column (from migration 20260124022237 that didn't run)
ALTER TABLE public.question_sets ADD COLUMN IF NOT EXISTS creator_id UUID;

-- Create unique index on slug (nullable unique) if not exists
CREATE UNIQUE INDEX IF NOT EXISTS question_sets_slug_unique
ON public.question_sets (slug)
WHERE slug IS NOT NULL;

-- Create index on creator_id if not exists
CREATE INDEX IF NOT EXISTS idx_question_sets_creator_id ON public.question_sets(creator_id);

-- -----------------------------------------------
-- 2. FIX practice_questions: transform from old to new schema
--    Old: type, prompt, choices(JSONB), answer(JSONB), difficulty(INTEGER)
--    New: question_text, question_image, option_a-f, correct_answer, difficulty(TEXT), creator_id, difficulty_rating, question_tags
-- -----------------------------------------------
-- Add new columns
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS question_text TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS question_image TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS option_a TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS option_b TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS option_c TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS option_d TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS option_e TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS option_f TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS correct_answer TEXT;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS creator_id UUID;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS difficulty_rating NUMERIC;
ALTER TABLE public.practice_questions ADD COLUMN IF NOT EXISTS question_tags TEXT[];

-- Migrate data from old columns to new columns (if any rows exist)
-- prompt -> question_text
UPDATE public.practice_questions
SET question_text = prompt
WHERE question_text IS NULL AND prompt IS NOT NULL;

-- Convert difficulty from INTEGER to TEXT if the old column exists and new doesn't have data
-- Old: 1-5 scale, New: 'easy'/'medium'/'hard' text
DO $$
BEGIN
  -- Check if the old difficulty column is integer type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'practice_questions'
    AND column_name = 'difficulty' AND data_type = 'integer'
  ) THEN
    -- Rename old integer difficulty to difficulty_old
    ALTER TABLE public.practice_questions RENAME COLUMN difficulty TO difficulty_old;
    -- Add new text difficulty
    ALTER TABLE public.practice_questions ADD COLUMN difficulty TEXT DEFAULT 'medium';
    -- Migrate data
    UPDATE public.practice_questions
    SET difficulty = CASE
      WHEN difficulty_old <= 2 THEN 'easy'
      WHEN difficulty_old >= 4 THEN 'hard'
      ELSE 'medium'
    END
    WHERE difficulty_old IS NOT NULL;
    -- Drop old column
    ALTER TABLE public.practice_questions DROP COLUMN IF EXISTS difficulty_old;
  END IF;
END $$;

-- Make question_text NOT NULL with a default for safety (existing rows get migrated from prompt)
-- Only alter if there are no NULL question_text rows left
DO $$
BEGIN
  UPDATE public.practice_questions SET question_text = '' WHERE question_text IS NULL;
  ALTER TABLE public.practice_questions ALTER COLUMN question_text SET NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Make option_a and option_b NOT NULL
DO $$
BEGIN
  UPDATE public.practice_questions SET option_a = '' WHERE option_a IS NULL;
  ALTER TABLE public.practice_questions ALTER COLUMN option_a SET NOT NULL;
  UPDATE public.practice_questions SET option_b = '' WHERE option_b IS NULL;
  ALTER TABLE public.practice_questions ALTER COLUMN option_b SET NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Make correct_answer NOT NULL
DO $$
BEGIN
  UPDATE public.practice_questions SET correct_answer = '' WHERE correct_answer IS NULL;
  ALTER TABLE public.practice_questions ALTER COLUMN correct_answer SET NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Drop old columns that are no longer used (keep them if migration fails)
DO $$
BEGIN
  ALTER TABLE public.practice_questions DROP COLUMN IF EXISTS type;
  ALTER TABLE public.practice_questions DROP COLUMN IF EXISTS prompt;
  ALTER TABLE public.practice_questions DROP COLUMN IF EXISTS choices;
  ALTER TABLE public.practice_questions DROP COLUMN IF EXISTS answer;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Drop old constraint on difficulty if exists
DO $$
BEGIN
  ALTER TABLE public.practice_questions DROP CONSTRAINT IF EXISTS practice_questions_difficulty_check;
EXCEPTION WHEN others THEN NULL;
END $$;

-- -----------------------------------------------
-- 3. FIX practice_exam_sessions: transform columns
--    Old: submitted_at, total, correct, score(INTEGER)
--    New: ended_at, total_questions, correct_count, score(NUMERIC(5,2))
-- -----------------------------------------------
ALTER TABLE public.practice_exam_sessions ADD COLUMN IF NOT EXISTS ended_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.practice_exam_sessions ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE public.practice_exam_sessions ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0;
ALTER TABLE public.practice_exam_sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Migrate data from old columns
DO $$
BEGIN
  -- submitted_at -> ended_at
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'practice_exam_sessions'
    AND column_name = 'submitted_at'
  ) THEN
    UPDATE public.practice_exam_sessions SET ended_at = submitted_at WHERE ended_at IS NULL AND submitted_at IS NOT NULL;
    ALTER TABLE public.practice_exam_sessions DROP COLUMN IF EXISTS submitted_at;
  END IF;

  -- total -> total_questions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'practice_exam_sessions'
    AND column_name = 'total'
  ) THEN
    UPDATE public.practice_exam_sessions SET total_questions = total WHERE total_questions IS NULL OR total_questions = 0;
    ALTER TABLE public.practice_exam_sessions DROP COLUMN IF EXISTS total;
  END IF;

  -- correct -> correct_count
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'practice_exam_sessions'
    AND column_name = 'correct'
  ) THEN
    UPDATE public.practice_exam_sessions SET correct_count = correct WHERE correct_count IS NULL OR correct_count = 0;
    ALTER TABLE public.practice_exam_sessions DROP COLUMN IF EXISTS correct;
  END IF;
END $$;

-- Fix score column type from INTEGER to NUMERIC(5,2)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'practice_exam_sessions'
    AND column_name = 'score' AND data_type = 'integer'
  ) THEN
    ALTER TABLE public.practice_exam_sessions ALTER COLUMN score TYPE NUMERIC(5,2);
  END IF;
END $$;

-- Drop old check constraint on status if it exists
DO $$
BEGIN
  ALTER TABLE public.practice_exam_sessions DROP CONSTRAINT IF EXISTS practice_exam_sessions_status_check;
EXCEPTION WHEN others THEN NULL;
END $$;

-- -----------------------------------------------
-- 4. FIX practice_attempts: transform columns
--    Old: selected(JSONB), mode with CHECK constraint
--    New: selected(TEXT), mode(TEXT) no CHECK
-- -----------------------------------------------
DO $$
BEGIN
  -- Change selected from JSONB to TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'practice_attempts'
    AND column_name = 'selected' AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE public.practice_attempts ALTER COLUMN selected TYPE TEXT USING selected::TEXT;
  END IF;

  -- Drop old check constraint on mode
  ALTER TABLE public.practice_attempts DROP CONSTRAINT IF EXISTS practice_attempts_mode_check;
EXCEPTION WHEN others THEN NULL;
END $$;

-- -----------------------------------------------
-- 5. Drop course_id from question_sets (migration 20260125174328 didn't run)
-- -----------------------------------------------
DO $$
BEGIN
  ALTER TABLE public.question_sets DROP COLUMN IF EXISTS course_id;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Drop old index on course_id
DROP INDEX IF EXISTS idx_question_sets_course;

-- -----------------------------------------------
-- 6. Ensure updated_at trigger exists
-- -----------------------------------------------
DO $$
BEGIN
  CREATE TRIGGER update_question_sets_updated_at
  BEFORE UPDATE ON public.question_sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN others THEN NULL;
END $$;

-- -----------------------------------------------
-- 7. Re-apply RLS policies (drop & recreate to match migration 20260125174328)
-- -----------------------------------------------
-- question_sets policies
DROP POLICY IF EXISTS "Question sets are viewable by everyone" ON public.question_sets;
DROP POLICY IF EXISTS "Admins and teachers can manage question sets" ON public.question_sets;
DROP POLICY IF EXISTS "Published question sets are viewable by everyone" ON public.question_sets;
DROP POLICY IF EXISTS "Teachers can manage their own question sets" ON public.question_sets;

DO $$
BEGIN
  CREATE POLICY "Users can view their own question sets"
  ON public.question_sets FOR SELECT
  USING (creator_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Anyone can view public question sets"
  ON public.question_sets FOR SELECT
  USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can create their own question sets"
  ON public.question_sets FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their own question sets"
  ON public.question_sets FOR UPDATE
  USING (creator_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete their own question sets"
  ON public.question_sets FOR DELETE
  USING (creator_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Admins can manage all question sets"
  ON public.question_sets FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- practice_questions policies
DROP POLICY IF EXISTS "Practice questions are viewable by everyone" ON public.practice_questions;
DROP POLICY IF EXISTS "Teachers can manage practice questions" ON public.practice_questions;
DROP POLICY IF EXISTS "Questions are viewable if set is published" ON public.practice_questions;

DO $$
BEGIN
  CREATE POLICY "Users can view practice questions"
  ON public.practice_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets
      WHERE question_sets.id = practice_questions.set_id
      AND (question_sets.creator_id = auth.uid() OR question_sets.is_published = true)
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can insert practice questions"
  ON public.practice_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.question_sets
      WHERE question_sets.id = practice_questions.set_id
      AND question_sets.creator_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update practice questions"
  ON public.practice_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets
      WHERE question_sets.id = practice_questions.set_id
      AND question_sets.creator_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete practice questions"
  ON public.practice_questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets
      WHERE question_sets.id = practice_questions.set_id
      AND question_sets.creator_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Admins can manage all practice questions"
  ON public.practice_questions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

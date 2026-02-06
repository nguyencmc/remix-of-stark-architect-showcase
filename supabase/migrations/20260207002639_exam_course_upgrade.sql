-- M1: Schema updates for exams & courses roadmap
-- Adds tagging/difficulty, versioning, analytics, prerequisites, notes, proctoring events

-- 1) Question metadata
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS question_tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS difficulty_rating double precision;

ALTER TABLE public.practice_questions
  ADD COLUMN IF NOT EXISTS question_tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS difficulty_rating double precision;

-- 2) Exam versioning
CREATE TABLE IF NOT EXISTS public.exam_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  version integer NOT NULL,
  payload jsonb NOT NULL,
  published_at timestamptz,
  created_by uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (exam_id, version)
);

-- 3) Question statistics
CREATE TABLE IF NOT EXISTS public.question_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  attempts integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  avg_time_sec numeric,
  discrimination_index numeric,
  last_calculated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id)
);

-- 4) Course prerequisites & ordering
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS prerequisite_ids uuid[] DEFAULT '{}'::uuid[],
  ADD COLUMN IF NOT EXISTS learning_path_order integer;

-- 5) Course lessons metadata
ALTER TABLE public.course_lessons
  ADD COLUMN IF NOT EXISTS requires_completion boolean NOT NULL DEFAULT false;

-- Enforce allowed content_type values without breaking existing data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'course_lessons_content_type_check') THEN
    ALTER TABLE public.course_lessons
      ADD CONSTRAINT course_lessons_content_type_check
      CHECK (content_type IS NULL OR content_type IN ('video','reading','quiz','lab','assignment'));
  END IF;
END$$;

-- 6) Course notes (user-synced notes per lesson)
CREATE TABLE IF NOT EXISTS public.course_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_course_notes_user_course ON public.course_notes(user_id, course_id);

-- 7) Proctoring events log
CREATE TABLE IF NOT EXISTS public.proctoring_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.practice_exam_sessions(id) ON DELETE CASCADE,
  type text NOT NULL,
  detail jsonb,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proctoring_events_session ON public.proctoring_events(session_id);

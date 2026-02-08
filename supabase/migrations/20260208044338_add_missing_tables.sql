-- Migration: Add missing tables
-- These tables exist in the schema export but are missing from the remote database
-- Using DO blocks to handle "already exists" errors gracefully

-- 1. Table: lesson_attachments
CREATE TABLE IF NOT EXISTS public.lesson_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_id uuid,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer DEFAULT 0,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE public.lesson_attachments ADD CONSTRAINT lesson_attachments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.lesson_attachments ENABLE ROW LEVEL SECURITY;

-- 2. Table: lesson_notes
CREATE TABLE IF NOT EXISTS public.lesson_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid,
  course_id uuid,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT lesson_notes_user_id_lesson_id_key UNIQUE (user_id, lesson_id)
);

DO $$ BEGIN
  ALTER TABLE public.lesson_notes ADD CONSTRAINT lesson_notes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE public.lesson_notes ADD CONSTRAINT lesson_notes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;

-- 3. Table: podcast_bookmarks
CREATE TABLE IF NOT EXISTS public.podcast_bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  podcast_id uuid NOT NULL,
  time_seconds numeric NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE public.podcast_bookmarks ADD CONSTRAINT podcast_bookmarks_podcast_id_fkey FOREIGN KEY (podcast_id) REFERENCES public.podcasts(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.podcast_bookmarks ENABLE ROW LEVEL SECURITY;

-- 4. Table: proctoring_events
CREATE TABLE IF NOT EXISTS public.proctoring_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  type text NOT NULL,
  detail jsonb,
  captured_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE public.proctoring_events ADD CONSTRAINT proctoring_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.practice_exam_sessions(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.proctoring_events ENABLE ROW LEVEL SECURITY;

-- 5. Table: question_stats
CREATE TABLE IF NOT EXISTS public.question_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  avg_time_sec numeric,
  discrimination_index numeric,
  last_calculated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT question_stats_question_id_key UNIQUE (question_id)
);

DO $$ BEGIN
  ALTER TABLE public.question_stats ADD CONSTRAINT question_stats_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.question_stats ENABLE ROW LEVEL SECURITY;

-- 6. Table: user_course_progress
CREATE TABLE IF NOT EXISTS public.user_course_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid,
  lesson_id uuid,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  last_watched_at timestamptz DEFAULT now(),
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT user_course_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id)
);

DO $$ BEGIN
  ALTER TABLE public.user_course_progress ADD CONSTRAINT user_course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE public.user_course_progress ADD CONSTRAINT user_course_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- 7. Table: user_flashcards
CREATE TABLE IF NOT EXISTS public.user_flashcards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  hint text,
  source_type text,
  source_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE public.user_flashcards ADD CONSTRAINT user_flashcards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.flashcard_decks(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.user_flashcards ENABLE ROW LEVEL SECURITY;

-- 8. Table: user_podcast_progress
CREATE TABLE IF NOT EXISTS public.user_podcast_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  podcast_id uuid NOT NULL,
  current_time_seconds numeric NOT NULL DEFAULT 0,
  completed boolean DEFAULT false,
  last_played_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT user_podcast_progress_user_id_podcast_id_key UNIQUE (user_id, podcast_id)
);

DO $$ BEGIN
  ALTER TABLE public.user_podcast_progress ADD CONSTRAINT user_podcast_progress_podcast_id_fkey FOREIGN KEY (podcast_id) REFERENCES public.podcasts(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.user_podcast_progress ENABLE ROW LEVEL SECURITY;

-- 9. Table: user_smart_recommendations
CREATE TABLE IF NOT EXISTS public.user_smart_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  recommendations jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT user_smart_recommendations_user_id_key UNIQUE (user_id)
);

ALTER TABLE public.user_smart_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables (using DO blocks to handle existing policies)

-- lesson_attachments policies
DO $$ BEGIN
  CREATE POLICY "Anyone can view lesson attachments" ON public.lesson_attachments FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins can manage lesson attachments" ON public.lesson_attachments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- lesson_notes policies
DO $$ BEGIN
  CREATE POLICY "Users can manage their own lesson notes" ON public.lesson_notes FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users can view their own lesson notes" ON public.lesson_notes FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- podcast_bookmarks policies
DO $$ BEGIN
  CREATE POLICY "Users can manage their own podcast bookmarks" ON public.podcast_bookmarks FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- proctoring_events policies
DO $$ BEGIN
  CREATE POLICY "Admins can view proctoring events" ON public.proctoring_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'teacher'))
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "System can insert proctoring events" ON public.proctoring_events FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- question_stats policies
DO $$ BEGIN
  CREATE POLICY "Anyone can view question stats" ON public.question_stats FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins can manage question stats" ON public.question_stats FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_course_progress policies
DO $$ BEGIN
  CREATE POLICY "Users can manage their own course progress" ON public.user_course_progress FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users can view their own course progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_flashcards policies
DO $$ BEGIN
  CREATE POLICY "Users can manage flashcards in their decks" ON public.user_flashcards FOR ALL USING (
    EXISTS (SELECT 1 FROM public.flashcard_decks WHERE id = deck_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_podcast_progress policies
DO $$ BEGIN
  CREATE POLICY "Users can manage their own podcast progress" ON public.user_podcast_progress FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_smart_recommendations policies
DO $$ BEGIN
  CREATE POLICY "Users can view their own recommendations" ON public.user_smart_recommendations FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "System can manage recommendations" ON public.user_smart_recommendations FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

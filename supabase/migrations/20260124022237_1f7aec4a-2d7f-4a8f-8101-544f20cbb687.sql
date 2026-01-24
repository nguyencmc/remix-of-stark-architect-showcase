-- =============================================
-- PRACTICE SYSTEM TABLES
-- =============================================

-- Question Sets (bộ câu hỏi)
CREATE TABLE public.question_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  level TEXT DEFAULT 'beginner',
  question_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  creator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Practice Questions (câu hỏi luyện tập)
CREATE TABLE public.practice_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id UUID REFERENCES public.question_sets(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_image TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
  option_f TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  question_order INTEGER,
  creator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Practice Exam Sessions (phiên thi thử)
CREATE TABLE public.practice_exam_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  set_id UUID REFERENCES public.question_sets(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'in_progress',
  duration_sec INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  score NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Practice Attempts (lần trả lời câu hỏi)
CREATE TABLE public.practice_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID REFERENCES public.practice_questions(id) ON DELETE CASCADE NOT NULL,
  mode TEXT DEFAULT 'practice',
  exam_session_id UUID REFERENCES public.practice_exam_sessions(id) ON DELETE SET NULL,
  selected TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_sec INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_sets
CREATE POLICY "Published question sets are viewable by everyone" 
ON public.question_sets FOR SELECT 
USING (is_published = true);

CREATE POLICY "Teachers can manage their own question sets" 
ON public.question_sets FOR ALL 
USING (creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS Policies for practice_questions
CREATE POLICY "Questions are viewable if set is published" 
ON public.practice_questions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.question_sets WHERE id = set_id AND is_published = true));

CREATE POLICY "Teachers can manage questions in their sets" 
ON public.practice_questions FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS Policies for practice_exam_sessions
CREATE POLICY "Users can view their own exam sessions" 
ON public.practice_exam_sessions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own exam sessions" 
ON public.practice_exam_sessions FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own exam sessions" 
ON public.practice_exam_sessions FOR UPDATE 
USING (user_id = auth.uid());

-- RLS Policies for practice_attempts
CREATE POLICY "Users can view their own attempts" 
ON public.practice_attempts FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own attempts" 
ON public.practice_attempts FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_question_sets_course ON public.question_sets(course_id);
CREATE INDEX idx_question_sets_published ON public.question_sets(is_published);
CREATE INDEX idx_practice_questions_set ON public.practice_questions(set_id);
CREATE INDEX idx_practice_exam_sessions_user ON public.practice_exam_sessions(user_id);
CREATE INDEX idx_practice_attempts_user ON public.practice_attempts(user_id);
CREATE INDEX idx_practice_attempts_question ON public.practice_attempts(question_id);

-- Trigger for updated_at
CREATE TRIGGER update_question_sets_updated_at
BEFORE UPDATE ON public.question_sets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
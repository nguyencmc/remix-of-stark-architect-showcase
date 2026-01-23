-- =============================================
-- PART 3: EXAM SYSTEM
-- =============================================

-- Exam Categories
CREATE TABLE public.exam_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  exam_count INTEGER DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  question_count INTEGER DEFAULT 0,
  subcategory_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exam categories are viewable by everyone" ON public.exam_categories FOR SELECT USING (true);
CREATE POLICY "Teachers can create exam categories" ON public.exam_categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can update exam categories" ON public.exam_categories FOR UPDATE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete exam categories" ON public.exam_categories FOR DELETE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Exams
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.exam_categories(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  question_count INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 60,
  attempt_count INTEGER DEFAULT 0,
  pass_rate NUMERIC DEFAULT 0,
  difficulty TEXT DEFAULT 'medium',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_exams_category_id ON public.exams(category_id);
CREATE INDEX idx_exams_slug ON public.exams(slug);
CREATE INDEX idx_exams_creator_id ON public.exams(creator_id);

CREATE POLICY "Exams are viewable by everyone" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Teachers can create exams" ON public.exams FOR INSERT WITH CHECK ((has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)) AND (creator_id = auth.uid() OR creator_id IS NULL));
CREATE POLICY "Teachers can update their own exams" ON public.exams FOR UPDATE USING ((creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete their own exams" ON public.exams FOR DELETE USING ((creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Questions
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
  option_f TEXT,
  option_g TEXT,
  option_h TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  question_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_questions_exam_id ON public.questions(exam_id);

CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Teachers can create questions" ON public.questions FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can update their own questions" ON public.questions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = questions.exam_id AND (exams.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));
CREATE POLICY "Teachers can delete their own questions" ON public.questions FOR DELETE USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = questions.exam_id AND (exams.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));

-- Exam Attempts
CREATE TABLE public.exam_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create exam attempts" ON public.exam_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own attempts" ON public.exam_attempts FOR SELECT USING (true);

-- Update user stats trigger
CREATE OR REPLACE FUNCTION public.update_user_exam_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    total_exams_taken = total_exams_taken + 1,
    total_correct_answers = total_correct_answers + NEW.correct_answers,
    total_questions_answered = total_questions_answered + NEW.total_questions,
    points = points + (NEW.correct_answers * 10),
    level = GREATEST(1, FLOOR((points + (NEW.correct_answers * 10)) / 100) + 1)::integer
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_stats_on_exam_attempt AFTER INSERT ON public.exam_attempts FOR EACH ROW WHEN (NEW.user_id IS NOT NULL) EXECUTE FUNCTION public.update_user_exam_stats();

-- Course Tests
CREATE TABLE public.course_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  pass_percentage INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course tests are viewable by everyone" ON public.course_tests FOR SELECT USING (true);
CREATE POLICY "Course creator can manage tests" ON public.course_tests FOR ALL USING (EXISTS (SELECT 1 FROM course_lessons cl JOIN course_sections cs ON cs.id = cl.section_id JOIN courses c ON c.id = cs.course_id WHERE cl.id = course_tests.lesson_id AND (c.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));
CREATE TRIGGER update_course_tests_updated_at BEFORE UPDATE ON public.course_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Course Test Questions
CREATE TABLE public.course_test_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.course_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_image TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT,
  option_d TEXT,
  option_e TEXT,
  option_f TEXT,
  option_g TEXT,
  option_h TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  question_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course test questions are viewable by everyone" ON public.course_test_questions FOR SELECT USING (true);
CREATE POLICY "Course creator can manage test questions" ON public.course_test_questions FOR ALL USING (EXISTS (SELECT 1 FROM course_tests ct JOIN course_lessons cl ON cl.id = ct.lesson_id JOIN course_sections cs ON cs.id = cl.section_id JOIN courses c ON c.id = cs.course_id WHERE ct.id = course_test_questions.test_id AND (c.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));

-- Course Test Attempts
CREATE TABLE public.course_test_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_id UUID REFERENCES public.course_tests(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.course_test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own test attempts" ON public.course_test_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own test attempts" ON public.course_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own test attempts" ON public.course_test_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Course Q&A
CREATE TABLE public.course_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_questions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_course_questions_course_id ON public.course_questions(course_id);
CREATE INDEX idx_course_questions_lesson_id ON public.course_questions(lesson_id);

CREATE POLICY "Enrolled users can view questions" ON public.course_questions FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_course_enrollments WHERE user_course_enrollments.course_id = course_questions.course_id AND user_course_enrollments.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.courses WHERE courses.id = course_questions.course_id AND courses.creator_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Enrolled users can create questions" ON public.course_questions FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.user_course_enrollments WHERE user_course_enrollments.course_id = course_questions.course_id AND user_course_enrollments.user_id = auth.uid()));
CREATE POLICY "Users can update their own questions" ON public.course_questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own questions" ON public.course_questions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Instructors can update questions" ON public.course_questions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.courses WHERE courses.id = course_questions.course_id AND courses.creator_id = auth.uid()));
CREATE TRIGGER update_course_questions_updated_at BEFORE UPDATE ON public.course_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Course Answers
CREATE TABLE public.course_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.course_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_instructor_answer BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_answers ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_course_answers_question_id ON public.course_answers(question_id);

CREATE POLICY "Users can view answers" ON public.course_answers FOR SELECT USING (EXISTS (SELECT 1 FROM public.course_questions q JOIN public.user_course_enrollments e ON e.course_id = q.course_id WHERE q.id = course_answers.question_id AND e.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.course_questions q JOIN public.courses c ON c.id = q.course_id WHERE q.id = course_answers.question_id AND c.creator_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Enrolled users can create answers" ON public.course_answers FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.course_questions q JOIN public.user_course_enrollments e ON e.course_id = q.course_id WHERE q.id = course_answers.question_id AND e.user_id = auth.uid()));
CREATE POLICY "Instructors can create answers" ON public.course_answers FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.course_questions q JOIN public.courses c ON c.id = q.course_id WHERE q.id = course_answers.question_id AND c.creator_id = auth.uid()));
CREATE POLICY "Users can update their own answers" ON public.course_answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own answers" ON public.course_answers FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Instructors can update answers" ON public.course_answers FOR UPDATE USING (EXISTS (SELECT 1 FROM public.course_questions q JOIN public.courses c ON c.id = q.course_id WHERE q.id = course_answers.question_id AND c.creator_id = auth.uid()));
CREATE TRIGGER update_course_answers_updated_at BEFORE UPDATE ON public.course_answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
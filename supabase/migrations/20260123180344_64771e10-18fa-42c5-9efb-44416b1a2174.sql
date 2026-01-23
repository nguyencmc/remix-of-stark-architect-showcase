-- =============================================
-- PART 2: COURSE SYSTEM
-- =============================================

-- Course Categories
CREATE TABLE public.course_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  course_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course categories are viewable by everyone" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage course categories" ON public.course_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can create course categories" ON public.course_categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Courses
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'languages',
  subcategory TEXT,
  topic TEXT,
  category_id UUID REFERENCES public.course_categories(id),
  term_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  creator_name TEXT DEFAULT 'The Best Study',
  is_official BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 0,
  original_price NUMERIC DEFAULT 0,
  duration_hours INTEGER DEFAULT 0,
  lesson_count INTEGER DEFAULT 0,
  level TEXT DEFAULT 'beginner',
  language TEXT DEFAULT 'vi',
  rating NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  preview_video_url TEXT,
  requirements TEXT[],
  what_you_learn TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage all courses" ON public.courses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can update their own courses" ON public.courses FOR UPDATE USING (creator_id = auth.uid() AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Teachers can delete their own courses" ON public.courses FOR DELETE USING (creator_id = auth.uid() AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Course Sections
CREATE TABLE public.course_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  section_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course sections are viewable by everyone" ON public.course_sections FOR SELECT USING (true);
CREATE POLICY "Course creator can manage sections" ON public.course_sections FOR ALL USING (EXISTS (SELECT 1 FROM public.courses WHERE courses.id = course_sections.course_id AND (courses.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));

-- Course Lessons
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  lesson_order INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'document', 'test')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are viewable by everyone" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Section owner can manage lessons" ON public.course_lessons FOR ALL USING (EXISTS (SELECT 1 FROM public.course_sections cs JOIN public.courses c ON c.id = cs.course_id WHERE cs.id = course_lessons.section_id AND (c.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));

-- Course Enrollments
CREATE TABLE public.user_course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments" ON public.user_course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll themselves" ON public.user_course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollment" ON public.user_course_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Course Progress
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  watch_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_course_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Course Reviews
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.course_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.course_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.course_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.course_reviews FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_course_reviews_updated_at BEFORE UPDATE ON public.course_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Course Wishlist
CREATE TABLE public.course_wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.course_wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wishlist" ON public.course_wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own wishlist" ON public.course_wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own wishlist" ON public.course_wishlists FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_course_wishlists_user_id ON public.course_wishlists(user_id);
CREATE INDEX idx_course_wishlists_course_id ON public.course_wishlists(course_id);

-- Course Certificates
CREATE TABLE public.course_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  certificate_number VARCHAR(50) NOT NULL UNIQUE,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  final_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own certificates" ON public.course_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view certificates by certificate_number" ON public.course_certificates FOR SELECT USING (true);
CREATE POLICY "System can insert certificates" ON public.course_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  cert_num TEXT;
BEGIN
  cert_num := 'CERT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));
  RETURN cert_num;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Lesson Notes
CREATE TABLE public.lesson_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own lesson notes" ON public.lesson_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own lesson notes" ON public.lesson_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lesson notes" ON public.lesson_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lesson notes" ON public.lesson_notes FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_lesson_notes_updated_at BEFORE UPDATE ON public.lesson_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Lesson Attachments
CREATE TABLE public.lesson_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lesson_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lesson attachments are viewable by everyone" ON public.lesson_attachments FOR SELECT USING (true);
CREATE POLICY "Course creator can manage attachments" ON public.lesson_attachments FOR ALL USING (EXISTS (SELECT 1 FROM course_lessons cl JOIN course_sections cs ON cs.id = cl.section_id JOIN courses c ON c.id = cs.course_id WHERE cl.id = lesson_attachments.lesson_id AND (c.creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));
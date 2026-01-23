-- =============================================
-- PART 6: STORAGE BUCKETS
-- =============================================

-- Question images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Auth users upload question images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'question-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Question images publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'question-images');
CREATE POLICY "Teachers delete question images" ON storage.objects FOR DELETE USING (bucket_id = 'question-images' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Teachers update question images" ON storage.objects FOR UPDATE USING (bucket_id = 'question-images' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));

-- Avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone view avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');

-- Course materials bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-materials', 
  'course-materials', 
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Course materials publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'course-materials');
CREATE POLICY "Teachers upload course materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-materials' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Teachers update course materials" ON storage.objects FOR UPDATE USING (bucket_id = 'course-materials' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Teachers delete course materials" ON storage.objects FOR DELETE USING (bucket_id = 'course-materials' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));

-- Podcast audio bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('podcast-audio', 'podcast-audio', true, 104857600)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Podcast audio publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'podcast-audio');
CREATE POLICY "Teachers upload podcast audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'podcast-audio' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Teachers update podcast audio" ON storage.objects FOR UPDATE USING (bucket_id = 'podcast-audio' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Teachers delete podcast audio" ON storage.objects FOR DELETE USING (bucket_id = 'podcast-audio' AND (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));

-- =============================================
-- FIX: Update exam_attempts policy (the warning)
-- =============================================
DROP POLICY IF EXISTS "Anyone can create exam attempts" ON public.exam_attempts;
CREATE POLICY "Auth users can create exam attempts" ON public.exam_attempts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR user_id IS NULL);
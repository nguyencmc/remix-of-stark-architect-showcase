-- Table to store exam proctoring data
CREATE TABLE public.exam_proctoring_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'tab_switch', 'window_blur', 'face_not_detected', 'multiple_faces', 'snapshot', 'session_start', 'session_end'
  snapshot_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_proctoring_logs_exam_attempt ON public.exam_proctoring_logs(exam_attempt_id);
CREATE INDEX idx_proctoring_logs_user ON public.exam_proctoring_logs(user_id);
CREATE INDEX idx_proctoring_logs_created ON public.exam_proctoring_logs(created_at);

-- Enable RLS
ALTER TABLE public.exam_proctoring_logs ENABLE ROW LEVEL SECURITY;

-- Users can insert their own proctoring logs
CREATE POLICY "Users can insert own proctoring logs"
ON public.exam_proctoring_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own proctoring logs
CREATE POLICY "Users can view own proctoring logs"
ON public.exam_proctoring_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Admins and teachers can view all proctoring logs
CREATE POLICY "Admins can view all proctoring logs"
ON public.exam_proctoring_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Exam proctoring bucket for snapshots
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('exam-proctoring', 'exam-proctoring', false, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Users can upload their own proctoring snapshots
CREATE POLICY "Users upload own proctoring snapshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'exam-proctoring' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own proctoring snapshots
CREATE POLICY "Users view own proctoring snapshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'exam-proctoring' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all proctoring snapshots
CREATE POLICY "Admins view all proctoring snapshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'exam-proctoring' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role)));

-- Users can delete their own proctoring snapshots
CREATE POLICY "Users delete own proctoring snapshots" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'exam-proctoring' AND auth.uid()::text = (storage.foldername(name))[1]);
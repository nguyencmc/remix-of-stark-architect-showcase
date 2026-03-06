-- Add proctoring toggle to exams table
ALTER TABLE public.exams
  ADD COLUMN IF NOT EXISTS is_proctored BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.exams.is_proctored IS
  'Bật/tắt chế độ giám sát webcam khi làm bài';

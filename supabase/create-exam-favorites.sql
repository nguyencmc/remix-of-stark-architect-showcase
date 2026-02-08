-- Create exam_favorites table for storing user's favorite exams
-- Run this migration on your Supabase database

CREATE TABLE IF NOT EXISTS exam_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, exam_id)
);

-- Enable RLS
ALTER TABLE exam_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON exam_favorites
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON exam_favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON exam_favorites
FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_exam_favorites_user_id ON exam_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_favorites_exam_id ON exam_favorites(exam_id);

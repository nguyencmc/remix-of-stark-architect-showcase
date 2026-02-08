-- Add thumbnail_url column to exams table
-- Run this migration on your Supabase database

ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN exams.thumbnail_url IS 'URL to the exam thumbnail image stored in Supabase Storage';

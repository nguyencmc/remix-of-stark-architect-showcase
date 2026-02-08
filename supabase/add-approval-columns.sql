-- =====================================================
-- Add missing columns to articles table
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add approved_at column if not exists
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Add approved_by column if not exists  
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Add rejection_reason column if not exists
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add published_at column if not exists
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

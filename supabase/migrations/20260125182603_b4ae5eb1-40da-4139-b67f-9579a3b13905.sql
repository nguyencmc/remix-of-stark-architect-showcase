-- Add slug and duration_minutes columns to question_sets table for exam compatibility
ALTER TABLE public.question_sets 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;

-- Create unique index on slug (nullable unique)
CREATE UNIQUE INDEX IF NOT EXISTS question_sets_slug_unique 
ON public.question_sets (slug) 
WHERE slug IS NOT NULL;
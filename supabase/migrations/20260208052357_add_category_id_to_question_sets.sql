-- Add category_id column to question_sets table
-- This column was present in the old project but missing from migrations
ALTER TABLE public.question_sets
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.exam_categories(id) ON DELETE SET NULL;

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_question_sets_category_id ON public.question_sets(category_id);

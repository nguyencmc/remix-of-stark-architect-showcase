-- Add category_id to question_sets table (reusing exam_categories)
ALTER TABLE public.question_sets
ADD COLUMN category_id UUID REFERENCES public.exam_categories(id) ON DELETE SET NULL;
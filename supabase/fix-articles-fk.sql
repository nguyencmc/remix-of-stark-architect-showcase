-- =====================================================
-- FIX: Foreign Key relationship for articles -> profiles
-- Run this in Supabase SQL Editor
-- =====================================================

-- The problem: articles.author_id FK references profiles.user_id,
-- but PostgREST expects the query to work via the FK relationship.
-- We need to ensure the FK is correctly pointing to profiles.user_id

-- Step 1: Drop existing FK if exists
ALTER TABLE public.articles 
DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

-- Step 2: Recreate FK with correct reference to profiles.user_id
ALTER TABLE public.articles 
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Step 3: Verify the FK exists
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'articles' AND tc.constraint_type = 'FOREIGN KEY';

-- Step 4: Test the query that frontend uses
SELECT 
  a.id, a.title, a.status,
  p.full_name as author_name
FROM public.articles a
LEFT JOIN public.profiles p ON a.author_id = p.user_id
WHERE a.status = 'approved'
LIMIT 5;

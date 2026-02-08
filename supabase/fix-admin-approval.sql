-- =====================================================
-- FIX: Allow admin/moderator to update any article (for approval)
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing update policy that only allows own articles
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;

-- Create new update policy: own articles OR admin/moderator
CREATE POLICY "Users can update articles" ON public.articles
  FOR UPDATE USING (
    auth.uid() = author_id 
    OR public.is_admin_or_moderator()
  );

-- Also allow admin/moderator to read ALL articles (including pending)
DROP POLICY IF EXISTS "Admin can read all articles" ON public.articles;
CREATE POLICY "Admin can read all articles" ON public.articles
  FOR SELECT USING (
    status = 'approved'
    OR auth.uid() = author_id
    OR public.is_admin_or_moderator()
  );

-- Verify policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'articles';

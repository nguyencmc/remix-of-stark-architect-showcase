-- =====================================================
-- FIX: Admin Article Approval/Rejection
-- Run this ONCE in Supabase SQL Editor
-- =====================================================

-- Step 1: Create helper function
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 2: Drop conflicting policies
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update articles" ON public.articles;
DROP POLICY IF EXISTS "update_own" ON public.articles;
DROP POLICY IF EXISTS "update_admin" ON public.articles;

-- Step 3: Create unified update policy
CREATE POLICY "update_articles_policy" ON public.articles
  FOR UPDATE USING (
    auth.uid() = author_id 
    OR public.is_admin_or_moderator()
  );

-- Step 4: Ensure admin can SELECT all articles
DROP POLICY IF EXISTS "Admin can read all articles" ON public.articles;
DROP POLICY IF EXISTS "select_admin" ON public.articles;

CREATE POLICY "select_all_for_admin" ON public.articles
  FOR SELECT USING (
    status = 'approved'
    OR auth.uid() = author_id
    OR public.is_admin_or_moderator()
  );

-- Step 5: Verify your user has admin role
-- Replace 'your-email@example.com' with your actual email
/*
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
*/

-- Step 6: Verification queries
SELECT 'Policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'articles';

SELECT 'Admin Users:' as info;
SELECT u.email, ur.role 
FROM auth.users u 
JOIN public.user_roles ur ON u.id = ur.user_id 
WHERE ur.role IN ('admin', 'moderator');

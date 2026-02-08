-- =====================================================
-- COMPLETE FIX: Admin Role + RLS Policies for Articles
-- Run this in Supabase SQL Editor
-- =====================================================

-- ===== STEP 1: Grant admin role to user =====
-- Replace with your admin user's email
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'nguyenvnu1.uet@gmail.com';
  
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'User not found. Check the email address.';
    RETURN;
  END IF;
  
  -- Insert admin role (skip if exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '✅ Admin role granted to user: %', admin_user_id;
END $$;

-- ===== STEP 2: Create helper function to check admin/moderator =====
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

-- ===== STEP 3: Enable RLS on articles =====
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ===== STEP 4: Drop ALL existing policies on articles =====
DO $$
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'articles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.articles', pol.policyname);
  END LOOP;
END $$;

-- ===== STEP 5: Create new RLS policies =====

-- SELECT: Anyone can read approved articles
CREATE POLICY "select_approved" ON public.articles
  FOR SELECT USING (status = 'approved');

-- SELECT: Users can read their own articles (any status)
CREATE POLICY "select_own" ON public.articles
  FOR SELECT USING (auth.uid() = author_id);

-- SELECT: Admin/Moderator can read ALL articles (for moderation)
CREATE POLICY "select_admin" ON public.articles
  FOR SELECT USING (public.is_admin_or_moderator());

-- INSERT: Authenticated users can create articles
CREATE POLICY "insert_own" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- UPDATE: Users can update their own articles
CREATE POLICY "update_own" ON public.articles
  FOR UPDATE USING (auth.uid() = author_id);

-- UPDATE: Admin/Moderator can update any article (for approval)
CREATE POLICY "update_admin" ON public.articles
  FOR UPDATE USING (public.is_admin_or_moderator());

-- DELETE: Users can delete their own draft/rejected articles
CREATE POLICY "delete_own" ON public.articles
  FOR DELETE USING (
    auth.uid() = author_id 
    AND status IN ('draft', 'rejected')
  );

-- DELETE: Admin can delete any article
CREATE POLICY "delete_admin" ON public.articles
  FOR DELETE USING (public.is_admin_or_moderator());

-- ===== STEP 6: Verify user_roles =====
SELECT 
  u.email,
  ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.email;

-- ===== STEP 7: Verify articles RLS policies =====
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'articles' AND schemaname = 'public';

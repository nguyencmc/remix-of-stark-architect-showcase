-- =====================================================
-- FIX SCRIPT: Articles Feature Complete Setup
-- Run this in Supabase SQL Editor
-- =====================================================

-- ===== STEP 1: Create trigger to auto-create profiles =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== STEP 2: Create profiles for existing users =====
INSERT INTO public.profiles (id, user_id, email, full_name, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  NOW(),
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- ===== STEP 3: Ensure RLS is properly configured for articles =====
-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Anyone can read approved articles" ON public.articles;
DROP POLICY IF EXISTS "Users can read their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can create articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can do anything" ON public.articles;

-- Create RLS policies
-- 1. Anyone can read approved articles
CREATE POLICY "Anyone can read approved articles" ON public.articles
  FOR SELECT USING (status = 'approved');

-- 2. Users can read their own articles (any status)
CREATE POLICY "Users can read their own articles" ON public.articles
  FOR SELECT USING (auth.uid() = author_id);

-- 3. Authenticated users can create articles 
CREATE POLICY "Users can create articles" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 4. Users can update their own articles
CREATE POLICY "Users can update their own articles" ON public.articles
  FOR UPDATE USING (auth.uid() = author_id);

-- 5. Users can delete their own draft articles
CREATE POLICY "Users can delete their own articles" ON public.articles
  FOR DELETE USING (auth.uid() = author_id AND status IN ('draft', 'rejected'));

-- ===== STEP 4: RLS for article_categories (read-only for all) =====
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read categories" ON public.article_categories;
CREATE POLICY "Anyone can read categories" ON public.article_categories
  FOR SELECT USING (true);

-- ===== STEP 5: Seed article categories (if not exists) =====
INSERT INTO public.article_categories (name, slug, description, display_order, is_featured) VALUES
  ('Linux', 'linux', 'Bài viết về hệ điều hành Linux', 1, true),
  ('DevOps', 'devops', 'CI/CD, Automation, Infrastructure', 2, true),
  ('Docker', 'docker', 'Container và Docker', 3, true),
  ('Kubernetes', 'kubernetes', 'Orchestration với K8s', 4, false),
  ('Security', 'security', 'Bảo mật hệ thống', 5, false),
  ('Cloud', 'cloud', 'AWS, GCP, Azure', 6, false),
  ('Programming', 'programming', 'Lập trình và phát triển', 7, false),
  ('Database', 'database', 'PostgreSQL, MySQL, MongoDB', 8, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured;

-- ===== STEP 6: Seed sample articles =====
DO $$
DECLARE
  author_uuid UUID;
  cat_linux UUID;
  cat_devops UUID;
  cat_docker UUID;
  cat_kubernetes UUID;
  cat_security UUID;
BEGIN
  -- Get author
  SELECT user_id INTO author_uuid FROM public.profiles LIMIT 1;
  
  IF author_uuid IS NULL THEN
    RAISE EXCEPTION 'No profiles found. Please ensure users exist.';
  END IF;

  -- Get category IDs
  SELECT id INTO cat_linux FROM public.article_categories WHERE slug = 'linux';
  SELECT id INTO cat_devops FROM public.article_categories WHERE slug = 'devops';
  SELECT id INTO cat_docker FROM public.article_categories WHERE slug = 'docker';
  SELECT id INTO cat_kubernetes FROM public.article_categories WHERE slug = 'kubernetes';
  SELECT id INTO cat_security FROM public.article_categories WHERE slug = 'security';

  -- Clear existing articles (optional - remove if you want to keep existing)
  -- DELETE FROM public.articles;

  -- Insert sample articles
  INSERT INTO public.articles (title, slug, content, excerpt, thumbnail_url, category_id, author_id, status, view_count, is_featured, tags, published_at, created_at, updated_at)
  VALUES
    (
      'TuxMate: Trình quản lý app tập trung cho Linux',
      'tuxmate-quan-ly-app-linux-' || floor(extract(epoch from now()))::text,
      '<h2>Giới thiệu TuxMate</h2><p>TuxMate là công cụ quản lý ứng dụng tập trung cho Linux, hỗ trợ APT, Flatpak, Snap và AppImage.</p><h2>Cài đặt</h2><pre><code>curl -fsSL https://tuxmate.io/install.sh | bash</code></pre>',
      'TuxMate - công cụ quản lý ứng dụng cho Linux',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
      cat_linux, author_uuid, 'approved', 245, true,
      ARRAY['Linux', 'Tools'], NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()
    ),
    (
      'CI/CD Pipeline với GitHub Actions',
      'cicd-pipeline-github-actions-' || floor(extract(epoch from now()))::text,
      '<h2>GitHub Actions CI/CD</h2><p>Xây dựng pipeline tự động với GitHub Actions.</p><pre><code class="yaml">name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4</code></pre>',
      'Hướng dẫn xây dựng CI/CD với GitHub Actions',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
      cat_devops, author_uuid, 'approved', 189, true,
      ARRAY['DevOps', 'CI/CD'], NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW()
    ),
    (
      'Docker Multi-stage Build',
      'docker-multi-stage-build-' || floor(extract(epoch from now()))::text,
      '<h2>Multi-stage Build</h2><p>Giảm image size từ 800MB xuống 10MB.</p><pre><code class="dockerfile">FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci</code></pre>',
      'Tối ưu Docker image với multi-stage build',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
      cat_docker, author_uuid, 'approved', 156, false,
      ARRAY['Docker', 'Container'], NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW()
    ),
    (
      'Kubernetes HPA Autoscaling',
      'kubernetes-hpa-autoscaling-' || floor(extract(epoch from now()))::text,
      '<h2>Horizontal Pod Autoscaler</h2><p>Tự động scale ứng dụng theo CPU/Memory.</p><pre><code class="yaml">apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: myapp</code></pre>',
      'Hướng dẫn Kubernetes HPA',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
      cat_kubernetes, author_uuid, 'approved', 123, false,
      ARRAY['Kubernetes', 'Autoscaling'], NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW()
    ),
    (
      'Bảo mật SSH Server Best Practices',
      'bao-mat-ssh-best-practices-' || floor(extract(epoch from now()))::text,
      '<h2>SSH Security</h2><p>10 best practices bảo mật SSH.</p><pre><code class="bash">PermitRootLogin no\nPasswordAuthentication no\nPort 2222</code></pre>',
      'Best practices bảo mật SSH Server',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      cat_security, author_uuid, 'approved', 312, true,
      ARRAY['Security', 'SSH'], NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW()
    );

  RAISE NOTICE '✅ Created 5 sample articles successfully!';
END $$;

-- ===== STEP 7: Update category article counts =====
UPDATE public.article_categories ac
SET article_count = (
  SELECT COUNT(*) FROM public.articles a 
  WHERE a.category_id = ac.id AND a.status = 'approved'
);

-- ===== VERIFICATION =====
SELECT 'Profiles:' as check, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Article Categories:', COUNT(*) FROM public.article_categories
UNION ALL
SELECT 'Articles (approved):', COUNT(*) FROM public.articles WHERE status = 'approved';

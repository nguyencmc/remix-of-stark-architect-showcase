-- Migration: Create article_categories table
-- Run this in Supabase SQL Editor

-- Create article_categories table
CREATE TABLE IF NOT EXISTS public.article_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  icon_url text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  article_count integer DEFAULT 0,
  creator_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT article_categories_slug_key UNIQUE (slug)
);

-- Enable RLS
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read
CREATE POLICY "Anyone can view article categories" ON public.article_categories
  FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage article categories" ON public.article_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT ON public.article_categories TO anon, authenticated;
GRANT ALL ON public.article_categories TO authenticated;

-- Create articles table if not exists
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  content text,
  excerpt text,
  thumbnail_url text,
  category_id uuid REFERENCES public.article_categories(id),
  author_id uuid NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  view_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  tags text[],
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT articles_slug_key UNIQUE (slug)
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles
CREATE POLICY "Anyone can view approved articles" ON public.articles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authors can view own articles" ON public.articles
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authors can create articles" ON public.articles
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own articles" ON public.articles
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all articles" ON public.articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Grant permissions on articles
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO authenticated;

-- Verify
SELECT 'article_categories table created' as status;

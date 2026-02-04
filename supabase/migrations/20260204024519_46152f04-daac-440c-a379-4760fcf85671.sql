
-- Add foreign key relationships for articles to profiles
ALTER TABLE public.articles
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.article_comments
ADD CONSTRAINT article_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

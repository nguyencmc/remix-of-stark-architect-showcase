-- =============================================
-- PART 4: FLASHCARDS, PODCASTS, BOOKS
-- =============================================

-- Legacy Flashcard Sets (for admin)
CREATE TABLE public.flashcard_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  creator_id UUID,
  card_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public or own sets" ON public.flashcard_sets FOR SELECT USING ((is_public = true) OR (auth.uid() = creator_id));
CREATE POLICY "Users can create flashcard sets" ON public.flashcard_sets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own sets" ON public.flashcard_sets FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete their own sets" ON public.flashcard_sets FOR DELETE USING (auth.uid() = creator_id);

-- Legacy Flashcards
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id UUID REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  card_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Flashcards are viewable by everyone" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create flashcards" ON public.flashcards FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers can update flashcards" ON public.flashcards FOR UPDATE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete flashcards" ON public.flashcards FOR DELETE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- User Flashcard Progress (legacy)
CREATE TABLE public.user_flashcard_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE,
  is_remembered BOOLEAN DEFAULT false,
  last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);

ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON public.user_flashcard_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_flashcard_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_flashcard_progress FOR UPDATE USING (auth.uid() = user_id);

-- User Flashcard Decks (SRS)
CREATE TABLE public.flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own decks" ON public.flashcard_decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own decks" ON public.flashcard_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own decks" ON public.flashcard_decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own decks" ON public.flashcard_decks FOR DELETE USING (auth.uid() = user_id);

-- User Flashcards (SRS)
CREATE TABLE public.user_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  hint TEXT,
  source_type TEXT,
  source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_flashcards ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_flashcards_deck ON public.user_flashcards(deck_id);
CREATE POLICY "Users can view cards in their decks" ON public.user_flashcards FOR SELECT USING (EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = user_flashcards.deck_id AND flashcard_decks.user_id = auth.uid()));
CREATE POLICY "Users can create cards in their decks" ON public.user_flashcards FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = user_flashcards.deck_id AND flashcard_decks.user_id = auth.uid()));
CREATE POLICY "Users can update cards in their decks" ON public.user_flashcards FOR UPDATE USING (EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = user_flashcards.deck_id AND flashcard_decks.user_id = auth.uid()));
CREATE POLICY "Users can delete cards in their decks" ON public.user_flashcards FOR DELETE USING (EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = user_flashcards.deck_id AND flashcard_decks.user_id = auth.uid()));

-- Flashcard Reviews (SRS SM-2)
CREATE TABLE public.flashcard_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  flashcard_id UUID NOT NULL REFERENCES public.user_flashcards(id) ON DELETE CASCADE,
  due_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease NUMERIC NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  last_grade INTEGER,
  reviewed_at TIMESTAMPTZ,
  UNIQUE(user_id, flashcard_id)
);

ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_flashcard_reviews_due ON public.flashcard_reviews(user_id, due_at);
CREATE POLICY "Users can view their own reviews" ON public.flashcard_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reviews" ON public.flashcard_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.flashcard_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.flashcard_reviews FOR DELETE USING (auth.uid() = user_id);

-- Podcast Categories
CREATE TABLE public.podcast_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  podcast_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.podcast_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Podcast categories are viewable by everyone" ON public.podcast_categories FOR SELECT USING (true);
CREATE POLICY "Teachers can create podcast categories" ON public.podcast_categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can update podcast categories" ON public.podcast_categories FOR UPDATE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete podcast categories" ON public.podcast_categories FOR DELETE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Podcasts
CREATE TABLE public.podcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.podcast_categories(id),
  creator_id UUID REFERENCES auth.users(id),
  thumbnail_url TEXT,
  audio_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  episode_number INTEGER DEFAULT 1,
  host_name TEXT DEFAULT 'The Best Study',
  listen_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  difficulty TEXT DEFAULT 'intermediate',
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_podcasts_creator_id ON public.podcasts(creator_id);
CREATE POLICY "Podcasts are viewable by everyone" ON public.podcasts FOR SELECT USING (true);
CREATE POLICY "Teachers can create podcasts" ON public.podcasts FOR INSERT WITH CHECK ((has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)) AND (creator_id = auth.uid() OR creator_id IS NULL));
CREATE POLICY "Teachers can update their own podcasts" ON public.podcasts FOR UPDATE USING ((creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete their own podcasts" ON public.podcasts FOR DELETE USING ((creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));

-- Podcast Progress
CREATE TABLE public.user_podcast_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  podcast_id UUID NOT NULL REFERENCES public.podcasts(id) ON DELETE CASCADE,
  current_time_seconds NUMERIC NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, podcast_id)
);

ALTER TABLE public.user_podcast_progress ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_podcast_progress_user ON public.user_podcast_progress(user_id);
CREATE INDEX idx_user_podcast_progress_podcast ON public.user_podcast_progress(podcast_id);
CREATE POLICY "Users can view their own podcast progress" ON public.user_podcast_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own podcast progress" ON public.user_podcast_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own podcast progress" ON public.user_podcast_progress FOR UPDATE USING (auth.uid() = user_id);

-- Podcast Bookmarks
CREATE TABLE public.podcast_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  podcast_id UUID NOT NULL REFERENCES public.podcasts(id) ON DELETE CASCADE,
  time_seconds NUMERIC NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.podcast_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_podcast_bookmarks_user_podcast ON public.podcast_bookmarks(user_id, podcast_id);
CREATE POLICY "Users can view their own bookmarks" ON public.podcast_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookmarks" ON public.podcast_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.podcast_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Book Categories
CREATE TABLE public.book_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  book_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Book categories are viewable by everyone" ON public.book_categories FOR SELECT USING (true);
CREATE POLICY "Teachers can create book categories" ON public.book_categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can update book categories" ON public.book_categories FOR UPDATE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete book categories" ON public.book_categories FOR DELETE USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Books
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  author_name TEXT DEFAULT 'The Best Study',
  cover_url TEXT,
  category_id UUID REFERENCES public.book_categories(id),
  creator_id UUID REFERENCES auth.users(id),
  page_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  difficulty TEXT DEFAULT 'intermediate',
  is_featured BOOLEAN DEFAULT false,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_books_creator_id ON public.books(creator_id);
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Teachers can create books" ON public.books FOR INSERT WITH CHECK ((has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)) AND (creator_id = auth.uid() OR creator_id IS NULL));
CREATE POLICY "Teachers can update their own books" ON public.books FOR UPDATE USING ((creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can delete their own books" ON public.books FOR DELETE USING ((creator_id = auth.uid() AND has_role(auth.uid(), 'teacher'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Book Chapters
CREATE TABLE public.book_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  chapter_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are viewable by everyone" ON public.book_chapters FOR SELECT USING (true);
CREATE POLICY "Teachers can manage chapters" ON public.book_chapters FOR ALL USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- User Book Progress
CREATE TABLE public.user_book_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  current_position INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

ALTER TABLE public.user_book_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reading progress" ON public.user_book_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reading progress" ON public.user_book_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reading progress" ON public.user_book_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reading progress" ON public.user_book_progress FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON public.user_book_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Book Bookmarks
CREATE TABLE public.book_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own book bookmarks" ON public.book_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own book bookmarks" ON public.book_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own book bookmarks" ON public.book_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Book Highlights
CREATE TABLE public.book_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  start_position INTEGER NOT NULL,
  end_position INTEGER NOT NULL,
  highlighted_text TEXT NOT NULL,
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own highlights" ON public.book_highlights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own highlights" ON public.book_highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own highlights" ON public.book_highlights FOR DELETE USING (auth.uid() = user_id);

-- Book Notes
CREATE TABLE public.book_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.book_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own book notes" ON public.book_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own book notes" ON public.book_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own book notes" ON public.book_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own book notes" ON public.book_notes FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_book_notes_updated_at BEFORE UPDATE ON public.book_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
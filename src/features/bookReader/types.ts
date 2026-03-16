export interface Book {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  author_name: string | null;
  page_count: number | null;
}

export interface Chapter {
  id: string;
  title: string;
  position: number;
  chapter_order: number;
}

export interface BookmarkType {
  id: string;
  position: number;
  title: string | null;
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  current_position: number;
  total_time_seconds: number;
  is_completed: boolean;
}

export const PAGE_BREAK_REGEX = /(?:^|\n)(?:---|<!--\s*page\s*-->)\s*(?:\n|$)/gi;

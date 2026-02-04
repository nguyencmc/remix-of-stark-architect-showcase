export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
  is_featured: boolean;
  article_count: number;
  creator_id: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  author_id: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  approved_by: string | null;
  approved_at: string | null;
  view_count: number;
  comment_count: number;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined fields
  author?: {
    user_id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  category?: ArticleCategory | null;
}

export interface ArticleComment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: {
    user_id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  replies?: ArticleComment[];
}

export type ArticleStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface CreateArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  thumbnail_url?: string;
  category_id?: string;
  tags?: string[];
  status?: ArticleStatus;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  published_at?: string;
}

/**
 * Exam-related type definitions
 */

export interface ExamCategory {
    id: string;
    name: string;
    slug: string;
}

export interface CreatorProfile {
    user_id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
}

export interface Exam {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    question_count: number | null;
    attempt_count: number | null;
    category_id: string | null;
    difficulty: string | null;
    duration_minutes: number | null;
    thumbnail_url?: string | null;
    category?: ExamCategory;
    source: 'exam' | 'question_set';
    creator_name?: string | null;
    creator_avatar?: string | null;
    creator_id?: string | null;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type DurationFilter = 'short' | 'medium' | 'long';
export type SortOption = 'recent' | 'popular' | 'name' | 'questions';
export type ViewMode = 'grid' | 'list';

export const ITEMS_PER_PAGE = 12;

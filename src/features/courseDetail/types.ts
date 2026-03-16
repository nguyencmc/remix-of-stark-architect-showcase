export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  subcategory: string | null;
  topic: string | null;
  term_count: number | null;
  view_count: number | null;
  creator_id: string | null;
  creator_name: string | null;
  is_official: boolean | null;
  is_featured: boolean | null;
  price: number | null;
  original_price: number | null;
  duration_hours: number | null;
  level: string | null;
  language: string | null;
  rating: number | null;
  rating_count: number | null;
  student_count: number | null;
  lesson_count: number | null;
  requirements: string[] | null;
  what_you_learn: string[] | null;
  preview_video_url: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  duration_minutes: number | null;
  is_preview: boolean | null;
  content_type: string | null;
  video_url: string | null;
}

export interface Section {
  id: string;
  title: string;
  section_order: number | null;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string;
  creator_id: string | null;
  creator_name: string | null;
  price: number | null;
  student_count: number | null;
  rating: number | null;
  rating_count: number | null;
  lesson_count: number | null;
  duration_hours: number | null;
  level: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  created_at: string;
  image_url: string | null;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

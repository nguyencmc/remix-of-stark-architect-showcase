export interface EnrolledCourse {
  id: string;
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
  last_activity?: string;
  completed_lessons?: number;
  course: {
    id: string;
    title: string;
    slug: string | null;
    image_url: string | null;
    creator_name: string | null;
    lesson_count: number | null;
    duration_hours: number | null;
    level: string | null;
  };
}

export interface WishlistCourse {
  id: string;
  course_id: string;
  course: {
    id: string;
    title: string;
    image_url: string | null;
    creator_name: string | null;
    price: number | null;
  };
}

export interface Certificate {
  id: string;
  certificate_number: string;
  completion_date: string;
  final_score: number | null;
  issued_at: string;
  course_id: string;
  course: {
    id: string;
    title: string;
    image_url: string | null;
    creator_name: string | null;
  };
}

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

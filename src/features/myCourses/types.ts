export interface EnrolledCourse {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  course?: {
    id: string;
    title: string;
    slug: string;
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
  created_at: string;
  course?: {
    id: string;
    title: string;
    slug: string;
    image_url: string | null;
    creator_name: string | null;
    rating: number | null;
    student_count: number | null;
  };
}

export const getLevelLabel = (level: string | null) => {
  switch (level) {
    case "beginner":
      return "Cơ bản";
    case "intermediate":
      return "Trung cấp";
    case "advanced":
      return "Nâng cao";
    default:
      return level || "Cơ bản";
  }
};

export const getLevelColor = (level: string | null) => {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const getProgressColor = (progress: number) => {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 50) return "bg-primary";
  return "bg-yellow-500";
};

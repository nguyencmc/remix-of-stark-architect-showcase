export interface CourseQAProps {
  courseId: string;
  lessonId: string;
  instructorId?: string | null;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  user_id: string;
  is_answered: boolean;
  created_at: string;
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  answers_count: number;
}

export interface Answer {
  id: string;
  content: string;
  user_id: string;
  is_instructor_answer: boolean;
  is_accepted: boolean;
  created_at: string;
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

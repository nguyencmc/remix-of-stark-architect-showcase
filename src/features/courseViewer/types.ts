export interface Course {
  id: string;
  title: string;
  description: string | null;
  creator_name: string | null;
  creator_id: string | null;
  image_url: string | null;
}

export interface LessonAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

export interface Section {
  id: string;
  title: string;
  section_order: number | null;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  video_url: string | null;
  lesson_order: number | null;
  is_preview: boolean | null;
  content_type: string | null;
  attachments?: LessonAttachment[];
}

export interface _CourseTest {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  pass_percentage: number;
  max_attempts: number;
  is_required: boolean;
}

export interface _TestQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  explanation: string | null;
  question_order: number;
}

export interface LessonProgress {
  lesson_id: string;
  is_completed: boolean;
  watch_time_seconds: number;
}

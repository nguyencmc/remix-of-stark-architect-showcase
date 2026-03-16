export interface LessonAttachment {
  id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  display_order: number;
}

export interface CourseLesson {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  lesson_order: number;
  is_preview: boolean;
  content_type: 'video' | 'document' | 'test';
  attachments?: LessonAttachment[];
}

export interface LessonEditorProps {
  lesson: CourseLesson;
  sectionIndex: number;
  lessonIndex: number;
  onUpdate: (data: Partial<CourseLesson>) => void;
  onRemove: () => void;
}

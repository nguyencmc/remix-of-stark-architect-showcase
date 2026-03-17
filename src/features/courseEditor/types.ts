import type { CourseLesson } from '@/components/admin/course/lessonEditor';

export type { CourseLesson };

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CourseSection {
  id?: string;
  title: string;
  description: string;
  section_order: number;
  lessons: CourseLesson[];
}

export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  category_id: string;
  price: number;
  original_price: number;
  level: string;
  language: string;
  image_url: string;
  preview_video_url: string;
  requirements: string[];
  what_you_learn: string[];
  is_published: boolean;
  is_featured: boolean;
}

export const DEFAULT_FORM_DATA: CourseFormData = {
  title: '',
  slug: '',
  description: '',
  category_id: '',
  price: 0,
  original_price: 0,
  level: 'beginner',
  language: 'vi',
  image_url: '',
  preview_video_url: '',
  requirements: [''],
  what_you_learn: [''],
  is_published: false,
  is_featured: false,
};

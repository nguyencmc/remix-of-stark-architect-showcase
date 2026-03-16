import type { PracticeQuestion } from '@/components/admin/practice/PracticeQuestionEditor';

export interface Category {
  id: string;
  name: string;
}

export interface QuestionSetFormProps {
  title: string;
  description: string;
  level: string;
  tags: string[];
  tagInput: string;
  isPublished: boolean;
  categoryId: string | null;
  categories: Category[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onIsPublishedChange: (value: boolean) => void;
  onCategoryIdChange: (value: string | null) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export type { PracticeQuestion };

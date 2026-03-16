import { type Question } from '@/components/admin/exam/QuestionEditor';

export type { Question };

export interface ExamCategory {
  id: string;
  name: string;
}

export interface ExamStep {
  id: number;
  title: string;
  description: string;
}

export const EXAM_STEPS: ExamStep[] = [
  { id: 1, title: 'Thông tin', description: 'Nhập thông tin đề thi' },
  { id: 2, title: 'Tạo câu hỏi', description: 'Thêm câu hỏi vào đề' },
  { id: 3, title: 'Xem lại', description: 'Kiểm tra và lưu' },
];

export interface ExamEditorState {
  currentStep: number;
  categories: ExamCategory[];
  loading: boolean;
  saving: boolean;
  isEditing: boolean;
  hasAccess: boolean;
  roleLoading: boolean;

  // Exam fields
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  difficulty: string;
  durationMinutes: number;
  thumbnailUrl: string;

  // Questions
  questions: Question[];
}

export interface ExamEditorActions {
  setCurrentStep: (step: number) => void;
  setTitle: (title: string) => void;
  setSlug: (slug: string) => void;
  setDescription: (description: string) => void;
  setCategoryId: (categoryId: string) => void;
  setDifficulty: (difficulty: string) => void;
  setDurationMinutes: (duration: number) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  handleNext: () => void;
  handleBack: () => void;
  handleSave: () => Promise<void>;
  handleThumbnailUpload: (file: File) => Promise<string>;
  handleThumbnailRemove: () => void;
  handleImageUpload: (file: File, questionIndex: number, field: string) => Promise<string>;
  getCategoryName: () => string | undefined;
  handleStepClick: (step: number) => void;
}

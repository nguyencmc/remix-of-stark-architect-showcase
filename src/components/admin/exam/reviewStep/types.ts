import { type Question } from '../QuestionEditor';

export interface ReviewStepProps {
  title: string;
  description: string;
  categoryName?: string;
  difficulty: string;
  durationMinutes: number;
  thumbnailUrl?: string;
  questions: Question[];
  onEditInfo: () => void;
  onEditQuestions: () => void;
  onUpdateQuestion?: (index: number, field: keyof Question, value: string) => void;
}

export interface ReviewQuestionCardProps {
  question: Question;
  actualIndex: number;
  onToggleCorrectAnswer: (questionIndex: number, letter: string) => void;
}

export interface ReviewSummaryProps {
  questionsCount: number;
  durationMinutes: number;
  difficulty: string;
  hasIssues: boolean;
}

export interface ReviewHeaderProps {
  title: string;
  description: string;
  categoryName?: string;
  thumbnailUrl?: string;
  onEditInfo: () => void;
}

export const QUESTIONS_PER_PAGE = 10;

export const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const getOptionField = (letter: string) => `option_${letter.toLowerCase()}` as keyof Question;

export const getDifficultyLabel = (diff: string) => {
  switch (diff) {
    case 'easy': return { label: 'Dễ', color: 'bg-green-500' };
    case 'medium': return { label: 'Trung bình', color: 'bg-yellow-500' };
    case 'hard': return { label: 'Khó', color: 'bg-red-500' };
    default: return { label: diff, color: 'bg-gray-500' };
  }
};

export const isCorrectAnswer = (question: Question, letter: string) => {
  const answers = question.correct_answer.split(',').map(a => a.trim());
  return answers.includes(letter);
};

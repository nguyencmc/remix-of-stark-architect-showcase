// Types for Practice Feature

// 3 chế độ làm bài:
// - 'practice': Luyện tập - xem đáp án ngay sau khi chọn (chỉ dùng cho bộ đề của user)
// - 'mock': Thi thử - nộp bài mới xem kết quả, không giám sát (chỉ dùng cho bộ đề của user)
// - 'real': Thi thật - có giám sát webcam, dùng cho exam chính thức và bộ đề public
export type ExamMode = 'practice' | 'mock' | 'real';

export interface QuestionSet {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  tags: string[];
  level: string;
  is_published: boolean;
  question_count: number;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Choice {
  id: string;
  text: string;
  image_url?: string;
}

export interface PracticeQuestion {
  id: string;
  set_id: string;
  question_text: string;
  question_image?: string | null;
  option_a: string;
  option_b: string;
  option_c?: string | null;
  option_d?: string | null;
  option_e?: string | null;
  option_f?: string | null;
  correct_answer: string;
  explanation: string | null;
  difficulty: string | null;
  tags: string[];
  question_order: number | null;
  created_at: string;
  creator_id?: string | null;
}

export interface ExamSession {
  id: string;
  user_id: string;
  set_id: string;
  status: 'in_progress' | 'submitted';
  duration_sec: number;
  started_at: string;
  ended_at: string | null;
  score: number | null;
  total_questions: number | null;
  correct_count: number | null;
}

export interface PracticeAttempt {
  id: string;
  user_id: string;
  question_id: string;
  mode: string | null;
  exam_session_id: string | null;
  selected: string;
  is_correct: boolean;
  time_spent_sec: number | null;
  created_at: string;
}

// Setup configs
export interface PracticeSetupConfig {
  setId: string;
  questionCount: number;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface ExamSetupConfig {
  setId: string;
  questionCount: number;
  durationMinutes: number;
}

// Answer state during practice/exam
export interface AnswerState {
  questionId: string;
  selected: string | null; // Can be comma-separated for multi-select: "A,B"
  isChecked: boolean;
  isCorrect: boolean | null;
  timeSpent: number;
}

// Helper to check if a question is multi-select
export function isMultiSelectQuestion(correctAnswer: string): boolean {
  return correctAnswer.includes(',');
}

// Helper to compare answers (handles multi-select)
export function checkAnswerCorrect(selected: string | null, correctAnswer: string): boolean {
  if (!selected) return false;
  
  const selectedSet = new Set(selected.split(',').map(s => s.trim().toUpperCase()));
  const correctSet = new Set(correctAnswer.split(',').map(s => s.trim().toUpperCase()));
  
  if (selectedSet.size !== correctSet.size) return false;
  for (const item of selectedSet) {
    if (!correctSet.has(item)) return false;
  }
  return true;
}

// Helper to toggle a choice in multi-select
export function toggleMultiSelect(current: string | null, choiceId: string): string {
  if (!current) return choiceId;
  
  const selectedArray = current.split(',').map(s => s.trim());
  const index = selectedArray.indexOf(choiceId);
  
  if (index > -1) {
    selectedArray.splice(index, 1);
    return selectedArray.join(',') || '';
  } else {
    selectedArray.push(choiceId);
    // Sort alphabetically for consistent comparison
    return selectedArray.sort().join(',');
  }
}

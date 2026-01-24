// Types for Practice Feature

export interface QuestionSet {
  id: string;
  title: string;
  description: string | null;
  course_id: string | null;
  tags: string[];
  level: string;
  is_published: boolean;
  question_count: number;
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
  selected: string | null;
  isChecked: boolean;
  isCorrect: boolean | null;
  timeSpent: number;
}

export interface ExamData {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  difficulty: string | null;
  question_count: number | null;
  attempt_count: number | null;
  pass_rate: number | null;
  category_name: string | null;
  is_proctored: boolean;
}

export interface UserAttempt {
  id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  completed_at: string;
}

export interface DifficultyConfig {
  label: string;
  cls: string;
  bar: string;
  pct: number;
}

export function getDifficultyConfig(difficulty: string): DifficultyConfig {
  switch (difficulty) {
    case "easy": case "beginner":
      return { label: "Dễ", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", bar: "bg-emerald-500", pct: 33 };
    case "medium": case "intermediate":
      return { label: "Trung bình", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", bar: "bg-amber-500", pct: 66 };
    case "hard": case "advanced":
      return { label: "Khó", cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", bar: "bg-rose-500", pct: 100 };
    default:
      return { label: difficulty, cls: "bg-muted text-muted-foreground", bar: "bg-muted-foreground", pct: 50 };
  }
}

export interface Exam {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  question_count: number | null;
  attempt_count: number | null;
  difficulty: string | null;
  duration_minutes: number | null;
  created_at: string;
  category_id: string | null;
  is_proctored: boolean;
}

export interface ExamCategory {
  id: string;
  name: string;
  slug: string;
}

export const DIFFICULTY_CFG: Record<string, { label: string; cls: string }> = {
  easy:        { label: 'Dễ',       cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  beginner:    { label: 'Dễ',       cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  medium:      { label: 'Trung bình', cls: 'bg-amber-500/10   text-amber-600   border-amber-500/20' },
  intermediate:{ label: 'Trung bình', cls: 'bg-amber-500/10   text-amber-600   border-amber-500/20' },
  hard:        { label: 'Khó',      cls: 'bg-rose-500/10   text-rose-600    border-rose-500/20' },
  advanced:    { label: 'Khó',      cls: 'bg-rose-500/10   text-rose-600    border-rose-500/20' },
};

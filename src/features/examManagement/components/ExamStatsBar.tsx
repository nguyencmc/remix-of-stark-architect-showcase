import { BookOpen, HelpCircle, Users, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamStatsBarProps {
  examCount: number;
  totalQuestions: number;
  totalAttempts: number;
  proctoredCount: number;
}

export function ExamStatsBar({ examCount, totalQuestions, totalAttempts, proctoredCount }: ExamStatsBarProps) {
  const stats = [
    { label: 'Tổng đề thi',  value: examCount,                      icon: <BookOpen   className="w-4 h-4 text-primary" />,       cls: 'text-primary' },
    { label: 'Câu hỏi',      value: totalQuestions.toLocaleString(), icon: <HelpCircle className="w-4 h-4 text-blue-500" />,       cls: 'text-blue-500' },
    { label: 'Lượt thi',     value: totalAttempts.toLocaleString(),  icon: <Users      className="w-4 h-4 text-purple-500" />,     cls: 'text-purple-500' },
    { label: 'Có giám sát',  value: proctoredCount,                  icon: <Camera     className="w-4 h-4 text-orange-500" />,     cls: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border border-border/60 bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            {s.icon}
          </div>
          <div>
            <p className={cn('text-xl font-bold leading-none', s.cls)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

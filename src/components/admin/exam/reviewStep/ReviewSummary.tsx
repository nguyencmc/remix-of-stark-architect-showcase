import { Card } from '@/components/ui/card';
import {
  FileText,
  Clock,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { type ReviewSummaryProps, getDifficultyLabel } from './types';

export const ReviewSummary = ({
  questionsCount,
  durationMinutes,
  difficulty,
  hasIssues,
}: ReviewSummaryProps) => {
  const diffInfo = getDifficultyLabel(difficulty);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{questionsCount}</p>
            <p className="text-xs text-muted-foreground">Câu hỏi</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{durationMinutes}</p>
            <p className="text-xs text-muted-foreground">Phút</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${diffInfo.color}/10 flex items-center justify-center`}>
            <BarChart3 className={`w-5 h-5 ${diffInfo.color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="text-lg font-bold">{diffInfo.label}</p>
            <p className="text-xs text-muted-foreground">Độ khó</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasIssues ? 'bg-yellow-500/10' : 'bg-green-500/10'
            }`}>
            {hasIssues ? (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
          <div>
            <p className="text-lg font-bold">{hasIssues ? 'Cần kiểm tra' : 'Sẵn sàng'}</p>
            <p className="text-xs text-muted-foreground">Trạng thái</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

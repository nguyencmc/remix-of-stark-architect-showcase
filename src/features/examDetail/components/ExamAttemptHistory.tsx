import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ChevronRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { UserAttempt } from "../types";

interface ExamAttemptHistoryProps {
  userAttempts: UserAttempt[] | undefined;
  isLoggedIn: boolean;
  onAttemptClick: (attemptId: string) => void;
}

export function ExamAttemptHistory({ userAttempts, isLoggedIn, onAttemptClick }: ExamAttemptHistoryProps) {
  if (userAttempts && userAttempts.length > 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Lịch sử của bạn
          </h3>
          <div className="space-y-2">
            {userAttempts.map((attempt) => (
              <button
                key={attempt.id}
                onClick={() => onAttemptClick(attempt.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors text-left group"
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                  attempt.score >= 70
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                )}>
                  {attempt.score}%
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={attempt.score}
                      className="h-1.5 flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {attempt.correct_answers}/{attempt.total_questions} đúng ·{" "}
                    {format(new Date(attempt.completed_at), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoggedIn && userAttempts?.length === 0) {
    return (
      <Card className="border-border/60 border-dashed">
        <CardContent className="p-5 text-center">
          <Trophy className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Bạn chưa thi đề này</p>
          <p className="text-xs text-muted-foreground mt-0.5">Hãy bắt đầu ngay!</p>
        </CardContent>
      </Card>
    );
  }

  return null;
}

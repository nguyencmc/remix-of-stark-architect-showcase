import { Card, CardContent } from "@/components/ui/card";
import { Hash, Timer, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamData, DifficultyConfig } from "../types";

interface ExamStatCardsProps {
  exam: ExamData;
  totalQ: number;
  diffCfg: DifficultyConfig;
  bestScore: number | null;
  totalAttempts: number;
}

export function ExamStatCards({ exam, totalQ, diffCfg, bestScore, totalAttempts }: ExamStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Questions */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Câu hỏi</span>
            <Hash className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-bold">{totalQ}</span>
          <span className="text-xs text-muted-foreground">câu</span>
        </CardContent>
      </Card>

      {/* Time */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Thời gian</span>
            <Timer className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold">{exam.duration_minutes || 60}</span>
          <span className="text-xs text-muted-foreground">phút</span>
        </CardContent>
      </Card>

      {/* Difficulty */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Độ khó</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold">{diffCfg.label}</span>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", diffCfg.bar)} style={{ width: `${diffCfg.pct}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Pass rate or user best */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {bestScore !== null ? "Điểm cao nhất" : "Tỷ lệ đạt"}
            </span>
            <Trophy className={cn("w-4 h-4", bestScore !== null ? "text-yellow-500" : "text-emerald-500")} />
          </div>
          <span className={cn("text-2xl font-bold", bestScore !== null && bestScore >= 70 ? "text-emerald-500" : bestScore !== null ? "text-rose-500" : "text-foreground")}>
            {bestScore !== null ? `${bestScore}%` : `${exam.pass_rate || 0}%`}
          </span>
          <span className="text-xs text-muted-foreground">
            {bestScore !== null ? `Sau ${totalAttempts} lần thi` : "tỷ lệ đỗ"}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

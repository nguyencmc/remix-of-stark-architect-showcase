import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock, FileText, Users, ArrowLeft, Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamData, DifficultyConfig } from "../types";

interface ExamDetailHeroProps {
  exam: ExamData;
  isPracticeMode: boolean;
  totalQ: number;
  diffCfg: DifficultyConfig;
  onBack: () => void;
  onStart: () => void;
}

export function ExamDetailHero({ exam, isPracticeMode, totalQ, diffCfg, onBack, onStart }: ExamDetailHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background border-b border-border">
      {/* decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {exam.category_name && (
                <Badge variant="secondary" className="font-medium">
                  {exam.category_name}
                </Badge>
              )}
              {isPracticeMode && (
                <Badge variant="outline">Cộng đồng</Badge>
              )}
              <Badge variant="outline" className={cn("font-medium", diffCfg.cls)}>
                {diffCfg.label}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3">
              {exam.title}
            </h1>

            {exam.description && (
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl line-clamp-2">
                {exam.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
              </p>
            )}

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <strong className="text-foreground">{totalQ}</strong> câu hỏi
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <strong className="text-foreground">{exam.duration_minutes || 60}</strong> phút
              </span>
              {!isPracticeMode && (exam.attempt_count ?? 0) > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <strong className="text-foreground">{(exam.attempt_count || 0).toLocaleString()}</strong> lượt thi
                </span>
              )}
            </div>
          </div>

          {/* CTA desktop */}
          <div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0">
            <Button size="lg" className="gap-2 px-10 text-base h-12 shadow-lg" onClick={onStart}>
              <Play className="w-5 h-5 fill-current" />
              Bắt đầu làm bài
            </Button>
            <span className="text-xs text-muted-foreground">Tính giờ ngay khi bắt đầu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

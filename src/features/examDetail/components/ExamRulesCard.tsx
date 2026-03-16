import { Card, CardContent } from "@/components/ui/card";
import {
  Clock, BookOpen, BarChart3, CheckCircle2, AlertTriangle, Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ExamRulesCard() {
  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Quy định làm bài
        </h2>
        <ul className="space-y-3">
          {[
            { icon: <Timer className="w-4 h-4 text-blue-500" />, text: "Thời gian bắt đầu tính ngay khi nhấn \"Bắt đầu\"" },
            { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, text: "Có thể chuyển qua lại giữa các câu hỏi trong thời gian làm bài" },
            { icon: <Clock className="w-4 h-4 text-amber-500" />, text: "Bài thi tự động nộp khi hết thời gian" },
            { icon: <BarChart3 className="w-4 h-4 text-purple-500" />, text: "Kết quả và giải thích chi tiết sau khi nộp bài" },
            { icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, text: "Không chuyển tab hoặc rời khỏi trang trong khi thi", warn: true },
          ].map((item, i) => (
            <li key={i} className={cn("flex items-start gap-3 text-sm", item.warn ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground")}>
              <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

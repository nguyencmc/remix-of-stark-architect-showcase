import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Frown,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ShieldAlert,
  History,
  Award,
} from "lucide-react";
import type { Exam, Question } from "../types";
import { isAnswerCorrect } from "../examUtils";

interface ExamResultsProps {
  exam: Exam;
  questions: Question[];
  answers: Record<string, string[]>;
  violationCount: number;
  unansweredCount: number;
  attemptId: string | null;
}

const PASS_THRESHOLD = 70;

export function ExamResults({
  exam,
  questions,
  answers,
  violationCount,
  unansweredCount,
  attemptId,
}: ExamResultsProps) {
  const navigate = useNavigate();

  const correctCount = questions.filter((q) =>
    isAnswerCorrect(q, answers[q.id]),
  ).length;
  const wrongCount = questions.length - correctCount - unansweredCount;
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const isPassed = scorePercent >= PASS_THRESHOLD;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* ── Hero Card ── */}
        <div
          className={`relative rounded-3xl border-2 shadow-xl overflow-hidden ${
            isPassed
              ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-background to-emerald-500/10"
              : "border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-background to-orange-500/10"
          }`}
        >
          {/* Confetti dots for pass */}
          {isPassed && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: `${4 + Math.random() * 6}px`,
                    height: `${4 + Math.random() * 6}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    backgroundColor: [
                      '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899'
                    ][i % 6],
                    opacity: 0.15 + Math.random() * 0.2,
                    animationDuration: `${1.5 + Math.random() * 2}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative z-10 px-8 pt-10 pb-8 text-center">
            {/* Icon */}
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg ${
                isPassed
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25"
                  : "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/25"
              }`}
            >
              {isPassed ? (
                <Trophy className="w-12 h-12 text-white drop-shadow" />
              ) : (
                <Frown className="w-12 h-12 text-white drop-shadow" />
              )}
            </div>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-3 ${
                isPassed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-orange-500/15 text-orange-600 dark:text-orange-400"
              }`}
            >
              {isPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> ĐẠT
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> CHƯA ĐẠT
                </>
              )}
            </div>

            {/* Message */}
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isPassed ? "Chúc mừng bạn! 🎉" : "Chưa đạt yêu cầu 😢"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {isPassed
                ? `Bạn đã vượt qua bài thi "${exam.title}" xuất sắc!`
                : `Cần cố gắng học chăm chỉ hơn nhé! Bạn sẽ làm được!`}
            </p>

            {/* Big Score */}
            <div className="mb-2">
              <span
                className={`text-7xl font-black tabular-nums ${
                  isPassed ? "text-emerald-500" : "text-orange-500"
                }`}
              >
                {scorePercent}
              </span>
              <span
                className={`text-3xl font-bold ml-1 ${
                  isPassed ? "text-emerald-500/60" : "text-orange-500/60"
                }`}
              >
                %
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {correctCount}/{questions.length} câu đúng · Yêu cầu ≥{PASS_THRESHOLD}%
            </p>

            <Progress
              value={scorePercent}
              className={`h-2.5 mb-6 ${
                isPassed ? "[&>div]:bg-emerald-500" : "[&>div]:bg-orange-500"
              }`}
            />

            {/* Stats Grid - 4 columns */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {correctCount}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Đúng
                </div>
              </div>
              <div className="rounded-xl bg-red-500/10 p-3 text-center">
                <XCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {wrongCount}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Sai
                </div>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-3 text-center">
                <MinusCircle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {unansweredCount}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Bỏ qua
                </div>
              </div>
              <div className="rounded-xl bg-violet-500/10 p-3 text-center">
                <ShieldAlert className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  {violationCount}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Vi phạm
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              {isPassed && (
                <Button
                  className="w-full gap-2 h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20"
                  onClick={() => navigate("/history")}
                >
                  <Award className="w-4 h-4" />
                  Xem chứng nhận
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full gap-2 h-11 rounded-xl text-sm font-semibold"
                onClick={() => {
                  if (attemptId) {
                    navigate(`/history/${attemptId}`);
                  } else {
                    navigate("/history");
                  }
                }}
              >
                <History className="w-4 h-4" />
                Xem lại đáp án
              </Button>

              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-10 rounded-xl text-sm"
                  onClick={() => navigate("/exams")}
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Button>
                <Button
                  className="flex-1 gap-2 h-10 rounded-xl text-sm"
                  onClick={() => window.location.reload()}
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

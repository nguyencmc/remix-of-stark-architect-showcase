import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Frown,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertCircle,
  History,
  Award,
} from 'lucide-react';
import { fetchExamSessionById, fetchQuestionSetById, fetchAttemptsForSession } from '../api';

const PASS_THRESHOLD = 70;

export default function ExamResult() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['exam-session', sessionId],
    queryFn: () => fetchExamSessionById(sessionId!),
    enabled: !!sessionId,
  });

  const { data: questionSet, isLoading: setLoading } = useQuery({
    queryKey: ['question-set', session?.set_id],
    queryFn: () => fetchQuestionSetById(session!.set_id!),
    enabled: !!session?.set_id,
  });

  const { data: attempts = [] } = useQuery({
    queryKey: ['session-attempts', sessionId],
    queryFn: () => fetchAttemptsForSession(sessionId!),
    enabled: !!sessionId,
  });

  const isLoading = sessionLoading || setLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-lg p-4 space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg mb-4">Không tìm thấy kết quả thi</p>
          <Button onClick={() => navigate('/practice')}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const total = session.total_questions || 0;
  const correct = session.correct_count || 0;
  const answeredCount = attempts.length;
  const unanswered = total - answeredCount;
  const wrong = answeredCount - correct;
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const isPassed = scorePercent >= PASS_THRESHOLD;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/practice')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        {/* ── Hero Card ── */}
        <div
          className={`relative rounded-3xl border-2 shadow-xl overflow-hidden ${
            isPassed
              ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-background to-emerald-500/10'
              : 'border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-background to-orange-500/10'
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
                      '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899',
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
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/25'
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
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
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
              {isPassed ? 'Chúc mừng bạn! 🎉' : 'Chưa đạt yêu cầu 😢'}
            </h1>
            <p className="text-sm text-muted-foreground mb-1">
              {isPassed
                ? `Bạn đã vượt qua bài luyện tập xuất sắc!`
                : `Cần cố gắng học chăm chỉ hơn nhé! Bạn sẽ làm được!`}
            </p>
            {questionSet && (
              <p className="text-xs text-muted-foreground/70 mb-6">{questionSet.title}</p>
            )}

            {/* Big Score */}
            <div className="mb-2">
              <span
                className={`text-7xl font-black tabular-nums ${
                  isPassed ? 'text-emerald-500' : 'text-orange-500'
                }`}
              >
                {scorePercent}
              </span>
              <span
                className={`text-3xl font-bold ml-1 ${
                  isPassed ? 'text-emerald-500/60' : 'text-orange-500/60'
                }`}
              >
                %
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {correct}/{total} câu đúng · Yêu cầu ≥{PASS_THRESHOLD}%
            </p>

            <Progress
              value={scorePercent}
              className={`h-2.5 mb-6 ${
                isPassed ? '[&>div]:bg-emerald-500' : '[&>div]:bg-orange-500'
              }`}
            />

            {/* Stats Grid - 3 columns (no violation for practice) */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {correct}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Đúng
                </div>
              </div>
              <div className="rounded-xl bg-red-500/10 p-3 text-center">
                <XCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {wrong < 0 ? 0 : wrong}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Sai
                </div>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-3 text-center">
                <MinusCircle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {unanswered < 0 ? 0 : unanswered}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Bỏ qua
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              {isPassed && (
                <Button
                  className="w-full gap-2 h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20"
                  onClick={() => navigate('/history')}
                >
                  <Award className="w-4 h-4" />
                  Xem chứng nhận
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full gap-2 h-11 rounded-xl text-sm font-semibold"
                onClick={() => navigate('/history')}
              >
                <History className="w-4 h-4" />
                Xem lại đáp án
              </Button>

              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-10 rounded-xl text-sm"
                  onClick={() => navigate('/practice')}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
                <Button
                  className="flex-1 gap-2 h-10 rounded-xl text-sm"
                  onClick={() => navigate(`/practice/exam-setup/${session.set_id}`)}
                >
                  <RotateCcw className="w-4 h-4" />
                  Thi lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

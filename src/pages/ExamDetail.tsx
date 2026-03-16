import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import {
  useExamDetail,
  ExamDetailHero,
  ExamStatCards,
  ExamRulesCard,
  ExamProctoringCard,
  ExamCtaCard,
  ExamAttemptHistory,
  ExamMobileCta,
} from "@/features/examDetail";

const ExamDetail = () => {
  const {
    exam,
    examLoading,
    isPracticeMode,
    totalQ,
    diffCfg,
    bestScore,
    totalAttempts,
    userAttempts,
    user,
    handleStartExam,
    navigate,
  } = useExamDetail();

  if (examLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-48 w-full mb-6 rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Không tìm thấy đề thi</h1>
          <p className="text-muted-foreground">Đề thi này không tồn tại hoặc đã bị xoá.</p>
          <Button onClick={() => navigate("/exams")}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExamDetailHero
        exam={exam}
        isPracticeMode={isPracticeMode}
        totalQ={totalQ}
        diffCfg={diffCfg}
        onBack={() => navigate(-1)}
        onStart={handleStartExam}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <ExamStatCards
          exam={exam}
          totalQ={totalQ}
          diffCfg={diffCfg}
          bestScore={bestScore}
          totalAttempts={totalAttempts}
        />

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-4">
            <ExamRulesCard />
            {exam.is_proctored && <ExamProctoringCard />}
          </div>

          <div className="md:col-span-2 space-y-4">
            <ExamCtaCard
              exam={exam}
              totalQ={totalQ}
              totalAttempts={totalAttempts}
              bestScore={bestScore}
              onStart={handleStartExam}
            />
            <ExamAttemptHistory
              userAttempts={userAttempts}
              isLoggedIn={!!user}
              onAttemptClick={(id) => navigate(`/attempt/${id}`)}
            />
          </div>
        </div>
      </div>

      <ExamMobileCta onStart={handleStartExam} />
    </div>
  );
};

export default ExamDetail;
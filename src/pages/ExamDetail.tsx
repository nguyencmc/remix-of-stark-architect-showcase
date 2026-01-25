import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, FileText, Target, Users, ArrowLeft, Play, BookOpen, BarChart3 } from "lucide-react";

interface ExamData {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  difficulty: string | null;
  question_count: number | null;
  attempt_count: number | null;
  pass_rate: number | null;
  category_name: string | null;
}

const ExamDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if this is a practice/community exam
  const isPracticeMode = searchParams.get('type') === 'practice';

  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ["exam-detail", slug, isPracticeMode],
    queryFn: async (): Promise<ExamData | null> => {
      if (isPracticeMode) {
        // Fetch from question_sets table - try slug first, then ID
        let { data, error } = await supabase
          .from("question_sets")
          .select("*, exam_categories(name)")
          .eq("slug", slug)
          .maybeSingle();
        
        // If not found by slug, try by ID
        if (!data && !error) {
          const idQuery = await supabase
            .from("question_sets")
            .select("*, exam_categories(name)")
            .eq("id", slug)
            .maybeSingle();
          data = idQuery.data;
          error = idQuery.error;
        }

        if (error) throw error;
        if (!data) return null;
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          duration_minutes: data.duration_minutes || 60,
          difficulty: data.level,
          question_count: data.question_count,
          attempt_count: 0,
          pass_rate: 0,
          category_name: (data.exam_categories as { name: string } | null)?.name || null,
        };
      } else {
        // Fetch from exams table (official exams)
        const { data, error } = await supabase
          .from("exams")
          .select("*, exam_categories(name)")
          .eq("slug", slug)
          .maybeSingle();

        if (error) throw error;
        if (!data) return null;
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          duration_minutes: data.duration_minutes,
          difficulty: data.difficulty,
          question_count: data.question_count,
          attempt_count: data.attempt_count,
          pass_rate: data.pass_rate,
          category_name: (data.exam_categories as { name: string } | null)?.name || null,
        };
      }
    },
    enabled: !!slug,
  });

  const { data: questionCount } = useQuery({
    queryKey: ["exam-questions-count", exam?.id, isPracticeMode],
    queryFn: async () => {
      if (isPracticeMode) {
        // Count from practice_questions
        const { count, error } = await supabase
          .from("practice_questions")
          .select("*", { count: "exact", head: true })
          .eq("set_id", exam?.id);

        if (error) throw error;
        return count || 0;
      } else {
        // Count from questions table
        const { count, error } = await supabase
          .from("questions")
          .select("*", { count: "exact", head: true })
          .eq("exam_id", exam?.id);

        if (error) throw error;
        return count || 0;
      }
    },
    enabled: !!exam?.id,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard":
      case "advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
      case "beginner":
        return "Dễ";
      case "medium":
      case "intermediate":
        return "Trung bình";
      case "hard":
      case "advanced":
        return "Khó";
      default:
        return difficulty;
    }
  };

  const handleStartExam = () => {
    if (isPracticeMode) {
      navigate(`/exam/${slug}/take?type=practice`);
    } else {
      navigate(`/exam/${slug}/take`);
    }
  };

  if (examLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy đề thi</h1>
          <Button onClick={() => navigate("/exams")}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6 -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {exam.category_name && (
                <Badge variant="secondary" className="mb-3">
                  {exam.category_name}
                </Badge>
              )}
              {isPracticeMode && (
                <Badge variant="outline" className="mb-3 ml-2">
                  Cộng đồng
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{exam.title}</h1>
              {exam.description && (
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {exam.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={handleStartExam}
              >
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu làm bài
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Nhấn để bắt đầu tính giờ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Thông tin đề thi */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Thông tin đề thi
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FileText className="w-5 h-5" />
                    <span>Số câu hỏi</span>
                  </div>
                  <span className="font-semibold text-lg">
                    {questionCount || exam.question_count || 0} câu
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>Thời gian làm bài</span>
                  </div>
                  <span className="font-semibold text-lg">
                    {exam.duration_minutes || 60} phút
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Target className="w-5 h-5" />
                    <span>Độ khó</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(exam.difficulty || "medium")}
                  >
                    {getDifficultyLabel(exam.difficulty || "medium")}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>Lượt thi</span>
                  </div>
                  <span className="font-semibold text-lg">
                    {exam.attempt_count?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thống kê & Hướng dẫn */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Thống kê & Hướng dẫn
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Tỷ lệ đạt</span>
                  <span className="font-semibold text-lg text-green-500">
                    {exam.pass_rate || 0}%
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Lưu ý khi làm bài:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Thời gian sẽ được tính ngay khi bạn bắt đầu làm bài</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Bạn có thể chuyển qua lại giữa các câu hỏi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Bài thi sẽ tự động nộp khi hết thời gian</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Xem lại đáp án và giải thích sau khi nộp bài</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Button
            size="lg"
            className="w-full text-lg"
            onClick={handleStartExam}
          >
            <Play className="w-5 h-5 mr-2" />
            Bắt đầu làm bài
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
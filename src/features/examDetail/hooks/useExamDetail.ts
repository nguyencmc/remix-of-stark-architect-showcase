import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ExamData, UserAttempt, DifficultyConfig } from "../types";
import { getDifficultyConfig } from "../types";

export interface UseExamDetailReturn {
  exam: ExamData | null | undefined;
  examLoading: boolean;
  slug: string | undefined;
  isPracticeMode: boolean;
  totalQ: number;
  diffCfg: DifficultyConfig;
  bestScore: number | null;
  totalAttempts: number;
  userAttempts: UserAttempt[] | undefined;
  user: ReturnType<typeof useAuth>["user"];
  handleStartExam: () => void;
  navigate: ReturnType<typeof useNavigate>;
}

export function useExamDetail(): UseExamDetailReturn {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isPracticeMode = searchParams.get('type') === 'practice';

  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ["exam-detail", slug, isPracticeMode],
    queryFn: async (): Promise<ExamData | null> => {
      if (isPracticeMode) {
        let { data, error } = await supabase
          .from("question_sets")
          .select("*, exam_categories(name)")
          .eq("slug", slug)
          .maybeSingle();

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
          is_proctored: false,
        };
      } else {
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
          is_proctored: (data as Record<string, unknown>).is_proctored as boolean ?? false,
        };
      }
    },
    enabled: !!slug,
  });

  const { data: questionCount } = useQuery({
    queryKey: ["exam-questions-count", exam?.id, isPracticeMode],
    queryFn: async () => {
      if (isPracticeMode) {
        const { count, error } = await supabase
          .from("practice_questions")
          .select("*", { count: "exact", head: true })
          .eq("set_id", exam?.id);
        if (error) throw error;
        return count || 0;
      } else {
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

  const { data: userAttempts } = useQuery({
    queryKey: ["user-attempts", exam?.id, user?.id],
    queryFn: async (): Promise<UserAttempt[]> => {
      if (!user?.id || !exam?.id) return [];
      const { data, error } = await supabase
        .from("exam_attempts")
        .select("id, score, total_questions, correct_answers, completed_at")
        .eq("user_id", user.id)
        .eq("exam_id", exam.id)
        .order("completed_at", { ascending: false })
        .limit(5);
      if (error) return [];
      return (data || []) as unknown as UserAttempt[];
    },
    enabled: !!exam?.id && !!user?.id,
  });

  const bestScore = userAttempts?.length
    ? Math.max(...userAttempts.map(a => a.score))
    : null;
  const totalAttempts = userAttempts?.length ?? 0;

  const totalQ = questionCount || exam?.question_count || 0;
  const diffCfg = getDifficultyConfig(exam?.difficulty || "medium");

  const handleStartExam = () => {
    if (isPracticeMode) navigate(`/exam/${slug}/take?type=practice`);
    else navigate(`/exam/${slug}/take`);
  };

  return {
    exam,
    examLoading,
    slug,
    isPracticeMode,
    totalQ,
    diffCfg,
    bestScore,
    totalAttempts,
    userAttempts,
    user,
    handleStartExam,
    navigate,
  };
}

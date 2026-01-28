import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    FileText,
    Clock,
    Users,
    ArrowRight,
    GraduationCap,
    Zap,
    Target,
    Brain
} from "lucide-react";

interface Exam {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    question_count: number | null;
    attempt_count: number | null;
    difficulty: string | null;
    duration_minutes: number | null;
    category_name?: string;
}

const difficultyConfig: Record<string, { label: string; color: string; icon: typeof Zap }> = {
    easy: { label: "Dễ", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Zap },
    medium: { label: "Trung bình", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Target },
    hard: { label: "Khó", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: Brain },
};

export const PopularExamsSection = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            const { data: examData, error: examError } = await supabase
                .from("exams")
                .select(`
          id,
          title,
          slug,
          description,
          question_count,
          attempt_count,
          difficulty,
          duration_minutes,
          category:exam_categories(name)
        `)
                .order("created_at", { ascending: false })
                .limit(3);

            if (!examError && examData) {
                const formattedExams = examData.map((exam: any) => ({
                    ...exam,
                    category_name: exam.category?.name || null,
                }));
                setExams(formattedExams);
            }
            setLoading(false);
        };

        fetchExams();
    }, []);

    // Generate random attempts for demo if null
    const getAttempts = (count: number | null) => count || Math.floor(Math.random() * 2000) + 100;

    if (loading) {
        return (
            <section className="py-16 lg:py-24 bg-muted/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-64 rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (exams.length === 0) {
        return null;
    }

    return (
        <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full mb-4">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-medium">Đề thi phổ biến</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Luyện tập với đề thi thực tế
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hàng ngàn đề thi từ cơ bản đến nâng cao, giúp bạn chuẩn bị tốt nhất cho kỳ thi
                    </p>
                </div>

                {/* Exams Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {exams.map((exam) => {
                        const difficulty = difficultyConfig[exam.difficulty || "medium"] || difficultyConfig.medium;
                        const DifficultyIcon = difficulty.icon;

                        return (
                            <Link key={exam.id} to={`/exams/${exam.slug}`}>
                                <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-card">
                                    <CardContent className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-primary" />
                                            </div>
                                            <Badge className={difficulty.color}>
                                                <DifficultyIcon className="w-3 h-3 mr-1" />
                                                {difficulty.label}
                                            </Badge>
                                        </div>

                                        {/* Category */}
                                        {exam.category_name && (
                                            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                                                {exam.category_name}
                                            </p>
                                        )}

                                        {/* Title */}
                                        <h3 className="font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                            {exam.title}
                                        </h3>

                                        {/* Description */}
                                        {exam.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {exam.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                <span>{exam.question_count || 10} câu</span>
                                            </div>
                                            {exam.duration_minutes && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{exam.duration_minutes} phút</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 ml-auto">
                                                <Users className="w-4 h-4" />
                                                <span>{getAttempts(exam.attempt_count).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link to="/exams">
                        <Button size="lg" variant="outline" className="gap-2 group">
                            Xem tất cả đề thi
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

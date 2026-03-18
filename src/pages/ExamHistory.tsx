import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Clock,
  Trophy,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  FileText,
  History,
  LogIn,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface ExamAttempt {
  id: string;
  exam_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_spent_seconds: number;
  completed_at: string;
  answers: Record<string, string>;
  exam?: {
    title: string;
    slug: string;
    difficulty: string;
    category?: {
      name: string;
    };
  };
}

const ExamHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAttempt, setSelectedAttempt] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const { data: attempts, isLoading } = useQuery({
    queryKey: ["exam-history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("exam_attempts")
        .select(`
          *,
          exam:exams(
            title, 
            slug, 
            difficulty,
            category:exam_categories(name)
          )
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as ExamAttempt[];
    },
    enabled: !!user?.id,
  });

  // Extract unique categories from attempts
  const categories = useMemo(() => {
    if (!attempts) return [];
    const cats = new Set<string>();
    attempts.forEach(a => {
      // Handle the case where category might be an array or single object object depending on the relationship, though it's typically an object in Supabase response map if it's many-to-one
      const catObj = a.exam?.category as any;
      const catName = Array.isArray(catObj) ? catObj[0]?.name : catObj?.name;
      if (catName) cats.add(catName);
    });
    return Array.from(cats);
  }, [attempts]);

  // Derived state for filtering and pagination
  const filteredAttempts = useMemo(() => {
    if (!attempts) return [];
    
    return attempts.filter((attempt) => {
      // Search filter
      const matchesSearch = attempt.exam?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ?? true;

      // Category filter
      const catObj = attempt.exam?.category as any;
      const catName = Array.isArray(catObj) ? catObj[0]?.name : catObj?.name;
      const matchesCategory = 
        selectedCategory === "all" || 
        catName === selectedCategory;

      // Date Range filter
      let matchesDate = true;
      if (dateRange?.from && attempt.completed_at) {
        const attemptDate = new Date(attempt.completed_at);
        if (dateRange.to) {
          matchesDate = isWithinInterval(attemptDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to),
          });
        } else {
          // Only 'from' is selected
          matchesDate = isWithinInterval(attemptDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.from),
          });
        }
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [attempts, searchQuery, selectedCategory, dateRange]);

  const totalPages = Math.max(1, Math.ceil((filteredAttempts?.length || 0) / ITEMS_PER_PAGE));

  const paginatedAttempts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAttempts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAttempts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateRange, selectedCategory]);

  // Summary stats
  const stats = useMemo(() => {
    if (!attempts || attempts.length === 0) return null;
    const totalAttempts = attempts.length;
    const avgScore = Math.round(
      attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
    );
    const bestScore = Math.max(...attempts.map((a) => a.score));
    const totalTime = attempts.reduce((sum, a) => sum + a.time_spent_seconds, 0);
    const totalHours = Math.floor(totalTime / 3600);
    const totalMins = Math.floor((totalTime % 3600) / 60);
    return { totalAttempts, avgScore, bestScore, totalHours, totalMins };
  }, [attempts]);

  // Chart data (scores over time)
  const chartData = useMemo(() => {
    if (!attempts) return [];
    const sorted = [...attempts].sort(
      (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );
    return sorted.map((a) => ({
      date: format(new Date(a.completed_at), "dd/MM", { locale: vi }),
      score: a.score,
      title: a.exam?.title,
    }));
  }, [attempts]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      default:
        return difficulty;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Đăng nhập để xem lịch sử</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">
              Bạn cần đăng nhập để xem lịch sử làm bài và theo dõi tiến độ học tập
            </p>
            <Link to="/auth">
              <Button size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Lịch sử làm bài</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Xem lại các bài thi đã làm và theo dõi tiến độ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Overview Section: Stats + Chart */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tổng quan</CardTitle>
                <CardDescription>Thống kê kết quả học tập của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <FileText className="w-4 h-4 text-primary mb-1" />
                    <span className="text-2xl font-bold">{stats?.totalAttempts || 0}</span>
                    <span className="text-xs text-muted-foreground">Lượt thi</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <BarChart3 className="w-4 h-4 text-blue-500 mb-1" />
                    <span className="text-2xl font-bold">{stats?.avgScore || 0}%</span>
                    <span className="text-xs text-muted-foreground">Điểm TB</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                    <Trophy className="w-4 h-4 text-green-500 mb-1" />
                    <span className="text-2xl font-bold">{stats?.bestScore || 0}%</span>
                    <span className="text-xs text-muted-foreground">Cao nhất</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <Clock className="w-4 h-4 text-orange-500 mb-1" />
                    <span className="text-2xl font-bold">
                      {stats ? (stats.totalHours > 0 ? `${stats.totalHours}h` : `${stats.totalMins}p`) : "0p"}
                    </span>
                    <span className="text-xs text-muted-foreground">Thời gian</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Column */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tiến độ điểm số</CardTitle>
                <CardDescription>Biểu đồ thể hiện điểm qua các lần làm bài gần đây</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-[200px] w-full mt-4">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#888888' }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#888888' }}
                          dx={-10}
                          domain={[0, 100]}
                        />
                        <RechartsTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-semibold text-sm mb-1">{data.title}</p>
                                  <p className="text-xs text-muted-foreground mb-1">{data.date}</p>
                                  <p className="text-primary font-bold">{data.score}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "hsl(var(--primary))" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Chưa đủ dữ liệu để vẽ biểu đồ
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content (2 columns) */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar: Filters */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="sticky top-20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bộ lọc
              </h3>
              
              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm bài thi</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Nhập tên bài thi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-card"
                    />
                  </div>
                </div>

                {/* Catalog / Category Filter */}
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className="justify-start shadow-none"
                      >
                        Tất cả danh mục
                      </Button>
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategory === cat ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(cat)}
                          className="justify-start shadow-none text-left h-auto py-1.5 whitespace-normal"
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Range calendar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Chọn khoảng thời gian
                  </label>
                  <div className="rounded-xl border bg-card p-1 shadow-sm mt-2 flex justify-center">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                      className="pointer-events-auto w-full max-w-[280px]"
                    />
                  </div>
                  {dateRange?.from && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setDateRange(undefined)}
                      className="w-full mt-2 text-muted-foreground"
                    >
                      Xóa bộ lọc ngày
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: List of attempts */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-6 w-2/3 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAttempts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Hiện có {filteredAttempts.length} kết quả</h3>
                </div>

                {paginatedAttempts.map((attempt) => {
                   const catObj = attempt.exam?.category as any;
                   const catName = Array.isArray(catObj) ? catObj[0]?.name : catObj?.name;
                   
                   return (
                  <Card
                    key={attempt.id}
                    className="hover:border-primary/50 transition-all cursor-pointer overflow-hidden group"
                    onClick={() =>
                      setSelectedAttempt(
                        selectedAttempt === attempt.id ? null : attempt.id
                      )
                    }
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Score Circle */}
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 ${getScoreBgColor(
                            attempt.score
                          )} transition-transform group-hover:scale-105`}
                        >
                          <div
                            className={`text-xl sm:text-2xl font-bold ${getScoreColor(
                              attempt.score
                            )}`}
                          >
                            {attempt.score}%
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                                {attempt.exam?.title || "Đề thi không tồn tại"}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs sm:text-sm text-muted-foreground">
                                {catName && (
                                  <div className="hidden sm:flex items-center gap-1 font-medium text-foreground">
                                    <Badge variant="secondary" className="font-normal text-[10px] sm:text-xs">
                                      {catName}
                                    </Badge>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                                  <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                                  <span>
                                    {format(
                                      new Date(attempt.completed_at),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: vi }
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                                  <span>{formatDuration(attempt.time_spent_seconds)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {attempt.exam?.difficulty && (
                                <Badge
                                  variant="outline"
                                  className={`hidden sm:inline-flex text-xs px-2 ${getDifficultyColor(attempt.exam.difficulty)}`}
                                >
                                  {getDifficultyLabel(attempt.exam.difficulty)}
                                </Badge>
                              )}
                              <ChevronRight
                                className={`w-5 h-5 text-muted-foreground transition-transform ${
                                  selectedAttempt === attempt.id ? "rotate-90" : "group-hover:translate-x-1"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedAttempt === attempt.id && (
                        <div className="mt-5 pt-5 border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
                            <div className="text-center p-3 bg-muted/30 rounded-xl border border-border/50">
                              <div className="text-2xl font-bold text-primary">
                                {attempt.score}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Điểm số
                              </div>
                            </div>
                            <div className="text-center p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                              <div className="text-2xl font-bold text-green-500">
                                {attempt.correct_answers}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Câu đúng
                              </div>
                            </div>
                            <div className="text-center p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                              <div className="text-2xl font-bold text-red-500">
                                {attempt.total_questions - attempt.correct_answers}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Câu sai
                              </div>
                            </div>
                            <div className="text-center p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                              <div className="text-2xl font-bold text-orange-500">
                                {Math.floor(attempt.time_spent_seconds / 60)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Phút
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              className="w-full sm:w-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/history/${attempt.id}`);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Xem chi tiết kết quả
                            </Button>
                            {attempt.exam?.slug && (
                              <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/exam/${attempt.exam?.slug}/take`);
                                }}
                              >
                                <Trophy className="w-4 h-4 mr-2" />
                                Làm lại đề thi này
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-6 border-t mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                          let pageToShow = idx + 1;
                          if (totalPages > 5) {
                            if (currentPage <= 3) {
                              pageToShow = idx + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageToShow = totalPages - 4 + idx;
                            } else {
                              pageToShow = currentPage - 2 + idx;
                            }
                          }
                          
                          return (
                            <PaginationItem key={pageToShow}>
                              <PaginationLink
                                isActive={currentPage === pageToShow}
                                onClick={() => setCurrentPage(pageToShow)}
                                className="cursor-pointer"
                              >
                                {pageToShow}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-xl border">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài thi nào!</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Không có lịch sử làm bài nào khớp với bộ lọc của bạn hiện tại. Hãy thử chọn khoảng thời gian khác hoặc xóa bộ lọc.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setDateRange(undefined);
                      setSelectedCategory("all");
                    }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                  <Link to="/exams">
                    <Button>Đi đến Đề thi</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExamHistory;

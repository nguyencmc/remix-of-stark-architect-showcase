import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Flame, 
  Star, 
  Lightbulb,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  Brain,
  Bell,
  Calendar,
  Award,
  ChevronRight,
  Clock,
  Zap,
  Trophy,
  Gift
} from 'lucide-react';
import { AchievementsBadgeDisplay } from '@/components/achievements/AchievementsBadgeDisplay';
import { PracticeTodayWidget } from '@/components/dashboard/PracticeTodayWidget';
import { PracticeStatsWidget } from '@/components/dashboard/PracticeStatsWidget';
import { cn } from '@/lib/utils';

interface DashboardSuggestionsProps {
  streak: number;
  level: number;
  points: number;
  pointsToNextLevel: number;
  levelProgress: number;
}

const studyTips = [
  { tip: "Ôn tập mỗi ngày 15-20 phút hiệu quả hơn 2 giờ mỗi tuần", emoji: "⏰" },
  { tip: "Sử dụng flashcards để ghi nhớ từ vựng tốt hơn", emoji: "🃏" },
  { tip: "Làm đề thi thử định kỳ để đánh giá tiến độ", emoji: "📝" },
  { tip: "Ôn lại các câu sai là cách học hiệu quả nhất", emoji: "🎯" },
  { tip: "Nghe podcast để cải thiện kỹ năng listening", emoji: "🎧" },
  { tip: "Nghỉ ngơi đầy đủ giúp não ghi nhớ tốt hơn", emoji: "😴" },
  { tip: "Đặt mục tiêu nhỏ và tăng dần để tránh áp lực", emoji: "📈" },
];

const motivationalQuotes = [
  "Mỗi ngày một chút, thành công sẽ đến!",
  "Kiên trì là chìa khóa của thành công.",
  "Học không bao giờ là muộn.",
  "Thất bại là mẹ thành công.",
  "Cố gắng hôm nay, thành công ngày mai.",
];

export function DashboardSuggestions({
  streak,
  level,
  points,
  pointsToNextLevel,
  levelProgress,
}: DashboardSuggestionsProps) {
  const { user } = useAuth();
  const [dueFlashcards, setDueFlashcards] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);
  
  const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    // Fetch due flashcards count
    const { count: dueCount } = await supabase
      .from('user_flashcard_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .lte('next_review_at', new Date().toISOString());

    setDueFlashcards(dueCount || 0);
  };

  // Calculate streak reward milestones
  const nextStreakMilestone = Math.ceil(streak / 7) * 7;
  const streakProgress = (streak % 7) / 7 * 100;

  // Level badge color
  const getLevelColor = (level: number) => {
    if (level >= 50) return 'text-amber-500 bg-amber-500/10';
    if (level >= 30) return 'text-purple-500 bg-purple-500/10';
    if (level >= 20) return 'text-blue-500 bg-blue-500/10';
    if (level >= 10) return 'text-green-500 bg-green-500/10';
    return 'text-primary bg-primary/10';
  };

  return (
    <aside className="space-y-4">
      {/* Streak & Level Card - Enhanced */}
      <Card className="border-border/50 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-4 space-y-4 relative">
          {/* Streak Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center relative",
                streak > 0 ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-muted"
              )}>
                <Flame className={cn("w-7 h-7", streak > 0 ? "text-white" : "text-muted-foreground")} />
                {streak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">ngày liên tiếp</p>
              </div>
            </div>
            {streak > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Mục tiêu</p>
                <p className="text-sm font-semibold text-orange-500">{nextStreakMilestone} ngày</p>
              </div>
            )}
          </div>
          
          {streak > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tiến độ milestone</span>
                <span>{streak % 7}/7</span>
              </div>
              <Progress value={streakProgress} className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-yellow-500" />
            </div>
          )}
          
          {/* Level Section */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getLevelColor(level))}>
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-lg">Level {level}</span>
                  <p className="text-[10px] text-muted-foreground leading-none">
                    {points.toLocaleString()} XP
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                +{pointsToNextLevel} → Lv.{level + 1}
              </Badge>
            </div>
            <Progress 
              value={levelProgress} 
              className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-purple-500" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Practice Today Widget - Hôm nay học gì */}
      <PracticeTodayWidget />

      {/* Practice Stats Widget - Thống kê luyện tập */}
      <PracticeStatsWidget />

      {/* Notifications / Reminders */}
      {(dueFlashcards > 0) && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-3">
            <Link to="/flashcards/today" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bạn có {dueFlashcards} thẻ cần ôn!</p>
                <p className="text-xs text-muted-foreground">Ôn ngay để không quên</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations Preview - Enhanced */}
      <Card className="border-border/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            Gợi ý cho bạn
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <Link to="/practice" className="block">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 transition-all cursor-pointer group border border-transparent hover:border-primary/20">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">Luyện tập nhanh</p>
                <p className="text-xs text-muted-foreground">10 câu • ~5 phút</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
          
          <Link to="/flashcards/today" className="block">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-cyan-500/5 transition-all cursor-pointer group border border-transparent hover:border-cyan-500/20">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-cyan-500 transition-colors">Ôn flashcard</p>
                <p className="text-xs text-muted-foreground">Thẻ đến hạn ôn</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          <Link to="/practice/review" className="block">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/5 transition-all cursor-pointer group border border-transparent hover:border-red-500/20">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-red-500 transition-colors">Ôn câu sai</p>
                <p className="text-xs text-muted-foreground">Cải thiện điểm yếu</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Achievements Preview */}
      <Link to="/achievements" className="block">
        <AchievementsBadgeDisplay />
      </Link>

      {/* Motivational Quote */}
      <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardContent className="p-4 text-center">
          <p className="text-2xl mb-2">💪</p>
          <p className="text-sm font-medium text-foreground italic">"{randomQuote}"</p>
        </CardContent>
      </Card>

      {/* Study Tip - Enhanced */}
      <Card className="border-border/50 bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{randomTip.emoji}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />
                Mẹo học tập
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{randomTip.tip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="border-border/50">
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2">
            <Link to="/leaderboard">
              <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Award className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <p className="text-[10px] text-muted-foreground">Bảng xếp hạng</p>
              </div>
            </Link>
            <Link to="/courses">
              <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <p className="text-[10px] text-muted-foreground">Khóa học</p>
              </div>
            </Link>
            <Link to="/exams">
              <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <p className="text-[10px] text-muted-foreground">Đề thi</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

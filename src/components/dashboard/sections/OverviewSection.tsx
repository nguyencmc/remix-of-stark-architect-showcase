import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PracticeTodayWidget } from '@/components/dashboard/PracticeTodayWidget';
import { PracticeStatsWidget } from '@/components/dashboard/PracticeStatsWidget';

interface WeeklyProgress {
  day: string;
  attempts: number;
  correct: number;
}

interface OverviewSectionProps {
  stats: {
    totalExamsTaken: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    points: number;
    level: number;
  };
  weeklyProgress: WeeklyProgress[];
  levelProgress: number;
  pointsToNextLevel: number;
  accuracy: number;
}

export function OverviewSection({
  stats,
  weeklyProgress,
  levelProgress,
  pointsToNextLevel,
  accuracy,
}: OverviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Điểm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Độ chính xác</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.totalExamsTaken}</p>
                <p className="text-xs text-muted-foreground">Đề đã làm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.totalQuestionsAnswered}</p>
                <p className="text-xs text-muted-foreground">Tổng câu hỏi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PracticeTodayWidget />
        <PracticeStatsWidget />
      </div>

      {/* Level Progress */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5" />
            Tiến độ Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Level {stats.level}</span>
            <span className="text-sm text-muted-foreground">Level {stats.level + 1}</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Còn {pointsToNextLevel} điểm nữa để lên level
          </p>
        </CardContent>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-5 h-5" />
            Hoạt động tuần
          </CardTitle>
          <CardDescription>Số lượt làm bài theo ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyProgress.map((day, index) => {
              const maxAttempts = Math.max(...weeklyProgress.map(d => d.attempts), 1);
              const height = (day.attempts / maxAttempts) * 100;
              const isToday = index === new Date().getDay();
              
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-32">
                    <div 
                      className={`w-full max-w-8 rounded-t-md transition-all ${
                        isToday ? 'bg-primary' : 'bg-primary/30'
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className={`text-xs mt-2 ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                    {day.day}
                  </span>
                  <span className="text-xs text-muted-foreground">{day.attempts}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5" />
            Thống kê chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tổng câu hỏi đã trả lời</span>
            <span className="font-semibold">{stats.totalQuestionsAnswered}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Câu trả lời đúng
            </span>
            <span className="font-semibold text-green-600">{stats.totalCorrectAnswers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Câu trả lời sai
            </span>
            <span className="font-semibold text-red-600">
              {stats.totalQuestionsAnswered - stats.totalCorrectAnswers}
            </span>
          </div>
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Độ chính xác tổng</span>
              <span className="font-bold text-primary">{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Sun,
  Moon,
  Sunrise,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOverviewData } from './useOverviewData';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import type { OverviewSectionProps, WeeklyProgress } from './types';

function getGreeting(): { text: string; icon: React.ComponentType<{ className?: string }> } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Chào buổi sáng', icon: Sunrise };
  if (hour >= 12 && hour < 18) return { text: 'Chào buổi chiều', icon: Sun };
  return { text: 'Chào buổi tối', icon: Moon };
}

function WeeklyChart({ weeklyProgress }: { weeklyProgress: WeeklyProgress[] }) {
  const hoursData = weeklyProgress.map(d => ({ ...d, hours: d.attempts * 0.25 }));
  const maxHours = Math.max(...hoursData.map(d => d.hours), 2);
  const maxYAxis = Math.ceil(maxHours * 2) / 2;
  const yAxisSteps = Math.ceil(maxYAxis / 0.5) + 1;
  const yAxisLabels = Array.from({ length: Math.min(yAxisSteps, 9) }, (_, i) => {
    const step = maxYAxis / (Math.min(yAxisSteps, 9) - 1);
    return (maxYAxis - i * step).toFixed(1);
  });

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-5 h-5" />
          Hoạt động tuần này
        </CardTitle>
        <CardDescription>Thời gian học tập theo ngày (giờ)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex flex-col justify-between h-40 py-1 pr-1 text-right min-w-[28px]">
            {yAxisLabels.map((val, i) => (
              <span key={i} className="text-[10px] text-muted-foreground leading-none">
                {parseFloat(val) % 1 === 0 ? parseInt(val) : val}
              </span>
            ))}
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yAxisLabels.map((_, i) => (
                <div key={i} className={cn("w-full border-t", i === yAxisLabels.length - 1 ? "border-border" : "border-border/30 border-dashed")} />
              ))}
            </div>
            <div className="relative flex items-end justify-between gap-2 h-40">
              {hoursData.map((day, index) => {
                const height = maxYAxis > 0 ? (day.hours / maxYAxis) * 100 : 0;
                const isToday = index === new Date().getDay();
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center z-10">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <div
                        className={cn("w-full max-w-10 rounded-t-md transition-all relative group", isToday ? 'bg-primary' : 'bg-primary/40', day.hours > 0 && "hover:opacity-80 cursor-pointer")}
                        style={{ height: `${Math.max(height, 2)}%` }}
                      >
                        {day.hours > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {day.hours.toFixed(1)}h
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <div className="min-w-[28px]" />
          <div className="flex-1 flex justify-between">
            {weeklyProgress.map((day, index) => {
              const isToday = index === new Date().getDay();
              const hours = day.attempts * 0.25;
              return (
                <div key={day.day} className="flex-1 text-center">
                  <span className={cn("text-xs block", isToday ? 'font-bold text-primary' : 'text-muted-foreground')}>{day.day}</span>
                  <span className="text-[10px] text-muted-foreground">{hours > 0 ? `${hours.toFixed(1)}h` : '-'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewSection({
  stats,
  weeklyProgress,
  levelProgress: _levelProgress,
  pointsToNextLevel: _pointsToNextLevel,
  accuracy,
}: OverviewSectionProps) {
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const { continueLearning, displayName } = useOverviewData();

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GreetingIcon className="w-4 h-4" />
                <span className="text-sm">{greeting.text}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">{displayName}! 👋</h2>
              <p className="text-sm text-muted-foreground">🚀 Hãy tiếp tục hành trình học tập của bạn!</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold">{weeklyProgress.filter(d => d.attempts > 0).length}</span>
                </div>
                <p className="text-xs text-muted-foreground">ngày streak</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <QuickActions />
      <RecentActivity continueLearning={continueLearning} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Trophy} value={stats.points.toLocaleString()} label="Điểm" gradientFrom="from-primary/5" iconColor="text-primary" bgColor="bg-primary/10" />
        <StatCard icon={Target} value={`${accuracy}%`} label="Độ chính xác" gradientFrom="from-green-500/5" iconColor="text-green-500" bgColor="bg-green-500/10" />
        <StatCard icon={CheckCircle2} value={stats.totalExamsTaken} label="Đề đã làm" gradientFrom="from-purple-500/5" iconColor="text-purple-500" bgColor="bg-purple-500/10" />
        <StatCard icon={TrendingUp} value={stats.totalQuestionsAnswered} label="Tổng câu hỏi" gradientFrom="from-blue-500/5" iconColor="text-blue-500" bgColor="bg-blue-500/10" />
      </div>

      <WeeklyChart weeklyProgress={weeklyProgress} />
    </div>
  );
}

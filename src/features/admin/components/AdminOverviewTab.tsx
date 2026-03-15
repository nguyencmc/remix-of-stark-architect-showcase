import { Button } from '@/components/ui/button';
import { UserGrowthChart, PopularExamsChart, RecentActivitiesCard } from '@/components/admin/EnhancedDashboardCharts';
import { SystemHealthCheck } from '@/components/admin/SystemHealthCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  FileText,
  BookOpen,
  Headphones,
  Layers,
  TrendingUp,
  Activity,
  HelpCircle,
  GraduationCap,
  ArrowUpRight,
  Database,
  RefreshCw,
  PieChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stats, ContentDistribution } from '../types';

interface AdminOverviewTabProps {
  stats: Stats;
  refreshing: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}

export function AdminOverviewTab({ stats, refreshing, lastUpdated, onRefresh }: AdminOverviewTabProps) {
  const completionRate = stats.totalEnrollments > 0 ? Math.round((stats.completedCourses / stats.totalEnrollments) * 100) : 0;

  const contentDistribution: ContentDistribution[] = [
    { name: 'Khóa học', value: stats.totalCourses, color: 'bg-cyan-500', icon: GraduationCap },
    { name: 'Đề thi', value: stats.totalExams, color: 'bg-purple-500', icon: FileText },
    { name: 'Câu hỏi', value: stats.totalQuestions, color: 'bg-teal-500', icon: HelpCircle },
    { name: 'Flashcard', value: stats.totalFlashcardSets, color: 'bg-orange-500', icon: Layers },
    { name: 'Podcast', value: stats.totalPodcasts, color: 'bg-pink-500', icon: Headphones },
    { name: 'Sách', value: stats.totalBooks, color: 'bg-amber-500', icon: BookOpen },
  ];

  const totalContent = contentDistribution.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            System Monitoring
          </h2>
          <p className="text-sm text-muted-foreground">
            Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                <p className="text-3xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{stats.newUsersToday}</span>
                  <span className="text-muted-foreground">hôm nay</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card className="border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đăng ký khóa học</p>
                <p className="text-3xl font-bold mt-1">{stats.totalEnrollments.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <span className="text-muted-foreground">{completionRate}% hoàn thành</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Exam Attempts */}
        <Card className="border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lượt làm bài</p>
                <p className="text-3xl font-bold mt-1">{stats.totalAttempts.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                  <span className="text-muted-foreground">Đang hoạt động</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Content */}
        <Card className="border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng nội dung</p>
                <p className="text-3xl font-bold mt-1">{totalContent.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Database className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Đa dạng</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row - Enhanced with real recharts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <PopularExamsChart />
      </div>

      {/* Content Distribution */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" />
            Phân bố nội dung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {contentDistribution.map((item) => {
              const percentage = totalContent > 0 ? (item.value / totalContent) * 100 : 0;
              return (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color + '/10')}>
                    <item.icon className={cn("w-4 h-4", item.color.replace('bg-', 'text-'))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all", item.color)}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Growth Stats */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Tăng trưởng người dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-3xl font-bold text-green-600">+{stats.newUsersToday}</p>
              <p className="text-sm text-muted-foreground mt-1">Hôm nay</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <p className="text-3xl font-bold text-blue-600">+{stats.newUsersThisWeek}</p>
              <p className="text-sm text-muted-foreground mt-1">Tuần này</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <p className="text-3xl font-bold text-purple-600">+{stats.newUsersThisMonth}</p>
              <p className="text-sm text-muted-foreground mt-1">Tháng này</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <GraduationCap className="w-5 h-5 mx-auto mb-1 text-cyan-500" />
            <p className="text-lg font-bold">{stats.totalCourses}</p>
            <p className="text-xs text-muted-foreground">Khóa học</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1 text-purple-500" />
            <p className="text-lg font-bold">{stats.totalExams}</p>
            <p className="text-xs text-muted-foreground">Đề thi</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <HelpCircle className="w-5 h-5 mx-auto mb-1 text-teal-500" />
            <p className="text-lg font-bold">{stats.totalQuestions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Câu hỏi</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <Layers className="w-5 h-5 mx-auto mb-1 text-orange-500" />
            <p className="text-lg font-bold">{stats.totalFlashcardSets}</p>
            <p className="text-xs text-muted-foreground">Flashcard</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <Headphones className="w-5 h-5 mx-auto mb-1 text-pink-500" />
            <p className="text-lg font-bold">{stats.totalPodcasts}</p>
            <p className="text-xs text-muted-foreground">Podcast</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold">{stats.totalBooks}</p>
            <p className="text-xs text-muted-foreground">Sách</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities + System Health */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivitiesCard />
        <SystemHealthCheck />
      </div>
    </div>
  );
}

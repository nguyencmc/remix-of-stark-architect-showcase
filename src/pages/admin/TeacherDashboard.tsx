import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Headphones, 
  Layers,
  GraduationCap,
  ChevronRight,
  Plus,
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Eye,
  Clock,
  BarChart3,
  Settings,
  FolderOpen,
  Sparkles,
  Target,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface Stats {
  totalExams: number;
  totalQuestions: number;
  totalFlashcardSets: number;
  totalPodcasts: number;
  totalCourses: number;
  totalStudents: number;
  totalClasses: number;
  avgRating: number;
}

interface RecentItem {
  id: string;
  title: string;
  type: 'exam' | 'course' | 'flashcard' | 'podcast' | 'class';
  created_at: string;
  stats?: string;
}

interface CourseWithStats {
  id: string;
  title: string;
  image_url: string | null;
  student_count: number;
  rating: number | null;
  is_published: boolean;
  created_at: string;
}

type DashboardTab = 'overview' | 'courses' | 'exams' | 'content' | 'analytics';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { isTeacher, isAdmin, hasAnyPermission, hasPermission, loading: roleLoading } = usePermissionsContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [stats, setStats] = useState<Stats>({
    totalExams: 0,
    totalQuestions: 0,
    totalFlashcardSets: 0,
    totalPodcasts: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalClasses: 0,
    avgRating: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [myCourses, setMyCourses] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is a teacher (not admin accessing teacher panel)
  // Teacher Dashboard is exclusive to teachers, admins should use Admin Dashboard
  const hasAccess = isTeacher && !isAdmin && hasAnyPermission([
    'exams.view', 'courses.view', 'flashcards.view', 'podcasts.view', 'questions.view'
  ]);

  const canCreateExams = hasPermission('exams.create');
  const canCreateCourses = hasPermission('courses.create');
  const canCreateFlashcards = hasPermission('flashcards.create');
  const canCreatePodcasts = hasPermission('podcasts.create');

  useEffect(() => {
    if (!roleLoading && !hasAccess) {
      navigate('/');
      toast({
        title: "Không có quyền truy cập",
        description: "Trang này chỉ dành cho giảng viên (Teacher)",
        variant: "destructive",
      });
    }
  }, [hasAccess, roleLoading, navigate, toast]);

  useEffect(() => {
    if (hasAccess && user) {
      fetchData();
    }
  }, [hasAccess, user]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all stats in parallel
    const [
      { count: examsCount },
      { count: questionsCount },
      { count: flashcardsCount },
      { count: podcastsCount },
      { data: coursesData },
      { data: classesData },
    ] = await Promise.all([
      supabase.from('exams').select('*', { count: 'exact', head: true }).eq('creator_id', user?.id),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('flashcard_sets').select('*', { count: 'exact', head: true }).eq('creator_id', user?.id),
      supabase.from('podcasts').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('id, title, image_url, student_count, rating, is_published, created_at').eq('creator_id', user?.id).order('created_at', { ascending: false }),
      supabase.from('classes').select('id').eq('creator_id', user?.id),
    ]);

    // Calculate total students from enrollments
    let totalStudents = 0;
    let avgRating = 0;
    
    if (coursesData && coursesData.length > 0) {
      totalStudents = coursesData.reduce((sum, c) => sum + (c.student_count || 0), 0);
      const ratings = coursesData.filter(c => c.rating).map(c => c.rating!);
      if (ratings.length > 0) {
        avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      }
      setMyCourses(coursesData as CourseWithStats[]);
    }

    setStats({
      totalExams: examsCount || 0,
      totalQuestions: questionsCount || 0,
      totalFlashcardSets: flashcardsCount || 0,
      totalPodcasts: podcastsCount || 0,
      totalCourses: coursesData?.length || 0,
      totalStudents,
      totalClasses: classesData?.length || 0,
      avgRating: Math.round(avgRating * 10) / 10,
    });

    // Fetch recent items
    const { data: recentExams } = await supabase
      .from('exams')
      .select('id, title, created_at')
      .eq('creator_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentCourses } = await supabase
      .from('courses')
      .select('id, title, created_at, student_count')
      .eq('creator_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const items: RecentItem[] = [
      ...(recentExams || []).map(e => ({
        id: e.id,
        title: e.title,
        type: 'exam' as const,
        created_at: e.created_at,
      })),
      ...(recentCourses || []).map(c => ({
        id: c.id,
        title: c.title,
        type: 'course' as const,
        created_at: c.created_at,
        stats: `${c.student_count || 0} học viên`,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    setRecentItems(items);
    setLoading(false);
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  const sidebarItems = [
    { id: 'overview' as const, label: 'Tổng quan', icon: BarChart3, color: 'text-primary' },
    { id: 'courses' as const, label: 'Khóa học', icon: GraduationCap, color: 'text-cyan-500' },
    { id: 'exams' as const, label: 'Đề thi', icon: FileText, color: 'text-purple-500' },
    { id: 'content' as const, label: 'Nội dung', icon: FolderOpen, color: 'text-orange-500' },
    { id: 'analytics' as const, label: 'Phân tích', icon: TrendingUp, color: 'text-green-500' },
  ];

  const quickCreateItems = [
    { label: 'Khóa học mới', icon: GraduationCap, href: '/admin/courses/create', color: 'bg-cyan-500', enabled: canCreateCourses },
    { label: 'Đề thi mới', icon: FileText, href: '/admin/exams/create', color: 'bg-purple-500', enabled: canCreateExams },
    { label: 'Flashcard', icon: Layers, href: '/admin/flashcards/create', color: 'bg-orange-500', enabled: canCreateFlashcards },
    { label: 'Podcast', icon: Headphones, href: '/admin/podcasts/create', color: 'bg-pink-500', enabled: canCreatePodcasts },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getTypeIcon = (type: RecentItem['type']) => {
    switch (type) {
      case 'exam': return FileText;
      case 'course': return GraduationCap;
      case 'flashcard': return Layers;
      case 'podcast': return Headphones;
      case 'class': return Users;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: RecentItem['type']) => {
    switch (type) {
      case 'exam': return 'text-purple-500 bg-purple-500/10';
      case 'course': return 'text-cyan-500 bg-cyan-500/10';
      case 'flashcard': return 'text-orange-500 bg-orange-500/10';
      case 'podcast': return 'text-pink-500 bg-pink-500/10';
      case 'class': return 'text-indigo-500 bg-indigo-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
                <p className="text-sm text-muted-foreground">Khóa học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Học viên</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgRating || '-'}</p>
                <p className="text-sm text-muted-foreground">Đánh giá TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
                <p className="text-sm text-muted-foreground">Đề thi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Create */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Tạo nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickCreateItems.filter(item => item.enabled).map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : recentItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có hoạt động nào</p>
              <p className="text-sm mt-1">Bắt đầu tạo nội dung mới!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => {
                const Icon = getTypeIcon(item.type);
                const colorClass = getTypeColor(item.type);
                const [textColor, bgColor] = colorClass.split(' ');
                return (
                  <Link 
                    key={`${item.type}-${item.id}`}
                    to={item.type === 'course' ? `/admin/courses/${item.id}` : `/admin/${item.type}s/${item.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.stats || formatDate(item.created_at)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCoursesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Khóa học của tôi</h2>
        {canCreateCourses && (
          <Link to="/admin/courses/create">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo khóa học
            </Button>
          </Link>
        )}
      </div>

      {myCourses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có khóa học nào</h3>
            <p className="text-muted-foreground mb-4">Tạo khóa học đầu tiên để bắt đầu</p>
            {canCreateCourses && (
              <Link to="/admin/courses/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo khóa học
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myCourses.map((course) => (
            <Link key={course.id} to={`/admin/courses/${course.id}`}>
              <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className={`absolute top-2 right-2 ${course.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {course.is_published ? 'Đã xuất bản' : 'Nháp'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1 mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.student_count || 0}
                    </span>
                    {course.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {course.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link to="/admin/courses">
          <Button variant="outline">
            Xem tất cả khóa học
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );

  const renderExamsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý đề thi</h2>
        {canCreateExams && (
          <Link to="/admin/exams/create">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo đề thi
            </Button>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/exams">
          <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Đề thi</h3>
                <p className="text-sm text-muted-foreground">{stats.totalExams} đề thi</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/question-sets">
          <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Bộ câu hỏi luyện tập</h3>
                <p className="text-sm text-muted-foreground">Quản lý câu hỏi</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Quản lý nội dung</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/flashcards">
          <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Flashcard</h3>
                <p className="text-sm text-muted-foreground">{stats.totalFlashcardSets} bộ thẻ</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/podcasts">
          <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-pink-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Podcast</h3>
                <p className="text-sm text-muted-foreground">{stats.totalPodcasts} bài nghe</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/classes">
          <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Lớp học</h3>
                <p className="text-sm text-muted-foreground">{stats.totalClasses} lớp học</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/categories">
          <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Danh mục</h3>
                <p className="text-sm text-muted-foreground">Quản lý phân loại</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Phân tích & Thống kê</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Tổng quan hiệu suất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng học viên</span>
              <span className="font-semibold">{stats.totalStudents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Đánh giá trung bình</span>
              <span className="font-semibold flex items-center gap-1">
                {stats.avgRating || '-'}
                <Star className="w-4 h-4 text-yellow-500" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Khóa học đã xuất bản</span>
              <span className="font-semibold">{myCourses.filter(c => c.is_published).length}/{stats.totalCourses}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Nội dung đã tạo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-cyan-500" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Khóa học</span>
                  <span className="font-medium">{stats.totalCourses}</span>
                </div>
                <Progress value={Math.min(stats.totalCourses * 10, 100)} className="h-1.5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Đề thi</span>
                  <span className="font-medium">{stats.totalExams}</span>
                </div>
                <Progress value={Math.min(stats.totalExams * 5, 100)} className="h-1.5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-orange-500" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Flashcard</span>
                  <span className="font-medium">{stats.totalFlashcardSets}</span>
                </div>
                <Progress value={Math.min(stats.totalFlashcardSets * 5, 100)} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="py-8 text-center">
          <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">Thống kê chi tiết đang phát triển</h3>
          <p className="text-sm text-muted-foreground">
            Biểu đồ xu hướng, doanh thu, và phân tích học viên sẽ sớm ra mắt
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'courses': return renderCoursesTab();
      case 'exams': return renderExamsTab();
      case 'content': return renderContentTab();
      case 'analytics': return renderAnalyticsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-sm text-muted-foreground">Tạo và quản lý nội dung học tập</p>
            </div>
          </div>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                Chuyển sang Admin
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <nav className="space-y-1 sticky top-24">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", activeTab === item.id ? item.color : "")} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)}>
              <TabsList className="grid w-full grid-cols-5">
                {sidebarItems.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} className="text-xs px-2">
                    <item.icon className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Target,
  Plus,
  FileQuestion,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Lock,
  Globe,
  PlayCircle,
  Search,
  FileCheck,
  Filter,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

interface QuestionSet {
  id: string;
  title: string;
  description: string | null;
  level: string;
  question_count: number;
  is_published: boolean;
  created_at: string;
  tags: string[];
}

export default function QuestionBankPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMySets();
  }, [user]);

  const fetchMySets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('question_sets')
      .select('*')
      .eq('creator_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSets(data);
    }
    setLoading(false);
  };

  const filteredSets = useMemo(() => {
    return sets.filter((set) => {
      const matchesSearch =
        set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === 'all' || set.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [sets, searchQuery, levelFilter]);

  const togglePublish = async (set: QuestionSet) => {
    const newStatus = !set.is_published;
    const { error } = await supabase
      .from('question_sets')
      .update({ is_published: newStatus })
      .eq('id', set.id);

    if (error) {
      toast.error('Không thể cập nhật trạng thái');
      return;
    }

    setSets(prev =>
      prev.map(s => (s.id === set.id ? { ...s, is_published: newStatus } : s))
    );

    toast.success(
      newStatus
        ? 'Đề thi đã được công khai'
        : 'Đề thi đã chuyển sang riêng tư'
    );
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    await supabase.from('practice_questions').delete().eq('set_id', deleteId);
    const { error } = await supabase
      .from('question_sets')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast.error('Không thể xóa bộ đề');
    } else {
      toast.success('Đã xóa bộ đề');
      setSets(prev => prev.filter(s => s.id !== deleteId));
    }

    setDeleting(false);
    setDeleteId(null);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'easy':
        return { label: 'Dễ', variant: 'secondary' as const, color: 'text-green-600' };
      case 'medium':
        return { label: 'Trung bình', variant: 'default' as const, color: 'text-yellow-600' };
      case 'hard':
        return { label: 'Khó', variant: 'destructive' as const, color: 'text-red-600' };
      default:
        return { label: level, variant: 'outline' as const, color: '' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Ngân hàng câu hỏi
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý và luyện tập các bộ đề của bạn
            </p>
          </div>
          <Button onClick={() => navigate('/practice/create')} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Tạo bộ đề mới
          </Button>
        </div>

        {/* Mode Description */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8 p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <PlayCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Luyện tập</h4>
              <p className="text-xs text-muted-foreground">Xem đáp án ngay sau mỗi câu. Phù hợp để học và ghi nhớ.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Thi thử</h4>
              <p className="text-xs text-muted-foreground">Đánh giá năng lực với timer. Xem kết quả sau khi nộp bài.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bộ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-primary/5">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{sets.length}</div>
              <p className="text-sm text-muted-foreground">Tổng số bộ đề</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {sets.reduce((acc, s) => acc + (s.question_count || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Tổng câu hỏi</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {sets.filter(s => s.is_published).length}
              </div>
              <p className="text-sm text-muted-foreground">Đã công khai</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-muted-foreground">
                {sets.filter(s => !s.is_published).length}
              </div>
              <p className="text-sm text-muted-foreground">Riêng tư</p>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSets.length === 0 && (
          <div className="text-center py-16">
            {searchQuery || levelFilter !== 'all' ? (
              <>
                <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy bộ đề</h3>
                <p className="text-muted-foreground mb-6">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </>
            ) : (
              <>
                <FileQuestion className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chưa có bộ đề nào</h3>
                <p className="text-muted-foreground mb-6">
                  Tạo bộ đề đầu tiên để bắt đầu luyện tập
                </p>
                <Button size="lg" onClick={() => navigate('/practice/create')}>
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo bộ đề đầu tiên
                </Button>
              </>
            )}
          </div>
        )}

        {/* Question Sets Grid */}
        {!loading && filteredSets.length > 0 && (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSets.map((set) => {
              const levelInfo = getLevelBadge(set.level);
              return (
                <Card 
                  key={set.id} 
                  className="group hover:shadow-lg transition-all border-border/50 overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Header with gradient */}
                    <div className="relative p-4 pb-3 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <FileQuestion className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {set.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant={levelInfo.variant} className="text-xs">
                                {levelInfo.label}
                              </Badge>
                              {set.is_published ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600">
                                  <Globe className="w-3 h-3" />
                                  Public
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Lock className="w-3 h-3" />
                                  Private
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* 3-dot menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/practice/edit/${set.id}`)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublish(set)}>
                              {set.is_published ? (
                                <>
                                  <Lock className="w-4 h-4 mr-2" />
                                  Chuyển riêng tư
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Công khai (chia sẻ)
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(set.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-2 space-y-3">
                      {set.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {set.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {set.question_count} câu hỏi
                        </span>
                      </div>

                      {/* Tags */}
                      {set.tags && set.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {set.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {set.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{set.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          size="sm"
                          onClick={() => navigate(`/practice/setup/${set.id}`)}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Luyện tập
                        </Button>
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => navigate(`/practice/exam-setup/${set.id}`)}
                        >
                          <FileCheck className="mr-2 h-4 w-4" />
                          Thi thử
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bộ đề?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả câu hỏi trong bộ đề sẽ bị
              xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

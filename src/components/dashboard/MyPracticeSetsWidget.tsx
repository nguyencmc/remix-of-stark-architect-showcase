import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

export function MyPracticeSetsWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMySets();
    }
  }, [user]);

  const fetchMySets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('question_sets')
      .select('*')
      .eq('creator_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setSets(data);
    }
    setLoading(false);
  };

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
        ? 'Đề thi đã được công khai - hiển thị trong phần Đề thi'
        : 'Đề thi đã chuyển sang riêng tư'
    );
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    // Delete questions first
    await supabase.from('practice_questions').delete().eq('set_id', deleteId);

    // Delete the set
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
        return { label: 'Dễ', variant: 'secondary' as const };
      case 'medium':
        return { label: 'TB', variant: 'default' as const };
      case 'hard':
        return { label: 'Khó', variant: 'destructive' as const };
      default:
        return { label: level, variant: 'outline' as const };
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-primary" />
            Bộ đề của tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              Bộ đề của tôi
            </CardTitle>
            <Button size="sm" onClick={() => navigate('/practice/create')}>
              <Plus className="w-4 h-4 mr-1" />
              Tạo mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sets.length === 0 ? (
            <div className="text-center py-8">
              <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">
                Bạn chưa có bộ đề nào
              </p>
              <Button onClick={() => navigate('/practice/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo bộ đề đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sets.map(set => {
                const levelBadge = getLevelBadge(set.level);
                return (
                  <div
                    key={set.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{set.title}</span>
                        <Badge variant={levelBadge.variant} className="shrink-0 text-xs">
                          {levelBadge.label}
                        </Badge>
                        {set.is_published ? (
                          <Globe className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {set.question_count} câu hỏi
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/practice/setup/${set.id}`)}
                      >
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
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
                );
              })}

              {sets.length >= 5 && (
                <div className="text-center pt-2">
                  <Link to="/practice/my-sets">
                    <Button variant="link" size="sm">
                      Xem tất cả →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
    </>
  );
}

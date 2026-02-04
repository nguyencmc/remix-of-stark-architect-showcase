import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useArticles } from '../hooks';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArticleStatus } from '../types';

const statusConfig: Record<ArticleStatus, { label: string; icon: React.ComponentType<{ className?: string }>; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: 'Bản nháp', icon: FileText, variant: 'secondary' },
  pending: { label: 'Chờ duyệt', icon: Clock, variant: 'outline' },
  approved: { label: 'Đã duyệt', icon: CheckCircle, variant: 'default' },
  rejected: { label: 'Từ chối', icon: XCircle, variant: 'destructive' },
};

const MyArticlesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ArticleStatus | 'all'>('all');
  
  const { articles, loading, deleteArticle } = useArticles({
    authorId: user?.id,
    status: activeTab !== 'all' ? activeTab : undefined,
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: 0, draft: 0, pending: 0, approved: 0, rejected: 0 };
    articles.forEach(a => {
      counts.all++;
      counts[a.status]++;
    });
    return counts;
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Bài viết', href: '/articles' },
            { label: 'Bài viết của tôi' },
          ]}
          backHref="/articles"
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Bài viết của tôi</h1>
            <Button onClick={() => navigate('/articles/create')} className="gap-2">
              <Plus className="w-4 h-4" />
              Viết bài mới
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                Tất cả ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="draft">
                Bản nháp ({counts.draft})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Chờ duyệt ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Đã duyệt ({counts.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Từ chối ({counts.rejected})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-muted rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : articles.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {activeTab === 'all' 
                        ? 'Bạn chưa có bài viết nào' 
                        : `Không có bài viết nào ở trạng thái "${statusConfig[activeTab as ArticleStatus]?.label}"`}
                    </p>
                    <Button onClick={() => navigate('/articles/create')}>
                      Viết bài đầu tiên
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Lượt xem</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => {
                        const status = statusConfig[article.status];
                        const StatusIcon = status.icon;
                        
                        return (
                          <TableRow key={article.id}>
                            <TableCell>
                              <div className="max-w-md">
                                <Link 
                                  to={article.status === 'approved' ? `/articles/${article.slug}` : '#'}
                                  className={article.status === 'approved' ? 'hover:text-primary font-medium' : 'font-medium'}
                                >
                                  {article.title}
                                </Link>
                                {article.status === 'rejected' && article.rejection_reason && (
                                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {article.rejection_reason}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant} className="gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                {article.view_count}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(new Date(article.created_at), { 
                                addSuffix: true, 
                                locale: vi 
                              })}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {article.status === 'approved' && (
                                    <DropdownMenuItem onClick={() => navigate(`/articles/${article.slug}`)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Xem bài viết
                                    </DropdownMenuItem>
                                  )}
                                  {(article.status === 'draft' || article.status === 'rejected') && (
                                    <DropdownMenuItem onClick={() => navigate(`/articles/edit/${article.slug}`)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem 
                                        className="text-destructive"
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Bài viết "{article.title}" sẽ bị xóa vĩnh viễn.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteArticle(article.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Xóa
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyArticlesPage;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useArticles, useArticleCategories } from '../hooks';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  Eye, 
  MessageSquare, 
  Clock, 
  User,
  ChevronRight,
  FileText,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ArticlesListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { articles, loading } = useArticles({
    status: 'approved',
    searchQuery,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
  });
  
  const { categories } = useArticleCategories();

  const featuredArticles = articles.filter(a => a.is_featured).slice(0, 3);
  const recentArticles = articles.filter(a => !a.is_featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Bài viết' },
          ]}
          backHref="/"
        />

        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-primary" />
                Bài viết chia sẻ
              </h1>
              <p className="text-muted-foreground mt-1">
                Khám phá các bài viết hay từ cộng đồng
              </p>
            </div>
            {user && (
              <Button onClick={() => navigate('/articles/create')} className="gap-2">
                <Plus className="w-4 h-4" />
                Viết bài mới
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Tất cả
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Featured Articles */}
            {featuredArticles.length > 0 && selectedCategory === 'all' && (
              <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Bài viết nổi bật
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {featuredArticles.map((article, index) => (
                    <Link 
                      key={article.id} 
                      to={`/articles/${article.slug}`}
                      className={cn(
                        "group",
                        index === 0 && "lg:col-span-2 lg:row-span-2"
                      )}
                    >
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={cn(
                          "relative overflow-hidden",
                          index === 0 ? "aspect-[16/9] lg:aspect-[16/10]" : "aspect-video"
                        )}>
                          {article.thumbnail_url ? (
                            <img 
                              src={article.thumbnail_url} 
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <FileText className="w-12 h-12 text-primary/50" />
                            </div>
                          )}
                          <Badge className="absolute top-3 left-3">Nổi bật</Badge>
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2">
                            {article.category?.name || 'Chưa phân loại'}
                          </Badge>
                          <h3 className={cn(
                            "font-semibold line-clamp-2 group-hover:text-primary transition-colors",
                            index === 0 ? "text-xl" : "text-base"
                          )}>
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={article.author?.avatar_url || ''} />
                                <AvatarFallback>
                                  {article.author?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{article.author?.full_name || 'Ẩn danh'}</span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {article.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {article.comment_count}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategory === 'all' ? 'Bài viết mới nhất' : 'Kết quả'}
              </h2>
              {recentArticles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chưa có bài viết nào</p>
                  {user && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/articles/create')}
                    >
                      Viết bài đầu tiên
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentArticles.map((article) => (
                    <Link key={article.id} to={`/articles/${article.slug}`} className="group">
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video overflow-hidden">
                          {article.thumbnail_url ? (
                            <img 
                              src={article.thumbnail_url} 
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                              <FileText className="w-10 h-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {article.category?.name || 'Chưa phân loại'}
                          </Badge>
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={article.author?.avatar_url || ''} />
                                <AvatarFallback className="text-xs">
                                  {article.author?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate max-w-[100px]">
                                {article.author?.full_name || 'Ẩn danh'}
                              </span>
                            </div>
                            <span className="flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(article.created_at), { 
                                addSuffix: true, 
                                locale: vi 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.view_count} lượt xem
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {article.comment_count} bình luận
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesListPage;

import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useArticle, useArticleComments, useArticles } from '../hooks';
import {
  ArticleHeader,
  ArticleContent,
  ArticleShareButtons,
  ArticleRelatedSection,
  ArticleCommentSection,
  ArticleSidebar,
  BackToTopButton,
} from '../components';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { article, loading, error } = useArticle(slug);
  const { comments, addComment, deleteComment } = useArticleComments(article?.id);

  // Get related articles
  const { articles: allArticles } = useArticles({ status: 'approved' });
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return allArticles
      .filter(a => a.id !== article.id && a.category_id === article.category_id)
      .slice(0, 4);
  }, [allArticles, article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-1 max-w-4xl">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="aspect-video bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            </main>
            <aside className="w-full lg:w-80 shrink-0">
              <div className="animate-pulse space-y-4">
                <div className="h-40 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <PageHeader
            breadcrumbs={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Bài viết', href: '/articles' },
              { label: 'Không tìm thấy' },
            ]}
            backHref="/articles"
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy bài viết</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/articles')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === article.author_id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Bài viết', href: '/articles' },
            { label: article.title },
          ]}
          backHref="/articles"
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <main className="flex-1 min-w-0 max-w-4xl">
            <article>
              <ArticleHeader
                article={article}
                isAuthor={isAuthor}
                onEdit={() => navigate(`/articles/edit/${article.slug}`)}
              />
              <ArticleContent article={article} />
              <ArticleShareButtons title={article.title} />
              <ArticleRelatedSection articles={relatedArticles} />
              <Separator className="my-8" />
              <ArticleCommentSection
                commentCount={article.comment_count ?? 0}
                comments={comments}
                user={user}
                addComment={addComment}
                deleteComment={deleteComment}
              />
            </article>
          </main>

          <ArticleSidebar
            featuredArticles={relatedArticles}
            className="w-full lg:w-80 shrink-0"
          />
        </div>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default ArticleDetailPage;

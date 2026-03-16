import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Eye, MessageSquare, Edit, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Article } from '../types';

interface ArticleHeaderProps {
  article: Article;
  isAuthor: boolean;
  onEdit: () => void;
}

export function ArticleHeader({ article, isAuthor, onEdit }: ArticleHeaderProps) {
  return (
    <header className="mb-6">
      {/* Tags and Category */}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.category && (
          <Badge className="bg-primary/90">
            {article.category.name}
          </Badge>
        )}
        {article.tags?.map((tag) => (
          <Badge key={tag} variant="outline">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {article.title}
      </h1>

      {/* Author and Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Link to={article.author?.username ? `/@${article.author.username}` : '#'}>
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={article.author?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {article.author?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              to={article.author?.username ? `/@${article.author.username}` : '#'}
              className="font-semibold hover:text-primary transition-colors"
            >
              {article.author?.full_name || 'Ẩn danh'}
            </Link>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(article.published_at || article.created_at), 'dd/MM/yyyy', { locale: vi })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(article.view_count ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {article.comment_count ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthor && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1"
            >
              <Edit className="w-4 h-4" />
              Sửa
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

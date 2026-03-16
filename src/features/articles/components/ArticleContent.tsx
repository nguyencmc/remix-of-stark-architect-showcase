import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { HtmlContent } from '@/components/ui/HtmlContent';
import type { Article } from '../types';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <>
      {/* Thumbnail */}
      {article.thumbnail_url && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <HtmlContent
        html={article.content}
        className="prose-lg mb-8"
      />

      {/* Tags at bottom */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex items-center gap-2 py-4 border-t border-b mb-6">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link key={tag} to={`/articles?tag=${tag}`}>
                <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

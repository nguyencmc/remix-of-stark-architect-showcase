import { BookOpen } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import type { Article } from '../types';

interface ArticleRelatedSectionProps {
  articles: Article[];
}

export function ArticleRelatedSection({ articles }: ArticleRelatedSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Bài viết liên quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((related) => (
          <ArticleCard
            key={related.id}
            article={related}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}

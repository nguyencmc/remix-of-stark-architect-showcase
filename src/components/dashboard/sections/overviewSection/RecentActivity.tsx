import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, ChevronRight } from 'lucide-react';
import type { ContinueLearningItem } from './types';

function formatLastActivity(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

interface RecentActivityProps {
  continueLearning: ContinueLearningItem[];
}

export function RecentActivity({ continueLearning }: RecentActivityProps) {
  if (continueLearning.length === 0) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Tiếp tục học
          </CardTitle>
          <Link to="/dashboard?section=my-courses">
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Xem tất cả
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {continueLearning.map((item) => (
          <Link
            key={item.id}
            to={item.type === 'course' ? `/courses/${item.slug}` : '#'}
            className="block"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={item.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.progress}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatLastActivity(item.lastActivity)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

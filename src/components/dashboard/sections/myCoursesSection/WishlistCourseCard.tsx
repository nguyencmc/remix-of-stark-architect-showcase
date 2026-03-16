import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { WishlistCourse } from './types';

interface WishlistCourseCardProps {
  item: WishlistCourse;
}

export function WishlistCourseCard({ item }: WishlistCourseCardProps) {
  return (
    <Link to={`/course/${item.course_id}`}>
      <Card className="border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
        <div className="aspect-video relative bg-muted">
          {item.course.image_url ? (
            <img
              src={item.course.image_url}
              alt={item.course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {item.course.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {item.course.creator_name || 'AI-Exam.cloud'}
          </p>
          {item.course.price !== null && (
            <p className="text-sm font-bold text-primary mt-2">
              {item.course.price === 0 ? 'Miễn phí' : `${item.course.price.toLocaleString()}đ`}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

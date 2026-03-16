import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import type { EnrolledCourse } from './types';

interface EnrolledCourseCardProps {
  course: EnrolledCourse;
  type: 'enrolled' | 'completed';
}

function formatLastActivity(dateString?: string) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return date.toLocaleDateString('vi-VN');
}

export function EnrolledCourseCard({ course, type }: EnrolledCourseCardProps) {
  const progress = course.progress_percentage || 0;
  const completedLessons = course.completed_lessons || 0;
  const totalLessons = course.course.lesson_count || 0;

  return (
    <Link to={`/course/${course.course_id}/learn`}>
      <Card className="border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
        <div className="aspect-video relative bg-muted">
          {course.course.image_url ? (
            <img
              src={course.course.image_url}
              alt={course.course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {type === 'completed' && (
            <Badge className="absolute top-2 right-2 bg-emerald-500 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Hoàn thành
            </Badge>
          )}
          {type === 'enrolled' && progress > 0 && (
            <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
              Đang học
            </Badge>
          )}
          {course.course.level && (
            <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
              {course.course.level}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {course.course.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {course.course.creator_name || 'AI-Exam.cloud'}
          </p>

          {type === 'enrolled' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {completedLessons}/{totalLessons} bài học
                </span>
                <span className="font-medium text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {course.last_activity && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Học gần nhất: {formatLastActivity(course.last_activity)}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {totalLessons} bài
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.course.duration_hours || 0}h
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

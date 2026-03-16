import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Lesson, LessonProgress, Section } from '../types';

interface ViewerLessonNavProps {
  sections: Section[];
  currentLesson: Lesson | null;
  progress: Map<string, LessonProgress>;
  onNavigate: (direction: 'prev' | 'next') => void;
  onMarkComplete: (lessonId: string) => void;
}

export function ViewerLessonNav({
  sections,
  currentLesson,
  progress,
  onNavigate,
  onMarkComplete,
}: ViewerLessonNavProps) {
  const allLessons = sections.flatMap(s => s.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const isCompleted = currentLesson ? progress.get(currentLesson.id)?.is_completed : false;

  return (
    <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate('prev')}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Bài trước
      </Button>

      <div className="flex items-center gap-2">
        {currentLesson && !isCompleted && (
          <Button
            size="sm"
            onClick={() => onMarkComplete(currentLesson.id)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Hoàn thành bài học
          </Button>
        )}
        {currentLesson && isCompleted && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã hoàn thành
          </Badge>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate('next')}
        disabled={currentIndex === allLessons.length - 1}
      >
        Bài tiếp
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

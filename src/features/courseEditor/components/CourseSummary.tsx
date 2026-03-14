import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CourseSection } from '@/features/courseEditor/types';

interface CourseSummaryProps {
  sections: CourseSection[];
}

export function CourseSummary({ sections }: CourseSummaryProps) {
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalHours = Math.round(
    sections.reduce(
      (acc, s) => acc + s.lessons.reduce((la, l) => la + (l.duration_minutes || 0), 0),
      0
    ) / 60
  );

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Tóm tắt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số phần:</span>
            <span>{sections.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số bài học:</span>
            <span>{totalLessons}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng thời lượng:</span>
            <span>{totalHours}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

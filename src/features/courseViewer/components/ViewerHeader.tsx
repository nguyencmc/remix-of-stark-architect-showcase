import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';

interface ViewerHeaderProps {
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ViewerHeader({
  courseId,
  courseTitle,
  progressPercentage,
  sidebarOpen,
  onToggleSidebar,
}: ViewerHeaderProps) {
  return (
    <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to={`/course/${courseId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="hidden sm:block">
          <h1 className="font-semibold text-sm truncate max-w-md">{courseTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Progress value={progressPercentage} className="w-32 h-2" />
          <span className="text-sm text-muted-foreground">
            {progressPercentage}%
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
    </header>
  );
}

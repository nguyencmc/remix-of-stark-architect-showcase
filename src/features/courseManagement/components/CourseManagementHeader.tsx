import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, ArrowLeft } from 'lucide-react';

interface CourseManagementHeaderProps {
  isAdmin: boolean;
  canCreate: boolean;
  courseCount: number;
}

export function CourseManagementHeader({ isAdmin, canCreate, courseCount }: CourseManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Link to={isAdmin ? "/admin" : "/teacher"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            Quản lý khóa học
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? `${courseCount} khóa học` : `${courseCount} khóa học của bạn`}
          </p>
        </div>
      </div>
      {canCreate && (
        <Link to="/admin/courses/create">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Tạo khóa học mới
          </Button>
        </Link>
      )}
    </div>
  );
}

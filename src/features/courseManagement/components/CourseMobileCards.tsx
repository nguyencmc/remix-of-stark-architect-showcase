import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Users,
  Star,
  Clock,
  Eye,
  EyeOff,
  MoreVertical,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReactNode } from 'react';
import type { Course } from '../types';

interface CourseMobileCardsProps {
  loading: boolean;
  filteredCourses: Course[];
  searchQuery: string;
  filterCategory: string;
  filterStatus: string;
  getLevelBadge: (level: string | null) => ReactNode;
  onDelete: (courseId: string) => void;
  onTogglePublish: (courseId: string, currentStatus: boolean) => void;
}

export function CourseMobileCards({
  loading,
  filteredCourses,
  searchQuery,
  filterCategory,
  filterStatus,
  getLevelBadge,
  onDelete,
  onTogglePublish,
}: CourseMobileCardsProps) {
  return (
    <div className="md:hidden space-y-4">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-4">
            {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Không tìm thấy khóa học nào'
              : 'Chưa có khóa học nào'}
          </p>
          <Link to="/admin/courses/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo khóa học đầu tiên
            </Button>
          </Link>
        </div>
      ) : (
        filteredCourses.map((course) => (
          <Card key={course.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-24 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.creator_name}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.student_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {(course.rating || 0).toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration_hours || 0}h
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/courses/${course.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onTogglePublish(course.id, course.is_published || false)}
                    >
                      {course.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Ẩn khóa học
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Xuất bản
                        </>
                      )}
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa khóa học?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(course.id)}>
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {course.is_published ? (
                    <Badge className="bg-green-500/10 text-green-600 text-xs">Công khai</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Nháp</Badge>
                  )}
                  {getLevelBadge(course.level)}
                </div>
                {course.price && course.price > 0 ? (
                  <span className="font-semibold text-primary">{course.price.toLocaleString()}đ</span>
                ) : (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">Miễn phí</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

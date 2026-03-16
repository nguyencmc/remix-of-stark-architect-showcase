import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { EnrolledCourse } from "../types";
import { getLevelLabel, getLevelColor, getProgressColor } from "../types";

interface EnrolledCourseCardProps {
  enrollment: EnrolledCourse;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      {/* Course Image */}
      <div className="aspect-video relative overflow-hidden bg-muted">
        {enrollment.course?.image_url ? (
          <img
            src={enrollment.course.image_url}
            alt={enrollment.course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Progress Overlay */}
        {enrollment.progress_percentage >= 100 ? (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Hoàn thành
            </Badge>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90">
              {enrollment.progress_percentage}%
            </Badge>
          </div>
        )}

        {/* Play Overlay */}
        <Link to={`/course/${enrollment.course_id}/learn`}>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-7 h-7 text-primary fill-primary" />
            </div>
          </div>
        </Link>
      </div>

      <CardContent className="p-4">
        {/* Course Info */}
        <Link to={`/course/${enrollment.course_id}/learn`}>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {enrollment.course?.title || "Khóa học"}
          </h3>
        </Link>

        {enrollment.course?.creator_name && (
          <p className="text-sm text-muted-foreground mb-3">
            {enrollment.course.creator_name}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {enrollment.course?.level && (
            <Badge
              variant="outline"
              className={getLevelColor(enrollment.course.level)}
            >
              {getLevelLabel(enrollment.course.level)}
            </Badge>
          )}
          {enrollment.course?.lesson_count && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {enrollment.course.lesson_count} bài học
            </span>
          )}
          {enrollment.course?.duration_hours && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {enrollment.course.duration_hours}h
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-medium">
              {enrollment.progress_percentage}%
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor(
                enrollment.progress_percentage
              )}`}
              style={{ width: `${enrollment.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Enrolled Date */}
        <p className="text-xs text-muted-foreground mb-4">
          Đăng ký:{" "}
          {format(new Date(enrollment.enrolled_at), "dd/MM/yyyy", {
            locale: vi,
          })}
        </p>

        {/* Action Button */}
        <Link to={`/course/${enrollment.course_id}/learn`}>
          <Button className="w-full gap-2">
            {enrollment.progress_percentage >= 100 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Xem lại khóa học
              </>
            ) : enrollment.progress_percentage > 0 ? (
              <>
                <Play className="w-4 h-4" />
                Tiếp tục học
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Bắt đầu học
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { Course } from "../types";

interface CourseInstructorSectionProps {
  course: Course;
  totalStudents: number;
}

export function CourseInstructorSection({
  course,
  totalStudents,
}: CourseInstructorSectionProps) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Giảng viên</h2>
      <div className="flex items-start gap-4">
        <Link to={course.creator_id ? `/instructor/${course.creator_id}` : '#'}>
          <Avatar className="w-24 h-24 hover:ring-2 hover:ring-primary transition-all">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {(course.creator_name || "AI")[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link
            to={course.creator_id ? `/instructor/${course.creator_id}` : '#'}
            className="text-lg font-semibold text-primary hover:underline"
          >
            {course.creator_name || "AI-Exam.cloud"}
          </Link>
          <p className="text-sm text-muted-foreground mb-2">Chuyên gia đào tạo</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            {totalStudents > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {totalStudents.toLocaleString()} học viên
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

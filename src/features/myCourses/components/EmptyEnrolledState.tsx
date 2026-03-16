import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronRight } from "lucide-react";

export function EmptyEnrolledState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <GraduationCap className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        Chưa đăng ký khóa học nào
      </h2>
      <p className="text-muted-foreground mb-6">
        Khám phá các khóa học và bắt đầu hành trình học tập của bạn
      </p>
      <Link to="/courses">
        <Button>
          Khám phá khóa học
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

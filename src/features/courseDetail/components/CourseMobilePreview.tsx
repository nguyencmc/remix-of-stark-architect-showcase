import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import type { Course } from "../types";
import type { User } from "@supabase/supabase-js";

interface CourseMobilePreviewProps {
  course: Course;
  user: User | null;
  price: number;
  originalPrice: number;
  discount: number;
  isEnrolled: boolean;
  enrolling: boolean;
  onEnroll: () => void;
  onShowVideoModal: () => void;
}

export function CourseMobilePreview({
  course,
  user,
  price,
  originalPrice,
  discount,
  isEnrolled,
  enrolling,
  onEnroll,
  onShowVideoModal,
}: CourseMobilePreviewProps) {
  return (
    <div className="lg:hidden">
      <div
        className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden group cursor-pointer"
        onClick={onShowVideoModal}
      >
        {course.image_url ? (
          <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
          >
            <Play className="w-8 h-8 text-slate-900 ml-1" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-sm">Xem trước khóa học này</p>
        </div>
      </div>

      {/* Mobile Price Card */}
      <div className="mt-4 p-4 bg-card rounded-xl border">
        {price > 0 ? (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold">{price.toLocaleString()}₫</span>
            {originalPrice > price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{originalPrice.toLocaleString()}₫</span>
                <Badge variant="destructive">{discount}% giảm</Badge>
              </>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <span className="text-3xl font-bold text-green-600">Miễn phí</span>
          </div>
        )}
        {isEnrolled ? (
          <Link to={`/course/${course.id}/learn`}>
            <Button className="w-full h-12 text-lg mb-3">
              <Play className="w-5 h-5 mr-2" />
              Tiếp tục học
            </Button>
          </Link>
        ) : user ? (
          <Button
            className="w-full h-12 text-lg mb-3"
            onClick={onEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Đang đăng ký..." : price > 0 ? "Đăng ký ngay" : "Đăng ký học miễn phí"}
          </Button>
        ) : (
          <Link to="/auth">
            <Button className="w-full h-12 text-lg mb-3">
              Đăng nhập để đăng ký
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

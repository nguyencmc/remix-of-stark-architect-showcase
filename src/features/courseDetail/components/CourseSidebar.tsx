import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  PlayCircle,
  FileText,
  Download,
  Infinity as InfinityIcon,
  Monitor,
  Trophy,
  Heart,
  Share2,
} from "lucide-react";
import type { Course } from "../types";
import type { User } from "@supabase/supabase-js";

interface CourseSidebarProps {
  course: Course;
  user: User | null;
  price: number;
  originalPrice: number;
  discount: number;
  totalHours: number;
  totalLessons: number;
  isEnrolled: boolean;
  enrolling: boolean;
  isWishlisted: boolean;
  onSetIsWishlisted: (value: boolean) => void;
  onEnroll: () => void;
  onShowVideoModal: () => void;
}

export function CourseSidebar({
  course,
  user,
  price,
  originalPrice,
  discount,
  totalHours,
  totalLessons,
  isEnrolled,
  enrolling,
  isWishlisted,
  onSetIsWishlisted,
  onEnroll,
  onShowVideoModal,
}: CourseSidebarProps) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-24">
        <div className="bg-card border rounded-xl overflow-hidden shadow-lg">
          {/* Video Preview */}
          <div
            className="relative aspect-video bg-slate-900 cursor-pointer group"
            onClick={onShowVideoModal}
          >
            {course.image_url ? (
              <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              >
                <Play className="w-6 h-6 text-slate-900 ml-1" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm text-center">Xem trước khóa học</p>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="p-6">
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

            {/* Course includes */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Khóa học bao gồm:</h3>
              <ul className="space-y-2 text-sm">
                {totalHours > 0 && (
                  <li className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-muted-foreground" />
                    {totalHours} giờ video theo yêu cầu
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {totalLessons} bài học
                </li>
                <li className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  Tài liệu tải xuống
                </li>
                <li className="flex items-center gap-2">
                  <InfinityIcon className="w-4 h-4 text-muted-foreground" />
                  Truy cập trọn đời
                </li>
                <li className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  Xem trên mọi thiết bị
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  Chứng chỉ hoàn thành
                </li>
              </ul>
            </div>

            {/* Share & Wishlist */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onSetIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                Yêu thích
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { WishlistButton } from "@/components/course/WishlistButton";
import { PlayCircle, Star, Users } from "lucide-react";
import type { WishlistCourse } from "../types";

interface WishlistCourseCardProps {
  item: WishlistCourse;
  isInWishlist: boolean;
  onToggleWishlist: () => Promise<void>;
}

export function WishlistCourseCard({
  item,
  isInWishlist,
  onToggleWishlist,
}: WishlistCourseCardProps) {
  return (
    <div className="group relative">
      <Link
        to={`/course/${item.course?.slug || item.course_id}`}
        className="block"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
          <div className="aspect-video relative overflow-hidden bg-muted">
            {item.course?.image_url ? (
              <img
                src={item.course.image_url}
                alt={item.course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <PlayCircle className="w-12 h-12 text-primary/50" />
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {item.course?.title || "Khóa học"}
            </h4>
            {item.course?.creator_name && (
              <p className="text-sm text-muted-foreground mb-2">
                {item.course.creator_name}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {item.course?.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {item.course.rating.toFixed(1)}
                </span>
              )}
              {item.course?.student_count != null && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {item.course.student_count.toLocaleString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
      <div className="absolute top-2 right-2">
        <WishlistButton
          isInWishlist={isInWishlist}
          onToggle={onToggleWishlist}
          size="sm"
        />
      </div>
    </div>
  );
}

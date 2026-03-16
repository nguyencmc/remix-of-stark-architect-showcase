import { Badge } from "@/components/ui/badge";
import { Star, Clock, PlayCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { WishlistButton } from "@/components/course/WishlistButton";
import type { Course } from "../types";

interface CourseGridCardProps {
  course: Course;
  rating: string;
  students: number;
  price: number;
  originalPrice: number;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
}

export function CourseGridCard({
  course,
  rating,
  students,
  price,
  originalPrice,
  isInWishlist,
  onToggleWishlist,
}: CourseGridCardProps) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group bg-card rounded-lg overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/80 to-accent/80 overflow-hidden">
        {course.image_url ? (
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/80" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          {course.is_official && (
            <Badge className="bg-yellow-500 text-black text-xs">
              <Award className="w-3 h-3 mr-1" />
              Bestseller
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <WishlistButton
            isInWishlist={isInWishlist}
            onToggle={onToggleWishlist}
            size="sm"
          />
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[48px]">
          {course.title}
        </h3>
        
        <p className="text-xs text-muted-foreground mb-2">
          {course.creator_name || "AI-Exam.cloud"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-sm text-amber-600">{rating}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(Number(rating)) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({students.toLocaleString()})
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(Math.random() * 30) + 5}h
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="w-3 h-3" />
            {course.term_count || Math.floor(Math.random() * 100) + 20} bài
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-3 border-t">
          <span className="text-lg font-bold text-foreground">
            {price.toLocaleString()}₫
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {originalPrice.toLocaleString()}₫
          </span>
        </div>
      </div>
    </Link>
  );
}

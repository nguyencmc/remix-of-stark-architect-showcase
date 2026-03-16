import { Badge } from "@/components/ui/badge";
import { Star, Clock, PlayCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface CourseListCardProps {
  course: Course;
  rating: string;
  students: number;
  price: number;
  originalPrice: number;
}

export function CourseListCard({
  course,
  rating,
  students,
  price,
  originalPrice,
}: CourseListCardProps) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group flex gap-4 bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all p-4"
    >
      {/* Thumbnail */}
      <div className="relative w-64 aspect-video flex-shrink-0 bg-gradient-to-br from-primary/80 to-accent/80 rounded-lg overflow-hidden">
        {course.image_url ? (
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-10 h-10 text-white/80" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {course.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mb-2">
          {course.creator_name || "AI-Exam.cloud"}
        </p>
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
            ({students.toLocaleString()} học viên)
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(Math.random() * 30) + 5} giờ
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="w-3 h-3" />
            {course.term_count || Math.floor(Math.random() * 100) + 20} bài giảng
          </span>
          {course.is_official && (
            <Badge className="bg-yellow-500 text-black text-xs">
              Bestseller
            </Badge>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end justify-between">
        <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500" />
        </button>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">
            {price.toLocaleString()}₫
          </div>
          <div className="text-sm text-muted-foreground line-through">
            {originalPrice.toLocaleString()}₫
          </div>
        </div>
      </div>
    </Link>
  );
}

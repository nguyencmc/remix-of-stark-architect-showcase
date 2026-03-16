import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Award, Globe, Star, Users } from "lucide-react";
import type { Course } from "../types";

interface CourseHeroSectionProps {
  course: Course;
  rating: number;
  totalRatings: number;
  totalStudents: number;
}

export function CourseHeroSection({
  course,
  rating,
  totalRatings,
  totalStudents,
}: CourseHeroSectionProps) {
  return (
    <section className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Course Info */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link to="/courses" className="hover:text-white">Khóa học</Link>
              <span>/</span>
              <span className="capitalize">{course.category}</span>
              {course.subcategory && (
                <>
                  <span>/</span>
                  <span className="capitalize">{course.subcategory}</span>
                </>
              )}
            </nav>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {course.title}
            </h1>

            <p className="text-gray-300 text-lg mb-4">
              {course.description || "Khóa học toàn diện giúp bạn nắm vững kiến thức từ cơ bản đến nâng cao."}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {course.is_featured && (
                <Badge className="bg-yellow-500 text-black">
                  <Award className="w-3 h-3 mr-1" />
                  Bestseller
                </Badge>
              )}
              {course.level && (
                <Badge variant="outline" className="border-blue-500 text-blue-400 capitalize">
                  {course.level}
                </Badge>
              )}
            </div>

            {/* Rating & Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-bold text-yellow-400">{rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">({totalRatings.toLocaleString()} đánh giá)</span>
                </div>
              )}
              {totalStudents > 0 && (
                <span className="text-gray-400">
                  <Users className="w-4 h-4 inline mr-1" />
                  {totalStudents.toLocaleString()} học viên
                </span>
              )}
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Giảng viên:</span>
              <Link
                to={course.creator_id ? `/instructor/${course.creator_id}` : '#'}
                className="text-purple-400 hover:underline font-medium"
              >
                {course.creator_name || "AI-Exam.cloud"}
              </Link>
            </div>

            {/* Language */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {course.language || "Tiếng Việt"}
              </span>
            </div>
          </div>

          {/* Right: Video Preview Card - Visible on Desktop */}
          <div className="hidden lg:block">
            {/* This is just a placeholder, actual card is fixed */}
          </div>
        </div>
      </div>
    </section>
  );
}

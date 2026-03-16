import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp } from "lucide-react";

interface CoursesHeroBannerProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CoursesHeroBanner({ searchQuery, onSearchChange }: CoursesHeroBannerProps) {
  return (
    <section className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <Badge className="bg-yellow-500 text-black mb-4 hover:bg-yellow-500">
            <TrendingUp className="w-3 h-3 mr-1" />
            Học mọi lúc, mọi nơi
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Mở khóa tiềm năng của bạn với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              hàng ngàn khóa học
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Khám phá các khóa học chất lượng cao từ các chuyên gia hàng đầu. 
            Học theo tiến độ của riêng bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm khóa học, chủ đề, giảng viên..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 bg-white text-gray-900 border-0 rounded-xl text-base"
              />
            </div>
            <Button size="lg" className="h-14 px-8 rounded-xl bg-purple-600 hover:bg-purple-700">
              Tìm kiếm
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="text-gray-400 text-sm">Phổ biến:</span>
            {["Python", "React", "Data Science", "UI/UX", "Excel"].map((tag) => (
              <Badge key={tag} variant="outline" className="text-gray-300 border-gray-600 hover:bg-white/10 cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

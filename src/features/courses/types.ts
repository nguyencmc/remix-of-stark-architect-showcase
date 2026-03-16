import {
  Grid3X3,
  Code,
  BarChart,
  Palette,
  TrendingUp,
  Globe,
  Music,
  Camera,
  Award,
  type LucideIcon,
} from "lucide-react";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  subcategory: string | null;
  topic: string | null;
  term_count: number | null;
  view_count: number | null;
  creator_name: string | null;
  is_official: boolean | null;
}

export interface CourseCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface FeaturedCategory {
  name: string;
  icon: LucideIcon;
  courses: number;
  color: string;
}

export const categories: CourseCategory[] = [
  { id: "all", name: "Tất cả", icon: Grid3X3 },
  { id: "development", name: "Phát triển", icon: Code },
  { id: "business", name: "Kinh doanh", icon: BarChart },
  { id: "design", name: "Thiết kế", icon: Palette },
  { id: "marketing", name: "Marketing", icon: TrendingUp },
  { id: "languages", name: "Ngôn ngữ", icon: Globe },
  { id: "music", name: "Âm nhạc", icon: Music },
  { id: "photography", name: "Nhiếp ảnh", icon: Camera },
];

export const sortOptions = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "students", label: "Nhiều học viên" },
];

export const featuredCategories: FeaturedCategory[] = [
  { name: "Lập trình Web", icon: Code, courses: 1234, color: "from-blue-500 to-cyan-500" },
  { name: "Data Science", icon: BarChart, courses: 856, color: "from-purple-500 to-pink-500" },
  { name: "UI/UX Design", icon: Palette, courses: 543, color: "from-orange-500 to-red-500" },
  { name: "Digital Marketing", icon: TrendingUp, courses: 721, color: "from-green-500 to-emerald-500" },
  { name: "Ngoại ngữ", icon: Globe, courses: 432, color: "from-indigo-500 to-purple-500" },
  { name: "Nhiếp ảnh", icon: Camera, courses: 234, color: "from-pink-500 to-rose-500" },
  { name: "Âm nhạc", icon: Music, courses: 189, color: "from-amber-500 to-orange-500" },
  { name: "Kinh doanh", icon: Award, courses: 567, color: "from-teal-500 to-cyan-500" },
];

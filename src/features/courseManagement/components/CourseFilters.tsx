import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseCategory } from '../types';

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  categories: CourseCategory[];
}

export function CourseFilters({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterCategoryChange,
  filterStatus,
  onFilterStatusChange,
  categories,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm khóa học..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="published">Đã xuất bản</SelectItem>
          <SelectItem value="draft">Bản nháp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

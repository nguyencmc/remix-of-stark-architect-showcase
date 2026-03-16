import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, Zap, Filter } from 'lucide-react';
import type { ExamCategory } from '../types';

interface ExamFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterDifficulty: string;
  onDifficultyChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  categories: ExamCategory[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ExamFilters({
  searchQuery,
  onSearchChange,
  filterDifficulty,
  onDifficultyChange,
  filterCategory,
  onCategoryChange,
  categories,
  hasActiveFilters,
  onClearFilters,
}: ExamFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm đề thi..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>
      <Select value={filterDifficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="w-40 h-9 gap-1.5">
          <Zap className="w-3.5 h-3.5 text-muted-foreground" />
          <SelectValue placeholder="Độ khó" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả độ khó</SelectItem>
          <SelectItem value="easy">Dễ</SelectItem>
          <SelectItem value="medium">Trung bình</SelectItem>
          <SelectItem value="hard">Khó</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-44 h-9 gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={onClearFilters}>
          Xoá lọc
        </Button>
      )}
    </div>
  );
}

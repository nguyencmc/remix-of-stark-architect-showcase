import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, sortOptions } from "../types";

interface CoursesFiltersBarProps {
  selectedCategory: string;
  filteredCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function CoursesFiltersBar({
  selectedCategory,
  filteredCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: CoursesFiltersBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {selectedCategory === "all" ? "Tất cả khóa học" : categories.find(c => c.id === selectedCategory)?.name}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {filteredCount} khóa học được tìm thấy
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="hidden md:flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

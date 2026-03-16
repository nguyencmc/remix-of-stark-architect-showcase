import { Button } from "@/components/ui/button";
import { categories } from "../types";

interface CoursesCategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CoursesCategoryBar({ selectedCategory, onCategoryChange }: CoursesCategoryBarProps) {
  return (
    <section className="bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-1 py-4 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "ghost"}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 ${
                  selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-background"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BarChart3, Clock, RotateCcw } from "lucide-react";
import { ExamCategory } from "@/types/exam";

interface ExamFiltersProps {
    categories: ExamCategory[];
    selectedCategories: string[];
    selectedDifficulty: string;
    selectedDuration: string[];
    onCategoryToggle: (categoryId: string) => void;
    onDifficultyChange: (difficulty: string) => void;
    onDurationToggle: (duration: string) => void;
    onReset: () => void;
}

const DIFFICULTY_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "beginner", label: "Cơ bản" },
    { value: "intermediate", label: "Trung bình" },
    { value: "advanced", label: "Nâng cao" }
];

const DURATION_OPTIONS = [
    { value: "short", label: "< 30 phút" },
    { value: "medium", label: "30 - 90 phút" },
    { value: "long", label: "1.5+ giờ" }
];

export function ExamFilters({
    categories,
    selectedCategories,
    selectedDifficulty,
    selectedDuration,
    onCategoryToggle,
    onDifficultyChange,
    onDurationToggle,
    onReset,
}: ExamFiltersProps) {
    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Danh mục
                    </span>
                </div>
                <div className="space-y-2.5">
                    {categories.slice(0, 6).map(category => (
                        <div key={category.id} className="flex items-center gap-2">
                            <Checkbox
                                id={`filter-cat-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => onCategoryToggle(category.id)}
                            />
                            <Label
                                htmlFor={`filter-cat-${category.id}`}
                                className="text-sm cursor-pointer text-foreground"
                            >
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Difficulty Filter */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Độ khó
                    </span>
                </div>
                <RadioGroup
                    value={selectedDifficulty}
                    onValueChange={onDifficultyChange}
                    className="space-y-2.5"
                >
                    {DIFFICULTY_OPTIONS.map(option => (
                        <div key={option.value} className="flex items-center gap-2">
                            <RadioGroupItem value={option.value} id={`filter-diff-${option.value || 'all'}`} />
                            <Label
                                htmlFor={`filter-diff-${option.value || 'all'}`}
                                className="text-sm cursor-pointer text-foreground"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Duration Filter */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Thời lượng
                    </span>
                </div>
                <div className="space-y-2.5">
                    {DURATION_OPTIONS.map(option => (
                        <div key={option.value} className="flex items-center gap-2">
                            <Checkbox
                                id={`filter-dur-${option.value}`}
                                checked={selectedDuration.includes(option.value)}
                                onCheckedChange={() => onDurationToggle(option.value)}
                            />
                            <Label
                                htmlFor={`filter-dur-${option.value}`}
                                className="text-sm cursor-pointer text-foreground"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={onReset} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Đặt lại bộ lọc
            </Button>
        </div>
    );
}

export default ExamFilters;

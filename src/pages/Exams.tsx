import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { 
  Search, 
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Play,
  BarChart3,
  Home,
  SlidersHorizontal,
  GraduationCap,
  History,
  Award,
  User,
  BookOpen,
  Sigma,
  Languages,
  Stethoscope,
  Calculator,
  Code,
  Atom,
  Palette,
  Music,
  Globe,
  Scale,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Trophy,
  Flame,
  Star,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Zap,
  Timer,
  CheckCircle2,
  X,
  Eye,
  Heart,
  Medal
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/components/PageHeader";

interface ExamCategory {
  id: string;
  name: string;
  slug: string;
}

interface CreatorProfile {
  user_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface Exam {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  question_count: number | null;
  attempt_count: number | null;
  category_id: string | null;
  difficulty: string | null;
  duration_minutes: number | null;
  category?: ExamCategory;
  source: 'exam' | 'question_set'; // Track the source for navigation
  creator_name?: string | null;
  creator_avatar?: string | null;
  creator_id?: string | null;
}

const ITEMS_PER_PAGE = 12;

// Category icon and color mapping
const getCategoryStyle = (categoryName: string, index: number) => {
  const styles = [
    { icon: Sigma, bgColor: "bg-blue-500/10", iconColor: "text-blue-500", borderColor: "border-blue-500/20", gradient: "from-blue-500/20 to-blue-500/5" },
    { icon: Code, bgColor: "bg-teal-500/10", iconColor: "text-teal-500", borderColor: "border-teal-500/20", gradient: "from-teal-500/20 to-teal-500/5" },
    { icon: Languages, bgColor: "bg-orange-500/10", iconColor: "text-orange-500", borderColor: "border-orange-500/20", gradient: "from-orange-500/20 to-orange-500/5" },
    { icon: Stethoscope, bgColor: "bg-rose-500/10", iconColor: "text-rose-500", borderColor: "border-rose-500/20", gradient: "from-rose-500/20 to-rose-500/5" },
    { icon: Atom, bgColor: "bg-purple-500/10", iconColor: "text-purple-500", borderColor: "border-purple-500/20", gradient: "from-purple-500/20 to-purple-500/5" },
    { icon: Calculator, bgColor: "bg-indigo-500/10", iconColor: "text-indigo-500", borderColor: "border-indigo-500/20", gradient: "from-indigo-500/20 to-indigo-500/5" },
    { icon: Globe, bgColor: "bg-green-500/10", iconColor: "text-green-500", borderColor: "border-green-500/20", gradient: "from-green-500/20 to-green-500/5" },
    { icon: Scale, bgColor: "bg-amber-500/10", iconColor: "text-amber-500", borderColor: "border-amber-500/20", gradient: "from-amber-500/20 to-amber-500/5" },
    { icon: Palette, bgColor: "bg-pink-500/10", iconColor: "text-pink-500", borderColor: "border-pink-500/20", gradient: "from-pink-500/20 to-pink-500/5" },
    { icon: Music, bgColor: "bg-cyan-500/10", iconColor: "text-cyan-500", borderColor: "border-cyan-500/20", gradient: "from-cyan-500/20 to-cyan-500/5" },
  ];
  return styles[index % styles.length];
};

// Stats summary component
const StatCard = ({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all">
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const Exams = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedExams, setSavedExams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const [categoryResult, examResult, questionSetsResult] = await Promise.all([
      supabase.from("exam_categories").select("id, name, slug").order("name"),
      supabase.from("exams").select("*, exam_categories(id, name, slug)").order("created_at", { ascending: false }),
      supabase.from("question_sets").select("*, exam_categories(id, name, slug)").eq("is_published", true).order("created_at", { ascending: false })
    ]);

    if (categoryResult.data) {
      setCategories(categoryResult.data);
    }

    const allExams: Exam[] = [];

    // Collect all creator IDs from both exams and question_sets
    const allCreatorIds: string[] = [];
    
    if (examResult.data) {
      examResult.data.forEach(exam => {
        if (exam.creator_id) allCreatorIds.push(exam.creator_id);
      });
    }
    
    if (questionSetsResult.data) {
      questionSetsResult.data.forEach(qs => {
        if (qs.creator_id) allCreatorIds.push(qs.creator_id);
      });
    }

    // Fetch all creator profiles at once
    let creatorProfiles: Record<string, CreatorProfile> = {};
    const uniqueCreatorIds = [...new Set(allCreatorIds)];
    
    if (uniqueCreatorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, username, avatar_url")
        .in("user_id", uniqueCreatorIds);
      
      if (profilesData) {
        profilesData.forEach(profile => {
          creatorProfiles[profile.user_id] = profile;
        });
      }
    }

    // Add official exams with creator info from database
    if (examResult.data) {
      examResult.data.forEach(exam => {
        const creator = exam.creator_id ? creatorProfiles[exam.creator_id] : null;
        allExams.push({
          id: exam.id,
          title: exam.title,
          slug: exam.slug,
          description: exam.description,
          question_count: exam.question_count,
          attempt_count: exam.attempt_count,
          category_id: exam.category_id,
          difficulty: exam.difficulty,
          duration_minutes: exam.duration_minutes,
          category: exam.exam_categories as ExamCategory | undefined,
          source: 'exam',
          creator_id: exam.creator_id,
          creator_name: creator?.full_name || creator?.username || 'Hệ thống',
          creator_avatar: creator?.avatar_url || null,
        });
      });
    }

    // Add published question sets from users
    if (questionSetsResult.data) {
      questionSetsResult.data.forEach(qs => {
        const creator = qs.creator_id ? creatorProfiles[qs.creator_id] : null;
        allExams.push({
          id: qs.id,
          title: qs.title,
          slug: qs.slug || qs.id,
          description: qs.description,
          question_count: qs.question_count,
          attempt_count: 0,
          category_id: qs.category_id,
          difficulty: qs.level,
          duration_minutes: qs.duration_minutes,
          category: qs.exam_categories as ExamCategory | undefined,
          source: 'question_set',
          creator_id: qs.creator_id,
          creator_name: creator?.full_name || creator?.username || 'Người dùng ẩn danh',
          creator_avatar: creator?.avatar_url || null,
        });
      });
    }

    setExams(allExams);
    setLoading(false);
  };

  // Filter and sort exams
  const filteredExams = useMemo(() => {
    let result = [...exams];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(exam => 
        exam.title.toLowerCase().includes(query) ||
        exam.description?.toLowerCase().includes(query)
      );
    }

    // Category filter - use activeCategoryId for mobile chips or selectedCategories for desktop
    if (activeCategoryId) {
      result = result.filter(exam => exam.category_id === activeCategoryId);
    } else if (selectedCategories.length > 0) {
      result = result.filter(exam => 
        exam.category_id && selectedCategories.includes(exam.category_id)
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      result = result.filter(exam => exam.difficulty === selectedDifficulty);
    }

    // Duration filter
    if (selectedDuration.length > 0) {
      result = result.filter(exam => {
        const duration = exam.duration_minutes || 0;
        return selectedDuration.some(range => {
          if (range === "short") return duration < 30;
          if (range === "medium") return duration >= 30 && duration <= 90;
          if (range === "long") return duration > 90;
          return false;
        });
      });
    }

    // Sort
    if (sortBy === "recent") {
      // Already sorted by created_at desc
    } else if (sortBy === "popular") {
      result.sort((a, b) => (b.attempt_count || 0) - (a.attempt_count || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "questions") {
      result.sort((a, b) => (b.question_count || 0) - (a.question_count || 0));
    }

    return result;
  }, [exams, searchQuery, selectedCategories, activeCategoryId, selectedDifficulty, selectedDuration, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handleMobileCategorySelect = (categoryId: string | null) => {
    setActiveCategoryId(categoryId);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleDurationToggle = (duration: string) => {
    setSelectedDuration(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSortBy("recent");
    setSelectedCategories([]);
    setSelectedDifficulty("");
    setSelectedDuration([]);
    setActiveCategoryId(null);
    setCurrentPage(1);
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate":
      case "medium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "advanced":
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    if (!difficulty) return "N/A";
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  };

  const getExamCategoryIndex = (exam: Exam) => {
    if (!exam.category_id) return 0;
    const idx = categories.findIndex(c => c.id === exam.category_id);
    return idx >= 0 ? idx : 0;
  };

  const toggleSaveExam = (examId: string) => {
    setSavedExams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(examId)) {
        newSet.delete(examId);
      } else {
        newSet.add(examId);
      }
      return newSet;
    });
  };

  // Get featured/popular exams
  const featuredExams = useMemo(() => {
    return [...exams]
      .sort((a, b) => (b.attempt_count || 0) - (a.attempt_count || 0))
      .slice(0, 4);
  }, [exams]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedDifficulty || selectedDuration.length > 0 || activeCategoryId;

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, idx) => (
          typeof page === "number" ? (
            <Button
              key={idx}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="h-10 w-10"
            >
              {page}
            </Button>
          ) : (
            <span key={idx} className="px-2 text-muted-foreground">...</span>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="h-10 w-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Mobile Filter Sheet Content
  const FilterContent = () => (
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
                onCheckedChange={() => handleCategoryToggle(category.id)}
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
          onValueChange={(value) => {
            setSelectedDifficulty(value);
            setCurrentPage(1);
          }}
          className="space-y-2.5"
        >
          {[
            { value: "", label: "Tất cả" },
            { value: "beginner", label: "Cơ bản" },
            { value: "intermediate", label: "Trung bình" },
            { value: "advanced", label: "Nâng cao" }
          ].map(option => (
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
          {[
            { value: "short", label: "< 30 phút" },
            { value: "medium", label: "30 - 90 phút" },
            { value: "long", label: "1.5+ giờ" }
          ].map(option => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`filter-dur-${option.value}`}
                checked={selectedDuration.includes(option.value)}
                onCheckedChange={() => handleDurationToggle(option.value)}
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

      <Button onClick={handleReset} variant="outline" className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        Đặt lại bộ lọc
      </Button>
    </div>
  );

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">Thư viện đề thi</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 relative">
                  <SlidersHorizontal className="h-4 w-4" />
                  Lọc
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Bộ lọc</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                  <FilterContent />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar (Collapsible) */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đề thi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-10"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Category Chips - Horizontal Scroll */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            <Button
              variant={activeCategoryId === null ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => handleMobileCategorySelect(null)}
            >
              Tất cả
            </Button>
            {categories.map((category, index) => {
              const style = getCategoryStyle(category.name, index);
              const IconComponent = style.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategoryId === category.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-full shrink-0 gap-1.5"
                  onClick={() => handleMobileCategorySelect(category.id)}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Desktop Layout */}
      <main className="hidden lg:block">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border-b">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 py-12 relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Khám phá & Luyện tập</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Thư viện đề thi
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                Hàng nghìn đề thi chất lượng được biên soạn bởi đội ngũ chuyên gia và cộng đồng. 
                Luyện tập ngay để nâng cao kiến thức và kỹ năng của bạn!
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đề thi theo tên, mã hoặc từ khóa..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-12 pr-4 h-14 text-base rounded-2xl border-2 border-border focus:border-primary bg-card/80 backdrop-blur-sm shadow-lg"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mt-8 max-w-3xl">
              <StatCard 
                icon={FileText} 
                value={exams.length} 
                label="Đề thi" 
                color="bg-primary/10 text-primary" 
              />
              <StatCard 
                icon={Users} 
                value={categories.length} 
                label="Danh mục" 
                color="bg-purple-500/10 text-purple-500" 
              />
              <StatCard 
                icon={TrendingUp} 
                value={exams.reduce((sum, e) => sum + (e.attempt_count || 0), 0).toLocaleString()} 
                label="Lượt thi" 
                color="bg-green-500/10 text-green-500" 
              />
              <StatCard 
                icon={Flame} 
                value={exams.filter(e => e.source === 'question_set').length} 
                label="Từ cộng đồng" 
                color="bg-orange-500/10 text-orange-500" 
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-foreground">Bộ lọc</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  className="text-primary hover:text-primary/80 h-auto p-0 font-medium"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Đặt lại
                </Button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
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
                        id={`cat-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <Label 
                        htmlFor={`cat-${category.id}`}
                        className="text-sm cursor-pointer text-foreground"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Độ khó
                  </span>
                </div>
                <RadioGroup 
                  value={selectedDifficulty} 
                  onValueChange={(value) => {
                    setSelectedDifficulty(value);
                    setCurrentPage(1);
                  }}
                  className="space-y-2.5"
                >
                  {[
                    { value: "", label: "Tất cả" },
                    { value: "beginner", label: "Cơ bản" },
                    { value: "intermediate", label: "Trung bình" },
                    { value: "advanced", label: "Nâng cao" }
                  ].map(option => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`diff-${option.value || 'all'}`} />
                      <Label 
                        htmlFor={`diff-${option.value || 'all'}`}
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
                  {[
                    { value: "short", label: "< 30 phút" },
                    { value: "medium", label: "30 - 90 phút" },
                    { value: "long", label: "1.5+ giờ" }
                  ].map(option => (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`dur-${option.value}`}
                        checked={selectedDuration.includes(option.value)}
                        onCheckedChange={() => handleDurationToggle(option.value)}
                      />
                      <Label 
                        htmlFor={`dur-${option.value}`}
                        className="text-sm cursor-pointer text-foreground"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header with View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {hasActiveFilters ? 'Kết quả tìm kiếm' : 'Tất cả đề thi'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredExams.length} đề thi được tìm thấy
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1 bg-muted/50">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Mới nhất
                      </span>
                    </SelectItem>
                    <SelectItem value="popular">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Phổ biến nhất
                      </span>
                    </SelectItem>
                    <SelectItem value="name">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Tên (A-Z)
                      </span>
                    </SelectItem>
                    <SelectItem value="questions">
                      <span className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Số câu hỏi
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Bộ lọc:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Từ khóa: "{searchQuery}"
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {activeCategoryId && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {categories.find(c => c.id === activeCategoryId)?.name}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setActiveCategoryId(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedDifficulty && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {selectedDifficulty === 'beginner' ? 'Cơ bản' : selectedDifficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedDifficulty("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary h-7"
                  onClick={handleReset}
                >
                  Xóa tất cả
                </Button>
              </div>
            )}

            {/* Exams Grid/List */}
            {loading ? (
              <div className={cn(
                "gap-5",
                viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"
              )}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-6 bg-muted rounded-full w-24"></div>
                        <div className="h-6 w-6 bg-muted rounded"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                      </div>
                      <div className="h-11 bg-muted rounded-lg"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : paginatedExams.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy đề thi</h3>
                  <p className="text-muted-foreground mb-6">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedExams.map((exam) => {
                  const categoryIndex = getExamCategoryIndex(exam);
                  const style = getCategoryStyle(exam.category?.name || "", categoryIndex);
                  const IconComponent = style.icon;
                  const isSaved = savedExams.has(exam.id);
                  
                  return (
                    <Card
                      key={exam.id}
                      className={cn(
                        "group relative overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300",
                        "hover:-translate-y-1"
                      )}
                    >
                      {/* Header with gradient background */}
                      <div className={cn(
                        "relative px-5 py-4 bg-gradient-to-r",
                        style.gradient.replace('from-', 'from-').replace('/20', '/80').replace('/5', '/60'),
                        "from-primary/80 to-primary/60"
                      )}>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-90" />
                        <div className="relative">
                          <h3 className="font-bold text-white text-lg line-clamp-2 mb-3">
                            {exam.title}
                          </h3>
                          <div className="flex items-center gap-4 text-white/90 text-sm">
                            <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
                              <Clock className="h-3.5 w-3.5" />
                              {exam.duration_minutes || 60} Phút
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
                              <FileText className="h-3.5 w-3.5" />
                              {exam.question_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-5 relative">
                        {/* Title & Description */}
                        <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {exam.title}
                        </h4>
                        
                        {exam.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {exam.description}
                          </p>
                        )}

                        {/* Attempt count */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                          <Users className="h-4 w-4" />
                          <span>{(exam.attempt_count || 0).toLocaleString()} lượt thi</span>
                        </div>

                        {/* Creator section */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={exam.creator_avatar || undefined} alt={exam.creator_name || ''} />
                            <AvatarFallback className={cn(
                              "text-sm font-medium",
                              exam.source === 'question_set' ? "bg-orange-500/10 text-orange-600" : "bg-primary/10 text-primary"
                            )}>
                              {exam.creator_name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs text-muted-foreground">Người tạo</p>
                            <p className="font-medium text-sm text-foreground">
                              {exam.creator_name || 'Ẩn danh'}
                            </p>
                          </div>
                        </div>

                        {/* Action icons */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  className={cn(
                                    "p-2 rounded-full transition-colors",
                                    isSaved ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaveExam(exam.id);
                                  }}
                                >
                                  <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>{isSaved ? 'Bỏ yêu thích' : 'Yêu thích'}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                                  <Eye className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Xem trước</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 rounded-full text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors">
                                  <Trophy className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Bảng xếp hạng</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
                                  <Medal className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Thành tích</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 rounded-full text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-colors">
                                  <Timer className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Lịch sử làm bài</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
                          onClick={() => navigate(exam.source === 'question_set' ? `/exam/${exam.slug || exam.id}?type=practice` : `/exam/${exam.slug}`)}
                        >
                          <Play className="h-4 w-4" />
                          Bắt đầu làm bài
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {paginatedExams.map((exam) => {
                  const categoryIndex = getExamCategoryIndex(exam);
                  const style = getCategoryStyle(exam.category?.name || "", categoryIndex);
                  const IconComponent = style.icon;
                  const isSaved = savedExams.has(exam.id);
                  
                  return (
                    <Card
                      key={exam.id}
                      className="group hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="flex">
                        {/* Left gradient bar */}
                        <div className="w-2 bg-gradient-to-b from-violet-600 to-indigo-600 shrink-0" />
                        
                        <CardContent className="p-4 flex-1">
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                              <IconComponent className="h-7 w-7 text-violet-600" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                  {exam.title}
                                </h3>
                                {exam.source === 'question_set' && (
                                  <Badge variant="outline" className="text-xs shrink-0 border-orange-500/30 text-orange-600">
                                    Cộng đồng
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage src={exam.creator_avatar || undefined} />
                                    <AvatarFallback className="text-[8px]">
                                      {exam.creator_name?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  {exam.creator_name || 'Ẩn danh'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5" />
                                  {exam.question_count || 0} câu
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {exam.duration_minutes || 60} phút
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {(exam.attempt_count || 0).toLocaleString()} lượt
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className={cn(isSaved ? "text-red-500" : "text-muted-foreground hover:text-red-500")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSaveExam(exam.id);
                                    }}
                                  >
                                    <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isSaved ? 'Bỏ yêu thích' : 'Yêu thích'}</TooltipContent>
                              </Tooltip>
                              <Button 
                                className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                                onClick={() => navigate(exam.source === 'question_set' ? `/exam/${exam.slug || exam.id}?type=practice` : `/exam/${exam.slug}`)}
                              >
                                <Play className="h-4 w-4" />
                                Bắt đầu
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </div>
        </div>
        </div>
      </main>

      {/* Mobile Content */}
      <main className="lg:hidden pb-20">
        {/* Mobile Exam List */}
        <div className="px-4 py-4 space-y-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-9 w-16 bg-muted rounded-lg"></div>
                </div>
              </div>
            ))
          ) : paginatedExams.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Không tìm thấy đề thi</p>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi danh mục hoặc từ khóa
              </p>
            </div>
          ) : (
            paginatedExams.map((exam) => {
              const categoryIndex = getExamCategoryIndex(exam);
              const style = getCategoryStyle(exam.category?.name || "", categoryIndex);
              const IconComponent = style.icon;

              return (
                <div
                  key={exam.id}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Header with gradient */}
                  <div className="relative px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600">
                    <h3 className="font-bold text-white text-base line-clamp-1 mb-2">
                      {exam.title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/90 text-xs">
                      <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3" />
                        {exam.duration_minutes || 60} Phút
                      </span>
                      <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                        <FileText className="h-3 w-3" />
                        {exam.question_count || 0}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Attempt count */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <Users className="h-4 w-4" />
                      <span>{(exam.attempt_count || 0).toLocaleString()} lượt thi</span>
                    </div>
                    
                    {/* Creator */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={exam.creator_avatar || undefined} alt={exam.creator_name || ''} />
                        <AvatarFallback className={cn(
                          "text-xs font-medium",
                          exam.source === 'question_set' ? "bg-orange-500/10 text-orange-600" : "bg-violet-500/10 text-violet-600"
                        )}>
                          {exam.creator_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground">Người tạo</p>
                        <p className="font-medium text-sm">
                          {exam.creator_name || 'Ẩn danh'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                      size="sm"
                      onClick={() => navigate(exam.source === 'question_set' ? `/exam/${exam.slug || exam.id}?type=practice` : `/exam/${exam.slug}`)}
                    >
                      <Play className="h-4 w-4" />
                      Bắt đầu làm bài
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          <Link 
            to="/" 
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Trang chủ</span>
          </Link>
          <Link 
            to="/exam-history" 
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <History className="h-5 w-5" />
            <span className="text-xs">Lịch sử</span>
          </Link>
          <Link 
            to="/achievements" 
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Award className="h-5 w-5" />
            <span className="text-xs">Thành tích</span>
          </Link>
          <Link 
            to="/profile" 
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Tài khoản</span>
          </Link>
        </div>
      </nav>
    </div>
    </TooltipProvider>
  );
};

export default Exams;

import { Link } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FileText, Plus, ArrowLeft } from 'lucide-react';
import {
  useExamManagement,
  ExamStatsBar,
  ExamFilters,
  ExamTable,
} from '@/features/examManagement';

const ExamManagement = () => {
  const {
    exams,
    categories,
    loading,
    roleLoading,
    searchQuery,
    setSearchQuery,
    filterDifficulty,
    setFilterDifficulty,
    filterCategory,
    setFilterCategory,
    filteredExams,
    totalQuestions,
    totalAttempts,
    proctoredCount,
    hasActiveFilters,
    clearFilters,
    togglingId,
    isAdmin,
    canView,
    canCreate,
    handleDelete,
    handleToggleProctoring,
    getCategoryName,
  } = useExamManagement();

  if (roleLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
    </div>
  );
  if (!canView) return null;

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to={isAdmin ? '/admin' : '/teacher'}>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Quản lý đề thi
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {exams.length} đề thi · {totalQuestions.toLocaleString()} câu hỏi
              </p>
            </div>
          </div>
          {canCreate && (
            <Link to="/admin/exams/create">
              <Button className="gap-2 h-9">
                <Plus className="w-4 h-4" />
                Tạo đề thi mới
              </Button>
            </Link>
          )}
        </div>

        <ExamStatsBar
          examCount={exams.length}
          totalQuestions={totalQuestions}
          totalAttempts={totalAttempts}
          proctoredCount={proctoredCount}
        />

        <ExamFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterDifficulty={filterDifficulty}
          onDifficultyChange={setFilterDifficulty}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <ExamTable
          loading={loading}
          filteredExams={filteredExams}
          searchQuery={searchQuery}
          canCreate={canCreate}
          togglingId={togglingId}
          getCategoryName={getCategoryName}
          onDelete={handleDelete}
          onToggleProctoring={handleToggleProctoring}
        />

        {filteredExams.length > 0 && filteredExams.length < exams.length && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Hiển thị {filteredExams.length} / {exams.length} đề thi
          </p>
        )}

      </main>
    </div>
    </TooltipProvider>
  );
};

export default ExamManagement;

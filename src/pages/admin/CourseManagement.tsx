import {
  useCourseManagement,
  CourseManagementHeader,
  CourseFilters,
  CourseTable,
  CourseMobileCards,
} from '@/features/courseManagement';

const CourseManagement = () => {
  const {
    courses,
    categories,
    loading,
    roleLoading,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    isAdmin,
    canView,
    canCreate,
    filteredCourses,
    handleDelete,
    togglePublish,
    toggleFeatured,
    getLevelBadge,
  } = useCourseManagement();

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!canView) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <CourseManagementHeader
          isAdmin={isAdmin}
          canCreate={canCreate}
          courseCount={courses.length}
        />

        <CourseFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          categories={categories}
        />

        <CourseTable
          loading={loading}
          filteredCourses={filteredCourses}
          searchQuery={searchQuery}
          filterCategory={filterCategory}
          filterStatus={filterStatus}
          isAdmin={isAdmin}
          getLevelBadge={getLevelBadge}
          onDelete={handleDelete}
          onTogglePublish={togglePublish}
          onToggleFeatured={toggleFeatured}
        />

        <CourseMobileCards
          loading={loading}
          filteredCourses={filteredCourses}
          searchQuery={searchQuery}
          filterCategory={filterCategory}
          filterStatus={filterStatus}
          getLevelBadge={getLevelBadge}
          onDelete={handleDelete}
          onTogglePublish={togglePublish}
        />
      </main>
    </div>
  );
};

export default CourseManagement;

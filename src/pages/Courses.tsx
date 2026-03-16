import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layouts/PageHeader";
import {
  useCourses,
  CoursesHeroBanner,
  CoursesStatsBar,
  CoursesCategoryBar,
  CoursesFiltersBar,
  CourseGridCard,
  CourseListCard,
  CoursesFeaturedCategories,
  CoursesCtaSection,
} from "@/features/courses";

const Courses = () => {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    user,
    isInWishlist,
    toggleWishlist,
    filteredCourses,
    getRandomRating,
    getRandomStudents,
    getRandomPrice,
    getRandomOriginalPrice,
  } = useCourses();

  return (
    <>
      <div className="container mx-auto px-4 pt-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Khóa học" },
          ]}
          showBack={true}
          backHref="/"
        />
      </div>

      <CoursesHeroBanner searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CoursesStatsBar />
      <CoursesCategoryBar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <section className="container mx-auto px-4 py-8">
        <CoursesFiltersBar
          selectedCategory={selectedCategory}
          filteredCount={filteredCourses.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {loading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse border">
                <div className="h-40 bg-muted"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy khóa học</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const price = getRandomPrice();
              return (
                <CourseGridCard
                  key={course.id}
                  course={course}
                  rating={getRandomRating()}
                  students={getRandomStudents()}
                  price={price}
                  originalPrice={getRandomOriginalPrice(price)}
                  isInWishlist={isInWishlist(course.id)}
                  onToggleWishlist={() => toggleWishlist(course.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const price = getRandomPrice();
              return (
                <CourseListCard
                  key={course.id}
                  course={course}
                  rating={getRandomRating()}
                  students={getRandomStudents()}
                  price={price}
                  originalPrice={getRandomOriginalPrice(price)}
                />
              );
            })}
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              Xem thêm khóa học
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </section>

      <CoursesFeaturedCategories />
      <CoursesCtaSection user={user} />
    </>
  );
};

export default Courses;

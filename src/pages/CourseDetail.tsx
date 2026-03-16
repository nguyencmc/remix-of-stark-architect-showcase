import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { CourseReviews } from "@/components/course/CourseReviews";
import { VideoPreviewModal } from "@/components/course/VideoPreviewModal";
import {
  useCourseDetail,
  CourseHeroSection,
  CourseContentAccordion,
  CourseSidebar,
  CourseMobilePreview,
  CourseRequirementsSection,
  CourseInstructorSection,
} from "@/features/courseDetail";

const CourseDetail = () => {
  const {
    course, sections, loading,
    isWishlisted, setIsWishlisted, isEnrolled, enrolling,
    showVideoModal, setShowVideoModal, user,
    rating, totalRatings, totalStudents,
    price, originalPrice, discount, totalHours, totalLessons,
    handleEnroll, handleRatingUpdate,
    requirements, whatYouLearn, formatDuration,
  } = useCourseDetail();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy khóa học</h1>
          <p className="text-muted-foreground mb-4">Khóa học này không tồn tại hoặc đã bị xóa</p>
          <Button asChild>
            <Link to="/courses">Quay lại danh sách khóa học</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseHeroSection course={course} rating={rating} totalRatings={totalRatings} totalStudents={totalStudents} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CourseMobilePreview
              course={course} user={user} price={price} originalPrice={originalPrice}
              discount={discount} isEnrolled={isEnrolled} enrolling={enrolling}
              onEnroll={handleEnroll} onShowVideoModal={() => setShowVideoModal(true)}
            />

            {/* What you'll learn */}
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Bạn sẽ học được gì
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <CourseContentAccordion
              sections={sections} totalLessons={totalLessons}
              totalHours={totalHours} formatDuration={formatDuration}
            />

            <CourseRequirementsSection requirements={requirements} description={course.description} />
            <CourseInstructorSection course={course} totalStudents={totalStudents} />
            <CourseReviews courseId={course.id} isEnrolled={isEnrolled} onRatingUpdate={handleRatingUpdate} />
          </div>

          <CourseSidebar
            course={course} user={user} price={price} originalPrice={originalPrice}
            discount={discount} totalHours={totalHours} totalLessons={totalLessons}
            isEnrolled={isEnrolled} enrolling={enrolling} isWishlisted={isWishlisted}
            onSetIsWishlisted={setIsWishlisted} onEnroll={handleEnroll}
            onShowVideoModal={() => setShowVideoModal(true)}
          />
        </div>
      </div>

      <VideoPreviewModal
        isOpen={showVideoModal} onClose={() => setShowVideoModal(false)}
        videoUrl={course.preview_video_url} thumbnailUrl={course.image_url}
        courseTitle={course.title}
      />
    </div>
  );
};

export default CourseDetail;

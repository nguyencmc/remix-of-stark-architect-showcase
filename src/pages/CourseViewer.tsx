import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { useCourseViewer } from '@/features/courseViewer/hooks';
import {
  ViewerHeader,
  ViewerLessonNav,
  ViewerTabsContent,
  ViewerSidebar,
} from '@/features/courseViewer/components';

const CourseViewer = () => {
  const {
    id,
    course,
    sections,
    currentLesson,
    progress,
    loading,
    sidebarOpen,
    setSidebarOpen,
    getProgressPercentage,
    getCompletedLessons,
    getTotalLessons,
    handleLessonSelect,
    markLessonComplete,
    navigateLesson,
    setVideoProgress,
    setVideoDuration,
    setIsPlaying,
  } = useCourseViewer();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h1>
          <Link to="/courses">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:mr-80' : ''}`}>
        <ViewerHeader
          courseId={id || ''}
          courseTitle={course.title}
          progressPercentage={getProgressPercentage()}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <VideoPlayer
          src={currentLesson?.video_url || null}
          onTimeUpdate={(time, dur) => {
            setVideoProgress(time);
            setVideoDuration(dur);
          }}
          onEnded={() => setIsPlaying(false)}
        />

        <ViewerLessonNav
          sections={sections}
          currentLesson={currentLesson}
          progress={progress}
          onNavigate={navigateLesson}
          onMarkComplete={markLessonComplete}
        />

        <ViewerTabsContent
          courseId={id || ''}
          course={course}
          currentLesson={currentLesson}
          onMarkComplete={markLessonComplete}
        />
      </div>

      <ViewerSidebar
        courseId={id || ''}
        course={course}
        sections={sections}
        currentLesson={currentLesson}
        progress={progress}
        sidebarOpen={sidebarOpen}
        progressPercentage={getProgressPercentage()}
        completedLessons={getCompletedLessons()}
        totalLessons={getTotalLessons()}
        onCloseSidebar={() => setSidebarOpen(false)}
        onLessonSelect={handleLessonSelect}
      />
    </div>
  );
};

export default CourseViewer;

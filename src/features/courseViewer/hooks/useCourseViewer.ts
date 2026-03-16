import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';
import type { Course, Section, Lesson, LessonProgress } from '../types';

const log = logger('useCourseViewer');

export function useCourseViewer() {
  const { id } = useParams();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [_videoProgress, setVideoProgress] = useState(0);
  const [_videoDuration, setVideoDuration] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchCourseData = useCallback(async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', id)
        .order('section_order');

      if (sectionsError) throw sectionsError;

      const sectionsWithLessons = await Promise.all(
        (sectionsData || []).map(async (section) => {
          const { data: lessonsData } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('section_id', section.id)
            .order('lesson_order');

          const lessonsWithAttachments = await Promise.all(
            (lessonsData || []).map(async (lesson) => {
              const { data: attachments } = await supabase
                .from('lesson_attachments')
                .select('*')
                .eq('lesson_id', lesson.id)
                .order('display_order');

              return {
                ...lesson,
                attachments: attachments || []
              };
            })
          );

          return {
            ...section,
            lessons: lessonsWithAttachments
          };
        })
      );

      setSections(sectionsWithLessons);

      if (sectionsWithLessons.length > 0 && sectionsWithLessons[0].lessons.length > 0) {
        setCurrentLesson(sectionsWithLessons[0].lessons[0]);
      }

      if (user) {
        const { data: progressData } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id);

        if (progressData) {
          const progressMap = new Map<string, LessonProgress>();
          progressData.forEach(p => {
            progressMap.set(p.lesson_id!, {
              lesson_id: p.lesson_id!,
              is_completed: p.is_completed || false,
              watch_time_seconds: p.watch_time_seconds || 0
            });
          });
          setProgress(progressMap);
        }
      }
    } catch (error: unknown) {
      log.error('Error fetching course', getErrorMessage(error));
      toast.error('Không thể tải khóa học');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, user, fetchCourseData]);

  const getTotalLessons = () => {
    return sections.reduce((acc, section) => acc + section.lessons.length, 0);
  };

  const getCompletedLessons = () => {
    let count = 0;
    progress.forEach(p => {
      if (p.is_completed) count++;
    });
    return count;
  };

  const getProgressPercentage = () => {
    const total = getTotalLessons();
    if (total === 0) return 0;
    return Math.round((getCompletedLessons() / total) * 100);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
    setVideoProgress(0);
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu tiến độ');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: id,
          lesson_id: lessonId,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      const newProgress = new Map(progress);
      newProgress.set(lessonId, {
        lesson_id: lessonId,
        is_completed: true,
        watch_time_seconds: progress.get(lessonId)?.watch_time_seconds || 0
      });
      setProgress(newProgress);

      const totalLessons = getTotalLessons();
      let completedCount = 0;
      newProgress.forEach(p => {
        if (p.is_completed) completedCount++;
      });
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      const { error: enrollmentError } = await supabase
        .from('user_course_enrollments')
        .update({
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', user.id)
        .eq('course_id', id);

      if (enrollmentError) {
        log.error('Error updating enrollment progress', getErrorMessage(enrollmentError));
      }

      toast.success('Đã hoàn thành bài học');
    } catch (error: unknown) {
      log.error('Error marking lesson complete', getErrorMessage(error));
      toast.error('Không thể cập nhật tiến độ');
    }
  };

  const navigateLesson = (direction: 'prev' | 'next') => {
    const allLessons = sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);

    if (direction === 'prev' && currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const _formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const _handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoProgress(videoRef.current.currentTime);
    }
  };

  const _handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const _togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const _toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const _handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setVideoProgress(time);
    }
  };

  const _toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return {
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
    _videoProgress,
    _videoDuration,
    isPlaying,
    isMuted,
    videoRef,
    _formatTime,
    _handleVideoTimeUpdate,
    _handleVideoLoadedMetadata,
    _togglePlay,
    _toggleMute,
    _handleSeek,
    _toggleFullscreen,
  };
}

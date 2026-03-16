import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";
import { getErrorMessage } from "@/lib/utils";
import type { Course, Section } from "../types";

const log = logger("useCourseDetail");

const DEFAULT_REQUIREMENTS = [
  "Không yêu cầu kiến thức trước, phù hợp cho người mới bắt đầu",
  "Máy tính có kết nối internet",
  "Tinh thần học hỏi và sẵn sàng thực hành",
];

const DEFAULT_WHAT_YOU_LEARN = [
  "Nắm vững kiến thức từ cơ bản đến nâng cao",
  "Xây dựng dự án thực tế từ đầu đến cuối",
  "Hiểu sâu các khái niệm quan trọng",
  "Áp dụng vào công việc thực tế",
];

export function useCourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [_isPlaying, _setIsPlaying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [liveRating, setLiveRating] = useState<{ avg: number; count: number } | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const fetchCourse = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from("course_sections")
        .select("*")
        .eq("course_id", id)
        .order("section_order");

      if (sectionsError) throw sectionsError;

      const sectionsWithLessons = await Promise.all(
        (sectionsData || []).map(async (section) => {
          const { data: lessonsData } = await supabase
            .from("course_lessons")
            .select("id, title, duration_minutes, is_preview, content_type, video_url")
            .eq("section_id", section.id)
            .order("lesson_order");

          return {
            ...section,
            lessons: lessonsData || [],
          };
        })
      );

      setSections(sectionsWithLessons);
    } catch (error: unknown) {
      log.error("Error fetching course", getErrorMessage(error));
    }
    setLoading(false);
  }, [id]);

  const checkEnrollment = useCallback(async () => {
    if (!user || !id) return;

    const { data, error } = await supabase
      .from("user_course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", id)
      .maybeSingle();

    if (!error && data) {
      setIsEnrolled(true);
    }
  }, [user, id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  useEffect(() => {
    if (user && id) {
      checkEnrollment();
    }
  }, [user, id, checkEnrollment]);

  const handleEnroll = async () => {
    if (!user || !id) return;

    setEnrolling(true);
    const { error } = await supabase
      .from("user_course_enrollments")
      .insert({
        user_id: user.id,
        course_id: id,
        progress_percentage: 0,
      });

    if (error) {
      log.error("Error enrolling", getErrorMessage(error));
    } else {
      setIsEnrolled(true);
    }
    setEnrolling(false);
  };

  const rating = liveRating?.avg ?? course?.rating ?? 0;
  const totalRatings = liveRating?.count ?? course?.rating_count ?? 0;
  const totalStudents = course?.student_count || 0;
  const price = course?.price || 0;
  const originalPrice = course?.original_price || 0;
  const discount = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0;
  const totalHours = course?.duration_hours || 0;
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const handleRatingUpdate = (avgRating: number, count: number) => {
    setLiveRating({ avg: avgRating, count });
  };

  const requirements = course?.requirements?.length
    ? course.requirements
    : DEFAULT_REQUIREMENTS;

  const whatYouLearn = course?.what_you_learn?.length
    ? course.what_you_learn
    : DEFAULT_WHAT_YOU_LEARN;

  const formatDuration = (minutes: number | null) => {
    if (!minutes || minutes === 0) return "";
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return {
    course,
    sections,
    loading,
    _isPlaying,
    isWishlisted,
    setIsWishlisted,
    isEnrolled,
    enrolling,
    showVideoModal,
    setShowVideoModal,
    user,
    rating,
    totalRatings,
    totalStudents,
    price,
    originalPrice,
    discount,
    totalHours,
    totalLessons,
    handleEnroll,
    handleRatingUpdate,
    requirements,
    whatYouLearn,
    formatDuration,
  };
}

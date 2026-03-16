import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { EnrolledCourse, WishlistCourse, Certificate } from './types';

export function useMyCoursesData() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [completedCourses, setCompletedCourses] = useState<EnrolledCourse[]>([]);
  const [wishlistCourses, setWishlistCourses] = useState<WishlistCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch enrolled courses with progress percentage
    const { data: enrolled } = await supabase
      .from('user_course_enrollments')
      .select(`
        id,
        course_id,
        progress_percentage,
        enrolled_at,
        completed_at,
        course:courses(id, title, slug, image_url, creator_name, lesson_count, duration_hours, level)
      `)
      .eq('user_id', user?.id)
      .order('enrolled_at', { ascending: false });

    if (enrolled) {
      // Also fetch lesson progress for each course
      const courseIds = enrolled.map(e => e.course_id).filter(Boolean);

      const { data: lessonProgress } = await supabase
        .from('user_course_progress')
        .select('course_id, is_completed, last_watched_at')
        .eq('user_id', user?.id)
        .in('course_id', courseIds);

      // Calculate completed lessons and last activity for each course
      const progressMap = new Map<string, { completed: number; lastActivity: string | null }>();

      if (lessonProgress) {
        lessonProgress.forEach(lp => {
          const courseId = lp.course_id;
          if (!progressMap.has(courseId)) {
            progressMap.set(courseId, { completed: 0, lastActivity: null });
          }
          const current = progressMap.get(courseId)!;
          if (lp.is_completed) {
            current.completed++;
          }
          if (lp.last_watched_at && (!current.lastActivity || lp.last_watched_at > current.lastActivity)) {
            current.lastActivity = lp.last_watched_at;
          }
        });
      }

      const enrichedEnrolled = enrolled.map((e: Record<string, unknown>) => {
        const progressInfo = progressMap.get(e.course_id as string);
        return {
          ...e,
          completed_lessons: progressInfo?.completed || 0,
          last_activity: progressInfo?.lastActivity || e.enrolled_at,
        };
      });

      // Filter courses: in progress (< 100%) and completed (100% or completed_at is not null)
      const inProgress = enrichedEnrolled.filter((e: Record<string, unknown>) =>
        (e.progress_percentage as number) < 100 && !e.completed_at
      );
      const completed = enrichedEnrolled.filter((e: Record<string, unknown>) =>
        (e.progress_percentage as number) >= 100 || e.completed_at
      );

      setEnrolledCourses(inProgress as unknown as EnrolledCourse[]);
      setCompletedCourses(completed as unknown as EnrolledCourse[]);
    }

    // Fetch wishlist
    const { data: wishlist } = await supabase
      .from('course_wishlists')
      .select(`
        id,
        course_id,
        course:courses(id, title, image_url, creator_name, price)
      `)
      .eq('user_id', user?.id);

    if (wishlist) {
      setWishlistCourses(wishlist as unknown as WishlistCourse[]);
    }

    // Fetch certificates
    const { data: certs } = await supabase
      .from('course_certificates')
      .select(`
        id,
        certificate_number,
        completion_date,
        final_score,
        issued_at,
        course_id,
        course:courses(id, title, image_url, creator_name)
      `)
      .eq('user_id', user?.id)
      .order('issued_at', { ascending: false });

    if (certs) {
      setCertificates(certs as unknown as Certificate[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return { enrolledCourses, completedCourses, wishlistCourses, certificates, loading };
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import type { EnrolledCourse, WishlistCourse } from "../types";

export function useMyCourses() {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["my-courses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_course_enrollments")
        .select(`
          *,
          course:courses(id, title, slug, image_url, creator_name, lesson_count, duration_hours, level)
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;
      return data as EnrolledCourse[];
    },
    enabled: !!user?.id,
  });

  const {
    data: wishlistCourses,
    isLoading: wishlistLoading,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ["wishlist-courses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: wishlist, error } = await supabase
        .from("course_wishlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!wishlist || wishlist.length === 0) return [];

      const courseIds = wishlist.map((w) => w.course_id).filter(Boolean) as string[];
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, slug, image_url, creator_name, rating, student_count")
        .in("id", courseIds);

      return wishlist.map((item) => ({
        ...item,
        course: courses?.find((c) => c.id === item.course_id),
      })) as WishlistCourse[];
    },
    enabled: !!user?.id,
  });

  return {
    user,
    enrollments,
    enrollmentsLoading,
    wishlistCourses,
    wishlistLoading,
    isInWishlist,
    toggleWishlist,
    refetchWishlist,
  };
}

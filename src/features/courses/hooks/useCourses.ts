import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { logger } from "@/lib/logger";
import type { Course } from "../types";

const log = logger("Courses");

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("courses")
      .select("*")
      .order("view_count", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      log.error("Error fetching courses", error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRandomRating = () => (4 + Math.random()).toFixed(1);
  const getRandomStudents = () => Math.floor(Math.random() * 50000) + 1000;
  const getRandomPrice = () => Math.floor(Math.random() * 500000) + 199000;
  const getRandomOriginalPrice = (price: number) =>
    Math.floor(price * (1.5 + Math.random()));

  return {
    courses,
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
  };
}

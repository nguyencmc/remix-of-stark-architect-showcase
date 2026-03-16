import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Book, Chapter, BookmarkType, ReadingProgress } from "../types";
import { PAGE_BREAK_REGEX } from "../types";

export function useBookReader() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reading settings
  const [fontSize, _setFontSize] = useState(16);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showContents, setShowContents] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");
  const [charsPerPage, setCharsPerPage] = useState(600);
  const [prevPage, setPrevPage] = useState(0);

  // Calculate chars per page based on viewport
  const calculateCharsPerPage = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const bookHeight = Math.min(viewportHeight - 180, 600);
    const linesPerPage = Math.floor(bookHeight / (fontSize * 1.8));
    const charsPerLine = 45;
    return Math.max(300, charsPerLine * linesPerPage * 0.75);
  }, [fontSize]);

  useEffect(() => {
    const update = () => setCharsPerPage(calculateCharsPerPage());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [calculateCharsPerPage]);

  // Fetch book
  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ["book-reader", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, slug, content, author_name, page_count")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Book | null;
    },
  });

  // Fetch chapters
  const { data: chapters = [] } = useQuery({
    queryKey: ["book-chapters", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from("book_chapters")
        .select("*")
        .eq("book_id", book.id)
        .order("chapter_order");
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!book?.id,
  });

  // Fetch user's reading progress
  const { data: progress } = useQuery({
    queryKey: ["reading-progress", book?.id, user?.id],
    queryFn: async () => {
      if (!book?.id || !user?.id) return null;
      const { data, error } = await supabase
        .from("user_book_progress")
        .select("*")
        .eq("book_id", book.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      return data as ReadingProgress | null;
    },
    enabled: !!book?.id && !!user?.id,
  });

  // Fetch bookmarks
  const { data: bookmarks = [] } = useQuery({
    queryKey: ["book-bookmarks", book?.id, user?.id],
    queryFn: async () => {
      if (!book?.id || !user?.id) return [];
      const { data, error } = await supabase
        .from("book_bookmarks")
        .select("*")
        .eq("book_id", book.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BookmarkType[];
    },
    enabled: !!book?.id && !!user?.id,
  });

  // Split content into pages
  const pages = useMemo(() => {
    if (!book?.content) return [];
    const content = book.content;

    const hasManualBreaks = PAGE_BREAK_REGEX.test(content);
    PAGE_BREAK_REGEX.lastIndex = 0;

    if (hasManualBreaks) {
      const manualPages = content
        .split(PAGE_BREAK_REGEX)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (manualPages.length > 1) return manualPages;
    }

    const pageList: string[] = [];
    const paragraphs = content.split(/\n\n+/);
    let currentPageContent = "";

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      if ((currentPageContent + "\n\n" + trimmed).length > charsPerPage) {
        if (currentPageContent) pageList.push(currentPageContent.trim());

        if (trimmed.length > charsPerPage) {
          const sentences = trimmed.split(/(?<=[.!?])\s+/);
          let buffer = "";
          for (const sentence of sentences) {
            if ((buffer + " " + sentence).length > charsPerPage) {
              if (buffer) pageList.push(buffer.trim());
              buffer = sentence;
            } else {
              buffer += (buffer ? " " : "") + sentence;
            }
          }
          currentPageContent = buffer;
        } else {
          currentPageContent = trimmed;
        }
      } else {
        currentPageContent += (currentPageContent ? "\n\n" : "") + trimmed;
      }
    }

    if (currentPageContent.trim()) pageList.push(currentPageContent.trim());
    return pageList;
  }, [book?.content, charsPerPage]);

  const totalPages = pages.length;

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: {
      position: number;
      timeSpent: number;
      isCompleted?: boolean;
    }) => {
      if (!book?.id || !user?.id) return;
      const { error } = await supabase.from("user_book_progress").upsert(
        {
          user_id: user.id,
          book_id: book.id,
          current_position: data.position,
          total_time_seconds: data.timeSpent,
          is_completed: data.isCompleted || false,
          last_read_at: new Date().toISOString(),
          ...(data.isCompleted && { completed_at: new Date().toISOString() }),
        },
        { onConflict: "user_id,book_id" }
      );
      if (error) throw error;
    },
  });

  // Add bookmark mutation
  const addBookmarkMutation = useMutation({
    mutationFn: async (page: number) => {
      if (!book?.id || !user?.id) return;
      const { error } = await supabase.from("book_bookmarks").insert({
        user_id: user.id,
        book_id: book.id,
        position: page * charsPerPage,
        title: `Trang ${page + 1}`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["book-bookmarks", book?.id, user?.id],
      });
      toast.success("Đã đánh dấu trang");
    },
  });

  // Initialize from progress
  useEffect(() => {
    if (progress?.current_position && charsPerPage > 0) {
      const page = Math.floor(progress.current_position / charsPerPage);
      const initialPage = Math.min(page, Math.max(0, totalPages - 1));
      const normalizedPage = initialPage % 2 === 0 ? initialPage : initialPage - 1;
      setCurrentPage(normalizedPage);
      setPrevPage(normalizedPage);
    }
    if (progress?.total_time_seconds) {
      setReadingTime(progress.total_time_seconds);
    }
  }, [progress, totalPages, charsPerPage]);

  // Reading timer
  useEffect(() => {
    timerRef.current = setInterval(
      () => setReadingTime((prev) => prev + 1),
      1000
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-save progress
  useEffect(() => {
    const saveTimer = setInterval(() => {
      if (user && book) {
        saveProgressMutation.mutate({
          position: currentPage * charsPerPage,
          timeSpent: readingTime,
        });
      }
    }, 30000);
    return () => clearInterval(saveTimer);
  }, [currentPage, readingTime, user, book, charsPerPage, saveProgressMutation]);

  // Page flip with animation
  const goToNextPage = useCallback(() => {
    if (currentPage + 2 < totalPages && !isFlipping) {
      setPrevPage(currentPage);
      setFlipDirection("right");
      setIsFlipping(true);
      setCurrentPage((prev) => prev + 2);
      setTimeout(() => {
        setIsFlipping(false);
      }, 900);
    }
  }, [currentPage, totalPages, isFlipping]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setPrevPage(currentPage);
      setFlipDirection("left");
      setIsFlipping(true);
      setCurrentPage((prev) => Math.max(0, prev - 2));
      setTimeout(() => {
        setIsFlipping(false);
      }, 900);
    }
  }, [currentPage, isFlipping]);

  const goToPage = useCallback(
    (page: number) => {
      const targetPage = page % 2 === 0 ? page : page - 1;
      setPrevPage(currentPage);
      setCurrentPage(Math.min(Math.max(0, targetPage), totalPages - 1));
      setShowContents(false);
    },
    [currentPage, totalPages]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // Check if current page is bookmarked
  const currentBookmark = bookmarks.find((b) => {
    const bookmarkPage = Math.floor(b.position / charsPerPage);
    return bookmarkPage === currentPage || bookmarkPage === currentPage + 1;
  });

  const toggleBookmark = useCallback(() => {
    if (currentBookmark) {
      toast.info("Đã có đánh dấu trang này");
    } else {
      addBookmarkMutation.mutate(currentPage);
    }
  }, [currentBookmark, addBookmarkMutation, currentPage]);

  return {
    book,
    bookLoading,
    chapters,
    bookmarks,
    pages,
    totalPages,
    currentPage,
    setCurrentPage,
    prevPage,
    setPrevPage,
    fontSize,
    isFlipping,
    flipDirection,
    showContents,
    setShowContents,
    currentBookmark,
    charsPerPage,
    navigate,
    goToNextPage,
    goToPrevPage,
    goToPage,
    toggleBookmark,
  };
}

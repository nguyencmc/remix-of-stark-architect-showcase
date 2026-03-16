import {
  Bookmark,
  BookmarkCheck,
  Home,
  List,
  Pencil,
  Headphones,
  LayoutPanelLeft,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookmarkType } from "../types";

interface BookToolbarProps {
  currentBookmark: BookmarkType | undefined;
  onNavigateHome: () => void;
  onShowContents: () => void;
  onToggleBookmark: () => void;
}

export function BookToolbar({
  currentBookmark,
  onNavigateHome,
  onShowContents,
  onToggleBookmark,
}: BookToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100 z-50">
      <button
        onClick={onNavigateHome}
        className="w-10 h-10 rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
        title="Thư viện"
      >
        <Home className="w-5 h-5" />
      </button>
      <button
        onClick={onShowContents}
        className="w-10 h-10 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors"
        title="Mục lục"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleBookmark}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          currentBookmark
            ? "text-amber-500 bg-amber-50"
            : "text-orange-400 hover:bg-orange-50"
        )}
        title="Đánh dấu"
      >
        <Pencil className="w-5 h-5" />
      </button>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-50 transition-colors"
        title="Chế độ xem"
      >
        <LayoutPanelLeft className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleBookmark}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          currentBookmark
            ? "text-amber-500 bg-amber-50"
            : "text-pink-400 hover:bg-pink-50"
        )}
        title="Đánh dấu trang"
      >
        {currentBookmark ? (
          <BookmarkCheck className="w-5 h-5" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
      </button>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-50 transition-colors"
        title="Nghe audio"
      >
        <Headphones className="w-5 h-5" />
      </button>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
        title="Thêm"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}

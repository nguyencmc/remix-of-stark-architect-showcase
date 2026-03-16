import { Bookmark } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Chapter, BookmarkType } from "../types";

interface BookContentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapters: Chapter[];
  bookmarks: BookmarkType[];
  pages: string[];
  charsPerPage: number;
  onGoToPage: (page: number) => void;
}

export function BookContentsSheet({
  open,
  onOpenChange,
  chapters,
  bookmarks,
  pages,
  charsPerPage,
  onGoToPage,
}: BookContentsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle className="text-gray-800 font-serif">Mục lục</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-1">
          {chapters.length > 0
            ? chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() =>
                    onGoToPage(Math.floor(chapter.position / charsPerPage))
                  }
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors flex items-center justify-between"
                >
                  <span>{chapter.title}</span>
                  <span className="text-gray-400 text-sm">
                    {Math.floor(chapter.position / charsPerPage) + 1}
                  </span>
                </button>
              ))
            : pages.slice(0, 20).map((page, idx) => {
                const firstLine = page
                  .split("\n")[0]
                  ?.replace(/^#+\s*/, "")
                  .substring(0, 40);
                if (!firstLine) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => onGoToPage(idx)}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors flex items-center justify-between text-sm"
                  >
                    <span className="truncate">{firstLine}...</span>
                    <span className="text-gray-400 ml-2">{idx + 1}</span>
                  </button>
                );
              })}
        </div>
        {bookmarks.length > 0 && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 px-4">
              Đánh dấu của bạn
            </h3>
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() =>
                  onGoToPage(Math.floor(bookmark.position / charsPerPage))
                }
                className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-2 text-sm"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                {bookmark.title}
              </button>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

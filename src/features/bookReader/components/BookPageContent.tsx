import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookPageContentProps {
  pageIndex: number;
  totalPages: number;
  pages: string[];
  fontSize: number;
}

function formatContent(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="text-base font-semibold mt-4 mb-2 text-gray-800"
        >
          {trimmed.substring(4)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-lg font-bold mt-5 mb-3 text-gray-900">
          {trimmed.substring(3)}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      return (
        <h1 key={i} className="text-xl font-bold mt-3 mb-4 text-gray-900">
          {trimmed.substring(2)}
        </h1>
      );
    } else if (trimmed) {
      return (
        <p
          key={i}
          className="mb-3 text-gray-700 leading-relaxed text-justify indent-8"
        >
          {trimmed}
        </p>
      );
    }
    return null;
  });
}

export function BookPageContent({
  pageIndex,
  totalPages,
  pages,
  fontSize,
}: BookPageContentProps) {
  return (
    <div className="h-full flex flex-col relative">
      {/* Floral border */}
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-200/30 via-pink-200/30 to-green-200/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-pink-200/30 via-green-200/30 to-pink-200/30 pointer-events-none" />
      <div
        className={cn(
          "absolute top-0 w-3 h-full bg-gradient-to-b from-green-200/30 via-pink-200/30 to-green-200/30 pointer-events-none",
          pageIndex % 2 === 0 ? "left-0" : "right-0"
        )}
      />

      <div
        className="flex-1 px-8 py-6 overflow-hidden"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.75",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        {pageIndex < totalPages ? (
          formatContent(pages[pageIndex] || "")
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            {pageIndex >= totalPages && pageIndex % 2 !== 0 && (
              <p className="text-sm">Hết nội dung</p>
            )}
            {pageIndex >= totalPages && pageIndex % 2 === 0 && (
              <BookOpen className="w-16 h-16 opacity-30" />
            )}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 py-3 text-center">
        <span className="text-sm text-gray-500 font-serif">
          {pageIndex < totalPages ? pageIndex + 1 : ""}
        </span>
      </div>
    </div>
  );
}

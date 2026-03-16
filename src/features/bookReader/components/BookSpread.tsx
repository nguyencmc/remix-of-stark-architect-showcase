import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookPageContent } from "./BookPageContent";

interface BookSpreadProps {
  pages: string[];
  totalPages: number;
  currentPage: number;
  prevPage: number;
  fontSize: number;
  isFlipping: boolean;
  flipDirection: "left" | "right";
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function BookSpread({
  pages,
  totalPages,
  currentPage,
  prevPage,
  fontSize,
  isFlipping,
  flipDirection,
  onNextPage,
  onPrevPage,
}: BookSpreadProps) {
  const pageProps = { totalPages, pages, fontSize };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-4 book-container"
      style={{ height: "calc(100vh - 160px)", maxHeight: "650px" }}
    >
      {/* Navigation Arrows */}
      {!isFlipping && (
        <>
          <button
            onClick={onPrevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage + 2 >= totalPages}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-16 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* 3D Book Wrapper */}
      <div className="h-full flex shadow-2xl rounded-lg mx-10 relative bg-[#fefcf3]">
        {/* BASE LAYER: Target Pages */}
        <div className="w-full h-full flex absolute top-0 left-0 z-0">
          <div
            className="flex-1 border-r border-amber-200/50 relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)",
            }}
          >
            <BookPageContent pageIndex={currentPage} {...pageProps} />
          </div>
          <div
            className="flex-1 border-l border-amber-200/50 relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(0,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)",
            }}
          >
            <BookPageContent pageIndex={currentPage + 1} {...pageProps} />
          </div>
        </div>

        {/* STATIC OVERLAY LAYER */}
        {isFlipping && flipDirection === "right" && (
          <div
            className="w-1/2 h-full absolute top-0 left-0 z-10 bg-[#fefcf3] border-r border-amber-200/50 overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)",
            }}
          >
            <BookPageContent pageIndex={prevPage} {...pageProps} />
          </div>
        )}
        {isFlipping && flipDirection === "left" && (
          <div
            className="w-1/2 h-full absolute top-0 right-0 z-10 bg-[#fefcf3] border-l border-amber-200/50 overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(0,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)",
            }}
          >
            <BookPageContent pageIndex={prevPage + 1} {...pageProps} />
          </div>
        )}

        {/* FLIPPING LEAF */}
        {isFlipping && (
          <div
            className={cn(
              "flipping-leaf",
              flipDirection === "right"
                ? "animate-flip-next right-0 origin-left"
                : "animate-flip-prev left-0 origin-right"
            )}
          >
            <div
              className="book-page page-front border-l border-r border-amber-200/50 overflow-hidden shadow-sm"
              style={{ backfaceVisibility: "hidden" }}
            >
              <BookPageContent
                pageIndex={
                  flipDirection === "right" ? prevPage + 1 : prevPage
                }
                {...pageProps}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
            </div>
            <div
              className="book-page page-back border-l border-r border-amber-200/50 overflow-hidden shadow-sm"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <BookPageContent
                pageIndex={
                  flipDirection === "right" ? currentPage : currentPage + 1
                }
                {...pageProps}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Spine Graphic */}
        <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 z-40 pointer-events-none bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>
    </div>
  );
}

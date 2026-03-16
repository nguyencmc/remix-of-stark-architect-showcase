import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  useBookReader,
  BookSpread,
  BookToolbar,
  BookContentsSheet,
} from "@/features/bookReader";

const BOOK_STYLES = `
  .book-container { perspective: 2000px; }
  .book-page { backface-visibility: hidden; position: absolute; top: 0; width: 100%; height: 100%; background-color: #fefcf3; }
  .page-front { z-index: 2; transform: rotateY(0deg); }
  .page-back { z-index: 1; transform: rotateY(180deg); }
  .flipping-leaf {
    position: absolute; top: 0; height: 100%; width: 50%;
    transform-style: preserve-3d; z-index: 50;
  }
  .shadow-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.1));
    opacity: 0; transition: opacity 0.5s; pointer-events: none;
  }
  @keyframes flipNext { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(-180deg); } }
  @keyframes flipPrev { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(180deg); } }
  .animate-flip-next { animation: flipNext 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards; transform-origin: left center; right: 0; }
  .animate-flip-prev { animation: flipPrev 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards; transform-origin: right center; left: 0; }
`;

const BookReader = () => {
  const {
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
  } = useBookReader();

  if (bookLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center justify-center text-gray-600">
        <BookOpen className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">Không tìm thấy sách</p>
        <Button variant="outline" onClick={() => navigate("/books")} className="mt-4">Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Decorative corner */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0,0 Q50,5 50,50 Q5,50 0,0" fill="none" stroke="#86efac" strokeWidth="1" />
          <circle cx="15" cy="15" r="3" fill="#86efac" />
        </svg>
      </div>

      <style>{BOOK_STYLES}</style>

      <BookSpread
        pages={pages}
        totalPages={totalPages}
        currentPage={currentPage}
        prevPage={prevPage}
        fontSize={fontSize}
        isFlipping={isFlipping}
        flipDirection={flipDirection}
        onNextPage={goToNextPage}
        onPrevPage={goToPrevPage}
      />

      {/* Progress Slider */}
      <div className="w-full max-w-2xl mx-auto px-8 mt-4">
        <Slider
          value={[currentPage]}
          min={0}
          max={Math.max(0, totalPages - 2)}
          step={2}
          onValueChange={([value]) => { setCurrentPage(value); setPrevPage(value); }}
          className="cursor-pointer"
        />
      </div>

      <BookToolbar
        currentBookmark={currentBookmark}
        onNavigateHome={() => navigate("/books")}
        onShowContents={() => setShowContents(true)}
        onToggleBookmark={toggleBookmark}
      />

      <BookContentsSheet
        open={showContents}
        onOpenChange={setShowContents}
        chapters={chapters}
        bookmarks={bookmarks}
        pages={pages}
        charsPerPage={charsPerPage}
        onGoToPage={goToPage}
      />
    </div>
  );
};

export default BookReader;

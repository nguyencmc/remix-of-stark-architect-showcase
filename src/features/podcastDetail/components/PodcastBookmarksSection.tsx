import { Button } from "@/components/ui/button";
import { BookmarksList } from "@/components/podcast/BookmarksList";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import type { PodcastBookmark } from "@/features/podcasts/hooks/usePodcastBookmarks";

interface PodcastBookmarksSectionProps {
  bookmarks: PodcastBookmark[];
  currentTime: number;
  showBookmarks: boolean;
  onToggleBookmarks: (open: boolean) => void;
  onSeek: (time: number) => void;
  onRemoveBookmark: (id: string) => void;
  onAddBookmark: () => void;
}

export const PodcastBookmarksSection = ({
  bookmarks,
  currentTime,
  showBookmarks,
  onToggleBookmarks,
  onSeek,
  onRemoveBookmark,
  onAddBookmark,
}: PodcastBookmarksSectionProps) => {
  return (
    <Collapsible open={showBookmarks} onOpenChange={onToggleBookmarks} className="mt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-white/70 hover:text-white hover:bg-white/10">
          <span className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Bookmarks ({bookmarks.length})
          </span>
          {showBookmarks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <BookmarksList
          bookmarks={bookmarks}
          currentTime={currentTime}
          onSeek={onSeek}
          onRemove={onRemoveBookmark}
          onAdd={onAddBookmark}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

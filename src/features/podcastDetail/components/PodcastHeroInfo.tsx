import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Clock,
  Headphones,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";
import type { Podcast, PodcastCategory } from "../types";
import { difficultyLabels, formatTime, getThumbnail } from "../types";

interface PodcastHeroInfoProps {
  podcast: Podcast;
  category: PodcastCategory | null | undefined;
  onSendToMiniPlayer: () => void;
}

export const PodcastHeroInfo = ({
  podcast,
  category,
  onSendToMiniPlayer,
}: PodcastHeroInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnail */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={getThumbnail(podcast)}
            alt={podcast.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {category && (
            <Badge variant="secondary" className="bg-white/10 text-white border-0">
              {category.name}
            </Badge>
          )}
          {podcast.difficulty && (
            <Badge className={difficultyLabels[podcast.difficulty]?.color || ""}>
              {difficultyLabels[podcast.difficulty]?.label || podcast.difficulty}
            </Badge>
          )}
          <Badge variant="outline" className="border-white/30 text-white">
            Tập {podcast.episode_number}
          </Badge>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {podcast.title}
        </h1>

        <p className="text-white/70 mb-6 line-clamp-3">
          {podcast.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{podcast.host_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(podcast.duration_seconds || 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span>{podcast.listen_count?.toLocaleString()} lượt nghe</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
            <Heart className="w-4 h-4 mr-2" />
            Yêu thích
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={onSendToMiniPlayer}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Mini Player
          </Button>
        </div>
      </div>
    </div>
  );
};

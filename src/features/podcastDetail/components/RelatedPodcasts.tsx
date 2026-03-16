import { Link } from "react-router-dom";
import type { Podcast } from "../types";
import { formatTime, getThumbnail } from "../types";

interface RelatedPodcastsProps {
  podcasts: Podcast[] | undefined;
}

export const RelatedPodcasts = ({ podcasts }: RelatedPodcastsProps) => {
  return (
    <div className="lg:col-span-1">
      <h3 className="text-lg font-semibold mb-4">Podcast liên quan</h3>
      <div className="space-y-3">
        {podcasts?.map((pod) => (
          <Link
            key={pod.id}
            to={`/podcast/${pod.slug}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={getThumbnail(pod)}
                alt={pod.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-white line-clamp-1 group-hover:text-primary transition-colors">
                {pod.title}
              </h4>
              <p className="text-xs text-white/50 mt-1">
                Tập {pod.episode_number} • {formatTime(pod.duration_seconds || 0)}
              </p>
            </div>
          </Link>
        ))}

        {(!podcasts || podcasts.length === 0) && (
          <p className="text-white/50 text-sm">Không có podcast liên quan</p>
        )}
      </div>
    </div>
  );
};

export interface Podcast {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  episode_number: number | null;
  host_name: string | null;
  listen_count: number | null;
  is_featured: boolean | null;
  difficulty: string | null;
  transcript: string | null;
}

export interface PodcastCategory {
  id: string;
  name: string;
  slug: string;
}

export const podcastThumbnails: Record<string, string> = {
  "toeic": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
  "ielts": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop",
  "default": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop",
};

// Sample audio for demo
export const sampleAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: "Cơ bản", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  intermediate: { label: "Trung bình", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  advanced: { label: "Nâng cao", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const formatTime = (time: number): string => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getThumbnail = (pod: Podcast): string => {
  if (pod.thumbnail_url) return pod.thumbnail_url;
  if (pod.title.toLowerCase().includes("toeic")) return podcastThumbnails.toeic;
  if (pod.title.toLowerCase().includes("ielts")) return podcastThumbnails.ielts;
  return podcastThumbnails.default;
};

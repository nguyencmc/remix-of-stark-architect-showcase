import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ABRepeatControl } from "@/components/podcast/ABRepeatControl";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Gauge,
  Bookmark,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { playbackRates, formatTime } from "../types";

interface PodcastAudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  playbackRate: number;
  pointA: number | null;
  pointB: number | null;
  abRepeatActive: boolean;
  onTogglePlay: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onToggleRepeat: () => void;
  onToggleMute: () => void;
  onSetPlaybackRate: (rate: number) => void;
  onSetPointA: () => void;
  onSetPointB: () => void;
  onClearABRepeat: () => void;
  onAddBookmark: () => void;
}

export const PodcastAudioPlayer = ({
  audioRef,
  audioSrc,
  currentTime,
  duration,
  isPlaying,
  volume,
  isMuted,
  isRepeat,
  playbackRate,
  pointA,
  pointB,
  abRepeatActive,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onSkipForward,
  onSkipBackward,
  onToggleRepeat,
  onToggleMute,
  onSetPlaybackRate,
  onSetPointA,
  onSetPointB,
  onClearABRepeat,
  onAddBookmark,
}: PodcastAudioPlayerProps) => {
  return (
    <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6">
      <audio ref={audioRef} src={audioSrc} />

      {/* Progress Bar */}
      <div className="mb-4 relative">
        {/* A-B markers */}
        {pointA !== null && duration > 0 && (
          <div
            className="absolute top-0 h-full w-0.5 bg-green-500 z-10"
            style={{ left: `${(pointA / duration) * 100}%` }}
          />
        )}
        {pointB !== null && duration > 0 && (
          <div
            className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
            style={{ left: `${(pointB / duration) * 100}%` }}
          />
        )}
        {abRepeatActive && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary/30 rounded"
            style={{
              left: `${(pointA! / duration) * 100}%`,
              width: `${((pointB! - pointA!) / duration) * 100}%`,
            }}
          />
        )}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={onSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRepeat}
            className={`text-white/70 hover:text-white hover:bg-white/10 ${isRepeat ? "text-primary" : ""}`}
          >
            <Repeat className="w-5 h-5" />
          </Button>

          {/* A-B Repeat Control */}
          <ABRepeatControl
            pointA={pointA}
            pointB={pointB}
            currentTime={currentTime}
            duration={duration}
            onSetPointA={onSetPointA}
            onSetPointB={onSetPointB}
            onClear={onClearABRepeat}
            isActive={abRepeatActive}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkipBackward}
            className="text-white hover:bg-white/10"
          >
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            onClick={onTogglePlay}
            size="lg"
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSkipForward}
            className="text-white hover:bg-white/10"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Playback Speed */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 gap-1 font-medium min-w-[52px]"
              >
                <Gauge className="w-4 h-4" />
                {playbackRate}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              {playbackRates.map((rate) => (
                <DropdownMenuItem
                  key={rate}
                  onClick={() => onSetPlaybackRate(rate)}
                  className={playbackRate === rate ? "bg-accent font-medium" : ""}
                >
                  {rate}x {rate === 1 && "(Bình thường)"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bookmark button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddBookmark}
            className="text-white/70 hover:text-white hover:bg-white/10"
            title="Thêm bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={onVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

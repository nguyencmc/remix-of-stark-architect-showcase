import { Button } from "@/components/ui/button";
import { SyncedTranscript } from "@/components/podcast/SyncedTranscript";
import { TranscriptFlashcardGenerator } from "@/components/podcast/TranscriptFlashcardGenerator";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

interface PodcastTranscriptSectionProps {
  transcript: string | null;
  podcastTitle: string;
  currentTime: number;
  duration: number;
  showTranscript: boolean;
  onToggleTranscript: () => void;
  onSeekAndPlay: (time: number) => void;
}

export const PodcastTranscriptSection = ({
  transcript,
  podcastTitle,
  currentTime,
  duration,
  showTranscript,
  onToggleTranscript,
  onSeekAndPlay,
}: PodcastTranscriptSectionProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Transcript
        </h3>
        <div className="flex items-center gap-2">
          {transcript && (
            <TranscriptFlashcardGenerator
              transcript={transcript}
              podcastTitle={podcastTitle}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTranscript}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {showTranscript ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Mở rộng
              </>
            )}
          </Button>
        </div>
      </div>

      {showTranscript && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
          <SyncedTranscript
            transcript={transcript}
            currentTime={currentTime}
            onSeek={onSeekAndPlay}
            duration={duration}
          />
        </div>
      )}
    </div>
  );
};

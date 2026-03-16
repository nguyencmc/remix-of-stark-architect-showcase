import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Headphones } from "lucide-react";
import {
  usePodcastDetail,
  sampleAudioUrl,
  PodcastHeroInfo,
  PodcastAudioPlayer,
  PodcastTranscriptSection,
  PodcastBookmarksSection,
  RelatedPodcasts,
} from "@/features/podcastDetail";

const PodcastDetail = () => {
  const {
    podcast, isLoading, category, relatedPodcasts, user, bookmarks,
    audioRef, isPlaying, currentTime, duration, volume, isMuted, isRepeat, playbackRate,
    showTranscript, setShowTranscript, showBookmarks, setShowBookmarks,
    pointA, pointB, abRepeatActive,
    togglePlay, handleSeek, handleVolumeChange, skipForward, skipBackward,
    toggleRepeat, toggleMute, setPlaybackRate,
    handleSetPointA, handleSetPointB, clearABRepeat,
    handleSendToMiniPlayer, addBookmark, removeBookmark, seekTo, seekAndPlay,
  } = usePodcastDetail();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
<main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
</div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
<main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Headphones className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy podcast</h2>
            <Link to="/podcasts">
              <Button>Quay lại danh sách</Button>
            </Link>
          </div>
        </main>
</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
<main className="flex-1">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white">
          <div className="container mx-auto px-4 py-8">
            <Link to="/podcasts" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PodcastHeroInfo
                  podcast={podcast}
                  category={category}
                  onSendToMiniPlayer={handleSendToMiniPlayer}
                />

                <PodcastAudioPlayer
                  audioRef={audioRef}
                  audioSrc={podcast.audio_url || sampleAudioUrl}
                  currentTime={currentTime}
                  duration={duration}
                  isPlaying={isPlaying}
                  volume={volume}
                  isMuted={isMuted}
                  isRepeat={isRepeat}
                  playbackRate={playbackRate}
                  pointA={pointA}
                  pointB={pointB}
                  abRepeatActive={abRepeatActive}
                  onTogglePlay={togglePlay}
                  onSeek={handleSeek}
                  onVolumeChange={handleVolumeChange}
                  onSkipForward={skipForward}
                  onSkipBackward={skipBackward}
                  onToggleRepeat={toggleRepeat}
                  onToggleMute={toggleMute}
                  onSetPlaybackRate={setPlaybackRate}
                  onSetPointA={handleSetPointA}
                  onSetPointB={handleSetPointB}
                  onClearABRepeat={clearABRepeat}
                  onAddBookmark={() => addBookmark(currentTime)}
                />

                {user && bookmarks.length > 0 && (
                  <PodcastBookmarksSection
                    bookmarks={bookmarks}
                    currentTime={currentTime}
                    showBookmarks={showBookmarks}
                    onToggleBookmarks={setShowBookmarks}
                    onSeek={seekTo}
                    onRemoveBookmark={removeBookmark}
                    onAddBookmark={() => addBookmark(currentTime)}
                  />
                )}

                <PodcastTranscriptSection
                  transcript={podcast.transcript}
                  podcastTitle={podcast.title}
                  currentTime={currentTime}
                  duration={duration}
                  showTranscript={showTranscript}
                  onToggleTranscript={() => setShowTranscript(!showTranscript)}
                  onSeekAndPlay={seekAndPlay}
                />
              </div>

              <RelatedPodcasts podcasts={relatedPodcasts} />
            </div>
          </div>
        </div>
      </main>
</div>
  );
};

export default PodcastDetail;

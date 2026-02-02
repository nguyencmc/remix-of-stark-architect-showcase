import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { Play } from "lucide-react";

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  courseTitle: string;
}

export const VideoPreviewModal = ({
  isOpen,
  onClose,
  videoUrl,
  thumbnailUrl,
  courseTitle,
}: VideoPreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-black">
        <DialogHeader className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <DialogTitle className="text-white pr-8">
            Xem trước: {courseTitle}
          </DialogTitle>
        </DialogHeader>

        <div id="video-preview-container" className="pt-12">
          {videoUrl ? (
            <VideoPlayer
              src={videoUrl}
              poster={thumbnailUrl}
              autoPlay={isOpen}
            />
          ) : (
            /* No Video Available */
            <div className="aspect-video relative flex flex-col items-center justify-center text-white bg-black">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={courseTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              ) : null}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <Play className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Video xem trước chưa có sẵn</p>
                <p className="text-sm text-gray-400 mt-2">
                  Vui lòng đăng ký khóa học để xem nội dung
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

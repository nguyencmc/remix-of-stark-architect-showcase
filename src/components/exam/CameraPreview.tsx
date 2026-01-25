import { useEffect, useRef } from 'react';
import { Camera, CameraOff, AlertTriangle, Shield, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CameraPreviewProps {
  cameraEnabled: boolean;
  cameraStream: MediaStream | null;
  violationCount: number;
  isProcessing: boolean;
  onToggleCamera: () => void;
  className?: string;
  compact?: boolean;
}

export function CameraPreview({
  cameraEnabled,
  cameraStream,
  violationCount,
  isProcessing,
  onToggleCamera,
  className,
  compact = false,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  if (compact) {
    return (
      <div className={cn("relative", className)}>
        {cameraEnabled ? (
          <div className="relative w-16 h-12 rounded-lg overflow-hidden border-2 border-primary bg-background">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute bottom-0.5 right-0.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCamera}
            disabled={isProcessing}
            className="h-12 gap-2"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Bật camera</span>
          </Button>
        )}
        
        {violationCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {violationCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Giám sát thi</span>
        </div>
        {cameraEnabled && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">REC</span>
          </div>
        )}
      </div>

      {/* Video Preview */}
      <div className="relative aspect-[4/3] bg-background">
        {cameraEnabled && cameraStream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute inset-0 border-4 border-transparent pointer-events-none">
              {/* Face detection overlay placeholder */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-2 border-dashed border-primary/50 rounded-full" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <CameraOff className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm">Camera chưa được bật</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 space-y-3">
        <Button
          onClick={onToggleCamera}
          disabled={isProcessing}
          variant={cameraEnabled ? "destructive" : "default"}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : cameraEnabled ? (
            <>
              <CameraOff className="w-4 h-4 mr-2" />
              Tắt camera
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Bật camera giám sát
            </>
          )}
        </Button>

        {/* Violation counter */}
        {violationCount > 0 && (
          <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">
              {violationCount} vi phạm được ghi nhận
            </span>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          Camera sẽ chụp ảnh định kỳ để xác minh danh tính
        </p>
      </div>
    </div>
  );
}

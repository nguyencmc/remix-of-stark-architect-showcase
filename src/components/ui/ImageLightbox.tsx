import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// ── ImageLightbox ─────────────────────────────────────────────────────────────
interface ImageLightboxProps {
  src: string;
  onClose: () => void;
}

export function ImageLightbox({ src, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Đóng"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt="Phóng to"
        className="max-w-[95vw] max-h-[90vh] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ── useClickableImages hook ───────────────────────────────────────────────────
/**
 * Gắn click handler lên tất cả <img> bên trong containerRef.
 * Dùng MutationObserver để tự động cập nhật khi DOM thay đổi (HtmlContent render muộn).
 */
export function useClickableImages(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onOpen: (src: string) => void,
) {
  // Giữ onOpen ổn định, không tạo lại handler mỗi render
  const onOpenRef = useRef(onOpen);
  useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const attachListeners = () => {
      container.querySelectorAll('img').forEach((img) => {
        // Tránh gắn trùng listener
        if ((img as HTMLImageElement & { _lbAttached?: boolean })._lbAttached) return;
        (img as HTMLImageElement & { _lbAttached?: boolean })._lbAttached = true;
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          const src = (e.currentTarget as HTMLImageElement).src;
          if (src) onOpenRef.current(src);
        });
      });
    };

    // Gắn ngay lập tức cho ảnh đã có
    attachListeners();

    // Theo dõi DOM thay đổi (HtmlContent inject ảnh sau khi mount)
    const observer = new MutationObserver(attachListeners);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef]);
}

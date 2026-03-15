// GIF và WEBP động không resize qua Canvas (sẽ mất animation)
const PASSTHROUGH_TYPES = ["image/gif", "image/webp", "image/svg+xml"];

export const resizeImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string; originalSize: number }> =>
  new Promise((resolve, reject) => {
    const originalSize = file.size;

    // GIF/WEBP/SVG: trả thẳng blob gốc, không resize
    if (PASSTHROUGH_TYPES.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) =>
        resolve({ blob: file, dataUrl: e.target!.result as string, originalSize });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas toBlob failed"));
          const reader = new FileReader();
          reader.onload = (e) =>
            resolve({ blob, dataUrl: e.target!.result as string, originalSize });
          reader.readAsDataURL(blob);
        },
        file.type === "image/png" ? "image/png" : "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = objectUrl;
  });

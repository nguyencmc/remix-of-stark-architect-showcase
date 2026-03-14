import { useRef, useCallback, useState, useEffect } from "react";
import { resizeImageFile } from "./imageResize";
import { logger } from "@/lib/logger";

const log = logger("RichTextEditor");

interface UseRichTextEditorOptions {
  content?: string;
  value?: string;
  onChange?: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export function useRichTextEditor({
  content,
  value,
  onChange,
  onImageUpload,
}: UseRichTextEditorOptions) {
  const editorRef = useRef<HTMLDivElement>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [uploadDimensions, setUploadDimensions] = useState<{ w: number; h: number } | null>(null);
  const [uploadOriginalSize, setUploadOriginalSize] = useState<number | null>(null);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);
  // Track whether the last change came from user typing (not external prop update)
  const isInternalChange = useRef(false);
  // ── Lưu selection trước khi Popover mở (focus sẽ bị mất khi click toolbar) ──
  const savedRangeRef = useRef<Range | null>(null);

  const htmlValue = content ?? value ?? "";

  // ── Inject resize handles on every <img> inside the editor ─────────────
  const injectImageResizeHandles = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
      if (img.dataset.resizeInjected) return;
      img.dataset.resizeInjected = "true";

      const parent = img.parentNode;
      if (!parent) return;

      // Skip if already inside our wrapper
      if ((parent as HTMLElement).classList?.contains("rte-img-wrap")) return;

      const wrap = document.createElement("span");
      wrap.className = "rte-img-wrap";
      wrap.contentEditable = "false";
      wrap.setAttribute("data-rte-wrap", "true");
      parent.insertBefore(wrap, img);
      wrap.appendChild(img);

      const handle = document.createElement("span");
      handle.className = "rte-img-handle";
      handle.contentEditable = "false";
      handle.title = "Kéo để thay đổi kích thước";
      wrap.appendChild(handle);

      // Shared helpers for mouse & touch resize
      const applyResize = (startX: number, clientX: number, startW: number, aspectRatio: number) => {
        const dx = clientX - startX;
        const newW = Math.max(40, startW + dx);
        const newH = Math.round(newW * aspectRatio);
        img.style.width  = newW + "px";
        img.style.height = newH + "px";
        img.width  = newW;
        img.height = newH;
      };

      const emitResizeChange = () => {
        if (editorRef.current && onChange) {
          isInternalChange.current = true;
          const c = editorRef.current.cloneNode(true) as HTMLElement;
          c.querySelectorAll(".rte-copy-btn").forEach(b => b.remove());
          c.querySelectorAll("pre").forEach(p => (p as HTMLElement).style.removeProperty("position"));
          c.querySelectorAll<HTMLElement>(".rte-img-wrap").forEach(w => { const i = w.querySelector("img"); if (i) w.replaceWith(i); else w.remove(); });
          onChange(c.innerHTML);
        }
      };

      // ── Mouse drag ──
      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startW = img.offsetWidth  || img.naturalWidth  || 200;
        const startH = img.offsetHeight || img.naturalHeight || 150;
        const aspectRatio = startH / startW;

        const onMove = (ev: MouseEvent) => applyResize(startX, ev.clientX, startW, aspectRatio);
        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          emitResizeChange();
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      // ── Touch drag ──
      handle.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startW = img.offsetWidth  || img.naturalWidth  || 200;
        const startH = img.offsetHeight || img.naturalHeight || 150;
        const aspectRatio = startH / startW;

        const onMove = (ev: TouchEvent) => applyResize(startX, ev.touches[0].clientX, startW, aspectRatio);
        const onEnd = () => {
          document.removeEventListener("touchmove", onMove);
          document.removeEventListener("touchend", onEnd);
          emitResizeChange();
        };

        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onEnd);
      }, { passive: false });
    });
  }, [onChange]);

  // ── Inject copy buttons into every <pre> block inside the editor ──────────
  const injectCopyButtons = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".rte-copy-btn")) return; // already injected
      pre.style.position = "relative";
      const btn = document.createElement("button");
      btn.className = "rte-copy-btn";
      btn.type = "button";
      btn.title = "Copy code";
      btn.setAttribute("contenteditable", "false");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const clone = pre.cloneNode(true) as HTMLElement;
        clone.querySelectorAll(".rte-copy-btn").forEach(b => b.remove());
        const code = clone.querySelector("code")?.innerText ?? clone.innerText;
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          btn.classList.add("rte-copy-btn--copied");
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
            btn.classList.remove("rte-copy-btn--copied");
          }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }, []);

  // ── Get clean HTML without injected UI (copy buttons, resize wrappers) ────
  const getCleanHtml = useCallback((): string => {
    const editor = editorRef.current;
    if (!editor) return "";
    const clone = editor.cloneNode(true) as HTMLElement;

    clone.querySelectorAll(".rte-copy-btn").forEach(btn => btn.remove());
    clone.querySelectorAll("pre").forEach(pre => {
      (pre as HTMLElement).style.removeProperty("position");
    });

    clone.querySelectorAll<HTMLElement>(".rte-img-wrap").forEach((wrap) => {
      const img = wrap.querySelector("img");
      if (img) {
        wrap.replaceWith(img);
      } else {
        wrap.remove();
      }
    });

    return clone.innerHTML;
  }, []);

  // ── Fix: only update DOM when value changes externally (not from typing) ──
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editor.innerHTML !== htmlValue) {
      editor.innerHTML = htmlValue;
    }
    injectCopyButtons();
    injectImageResizeHandles();
  }, [htmlValue, injectCopyButtons, injectImageResizeHandles]);

  const execCommand = useCallback((command: string, cmdValue?: string) => {
    document.execCommand(command, false, cmdValue);
    editorRef.current?.focus();
    if (editorRef.current && onChange) {
      isInternalChange.current = true;
      onChange(getCleanHtml());
    }
    injectCopyButtons();
    injectImageResizeHandles();
  }, [onChange, injectCopyButtons, injectImageResizeHandles, getCleanHtml]);

  // ── Save / restore cursor selection (mất khi click Popover) ──────────────
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const editor = editorRef.current;
    const range = savedRangeRef.current;
    if (!editor || !range) {
      editor?.focus();
      return;
    }
    editor.focus();
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, []);

  const execCommandWithRestore = useCallback((command: string, cmdValue?: string) => {
    restoreSelection();
    document.execCommand(command, false, cmdValue);
    if (editorRef.current && onChange) {
      isInternalChange.current = true;
      onChange(getCleanHtml());
    }
    injectCopyButtons();
    injectImageResizeHandles();
  }, [restoreSelection, onChange, getCleanHtml, injectCopyButtons, injectImageResizeHandles]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current && onChange) {
      isInternalChange.current = true;
      onChange(getCleanHtml());
    }
    injectCopyButtons();
    injectImageResizeHandles();
  }, [onChange, injectCopyButtons, injectImageResizeHandles, getCleanHtml]);

  const formatBlock = useCallback((tag: string) => {
    execCommand("formatBlock", tag === "p" ? "p" : tag);
  }, [execCommand]);

  const insertLink = useCallback(() => {
    if (linkUrl) {
      execCommand("createLink", linkUrl);
      setLinkUrl("");
    }
  }, [linkUrl, execCommand]);

  const insertImage = useCallback(() => {
    if (imageUrl) {
      execCommandWithRestore("insertImage", imageUrl);
      setImageUrl("");
      setImagePopoverOpen(false);
    }
  }, [imageUrl, execCommandWithRestore]);

  // Handle file picked — resize then preview
  const handleUploadFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;
    try {
      const { blob, dataUrl, originalSize } = await resizeImageFile(file);
      const resized = new File([blob], file.name, { type: blob.type });
      setUploadFile(resized);
      setUploadPreview(dataUrl);
      setUploadOriginalSize(originalSize);
      const img = new window.Image();
      img.onload = () => setUploadDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = dataUrl;
    } catch {
      setUploadFile(file);
      setUploadOriginalSize(file.size);
      setUploadDimensions(null);
      const reader = new FileReader();
      reader.onload = (e) => setUploadPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUploadFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUploadFileSelect(file);
    },
    [handleUploadFileSelect]
  );

  const handleUploadDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setUploadDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleUploadFileSelect(file);
    },
    [handleUploadFileSelect]
  );

  // Upload to server (or embed base64 if no handler) then insert into editor
  const insertUploadedImage = useCallback(async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      let url: string;
      if (onImageUpload) {
        url = await onImageUpload(uploadFile);
      } else {
        url = uploadPreview!;
      }
      execCommandWithRestore("insertImage", url);
      if (onImageUpload) setLibraryRefreshKey((k) => k + 1);
      setUploadFile(null);
      setUploadPreview(null);
      setImagePopoverOpen(false);
    } catch (error: unknown) {
      log.error('Upload failed', error);
    } finally {
      setIsUploading(false);
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    }
  }, [uploadFile, uploadPreview, onImageUpload, execCommandWithRestore]);

  const clearUploadPreview = useCallback(() => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadDimensions(null);
    setUploadOriginalSize(null);
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
  }, []);

  // ── Insert image chosen from library ─────────────────────────────────────
  const insertLibraryImage = useCallback((url: string) => {
    execCommandWithRestore("insertImage", url);
    setImagePopoverOpen(false);
  }, [execCommandWithRestore]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleContentChange();
    },
    [handleContentChange]
  );

  // ── Handle keyboard shortcuts inside editor ────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const anchorNode = sel.anchorNode;
      const preEl = (anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement)?.closest("pre");

      if (preEl && e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertText", false, "  ");
        handleContentChange();
        return;
      }

      if (preEl) {
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          const editor = editorRef.current!;

          const p = document.createElement("p");
          p.innerHTML = "<br>";
          preEl.insertAdjacentElement("afterend", p);

          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          editor.focus();
          handleContentChange();
          return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
          const range = sel.getRangeAt(0);
          if (!range.collapsed) return;

          const clonePre = preEl.cloneNode(true) as HTMLElement;
          clonePre.querySelectorAll(".rte-copy-btn").forEach(b => b.remove());
          const preText = clonePre.innerText;

          if (preText.endsWith("\n\n") || preText.endsWith("\n\n ")) {
            e.preventDefault();
            const editor = editorRef.current!;

            document.execCommand("delete");

            const p = document.createElement("p");
            p.innerHTML = "<br>";
            preEl.insertAdjacentElement("afterend", p);

            const newRange = document.createRange();
            newRange.setStart(p, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            editor.focus();
            handleContentChange();
          }
        }
      }
    },
    [handleContentChange]
  );

  const handleImagePopoverOpenChange = useCallback((open: boolean) => {
    setImagePopoverOpen(open);
    if (!open) {
      setUploadFile(null);
      setUploadPreview(null);
      setImageUrl("");
    }
  }, []);

  return {
    editorRef,
    uploadFileInputRef,
    execCommand,
    formatBlock,
    saveSelection,
    handleContentChange,
    handleKeyDown,
    handlePaste,
    // Link
    linkUrl,
    setLinkUrl,
    insertLink,
    // Image popover
    imagePopoverOpen,
    handleImagePopoverOpenChange,
    imageUrl,
    setImageUrl,
    insertImage,
    // Upload
    uploadPreview,
    uploadFile,
    clearUploadPreview,
    insertUploadedImage,
    isUploading,
    uploadDragOver,
    setUploadDragOver,
    handleUploadDrop,
    handleUploadFileInputChange,
    uploadDimensions,
    uploadOriginalSize,
    // Library
    insertLibraryImage,
    libraryRefreshKey,
  };
}

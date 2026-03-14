import React from "react";

export interface RichTextEditorProps {
  content?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  onImageUpload?: (file: File) => Promise<string>;
  /** Supabase Storage bucket name để hiển thị thư viện ảnh đã upload.
   *  Ví dụ: "question-images" | "public-assets"
   *  Nếu không truyền, tab Thư viện sẽ bị ẩn. */
  imageBucket?: string;
  /** Prefix (thư mục con) trong bucket cần list, mặc định "" (root) */
  imageBucketPrefix?: string;
}

export interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

export interface ImagePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saveSelection: () => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  insertImage: () => void;
  uploadFileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadPreview: string | null;
  uploadFile: File | null;
  clearUploadPreview: () => void;
  insertUploadedImage: () => Promise<void>;
  isUploading: boolean;
  uploadDragOver: boolean;
  setUploadDragOver: (v: boolean) => void;
  handleUploadDrop: (e: React.DragEvent) => void;
  handleUploadFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadDimensions: { w: number; h: number } | null;
  uploadOriginalSize: number | null;
  onImageUpload?: (file: File) => Promise<string>;
  imageBucket?: string;
  imageBucketPrefix: string;
  insertLibraryImage: (url: string) => void;
  libraryRefreshKey: number;
}

export interface LinkPopoverProps {
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  insertLink: () => void;
}

export interface EditorToolbarProps {
  execCommand: (command: string, value?: string) => void;
  formatBlock: (tag: string) => void;
  link: LinkPopoverProps;
  image: ImagePopoverProps;
}

export interface EditorContentProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  minHeight: string;
  placeholder: string;
  onInput: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}

export const FONT_SIZES = [
  { value: "1", label: "10px" },
  { value: "2", label: "13px" },
  { value: "3", label: "16px" },
  { value: "4", label: "18px" },
  { value: "5", label: "24px" },
  { value: "6", label: "32px" },
  { value: "7", label: "48px" },
];

export const HEADING_OPTIONS = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

export const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

export const HIGHLIGHT_COLORS = [
  "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff0000", "#0000ff", "#ff9900", "#9900ff",
];

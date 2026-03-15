import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRichTextEditor } from "./richtext/useRichTextEditor";
import { EditorToolbar } from "./richtext/EditorToolbar";
import { EditorContent } from "./richtext/EditorContent";
import { EditorStyles } from "./richtext/EditorStyles";
import type { RichTextEditorProps } from "./richtext/types";

export type { RichTextEditorProps };

export const RichTextEditor = ({
  content,
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
  minHeight = "300px",
  onImageUpload,
  imageBucket,
  imageBucketPrefix = "",
}: RichTextEditorProps) => {
  const editor = useRichTextEditor({ content, value, onChange, onImageUpload });

  return (
    <TooltipProvider>
      <div className={cn("border rounded-lg overflow-hidden bg-background", className)}>
        {/* Hidden file input for image upload */}
        <input
          type="file"
          ref={editor.uploadFileInputRef}
          className="hidden"
          accept="image/*"
          onChange={editor.handleUploadFileInputChange}
        />

        <EditorToolbar
          execCommand={editor.execCommand}
          formatBlock={editor.formatBlock}
          link={{
            linkUrl: editor.linkUrl,
            setLinkUrl: editor.setLinkUrl,
            insertLink: editor.insertLink,
          }}
          image={{
            open: editor.imagePopoverOpen,
            onOpenChange: editor.handleImagePopoverOpenChange,
            saveSelection: editor.saveSelection,
            imageUrl: editor.imageUrl,
            setImageUrl: editor.setImageUrl,
            insertImage: editor.insertImage,
            uploadFileInputRef: editor.uploadFileInputRef,
            uploadPreview: editor.uploadPreview,
            uploadFile: editor.uploadFile,
            clearUploadPreview: editor.clearUploadPreview,
            insertUploadedImage: editor.insertUploadedImage,
            isUploading: editor.isUploading,
            uploadDragOver: editor.uploadDragOver,
            setUploadDragOver: editor.setUploadDragOver,
            handleUploadDrop: editor.handleUploadDrop,
            handleUploadFileInputChange: editor.handleUploadFileInputChange,
            uploadDimensions: editor.uploadDimensions,
            uploadOriginalSize: editor.uploadOriginalSize,
            onImageUpload,
            imageBucket,
            imageBucketPrefix,
            insertLibraryImage: editor.insertLibraryImage,
            libraryRefreshKey: editor.libraryRefreshKey,
          }}
        />

        <EditorContent
          editorRef={editor.editorRef}
          minHeight={minHeight}
          placeholder={placeholder}
          onInput={editor.handleContentChange}
          onKeyDown={editor.handleKeyDown}
          onPaste={editor.handlePaste}
        />

        <EditorStyles />
      </div>
    </TooltipProvider>
  );
};

export default RichTextEditor;

import React from "react";
import { cn } from "@/lib/utils";
import type { EditorContentProps } from "./types";

export const EditorContent: React.FC<EditorContentProps> = ({
  editorRef,
  minHeight,
  placeholder,
  onInput,
  onKeyDown,
  onPaste,
}) => (
  <div
    ref={editorRef}
    contentEditable
    className={cn(
      "p-4 outline-none overflow-auto prose prose-sm max-w-none dark:prose-invert",
      "focus:ring-0 focus:outline-none",
      "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic",
      "[&_pre]:bg-[#1e1e2e] [&_pre]:text-[#cdd6f4] [&_pre]:p-4 [&_pre]:pt-8 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:relative",
      "[&_code]:bg-transparent [&_code]:text-inherit [&_code]:p-0",
      "[&_a]:text-primary [&_a]:underline",
      "[&_img]:max-w-full [&_img]:rounded-md",
      "[&_.rte-img-wrap]:inline-block [&_.rte-img-wrap]:relative [&_.rte-img-wrap]:leading-none [&_.rte-img-wrap_img]:!h-auto [&_.rte-img-wrap_img]:block"
    )}
    style={{ minHeight }}
    onInput={onInput}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
    data-placeholder={placeholder}
    suppressContentEditableWarning
  />
);

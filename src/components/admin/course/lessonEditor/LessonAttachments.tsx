import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { File, X, Upload, Loader2 } from 'lucide-react';
import type { LessonAttachment } from './types';

interface LessonAttachmentsProps {
  attachments?: LessonAttachment[];
  uploading: boolean;
  docInputRef: React.RefObject<HTMLInputElement | null>;
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export const LessonAttachments = ({
  attachments,
  uploading,
  docInputRef,
  onDocumentUpload,
  onRemoveAttachment,
}: LessonAttachmentsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Tài liệu đính kèm</Label>
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
          multiple
          onChange={onDocumentUpload}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => docInputRef.current?.click()}
          disabled={uploading}
          className="gap-1"
        >
          {uploading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          Tải lên
        </Button>
      </div>
      
      {(attachments?.length ?? 0) > 0 && (
        <div className="space-y-2">
          {attachments?.map((attachment, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-background p-2 rounded border"
            >
              <File className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                onClick={() => onRemoveAttachment(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

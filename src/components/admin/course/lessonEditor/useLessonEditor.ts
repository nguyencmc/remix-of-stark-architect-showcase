import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/useToast';
import type { CourseLesson, LessonAttachment } from './types';

const log = logger('LessonEditor');

export function useLessonEditor(
  lesson: CourseLesson,
  onUpdate: (data: Partial<CourseLesson>) => void,
) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [_uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File video không được vượt quá 500MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const date = new Date();
      const filePath = `videos/${date.getFullYear()}/${date.getMonth() + 1}/${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('course-materials')
        .getPublicUrl(data.path);

      onUpdate({ video_url: urlData.publicUrl });
      
      toast({
        title: "Thành công",
        description: "Đã tải lên video",
      });
    } catch (error: unknown) {
      log.error('Upload error', error);
      toast({
        title: "Lỗi",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newAttachments: LessonAttachment[] = [...(lesson.attachments || [])];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 100MB per file)
        if (file.size > 100 * 1024 * 1024) {
          toast({
            title: "Cảnh báo",
            description: `File ${file.name} vượt quá 100MB và bị bỏ qua`,
            variant: "destructive",
          });
          continue;
        }

        const date = new Date();
        const filePath = `documents/${date.getFullYear()}/${date.getMonth() + 1}/${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
          .from('course-materials')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('course-materials')
          .getPublicUrl(data.path);

        newAttachments.push({
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          display_order: newAttachments.length,
        });
      }

      onUpdate({ attachments: newAttachments });
      
      toast({
        title: "Thành công",
        description: `Đã tải lên ${files.length} tài liệu`,
      });
    } catch (error: unknown) {
      log.error('Upload error', error);
      toast({
        title: "Lỗi",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (docInputRef.current) {
        docInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = (lesson.attachments || []).filter((_, i) => i !== index);
    onUpdate({ attachments: newAttachments });
  };

  return {
    isOpen,
    setIsOpen,
    uploading,
    videoInputRef,
    docInputRef,
    handleVideoUpload,
    handleDocumentUpload,
    removeAttachment,
  };
}

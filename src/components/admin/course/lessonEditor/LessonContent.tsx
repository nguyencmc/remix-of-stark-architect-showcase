import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollapsibleContent } from "@/components/ui/collapsible";
import {
  Eye,
  Upload,
  Video,
  FileText,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import type { CourseLesson } from './types';
import { LessonAttachments } from './LessonAttachments';

interface LessonContentProps {
  lesson: CourseLesson;
  uploading: boolean;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  docInputRef: React.RefObject<HTMLInputElement | null>;
  onUpdate: (data: Partial<CourseLesson>) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}

export const LessonContent = ({
  lesson,
  uploading,
  videoInputRef,
  docInputRef,
  onUpdate,
  onVideoUpload,
  onDocumentUpload,
  onRemoveAttachment,
}: LessonContentProps) => {
  return (
    <CollapsibleContent className="space-y-4 pt-2">
      {/* Title */}
      <div className="space-y-2">
        <Label>Tên bài học</Label>
        <Input
          value={lesson.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Tên bài học"
        />
      </div>

      {/* Content Type & Preview */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Loại nội dung</Label>
          <Select 
            value={lesson.content_type || 'video'}
            onValueChange={(value: 'video' | 'document' | 'test') => onUpdate({ content_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </div>
              </SelectItem>
              <SelectItem value="document">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tài liệu
                </div>
              </SelectItem>
              <SelectItem value="test">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Bài test
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="space-y-2 flex-1">
            <Label>Thời lượng (phút)</Label>
            <Input
              type="number"
              value={lesson.duration_minutes}
              onChange={(e) => onUpdate({ duration_minutes: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              checked={lesson.is_preview}
              onCheckedChange={(checked) => onUpdate({ is_preview: checked })}
            />
            <Label className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Xem trước
            </Label>
          </div>
        </div>
      </div>

      {/* Video Upload (only for video type) */}
      {(lesson.content_type === 'video' || !lesson.content_type) && (
        <div className="space-y-2">
          <Label>Video bài học</Label>
          <div className="flex gap-2">
            <Input
              value={lesson.video_url}
              onChange={(e) => onUpdate({ video_url: e.target.value })}
              placeholder="URL video hoặc upload file"
              className="flex-1"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={onVideoUpload}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
          {lesson.video_url && (
            <p className="text-xs text-muted-foreground truncate">
              {lesson.video_url}
            </p>
          )}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Textarea
          value={lesson.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Mô tả ngắn về bài học..."
          rows={2}
        />
      </div>

      {/* Attachments */}
      <LessonAttachments
        attachments={lesson.attachments}
        uploading={uploading}
        docInputRef={docInputRef}
        onDocumentUpload={onDocumentUpload}
        onRemoveAttachment={onRemoveAttachment}
      />

      {/* Test info (only for test type) */}
      {lesson.content_type === 'test' && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">
            💡 Sau khi lưu khóa học, bạn có thể thêm câu hỏi cho bài test này trong phần quản lý bài test.
          </p>
        </div>
      )}
    </CollapsibleContent>
  );
};

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  GripVertical,
  Trash2,
  Video,
  FileText,
  ClipboardList,
  ChevronDown,
} from 'lucide-react';
import type { CourseLesson } from './types';

interface LessonHeaderProps {
  lesson: CourseLesson;
  lessonIndex: number;
  isOpen: boolean;
  onRemove: () => void;
}

function getContentTypeIcon(type: string) {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />;
    case 'document': return <FileText className="w-4 h-4" />;
    case 'test': return <ClipboardList className="w-4 h-4" />;
    default: return <Video className="w-4 h-4" />;
  }
}

function getContentTypeBadge(type: string) {
  switch (type) {
    case 'video': return <Badge variant="default" className="bg-blue-500">Video</Badge>;
    case 'document': return <Badge variant="default" className="bg-green-500">Tài liệu</Badge>;
    case 'test': return <Badge variant="default" className="bg-purple-500">Bài test</Badge>;
    default: return <Badge>Video</Badge>;
  }
}

export const LessonHeader = ({ lesson, lessonIndex, isOpen, onRemove }: LessonHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
      
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <div className="flex-1 flex items-center gap-2">
        {getContentTypeIcon(lesson.content_type || 'video')}
        <span className="font-medium truncate">{lesson.title || `Bài ${lessonIndex + 1}`}</span>
        {getContentTypeBadge(lesson.content_type || 'video')}
        {lesson.is_preview && <Badge variant="outline" className="text-xs">Xem trước</Badge>}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

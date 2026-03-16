import { Collapsible } from "@/components/ui/collapsible";
import type { LessonEditorProps } from './types';
import { useLessonEditor } from './useLessonEditor';
import { LessonHeader } from './LessonHeader';
import { LessonContent } from './LessonContent';

export const LessonEditor = ({ 
  lesson, 
  _sectionIndex, 
  lessonIndex, 
  onUpdate, 
  onRemove 
}: LessonEditorProps) => {
  const {
    isOpen,
    setIsOpen,
    uploading,
    videoInputRef,
    docInputRef,
    handleVideoUpload,
    handleDocumentUpload,
    removeAttachment,
  } = useLessonEditor(lesson, onUpdate);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-muted/50 rounded-lg p-3 space-y-3">
        <LessonHeader
          lesson={lesson}
          lessonIndex={lessonIndex}
          isOpen={isOpen}
          onRemove={onRemove}
        />

        <LessonContent
          lesson={lesson}
          uploading={uploading}
          videoInputRef={videoInputRef}
          docInputRef={docInputRef}
          onUpdate={onUpdate}
          onVideoUpload={handleVideoUpload}
          onDocumentUpload={handleDocumentUpload}
          onRemoveAttachment={removeAttachment}
        />
      </div>
    </Collapsible>
  );
};

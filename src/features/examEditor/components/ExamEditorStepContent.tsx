import { ExamEditorOnePage } from './ExamEditorOnePage';
import type { ExamEditorState, ExamEditorActions } from '../types';

type ExamEditorStepContentProps = Pick<
  ExamEditorState,
  | 'title'
  | 'slug'
  | 'description'
  | 'categoryId'
  | 'difficulty'
  | 'durationMinutes'
  | 'thumbnailUrl'
  | 'categories'
  | 'isEditing'
  | 'questions'
  | 'saving'
> &
  Pick<
    ExamEditorActions,
    | 'setTitle'
    | 'setSlug'
    | 'setDescription'
    | 'setCategoryId'
    | 'setDifficulty'
    | 'setDurationMinutes'
    | 'setQuestions'
    | 'handleThumbnailUpload'
    | 'handleThumbnailRemove'
    | 'handleImageUpload'
    | 'handleSave'
  >;

export function ExamEditorStepContent(props: ExamEditorStepContentProps) {
  return <ExamEditorOnePage {...props} />;
}

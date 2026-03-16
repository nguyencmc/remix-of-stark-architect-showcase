import { PracticeSetInfoStep } from '@/features/practice/components/PracticeSetInfoStep';
import { CreatePracticeQuestionsStep } from '@/components/admin/practice/CreatePracticeQuestionsStep';
import { PracticeReviewStep } from '@/features/practice/components/PracticeReviewStep';
import type { PracticeQuestion } from '@/components/admin/practice/PracticeQuestionEditor';
import type { ExamCategory } from '@/features/practice/hooks/usePracticeEditor';

interface PracticeEditorStepContentProps {
  currentStep: number;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  level: string;
  durationMinutes: number;
  tags: string[];
  isPublished: boolean;
  categories: ExamCategory[];
  isEditMode: boolean;
  questions: PracticeQuestion[];
  categoryName: string | undefined;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onTagsChange: (value: string[]) => void;
  onPublishedChange: (value: boolean) => void;
  onQuestionsChange: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>;
  onImageUpload: (file: File, questionIndex: number, field: string) => Promise<string>;
  onEditInfo: () => void;
  onEditQuestions: () => void;
  onUpdateQuestion: (index: number, field: string, value: string) => void;
}

export function PracticeEditorStepContent({
  currentStep,
  title,
  slug,
  description,
  categoryId,
  level,
  durationMinutes,
  tags,
  isPublished,
  categories,
  isEditMode,
  questions,
  categoryName,
  onTitleChange,
  onSlugChange,
  onDescriptionChange,
  onCategoryChange,
  onDifficultyChange,
  onDurationChange,
  onTagsChange,
  onPublishedChange,
  onQuestionsChange,
  onImageUpload,
  onEditInfo,
  onEditQuestions,
  onUpdateQuestion,
}: PracticeEditorStepContentProps) {
  return (
    <div className="mb-8">
      {currentStep === 1 && (
        <PracticeSetInfoStep
          title={title}
          slug={slug}
          description={description}
          categoryId={categoryId}
          difficulty={level}
          durationMinutes={durationMinutes}
          tags={tags}
          isPublished={isPublished}
          categories={categories}
          isEditing={isEditMode}
          onTitleChange={onTitleChange}
          onSlugChange={onSlugChange}
          onDescriptionChange={onDescriptionChange}
          onCategoryChange={onCategoryChange}
          onDifficultyChange={onDifficultyChange}
          onDurationChange={onDurationChange}
          onTagsChange={onTagsChange}
          onPublishedChange={onPublishedChange}
        />
      )}

      {currentStep === 2 && (
        <CreatePracticeQuestionsStep
          questions={questions}
          onQuestionsChange={onQuestionsChange}
          defaultDifficulty={level}
          onImageUpload={onImageUpload}
          imageBucket="question-images"
        />
      )}

      {currentStep === 3 && (
        <PracticeReviewStep
          title={title}
          description={description}
          categoryName={categoryName}
          difficulty={level}
          durationMinutes={durationMinutes}
          tags={tags}
          isPublished={isPublished}
          questions={questions}
          onEditInfo={onEditInfo}
          onEditQuestions={onEditQuestions}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}
    </div>
  );
}

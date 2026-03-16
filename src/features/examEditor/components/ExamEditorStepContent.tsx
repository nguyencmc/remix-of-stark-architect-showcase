import { ExamInfoStep } from '@/components/admin/exam/ExamInfoStep';
import { CreateQuestionsStep } from '@/components/admin/exam/CreateQuestionsStep';
import { ReviewStep } from '@/components/admin/exam/ReviewStep';
import type { ExamEditorState, ExamEditorActions } from '../types';

type ExamEditorStepContentProps = Pick<
  ExamEditorState,
  | 'currentStep'
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
    | 'setCurrentStep'
    | 'handleThumbnailUpload'
    | 'handleThumbnailRemove'
    | 'handleImageUpload'
    | 'getCategoryName'
  >;

export function ExamEditorStepContent(props: ExamEditorStepContentProps) {
  const {
    currentStep,
    title,
    slug,
    description,
    categoryId,
    difficulty,
    durationMinutes,
    thumbnailUrl,
    categories,
    isEditing,
    questions,
    setTitle,
    setSlug,
    setDescription,
    setCategoryId,
    setDifficulty,
    setDurationMinutes,
    setQuestions,
    setCurrentStep,
    handleThumbnailUpload,
    handleThumbnailRemove,
    handleImageUpload,
    getCategoryName,
  } = props;

  return (
    <div className="mb-8">
      {currentStep === 1 && (
        <ExamInfoStep
          title={title}
          slug={slug}
          description={description}
          categoryId={categoryId}
          difficulty={difficulty}
          durationMinutes={durationMinutes}
          thumbnailUrl={thumbnailUrl}
          categories={categories}
          isEditing={isEditing}
          onTitleChange={setTitle}
          onSlugChange={setSlug}
          onDescriptionChange={setDescription}
          onCategoryChange={setCategoryId}
          onDifficultyChange={setDifficulty}
          onDurationChange={setDurationMinutes}
          onThumbnailUpload={handleThumbnailUpload}
          onThumbnailRemove={handleThumbnailRemove}
        />
      )}

      {currentStep === 2 && (
        <CreateQuestionsStep
          questions={questions}
          onQuestionsChange={setQuestions}
          onImageUpload={handleImageUpload}
          imageBucket="question-images"
        />
      )}

      {currentStep === 3 && (
        <ReviewStep
          title={title}
          description={description}
          categoryName={getCategoryName()}
          difficulty={difficulty}
          durationMinutes={durationMinutes}
          thumbnailUrl={thumbnailUrl}
          questions={questions}
          onEditInfo={() => setCurrentStep(1)}
          onEditQuestions={() => setCurrentStep(2)}
          onUpdateQuestion={(index, field, value) => {
            setQuestions(prev => prev.map((q, i) =>
              i === index ? { ...q, [field]: value } : q
            ));
          }}
        />
      )}
    </div>
  );
}

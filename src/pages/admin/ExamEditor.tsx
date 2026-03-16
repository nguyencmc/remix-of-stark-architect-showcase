import { StepIndicator } from '@/components/admin/exam/StepIndicator';
import {
  useExamEditor,
  EXAM_STEPS,
  ExamEditorHeader,
  ExamEditorStepContent,
  ExamEditorNavigation,
} from '@/features/examEditor';

const ExamEditor = () => {
  const editor = useExamEditor();

  if (editor.roleLoading || editor.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!editor.hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ExamEditorHeader
          isEditing={editor.isEditing}
          title={editor.title}
        />

        <div className="mb-8 max-w-3xl mx-auto">
          <StepIndicator
            steps={EXAM_STEPS}
            currentStep={editor.currentStep}
            onStepClick={editor.handleStepClick}
          />
        </div>

        <ExamEditorStepContent
          currentStep={editor.currentStep}
          title={editor.title}
          slug={editor.slug}
          description={editor.description}
          categoryId={editor.categoryId}
          difficulty={editor.difficulty}
          durationMinutes={editor.durationMinutes}
          thumbnailUrl={editor.thumbnailUrl}
          categories={editor.categories}
          isEditing={editor.isEditing}
          questions={editor.questions}
          setTitle={editor.setTitle}
          setSlug={editor.setSlug}
          setDescription={editor.setDescription}
          setCategoryId={editor.setCategoryId}
          setDifficulty={editor.setDifficulty}
          setDurationMinutes={editor.setDurationMinutes}
          setQuestions={editor.setQuestions}
          setCurrentStep={editor.setCurrentStep}
          handleThumbnailUpload={editor.handleThumbnailUpload}
          handleThumbnailRemove={editor.handleThumbnailRemove}
          handleImageUpload={editor.handleImageUpload}
          getCategoryName={editor.getCategoryName}
        />

        <ExamEditorNavigation
          currentStep={editor.currentStep}
          saving={editor.saving}
          onNext={editor.handleNext}
          onBack={editor.handleBack}
          onSave={editor.handleSave}
        />
      </main>
    </div>
  );
};

export default ExamEditor;

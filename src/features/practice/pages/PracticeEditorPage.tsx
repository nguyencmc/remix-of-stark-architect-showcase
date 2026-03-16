import { StepIndicator } from '@/components/admin/exam/StepIndicator';
import { PracticeEditorHeader } from '@/features/practice/components/PracticeEditorHeader';
import { PracticeEditorStepContent } from '@/features/practice/components/PracticeEditorStepContent';
import { PracticeEditorNavigation } from '@/features/practice/components/PracticeEditorNavigation';
import { usePracticeEditor } from '@/features/practice/hooks/usePracticeEditor';

const STEPS = [
  { id: 1, title: 'Thông tin', description: 'Nhập thông tin bộ đề' },
  { id: 2, title: 'Tạo câu hỏi', description: 'Thêm câu hỏi vào bộ đề' },
  { id: 3, title: 'Xem lại', description: 'Kiểm tra và lưu' },
];

export default function PracticeEditorPage() {
  const editor = usePracticeEditor();

  if (editor.loading) {
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <PracticeEditorHeader
          isEditMode={editor.isEditMode}
          title={editor.title}
        />

        <div className="mb-8 max-w-3xl mx-auto">
          <StepIndicator
            steps={STEPS}
            currentStep={editor.currentStep}
            onStepClick={(step) => {
              if (step < editor.currentStep || (step === 2 && editor.title && editor.slug) || step === editor.currentStep) {
                editor.setCurrentStep(step);
              }
            }}
          />
        </div>

        <PracticeEditorStepContent
          currentStep={editor.currentStep}
          title={editor.title}
          slug={editor.slug}
          description={editor.description}
          categoryId={editor.categoryId}
          level={editor.level}
          durationMinutes={editor.durationMinutes}
          tags={editor.tags}
          isPublished={editor.isPublished}
          categories={editor.categories}
          isEditMode={editor.isEditMode}
          questions={editor.questions}
          categoryName={editor.getCategoryName()}
          onTitleChange={editor.handleTitleChange}
          onSlugChange={editor.setSlug}
          onDescriptionChange={editor.setDescription}
          onCategoryChange={editor.setCategoryId}
          onDifficultyChange={editor.setLevel}
          onDurationChange={editor.setDurationMinutes}
          onTagsChange={editor.setTags}
          onPublishedChange={editor.setIsPublished}
          onQuestionsChange={editor.setQuestions}
          onImageUpload={editor.handleImageUpload}
          onEditInfo={() => editor.setCurrentStep(1)}
          onEditQuestions={() => editor.setCurrentStep(2)}
          onUpdateQuestion={(index, field, value) => {
            editor.setQuestions(prev =>
              prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
            );
          }}
        />

        <PracticeEditorNavigation
          currentStep={editor.currentStep}
          saving={editor.saving}
          onBack={editor.handleBack}
          onNext={editor.handleNext}
          onSave={editor.handleSave}
        />
      </main>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
import { useExamEditor } from '@/features/examEditor';
import { ExamEditorOnePage } from '@/features/examEditor/components/ExamEditorOnePage';

const ExamEditor = () => {
  const editor = useExamEditor();

  if (editor.roleLoading || editor.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading exam editor...</p>
        </div>
      </div>
    );
  }

  if (!editor.hasAccess) {
    return null;
  }

  return (
    <ExamEditorOnePage
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
      saving={editor.saving}
      setTitle={editor.setTitle}
      setSlug={editor.setSlug}
      setDescription={editor.setDescription}
      setCategoryId={editor.setCategoryId}
      setDifficulty={editor.setDifficulty}
      setDurationMinutes={editor.setDurationMinutes}
      setQuestions={editor.setQuestions}
      handleThumbnailUpload={editor.handleThumbnailUpload}
      handleThumbnailRemove={editor.handleThumbnailRemove}
      handleImageUpload={editor.handleImageUpload}
      handleSave={editor.handleSave}
    />
  );
};

export default ExamEditor;

import { Loader2 } from 'lucide-react';
import { usePracticeEditor } from '@/features/practice/hooks/usePracticeEditor';
import { PracticeEditorOnePage } from '@/features/practice/components/PracticeEditorOnePage';

export default function PracticeEditorPage() {
  const editor = usePracticeEditor();

  if (editor.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading practice editor...</p>
        </div>
      </div>
    );
  }

  return (
    <PracticeEditorOnePage
      title={editor.title}
      slug={editor.slug}
      description={editor.description}
      level={editor.level}
      durationMinutes={editor.durationMinutes}
      tags={editor.tags}
      isPublished={editor.isPublished}
      categoryId={editor.categoryId}
      categories={editor.categories}
      questions={editor.questions}
      isEditMode={editor.isEditMode}
      saving={editor.saving}
      setTitle={editor.setTitle}
      setSlug={editor.setSlug}
      setDescription={editor.setDescription}
      setLevel={editor.setLevel}
      setDurationMinutes={editor.setDurationMinutes}
      setTags={editor.setTags}
      setIsPublished={editor.setIsPublished}
      setCategoryId={editor.setCategoryId}
      setQuestions={editor.setQuestions}
      handleTitleChange={editor.handleTitleChange}
      handleSave={editor.handleSave}
      handleImageUpload={editor.handleImageUpload}
    />
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Save } from 'lucide-react';
import { CreatePracticeQuestionsStep } from '@/components/admin/practice/CreatePracticeQuestionsStep';
import { useQuestionSetEditor, QuestionSetForm } from '@/features/questionSetEditor';

const QuestionSetEditor = () => {
  const editor = useQuestionSetEditor();

  if (editor.isLoading) {
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/question-sets">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                {editor.isEditMode ? 'Chỉnh sửa bộ đề' : 'Tạo bộ đề mới'}
              </h1>
            </div>
          </div>
          <Button onClick={editor.handleSave} disabled={editor.saving} className="gap-2">
            <Save className="w-4 h-4" />
            {editor.saving ? 'Đang lưu...' : 'Lưu bộ đề'}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Question Set Info */}
          <div className="lg:col-span-1 space-y-6">
            <QuestionSetForm
              title={editor.title}
              description={editor.description}
              level={editor.level}
              tags={editor.tags}
              tagInput={editor.tagInput}
              isPublished={editor.isPublished}
              categoryId={editor.categoryId}
              categories={editor.categories}
              onTitleChange={editor.setTitle}
              onDescriptionChange={editor.setDescription}
              onLevelChange={editor.setLevel}
              onTagInputChange={editor.setTagInput}
              onIsPublishedChange={editor.setIsPublished}
              onCategoryIdChange={editor.setCategoryId}
              onAddTag={editor.addTag}
              onRemoveTag={editor.removeTag}
            />
          </div>

          {/* Right: Questions Editor */}
          <div className="lg:col-span-2">
            <CreatePracticeQuestionsStep
              questions={editor.questions}
              onQuestionsChange={editor.setQuestions}
              defaultDifficulty={editor.level}
              onImageUpload={editor.handleImageUpload}
              imageBucket="question-images"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionSetEditor;

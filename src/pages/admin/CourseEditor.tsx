import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useCourseEditor } from '@/features/courseEditor/hooks';
import {
  CourseBasicInfo,
  CourseMedia,
  CourseWhatYouLearn,
  CourseRequirements,
  CourseCurriculum,
  CoursePricing,
  CourseStatus,
  CourseSummary,
} from '@/features/courseEditor/components';

const CourseEditor = () => {
  const {
    formData,
    categories,
    sections,
    loading,
    saving,
    roleLoading,
    isEditing,
    isAdmin,
    hasAccess,
    newRequirement,
    newWhatYouLearn,
    handleTitleChange,
    updateFormField,
    setNewRequirement,
    setNewWhatYouLearn,
    addSection,
    updateSection,
    removeSection,
    addLesson,
    updateLesson,
    removeLesson,
    addRequirement,
    removeRequirement,
    addWhatYouLearn,
    removeWhatYouLearn,
    handleSave,
  } = useCourseEditor();

  if (roleLoading || loading) {
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

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/courses">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {isEditing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Điền thông tin chi tiết về khóa học
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu khóa học'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <CourseBasicInfo
              formData={formData}
              categories={categories}
              onTitleChange={handleTitleChange}
              onFieldChange={updateFormField}
            />
            <CourseMedia formData={formData} onFieldChange={updateFormField} />
            <CourseWhatYouLearn
              items={formData.what_you_learn}
              newItem={newWhatYouLearn}
              onNewItemChange={setNewWhatYouLearn}
              onAdd={addWhatYouLearn}
              onRemove={removeWhatYouLearn}
            />
            <CourseRequirements
              items={formData.requirements}
              newItem={newRequirement}
              onNewItemChange={setNewRequirement}
              onAdd={addRequirement}
              onRemove={removeRequirement}
            />
            <CourseCurriculum
              sections={sections}
              onAddSection={addSection}
              onUpdateSection={updateSection}
              onRemoveSection={removeSection}
              onAddLesson={addLesson}
              onUpdateLesson={updateLesson}
              onRemoveLesson={removeLesson}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CoursePricing formData={formData} onFieldChange={updateFormField} />
            <CourseStatus formData={formData} isAdmin={isAdmin} onFieldChange={updateFormField} />
            <CourseSummary sections={sections} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseEditor;

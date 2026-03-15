import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';
import { logger } from '@/lib/logger';
import type { CourseCategory, CourseSection, CourseFormData, CourseLesson } from '@/features/courseEditor/types';
import { DEFAULT_FORM_DATA } from '@/features/courseEditor/types';

const log = logger('useCourseEditor');

export function useCourseEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isAdmin, hasPermission, canEditOwn: _canEditOwn, loading: roleLoading } = usePermissionsContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(DEFAULT_FORM_DATA);
  const [newRequirement, setNewRequirement] = useState('');
  const [newWhatYouLearn, setNewWhatYouLearn] = useState('');

  const canCreate = hasPermission('courses.create');
  const canEdit = hasPermission('courses.edit');
  const isEditing = !!id;
  const hasAccess = isEditing ? (canEdit || hasPermission('courses.edit_own')) : canCreate;

  useEffect(() => {
    if (!roleLoading && !hasAccess) {
      navigate('/');
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền thực hiện thao tác này",
        variant: "destructive",
      });
    }
  }, [hasAccess, roleLoading, navigate, toast]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const fetchCourse = useCallback(async () => {
    setLoading(true);

    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !course) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy khóa học",
        variant: "destructive",
      });
      navigate('/admin/courses');
      return;
    }

    if (!isAdmin && course.creator_id !== user?.id) {
      toast({
        title: "Không có quyền",
        description: "Bạn chỉ có thể chỉnh sửa khóa học của mình",
        variant: "destructive",
      });
      navigate('/admin/courses');
      return;
    }

    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      description: course.description || '',
      category_id: course.category_id || '',
      price: course.price || 0,
      original_price: course.original_price || 0,
      level: course.level || 'beginner',
      language: course.language || 'vi',
      image_url: course.image_url || '',
      preview_video_url: course.preview_video_url || '',
      requirements: course.requirements?.length ? course.requirements : [''],
      what_you_learn: course.what_you_learn?.length ? course.what_you_learn : [''],
      is_published: course.is_published || false,
      is_featured: course.is_featured || false,
    });

    const { data: sectionsData } = await supabase
      .from('course_sections')
      .select('*')
      .eq('course_id', id)
      .order('section_order');

    if (sectionsData) {
      const sectionsWithLessons = await Promise.all(
        sectionsData.map(async (section) => {
          const { data: lessons } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('section_id', section.id)
            .order('lesson_order');

          const lessonsWithAttachments = await Promise.all(
            (lessons || []).map(async (lesson) => {
              const { data: attachments } = await supabase
                .from('lesson_attachments')
                .select('*')
                .eq('lesson_id', lesson.id)
                .order('display_order');

              return {
                ...lesson,
                content_type: (lesson.content_type || 'video') as 'video' | 'document' | 'test',
                attachments: attachments || [],
              };
            })
          );

          return {
            ...section,
            lessons: lessonsWithAttachments,
          };
        })
      );
      setSections(sectionsWithLessons);
    }

    setLoading(false);
  }, [id, toast, navigate, isAdmin, user]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('course_categories')
      .select('id, name, slug')
      .order('display_order');
    setCategories(data || []);
  };

  useEffect(() => {
    if (hasAccess) {
      fetchCategories();
      if (isEditing) {
        fetchCourse();
      } else {
        setLoading(false);
      }
    }
  }, [hasAccess, isEditing, fetchCourse]);

  // --- Form field handlers ---

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const updateFormField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // --- Section handlers ---

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        title: `Phần ${prev.length + 1}`,
        description: '',
        section_order: prev.length,
        lessons: [],
      },
    ]);
  };

  const updateSection = (index: number, data: Partial<CourseSection>) => {
    setSections(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  };

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  // --- Lesson handlers ---

  const addLesson = (sectionIndex: number) => {
    setSections(prev => {
      const updated = [...prev];
      updated[sectionIndex].lessons.push({
        title: `Bài ${updated[sectionIndex].lessons.length + 1}`,
        description: '',
        video_url: '',
        duration_minutes: 0,
        lesson_order: updated[sectionIndex].lessons.length,
        is_preview: false,
        content_type: 'video',
      });
      return updated;
    });
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, data: Partial<CourseLesson>) => {
    setSections(prev => {
      const updated = [...prev];
      updated[sectionIndex].lessons[lessonIndex] = {
        ...updated[sectionIndex].lessons[lessonIndex],
        ...data,
      };
      return updated;
    });
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    setSections(prev => {
      const updated = [...prev];
      updated[sectionIndex].lessons = updated[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
      return updated;
    });
  };

  // --- List field handlers (requirements, what_you_learn) ---

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements.filter(r => r), newRequirement.trim()],
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addWhatYouLearn = () => {
    if (newWhatYouLearn.trim()) {
      setFormData(prev => ({
        ...prev,
        what_you_learn: [...prev.what_you_learn.filter(w => w), newWhatYouLearn.trim()],
      }));
      setNewWhatYouLearn('');
    }
  };

  const removeWhatYouLearn = (index: number) => {
    setFormData(prev => ({
      ...prev,
      what_you_learn: prev.what_you_learn.filter((_, i) => i !== index),
    }));
  };

  // --- Save ---

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên khóa học",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .single();

      const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);
      const totalDuration = sections.reduce((acc, section) =>
        acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + (lesson.duration_minutes || 0), 0), 0);

      const courseData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        category_id: formData.category_id || null,
        category: categories.find(c => c.id === formData.category_id)?.slug || 'general',
        price: formData.price,
        original_price: formData.original_price,
        level: formData.level,
        language: formData.language,
        image_url: formData.image_url,
        preview_video_url: formData.preview_video_url,
        requirements: formData.requirements.filter(r => r.trim()),
        what_you_learn: formData.what_you_learn.filter(w => w.trim()),
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        lesson_count: totalLessons,
        duration_hours: Math.round(totalDuration / 60),
        creator_id: user?.id,
        creator_name: profile?.full_name || user?.email?.split('@')[0] || 'Unknown',
        updated_at: new Date().toISOString(),
      };

      let courseId = id;

      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select()
          .single();

        if (error) throw error;
        courseId = data.id;
      }

      // Delete existing sections (lessons cascade)
      if (isEditing) {
        await supabase
          .from('course_sections')
          .delete()
          .eq('course_id', courseId);
      }

      // Insert sections and lessons
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const { data: newSection, error: sectionError } = await supabase
          .from('course_sections')
          .insert({
            course_id: courseId,
            title: section.title,
            description: section.description,
            section_order: i,
          })
          .select()
          .single();

        if (sectionError) throw sectionError;

        if (section.lessons.length > 0) {
          for (let j = 0; j < section.lessons.length; j++) {
            const lesson = section.lessons[j];
            const lessonData = {
              section_id: newSection.id,
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url,
              duration_minutes: lesson.duration_minutes,
              lesson_order: j,
              is_preview: lesson.is_preview,
              content_type: lesson.content_type || 'video',
            };

            const { data: newLesson, error: lessonError } = await supabase
              .from('course_lessons')
              .insert(lessonData)
              .select()
              .single();

            if (lessonError) throw lessonError;

            if (lesson.attachments && lesson.attachments.length > 0) {
              const attachmentsData = lesson.attachments.map((att, k) => ({
                lesson_id: newLesson.id,
                file_name: att.file_name,
                file_url: att.file_url,
                file_type: att.file_type,
                file_size: att.file_size,
                display_order: k,
              }));

              const { error: attachmentsError } = await supabase
                .from('lesson_attachments')
                .insert(attachmentsData);

              if (attachmentsError) throw attachmentsError;
            }
          }
        }
      }

      await createAuditLog(
        isEditing ? 'update' : 'create',
        'course',
        courseId,
        isEditing ? { title: formData.title, slug: formData.slug } : null,
        {
          title: formData.title,
          slug: formData.slug,
          is_published: formData.is_published,
          lesson_count: totalLessons,
          section_count: sections.length
        }
      );

      toast({
        title: "Thành công",
        description: isEditing ? "Đã cập nhật khóa học" : "Đã tạo khóa học mới",
      });

      navigate('/admin/courses');
    } catch (error: unknown) {
      log.error('Error saving course', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu khóa học",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    // State
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

    // Form actions
    handleTitleChange,
    updateFormField,
    setNewRequirement,
    setNewWhatYouLearn,

    // Section actions
    addSection,
    updateSection,
    removeSection,

    // Lesson actions
    addLesson,
    updateLesson,
    removeLesson,

    // List field actions
    addRequirement,
    removeRequirement,
    addWhatYouLearn,
    removeWhatYouLearn,

    // Save
    handleSave,
  };
}

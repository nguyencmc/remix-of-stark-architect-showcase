import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';
import { logger } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';
import type { PracticeQuestion } from '@/components/admin/practice/PracticeQuestionEditor';
import type { Category } from '../types';

const log = logger('QuestionSetEditor');

export function useQuestionSetEditor() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { hasPermission, loading: roleLoading } = usePermissionsContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // Question Set fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Questions
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

  const canCreate = hasPermission('question_sets.create');
  const canEdit = hasPermission('question_sets.edit');
  const hasAccess = isEditMode ? canEdit : canCreate;

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

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: setData, error: setError } = await supabase
      .from('question_sets')
      .select('*')
      .eq('id', id)
      .single();

    if (setError || !setData) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy bộ đề",
        variant: "destructive",
      });
      navigate('/admin/question-sets');
      return;
    }

    setTitle(setData.title);
    setDescription(setData.description || '');
    setLevel(setData.level || 'medium');
    setTags(setData.tags || []);
    setIsPublished(setData.is_published ?? true);
    setCategoryId(setData.category_id || null);

    const { data: questionsData, error: questionsError } = await supabase
      .from('practice_questions')
      .select('*')
      .eq('set_id', id)
      .order('question_order', { ascending: true });

    if (!questionsError && questionsData) {
      setQuestions(questionsData.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_image: q.question_image,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c || '',
        option_d: q.option_d || '',
        option_e: q.option_e || '',
        option_f: q.option_f || '',
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'medium',
        tags: q.tags || [],
        question_order: q.question_order || 0,
      })));
    }

    setLoading(false);
  }, [id, toast, navigate]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('exam_categories').select('id, name').order('name');
    setCategories(data || []);
  };

  useEffect(() => {
    if (hasAccess) {
      fetchCategories();
      if (isEditMode && id) {
        fetchData();
      }
    }
  }, [hasAccess, isEditMode, id, fetchData]);

  const handleImageUpload = async (file: File, _questionIndex: number, _field: string): Promise<string> => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const fileName = `${year}/${month}/${day}/${uniqueId}.${ext}`;

    const { data, error } = await supabase.storage
      .from('question-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from('question-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên bộ đề",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      let setId = id;

      if (isEditMode) {
        const { error } = await supabase
          .from('question_sets')
          .update({
            title,
            description: description || null,
            level,
            tags,
            is_published: isPublished,
            category_id: categoryId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('question_sets')
          .insert({
            title,
            description: description || null,
            level,
            tags,
            is_published: isPublished,
            category_id: categoryId,
            question_count: 0,
            creator_id: user?.id,
          })
          .select()
          .single();

        if (error) throw error;
        setId = data.id;
      }

      const activeQuestions = questions.filter(q => !q.isDeleted);
      const deletedQuestions = questions.filter(q => q.isDeleted && q.id);
      const newQuestions = activeQuestions.filter(q => q.isNew);
      const existingQuestions = activeQuestions.filter(q => !q.isNew && q.id);

      for (const q of deletedQuestions) {
        await supabase.from('practice_questions').delete().eq('id', q.id!);
      }

      for (const q of existingQuestions) {
        await supabase
          .from('practice_questions')
          .update({
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c || null,
            option_d: q.option_d || null,
            option_e: q.option_e || null,
            option_f: q.option_f || null,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            difficulty: q.difficulty,
            tags: q.tags,
            question_order: q.question_order,
          })
          .eq('id', q.id!);
      }

      if (newQuestions.length > 0) {
        const { error } = await supabase
          .from('practice_questions')
          .insert(
            newQuestions.map(q => ({
              set_id: setId,
              question_text: q.question_text,
              option_a: q.option_a,
              option_b: q.option_b,
              option_c: q.option_c || null,
              option_d: q.option_d || null,
              option_e: q.option_e || null,
              option_f: q.option_f || null,
              correct_answer: q.correct_answer,
              explanation: q.explanation || null,
              difficulty: q.difficulty,
              tags: q.tags,
              question_order: q.question_order,
              creator_id: user?.id,
            }))
          );

        if (error) throw error;
      }

      await supabase
        .from('question_sets')
        .update({ question_count: activeQuestions.length })
        .eq('id', setId);

      await createAuditLog(
        isEditMode ? 'update' : 'create',
        'question_set',
        setId,
        isEditMode ? { title, level, question_count: activeQuestions.length } : null,
        { title, level, is_published: isPublished, question_count: activeQuestions.length }
      );

      toast({
        title: "Thành công",
        description: isEditMode ? "Đã cập nhật bộ đề" : "Đã tạo bộ đề mới",
      });

      navigate('/admin/question-sets');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      log.error('Save error', message);
      toast({
        title: "Lỗi",
        description: "Không thể lưu bộ đề",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    // Loading / access
    isLoading: roleLoading || loading,
    hasAccess,
    isEditMode,
    saving,

    // Form fields
    title,
    setTitle,
    description,
    setDescription,
    level,
    setLevel,
    tags,
    tagInput,
    setTagInput,
    isPublished,
    setIsPublished,
    categoryId,
    setCategoryId,
    categories,

    // Questions
    questions,
    setQuestions,

    // Actions
    addTag,
    removeTag,
    handleSave,
    handleImageUpload,
  };
}

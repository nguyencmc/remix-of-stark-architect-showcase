import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';
import { getErrorMessage } from '@/lib/utils';
import { logger } from '@/lib/logger';
import type { Exam, ExamCategory } from '../types';

const log = logger('ExamManagement');

export function useExamManagement() {
  const { isAdmin, hasPermission, loading: roleLoading } = usePermissionsContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const canView = hasPermission('exams.view');
  const canCreate = hasPermission('exams.create');

  useEffect(() => {
    if (!roleLoading && !canView) {
      navigate('/');
      toast({ title: 'Không có quyền truy cập', variant: 'destructive' });
    }
  }, [canView, roleLoading, navigate, toast]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase.from('exams').select('*').order('created_at', { ascending: false });
      if (!isAdmin && hasPermission('exams.edit_own')) q = q.eq('creator_id', user?.id);
      const [{ data: examsData }, { data: catsData }] = await Promise.all([
        q,
        supabase.from('exam_categories').select('id, name, slug'),
      ]);
      setExams((examsData || []).map(e => ({ ...e, is_proctored: (e as Record<string, unknown>).is_proctored as boolean ?? false })));
      setCategories(catsData || []);
    } catch (error: unknown) {
      log.error('Failed to fetch exam data', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAdmin, hasPermission, user]);

  useEffect(() => {
    if (canView && user) fetchData();
  }, [canView, user, fetchData]);

  const handleDelete = async (examId: string) => {
    try {
      const examToDelete = exams.find(e => e.id === examId);
      await supabase.from('questions').delete().eq('exam_id', examId);
      const { error } = await supabase.from('exams').delete().eq('id', examId);
      if (error) {
        toast({ title: 'Lỗi', description: 'Không thể xóa đề thi', variant: 'destructive' });
        return;
      }
      await createAuditLog('delete', 'exam', examId,
        { title: examToDelete?.title, slug: examToDelete?.slug }, null);
      toast({ title: 'Đã xóa đề thi' });
      fetchData();
    } catch (error: unknown) {
      log.error('Failed to delete exam', getErrorMessage(error));
      toast({ title: 'Lỗi', description: 'Không thể xóa đề thi', variant: 'destructive' });
    }
  };

  const handleToggleProctoring = async (exam: Exam) => {
    setTogglingId(exam.id);
    try {
      const next = !exam.is_proctored;
      const { error } = await supabase
        .from('exams')
        .update({ is_proctored: next } as Record<string, unknown>)
        .eq('id', exam.id);
      if (error) {
        toast({ title: 'Lỗi', description: 'Không thể cập nhật', variant: 'destructive' });
      } else {
        setExams(prev => prev.map(e => e.id === exam.id ? { ...e, is_proctored: next } : e));
        toast({
          title: next ? '🎥 Đã bật giám sát' : '🚫 Đã tắt giám sát',
          description: exam.title.slice(0, 50),
        });
      }
    } catch (error: unknown) {
      log.error('Failed to toggle proctoring', getErrorMessage(error));
      toast({ title: 'Lỗi', description: 'Không thể cập nhật', variant: 'destructive' });
    } finally {
      setTogglingId(null);
    }
  };

  const getCategoryName = (id: string | null) =>
    id ? (categories.find(c => c.id === id)?.name ?? 'Không xác định') : 'Chưa phân loại';

  const clearFilters = () => {
    setSearchQuery('');
    setFilterDifficulty('all');
    setFilterCategory('all');
  };

  const filteredExams = exams.filter(e => {
    const matchSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff = filterDifficulty === 'all' || e.difficulty === filterDifficulty;
    const matchCat = filterCategory === 'all' || e.category_id === filterCategory;
    return matchSearch && matchDiff && matchCat;
  });

  const totalQuestions = exams.reduce((s, e) => s + (e.question_count || 0), 0);
  const totalAttempts = exams.reduce((s, e) => s + (e.attempt_count || 0), 0);
  const proctoredCount = exams.filter(e => e.is_proctored).length;
  const hasActiveFilters = searchQuery !== '' || filterDifficulty !== 'all' || filterCategory !== 'all';

  return {
    exams,
    categories,
    loading,
    roleLoading,
    searchQuery,
    setSearchQuery,
    filterDifficulty,
    setFilterDifficulty,
    filterCategory,
    setFilterCategory,
    filteredExams,
    totalQuestions,
    totalAttempts,
    proctoredCount,
    hasActiveFilters,
    clearFilters,
    togglingId,
    isAdmin,
    canView,
    canCreate,
    handleDelete,
    handleToggleProctoring,
    getCategoryName,
  };
}

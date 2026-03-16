import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';
import { logger } from '@/lib/logger';
import type { Course, CourseCategory } from '../types';
import type { ReactNode } from 'react';

const log = logger('CourseManagement');

export function useCourseManagement() {
  const { user } = useAuth();
  const { isAdmin, hasPermission, loading: roleLoading } = usePermissionsContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const canView = hasPermission('courses.view');
  const canCreate = hasPermission('courses.create');

  useEffect(() => {
    if (!roleLoading && !canView) {
      navigate('/');
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền xem khóa học",
        variant: "destructive",
      });
    }
  }, [canView, roleLoading, navigate, toast]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    let coursesQuery = supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    // If not admin, only show own courses
    if (!isAdmin && hasPermission('courses.edit_own') && user) {
      coursesQuery = coursesQuery.eq('creator_id', user.id);
    }

    const [{ data: coursesData }, { data: categoriesData }] = await Promise.all([
      coursesQuery,
      supabase.from('course_categories').select('id, name, slug'),
    ]);

    setCourses(coursesData || []);
    setCategories(categoriesData || []);
    setLoading(false);
  }, [isAdmin, hasPermission, user]);

  useEffect(() => {
    if (canView) {
      fetchData();
    }
  }, [canView, fetchData]);

  const handleDelete = async (courseId: string) => {
    const courseToDelete = courses.find(c => c.id === courseId);

    // First delete all sections (lessons will be deleted via cascade)
    const { error: sectionsError } = await supabase
      .from('course_sections')
      .delete()
      .eq('course_id', courseId);

    if (sectionsError) {
      log.error('Error deleting sections', sectionsError);
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa khóa học",
        variant: "destructive",
      });
      return;
    }

    await createAuditLog(
      'delete',
      'course',
      courseId,
      { title: courseToDelete?.title, slug: courseToDelete?.slug, lesson_count: courseToDelete?.lesson_count },
      null
    );

    toast({
      title: "Thành công",
      description: "Đã xóa khóa học",
    });

    fetchData();
  };

  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !currentStatus })
      .eq('id', courseId);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: currentStatus ? "Đã ẩn khóa học" : "Đã xuất bản khóa học",
    });

    fetchData();
  };

  const toggleFeatured = async (courseId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_featured: !currentStatus })
      .eq('id', courseId);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: currentStatus ? "Đã bỏ nổi bật" : "Đã đặt nổi bật",
    });

    fetchData();
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.creator_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && course.is_published) ||
      (filterStatus === 'draft' && !course.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getLevelBadge = (level: string | null): ReactNode => {
    switch (level) {
      case 'beginner':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Cơ bản</Badge>;
      case 'intermediate':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Trung bình</Badge>;
      case 'advanced':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-600">Nâng cao</Badge>;
      default:
        return <Badge variant="outline">Chưa xác định</Badge>;
    }
  };

  return {
    courses,
    categories,
    loading,
    roleLoading,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    isAdmin,
    canView,
    canCreate,
    filteredCourses,
    handleDelete,
    togglePublish,
    toggleFeatured,
    getLevelBadge,
  };
}

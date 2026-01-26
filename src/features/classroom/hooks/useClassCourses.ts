import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClassCourse } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useClassCourses = (classId: string | undefined) => {
  return useQuery({
    queryKey: ['class-courses', classId],
    queryFn: async () => {
      if (!classId) return [];
      
      const { data, error } = await supabase
        .from('class_courses')
        .select(`
          *,
          course:courses(id, title, image_url, lesson_count)
        `)
        .eq('class_id', classId)
        .order('added_at', { ascending: false });
      
      if (error) throw error;
      return data as ClassCourse[];
    },
    enabled: !!classId,
  });
};

export const useAvailableCourses = (classId: string | undefined) => {
  const { data: classCourses } = useClassCourses(classId);
  
  return useQuery({
    queryKey: ['available-courses-for-class', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, image_url, lesson_count')
        .eq('is_published', true)
        .order('title');
      
      if (error) throw error;
      
      // Filter out already added courses
      const addedIds = new Set(classCourses?.map(cc => cc.course_id) || []);
      return data.filter(c => !addedIds.has(c.id));
    },
    enabled: !!classId && classCourses !== undefined,
  });
};

export const useAddCourseToClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ classId, courseId }: { classId: string; courseId: string }) => {
      const { error } = await supabase
        .from('class_courses')
        .insert({ class_id: classId, course_id: courseId });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-courses', variables.classId] });
      queryClient.invalidateQueries({ queryKey: ['available-courses-for-class', variables.classId] });
      toast({ title: 'Đã thêm khóa học vào lớp' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useRemoveCourseFromClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ classId, courseId }: { classId: string; courseId: string }) => {
      const { error } = await supabase
        .from('class_courses')
        .delete()
        .eq('class_id', classId)
        .eq('course_id', courseId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-courses', variables.classId] });
      queryClient.invalidateQueries({ queryKey: ['available-courses-for-class', variables.classId] });
      toast({ title: 'Đã xóa khóa học khỏi lớp' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

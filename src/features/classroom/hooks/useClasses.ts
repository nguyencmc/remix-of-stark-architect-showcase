import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Class, CreateClassInput } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useClasses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['classes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Class[];
    },
    enabled: !!user,
  });
};

export const useClass = (classId: string | undefined) => {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      if (!classId) return null;
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();
      
      if (error) throw error;
      return data as Class;
    },
    enabled: !!classId,
  });
};

export const useCreateClass = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (input: CreateClassInput) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('classes')
        .insert({
          title: input.title,
          description: input.description || null,
          cover_image: input.cover_image || null,
          creator_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Auto-add creator as teacher member
      await supabase.from('class_members').insert({
        class_id: data.id,
        user_id: user.id,
        role: 'teacher',
        status: 'active',
      });
      
      return data as Class;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: 'Tạo lớp học thành công!' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useJoinClass = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (classCode: string) => {
      if (!user) throw new Error('Not authenticated');
      
      // Find class by code
      const { data: classData, error: findError } = await supabase
        .from('classes')
        .select('id, title')
        .eq('class_code', classCode.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (findError || !classData) {
        throw new Error('Không tìm thấy lớp học với mã này');
      }
      
      // Check if already member
      const { data: existing } = await supabase
        .from('class_members')
        .select('id')
        .eq('class_id', classData.id)
        .eq('user_id', user.id)
        .single();
      
      if (existing) {
        throw new Error('Bạn đã là thành viên của lớp này');
      }
      
      // Join class
      const { error: joinError } = await supabase
        .from('class_members')
        .insert({
          class_id: classData.id,
          user_id: user.id,
          role: 'student',
          status: 'active',
        });
      
      if (joinError) throw joinError;
      
      return classData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: `Tham gia lớp "${data.title}" thành công!` });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: 'Xóa lớp học thành công!' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

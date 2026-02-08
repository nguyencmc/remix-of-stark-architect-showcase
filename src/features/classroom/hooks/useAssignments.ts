import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClassAssignment, CreateAssignmentInput, AssignmentSubmission, AssignmentType } from '../types';
import { useToast } from '@/hooks/useToast';
import type { Database } from '@/integrations/supabase/types';

type ClassAssignmentInsert = Database['public']['Tables']['class_assignments']['Insert'];

export const useClassAssignments = (classId: string | undefined) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['class-assignments', classId],
    queryFn: async () => {
      if (!classId) return [];
      
      const { data, error } = await supabase
        .from('class_assignments')
        .select('*')
        .eq('class_id', classId)
        .order('due_at', { ascending: true, nullsFirst: false });
      
      if (error) throw error;
      
      // Fetch submissions for current user
      const assignments = data as ClassAssignment[];
      if (user && assignments.length > 0) {
        const { data: submissions } = await supabase
          .from('assignment_submissions')
          .select('*')
          .eq('user_id', user.id)
          .in('assignment_id', assignments.map(a => a.id));
        
        const submissionMap = new Map(submissions?.map(s => [s.assignment_id, s]) || []);
        return assignments.map(a => ({
          ...a,
          my_submission: submissionMap.get(a.id) as AssignmentSubmission | undefined,
        }));
      }
      
      return assignments;
    },
    enabled: !!classId,
  });
};

export const useCreateAssignment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (input: CreateAssignmentInput) => {
      if (!user) throw new Error('Not authenticated');
      
      const insertData: ClassAssignmentInsert = {
        class_id: input.class_id,
        title: input.title,
        description: input.description || null,
        type: input.type,
        ref_id: input.ref_id,
        due_at: input.due_at || null,
        settings: (input.settings || {}) as Database['public']['Tables']['class_assignments']['Insert']['settings'],
        created_by: user.id,
      };
      
      const { data, error } = await supabase
        .from('class_assignments')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data as ClassAssignment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-assignments', variables.class_id] });
      toast({ title: 'Tạo bài tập thành công!' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ assignmentId, classId }: { assignmentId: string; classId: string }) => {
      const { error } = await supabase
        .from('class_assignments')
        .delete()
        .eq('id', assignmentId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-assignments', variables.classId] });
      toast({ title: 'Đã xóa bài tập' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useSubmitAssignment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      assignmentId, 
      attemptId,
      score,
    }: { 
      assignmentId: string; 
      attemptId?: string;
      score?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('assignment_submissions')
        .upsert({
          assignment_id: assignmentId,
          user_id: user.id,
          status: 'submitted',
          attempt_id: attemptId || null,
          score: score ?? null,
          submitted_at: new Date().toISOString(),
        }, { onConflict: 'assignment_id,user_id' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-assignments'] });
      toast({ title: 'Đã nộp bài!' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

// For gradebook
export const useAssignmentSubmissions = (assignmentId: string | undefined) => {
  return useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: async () => {
      if (!assignmentId) return [];
      
      const { data: submissions, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId);
      
      if (error) throw error;
      
      // Get profiles
      const userIds = submissions.map(s => s.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return submissions.map(s => ({
        ...s,
        profile: profileMap.get(s.user_id) || null,
      })) as AssignmentSubmission[];
    },
    enabled: !!assignmentId,
  });
};

export const useGradeSubmission = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      score, 
      feedback 
    }: { 
      submissionId: string; 
      score: number; 
      feedback?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('assignment_submissions')
        .update({
          score,
          feedback: feedback || null,
          status: 'graded',
          graded_at: new Date().toISOString(),
          graded_by: user.id,
        })
        .eq('id', submissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      toast({ title: 'Đã chấm điểm!' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

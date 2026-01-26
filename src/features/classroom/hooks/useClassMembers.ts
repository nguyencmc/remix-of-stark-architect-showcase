import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClassMember, ClassMemberRole } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useClassMembers = (classId: string | undefined) => {
  return useQuery({
    queryKey: ['class-members', classId],
    queryFn: async () => {
      if (!classId) return [];
      
      // Get members
      const { data: members, error } = await supabase
        .from('class_members')
        .select('*')
        .eq('class_id', classId)
        .eq('status', 'active')
        .order('role', { ascending: true });
      
      if (error) throw error;
      
      // Get profiles for members
      const userIds = members.map(m => m.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, email')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return members.map(m => ({
        ...m,
        profile: profileMap.get(m.user_id) || null,
      })) as ClassMember[];
    },
    enabled: !!classId,
  });
};

export const usePendingMembers = (classId: string | undefined) => {
  return useQuery({
    queryKey: ['pending-members', classId],
    queryFn: async () => {
      if (!classId) return [];
      
      // Get pending members
      const { data: members, error } = await supabase
        .from('class_members')
        .select('*')
        .eq('class_id', classId)
        .eq('status', 'pending')
        .order('joined_at', { ascending: true });
      
      if (error) throw error;
      
      // Get profiles for pending members
      const userIds = members.map(m => m.user_id);
      if (userIds.length === 0) return [];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, email')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return members.map(m => ({
        ...m,
        profile: profileMap.get(m.user_id) || null,
      })) as ClassMember[];
    },
    enabled: !!classId,
  });
};

export const useMyClassRole = (classId: string | undefined) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-class-role', classId, user?.id],
    queryFn: async () => {
      if (!classId || !user) return null;
      
      // Check if creator
      const { data: classData } = await supabase
        .from('classes')
        .select('creator_id')
        .eq('id', classId)
        .single();
      
      if (classData?.creator_id === user.id) {
        return 'teacher' as ClassMemberRole;
      }
      
      // Check membership
      const { data, error } = await supabase
        .from('class_members')
        .select('role')
        .eq('class_id', classId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (error || !data) return null;
      return data.role as ClassMemberRole;
    },
    enabled: !!classId && !!user,
  });
};

export const useApproveMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ classId, userId }: { classId: string; userId: string }) => {
      const { error } = await supabase
        .from('class_members')
        .update({ status: 'active' })
        .eq('class_id', classId)
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-members', variables.classId] });
      queryClient.invalidateQueries({ queryKey: ['pending-members', variables.classId] });
      toast({ title: 'Đã phê duyệt thành viên' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useRejectMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ classId, userId }: { classId: string; userId: string }) => {
      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pending-members', variables.classId] });
      toast({ title: 'Đã từ chối yêu cầu' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ classId, userId }: { classId: string; userId: string }) => {
      const { error } = await supabase
        .from('class_members')
        .update({ status: 'removed' })
        .eq('class_id', classId)
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-members', variables.classId] });
      toast({ title: 'Đã xóa thành viên khỏi lớp' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      classId, 
      userId, 
      role 
    }: { 
      classId: string; 
      userId: string; 
      role: ClassMemberRole;
    }) => {
      const { error } = await supabase
        .from('class_members')
        .update({ role })
        .eq('class_id', classId)
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-members', variables.classId] });
      toast({ title: 'Đã cập nhật vai trò' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

export const useSearchUsers = (searchTerm: string) => {
  return useQuery({
    queryKey: ['search-users', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, email')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length >= 2,
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      classId, 
      userId, 
      role = 'student' 
    }: { 
      classId: string; 
      userId: string; 
      role?: ClassMemberRole;
    }) => {
      // Check if already member
      const { data: existing } = await supabase
        .from('class_members')
        .select('id, status')
        .eq('class_id', classId)
        .eq('user_id', userId)
        .single();
      
      if (existing) {
        if (existing.status === 'removed') {
          // Re-activate removed member
          const { error } = await supabase
            .from('class_members')
            .update({ status: 'active', role })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          throw new Error('Người dùng đã là thành viên của lớp');
        }
      } else {
        // Add new member directly (invited by teacher = no approval needed)
        const { error } = await supabase
          .from('class_members')
          .insert({
            class_id: classId,
            user_id: userId,
            role,
            status: 'active',
          });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['class-members', variables.classId] });
      toast({ title: 'Đã thêm thành viên vào lớp' });
    },
    onError: (error) => {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    },
  });
};

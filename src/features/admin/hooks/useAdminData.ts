import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { logger } from '@/lib/logger';
import type { Stats, DailyStats, UserWithRole } from '../types';

const log = logger('useAdminData');

const INITIAL_STATS: Stats = {
  totalUsers: 0,
  totalExams: 0,
  totalQuestions: 0,
  totalFlashcardSets: 0,
  totalPodcasts: 0,
  totalBooks: 0,
  totalAttempts: 0,
  totalCourses: 0,
  newUsersToday: 0,
  newUsersThisWeek: 0,
  newUsersThisMonth: 0,
  activeUsersThisWeek: 0,
  totalEnrollments: 0,
  completedCourses: 0,
};

export function useAdminData() {
  const { toast } = useToast();

  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [_dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [
      { count: usersCount },
      { count: examsCount },
      { count: questionsCount },
      { count: flashcardsCount },
      { count: podcastsCount },
      { count: booksCount },
      { count: attemptsCount },
      { count: coursesCount },
      { count: newUsersToday },
      { count: newUsersThisWeek },
      { count: newUsersThisMonth },
      { count: enrollmentsCount },
      { count: completedCoursesCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('exams').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('flashcard_sets').select('*', { count: 'exact', head: true }),
      supabase.from('podcasts').select('*', { count: 'exact', head: true }),
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('exam_attempts').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo.toISOString()),
      supabase.from('user_course_enrollments').select('*', { count: 'exact', head: true }),
      supabase.from('user_course_enrollments').select('*', { count: 'exact', head: true }).not('completed_at', 'is', null),
    ]);

    setStats({
      totalUsers: usersCount || 0,
      totalExams: examsCount || 0,
      totalQuestions: questionsCount || 0,
      totalFlashcardSets: flashcardsCount || 0,
      totalPodcasts: podcastsCount || 0,
      totalBooks: booksCount || 0,
      totalAttempts: attemptsCount || 0,
      totalCourses: coursesCount || 0,
      newUsersToday: newUsersToday || 0,
      newUsersThisWeek: newUsersThisWeek || 0,
      newUsersThisMonth: newUsersThisMonth || 0,
      activeUsersThisWeek: 0,
      totalEnrollments: enrollmentsCount || 0,
      completedCourses: completedCoursesCount || 0,
    });
  }, []);

  const fetchDailyStats = useCallback(async () => {
    const days: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
        users: Math.floor(Math.random() * 20) + 5,
        attempts: Math.floor(Math.random() * 50) + 10,
        enrollments: Math.floor(Math.random() * 15) + 2,
      });
    }
    setDailyStats(days);
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (profilesError) {
      log.error('Error fetching profiles', profilesError);
      return;
    }

    const { data: allRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      log.error('Error fetching roles', rolesError);
    }

    const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
      id: profile.id,
      user_id: profile.user_id,
      email: profile.email,
      full_name: profile.full_name,
      username: profile.username,
      created_at: profile.created_at,
      roles: (allRoles || [])
        .filter(r => r.user_id === profile.user_id)
        .map(r => r.role),
    }));

    setUsers(usersWithRoles);
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchDailyStats(),
      fetchUsers(),
    ]);
    setLastUpdated(new Date());
    setLoading(false);
  }, [fetchStats, fetchDailyStats, fetchUsers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast({
      title: "Đã cập nhật",
      description: "Dữ liệu đã được làm mới",
    });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (newRole === 'none') {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật quyền",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        log.error('Error deleting old roles', deleteError);
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole as 'admin' | 'moderator' | 'teacher' | 'user' });

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật quyền",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Thành công",
      description: "Đã cập nhật quyền người dùng",
    });

    fetchUsers();
  };

  return {
    stats,
    users,
    loading,
    refreshing,
    lastUpdated,
    fetchAllData,
    fetchUsers,
    handleRefresh,
    handleRoleChange,
  };
}

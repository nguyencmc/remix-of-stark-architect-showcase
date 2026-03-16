import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { ContinueLearningItem } from './types';

export function useOverviewData() {
  const { user } = useAuth();
  const [continueLearning, setContinueLearning] = useState<ContinueLearningItem[]>([]);
  const [displayName, setDisplayName] = useState('bạn');

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('full_name, username')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            const name = data.full_name?.split(' ').pop() || data.username || 'bạn';
            setDisplayName(name);
          }
        });
    }
  }, [user]);

  const fetchContinueLearning = useCallback(async () => {
    const { data: enrollments } = await supabase
      .from('user_course_enrollments')
      .select(`
        course_id,
        progress_percentage,
        updated_at,
        courses:course_id (
          id,
          title,
          slug,
          image_url
        )
      `)
      .eq('user_id', user?.id)
      .lt('progress_percentage', 100)
      .order('updated_at', { ascending: false })
      .limit(3);

    const items: ContinueLearningItem[] = [];

    if (enrollments) {
      enrollments.forEach((e: { course_id: string; progress_percentage: number; updated_at: string; courses: { id: string; title: string; slug: string; image_url: string } | null }) => {
        if (e.courses) {
          items.push({
            id: e.course_id,
            type: 'course',
            title: e.courses.title,
            progress: e.progress_percentage || 0,
            lastActivity: e.updated_at,
            slug: e.courses.slug,
            imageUrl: e.courses.image_url,
          });
        }
      });
    }

    setContinueLearning(items);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchContinueLearning();
    }
  }, [user, fetchContinueLearning]);

  return { continueLearning, displayName };
}

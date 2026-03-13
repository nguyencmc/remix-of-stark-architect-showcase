import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const log = logger('useWishlist');

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_wishlists')
        .select('course_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setWishlistIds(new Set(data?.map(w => w.course_id).filter(Boolean) as string[]));
    } catch (error) {
      log.error('Error fetching wishlist', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((courseId: string) => {
    return wishlistIds.has(courseId);
  }, [wishlistIds]);

  const addToWishlist = async (courseId: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu khóa học');
      return false;
    }

    try {
      const { error } = await supabase
        .from('course_wishlists')
        .insert({ user_id: user.id, course_id: courseId });

      if (error) throw error;
      
      setWishlistIds(prev => new Set([...prev, courseId]));
      toast.success('Đã thêm vào danh sách yêu thích');
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        toast.info('Khóa học đã có trong danh sách yêu thích');
      } else {
        log.error('Error adding to wishlist', error);
        toast.error('Không thể thêm vào danh sách yêu thích');
      }
      return false;
    }
  };

  const removeFromWishlist = async (courseId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('course_wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
      
      setWishlistIds(prev => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
      });
      toast.success('Đã xóa khỏi danh sách yêu thích');
      return true;
    } catch (error) {
      log.error('Error removing from wishlist', error);
      toast.error('Không thể xóa khỏi danh sách yêu thích');
      return false;
    }
  };

  const toggleWishlist = async (courseId: string) => {
    if (isInWishlist(courseId)) {
      return removeFromWishlist(courseId);
    } else {
      return addToWishlist(courseId);
    }
  };

  return {
    wishlistIds,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refetch: fetchWishlist,
  };
};

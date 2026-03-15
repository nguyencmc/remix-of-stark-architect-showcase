import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';
import { getErrorMessage } from '@/lib/utils';
import { logger } from '@/lib/logger';
import type { EnrichedUser, ImportResultItem } from '@/features/admin/types';

const log = logger('useUserManagement');

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface CreateUserParams {
  email: string;
  password: string;
  full_name: string;
  role: string;
  expires_at: string | null;
}

export function useUserManagement(canView: boolean) {
  const { user: currentUser, session } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [creating, setCreating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [importing, setImporting] = useState(false);

  const callAdminFunction = useCallback(async (action: string, body: object) => {
    const url = new URL(`${SUPABASE_URL}/functions/v1/admin-users`);
    url.searchParams.set('action', action);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(body)
    });

    return res.json();
  }, [session]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${SUPABASE_URL}/functions/v1/admin-users`);
      url.searchParams.set('action', 'list');

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({})
      });

      const result = await res.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setUsers(result.users || []);
    } catch (err) {
      log.error('Error fetching users', err);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    if (canView && session) {
      fetchUsers();
    }
  }, [canView, session, fetchUsers]);

  const createUser = async (params: CreateUserParams) => {
    if (!params.email || !params.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email và mật khẩu",
        variant: "destructive",
      });
      return false;
    }

    setCreating(true);
    try {
      const result = await callAdminFunction('create', {
        email: params.email,
        password: params.password,
        full_name: params.full_name,
        role: params.role,
        expires_at: params.expires_at
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await createAuditLog(
        'create',
        'user',
        result.user?.id,
        null,
        { email: params.email, full_name: params.full_name, role: params.role }
      );

      toast({
        title: "Thành công",
        description: "Đã tạo người dùng mới",
      });

      fetchUsers();
      return true;
    } catch (err: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(err) || "Không thể tạo người dùng",
        variant: "destructive",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  const changePassword = async (user: EnrichedUser, newPassword: string) => {
    if (!user || !newPassword) return false;

    setChangingPassword(true);
    try {
      const result = await callAdminFunction('update-password', {
        user_id: user.id,
        new_password: newPassword
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await createAuditLog(
        'update_password',
        'user',
        user.id,
        null,
        { email: user.email },
        { action_detail: 'Password changed by admin' }
      );

      toast({
        title: "Thành công",
        description: "Đã đổi mật khẩu",
      });

      return true;
    } catch (err: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(err) || "Không thể đổi mật khẩu",
        variant: "destructive",
      });
      return false;
    } finally {
      setChangingPassword(false);
    }
  };

  const deleteUser = async (user: EnrichedUser) => {
    if (!user) return false;

    setDeleting(true);
    try {
      const result = await callAdminFunction('delete', {
        user_id: user.id
      });

      if (result.error) {
        throw new Error(result.error);
      }

      await createAuditLog(
        'delete',
        'user',
        user.id,
        { email: user.email, full_name: user.profile?.full_name, roles: user.roles },
        null
      );

      toast({
        title: "Thành công",
        description: "Đã xóa người dùng",
      });

      fetchUsers();
      return true;
    } catch (err: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(err) || "Không thể xóa người dùng",
        variant: "destructive",
      });
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const result = await callAdminFunction('update', {
        user_id: userId,
        role: newRole === 'none' ? 'user' : newRole
      });

      if (result.error) {
        throw new Error(result.error);
      }

      const userInfo = users.find(u => u.id === userId);
      const oldRoles = userInfo?.roles || [];

      await createAuditLog(
        'update_role',
        'user',
        userId,
        { roles: oldRoles },
        { roles: [newRole === 'none' ? 'user' : newRole] },
        { email: userInfo?.email }
      );

      toast({
        title: "Thành công",
        description: "Đã cập nhật vai trò",
      });

      fetchUsers();
    } catch (err: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(err) || "Không thể cập nhật vai trò",
        variant: "destructive",
      });
    }
  };

  const handleExpirationChange = async (userId: string, expiresAt: string | null) => {
    try {
      const result = await callAdminFunction('update', {
        user_id: userId,
        expires_at: expiresAt
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Thành công",
        description: "Đã cập nhật thời hạn",
      });

      fetchUsers();
    } catch (err: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(err) || "Không thể cập nhật thời hạn",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<boolean> => {
    const file = event.target.files?.[0];
    if (!file) return false;

    setImporting(true);
    try {
      const text = await file.text();
      let lines = text.split('\n').filter(line => line.trim());

      // Skip sep= line if present (Excel compatibility)
      if (lines[0]?.toLowerCase().startsWith('sep=')) {
        lines = lines.slice(1);
      }

      // Skip header row if present
      const startIndex = lines[0]?.toLowerCase().includes('email') ? 1 : 0;

      // Helper to convert DD/MM/YYYY to ISO date
      const parseDate = (dateStr: string): string | null => {
        if (!dateStr) return null;
        const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (ddmmyyyy) {
          const [, day, month, year] = ddmmyyyy;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      const usersToCreate = [];
      for (let i = startIndex; i < lines.length; i++) {
        const separator = lines[i].includes(';') ? ';' : ',';
        const cols = lines[i].split(separator).map(c => c.trim().replace(/^\r|\r$/g, ''));
        if (cols.length >= 2 && cols[0]) {
          usersToCreate.push({
            email: cols[0],
            password: cols[1],
            full_name: cols[2] || '',
            username: cols[3] || null,
            bio: cols[4] || null,
            role: cols[5] || 'user',
            expires_at: parseDate(cols[6] || '')
          });
        }
      }

      if (usersToCreate.length === 0) {
        throw new Error('Không tìm thấy dữ liệu hợp lệ trong file');
      }

      const result = await callAdminFunction('bulk-create', {
        users: usersToCreate
      });

      if (result.error) {
        throw new Error(result.error);
      }

      const successCount = result.results?.filter((r: ImportResultItem) => r.success).length || 0;
      const failCount = result.results?.filter((r: ImportResultItem) => !r.success).length || 0;

      toast({
        title: "Import hoàn tất",
        description: `Thành công: ${successCount}, Thất bại: ${failCount}`,
      });

      fetchUsers();
      return true;
    } catch (err: unknown) {
      toast({
        title: "Lỗi",
        description: getErrorMessage(err) || "Không thể import người dùng",
        variant: "destructive",
      });
      return false;
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadCSVTemplate = () => {
    const template = 'sep=;;;;;;\nemail;password;full_name;username;bio;role;expires_at\nhocsinh1@demo.com;Matkhau123;Nguyễn Văn A;nguyenvana;Tôi là học sinh;user;31/12/2026';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mau_import_nguoi_dung.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.email?.toLowerCase().includes(searchLower) ||
      u.profile?.full_name?.toLowerCase().includes(searchLower) ||
      u.profile?.username?.toLowerCase().includes(searchLower)
    );
  });

  return {
    currentUser,
    users,
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    creating,
    changingPassword,
    deleting,
    importing,
    fileInputRef,
    fetchUsers,
    createUser,
    changePassword,
    deleteUser,
    handleRoleChange,
    handleExpirationChange,
    handleCSVUpload,
    downloadCSVTemplate,
  };
}

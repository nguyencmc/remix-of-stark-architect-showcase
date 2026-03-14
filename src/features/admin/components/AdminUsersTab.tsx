import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserBulkActions, UserSelectCheckbox } from '@/components/admin/UserBulkActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserWithRole } from '../types';

interface AdminUsersTabProps {
  users: UserWithRole[];
  loading: boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  onRefreshUsers: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'default';
    case 'teacher': return 'secondary';
    case 'moderator': return 'outline';
    default: return 'outline';
  }
};

export function AdminUsersTab({ users, loading, onRoleChange, onRefreshUsers }: AdminUsersTabProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = searchQuery === '' ||
        (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.username?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'all' ||
        (roleFilter === 'none' && u.roles.length === 0) ||
        u.roles.includes(roleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const toggleUserSelection = (id: string) => {
    const s = new Set(selectedUsers);
    if (s.has(id)) { s.delete(id); } else { s.add(id); }
    setSelectedUsers(s);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Lọc vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="none">User thường</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/admin/users">
              <Button variant="outline" className="w-full md:w-auto gap-2">
                <Eye className="w-4 h-4" />
                Quản lý chi tiết
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      <UserBulkActions
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        onRefresh={onRefreshUsers}
      />

      {/* Users Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {filteredUsers.length} người dùng {roleFilter !== 'all' && `(${roleFilter})`}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden divide-y divide-border">
                {filteredUsers.slice(0, 20).map((u) => (
                  <div key={u.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserSelectCheckbox
                          userId={u.user_id}
                          checked={selectedUsers.has(u.user_id)}
                          onToggle={toggleUserSelection}
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">
                            {(u.full_name?.[0] || u.email?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{u.full_name || 'Chưa đặt tên'}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {u.roles.length === 0 ? (
                          <Badge variant="outline" className="text-xs">User</Badge>
                        ) : (
                          u.roles.map(role => (
                            <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">{role}</Badge>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(u.created_at)}</span>
                      <Select 
                        value={u.roles[0] || 'none'} 
                        onValueChange={(value) => onRoleChange(u.user_id, value)}
                        disabled={u.user_id === user?.id}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">User</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, 20).map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <UserSelectCheckbox
                            userId={u.user_id}
                            checked={selectedUsers.has(u.user_id)}
                            onToggle={toggleUserSelection}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {(u.full_name?.[0] || u.email?.[0] || '?').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{u.full_name || 'Chưa đặt tên'}</p>
                              {u.username && <p className="text-xs text-muted-foreground">@{u.username}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(u.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {u.roles.length === 0 ? (
                              <Badge variant="outline">User</Badge>
                            ) : (
                              u.roles.map(role => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)}>{role}</Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select 
                            value={u.roles[0] || 'none'} 
                            onValueChange={(value) => onRoleChange(u.user_id, value)}
                            disabled={u.user_id === user?.id}
                          >
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">User</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

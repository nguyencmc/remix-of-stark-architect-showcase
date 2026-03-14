import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Trash2, Key } from 'lucide-react';
import type { EnrichedUser } from '@/features/admin/types';

interface UsersTableProps {
  filteredUsers: EnrichedUser[];
  loading: boolean;
  currentUserId: string | undefined;
  onRoleChange: (userId: string, newRole: string) => void;
  onExpirationChange: (userId: string, expiresAt: string | null) => void;
  onChangePassword: (user: EnrichedUser) => void;
  onDeleteUser: (user: EnrichedUser) => void;
}

const isExpired = (expiresAt: string | null | undefined) => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export function UsersTable({
  filteredUsers,
  loading,
  currentUserId,
  onRoleChange,
  onExpirationChange,
  onChangePassword,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        <CardDescription>
          Quản lý tất cả người dùng trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} className={isExpired(u.profile?.expires_at) ? 'opacity-50' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{u.profile?.full_name || 'Chưa đặt tên'}</p>
                      {u.profile?.username && (
                        <p className="text-sm text-muted-foreground">@{u.profile.username}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.roles[0] || 'user'}
                      onValueChange={(value) => onRoleChange(u.id, value)}
                      disabled={u.id === currentUserId}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={u.profile?.expires_at ? u.profile.expires_at.split('T')[0] : ''}
                        onChange={(e) => onExpirationChange(u.id, e.target.value || null)}
                        className="w-36"
                      />
                      {isExpired(u.profile?.expires_at) && (
                        <Badge variant="destructive">Hết hạn</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChangePassword(u)}
                        title="Đổi mật khẩu"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteUser(u)}
                        disabled={u.id === currentUserId}
                        title="Xóa người dùng"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

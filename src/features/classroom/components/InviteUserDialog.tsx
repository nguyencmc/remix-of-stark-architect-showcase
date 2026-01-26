import { useState } from 'react';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { useSearchUsers, useInviteUser } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClassMemberRole } from '../types';

interface InviteUserDialogProps {
  classId: string;
  trigger?: React.ReactNode;
}

const InviteUserDialog = ({ classId, trigger }: InviteUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<ClassMemberRole>('student');
  
  const { data: users, isLoading: searching } = useSearchUsers(searchTerm);
  const inviteUser = useInviteUser();

  const handleInvite = async (userId: string) => {
    await inviteUser.mutateAsync({ classId, userId, role: selectedRole });
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Mời thành viên
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mời thành viên</DialogTitle>
          <DialogDescription>
            Tìm kiếm và thêm thành viên vào lớp học
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as ClassMemberRole)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Học viên</SelectItem>
                <SelectItem value="assistant">Trợ giảng</SelectItem>
                <SelectItem value="teacher">Giáo viên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searching && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!searching && searchTerm.length >= 2 && users?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Không tìm thấy người dùng
            </p>
          )}

          {!searching && searchTerm.length < 2 && (
            <p className="text-center text-muted-foreground py-4 text-sm">
              Nhập ít nhất 2 ký tự để tìm kiếm
            </p>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users?.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {user.full_name?.[0] || user.email?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.full_name || 'Chưa đặt tên'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleInvite(user.user_id)}
                  disabled={inviteUser.isPending}
                >
                  {inviteUser.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;

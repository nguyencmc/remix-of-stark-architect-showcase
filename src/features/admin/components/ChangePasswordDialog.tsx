import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { EnrichedUser } from '@/features/admin/types';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: EnrichedUser | null;
  onSubmit: (user: EnrichedUser, newPassword: string) => Promise<boolean>;
  changingPassword: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  changingPassword,
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!open) {
      setNewPassword('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!user) return;
    const success = await onSubmit(user, newPassword);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Đổi mật khẩu cho: {user?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={changingPassword || !newPassword}>
            {changingPassword ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

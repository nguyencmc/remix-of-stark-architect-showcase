import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useUserManagement } from '@/features/admin/hooks/useUserManagement';
import { CreateUserDialog } from '@/features/admin/components/CreateUserDialog';
import { BulkImportDialog } from '@/features/admin/components/BulkImportDialog';
import { UsersTable } from '@/features/admin/components/UsersTable';
import { ChangePasswordDialog } from '@/features/admin/components/ChangePasswordDialog';
import { DeleteUserDialog } from '@/features/admin/components/DeleteUserDialog';
import type { EnrichedUser } from '@/features/admin/types';

const UserManagement = () => {
  const { hasPermission, loading: roleLoading } = usePermissionsContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const canView = hasPermission('users.view');

  useEffect(() => {
    if (!roleLoading && !canView) {
      navigate('/');
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền quản lý người dùng",
        variant: "destructive",
      });
    }
  }, [canView, roleLoading, navigate, toast]);

  const {
    currentUser,
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    creating,
    changingPassword,
    deleting,
    importing,
    fileInputRef,
    createUser,
    changePassword,
    deleteUser,
    handleRoleChange,
    handleExpirationChange,
    handleCSVUpload,
    downloadCSVTemplate,
  } = useUserManagement(canView);

  // Dialog open states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EnrichedUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<EnrichedUser | null>(null);

  const handleCSVUploadAndClose = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const success = await handleCSVUpload(event);
    if (success) {
      setBulkDialogOpen(false);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!canView) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Quản lý người dùng
              </h1>
              <p className="text-muted-foreground mt-1">Tạo, xóa, phân quyền và quản lý thời hạn người dùng</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BulkImportDialog
              open={bulkDialogOpen}
              onOpenChange={setBulkDialogOpen}
              onCSVUpload={handleCSVUploadAndClose}
              onDownloadTemplate={downloadCSVTemplate}
              importing={importing}
              fileInputRef={fileInputRef}
            />
            <CreateUserDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              onSubmit={createUser}
              creating={creating}
            />
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo email, tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <UsersTable
          filteredUsers={filteredUsers}
          loading={loading}
          currentUserId={currentUser?.id}
          onRoleChange={handleRoleChange}
          onExpirationChange={handleExpirationChange}
          onChangePassword={(user) => {
            setSelectedUser(user);
            setPasswordDialogOpen(true);
          }}
          onDeleteUser={(user) => {
            setUserToDelete(user);
            setDeleteDialogOpen(true);
          }}
        />
      </main>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        user={selectedUser}
        onSubmit={changePassword}
        changingPassword={changingPassword}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
        onConfirm={deleteUser}
        deleting={deleting}
      />
    </div>
  );
};

export default UserManagement;

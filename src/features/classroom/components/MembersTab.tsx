import { Users, Crown, UserMinus, Loader2, UserPlus } from 'lucide-react';
import { useClassMembers, useRemoveMember, useUpdateMemberRole } from '../hooks';
import { ClassMemberRole } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import PendingRequestsSection from './PendingRequestsSection';
import InviteUserDialog from './InviteUserDialog';

interface MembersTabProps {
  classId: string;
  isManager: boolean;
}

const roleLabels: Record<ClassMemberRole, string> = {
  teacher: 'Giáo viên',
  assistant: 'Trợ giảng',
  student: 'Học viên',
};

const roleBadgeVariants: Record<ClassMemberRole, 'default' | 'secondary' | 'outline'> = {
  teacher: 'default',
  assistant: 'secondary',
  student: 'outline',
};

const MembersTab = ({ classId, isManager }: MembersTabProps) => {
  const { data: members, isLoading } = useClassMembers(classId);
  const removeMember = useRemoveMember();
  const updateRole = useUpdateMemberRole();

  const handleRemove = async (userId: string) => {
    await removeMember.mutateAsync({ classId, userId });
  };

  const handleSetAssistant = async (userId: string) => {
    await updateRole.mutateAsync({ classId, userId, role: 'assistant' });
  };

  const handleSetStudent = async (userId: string) => {
    await updateRole.mutateAsync({ classId, userId, role: 'student' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const teachers = members?.filter(m => m.role === 'teacher' || m.role === 'assistant') || [];
  const students = members?.filter(m => m.role === 'student') || [];

  return (
    <div className="space-y-6">
      {/* Invite button for managers */}
      {isManager && (
        <div className="flex justify-end">
          <InviteUserDialog 
            classId={classId} 
            trigger={
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Mời thành viên
              </Button>
            }
          />
        </div>
      )}

      {/* Pending Requests - only for managers */}
      {isManager && <PendingRequestsSection classId={classId} />}

      {/* Teachers & Assistants */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Giáo viên & Trợ giảng ({teachers.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teachers.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profile?.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.profile?.full_name || 'Chưa đặt tên'}</p>
                    <p className="text-sm text-muted-foreground">{member.profile?.email}</p>
                  </div>
                </div>
                <Badge variant={roleBadgeVariants[member.role]}>
                  {roleLabels[member.role]}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Students */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Học viên ({students.length})
        </h3>
        {students.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Chưa có học viên nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {member.profile?.full_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium line-clamp-1">
                        {member.profile?.full_name || 'Chưa đặt tên'}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {roleLabels[member.role]}
                      </Badge>
                    </div>
                  </div>
                  {isManager && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">•••</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSetAssistant(member.user_id)}>
                          <Crown className="mr-2 h-4 w-4" />
                          Đặt làm trợ giảng
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Xóa khỏi lớp
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa thành viên?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn xóa {member.profile?.full_name || 'thành viên này'} khỏi lớp?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemove(member.user_id)}>
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersTab;

import { Clock, Check, X, Loader2 } from 'lucide-react';
import { usePendingMembers, useApproveMember, useRejectMember } from '../hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PendingRequestsSectionProps {
  classId: string;
}

const PendingRequestsSection = ({ classId }: PendingRequestsSectionProps) => {
  const { data: pendingMembers, isLoading } = usePendingMembers(classId);
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();

  const handleApprove = async (userId: string) => {
    await approveMember.mutateAsync({ classId, userId });
  };

  const handleReject = async (userId: string) => {
    await rejectMember.mutateAsync({ classId, userId });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pendingMembers || pendingMembers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-500" />
        Yêu cầu chờ duyệt ({pendingMembers.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pendingMembers.map((member) => (
          <Card key={member.id} className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
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
                  <Badge variant="outline" className="mt-1 text-xs text-amber-600 border-amber-300">
                    {formatDistanceToNow(new Date(member.joined_at), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleReject(member.user_id)}
                  disabled={rejectMember.isPending}
                >
                  {rejectMember.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleApprove(member.user_id)}
                  disabled={approveMember.isPending}
                >
                  {approveMember.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Duyệt
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PendingRequestsSection;

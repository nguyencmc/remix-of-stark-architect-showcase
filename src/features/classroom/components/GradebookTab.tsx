import { useState } from 'react';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useClassAssignments, useClassMembers, useAssignmentSubmissions } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface GradebookTabProps {
  classId: string;
}

const statusConfig = {
  pending: { label: 'Chưa nộp', icon: Clock, color: 'text-muted-foreground' },
  submitted: { label: 'Đã nộp', icon: CheckCircle, color: 'text-blue-500' },
  graded: { label: 'Đã chấm', icon: CheckCircle, color: 'text-green-500' },
  late: { label: 'Nộp muộn', icon: XCircle, color: 'text-orange-500' },
};

const GradebookTab = ({ classId }: GradebookTabProps) => {
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  
  const { data: assignments, isLoading: loadingAssignments } = useClassAssignments(classId);
  const { data: members, isLoading: loadingMembers } = useClassMembers(classId);
  const { data: submissions, isLoading: loadingSubmissions } = useAssignmentSubmissions(selectedAssignment || undefined);

  const students = members?.filter(m => m.role === 'student') || [];

  if (loadingAssignments || loadingMembers) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground">Chưa có bài tập nào để xem điểm</p>
        </CardContent>
      </Card>
    );
  }

  const submissionMap = new Map(submissions?.map(s => [s.user_id, s]) || []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn bài tập..." />
            </SelectTrigger>
            <SelectContent>
              {assignments.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedAssignment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Bảng điểm: {assignments.find(a => a.id === selectedAssignment)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSubmissions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Chưa có học viên nào</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học viên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Nhận xét</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const submission = submissionMap.get(student.user_id);
                    const status = submission?.status || 'pending';
                    const StatusIcon = statusConfig[status].icon;
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.profile?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {student.profile?.full_name?.[0] || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{student.profile?.full_name || 'Chưa đặt tên'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {submission?.score !== null && submission?.score !== undefined
                            ? <span className="font-semibold">{submission.score}</span>
                            : <span className="text-muted-foreground">-</span>
                          }
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {submission?.feedback || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GradebookTab;

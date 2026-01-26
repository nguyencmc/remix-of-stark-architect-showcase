import { Link } from 'react-router-dom';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle, Clock, FileText, BookOpen, Headphones, ClipboardList, ArrowRight, Loader2 } from 'lucide-react';
import { useClassAssignments } from '../hooks';
import { AssignmentType, ClassAssignment } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StudentTodoListProps {
  classId: string;
}

const typeIcons: Record<AssignmentType, React.ReactNode> = {
  exam: <FileText className="h-5 w-5" />,
  practice: <ClipboardList className="h-5 w-5" />,
  book: <BookOpen className="h-5 w-5" />,
  podcast: <Headphones className="h-5 w-5" />,
};

const getStartLink = (assignment: ClassAssignment): string => {
  switch (assignment.type) {
    case 'exam':
      // Real exam mode - goes to exam detail then proctored taking
      return `/exam/${assignment.ref_id}?type=practice`;
    case 'practice':
      return `/practice/setup/${assignment.ref_id}`;
    case 'book':
      return `/book/${assignment.ref_id}/read`;
    case 'podcast':
      return `/podcast/${assignment.ref_id}`;
    default:
      return '#';
  }
};

const getDueLabel = (dueAt: string | null) => {
  if (!dueAt) return null;
  const date = new Date(dueAt);
  
  if (isPast(date)) {
    return { label: 'Quá hạn', variant: 'destructive' as const };
  }
  if (isToday(date)) {
    return { label: 'Hôm nay', variant: 'default' as const };
  }
  if (isTomorrow(date)) {
    return { label: 'Ngày mai', variant: 'secondary' as const };
  }
  return { label: format(date, 'dd/MM', { locale: vi }), variant: 'outline' as const };
};

const StudentTodoList = ({ classId }: StudentTodoListProps) => {
  const { data: assignments, isLoading } = useClassAssignments(classId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const todoItems = assignments?.filter(a => !a.my_submission || a.my_submission.status === 'pending') || [];
  const completedItems = assignments?.filter(a => a.my_submission && a.my_submission.status !== 'pending') || [];

  if (todoItems.length === 0 && completedItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Bài tập của bạn
        </CardTitle>
        <CardDescription>
          {todoItems.length} bài cần làm • {completedItems.length} đã hoàn thành
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Todo items */}
        {todoItems.map((assignment) => {
          const dueInfo = getDueLabel(assignment.due_at);
          
          return (
            <div 
              key={assignment.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {typeIcons[assignment.type]}
                </div>
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {assignment.type === 'exam' ? 'Thi thật' : 
                       assignment.type === 'practice' ? 'Luyện tập' :
                       assignment.type === 'book' ? 'Đọc sách' : 'Podcast'}
                    </Badge>
                    {dueInfo && (
                      <Badge variant={dueInfo.variant} className="text-xs">
                        {dueInfo.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Link to={getStartLink(assignment)}>
                <Button>
                  Bắt đầu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          );
        })}

        {/* Completed items */}
        {completedItems.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">Đã hoàn thành</p>
            {completedItems.map((assignment) => (
              <div 
                key={assignment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-muted-foreground">{assignment.title}</p>
                    {assignment.my_submission?.score !== null && (
                      <span className="text-sm text-green-600 font-semibold">
                        Điểm: {assignment.my_submission.score}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">
                  {assignment.my_submission?.status === 'graded' ? 'Đã chấm' : 'Đã nộp'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentTodoList;

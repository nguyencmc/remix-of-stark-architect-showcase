import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Copy, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClass, useMyClassRole } from '../hooks';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import CoursesTab from '../components/CoursesTab';
import MembersTab from '../components/MembersTab';
import AssignmentsTab from '../components/AssignmentsTab';
import GradebookTab from '../components/GradebookTab';
import StudentTodoList from '../components/StudentTodoList';

const ClassDetailPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: classData, isLoading } = useClass(classId);
  const { data: myRole } = useMyClassRole(classId);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const isManager = myRole === 'teacher' || myRole === 'assistant';
  const isStudent = myRole === 'student';

  const copyClassCode = () => {
    if (classData?.class_code) {
      navigator.clipboard.writeText(classData.class_code);
      toast({ title: 'Đã sao chép mã lớp!' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy lớp học</h1>
          <Button onClick={() => navigate('/classes')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              size="sm"
              className="mb-2"
              onClick={() => navigate('/classes')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{classData.title}</h1>
              {!classData.is_active && (
                <Badge variant="secondary">Đã đóng</Badge>
              )}
            </div>
            {classData.description && (
              <p className="text-muted-foreground mt-1">{classData.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Mã lớp</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold">{classData.class_code}</code>
                <Button variant="ghost" size="icon" onClick={copyClassCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isManager && (
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Student Todo List - Show prominently for students */}
        {isStudent && classId && (
          <div className="mb-8">
            <StudentTodoList classId={classId} />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue={isManager ? 'assignments' : 'courses'}>
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            <TabsTrigger value="assignments">Bài tập</TabsTrigger>
            {isManager && (
              <TabsTrigger value="gradebook">Bảng điểm</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="courses">
            <CoursesTab classId={classId!} isManager={isManager} />
          </TabsContent>

          <TabsContent value="members">
            <MembersTab classId={classId!} isManager={isManager} />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsTab classId={classId!} isManager={isManager} />
          </TabsContent>

          {isManager && (
            <TabsContent value="gradebook">
              <GradebookTab classId={classId!} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default ClassDetailPage;

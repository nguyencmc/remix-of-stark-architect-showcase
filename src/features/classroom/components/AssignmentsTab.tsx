import { useState } from 'react';
import { Plus, Trash2, FileText, BookOpen, Headphones, ClipboardList, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useClassAssignments, useCreateAssignment, useDeleteAssignment } from '../hooks';
import { useRefData } from '../hooks/useRefData';
import { AssignmentType } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AssignmentsTabProps {
  classId: string;
  isManager: boolean;
}

const typeLabels: Record<AssignmentType, string> = {
  exam: 'Đề thi',
  practice: 'Luyện tập',
  book: 'Sách',
  podcast: 'Podcast',
};

const typeIcons: Record<AssignmentType, React.ReactNode> = {
  exam: <FileText className="h-4 w-4" />,
  practice: <ClipboardList className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  podcast: <Headphones className="h-4 w-4" />,
};

const AssignmentsTab = ({ classId, isManager }: AssignmentsTabProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AssignmentType>('exam');
  const [refId, setRefId] = useState('');
  const [dueAt, setDueAt] = useState('');

  const { data: assignments, isLoading } = useClassAssignments(classId);
  const { data: refData } = useRefData(type);
  const createAssignment = useCreateAssignment();
  const deleteAssignment = useDeleteAssignment();

  const handleCreate = async () => {
    if (!title.trim() || !refId) return;
    
    await createAssignment.mutateAsync({
      class_id: classId,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      ref_id: refId,
      due_at: dueAt || undefined,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setType('exam');
    setRefId('');
    setDueAt('');
    setIsCreateOpen(false);
  };

  const handleDelete = async (assignmentId: string) => {
    await deleteAssignment.mutateAsync({ assignmentId, classId });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {isManager && (
        <div className="flex justify-end mb-4">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo bài tập
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Tạo bài tập mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tên bài tập *</Label>
                  <Input
                    placeholder="VD: Bài kiểm tra chương 1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    placeholder="Mô tả bài tập..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Loại bài tập *</Label>
                  <Select value={type} onValueChange={(v) => { setType(v as AssignmentType); setRefId(''); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Đề thi (Thi thật)</SelectItem>
                      <SelectItem value="practice">Luyện tập</SelectItem>
                      <SelectItem value="book">Đọc sách</SelectItem>
                      <SelectItem value="podcast">Nghe podcast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Chọn nội dung *</Label>
                  <Select value={refId} onValueChange={setRefId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn..." />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="max-h-[200px]">
                        {refData?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Hạn nộp</Label>
                  <Input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleCreate}
                    disabled={!title.trim() || !refId || createAssignment.isPending}
                  >
                    {createAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tạo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {!assignments || assignments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có bài tập nào</h3>
            <p className="text-muted-foreground">
              {isManager ? 'Tạo bài tập để giao cho học viên' : 'Giáo viên chưa giao bài tập'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {typeIcons[assignment.type]}
                    </div>
                    <div>
                      <CardTitle className="text-base">{assignment.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{typeLabels[assignment.type]}</Badge>
                        {assignment.due_at && (
                          <span className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(assignment.due_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  {isManager && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              {assignment.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;

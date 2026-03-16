import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface QuestionFormProps {
  newQuestion: { title: string; content: string };
  setNewQuestion: React.Dispatch<React.SetStateAction<{ title: string; content: string }>>;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const QuestionForm = ({
  newQuestion,
  setNewQuestion,
  submitting,
  onSubmit,
  onCancel,
}: QuestionFormProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Đặt câu hỏi mới</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Tiêu đề câu hỏi..."
          value={newQuestion.title}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
        />
        <Textarea
          placeholder="Mô tả chi tiết câu hỏi của bạn..."
          value={newQuestion.content}
          onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Đăng câu hỏi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';

interface ExamEditorHeaderProps {
  isEditing: boolean;
  title: string;
}

export function ExamEditorHeader({ isEditing, title }: ExamEditorHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link to="/admin/exams">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-7 h-7 text-primary" />
          {isEditing ? 'Chỉnh sửa đề thi' : 'Tạo đề thi mới'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {title || 'Đề thi chưa có tên'}
        </p>
      </div>
    </div>
  );
}

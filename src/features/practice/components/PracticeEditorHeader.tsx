import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, ArrowLeft } from 'lucide-react';

interface PracticeEditorHeaderProps {
  isEditMode: boolean;
  title: string;
}

export function PracticeEditorHeader({ isEditMode, title }: PracticeEditorHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link to="/practice/my-sets">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Target className="w-7 h-7 text-primary" />
          {isEditMode ? 'Chỉnh sửa bộ đề' : 'Tạo bộ đề mới'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {title || 'Bộ đề chưa có tên'}
        </p>
      </div>
    </div>
  );
}

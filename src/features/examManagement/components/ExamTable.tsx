import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FileText, Plus, Edit, Clock, Camera, CameraOff, HelpCircle, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DIFFICULTY_CFG } from '../types';
import type { Exam } from '../types';
import { DeleteExamDialog } from './DeleteExamDialog';

interface ExamTableProps {
  loading: boolean;
  filteredExams: Exam[];
  searchQuery: string;
  canCreate: boolean;
  togglingId: string | null;
  getCategoryName: (id: string | null) => string;
  onDelete: (examId: string) => void;
  onToggleProctoring: (exam: Exam) => void;
}

export function ExamTable({
  loading,
  filteredExams,
  searchQuery,
  canCreate,
  togglingId,
  getCategoryName,
  onDelete,
  onToggleProctoring,
}: ExamTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (filteredExams.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <div className="text-center py-20">
          <FileText className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium mb-1">
            {searchQuery ? 'Không tìm thấy đề thi nào' : 'Chưa có đề thi nào'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Thử thay đổi bộ lọc.' : 'Hãy tạo đề thi đầu tiên.'}
          </p>
          {canCreate && (
            <Link to="/admin/exams/create">
              <Button size="sm"><Plus className="w-4 h-4 mr-2" />Tạo đề thi</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-foreground w-[34%]">Tên đề thi</TableHead>
            <TableHead className="font-semibold text-foreground">Danh mục</TableHead>
            <TableHead className="font-semibold text-foreground">Độ khó</TableHead>
            <TableHead className="font-semibold text-foreground text-center">
              <span className="flex items-center gap-1 justify-center">
                <Clock className="w-3.5 h-3.5" />Thời gian
              </span>
            </TableHead>
            <TableHead className="font-semibold text-foreground text-center">
              <span className="flex items-center gap-1 justify-center">
                <HelpCircle className="w-3.5 h-3.5" />Câu hỏi
              </span>
            </TableHead>
            <TableHead className="font-semibold text-foreground text-center">
              <span className="flex items-center gap-1 justify-center">
                <Users className="w-3.5 h-3.5" />Lượt thi
              </span>
            </TableHead>
            <TableHead className="font-semibold text-foreground text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 justify-center cursor-help select-none">
                    <Camera className="w-3.5 h-3.5" />Giám sát
                  </span>
                </TooltipTrigger>
                <TooltipContent>Bật/tắt giám sát webcam khi học viên làm bài</TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead className="font-semibold text-foreground">Ngày tạo</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExams.map(exam => {
            const diff = DIFFICULTY_CFG[exam.difficulty ?? 'medium'] ?? DIFFICULTY_CFG.medium;
            const cleanDesc = (exam.description ?? '')
              .replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
            return (
              <TableRow key={exam.id} className="hover:bg-muted/30 transition-colors group">
                {/* Title */}
                <TableCell>
                  <div>
                    <p className="font-medium leading-snug">{exam.title}</p>
                    {cleanDesc && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-xs">
                        {cleanDesc}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
                    {getCategoryName(exam.category_id)}
                  </Badge>
                </TableCell>

                {/* Difficulty */}
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs font-medium border', diff.cls)}>
                    {diff.label}
                  </Badge>
                </TableCell>

                {/* Duration */}
                <TableCell className="text-center text-sm tabular-nums">
                  {exam.duration_minutes ?? 60}
                  <span className="text-muted-foreground text-xs ml-0.5">ph</span>
                </TableCell>

                {/* Questions */}
                <TableCell className="text-center text-sm font-medium tabular-nums">
                  {exam.question_count ?? 0}
                </TableCell>

                {/* Attempts */}
                <TableCell className="text-center text-sm tabular-nums">
                  {(exam.attempt_count ?? 0).toLocaleString()}
                </TableCell>

                {/* Proctoring toggle */}
                <TableCell className="text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center gap-2">
                        {exam.is_proctored
                          ? <Camera className="w-3.5 h-3.5 text-orange-500" />
                          : <CameraOff className="w-3.5 h-3.5 text-muted-foreground/40" />}
                        <Switch
                          checked={exam.is_proctored}
                          disabled={togglingId === exam.id}
                          onCheckedChange={() => onToggleProctoring(exam)}
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {exam.is_proctored
                        ? 'Giám sát đang BẬT — click để tắt'
                        : 'Giám sát đang TẮT — click để bật'}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>

                {/* Date */}
                <TableCell className="text-muted-foreground text-sm tabular-nums">
                  {new Date(exam.created_at).toLocaleDateString('vi-VN')}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={`/admin/exams/${exam.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Chỉnh sửa</TooltipContent>
                    </Tooltip>

                    <DeleteExamDialog
                      examTitle={exam.title}
                      onConfirm={() => onDelete(exam.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  Edit, 
  CheckCircle2, 
  XCircle,
  FolderOpen,
  BarChart3,
  Tag,
  Globe,
  Lock,
} from 'lucide-react';
import type { PracticeQuestion } from '@/components/admin/practice/PracticeQuestionEditor';

interface PracticeReviewStepProps {
  title: string;
  description: string;
  categoryName?: string;
  difficulty: string;
  durationMinutes: number;
  tags: string[];
  isPublished: boolean;
  questions: PracticeQuestion[];
  onEditInfo: () => void;
  onEditQuestions: () => void;
  onUpdateQuestion: (index: number, field: string, value: any) => void;
}

export const PracticeReviewStep = ({
  title,
  description,
  categoryName,
  difficulty,
  durationMinutes,
  tags,
  isPublished,
  questions,
  onEditInfo,
  onEditQuestions,
}: PracticeReviewStepProps) => {
  const activeQuestions = questions.filter(q => !q.isDeleted);
  
  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy': return { label: 'Dễ', color: 'text-green-600' };
      case 'medium': return { label: 'Trung bình', color: 'text-yellow-600' };
      case 'hard': return { label: 'Khó', color: 'text-red-600' };
      default: return { label: difficulty, color: 'text-muted-foreground' };
    }
  };

  const difficultyInfo = getDifficultyLabel();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Info Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Thông tin bộ đề
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEditInfo}>
            <Edit className="w-4 h-4 mr-1" />
            Chỉnh sửa
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tiêu đề</p>
                <p className="font-medium text-lg">{title}</p>
              </div>
              {description && (
                <div>
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p className="text-foreground">{description}</p>
                </div>
              )}
              {categoryName && (
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Danh mục:</span>
                  <span>{categoryName}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Độ khó:</span>
                  <span className={`font-medium ${difficultyInfo.color}`}>
                    {difficultyInfo.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thời gian:</span>
                <span className="font-medium">{durationMinutes} phút</span>
              </div>
              <div className="flex items-center gap-2">
                {isPublished ? (
                  <>
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Công khai</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Riêng tư</span>
                  </>
                )}
              </div>
              {tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Danh sách câu hỏi ({activeQuestions.length} câu)
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEditQuestions}>
            <Edit className="w-4 h-4 mr-1" />
            Chỉnh sửa
          </Button>
        </CardHeader>
        <CardContent>
          {activeQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <XCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có câu hỏi nào</p>
              <Button variant="link" onClick={onEditQuestions}>
                Thêm câu hỏi ngay
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeQuestions.map((question, index) => (
                <div
                  key={question.id || index}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{question.question_text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        Đáp án: {question.correct_answer}
                      </span>
                      {question.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {question.difficulty === 'easy' && 'Dễ'}
                          {question.difficulty === 'medium' && 'TB'}
                          {question.difficulty === 'hard' && 'Khó'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{activeQuestions.length}</p>
            <p className="text-sm text-muted-foreground">Câu hỏi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{durationMinutes}</p>
            <p className="text-sm text-muted-foreground">Phút</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">
              {activeQuestions.filter(q => q.difficulty === 'easy').length}
            </p>
            <p className="text-sm text-muted-foreground">Câu dễ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">
              {activeQuestions.filter(q => q.difficulty === 'hard').length}
            </p>
            <p className="text-sm text-muted-foreground">Câu khó</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import type { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  User as UserIcon,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Question, Answer } from './types';
import { AnswerItem } from './AnswerItem';
import { AnswerForm } from './AnswerForm';

interface QuestionCardProps {
  question: Question;
  instructorId?: string | null;
  user: User | null;
  isExpanded: boolean;
  answers: Answer[] | undefined;
  loadingAnswers: boolean;
  newAnswerValue: string;
  submittingAnswer: boolean;
  onToggle: (questionId: string) => void;
  onAnswerChange: (questionId: string, value: string) => void;
  onSubmitAnswer: (questionId: string) => void;
  onAcceptAnswer: (answerId: string, questionId: string) => void;
}

export const QuestionCard = ({
  question,
  instructorId,
  user,
  isExpanded,
  answers,
  loadingAnswers,
  newAnswerValue,
  submittingAnswer,
  onToggle,
  onAnswerChange,
  onSubmitAnswer,
  onAcceptAnswer,
}: QuestionCardProps) => {
  const isInstructor = user?.id === instructorId;

  return (
    <Card className="overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onToggle(question.id)}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={question.user_profile?.avatar_url || undefined} />
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">
                {question.user_profile?.full_name || 'Học viên'}
              </span>
              {question.user_id === instructorId && (
                <Badge variant="secondary" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Giảng viên
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(question.created_at), {
                  addSuffix: true,
                  locale: vi
                })}
              </span>
            </div>
            <h4 className="font-medium mt-1">{question.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {question.content}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {question.is_answered ? (
                <Badge variant="default" className="bg-green-500 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Đã trả lời
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Chờ trả lời
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {question.answers_count} câu trả lời
              </span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Answers Section */}
      {isExpanded && (
        <div className="border-t bg-muted/20">
          {loadingAnswers ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Full question content */}
              <div className="bg-background rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{question.content}</p>
              </div>

              <Separator />

              {/* Answers */}
              {answers && answers.length > 0 ? (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium">
                    Câu trả lời ({answers.length})
                  </h5>
                  {answers.map((answer) => (
                    <AnswerItem
                      key={answer.id}
                      answer={answer}
                      questionId={question.id}
                      isInstructor={!!isInstructor}
                      onAcceptAnswer={onAcceptAnswer}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Chưa có câu trả lời
                </p>
              )}

              {/* Answer Form */}
              {user && (
                <AnswerForm
                  questionId={question.id}
                  value={newAnswerValue}
                  onChange={onAnswerChange}
                  submitting={submittingAnswer}
                  onSubmit={onSubmitAnswer}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

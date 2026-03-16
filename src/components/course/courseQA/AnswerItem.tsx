import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, User, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Answer } from './types';

interface AnswerItemProps {
  answer: Answer;
  questionId: string;
  isInstructor: boolean;
  onAcceptAnswer: (answerId: string, questionId: string) => void;
}

export const AnswerItem = ({
  answer,
  questionId,
  isInstructor,
  onAcceptAnswer,
}: AnswerItemProps) => {
  return (
    <div
      className={`p-3 rounded-lg border ${
        answer.is_accepted
          ? 'border-green-500 bg-green-500/5'
          : 'bg-background'
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-7 w-7">
          <AvatarImage src={answer.user_profile?.avatar_url || undefined} />
          <AvatarFallback>
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">
              {answer.user_profile?.full_name || 'Người dùng'}
            </span>
            {answer.is_instructor_answer && (
              <Badge variant="secondary" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                Giảng viên
              </Badge>
            )}
            {answer.is_accepted && (
              <Badge variant="default" className="bg-green-500 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Chấp nhận
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(answer.created_at), {
                addSuffix: true,
                locale: vi
              })}
            </span>
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap">
            {answer.content}
          </p>
          {isInstructor && !answer.is_accepted && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onAcceptAnswer(answer.id, questionId);
              }}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Chấp nhận câu trả lời
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

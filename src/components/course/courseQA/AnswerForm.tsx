import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Send, Loader2 } from 'lucide-react';

interface AnswerFormProps {
  questionId: string;
  value: string;
  onChange: (questionId: string, value: string) => void;
  submitting: boolean;
  onSubmit: (questionId: string) => void;
}

export const AnswerForm = ({
  questionId,
  value,
  onChange,
  submitting,
  onSubmit,
}: AnswerFormProps) => {
  return (
    <div className="pt-2">
      <Separator className="mb-3" />
      <div className="flex gap-2">
        <Textarea
          placeholder="Viết câu trả lời của bạn..."
          value={value}
          onChange={(e) => onChange(questionId, e.target.value)}
          rows={2}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onSubmit(questionId);
          }}
          disabled={submitting || !value?.trim()}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

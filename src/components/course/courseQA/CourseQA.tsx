import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Loader2, Plus } from 'lucide-react';
import type { CourseQAProps } from './types';
import { useCourseQA } from './useCourseQA';
import { QuestionForm } from './QuestionForm';
import { QuestionCard } from './QuestionCard';

export const CourseQA = ({ courseId, lessonId, instructorId }: CourseQAProps) => {
  const {
    user,
    questions,
    loading,
    showAskForm,
    setShowAskForm,
    newQuestion,
    setNewQuestion,
    submitting,
    expandedQuestion,
    answers,
    loadingAnswers,
    newAnswer,
    setNewAnswer,
    submittingAnswer,
    handleSubmitQuestion,
    handleSubmitAnswer,
    toggleQuestion,
    handleAcceptAnswer,
  } = useCourseQA({ courseId, lessonId, instructorId });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Hỏi đáp ({questions.length})</h3>
        </div>
        {user && (
          <Button
            size="sm"
            onClick={() => setShowAskForm(!showAskForm)}
            variant={showAskForm ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-1" />
            Đặt câu hỏi
          </Button>
        )}
      </div>

      {/* Ask Question Form */}
      {showAskForm && user && (
        <QuestionForm
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          submitting={submitting}
          onSubmit={handleSubmitQuestion}
          onCancel={() => setShowAskForm(false)}
        />
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Chưa có câu hỏi nào cho bài học này</p>
          {user && (
            <p className="text-sm text-muted-foreground mt-1">
              Hãy là người đầu tiên đặt câu hỏi!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              instructorId={instructorId}
              user={user}
              isExpanded={expandedQuestion === question.id}
              answers={answers[question.id]}
              loadingAnswers={!!loadingAnswers[question.id]}
              newAnswerValue={newAnswer[question.id] || ''}
              submittingAnswer={!!submittingAnswer[question.id]}
              onToggle={toggleQuestion}
              onAnswerChange={(qId, value) =>
                setNewAnswer(prev => ({ ...prev, [qId]: value }))
              }
              onSubmitAnswer={handleSubmitAnswer}
              onAcceptAnswer={handleAcceptAnswer}
            />
          ))}
        </div>
      )}

      {/* Login prompt */}
      {!user && (
        <Card className="bg-muted/50">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Vui lòng đăng nhập để đặt câu hỏi hoặc trả lời
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

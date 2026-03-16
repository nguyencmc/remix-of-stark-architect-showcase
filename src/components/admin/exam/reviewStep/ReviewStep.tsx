import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Edit,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { type ReviewStepProps, QUESTIONS_PER_PAGE } from './types';
import { ReviewSummary } from './ReviewSummary';
import { ReviewHeader } from './ReviewHeader';
import { ReviewQuestionCard } from './ReviewQuestionCard';

export const ReviewStep = ({
  title,
  description,
  categoryName,
  difficulty,
  durationMinutes,
  thumbnailUrl,
  questions,
  onEditInfo,
  onEditQuestions,
  onUpdateQuestion,
}: ReviewStepProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const validQuestions = questions.filter(q => q.question_text && q.option_a && q.option_b);
  const hasIssues = validQuestions.length < questions.length || questions.length === 0;

  const toggleCorrectAnswer = (questionIndex: number, letter: string) => {
    if (!onUpdateQuestion) return;

    const question = questions[questionIndex];
    const currentAnswers = question.correct_answer.split(',').map(a => a.trim()).filter(Boolean);
    const letterIndex = currentAnswers.indexOf(letter);
    let newAnswers: string[];

    if (letterIndex === -1) {
      newAnswers = [...currentAnswers, letter].sort();
    } else {
      if (currentAnswers.length > 1) {
        newAnswers = currentAnswers.filter(a => a !== letter);
      } else {
        return;
      }
    }

    onUpdateQuestion(questionIndex, 'correct_answer', newAnswers.join(','));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const renderPagination = (className: string) => (
    <div className={`flex items-center ${className} gap-1`}>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(1)} disabled={currentPage === 1}>
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {getPageNumbers().map((page, idx) => (
        typeof page === 'number' ? (
          <Button key={idx} variant={currentPage === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => goToPage(page)}>
            {page}
          </Button>
        ) : (
          <span key={idx} className="px-2 text-muted-foreground">...</span>
        )
      ))}
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ReviewSummary
        questionsCount={questions.length}
        durationMinutes={durationMinutes}
        difficulty={difficulty}
        hasIssues={hasIssues}
      />

      <ReviewHeader
        title={title}
        description={description}
        categoryName={categoryName}
        thumbnailUrl={thumbnailUrl}
        onEditInfo={onEditInfo}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Danh sách câu hỏi</CardTitle>
            <CardDescription>
              {validQuestions.length} / {questions.length} câu hỏi hợp lệ • Click vào chữ cái để chọn/bỏ chọn đáp án đúng
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onEditQuestions}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="font-medium">Chưa có câu hỏi nào</p>
              <p className="text-sm text-muted-foreground">
                Vui lòng thêm ít nhất 1 câu hỏi trước khi lưu
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} (Câu {startIndex + 1} - {Math.min(endIndex, questions.length)})
                  </div>
                  {renderPagination('')}
                </div>
              )}

              <div className="space-y-4">
                {currentQuestions.map((q, idx) => (
                  <ReviewQuestionCard
                    key={startIndex + idx}
                    question={q}
                    actualIndex={startIndex + idx}
                    onToggleCorrectAnswer={toggleCorrectAnswer}
                  />
                ))}
              </div>

              {totalPages > 1 && renderPagination('justify-center pt-4 border-t')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

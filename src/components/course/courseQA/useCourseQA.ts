import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';
import type { Question, Answer } from './types';

const log = logger('CourseQA');

interface UseCourseQAParams {
  courseId: string;
  lessonId: string;
  instructorId?: string | null;
}

export function useCourseQA({ courseId, lessonId, instructorId }: UseCourseQAParams) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [loadingAnswers, setLoadingAnswers] = useState<Record<string, boolean>>({});
  const [newAnswer, setNewAnswer] = useState<Record<string, string>>({});
  const [submittingAnswer, setSubmittingAnswer] = useState<Record<string, boolean>>({});

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_questions')
        .select('*')
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const questionsWithProfiles = await Promise.all(
        (data || []).map(async (q) => {
          const [profileResult, answersResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('user_id', q.user_id)
              .single(),
            supabase
              .from('course_answers')
              .select('id', { count: 'exact' })
              .eq('question_id', q.id)
          ]);

          return {
            ...q,
            user_profile: profileResult.data,
            answers_count: answersResult.count || 0
          };
        })
      );

      setQuestions(questionsWithProfiles);
    } catch (error: unknown) {
      log.error('Error fetching questions', getErrorMessage(error));
      toast.error('Không thể tải câu hỏi');
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const fetchAnswers = async (questionId: string) => {
    try {
      setLoadingAnswers(prev => ({ ...prev, [questionId]: true }));

      const { data, error } = await supabase
        .from('course_answers')
        .select('*')
        .eq('question_id', questionId)
        .order('is_accepted', { ascending: false })
        .order('is_instructor_answer', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      const answersWithProfiles = await Promise.all(
        (data || []).map(async (a) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', a.user_id)
            .single();

          return {
            ...a,
            user_profile: profile
          };
        })
      );

      setAnswers(prev => ({ ...prev, [questionId]: answersWithProfiles }));
    } catch (error: unknown) {
      log.error('Error fetching answers', getErrorMessage(error));
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleSubmitQuestion = async () => {
    if (!user || !newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung câu hỏi');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('course_questions')
        .insert({
          course_id: courseId,
          lesson_id: lessonId,
          user_id: user.id,
          title: newQuestion.title.trim(),
          content: newQuestion.content.trim()
        });

      if (error) throw error;

      toast.success('Đã đăng câu hỏi thành công!');
      setNewQuestion({ title: '', content: '' });
      setShowAskForm(false);
      fetchQuestions();
    } catch (error: unknown) {
      log.error('Error submitting question', getErrorMessage(error));
      toast.error('Không thể đăng câu hỏi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const content = newAnswer[questionId]?.trim();
    if (!user || !content) {
      toast.error('Vui lòng nhập nội dung câu trả lời');
      return;
    }

    try {
      setSubmittingAnswer(prev => ({ ...prev, [questionId]: true }));

      const isInstructor = user.id === instructorId;

      const { error } = await supabase
        .from('course_answers')
        .insert({
          question_id: questionId,
          user_id: user.id,
          content: content,
          is_instructor_answer: isInstructor
        });

      if (error) throw error;

      if (isInstructor) {
        await supabase
          .from('course_questions')
          .update({ is_answered: true })
          .eq('id', questionId);
      }

      toast.success('Đã đăng câu trả lời!');
      setNewAnswer(prev => ({ ...prev, [questionId]: '' }));
      fetchAnswers(questionId);
      fetchQuestions();
    } catch (error: unknown) {
      log.error('Error submitting answer', getErrorMessage(error));
      toast.error('Không thể đăng câu trả lời');
    } finally {
      setSubmittingAnswer(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
      if (!answers[questionId]) {
        fetchAnswers(questionId);
      }
    }
  };

  const handleAcceptAnswer = async (answerId: string, questionId: string) => {
    if (user?.id !== instructorId) return;

    try {
      await supabase
        .from('course_answers')
        .update({ is_accepted: false })
        .eq('question_id', questionId);

      await supabase
        .from('course_answers')
        .update({ is_accepted: true })
        .eq('id', answerId);

      await supabase
        .from('course_questions')
        .update({ is_answered: true })
        .eq('id', questionId);

      toast.success('Đã chấp nhận câu trả lời');
      fetchAnswers(questionId);
      fetchQuestions();
    } catch (error: unknown) {
      log.error('Error accepting answer', getErrorMessage(error));
      toast.error('Không thể chấp nhận câu trả lời');
    }
  };

  return {
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
  };
}

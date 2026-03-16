export const TABLE_GROUPS: Record<string, { label: string; tables: string[] }> = {
  users: {
    label: 'Người dùng & Phân quyền',
    tables: ['profiles', 'user_roles', 'permissions', 'role_permissions', 'user_achievements', 'achievements', 'audit_logs'],
  },
  exams: {
    label: 'Đề thi & Câu hỏi',
    tables: ['exams', 'exam_categories', 'questions', 'exam_attempts', 'exam_proctoring_logs', 'exam_versions'],
  },
  practice: {
    label: 'Luyện tập',
    tables: ['question_sets', 'practice_questions', 'practice_exam_sessions', 'practice_attempts'],
  },
  courses: {
    label: 'Khóa học',
    tables: ['courses', 'course_categories', 'course_sections', 'course_lessons', 'course_tests', 'course_test_questions', 'course_test_attempts', 'course_notes', 'course_questions', 'course_answers', 'course_reviews', 'course_certificates', 'course_wishlists', 'user_course_enrollments'],
  },
  flashcards: {
    label: 'Flashcards',
    tables: ['flashcard_sets', 'flashcards', 'flashcard_decks', 'flashcard_reviews', 'user_flashcard_progress'],
  },
  books: {
    label: 'Sách',
    tables: ['books', 'book_categories', 'book_chapters', 'book_bookmarks', 'book_highlights', 'book_notes', 'user_book_progress'],
  },
  podcasts: {
    label: 'Podcast',
    tables: ['podcasts', 'podcast_categories'],
  },
  articles: {
    label: 'Bài viết',
    tables: ['articles', 'article_categories', 'article_comments'],
  },
  classroom: {
    label: 'Lớp học',
    tables: ['classes', 'class_members', 'class_courses', 'class_assignments', 'assignment_submissions'],
  },
  social: {
    label: 'Nhóm học tập',
    tables: ['study_groups', 'study_group_members', 'study_group_messages', 'study_group_resources'],
  },
};

export const ALL_TABLES = Object.values(TABLE_GROUPS).flatMap(g => g.tables);

export interface ImportResult {
  success: boolean;
  summary: Record<string, number>;
  total_imported: number;
  errors?: string[];
}

export interface ImportPreviewData {
  tables: Record<string, unknown[]>;
  exported_at?: string;
}

export type ClassMemberRole = 'teacher' | 'assistant' | 'student';
export type ClassMemberStatus = 'active' | 'pending' | 'removed';
export type AssignmentType = 'exam' | 'practice' | 'book' | 'podcast';
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late';

export interface Class {
  id: string;
  title: string;
  description: string | null;
  class_code: string;
  creator_id: string;
  cover_image: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassMember {
  id: string;
  class_id: string;
  user_id: string;
  role: ClassMemberRole;
  status: ClassMemberStatus;
  joined_at: string;
  // Joined from profiles
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

export interface ClassCourse {
  id: string;
  class_id: string;
  course_id: string;
  added_at: string;
  // Joined from courses
  course?: {
    id: string;
    title: string;
    image_url: string | null;
    lesson_count: number | null;
  };
}

export interface ClassAssignment {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  type: AssignmentType;
  ref_id: string;
  due_at: string | null;
  settings: Record<string, unknown>;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined ref data
  ref_data?: {
    title: string;
    [key: string]: unknown;
  };
  // Submission for current user (student view)
  my_submission?: AssignmentSubmission | null;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  status: SubmissionStatus;
  score: number | null;
  attempt_id: string | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  graded_by: string | null;
  created_at: string;
  // Joined profile for gradebook
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateClassInput {
  title: string;
  description?: string;
  cover_image?: string;
}

export interface CreateAssignmentInput {
  class_id: string;
  title: string;
  description?: string;
  type: AssignmentType;
  ref_id: string;
  due_at?: string;
  settings?: Record<string, unknown>;
}

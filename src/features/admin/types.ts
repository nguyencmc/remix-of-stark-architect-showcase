export interface Stats {
  totalUsers: number;
  totalExams: number;
  totalQuestions: number;
  totalFlashcardSets: number;
  totalPodcasts: number;
  totalBooks: number;
  totalAttempts: number;
  totalCourses: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeUsersThisWeek: number;
  totalEnrollments: number;
  completedCourses: number;
}

export interface DailyStats {
  date: string;
  users: number;
  attempts: number;
  enrollments: number;
}

export interface ContentDistribution {
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface UserWithRole {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  created_at: string;
  roles: string[];
  last_activity?: string;
}

export type AdminTab = 'overview' | 'users' | 'content' | 'system';

export interface ImportResultItem {
  success: boolean;
  email?: string;
  error?: string;
}

export interface EnrichedUser {
  id: string;
  email: string;
  created_at: string;
  profile?: {
    user_id: string;
    expires_at: string | null;
    full_name: string | null;
    username: string | null;
    email: string | null;
  };
  roles: string[];
}

export interface WeeklyProgress {
  day: string;
  attempts: number;
  correct: number;
}

export interface ContinueLearningItem {
  id: string;
  type: 'course' | 'exam' | 'flashcard';
  title: string;
  progress: number;
  lastActivity: string;
  slug?: string;
  imageUrl?: string;
}

export interface OverviewSectionProps {
  stats: {
    totalExamsTaken: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    points: number;
    level: number;
  };
  weeklyProgress: WeeklyProgress[];
  levelProgress: number;
  pointsToNextLevel: number;
  accuracy: number;
}

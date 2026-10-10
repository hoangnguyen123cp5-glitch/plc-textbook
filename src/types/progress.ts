export interface LessonProgress {
  completed: boolean;
  completedTopics: string[];
  quizScore: number | null;
  quizTotal: number | null;
  lastVisited: string;
  timeSpentMinutes: number;
}

export interface ProgressData {
  lessons: Record<string, LessonProgress>;
  overallPercentage: number;
  totalTimeSpentMinutes: number;
  streak: number;
  lastStudyDate: string;
}

export const defaultProgress: ProgressData = {
  lessons: {},
  overallPercentage: 0,
  totalTimeSpentMinutes: 0,
  streak: 0,
  lastStudyDate: '',
};

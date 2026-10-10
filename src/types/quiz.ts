export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'match-pairs';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lessonSlug: string;
  topicSlug?: string;
}

export interface QuizResult {
  lessonSlug: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
  answers: { questionId: string; correct: boolean }[];
}

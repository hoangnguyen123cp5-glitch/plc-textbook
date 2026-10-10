import { ProgressData, LessonProgress, defaultProgress } from '@/types/progress';

const STORAGE_KEY = 'plc-textbook-progress';

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return JSON.parse(stored) as ProgressData;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLessonProgress(lessonSlug: string): LessonProgress {
  const progress = getProgress();
  return progress.lessons[lessonSlug] || {
    completed: false,
    completedTopics: [],
    quizScore: null,
    quizTotal: null,
    lastVisited: '',
    timeSpentMinutes: 0,
  };
}

export function markTopicComplete(lessonSlug: string, topicSlug: string): void {
  const progress = getProgress();
  if (!progress.lessons[lessonSlug]) {
    progress.lessons[lessonSlug] = {
      completed: false,
      completedTopics: [],
      quizScore: null,
      quizTotal: null,
      lastVisited: new Date().toISOString(),
      timeSpentMinutes: 0,
    };
  }
  const lesson = progress.lessons[lessonSlug];
  if (!lesson.completedTopics.includes(topicSlug)) {
    lesson.completedTopics.push(topicSlug);
  }
  lesson.lastVisited = new Date().toISOString();
  recalculateOverall(progress);
  saveProgress(progress);
}

export function saveQuizScore(lessonSlug: string, score: number, total: number): void {
  const progress = getProgress();
  if (!progress.lessons[lessonSlug]) {
    progress.lessons[lessonSlug] = {
      completed: false,
      completedTopics: [],
      quizScore: null,
      quizTotal: null,
      lastVisited: new Date().toISOString(),
      timeSpentMinutes: 0,
    };
  }
  progress.lessons[lessonSlug].quizScore = score;
  progress.lessons[lessonSlug].quizTotal = total;
  recalculateOverall(progress);
  saveProgress(progress);
}

export function updateStreak(): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastStudyDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (progress.lastStudyDate === yesterday) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }
  progress.lastStudyDate = today;
  saveProgress(progress);
}

function recalculateOverall(progress: ProgressData): void {
  const totalLessons = 15;
  const completedLessons = Object.values(progress.lessons).filter(l => l.completed).length;
  progress.overallPercentage = Math.round((completedLessons / totalLessons) * 100);
}

export function exportProgress(): string {
  return JSON.stringify(getProgress(), null, 2);
}

export function importProgress(json: string): boolean {
  try {
    const data = JSON.parse(json) as ProgressData;
    saveProgress(data);
    return true;
  } catch {
    return false;
  }
}

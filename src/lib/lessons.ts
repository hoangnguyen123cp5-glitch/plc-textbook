import { LessonMeta, TopicMeta } from '@/types/lesson';
import { getLessons, getTopic, topicNumber } from '@/content';

/**
 * lib/lessons.ts — Nguồn dữ liệu bài học kết nối trực tiếp từ src/content/
 * Giữ nguyên interface LessonMeta để các trang khác không bị vỡ.
 * Topic có status 'draft' chỉ hiện khi dev, tự động ẩn khi build production.
 */

const MODULE_COLORS = ['#1a3a6b', '#c9a227', '#dc2626', '#7c3aed', '#16a34a'];
const MODULE_ICONS = ['🏭', '💻', '⚡', '🔢', '📊', '🌐', '📐', '⚙️', '⏱️', '🎛️', '📡', '🔍', '🗄️', '♻️', '🏆'];

export const lessons: LessonMeta[] = getLessons().map((l) => {
  const topics: TopicMeta[] = l.topicOrder
    .map((topicSlug, idx) => {
      const topicContent = getTopic(l.slug, topicSlug);
      if (!topicContent) return null;
      const num = topicNumber(l, topicSlug);
      return {
        id: idx + 1,
        slug: topicContent.slug,
        title: num ? `${num} ${topicContent.title}` : topicContent.title,
        durationMinutes: topicContent.durationMinutes,
        parentLessonSlug: l.slug,
      };
    })
    .filter((t): t is TopicMeta => t !== null);

  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    description: l.description,
    course: l.course,
    session: l.session,
    lab: l.lab,
    clo: l.clo,
    color: MODULE_COLORS[l.module - 1] || '#1a3a6b',
    icon: MODULE_ICONS[l.id - 1] || '⚙️',
    topics,
    totalTopics: topics.length,
    durationMinutes: topics.reduce((sum, t) => sum + t.durationMinutes, 0),
  };
});

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonById(id: number): LessonMeta | undefined {
  return lessons.find((l) => l.id === id);
}

export const totalLessons = lessons.length;
export const totalTopics = lessons.reduce((sum, l) => sum + l.totalTopics, 0);
export const totalDurationMinutes = lessons.reduce((sum, l) => sum + l.durationMinutes, 0);

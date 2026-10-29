// Topic viewer page: /lessons/[slug]/[topic]
import { notFound } from 'next/navigation';
import { getLessonBySlug, lessons } from '@/lib/lessons';
import { getLesson, getTopic } from '@/content';
import TopicAnimationWrapper from '@/components/animations/TopicAnimationWrapper';
import TopicSlideDeck from '@/components/content/TopicSlideDeck';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const params: { slug: string; topic: string }[] = [];
  for (const lesson of lessons) {
    for (const topic of lesson.topics) {
      params.push({ slug: lesson.slug, topic: topic.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { slug, topic: topicSlug } = await params;
  const lesson = getLessonBySlug(slug);
  const topic = lesson?.topics.find((t) => t.slug === topicSlug);
  if (!lesson || !topic) return {};
  return {
    title: `${topic.title} — ${lesson.title} | PLC Programming`,
    description: `${topic.title}: part of ${lesson.title} in the PLC Programming course at International School, VNU Hanoi.`,
  };
}

function getCategoryColor(id: number) {
  if (id <= 3) return '#1a3a6b';
  if (id <= 7) return '#c9a227';
  if (id <= 10) return '#dc2626';
  if (id <= 14) return '#7c3aed';
  return '#16a34a';
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic: topicSlug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const topicIndex = lesson.topics.findIndex((t) => t.slug === topicSlug);
  if (topicIndex === -1) notFound();

  const topic = lesson.topics[topicIndex];
  const topicContent = getTopic(slug, topicSlug);
  if (!topicContent) notFound();

  const lessonFile = getLesson(slug);
  const color = getCategoryColor(lesson.id);

  const simulatorNode = (
    <TopicAnimationWrapper
      lessonSlug={lesson.slug}
      topicSlug={topic.slug}
      topicIndex={topicIndex}
      topicTitle={topic.title}
    />
  );

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ── 100% PURE SLIDE PRESENTATION DECK (NO SCROLLING) ── */}
      <TopicSlideDeck
        lessonSlug={lesson.slug}
        lessonTitle={lesson.title}
        courseCode={lesson.course}
        color={color}
        currentTopicSlug={topic.slug}
        topicContent={topicContent}
        lessonFile={lessonFile}
        topics={lesson.topics}
        currentIndex={topicIndex}
        simulatorNode={simulatorNode}
      />
    </div>
  );
}

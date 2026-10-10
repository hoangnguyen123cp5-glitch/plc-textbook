// Topic viewer page: /lessons/[slug]/[topic]
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLessonBySlug, lessons } from '@/lib/lessons';
import LessonVideo from '@/components/content/LessonVideo';
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
  const prevTopic = lesson.topics[topicIndex - 1] ?? null;
  const nextTopic = lesson.topics[topicIndex + 1] ?? null;
  const color = getCategoryColor(lesson.id);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: '#a3a3a3', flexWrap: 'wrap' }}>
        <Link href="/lessons" style={{ color: '#a3a3a3', textDecoration: 'none' }} className="nav-link">Lessons</Link>
        <span>/</span>
        <Link href={`/lessons/${lesson.slug}`} style={{ color: '#a3a3a3', textDecoration: 'none' }} className="nav-link">{lesson.title}</Link>
        <span>/</span>
        <span style={{ color: '#0a0a0a', fontWeight: 500 }}>{topic.title}</span>
      </div>

      {/* Topic header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ width: 4, height: 24, borderRadius: 99, background: color, display: 'block' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase' }}>
            {lesson.icon} {lesson.title} · Topic {topicIndex + 1}/{lesson.topics.length}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1.15, marginBottom: '10px' }}>
          {topic.title}
        </h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="tag">{topic.durationMinutes} min</span>
          <span className="tag">{lesson.lab}</span>
        </div>
      </div>

      {/* Video — tự ẩn hoàn toàn nếu topic này chưa được đánh mốc */}
      <LessonVideo lessonSlug={lesson.slug} topicSlug={topic.slug} color={color} />

      {/* Content area */}
      <div style={{
        background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '10px',
        padding: '28px 32px', marginBottom: '36px', minHeight: '200px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '16px' }}>
          Lesson Notes
        </p>
        <p style={{ fontSize: '14px', color: '#a3a3a3', lineHeight: 1.7, fontStyle: 'italic' }}>
          Notes for &ldquo;{topic.title}&rdquo; are being written. In the meantime,
          see the full write-up on the{' '}
          <Link href={`/lessons/${lesson.slug}`} style={{ color: '#2563eb' }}>
            {lesson.title}
          </Link>{' '}
          lesson page.
        </p>
      </div>

      {/* Progress: topics in this lesson */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '12px' }}>
          All Topics — {lesson.title}
        </p>
        <div style={{ border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
          {lesson.topics.map((t, i) => (
            <Link key={t.slug} href={`/lessons/${lesson.slug}/${t.slug}`}
              className="lesson-row"
              style={{
                borderBottom: i === lesson.topics.length - 1 ? 'none' : '1px solid #f5f5f5',
                background: t.slug === topicSlug ? '#f0f4ff' : undefined,
              }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: t.slug === topicSlug ? color : '#d4d4d4', minWidth: '22px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: t.slug === topicSlug ? 600 : 450, color: t.slug === topicSlug ? '#0a0a0a' : '#525252' }}>
                  {t.title}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#a3a3a3' }}>{t.durationMinutes} min</span>
              {t.slug === topicSlug && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'block' }} />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
        {prevTopic ? (
          <Link href={`/lessons/${lesson.slug}/${prevTopic.slug}`}
            className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3' }}>Previous</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0a0a0a' }}>{prevTopic.title}</div>
            </div>
          </Link>
        ) : (
          <Link href={`/lessons/${lesson.slug}`}
            className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3' }}>Back</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0a0a0a' }}>{lesson.title}</div>
            </div>
          </Link>
        )}

        {nextTopic ? (
          <Link href={`/lessons/${lesson.slug}/${nextTopic.slug}`}
            className="btn-primary" style={{ background: color, flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75 }}>Next</div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{nextTopic.title}</div>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link href={`/lessons/${lesson.slug}`}
            className="btn-primary" style={{ background: color, flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75 }}>Finished</div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Back to Lesson</div>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

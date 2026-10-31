import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLessonBySlug, lessons } from '@/lib/lessons';
import { getLesson, getTopic, topicNumber } from '@/content';
import LessonMathBlock from '@/components/ui/LessonMathBlock';
import LessonDownloads from '@/components/content/LessonDownloads';
import LessonVideo from '@/components/content/LessonVideo';
import LessonAnimationWrapper from '@/components/animations/LessonAnimationWrapper';

function getCategoryColor(id: number) {
  if (id <= 3)  return '#1a3a6b';
  if (id <= 7)  return '#c9a227';
  if (id <= 10) return '#dc2626';
  if (id <= 14) return '#7c3aed';
  return '#16a34a';
}

export async function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const color = getCategoryColor(lesson.id);
  const prevLesson = lessons.find(l => l.id === lesson.id - 1);
  const nextLesson = lessons.find(l => l.id === lesson.id + 1);
  const c = getLesson(lesson.slug);
  const firstTopicSlug = lesson.topics[0]?.slug;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
        <Link href="/lessons" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }} className="nav-link">
          Curriculum
        </Link>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Lesson {lesson.id}</span>
      </div>

      {/* Hero Presentation Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{ width: 4, height: 28, borderRadius: 99, background: color, display: 'block' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
            Lesson {String(lesson.id).padStart(2, '0')} · {lesson.lab}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span style={{ fontSize: '38px', lineHeight: 1 }}>{lesson.icon}</span>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.2, margin: 0 }}>
                {lesson.title}
              </h1>
            </div>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.65, margin: 0 }}>
              {lesson.description}
            </p>
          </div>

          {/* Quick Launch CTA Card */}
          {firstTopicSlug && (
            <div style={{
              background: '#f8fafc',
              border: `1.5px solid ${color}40`,
              borderRadius: '12px',
              padding: '20px 24px',
              minWidth: '280px',
              maxWidth: '340px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                Interactive Lecture Slides
              </div>
              <div style={{ fontSize: '13px', color: '#334155', marginBottom: '14px', lineHeight: 1.5 }}>
                Structured <strong>Slide Deck</strong> with technical diagrams, key points, field cases & quick checks.
              </div>
              <Link
                href={`/lessons/${lesson.slug}/${firstTopicSlug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: color,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: `0 4px 12px ${color}33`,
                  transition: 'all 0.2s',
                }}
              >
                <span>▶ Start Topic 1</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Badges / Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          {[
            { label: `${lesson.totalTopics} Topics` },
            { label: `Duration ~${lesson.durationMinutes} min` },
            { label: `Format: ${lesson.lab}` },
            { label: lesson.session === 2 ? '2 Sessions' : '1 Session' },
          ].map(m => (
            <span key={m.label} style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* CLO & Learning Objectives */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {/* CLO */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
              Course Learning Outcome (CLO)
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
            {lesson.clo}
          </p>
          {c?.overview && (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Chapter Overview
              </span>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {c.overview.split('. ').slice(0, 2).join('. ') + '.'}
              </p>
            </div>
          )}
        </div>

        {/* Objectives */}
        {c?.objectives && c.objectives.length > 0 && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>📋</span>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', color: '#0f172a', textTransform: 'uppercase' }}>
                Learning Objectives
              </span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {c.objectives.map((obj, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                  <span style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: `${color}18`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: '1px',
                  }}>
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Topics in this Lesson (Slide Decks Directory) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Lesson Topics & Slide Decks
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Select any topic below to launch its interactive engineering slide deck, diagrams, and quick check questions.
            </p>
          </div>
          {firstTopicSlug && (
            <Link
              href={`/lessons/${lesson.slug}/${firstTopicSlug}`}
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: color,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Launch Slide Deck</span>
              <span>➔</span>
            </Link>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {lesson.topics.map((topic, i) => {
            const topicData = getTopic(lesson.slug, topic.slug);
            const num = topicNumber(lesson.slug, topic.slug) || `${lesson.id}.${i + 1}`;
            return (
            <Link
              key={topic.slug}
              href={`/lessons/${lesson.slug}/${topic.slug}`}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px 20px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
              className="topic-card-hover"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: color,
                    background: `${color}14`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    TOPIC {num}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                    ⏱️ ~{topic.durationMinutes} min
                  </span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {topic.title}
                </h3>
                {topicData?.summary && (
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                    {topicData.summary}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>✓</span> Interactive Slides & Quiz
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Open Topic</span>
                  <span>➔</span>
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>

      {/* Video & Software Downloads */}
      <div style={{ marginBottom: '28px' }}>
        <LessonVideo lessonSlug={slug} color={color} />
        <LessonDownloads slug={slug} />
        <LessonMathBlock slug={slug} />
      </div>

      {/* Featured Interactive Simulator Preview */}
      <div style={{ marginBottom: '32px' }}>
        <LessonAnimationWrapper slug={slug} />
      </div>

      {/* Review Questions */}
      {c?.review && c.review.length > 0 && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '36px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '18px' }}>❓</span>
            <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.04em', color: '#1a3a6b', textTransform: 'uppercase', margin: 0 }}>
              End-of-Chapter Review Questions
            </h3>
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {c.review.map((q, i) => (
              <li key={i} style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                {q}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Prev / Next Lesson Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid #e2e8f0', gap: '14px' }}>
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              transition: 'all 0.15s',
              flex: 1,
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#64748b', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '2px', fontWeight: 700 }}>
                Previous Lesson
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                {prevLesson.title}
              </div>
            </div>
          </Link>
        ) : <div />}

        {nextLesson && (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '12px 18px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              transition: 'all 0.15s',
              flex: 1,
              textAlign: 'right',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '2px', fontWeight: 700 }}>
                Next Lesson
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                {nextLesson.title}
              </div>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#64748b', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

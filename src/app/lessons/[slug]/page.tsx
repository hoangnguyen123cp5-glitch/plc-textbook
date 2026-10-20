import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLessonBySlug, lessons } from '@/lib/lessons';
import { lessonContent } from '@/data/lesson-content';
import LessonAnimationWrapper from '@/components/animations/LessonAnimationWrapper';
import LessonSectionAnimation from '@/components/animations/LessonSectionAnimation';
import LessonMathBlock from '@/components/ui/LessonMathBlock';
import LessonDownloads from '@/components/content/LessonDownloads';
import LessonVideo from '@/components/content/LessonVideo';

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

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: '#a3a3a3' }}>
        <Link href="/lessons" style={{ color: '#a3a3a3', textDecoration: 'none' }} className="nav-link">Lessons</Link>
        <span>/</span>
        <span style={{ color: '#0a0a0a', fontWeight: 500 }}>Lesson {lesson.id}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ width: 4, height: 32, borderRadius: 99, background: color, display: 'block' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase' }}>
            Lesson {String(lesson.id).padStart(2, '0')} · {lesson.lab}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
          <span style={{ fontSize: '40px', lineHeight: 1, flexShrink: 0 }}>{lesson.icon}</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1.1, margin: 0 }}>
            {lesson.title}
          </h1>
        </div>

        <p style={{ fontSize: '15px', color: '#737373', lineHeight: 1.7, maxWidth: '600px', marginBottom: '20px' }}>
          {lesson.description}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { label: `${lesson.totalTopics} topics` },
            { label: `${lesson.durationMinutes} min` },
            { label: lesson.lab },
            { label: lesson.session === 2 ? '2 sessions' : '1 session' },
          ].map(m => (
            <span key={m.label} className="tag">{m.label}</span>
          ))}
        </div>
      </div>

      {/* CLO */}
      <div style={{ padding: '16px 20px', borderRadius: '8px', background: '#f8f9ff', border: `1px solid ${color}22`, marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: color, textTransform: 'uppercase', marginBottom: '6px' }}>
          Learning Outcome
        </p>
        <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.6, margin: 0 }}>{lesson.clo}</p>
      </div>

      {/* ── VIDEO (tự ẩn nếu bài này chưa quay) — độc lập với lessonContent ── */}
      <LessonVideo lessonSlug={slug} color={color} />

      {/* Vietnamese content from slides */}
      {lessonContent[lesson.slug] && (() => {
        const c = lessonContent[lesson.slug];
        return (
          <div style={{ marginBottom: '40px' }}>
            {/* Overview */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>Overview</p>
              <p style={{ fontSize: '15px', color: '#404040', lineHeight: 1.75, borderLeft: `3px solid ${color}`, paddingLeft: '16px' }}>{c.overview}</p>
            </div>

            {/* ── ANIMATION (nếu có cho bài này) ── */}
            <LessonAnimationWrapper slug={slug} />

            {/* ── TẢI PHẦN MỀM (nếu bài này cần cài đặt gì đó) ── */}
            <LessonDownloads slug={slug} />

            {/* Objectives */}
            <div style={{ marginBottom: '28px', padding: '20px 24px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '14px' }}>Learning Objectives</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {c.objectives.map((obj, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', color: '#404040', lineHeight: 1.6 }}>
                    <span style={{ minWidth: 20, height: 20, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {/* Math formulas for relevant lessons */}
            <LessonMathBlock slug={slug} />

            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '16px' }}>Lesson Content</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {c.sections.map((sec, i) => (
                  <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', background: `${color}08`, borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: 3, height: 16, background: color, borderRadius: 99, flexShrink: 0 }} />
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{sec.title}</h3>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                      <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.7, margin: 0, marginBottom: sec.keyPoints ? '14px' : 0 }}>{sec.content}</p>
                      {sec.keyPoints && (
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {sec.keyPoints.map((kp, j) => (
                            <li key={j} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#404040', lineHeight: 1.6 }}>
                              <span style={{ color: color, fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>▸</span>
                              {kp}
                            </li>
                          ))}
                        </ul>
                      )}
                      {sec.note && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                          💡 {sec.note}
                        </div>
                      )}
                      <LessonSectionAnimation slug={slug} sectionIndex={i} sectionTitle={sec.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review questions */}
            {c.review && (
              <div style={{ padding: '20px 24px', background: '#f0f4ff', border: '1px solid #c7d7ff', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#3b5bdb', textTransform: 'uppercase', marginBottom: '14px' }}>❓ Review Questions</p>
                <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {c.review.map((q, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#1a2f6b', lineHeight: 1.6 }}>{q}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      })()}

      {/* Topics */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: '16px' }}>
          Topics in this Lesson
        </h2>

        {lesson.topics.length > 0 ? (
          <div style={{ border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
            {lesson.topics.map((topic, i) => (
              <Link key={topic.slug} href={`/lessons/${lesson.slug}/${topic.slug}`}
                className="lesson-row"
                style={{ borderBottom: i === lesson.topics.length - 1 ? 'none' : '1px solid #f5f5f5' }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#d4d4d4', minWidth: '22px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{topic.title}</div>
                </div>
                <span style={{ fontSize: '12px', color: '#a3a3a3', flexShrink: 0 }}>{topic.durationMinutes} min</span>
                <span className="lesson-arrow">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px 24px', textAlign: 'center', border: '1px dashed #e5e5e5', borderRadius: '10px', color: '#a3a3a3', fontSize: '14px' }}>
            Content coming soon — lessons are being added.
          </div>
        )}
      </div>

      {/* Start button */}
      {lesson.topics.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <Link href={`/lessons/${lesson.slug}/${lesson.topics[0].slug}`} className="btn-primary" style={{ background: color }}>
            Start Lesson
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* Prev / Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid #f0f0f0', gap: '12px' }}>
        {prevLesson ? (
          <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#737373', padding: '10px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', transition: 'border-color 0.15s', flex: 1 }}
            className="btn-ghost">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3', marginBottom: '2px' }}>Previous</div>
              <div style={{ fontWeight: 600, color: '#0a0a0a', fontSize: '13px' }}>{prevLesson.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextLesson && (
          <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', fontSize: '13px', color: '#737373', padding: '10px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', transition: 'border-color 0.15s', flex: 1, textAlign: 'right' }}
            className="btn-ghost">
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3', marginBottom: '2px' }}>Next</div>
              <div style={{ fontWeight: 600, color: '#0a0a0a', fontSize: '13px' }}>{nextLesson.title}</div>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

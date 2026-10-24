// Topic viewer page: /lessons/[slug]/[topic]
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLessonBySlug, lessons } from '@/lib/lessons';
import { lessonContent } from '@/data/lesson-content';
import LessonVideo from '@/components/content/LessonVideo';
import TopicAnimationWrapper from '@/components/animations/TopicAnimationWrapper';
import { asset } from '@/lib/asset';
import type { Metadata } from 'next';

const TOPIC_DIAGRAMS: Record<string, { src: string; caption: string }> = {
  // Topic 1.8: Scan cycle
  'scan-cycle': {
    src: '/images/diagrams/plc-scan-cycle.jpg',
    caption: 'Figure 1.8: Deterministic 4-Phase PLC Scan Cycle & Process Image Registers (PII / PIQ)',
  },
  // Lesson 2: Field wiring
  'field-wiring': {
    src: '/images/diagrams/plc-wiring-di.jpg',
    caption: 'Figure 2.3: Industrial Field Wiring Schematic for 24VDC Digital Inputs (Sinking / Sourcing Circuits)',
  },
  // Lesson 3: Start/Stop ladder logic
  'logic-links': {
    src: '/images/diagrams/ladder-start-stop.jpg',
    caption: 'Figure 3.1: Start/Stop Motor Latch Circuit (Seal-in Network) in TIA Portal Ladder Diagram',
  },
  'set-reset': {
    src: '/images/diagrams/ladder-start-stop.jpg',
    caption: 'Figure 3.2: Set/Reset Dominant Latch Logic Evaluation in TIA Portal',
  },
  // Lesson 3: Timers
  'timers': {
    src: '/images/diagrams/timer-timing-diagram.jpg',
    caption: 'Figure 3.3: IEC Timing Diagram: TON (On-Delay), TOF (Off-Delay), and TP (Pulse Timer) Waveforms',
  },
  // Lesson 10: Closed Loop PID
  'closed-loop-design': {
    src: '/images/diagrams/pid-block-diagram.jpg',
    caption: 'Figure 10.1: Standard Industrial Closed-Loop Feedback Control Block Diagram with Disturbance Input',
  },
  'pid-compact': {
    src: '/images/diagrams/pid-block-diagram.jpg',
    caption: 'Figure 10.2: Siemens PID_Compact Functional Block Architecture & Error Summation Node',
  },
  // Lesson 11: PROFINET
  'profinet-profibus': {
    src: '/images/diagrams/profinet-network-diagram.jpg',
    caption: 'Figure 11.2: PROFINET Real-Time (RT/IRT) Industrial Ethernet Topology with S7-1200 & ET200SP I/O',
  },
};

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

      {/* Content area: Detailed Technical Notes & Interactive Simulator */}
      {(() => {
        const contentData = lessonContent[lesson.slug];
        const numMatch = topic.title.match(/^(\d+\.\d+)/);
        const section = contentData?.sections.find((s) => {
          return numMatch ? s.title.includes(numMatch[1]) : false;
        }) ?? contentData?.sections[topicIndex];

        return (
          <div style={{ marginBottom: '36px' }}>
            {section ? (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '28px 32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase', margin: 0 }}>
                    Technical Notes · {section.title}
                  </p>
                </div>

                {/* Primary Content Paragraph */}
                <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, marginBottom: section.keyPoints ? '20px' : 0 }}>
                  {section.content}
                </p>

                {/* Key Takeaways */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '18px 20px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Key Engineering Points
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {section.keyPoints.map((kp, idx) => {
                        const parts = kp.split(':');
                        const kpTitle = parts[0];
                        const kpDesc = parts.slice(1).join(':').trim();
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', lineHeight: 1.6 }}>
                            <span style={{ color: color, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>▸</span>
                            <div>
                              <strong style={{ color: '#0f172a' }}>{kpTitle}</strong>
                              {kpDesc ? <span style={{ color: '#475569' }}>: {kpDesc}</span> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Note / Tip callout */}
                {section.note && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 18px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#92400e',
                    lineHeight: 1.65,
                  }}>
                    💡 <strong>Engineering Note:</strong> {section.note}
                  </div>
                )}

                {/* Engineering Diagram (if available for this topic) */}
                {TOPIC_DIAGRAMS[topic.slug] && (
                  <div style={{
                    marginTop: '24px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'left' }}>
                      📸 Technical Schematic Diagram
                    </p>
                    <img
                      src={asset(TOPIC_DIAGRAMS[topic.slug].src)}
                      alt={TOPIC_DIAGRAMS[topic.slug].caption}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    />
                    <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '10px', fontStyle: 'italic', margin: '10px 0 0 0' }}>
                      {TOPIC_DIAGRAMS[topic.slug].caption}
                    </p>
                  </div>
                )}

                {/* Topic-specific Interactive Simulator */}
                <TopicAnimationWrapper lessonSlug={lesson.slug} topicSlug={topic.slug} topicIndex={topicIndex} topicTitle={topic.title} />
              </div>
            ) : (
              <div style={{
                background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '10px',
                padding: '28px 32px', minHeight: '160px',
              }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Lesson Notes
                </p>
                <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.7 }}>
                  Detailed practical laboratory guide for &ldquo;{topic.title}&rdquo;. Consult the Siemens S7-1200 System Manual and TIA Portal help files during bench wiring.
                </p>
                <TopicAnimationWrapper lessonSlug={lesson.slug} topicSlug={topic.slug} topicIndex={topicIndex} topicTitle={topic.title} />
              </div>
            )}
          </div>
        );
      })()}

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

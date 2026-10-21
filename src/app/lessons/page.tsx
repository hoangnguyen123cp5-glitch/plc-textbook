import Link from 'next/link';
import { lessons } from '@/lib/lessons';

function getCategoryColor(id: number) {
  if (id <= 3)  return '#1a3a6b';
  if (id <= 7)  return '#c9a227';
  if (id <= 10) return '#dc2626';
  if (id <= 14) return '#7c3aed';
  return '#16a34a';
}

const modules = [
  { label: 'Module 1 — Foundation',       ids: [1, 2, 3],        color: '#1a3a6b', bg: '#f0f4ff' },
  { label: 'Module 2 — Programming',       ids: [4, 5, 6, 7],     color: '#c9a227', bg: '#fffbeb' },
  { label: 'Module 3 — Signals & Control', ids: [8, 9, 10],       color: '#dc2626', bg: '#fff5f5' },
  { label: 'Module 4 — Networks & HMI',    ids: [11, 12, 13, 14], color: '#7c3aed', bg: '#faf5ff' },
  { label: 'Module 5 — Capstone',          ids: [15],             color: '#16a34a', bg: '#f0fdf4' },
];

export default function LessonsPage() {
  const totalTopics  = lessons.reduce((s, l) => s + l.totalTopics, 0);
  const totalMinutes = lessons.reduce((s, l) => s + l.durationMinutes, 0);
  const totalHours   = Math.round(totalMinutes / 60);

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '8px' }}>
          Curriculum
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: '12px' }}>
          PLC Programming Curriculum
        </h1>
        <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.7, maxWidth: '540px', marginBottom: '20px' }}>
          Comprehensive Siemens S7-1200/1500 & TIA Portal training curriculum — from hardware fundamentals to plant-wide SCADA integration.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { v: '15', l: 'Lessons' },
            { v: String(totalTopics), l: 'Video topics' },
            { v: `${totalHours}h`, l: 'Content' },
            { v: '5', l: 'Modules' },
            { v: '6', l: 'Hands-on Labs' },
          ].map(s => (
            <div key={s.l} style={{ padding: '10px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>{s.v}</div>
              <div style={{ fontSize: '11px', color: '#a3a3a3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {modules.map(mod => {
          const modLessons = lessons.filter(l => mod.ids.includes(l.id));
          const modTopics  = modLessons.reduce((s, l) => s + l.totalTopics, 0);
          const modMins    = modLessons.reduce((s, l) => s + l.durationMinutes, 0);

          return (
            <div key={mod.label}>
              {/* Module header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 20px',
                background: mod.bg,
                border: `1px solid ${mod.color}22`,
                borderRadius: '10px 10px 0 0',
                borderBottom: 'none',
              }}>
                <span style={{ width: 4, height: 20, borderRadius: 99, background: mod.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontWeight: 700, fontSize: '14px', color: mod.color, letterSpacing: '-0.01em' }}>
                  {mod.label}
                </span>
                <span style={{ fontSize: '12px', color: mod.color + 'aa', fontWeight: 600 }}>
                  {modLessons.length} lessons · {modTopics} topics · {Math.round(modMins / 60)}h
                </span>
              </div>

              {/* Lessons in this module */}
              <div style={{ border: `1px solid ${mod.color}22`, borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                {modLessons.map((lesson, li) => (
                  <div key={lesson.id} style={{ borderBottom: li === modLessons.length - 1 ? 'none' : '1px solid #f0f0f0' }}>

                    {/* Lesson row */}
                    <Link href={`/lessons/${lesson.slug}`} style={{ textDecoration: 'none' }}>
                      <div
                        className="lesson-row"
                        style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#d4d4d4', minWidth: '22px', fontVariantNumeric: 'tabular-nums' }}>
                          {String(lesson.id).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{lesson.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                            {lesson.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#a3a3a3' }}>
                            {lesson.description}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: mod.color }}>{lesson.totalTopics} topics</span>
                          <span style={{ fontSize: '11px', color: '#a3a3a3' }}>{lesson.durationMinutes} min · {lesson.lab}</span>
                        </div>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={mod.color} style={{ flexShrink: 0, opacity: 0.6 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>

                    {/* Topic list (collapsed preview — max 5) */}
                    {lesson.topics.length > 0 && (
                      <div style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', padding: '8px 20px 10px 60px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {lesson.topics.slice(0, 5).map((topic, ti) => (
                            <Link key={topic.slug} href={`/lessons/${lesson.slug}/${topic.slug}`}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '5px 8px', borderRadius: '6px', textDecoration: 'none',
                                transition: 'background 0.12s',
                              }}
                              className="topic-link"
                            >
                              <span style={{ fontSize: '10px', color: '#d4d4d4', minWidth: '16px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                                {String(ti + 1).padStart(2, '0')}
                              </span>
                              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={mod.color} style={{ flexShrink: 0, opacity: 0.7 }}>
                                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8l6 4-6 4V8z" />
                              </svg>
                              <span style={{ fontSize: '13px', color: '#525252', flex: 1 }}>{topic.title}</span>
                              <span style={{ fontSize: '11px', color: '#c4c4c4' }}>{topic.durationMinutes}m</span>
                            </Link>
                          ))}
                          {lesson.topics.length > 5 && (
                            <Link href={`/lessons/${lesson.slug}`}
                              style={{ fontSize: '12px', color: mod.color, fontWeight: 600, padding: '5px 8px', textDecoration: 'none' }}
                            >
                              + {lesson.topics.length - 5} more topics →
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: '48px', padding: '28px 32px', background: '#f8f9ff', border: '1px solid #e5e5e5', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '8px' }}>
          Ready to Start?
        </div>
        <p style={{ fontSize: '13px', color: '#737373', marginBottom: '20px' }}>
          Start from Lesson 1 — no prior programming experience required.
        </p>
        <Link href="/lessons/01-programmable-control" className="btn-primary" style={{ background: '#1a3a6b' }}>
          Start Learning
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/components/layout/SiteNav';
import { asset } from '@/lib/asset';
import { lessons, totalTopics, totalDurationMinutes } from '@/lib/lessons';

const categories = [
  { label: 'Foundation',        color: '#1a3a6b' },
  { label: 'Programming',       color: '#c9a227' },
  { label: 'Signals & Control', color: '#dc2626' },
  { label: 'Networks & HMI',    color: '#7c3aed' },
  { label: 'Capstone',          color: '#16a34a' },
];

function getCategoryColor(id: number) {
  if (id <= 3)  return '#1a3a6b';
  if (id <= 7)  return '#c9a227';
  if (id <= 10) return '#dc2626';
  if (id <= 14) return '#7c3aed';
  return '#16a34a';
}
function getCategoryLabel(id: number) {
  if (id <= 3)  return 'Foundation';
  if (id <= 7)  return 'Programming';
  if (id <= 10) return 'Signals & Control';
  if (id <= 14) return 'Networks & HMI';
  return 'Capstone';
}

export default function Home() {
  const hours = Math.round(totalDurationMinutes / 60);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0a0a0a' }}>

      {/* ── NAV (dùng chung toàn site — xem components/layout/SiteNav.tsx) ── */}
      <SiteNav layout="centered" position="fixed" />

      {/* ── HERO ── */}
      <section style={{ paddingTop: '110px', paddingBottom: '72px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

          {/* Badges */}
          <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
            <span className="tag" style={{ borderColor: '#1a3a6b33', color: '#1a3a6b' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              VNU-IS · International School
            </span>
            <span className="tag">Siemens S7-1200/1500 · TIA Portal V19</span>
          </div>

          {/* Heading */}
          <h1 className="anim-d1" style={{
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: '#0a0a0a',
            marginBottom: '20px',
          }}>
            PLC<br />
            <span style={{ color: '#1a3a6b' }}>Programming</span>
          </h1>

          <p className="anim-d2" style={{
            fontSize: '1.05rem',
            color: '#737373',
            maxWidth: '520px',
            lineHeight: 1.75,
            marginBottom: '32px',
            margin: '0 auto 32px',
          }}>
            A complete, interactive course for mastering Siemens industrial PLC programming —
            from hardware fundamentals to full SCADA integration.
          </p>

          {/* CTA */}
          <div className="anim-d3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '56px', justifyContent: 'center' }}>
            <Link href="/lessons/01-programmable-control" className="btn-primary" style={{ background: '#1a3a6b' }}>
              Start Learning
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/lessons" className="btn-ghost">View Curriculum</Link>
          </div>

          {/* Stats */}
          <div className="anim-d3" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            {[
              { n: '15',            label: 'Lessons' },
              { n: `${totalTopics}+`, label: 'Video Topics' },
              { n: `${hours}h`,     label: 'Content' },
              { n: '6',             label: 'Lab Sessions' },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: '22px 18px',
                borderRight: i < 3 ? '1px solid #e5e5e5' : 'none',
              }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO VIDEO ── */}
      <section style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', padding: '72px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '12px' }}>
            Course Introduction
          </p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: '28px', lineHeight: 1.2 }}>
            Watch a sample lesson
          </h2>

          {/* Video embed placeholder — replace src with real YouTube embed */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', /* 16:9 */
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e5e5',
            background: '#f5f5f5',
          }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="PLC Programming – Course Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <p style={{ fontSize: '13px', color: '#a3a3a3', marginTop: '12px', textAlign: 'center' }}>
            ↑ Replace the YouTube URL with your real intro video
          </p>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section style={{ padding: '72px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '8px' }}>
                Full Curriculum
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1.1 }}>
                15 Lessons · {totalTopics}+ Topics
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '340px', justifyContent: 'flex-end' }}>
              {categories.map(c => (
                <span key={c.label} className="tag" style={{ fontSize: '11px', padding: '3px 10px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, display: 'inline-block', flexShrink: 0 }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
            {lessons.map((lesson, i) => {
              const color = getCategoryColor(lesson.id);
              const catLabel = getCategoryLabel(lesson.id);
              return (
                <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="lesson-row"
                  style={{ borderBottom: i === lessons.length - 1 ? 'none' : '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#d4d4d4', minWidth: '22px', fontVariantNumeric: 'tabular-nums' }}>
                    {String(lesson.id).padStart(2, '0')}
                  </span>
                  <span style={{ width: 3, height: 28, borderRadius: 99, background: color, display: 'block', flexShrink: 0 }} />
                  <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>{lesson.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0a0a0a', letterSpacing: '-0.01em' }}>{lesson.title}</div>
                    <div style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '2px' }}>{lesson.totalTopics} topics · {lesson.durationMinutes} min</div>
                  </div>
                  <span className="tag" style={{ fontSize: '11px', padding: '3px 10px', flexShrink: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {catLabel}
                  </span>
                  <span className="lesson-arrow">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '20px 24px', borderTop: '1px solid #ebebeb' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image src={asset('/images/vnu-is-logo.png')} alt="VNU-IS" width={120} height={32} style={{ objectFit: 'contain', height: '28px', width: 'auto', opacity: 0.55 }} />
          <span style={{ fontSize: '12px', color: '#d4d4d4' }}>PLC Programming · International School, VNU Hanoi</span>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';

export default function ProgressPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '8px' }}>
          Tracking
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: '8px' }}>
          My Progress
        </h1>
        <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
          Track your learning progress across all 15 lessons.
        </p>
      </div>

      <div style={{
        padding: '64px 40px', border: '1px dashed #e5e5e5', borderRadius: '12px',
        textAlign: 'center', background: '#fafafa',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '8px' }}>
          Progress Tracking Coming Soon
        </h2>
        <p style={{ fontSize: '14px', color: '#737373', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Completion badges, lesson streaks, and quiz scores will appear here.
        </p>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link href="/lessons" className="btn-primary" style={{ background: '#1a3a6b' }}>
          ← Go to Lessons
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function SimulatorPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '8px' }}>
          Interactive Tool
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: '8px' }}>
          PLC Simulator
        </h1>
        <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>
          Browser-based Ladder Logic simulator — no hardware required.
        </p>
      </div>

      {/* Coming soon card */}
      <div style={{
        padding: '64px 40px', border: '1px dashed #e5e5e5', borderRadius: '12px',
        textAlign: 'center', background: '#fafafa',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '8px' }}>
          Simulator Coming Soon
        </h2>
        <p style={{ fontSize: '14px', color: '#737373', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Interactive Ladder Logic editor with real-time simulation of contacts, coils, timers, and counters.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {['Bit Logic', 'Timers', 'Counters', 'Set/Reset', 'Edge Detection'].map(f => (
            <span key={f} className="tag">{f}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link href="/lessons" className="btn-primary" style={{ background: '#1a3a6b' }}>
          ← Continue with Lessons
        </Link>
      </div>
    </div>
  );
}

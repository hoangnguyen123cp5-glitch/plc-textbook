'use client';

import { useEffect, useRef } from 'react';

interface MathBlockProps {
  formula: string;
  display?: boolean; // true = block ($$...$$), false = inline ($...$)
  label?: string;
}

export default function MathBlock({ formula, display = true, label }: MathBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Dynamically import KaTeX to avoid SSR issues
    import('katex').then(katex => {
      if (!ref.current) return;
      try {
        katex.default.render(formula, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = formula;
      }
    });
  }, [formula, display]);

  if (display) {
    return (
      <div style={{
        margin: '16px 0',
        padding: '16px 20px',
        background: '#f8f9ff',
        border: '1px solid #e0e7ff',
        borderRadius: '10px',
        overflowX: 'auto',
        textAlign: 'center',
      }}>
        {label && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {label}
          </div>
        )}
        <div ref={ref} style={{ fontSize: '1.1rem' }} />
      </div>
    );
  }

  return <span ref={ref} style={{ padding: '0 2px' }} />;
}

/* ─── Pre-built formulas for PLC lessons ─── */

export function PIDFormula() {
  return (
    <div style={{ margin: '16px 0' }}>
      <MathBlock
        label="General PID Control Law"
        formula="u(t) = K_p \cdot e(t) + K_i \int_0^t e(\tau)\,d\tau + K_d \frac{de(t)}{dt}"
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginTop: '8px' }}>
        {[
          { sym: 'K_p', name: 'Proportional Gain', desc: 'Instantaneous response to current error', color: '#3b82f6' },
          { sym: 'K_i', name: 'Integral Gain', desc: 'Eliminates steady-state error over time', color: '#f59e0b' },
          { sym: 'K_d', name: 'Derivative Gain', desc: 'Predicts future error trends, reduces overshoot', color: '#ef4444' },
        ].map(p => (
          <div key={p.sym} style={{ padding: '10px 12px', background: `${p.color}10`, border: `1px solid ${p.color}33`, borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 700, color: p.color, marginBottom: '4px' }}>{p.sym}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: p.color, marginBottom: '2px' }}>{p.name}</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NORMXFormula() {
  return (
    <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <MathBlock
        label="NORM_X — Normalize raw integer input to [0.0, 1.0]"
        formula="\text{Value} = \frac{IN - MIN}{MAX - MIN}"
      />
      <MathBlock
        label="SCALE_X — Scale normalized value to engineering units"
        formula="OUT = MIN_{eng} + \text{Value} \times (MAX_{eng} - MIN_{eng})"
      />
      <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '13px', color: '#92400e', fontFamily: 'monospace' }}>
        <strong>Example: PT100 (-50°C → 150°C), analog input 0–20mA (0–27648):</strong><br/>
        Value = (13824 − 0) / (27648 − 0) = 0.5<br/>
        Temp = −50 + 0.5 × (150 − (−50)) = −50 + 100 = <strong>50°C</strong>
      </div>
    </div>
  );
}

export function OhmLawFormula() {
  return (
    <MathBlock
      label="Ohm's Law — Sizing PLC Input Series Resistance"
      formula="I = \frac{U}{R} \quad \Rightarrow \quad R_{series} = \frac{U_{supply} - U_{input}}{I_{max}}"
    />
  );
}

export function ScanTimeFormula() {
  return (
    <MathBlock
      label="Scan Cycle Time"
      formula="T_{scan} = T_{read\,DI} + T_{execute\,OB1} + T_{diagnostics} + T_{write\,DO}"
    />
  );
}

export function PWMFormula() {
  return (
    <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <MathBlock
        label="Duty Cycle and Average Output Voltage"
        formula="D = \frac{t_{ON}}{T} \times 100\% \qquad \bar{U} = D \times U_{supply}"
      />
      <MathBlock
        label="PWM Switching Frequency"
        formula="f = \frac{1}{T} = \frac{1}{t_{ON} + t_{OFF}}"
      />
    </div>
  );
}

export function HSCFormula() {
  return (
    <MathBlock
      label="Rotational Speed from HSC (Quadrature Encoder A/B ×4)"
      formula="n\,[\text{RPM}] = \frac{\Delta CV \times 60}{PPR \times 4 \times \Delta t\,[\text{s}]}"
    />
  );
}

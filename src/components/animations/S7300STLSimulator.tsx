'use client';

import React, { useState } from 'react';

interface StlStep {
  instr: string;
  comment: string;
  accu1: string;
  accu2: string;
  rlo: number;
  sta: number;
  q00: number;
}

const STL_STEPS: StlStep[] = [
  {
    instr: '// Initial CPU State before rung evaluation',
    comment: 'Status Word is idle; Accumulators hold residual values.',
    accu1: '0000 0000',
    accu2: '0000 0000',
    rlo: 0,
    sta: 0,
    q00: 0,
  },
  {
    instr: 'L     MW10        // Load word MW10 (measured value = 125)',
    comment: 'Old ACCU1 shifts into ACCU2. Value 125 (hex 16#007D) is loaded into ACCU1.',
    accu1: '0000 007D (125)',
    accu2: '0000 0000',
    rlo: 0,
    sta: 1,
    q00: 0,
  },
  {
    instr: 'L     100         // Load constant preset threshold 100',
    comment: 'ACCU1 shifts into ACCU2 (holding 125). Constant 100 (hex 16#0064) enters ACCU1.',
    accu1: '0000 0064 (100)',
    accu2: '0000 007D (125)',
    rlo: 0,
    sta: 1,
    q00: 0,
  },
  {
    instr: '>=I               // Compare: ACCU2 >= ACCU1 (Is 125 >= 100?)',
    comment: 'Comparison evaluates TRUE (125 is greater than 100). Result of Logic Operation (RLO) bit transitions to 1.',
    accu1: '0000 0064 (100)',
    accu2: '0000 007D (125)',
    rlo: 1,
    sta: 1,
    q00: 0,
  },
  {
    instr: '=     Q0.0        // Assign RLO to physical digital output Q0.0',
    comment: 'The RLO state (1) is written to Process Image Output bit %Q0.0. Relay contact energizes.',
    accu1: '0000 0064 (100)',
    accu2: '0000 007D (125)',
    rlo: 1,
    sta: 1,
    q00: 1,
  },
];

export default function S7300STLSimulator() {
  const [stepIdx, setStepIdx] = useState(0);
  const current = STL_STEPS[stepIdx];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🗄️</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            SIMATIC S7-300 Statement List (STL / AWL) Accumulator Animator
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#1a3a6b', background: '#e0e7ff', padding: '4px 8px', borderRadius: '4px' }}>
          STEP 7 Classic Architecture
        </span>
      </div>

      <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
        Step through a classic register-based instruction sequence. Watch how data shifts between 32-bit hardware accumulators (ACCU1 and ACCU2) and how the Status Word RLO controls output coils:
      </p>

      {/* Code Editor View (Clean Light IDE) */}
      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontFamily: 'Consolas, monospace', fontSize: '12.5px' }}>
        {STL_STEPS.slice(1).map((s, idx) => {
          const isActive = stepIdx === idx + 1;
          return (
            <div
              key={idx}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: isActive ? '#eff6ff' : 'transparent',
                borderLeft: isActive ? '3px solid #0284c7' : '3px solid transparent',
                color: isActive ? '#1d4ed8' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{s.instr}</span>
              {isActive && <span style={{ color: '#d97706', fontSize: '11px', fontWeight: 700 }}>◀ Active Instruction</span>}
            </div>
          );
        })}
      </div>

      {/* CPU Hardware Registers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Accumulator 1 (ACCU1)</div>
          <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', marginTop: '4px' }}>
            {current.accu1}
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Accumulator 2 (ACCU2)</div>
          <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', marginTop: '4px' }}>
            {current.accu2}
          </div>
        </div>

        <div style={{ background: current.rlo === 1 ? '#dcfce7' : '#f8fafc', border: `1px solid ${current.rlo === 1 ? '#86efac' : '#cbd5e1'}`, borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: current.rlo === 1 ? '#15803d' : '#64748b', textTransform: 'uppercase' }}>Status Word (RLO)</div>
          <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', color: current.rlo === 1 ? '#166534' : '#0f172a', marginTop: '2px' }}>
            {current.rlo} ({current.rlo === 1 ? 'TRUE' : 'FALSE'})
          </div>
        </div>

        <div style={{ background: current.q00 === 1 ? '#fee2e2' : '#f8fafc', border: `1px solid ${current.q00 === 1 ? '#fca5a5' : '#cbd5e1'}`, borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: current.q00 === 1 ? '#b91c1c' : '#64748b', textTransform: 'uppercase' }}>Output %Q0.0</div>
          <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', color: current.q00 === 1 ? '#dc2626' : '#0f172a', marginTop: '2px' }}>
            {current.q00 === 1 ? '⚡ ENERGIZED' : 'OFF'}
          </div>
        </div>
      </div>

      {/* Step Explanation & Navigation buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '12px', color: '#475569', flex: 1 }}>
          <strong>Step {stepIdx}/{STL_STEPS.length - 1}:</strong> {current.comment}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '12px', fontWeight: 600, cursor: stepIdx === 0 ? 'not-allowed' : 'pointer', opacity: stepIdx === 0 ? 0.5 : 1 }}
          >
            ◀ Previous Step
          </button>
          <button
            onClick={() => setStepIdx(stepIdx < STL_STEPS.length - 1 ? stepIdx + 1 : 0)}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#1a3a6b', color: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            {stepIdx < STL_STEPS.length - 1 ? 'Next Instruction ▶' : 'Restart Execution ↺'}
          </button>
        </div>
      </div>
    </div>
  );
}

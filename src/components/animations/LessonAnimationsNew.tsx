'use client';

import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   L02 — Moved to ./S7RackExplorer.tsx
   (front elevation drawing of real S7-1200 rack in mm)
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   L03 — TIA Portal Project Steps
───────────────────────────────────────────── */
export function TIAProjectSteps() {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: '📁', title: 'Create New Project', color: '#1a3a6b', detail: 'File → New Project → Enter project name → Select directory path → Click Create', tip: 'Use alphanumeric naming without spaces or special characters (e.g., Motor_Control_v1).' },
    { icon: '🖥️', title: 'Add Device (CPU)', color: '#3b82f6', detail: 'Add new device → Controllers → SIMATIC S7-1200 → CPU 1214C DC/DC/DC → Add', tip: 'Select the exact Article Number (MLFB) matching your lab hardware (e.g., 6ES7 214-1AG40-0XB0).' },
    { icon: '⚙️', title: 'Hardware Configuration', color: '#f59e0b', detail: 'Device Configuration → Drag expansion modules into rack slots → Assign IP address & subnet', tip: 'Default S7-1200 IP is 192.168.0.1. Verify that your engineering PC is on the same subnet.' },
    { icon: '🏷️', title: 'Define Tags (Tag Table)', color: '#8b5cf6', detail: 'PLC tags → Default tag table → Enter symbolic tag name, data type, and absolute address', tip: 'Always use meaningful symbolic identifiers like Motor_Start instead of raw addresses like %M0.0.' },
    { icon: '📝', title: 'Program Organization (OB1)', color: '#16a34a', detail: 'Program blocks → Main (OB1) → Add networks → Implement ladder logic (LAD/FBD/SCL)', tip: 'Isolate distinct control functions into dedicated networks and provide clear rung comments.' },
    { icon: '🔨', title: 'Compile & Download', color: '#ef4444', detail: 'Compile (Ctrl+Shift+B) → Verify 0 errors → Download to device (Ctrl+D) → Switch to RUN', tip: 'Always perform a full rebuild before downloading. Examine all warnings closely.' },
    { icon: '👁️', title: 'Monitor & Commission', color: '#0891b2', detail: 'Go Online → Monitor all (glasses icon) → Observe live ladder status → Open Watch Table', tip: 'Use Watch Tables for controlled signal verification. Exercise extreme care when forcing physical outputs!' },
  ];

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        💻 TIA Portal Engineering Workflow
      </div>

      {/* Step progress bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', overflowX: 'auto' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ flex: 1, minWidth: '36px', padding: '8px 4px', borderRadius: '8px', border: 'none', background: i === step ? s.color : i < step ? `${s.color}44` : '#e5e5e5', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '16px' }}>{s.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: i === step ? '#fff' : i < step ? s.color : '#9ca3af' }}>{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Current step detail */}
      <div style={{ background: `${steps[step].color}10`, border: `1px solid ${steps[step].color}33`, borderRadius: '10px', padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '32px' }}>{steps[step].icon}</span>
          <div>
            <div style={{ fontSize: '11px', color: steps[step].color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Step {step + 1} of {steps.length}</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0a0a0a' }}>{steps[step].title}</div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: '#374151', marginBottom: '10px', fontFamily: 'monospace', background: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>{steps[step].detail}</div>
        <div style={{ fontSize: '12px', color: steps[step].color, background: `${steps[step].color}10`, padding: '8px 12px', borderRadius: '8px', fontWeight: 500 }}>
          💡 {steps[step].tip}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: step === 0 ? '#f5f5f5' : '#fff', color: step === 0 ? '#ccc' : '#374151', cursor: step === 0 ? 'default' : 'pointer', fontWeight: 600, fontSize: '13px' }}>
          ← Previous
        </button>
        <span style={{ fontSize: '12px', color: '#9ca3af', alignSelf: 'center' }}>{step + 1} / {steps.length}</span>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: step === steps.length - 1 ? '#f5f5f5' : '#1a3a6b', color: step === steps.length - 1 ? '#ccc' : '#fff', cursor: step === steps.length - 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: '13px' }}>
          Next →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L06 — Data Type Explorer
───────────────────────────────────────────── */
export function DataTypeExplorer() {
  const [val, setVal] = useState(1000);
  const [op, setOp] = useState<'add' | 'mul'>('add');
  const [b, setB] = useState(500);

  const types = [
    { name: 'BOOL', bits: 1, min: 0, max: 1, color: '#6366f1' },
    { name: 'BYTE', bits: 8, min: 0, max: 255, color: '#3b82f6' },
    { name: 'INT', bits: 16, min: -32768, max: 32767, color: '#f59e0b' },
    { name: 'DINT', bits: 32, min: -2147483648, max: 2147483647, color: '#16a34a' },
    { name: 'REAL', bits: 32, min: -3.4e38, max: 3.4e38, color: '#ef4444' },
  ];

  const result = op === 'add' ? val + b : val * b;

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        🔢 Data Types & Arithmetic Overflow Simulator
      </div>

      {/* Type bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {types.map(t => {
          const overflow = result > t.max || result < t.min;
          const pct = Math.min(100, Math.max(0, (Math.abs(result) / Math.abs(t.max)) * 100));
          return (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, minWidth: '36px', color: t.color }}>{t.name}</span>
              <span style={{ fontSize: '10px', color: '#9ca3af', minWidth: '24px' }}>{t.bits}b</span>
              <div style={{ flex: 1, height: '20px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: overflow ? '#ef4444' : t.color, borderRadius: '4px', transition: 'width 0.2s' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, minWidth: '80px', textAlign: 'right', color: overflow ? '#ef4444' : t.color }}>
                {overflow ? '⚠️ OVERFLOW' : (t.name === 'REAL' ? result.toFixed(1) : result)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calculator */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="number" value={val} onChange={e => setVal(Number(e.target.value))}
            style={{ width: '100px', padding: '6px 10px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '14px', fontWeight: 700 }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setOp('add')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: op === 'add' ? '#1a3a6b' : '#f0f0f0', color: op === 'add' ? '#fff' : '#374151', cursor: 'pointer', fontWeight: 700 }}>+</button>
            <button onClick={() => setOp('mul')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: op === 'mul' ? '#1a3a6b' : '#f0f0f0', color: op === 'mul' ? '#fff' : '#374151', cursor: 'pointer', fontWeight: 700 }}>×</button>
          </div>
          <input type="number" value={b} onChange={e => setB(Number(e.target.value))}
            style={{ width: '100px', padding: '6px 10px', border: '1px solid #e5e5e5', borderRadius: '6px', fontSize: '14px', fontWeight: 700 }} />
          <span style={{ fontSize: '16px', fontWeight: 700 }}>=</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#1a3a6b' }}>{result.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
          Test large arithmetic operands to observe data type limit saturation and overflow (highlighted in red ⚠️).
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L07 — FC vs FB Memory Visualizer
───────────────────────────────────────────── */
export function FCFBVisualizer() {
  const [mode, setMode] = useState<'fc' | 'fb'>('fc');
  const [call, setCall] = useState(0);
  const [staticVal, setStaticVal] = useState(0);

  const handleCall = () => {
    setCall(c => c + 1);
    if (mode === 'fb') setStaticVal(v => v + 10);
  };

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        🧩 FC vs FB — Execution & Memory Architecture
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['fc', 'fb'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setCall(0); setStaticVal(0); }}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: mode === m ? (m === 'fc' ? '#3b82f6' : '#f59e0b') : '#f0f0f0', color: mode === m ? '#fff' : '#374151', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {m === 'fc' ? '⚡ FC — Function' : '🗃️ FB — Function Block'}
          </button>
        ))}
      </div>

      {/* Memory blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', marginBottom: '8px' }}>📥 INPUT / TEMP</div>
          <div style={{ fontSize: '13px', color: '#374151' }}>Execution Calls: <strong>{call}</strong></div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Temporary memory — cleared upon block exit</div>
          <div style={{ marginTop: '8px', height: '8px', background: '#bfdbfe', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: call > 0 ? '100%' : '0%', background: '#3b82f6', transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ background: mode === 'fb' ? '#fffbeb' : '#f9fafb', border: `1px solid ${mode === 'fb' ? '#fde68a' : '#e5e5e5'}`, borderRadius: '10px', padding: '14px', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: mode === 'fb' ? '#f59e0b' : '#9ca3af', marginBottom: '8px' }}>
            {mode === 'fb' ? '💾 STATIC (Instance DB)' : '🚫 STATIC (None)'}
          </div>
          {mode === 'fb' ? (
            <>
              <div style={{ fontSize: '13px', color: '#374151' }}>Accumulated Total: <strong style={{ color: '#f59e0b' }}>{staticVal}</strong></div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Values persist across subsequent scans!</div>
              <div style={{ marginTop: '8px', height: '8px', background: '#fde68a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, staticVal)}%`, background: '#f59e0b', transition: 'width 0.3s' }} />
              </div>
            </>
          ) : (
            <div style={{ fontSize: '12px', color: '#c4c4c4', marginTop: '4px' }}>FC has no internal static memory</div>
          )}
        </div>
      </div>

      <button onClick={handleCall}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: mode === 'fc' ? '#3b82f6' : '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
        ▶ Execute {mode.toUpperCase()} Call #{call + 1}
      </button>

      <div style={{ marginTop: '12px', fontSize: '13px', color: '#374151', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', borderLeft: `3px solid ${mode === 'fc' ? '#3b82f6' : '#f59e0b'}` }}>
        {mode === 'fc'
          ? '⚡ FC: Stateless calculation block — does not retain variable states between calls.'
          : '🗃️ FB: Stateful block with an Instance DB — retains all static variables across consecutive cycles.'}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L08 — PWM Duty Cycle Visualizer
───────────────────────────────────────────── */
export function PWMVisualizer() {
  const [duty, setDuty] = useState(50);
  const [freq, setFreq] = useState(1000);
  const period = 1000 / freq; // ms

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        ⚙️ PWM — Pulse Width Modulation Visualizer
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Duty Cycle</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444' }}>{duty}%</span>
          </div>
          <input type="range" min={0} max={100} value={duty} onChange={e => setDuty(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Frequency</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6' }}>{freq}Hz</span>
          </div>
          <input type="range" min={100} max={10000} step={100} value={freq} onChange={e => setFreq(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
        </div>
      </div>

      {/* Waveform */}
      <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px', marginBottom: '16px', overflowX: 'auto' }}>
        <svg width="100%" height="80" viewBox="0 0 400 80" style={{ display: 'block' }}>
          {/* Grid lines */}
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={80} stroke="#1e293b" strokeWidth="1" />
          ))}
          <line x1={0} y1={40} x2={400} y2={40} stroke="#1e293b" strokeWidth="1" />

          {/* PWM pulses — show 4 cycles */}
          {[0, 1, 2, 3].map(cycle => {
            const x = cycle * 100;
            const onW = duty;
            const offW = 100 - duty;
            return (
              <g key={cycle}>
                {/* HIGH portion */}
                <rect x={x} y={5} width={onW} height={30} fill="#ef4444" opacity={0.9} rx={2} />
                {/* LOW portion */}
                <rect x={x + onW} y={45} width={offW} height={30} fill="#374151" rx={2} />
                {/* Vertical lines */}
                <line x1={x} y1={5} x2={x} y2={35} stroke="#ef4444" strokeWidth="2" />
                {duty > 0 && <line x1={x + onW} y1={5} x2={x + onW} y2={75} stroke="#ef4444" strokeWidth="2" />}
              </g>
            );
          })}

          {/* Labels */}
          <text x={10} y={25} fill="#ef4444" fontSize="10" fontWeight="bold">HIGH ({duty}%)</text>
          <text x={10} y={65} fill="#9ca3af" fontSize="10">LOW ({100 - duty}%)</text>
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
        {[
          { l: 'ON Time', v: `${(period * duty / 100).toFixed(2)}ms`, c: '#ef4444' },
          { l: 'OFF Time', v: `${(period * (100 - duty) / 100).toFixed(2)}ms`, c: '#6b7280' },
          { l: 'Average Voltage', v: `${(24 * duty / 100).toFixed(1)}V`, c: '#f59e0b' },
        ].map(s => (
          <div key={s.l} style={{ textAlign: 'center', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L10 — PID Response Visualizer
───────────────────────────────────────────── */
export function PIDVisualizer() {
  const [kp, setKp] = useState(2.0);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(0.1);
  const sp = 70;

  // Simulate simple PID response curve
  const points: number[] = [];
  let pv = 20, err = 0, integral = 0, prevErr = 0;
  for (let t = 0; t <= 60; t++) {
    err = sp - pv;
    integral = Math.min(50, integral + err * 0.1);
    const derivative = (err - prevErr) / 0.1;
    const output = Math.min(100, Math.max(0, kp * err + ki * integral + kd * derivative));
    pv = pv + output * 0.08 - (pv - 20) * 0.05;
    pv = Math.min(110, Math.max(0, pv));
    points.push(pv);
    prevErr = err;
  }

  const maxOvershoot = Math.max(...points);
  const settled = points.findIndex((p, i) => i > 20 && Math.abs(p - sp) < 2);

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        🎯 PID Step Response & Parameter Tuning
      </div>

      {/* PID gains */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {[{ l: 'Kp (Proportional)', v: kp, set: setKp, min: 0.1, max: 10, step: 0.1, c: '#3b82f6' },
          { l: 'Ki (Integral)', v: ki, set: setKi, min: 0, max: 5, step: 0.1, c: '#f59e0b' },
          { l: 'Kd (Derivative)', v: kd, set: setKd, min: 0, max: 2, step: 0.05, c: '#ef4444' }
        ].map(g => (
          <div key={g.l}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: g.c }}>{g.l}</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: g.c }}>{g.v.toFixed(2)}</span>
            </div>
            <input type="range" min={g.min} max={g.max} step={g.step} value={g.v}
              onChange={e => g.set(Number(e.target.value))} style={{ width: '100%', accentColor: g.c }} />
          </div>
        ))}
      </div>

      {/* Response curve */}
      <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
        <svg width="100%" height="120" viewBox="0 0 360 120" style={{ display: 'block' }}>
          {/* SP line */}
          <line x1={0} y1={120 - sp} x2={360} y2={120 - sp} stroke="#ffffff22" strokeWidth="1" strokeDasharray="4 4" />
          <text x={364} y={120 - sp + 4} fill="#ffffff44" fontSize="9">SP={sp}</text>

          {/* Response curve */}
          <polyline
            points={points.map((p, i) => `${i * 6},${120 - p}`).join(' ')}
            fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />

          {/* Overshoot marker */}
          {maxOvershoot > sp + 2 && (
            <>
              <circle cx={points.indexOf(maxOvershoot) * 6} cy={120 - maxOvershoot} r={4} fill="#ef4444" />
              <text x={points.indexOf(maxOvershoot) * 6 + 6} y={120 - maxOvershoot} fill="#ef4444" fontSize="9">
                OS={((maxOvershoot - sp) / sp * 100).toFixed(0)}%
              </text>
            </>
          )}

          {/* Settled marker */}
          {settled > 0 && (
            <line x1={settled * 6} y1={0} x2={settled * 6} y2={120} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
          )}
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { l: 'Overshoot', v: maxOvershoot > sp + 1 ? `${((maxOvershoot - sp) / sp * 100).toFixed(1)}%` : 'None', c: maxOvershoot > sp * 1.1 ? '#ef4444' : '#16a34a' },
          { l: 'Settling Time', v: settled > 0 ? `${settled * 0.1}s` : '>6s', c: settled < 30 ? '#16a34a' : '#f59e0b' },
          { l: 'Loop Status', v: Math.abs(points[points.length - 1] - sp) < 2 ? 'Stable ✓' : 'Settling...', c: Math.abs(points[points.length - 1] - sp) < 2 ? '#16a34a' : '#ef4444' },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, minWidth: '80px', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L11 — PROFINET Communication Demo
───────────────────────────────────────────── */
export function ProfinetDemo() {
  const [active, setActive] = useState<number | null>(null);
  const [packets, setPackets] = useState<{ id: number; from: string; to: string }[]>([]);
  const [running, setRunning] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      const routes = [
        { from: 'PLC S7-1200', to: 'HMI KTP700' },
        { from: 'PLC S7-1200', to: 'ET200SP I/O' },
        { from: 'SCADA PC', to: 'PLC S7-1200' },
        { from: 'HMI KTP700', to: 'PLC S7-1200' },
      ];
      const r = routes[Math.floor(Math.random() * routes.length)];
      setPackets(p => [...p.slice(-5), { id: idRef.current++, ...r }]);
    }, 600);
    return () => clearInterval(t);
  }, [running]);

  const devices = [
    { id: 0, label: 'SCADA PC', icon: '🖥️', color: '#8b5cf6', x: 50, y: 10 },
    { id: 1, label: 'PLC S7-1200', icon: '🟦', color: '#1a3a6b', x: 50, y: 45 },
    { id: 2, label: 'HMI KTP700', icon: '📱', color: '#f59e0b', x: 10, y: 80 },
    { id: 3, label: 'ET200SP I/O', icon: '🔌', color: '#16a34a', x: 90, y: 80 },
  ];

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🌐 PROFINET Network — Real-Time IO Simulation
        </span>
        <button onClick={() => setRunning(r => !r)}
          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: running ? '#fee2e2' : '#dcfce7', color: running ? '#dc2626' : '#16a34a', cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
      </div>

      {/* Network diagram */}
      <div style={{ position: 'relative', height: '180px', background: '#fff', borderRadius: '10px', border: '1px solid #e5e5e5', marginBottom: '12px', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Connections */}
          {[[devices[0], devices[1]], [devices[1], devices[2]], [devices[1], devices[3]]].map(([a, b], i) => (
            <line key={i} x1={a.x} y1={a.y + 8} x2={b.x} y2={b.y + 8}
              stroke={running ? '#3b82f6' : '#e5e5e5'} strokeWidth="0.8"
              strokeDasharray={running ? '2 1' : 'none'} />
          ))}
        </svg>
        {devices.map(d => (
          <div key={d.id} onClick={() => setActive(active === d.id ? null : d.id)}
            style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: active === d.id ? d.color : `${d.color}22`, border: `2px solid ${d.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: running ? `0 0 8px ${d.color}55` : 'none', transition: 'all 0.3s' }}>
              {d.icon}
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: d.color, whiteSpace: 'nowrap', background: '#fff', padding: '1px 4px', borderRadius: '4px' }}>{d.label}</span>
          </div>
        ))}
      </div>

      {/* Packet log */}
      <div style={{ background: '#0f172a', borderRadius: '10px', padding: '10px 12px', minHeight: '60px' }}>
        {packets.length === 0 ? (
          <div style={{ color: '#4b5563', fontSize: '12px', textAlign: 'center', paddingTop: '8px' }}>Click ▶ Start to observe cyclic PROFINET real-time data packets</div>
        ) : packets.map(p => (
          <div key={p.id} style={{ fontSize: '11px', color: '#22c55e', fontFamily: 'monospace', marginBottom: '2px' }}>
            [{String(p.id).padStart(4, '0')}] {p.from} → {p.to} <span style={{ color: '#60a5fa' }}>PROFINET cyclic data frame</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L12 — HMI Screen Builder
───────────────────────────────────────────── */
export function HMIScreenBuilder() {
  const [motorOn, setMotorOn] = useState(false);
  const [pump, setPump] = useState(false);
  const [temp, setTemp] = useState(65);
  const [level, setLevel] = useState(72);
  const [showAlarm, setShowAlarm] = useState(false);

  useEffect(() => {
    if (temp > 90) setShowAlarm(true);
    else setShowAlarm(false);
  }, [temp]);

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        🖥️ HMI Simulator — Operator Interface Mockup
      </div>

      {/* HMI Screen */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '3px solid #374151', marginBottom: '12px' }}>
        {/* HMI Title bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #374151' }}>
          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700 }}>PLANT OVERVIEW — Workshop A</span>
          <span style={{ color: '#22c55e', fontSize: '11px' }}>● ONLINE</span>
        </div>

        {/* Alarm banner */}
        {showAlarm && (
          <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fca5a5', fontSize: '12px', fontWeight: 700 }}>⚠️ ALARM: High Temperature Threshold Exceeded — {temp}°C {'>'} 90°C</span>
            <button onClick={() => setShowAlarm(false)} style={{ background: 'none', border: '1px solid #ef4444', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>ACK</button>
          </div>
        )}

        {/* Process values */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px' }}>
            <div style={{ color: '#60a5fa', fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}>🌡️ TEMPERATURE</div>
            <div style={{ color: temp > 90 ? '#ef4444' : '#22c55e', fontSize: '28px', fontWeight: 800 }}>{temp}°C</div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', marginTop: '6px' }}>
              <div style={{ height: '100%', width: `${temp}%`, background: temp > 90 ? '#ef4444' : '#22c55e', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px' }}>
            <div style={{ color: '#60a5fa', fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}>💧 LIQUID LEVEL</div>
            <div style={{ color: level < 20 ? '#ef4444' : '#22c55e', fontSize: '28px', fontWeight: 800 }}>{level}%</div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', marginTop: '6px' }}>
              <div style={{ height: '100%', width: `${level}%`, background: '#3b82f6', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setMotorOn(m => !m)}
            style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', border: `2px solid ${motorOn ? '#22c55e' : '#4b5563'}`, background: motorOn ? '#14532d' : '#1e293b', color: motorOn ? '#22c55e' : '#9ca3af', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {motorOn ? '🟢' : '🔴'} MOTOR
          </button>
          <button onClick={() => setPump(p => !p)}
            style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', border: `2px solid ${pump ? '#22c55e' : '#4b5563'}`, background: pump ? '#14532d' : '#1e293b', color: pump ? '#22c55e' : '#9ca3af', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {pump ? '🟢' : '🔴'} PUMP
          </button>
        </div>
      </div>

      {/* Controls for simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Adjust Temperature ({temp}°C)</div>
          <input type="range" min={20} max={110} value={temp} onChange={e => setTemp(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>Drag slider above 90°C to trigger high alarm</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Liquid Level ({level}%)</div>
          <input type="range" min={0} max={100} value={level} onChange={e => setLevel(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L13 — SCADA Automation Pyramid
───────────────────────────────────────────── */
export function SCADAPyramid() {
  const [selected, setSelected] = useState<number | null>(null);

  const levels = [
    { label: 'ERP / MES', sub: 'SAP, Oracle — Enterprise Management', color: '#8b5cf6', w: 100, icon: '🏢', detail: 'Production scheduling, material resource planning, KPI reporting, and ERP integration via OPC UA and REST APIs.' },
    { label: 'SCADA', sub: 'WinCC, Ignition — Plant-Wide Supervision', color: '#ef4444', w: 80, icon: '📡', detail: 'Centralized supervision, long-term historical trending, alarm management, and multi-station plant dispatching.' },
    { label: 'HMI', sub: 'KTP700, TP1500 — Operator Interface', color: '#f59e0b', w: 60, icon: '🖥️', detail: 'Local touchscreen panel for machine control, parameter adjustment, manual override, and immediate fault visualization.' },
    { label: 'PLC / DCS', sub: 'S7-1200 / S7-1500 — Real-Time Control', color: '#3b82f6', w: 70, icon: '🟦', detail: 'Deterministic cyclic execution of interlocks, PID loops, motion commands, and I/O image updates.' },
    { label: 'Field Devices', sub: 'Sensors, Motors, Valves — Physical Layer', color: '#16a34a', w: 100, icon: '⚙️', detail: 'Physical instrumentation (RTDs, pressure transmitters, flowmeters) and prime movers (motors, VFDs, pneumatic valves).' },
  ];

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        📡 Automation Hierarchy Pyramid (ISA-95) — Click to Inspect
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
        {levels.map((lv, i) => (
          <button key={i} onClick={() => setSelected(selected === i ? null : i)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '8px', border: `2px solid ${selected === i ? lv.color : 'transparent'}`, background: selected === i ? `${lv.color}15` : '#fff', cursor: 'pointer', width: `${lv.w}%`, margin: '0 auto', transition: 'all 0.2s', boxShadow: selected === i ? `0 0 0 3px ${lv.color}33` : '0 1px 3px #0001' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{lv.icon}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: lv.color }}>{lv.label}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>{lv.sub}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: selected === i ? lv.color : '#e5e5e5', flexShrink: 0 }} />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div style={{ background: `${levels[selected].color}10`, border: `1px solid ${levels[selected].color}33`, borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
          <strong style={{ color: levels[selected].color }}>{levels[selected].icon} {levels[selected].label}</strong><br />
          {levels[selected].detail}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   L14 — Diagnostic LED Panel
───────────────────────────────────────────── */
export function DiagnosticPanel() {
  const [scenario, setScenario] = useState(0);

  const scenarios = [
    { label: 'Normal CPU Run Mode', leds: [
      { name: 'RUN/STOP', color: '#16a34a', label: 'RUN — Solid Green' },
      { name: 'ERROR', color: '#e5e5e5', label: 'No Fault (Off)' },
      { name: 'MAINT', color: '#e5e5e5', label: 'No Maintenance (Off)' },
      { name: 'LINK', color: '#16a34a', label: 'PROFINET Connected' },
    ], desc: 'CPU is executing OB1 cyclic program normally without errors. All diagnostic checks healthy.' },
    { label: 'CPU Stop Mode', leds: [
      { name: 'RUN/STOP', color: '#f59e0b', label: 'STOP — Solid Amber' },
      { name: 'ERROR', color: '#e5e5e5', label: 'No Fault (Off)' },
      { name: 'MAINT', color: '#e5e5e5', label: 'No Maintenance (Off)' },
      { name: 'LINK', color: '#16a34a', label: 'PROFINET OK' },
    ], desc: 'CPU is in STOP mode. User program is not running. Outputs are held in safe configured state.' },
    { label: 'Program / Memory Error', leds: [
      { name: 'RUN/STOP', color: '#ef4444', label: 'FAULT — Flashing Red' },
      { name: 'ERROR', color: '#ef4444', label: 'ERROR — Solid Red' },
      { name: 'MAINT', color: '#e5e5e5', label: 'No Maintenance' },
      { name: 'LINK', color: '#16a34a', label: 'PROFINET OK' },
    ], desc: 'Fatal program execution fault (e.g., division by zero, cycle timeout, memory out-of-bounds). Review Diagnostic Buffer.' },
    { label: 'Network Disconnection', leds: [
      { name: 'RUN/STOP', color: '#16a34a', label: 'RUN — Solid Green' },
      { name: 'ERROR', color: '#e5e5e5', label: 'No Fault (Off)' },
      { name: 'MAINT', color: '#f59e0b', label: 'MAINT — Attention Needed' },
      { name: 'LINK', color: '#ef4444', label: 'LINK — Disconnected (Red)' },
    ], desc: 'CPU is running but PROFINET link to distributed IO or HMI is lost. Inspect network patch cables and switch ports.' },
  ];

  const sc = scenarios[scenario];

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        🔍 S7-1200 CPU Status LEDs & Fault Diagnostics
      </div>

      {/* Scenario selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => setScenario(i)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: `1px solid ${i === scenario ? '#1a3a6b' : '#e5e5e5'}`, background: i === scenario ? '#f0f4ff' : '#fff', color: i === scenario ? '#1a3a6b' : '#374151', fontWeight: i === scenario ? 700 : 400, cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* LED panel */}
      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '12px' }}>
        {sc.leds.map((led, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: led.color, boxShadow: led.color !== '#e5e5e5' ? `0 0 10px ${led.color}` : 'none', transition: 'all 0.3s' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{led.name}</span>
          </div>
        ))}
      </div>

      {/* LED meanings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
        {sc.leds.map((led, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: led.color, flexShrink: 0, boxShadow: led.color !== '#e5e5e5' ? `0 0 4px ${led.color}` : 'none' }} />
            <span style={{ fontWeight: 600, color: '#374151', minWidth: '60px' }}>{led.name}:</span>
            <span style={{ color: '#6b7280' }}>{led.label}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '13px', color: '#374151', padding: '12px 14px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '3px solid #3b82f6', lineHeight: 1.7 }}>
        🔎 {sc.desc}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L15 — System Architecture Builder
───────────────────────────────────────────── */
export function CapstoneArchitecture() {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (id: string) => setChecked(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);

  const components = [
    { id: 'plc', label: 'PLC S7-1200', icon: '🟦', color: '#1a3a6b', required: true },
    { id: 'hmi', label: 'HMI KTP700', icon: '🖥️', color: '#f59e0b', required: true },
    { id: 'di', label: 'DI Sensors', icon: '📥', color: '#3b82f6', required: true },
    { id: 'do', label: 'DO Actuators', icon: '📤', color: '#ef4444', required: true },
    { id: 'ai', label: 'AI Sensors (4–20mA)', icon: '📊', color: '#16a34a', required: false },
    { id: 'ao', label: 'AO — VFD Inverter (0–10V)', icon: '🎛️', color: '#8b5cf6', required: false },
    { id: 'scada', label: 'SCADA Host PC', icon: '📡', color: '#0891b2', required: false },
    { id: 'safety', label: 'Emergency Stop (E-Stop)', icon: '🔴', color: '#dc2626', required: false },
  ];

  const score = checked.length;
  const hasAll = components.filter(c => c.required).every(c => checked.includes(c.id));

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
        🏆 Capstone — System Architecture Designer
      </div>

      <p style={{ fontSize: '13px', color: '#374151', marginBottom: '16px' }}>
        Select the components required for your automation project. Mandatory (✔) components are critical for core system operation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {components.map(c => {
          const on = checked.includes(c.id);
          return (
            <button key={c.id} onClick={() => toggle(c.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: `2px solid ${on ? c.color : '#e5e5e5'}`, background: on ? `${c.color}12` : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: on ? `0 0 0 3px ${c.color}22` : 'none' }}>
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: on ? c.color : '#374151' }}>{c.label}</div>
                {c.required && <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>Mandatory ✔</div>}
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '4px', border: `2px solid ${on ? c.color : '#d1d5db'}`, background: on ? c.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                {on && <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1 }}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Score */}
      <div style={{ padding: '14px 16px', background: hasAll ? '#f0fdf4' : '#fff7ed', border: `1px solid ${hasAll ? '#bbf7d0' : '#fed7aa'}`, borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '14px', color: hasAll ? '#15803d' : '#c2410c' }}>
            {hasAll ? '✅ All mandatory architecture components selected!' : '⚠️ Missing mandatory components'}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#374151' }}>{score} / {components.length} components</span>
        </div>
        {score >= 6 && <div style={{ marginTop: '6px', fontSize: '13px', color: '#16a34a' }}>🎉 Complete functional architecture! Ready for commissioning.</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L01 — PLC Scan Cycle Animation
───────────────────────────────────────────── */
export function ScanCycleAnimation() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);

  const steps = [
    { label: 'Read Inputs', sub: 'The CPU copies every DI and AI into the process image (PII)', color: '#3b82f6', icon: '📥' },
    { label: 'Execute Program', sub: 'The CPU executes each network of OB1 cyclically', color: '#16a34a', icon: '⚙️' },
    { label: 'Housekeeping', sub: 'The CPU performs diagnostic checks and services communication', color: '#f59e0b', icon: '🔍' },
    { label: 'Write Outputs', sub: 'The CPU transfers PIQ states to physical DO and AO modules', color: '#ef4444', icon: '📤' },
  ];

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setActive(a => (a + 1) % steps.length), 1000);
    return () => clearInterval(t);
  }, [running, steps.length]);

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎬 PLC Scan Cycle — Simulation</span>
        <button onClick={() => setRunning(r => !r)} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: running ? '#fee2e2' : '#dcfce7', color: running ? '#dc2626' : '#16a34a', cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
      <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 20px' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontSize: '28px' }}>🖥️</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#737373' }}>CPU</div>
        </div>
        {steps.map((step, i) => {
          const angle = (i / steps.length) * 2 * Math.PI - Math.PI / 2;
          const r = 88; const x = 110 + r * Math.cos(angle); const y = 110 + r * Math.sin(angle);
          const isActive = active === i;
          return (
            <div key={i} onClick={() => { setRunning(false); setActive(i); }} style={{ position: 'absolute', left: x - 32, top: y - 32, width: 64, height: 64, borderRadius: '50%', background: isActive ? step.color : '#fff', border: `2px solid ${isActive ? step.color : '#e5e5e5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', cursor: 'pointer', transition: 'all 0.35s ease', boxShadow: isActive ? `0 0 0 4px ${step.color}33` : 'none', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
              {step.icon}
            </div>
          );
        })}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="220" height="220">
          <circle cx="110" cy="110" r="65" fill="none" stroke="#e5e5e5" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>
      <div style={{ background: `${steps[active].color}11`, border: `1px solid ${steps[active].color}33`, borderRadius: '10px', padding: '14px 16px', transition: 'all 0.3s ease' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: steps[active].color, marginBottom: '4px' }}>Step {active + 1} · {steps[active].label}</div>
        <div style={{ fontSize: '13px', color: '#525252' }}>{steps[active].sub}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        {steps.map((s, i) => (<div key={i} onClick={() => { setRunning(false); setActive(i); }} style={{ width: 8, height: 8, borderRadius: '50%', background: active === i ? s.color : '#e5e5e5', cursor: 'pointer', transition: 'background 0.3s' }} />))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L04 — Start-Stop Ladder Logic
───────────────────────────────────────────── */
export function StartStopAnimation() {
  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [motor, setMotor] = useState(false);

  const handleStart = () => { setStartPressed(true); setMotor(true); setTimeout(() => setStartPressed(false), 300); };
  const handleStop  = () => { setStopPressed(true); setMotor(false); setTimeout(() => setStopPressed(false), 300); };

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>🪜 Start-Stop Motor Control — Interactive LAD</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '20px', marginBottom: '16px', overflowX: 'auto' }}>
        <div style={{ width: 6, height: 80, background: '#374151', borderRadius: '3px', flexShrink: 0 }} />
        <div style={{ height: 3, background: '#374151', flex: 1, minWidth: 12 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: startPressed ? '#3b82f6' : '#374151' }}>I0.0 START</span>
          <div style={{ width: 36, height: 36, border: `2.5px solid ${startPressed ? '#3b82f6' : '#374151'}`, borderRadius: '4px', background: startPressed ? '#dbeafe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <div style={{ width: 20, height: 2.5, background: startPressed ? '#3b82f6' : '#374151', borderRadius: '1px' }} />
          </div>
        </div>
        <div style={{ height: 3, background: motor ? '#3b82f6' : '#374151', flex: 1, minWidth: 8, transition: 'background 0.3s' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: motor ? '#16a34a' : '#9ca3af' }}>Q0.0 HOLD</span>
          <div style={{ width: 36, height: 36, border: `2.5px solid ${motor ? '#16a34a' : '#d1d5db'}`, borderRadius: '4px', background: motor ? '#dcfce7' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
            <div style={{ width: 20, height: 2.5, background: motor ? '#16a34a' : '#d1d5db', borderRadius: '1px', transition: 'background 0.3s' }} />
          </div>
        </div>
        <div style={{ height: 3, background: motor && !stopPressed ? '#3b82f6' : '#374151', flex: 1, minWidth: 8, transition: 'background 0.3s' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: stopPressed ? '#ef4444' : '#374151' }}>I0.1 STOP</span>
          <div style={{ width: 36, height: 36, border: `2.5px solid ${stopPressed ? '#ef4444' : '#374151'}`, borderRadius: '4px', background: stopPressed ? '#fee2e2' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', position: 'relative' }}>
            <div style={{ width: 20, height: 2.5, background: stopPressed ? '#ef4444' : '#374151', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', width: 28, height: 2, background: stopPressed ? '#ef4444' : '#374151', transform: 'rotate(-45deg)', opacity: 0.6 }} />
          </div>
        </div>
        <div style={{ height: 3, background: motor && !stopPressed ? '#3b82f6' : '#374151', flex: 1, minWidth: 12, transition: 'background 0.3s' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: motor ? '#16a34a' : '#374151' }}>Q0.0 MOTOR</span>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2.5px solid ${motor ? '#16a34a' : '#374151'}`, background: motor ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: motor ? '0 0 10px #16a34a55' : 'none' }}>
            <span style={{ fontSize: '14px', color: '#fff' }}>{motor ? '✓' : ''}</span>
          </div>
        </div>
        <div style={{ height: 3, background: '#374151', flex: 1, minWidth: 12 }} />
        <div style={{ width: 6, height: 80, background: '#374151', borderRadius: '3px', flexShrink: 0 }} />
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
        <button onMouseDown={handleStart} style={{ padding: '10px 24px', borderRadius: '8px', border: '2px solid #3b82f6', background: startPressed ? '#3b82f6' : '#eff6ff', color: startPressed ? '#fff' : '#3b82f6', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}>▶ START (I0.0)</button>
        <button onMouseDown={handleStop}  style={{ padding: '10px 24px', borderRadius: '8px', border: '2px solid #ef4444', background: stopPressed  ? '#ef4444' : '#fff1f2', color: stopPressed  ? '#fff' : '#ef4444', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}>■ STOP (I0.1)</button>
      </div>
      <div style={{ textAlign: 'center', padding: '12px', background: motor ? '#f0fdf4' : '#fafafa', border: `1px solid ${motor ? '#bbf7d0' : '#e5e5e5'}`, borderRadius: '8px', transition: 'all 0.3s' }}>
        <span style={{ fontSize: '24px' }}>{motor ? '🟢' : '🔴'}</span>
        <span style={{ marginLeft: '10px', fontWeight: 700, fontSize: '14px', color: motor ? '#16a34a' : '#ef4444' }}>MOTOR: {motor ? 'RUNNING (Q0.0 = 1)' : 'STOPPED (Q0.0 = 0)'}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L05 — Timer TON Animation
───────────────────────────────────────────── */
export function TimerTONAnimation() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const TOTAL = 40; const PT = 30;

  useEffect(() => {
    if (!running) return;
    if (tick >= TOTAL) { setRunning(false); return; }
    const t = setInterval(() => setTick(p => p + 1), 80);
    return () => clearInterval(t);
  }, [running, tick]);

  const inOn = tick >= 5 && tick <= TOTAL;
  const qOn  = tick > PT && tick <= TOTAL;
  const et   = Math.max(0, Math.min(tick - 5, PT));
  const etPct = Math.max(0, Math.min(100, ((tick - 5) / PT) * 100));

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>⏱️ TON On-Delay Timer — Simulation</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setTick(0); setRunning(true); }} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #dcfce7', background: '#dcfce7', color: '#16a34a', cursor: 'pointer', fontWeight: 600 }}>▶ Run Test</button>
          <button onClick={() => { setTick(0); setRunning(false); }} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', color: '#737373', cursor: 'pointer', fontWeight: 600 }}>↺ Reset</button>
        </div>
      </div>
      {[{ l: 'IN', v: inOn, c: '#3b82f6', bg: '#f0f9ff', bc: '#bfdbfe' }, { l: 'ET', pct: etPct, label: et > 0 ? `${et * 80}ms / PT=${PT * 80}ms` : 'Waiting for IN=1', c: '#f59e0b', bg: '#fffbeb', bc: '#fde68a' }, { l: 'Q', v: qOn, c: '#16a34a', bg: '#f0fdf4', bc: '#bbf7d0' }].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: s.c, minWidth: '28px' }}>{s.l}</span>
          <div style={{ flex: 1, height: '36px', background: s.bg, borderRadius: '6px', border: `1px solid ${s.bc}`, position: 'relative', overflow: 'hidden' }}>
            {'pct' in s
              ? <><div style={{ position: 'absolute', bottom: 0, left: 0, height: '100%', width: `${s.pct}%`, background: `linear-gradient(90deg,${s.bc},${s.c})`, borderRadius: '4px', transition: 'width 0.08s linear' }} /><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '10px', fontSize: '11px', fontWeight: 700, color: '#92400e' }}>{s.label}</div></>
              : <div style={{ position: 'absolute', bottom: 0, left: 0, height: s.v ? '100%' : '8px', width: `${(tick / TOTAL) * 100}%`, background: s.c, borderRadius: '4px', transition: 'height 0.1s ease' }} />
            }
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'pct' in s ? s.bg : s.v ? s.c : '#f0f0f0', color: 'pct' in s ? s.c : s.v ? '#fff' : '#aaa', minWidth: '44px', textAlign: 'center' }}>
            {'pct' in s ? `${Math.round(s.pct!)}%` : s.v ? '1' : '0'}
          </div>
        </div>
      ))}
      <div style={{ background: qOn ? '#f0fdf4' : inOn ? '#fffbeb' : '#f8f9fa', border: `1px solid ${qOn ? '#bbf7d0' : inOn ? '#fde68a' : '#e5e5e5'}`, borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
        {tick === 0 && '⏳ Click "Run Test" to simulate TON timer'}
        {tick > 0 && !inOn && '⏳ IN = 0 — Timer input de-energized'}
        {inOn && !qOn && `⏱️ IN = 1 — Timing: ET = ${et * 80}ms, ${(PT - et) * 80}ms remaining...`}
        {qOn && '✅ ET ≥ PT → Q = 1 — Output contact energized!'}
        {tick === TOTAL && ' (Completed)'}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   L09 — NORM_X / SCALE_X Calculator
───────────────────────────────────────────── */
export function AnalogScaleAnimation() {
  const [raw, setRaw] = useState(13824);
  const norm = raw / 27648;
  const temp = -50 + norm * 200;
  const pct  = norm * 100;

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>🌡️ NORM_X / SCALE_X — Interactive Calculator</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Raw AI Value (AIW64)</span>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a3a6b' }}>{raw}</span>
      </div>
      <input type="range" min={0} max={27648} value={raw} onChange={e => setRaw(Number(e.target.value))} style={{ width: '100%', accentColor: '#1a3a6b', marginBottom: '16px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[{ l: 'Raw Input', v: String(raw), c: '#1d4ed8', bg: '#eff6ff' }, { l: 'NORM_X', v: norm.toFixed(4), c: '#b45309', bg: '#fffbeb' }, { l: 'Temperature (°C)', v: `${temp.toFixed(1)}°C`, c: '#15803d', bg: '#f0fdf4' }].map((s, i, arr) => (
          <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '90px' }}>
            <div style={{ padding: '10px 14px', background: s.bg, borderRadius: '8px', textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '11px', color: s.c, fontWeight: 600, marginBottom: '4px' }}>{s.l}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: s.c }}>{s.v}</div>
            </div>
            {i < arr.length - 1 && <span style={{ fontSize: '20px', color: '#9ca3af' }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{ flex: 1, height: '24px', background: '#f0f0f0', borderRadius: '99px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `hsl(${200 - pct * 1.4}, 80%, 50%)`, borderRadius: '99px', transition: 'width 0.1s linear' }} />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '50px' }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px', padding: '10px 14px', fontFamily: 'monospace' }}>
        PT100 [−50°C→150°C] | Raw [0→27648]<br/>
        {temp.toFixed(1)}°C = −50 + {norm.toFixed(3)} × (150 − (−50))
      </div>
    </div>
  );
}

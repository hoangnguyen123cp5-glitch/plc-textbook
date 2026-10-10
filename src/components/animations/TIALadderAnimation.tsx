'use client';

import { useState } from 'react';

/* ─── Color scheme: LIGHT / sáng ─── */
const C = {
  bg: '#f8faff',
  network: '#ffffff',
  border: '#93c5fd',
  borderDash: '#60a5fa',
  rail: '#1d4ed8',
  railGlow: '#3b82f655',
  wire: '#1d4ed8',
  wireOff: '#cbd5e1',
  contactStroke: '#1e40af',
  contactActiveStroke: '#1d4ed8',
  contactActiveFill: '#dbeafe',
  ncStroke: '#64748b',
  ncActiveFill: '#fee2e2',
  ncActiveStroke: '#ef4444',
  coilStroke: '#15803d',
  coilActiveFill: '#dcfce7',
  coilOffStroke: '#94a3b8',
  coilOffFill: '#f8fafc',
  label: '#334155',
  labelActive: '#1e40af',
  labelNC: '#374151',
  labelNCActive: '#b91c1c',
  addr: '#3b82f6',
  addrActive: '#1d4ed8',
  addrNC: '#6b7280',
  comment: '#94a3b8',
  networkNum: '#475569',
  tagBg: '#f1f5f9',
  tagBorder: '#e2e8f0',
  tagActive: '#eff6ff',
  tagActiveBorder: '#93c5fd',
  titleBg: '#eff6ff',
  titleBorder: '#bfdbfe',
};

/* ── Contact NO ── */
function ContactNO({ label, addr, active, onClick }: { label?: string; addr: string; active: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} title={`${label} (${addr})`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: onClick ? 'pointer' : 'default', userSelect: 'none', transition: 'transform 0.1s', transform: active ? 'scale(1.05)' : 'scale(1)' }}>
      <div style={{ fontSize: '9px', fontWeight: 700, color: active ? C.labelActive : C.label, fontFamily: 'monospace', marginBottom: '2px', letterSpacing: '0.02em' }}>
        {label}
      </div>
      <svg width="48" height="24" viewBox="0 0 48 24">
        <line x1="0" y1="12" x2="14" y2="12" stroke={active ? C.wire : C.wireOff} strokeWidth="2" />
        <rect x="14" y="4" width="2" height="16" fill={active ? C.contactActiveStroke : C.contactStroke} rx="1" />
        {active && <rect x="14" y="4" width="20" height="16" fill={C.contactActiveFill} rx="2" />}
        <rect x="32" y="4" width="2" height="16" fill={active ? C.contactActiveStroke : C.contactStroke} rx="1" />
        <line x1="34" y1="12" x2="48" y2="12" stroke={active ? C.wire : C.wireOff} strokeWidth="2" />
      </svg>
      <div style={{ fontSize: '8px', color: active ? C.addrActive : C.addr, fontFamily: 'monospace', fontWeight: 600 }}>{addr}</div>
    </div>
  );
}

/* ── Contact NC ── */
function ContactNC({ label, addr, active, onClick }: { label?: string; addr: string; active: boolean; onClick?: () => void }) {
  const passing = !active; // NC passes when NOT active
  return (
    <div onClick={onClick} title={`${label} NC (${addr})`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}>
      <div style={{ fontSize: '9px', fontWeight: 700, color: active ? C.labelNCActive : C.labelNC, fontFamily: 'monospace', marginBottom: '2px' }}>
        {label}
      </div>
      <svg width="48" height="24" viewBox="0 0 48 24">
        <line x1="0" y1="12" x2="14" y2="12" stroke={passing ? C.wire : C.wireOff} strokeWidth="2" />
        {active && <rect x="14" y="4" width="20" height="16" fill={C.ncActiveFill} rx="2" />}
        <rect x="14" y="4" width="2" height="16" fill={active ? C.ncActiveStroke : C.ncStroke} rx="1" />
        {/* NC slash */}
        <line x1="14" y1="20" x2="34" y2="4" stroke={active ? C.ncActiveStroke : C.ncStroke} strokeWidth="1.5" />
        <rect x="32" y="4" width="2" height="16" fill={active ? C.ncActiveStroke : C.ncStroke} rx="1" />
        <line x1="34" y1="12" x2="48" y2="12" stroke={passing ? C.wire : C.wireOff} strokeWidth="2" />
      </svg>
      <div style={{ fontSize: '8px', color: active ? '#ef4444' : C.addrNC, fontFamily: 'monospace', fontWeight: 600 }}>{addr}</div>
    </div>
  );
}

/* ── Output Coil ── */
function Coil({ label, addr, active }: { label?: string; addr: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <div style={{ fontSize: '9px', fontWeight: 700, color: active ? C.coilStroke : C.label, fontFamily: 'monospace', marginBottom: '2px' }}>
        {label}
      </div>
      <svg width="48" height="24" viewBox="0 0 48 24">
        <line x1="0" y1="12" x2="10" y2="12" stroke={active ? C.wire : C.wireOff} strokeWidth="2" />
        <ellipse cx="24" cy="12" rx="14" ry="9" fill={active ? C.coilActiveFill : C.coilOffFill} stroke={active ? C.coilStroke : C.coilOffStroke} strokeWidth="2" />
        {active && <ellipse cx="24" cy="12" rx="5" ry="4" fill={`${C.coilStroke}44`} />}
        <line x1="38" y1="12" x2="48" y2="12" stroke={active ? C.wire : C.wireOff} strokeWidth="2" />
      </svg>
      <div style={{ fontSize: '8px', color: active ? C.coilStroke : C.addrNC, fontFamily: 'monospace', fontWeight: 600 }}>{addr}</div>
    </div>
  );
}

/* ── Power Rail ── */
function Rail() {
  return <div style={{ width: '5px', background: C.rail, borderRadius: '3px', flexShrink: 0, boxShadow: `0 0 6px ${C.railGlow}` }} />;
}

/* ── Horizontal wire ── */
function Wire({ active, width = 'auto' }: { active: boolean; width?: string | number }) {
  return (
    <div style={{ flex: width === 'auto' ? 1 : undefined, width: width !== 'auto' ? width : undefined, height: '24px', display: 'flex', alignItems: 'center', minWidth: 8 }}>
      <div style={{ width: '100%', height: '2px', background: active ? C.wire : C.wireOff, borderRadius: '1px', transition: 'background 0.2s' }} />
    </div>
  );
}

/* ── Network block ── */
function Network({ num, comment, children }: { num: string; comment: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', paddingLeft: '2px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: 'monospace', background: C.rail, padding: '2px 8px', borderRadius: '4px' }}>
          {num}
        </div>
        <span style={{ fontSize: '11px', color: C.comment, fontStyle: 'italic', fontFamily: 'monospace' }}>// {comment}</span>
      </div>
      <div style={{ border: `1.5px dashed ${C.borderDash}`, borderRadius: '8px', background: C.network, display: 'flex', alignItems: 'stretch', minHeight: '64px', boxShadow: '0 1px 4px #3b82f611' }}>
        <Rail />
        <div style={{ flex: 1, padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {children}
        </div>
        <Rail />
      </div>
    </div>
  );
}

/* ── Single rung ── */
function Rung({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: '54px' }}>
      <div style={{ width: 10, height: 2, background: active ? C.wire : C.wireOff, flexShrink: 0 }} />
      {children}
      <div style={{ flex: 1, height: 2, background: active ? C.wire : C.wireOff }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN: Start-Stop Motor Control
   Light mode — style TIA Portal trắng
══════════════════════════════════════════ */
export default function TIALadderAnimation() {
  const [startPB, setStartPB] = useState(false);
  const [stopPB, setStopPB]   = useState(false);
  const [motor, setMotor]     = useState(false);

  const startContact = startPB;
  const holdContact  = motor;
  const stopNC       = !stopPB;          // NC: passes when stopPB NOT pressed
  const rung1        = (startContact || holdContact) && stopNC;

  if (rung1 !== motor) setMotor(rung1);

  const handleStart = () => { setStartPB(true); setTimeout(() => setStartPB(false), 400); };
  const handleStop  = () => { setStopPB(true);  setTimeout(() => setStopPB(false),  400); };

  return (
    <div style={{ background: C.bg, borderRadius: '14px', padding: '18px', border: `1.5px solid ${C.titleBorder}`, fontFamily: 'monospace' }}>

      {/* Title bar */}
      <div style={{ background: C.titleBg, border: `1px solid ${C.titleBorder}`, borderRadius: '8px', padding: '8px 14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: motor ? '#16a34a' : '#dc2626', boxShadow: motor ? '0 0 8px #16a34a99' : '0 0 8px #dc262699' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>LAD — Motor_Control [OB1]</span>
        </div>
        <span style={{ fontSize: '10px', color: '#64748b' }}>CPU 1214C DC/DC/DC</span>
      </div>

      {/* Network 1 */}
      <Network num="Network 1" comment="Motor START-STOP với self-hold">
        <Rung active={rung1}>
          {/* Parallel branch: START || Self-hold */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {/* Top: START button */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ContactNO label="Start_PB" addr="%I0.0" active={startContact} />
            </div>
            {/* Branch join vertical line */}
            <svg width="48" height="12" style={{ margin: '0 auto' }}>
              <line x1="24" y1="0" x2="24" y2="12" stroke={C.borderDash} strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            {/* Bottom: Self-hold */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ContactNO label="Motor_Q" addr="%Q0.0" active={holdContact} />
            </div>
          </div>

          <Wire active={rung1} width={16} />

          {/* STOP (NC) */}
          <ContactNC label="Stop_PB" addr="%I0.1" active={stopPB} />

          <Wire active={rung1} />

          {/* Output coil */}
          <Coil label="Motor_Q" addr="%Q0.0" active={motor} />
        </Rung>
      </Network>

      {/* Network 2 */}
      <Network num="Network 2" comment="Đèn báo chạy">
        <Rung active={motor}>
          <ContactNO label="Motor_Q" addr="%Q0.0" active={motor} />
          <Wire active={motor} />
          <Coil label="Run_Lamp" addr="%Q0.1" active={motor} />
        </Rung>
      </Network>

      {/* Controls + Monitor */}
      <div style={{ borderTop: `1.5px dashed ${C.border}`, paddingTop: '14px', marginTop: '4px' }}>
        <div style={{ fontSize: '10px', color: C.comment, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Simulate I/O
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Buttons */}
          <button onMouseDown={handleStart}
            style={{ padding: '9px 20px', borderRadius: '8px', border: `2px solid ${startPB ? '#16a34a' : '#bbf7d0'}`, background: startPB ? '#dcfce7' : '#f0fdf4', color: startPB ? '#15803d' : '#16a34a', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.15s', boxShadow: startPB ? '0 2px 8px #16a34a33' : 'none' }}>
            ▶ START
          </button>
          <button onMouseDown={handleStop}
            style={{ padding: '9px 20px', borderRadius: '8px', border: `2px solid ${stopPB ? '#dc2626' : '#fecaca'}`, background: stopPB ? '#fee2e2' : '#fff1f2', color: stopPB ? '#b91c1c' : '#dc2626', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.15s', boxShadow: stopPB ? '0 2px 8px #ef444433' : 'none' }}>
            ■ STOP
          </button>

          {/* Tag Monitor */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { addr: '%I0.0', label: 'Start_PB', val: startPB },
              { addr: '%I0.1', label: 'Stop_PB',  val: !stopPB },
              { addr: '%Q0.0', label: 'Motor_Q',  val: motor },
              { addr: '%Q0.1', label: 'Run_Lamp', val: motor },
            ].map(t => (
              <div key={t.addr} style={{ padding: '6px 10px', background: t.val ? C.tagActive : C.tagBg, border: `1px solid ${t.val ? C.tagActiveBorder : C.tagBorder}`, borderRadius: '6px', textAlign: 'center', minWidth: '56px', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '8px', color: t.val ? '#1d4ed8' : '#64748b', fontFamily: 'monospace', fontWeight: 700 }}>{t.addr}</div>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '2px' }}>{t.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: t.val ? '#16a34a' : '#ef4444', lineHeight: 1 }}>{t.val ? '1' : '0'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

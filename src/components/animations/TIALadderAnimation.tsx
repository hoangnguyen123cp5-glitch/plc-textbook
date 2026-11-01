'use client';

import { useState, useEffect } from 'react';

/* ─── Color scheme: LIGHT / TIA Portal style ─── */
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
  coilStroke: '#15803d',
  coilActiveFill: '#dcfce7',
  coilOffStroke: '#94a3b8',
  coilOffFill: '#f8fafc',
  label: '#334155',
  labelActive: '#1e40af',
  addr: '#3b82f6',
  addrActive: '#1d4ed8',
  addrOff: '#64748b',
  comment: '#64748b',
  networkNum: '#475569',
  tagBg: '#f1f5f9',
  tagBorder: '#e2e8f0',
  tagActive: '#eff6ff',
  tagActiveBorder: '#93c5fd',
  titleBg: '#eff6ff',
  titleBorder: '#bfdbfe',
};

/* ── Contact NO ── */
function ContactNO({
  label,
  addr,
  active,
  wireLeftActive,
  wireRightActive,
  onClick,
}: {
  label?: string;
  addr: string;
  active: boolean;
  wireLeftActive?: boolean;
  wireRightActive?: boolean;
  onClick?: () => void;
}) {
  const leftOn = wireLeftActive !== undefined ? wireLeftActive : active;
  const rightOn = wireRightActive !== undefined ? wireRightActive : active;
  return (
    <div
      onClick={onClick}
      title={`${label} (${addr})`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: active ? C.labelActive : C.label,
          fontFamily: 'monospace',
          marginBottom: '2px',
          letterSpacing: '0.02em',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
      <svg width="56" height="24" viewBox="0 0 56 24" style={{ display: 'block' }}>
        <line x1="0" y1="12" x2="17" y2="12" stroke={leftOn ? C.wire : C.wireOff} strokeWidth="2" />
        {active && <rect x="17" y="4" width="22" height="16" fill={C.contactActiveFill} rx="2" />}
        <rect x="17" y="4" width="2.5" height="16" fill={active ? C.contactActiveStroke : C.contactStroke} rx="1" />
        <rect x="36.5" y="4" width="2.5" height="16" fill={active ? C.contactActiveStroke : C.contactStroke} rx="1" />
        <line x1="39" y1="12" x2="56" y2="12" stroke={rightOn ? C.wire : C.wireOff} strokeWidth="2" />
      </svg>
      <div
        style={{
          fontSize: '10px',
          color: active ? C.addrActive : C.addr,
          fontFamily: 'monospace',
          fontWeight: 600,
          lineHeight: 1.2,
          marginTop: '1px',
        }}
      >
        {addr}
      </div>
    </div>
  );
}

/* ── Output Coil (flush against right power rail) ── */
function Coil({ label, addr, active }: { label?: string; addr: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', flexShrink: 0 }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: active ? C.coilStroke : C.label,
          fontFamily: 'monospace',
          marginBottom: '2px',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
      <svg width="56" height="24" viewBox="0 0 56 24" style={{ display: 'block' }}>
        <line x1="0" y1="12" x2="14" y2="12" stroke={active ? C.wire : C.wireOff} strokeWidth="2" />
        <ellipse
          cx="28"
          cy="12"
          rx="14"
          ry="9"
          fill={active ? C.coilActiveFill : C.coilOffFill}
          stroke={active ? C.coilStroke : C.coilOffStroke}
          strokeWidth="2"
        />
        {active && <ellipse cx="28" cy="12" rx="5" ry="4" fill={`${C.coilStroke}44`} />}
        <line x1="42" y1="12" x2="56" y2="12" stroke={active ? C.wire : C.wireOff} strokeWidth="2" />
      </svg>
      <div
        style={{
          fontSize: '10px',
          color: active ? C.coilStroke : C.addrOff,
          fontFamily: 'monospace',
          fontWeight: 600,
          lineHeight: 1.2,
          marginTop: '1px',
        }}
      >
        {addr}
      </div>
    </div>
  );
}

/* ── Power Rail ── */
function Rail() {
  return (
    <div
      style={{
        width: '5px',
        background: C.rail,
        borderRadius: '3px',
        flexShrink: 0,
        boxShadow: `0 0 6px ${C.railGlow}`,
      }}
    />
  );
}

/* ── Horizontal wire segment aligned with SVG y=12 center ── */
function Wire({ active, width = 'auto' }: { active: boolean; width?: string | number }) {
  return (
    <div
      style={{
        flex: width === 'auto' ? 1 : undefined,
        width: width !== 'auto' ? width : undefined,
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        minWidth: 10,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '2px',
          background: active ? C.wire : C.wireOff,
          transition: 'background 0.15s',
        }}
      />
    </div>
  );
}

/* ── Network block with Left & Right Power Rails ── */
function Network({
  num,
  comment,
  note,
  children,
}: {
  num: string;
  comment: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', paddingLeft: '2px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'monospace',
            background: C.rail,
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {num}
        </div>
        <span style={{ fontSize: '11px', color: C.comment, fontStyle: 'italic', fontFamily: 'monospace' }}>
          {`// ${comment}`}
        </span>
      </div>
      <div
        style={{
          border: `1.5px dashed ${C.borderDash}`,
          borderRadius: '8px',
          background: C.network,
          display: 'flex',
          alignItems: 'stretch',
          minHeight: '68px',
          boxShadow: '0 1px 4px #3b82f611',
        }}
      >
        <Rail />
        <div style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {children}
        </div>
        <Rail />
      </div>
      {note && (
        <div
          style={{
            fontSize: '11px',
            color: '#1e40af',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
            padding: '6px 10px',
            marginTop: '6px',
            lineHeight: 1.4,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN: Start-Stop Motor Control (OB1 — 50 ms Scan Cycle)
   Stop_PB is physically wired NC (fail-safe): %I0.1 = 1 at rest.
══════════════════════════════════════════════════════════════════ */
export default function TIALadderAnimation() {
  const [startPB, setStartPB] = useState(false);
  const [stopPB, setStopPB] = useState(false);
  const [wireBreak, setWireBreak] = useState(false);
  const [motor, setMotor] = useState(false);

  // Stop_PB is wired NC in the field: %I0.1 = 1 at rest, = 0 when pressed or wire broken
  const I0_0 = startPB;
  const I0_1 = !stopPB && !wireBreak;

  // Evaluate OB1 ladder network on a deterministic 50 ms PLC scan cycle (no setState in render)
  useEffect(() => {
    const timer = setInterval(() => {
      setMotor(prevMotor => (I0_0 || prevMotor) && I0_1);
    }, 50);
    return () => clearInterval(timer);
  }, [I0_0, I0_1]);

  const startContact = I0_0;
  const holdContact = motor;
  const branchOr = startContact || holdContact;
  const rung1 = branchOr && I0_1;

  const handleStartPulse = () => {
    setStartPB(true);
    setTimeout(() => setStartPB(false), 450);
  };

  const handleStopToggle = () => {
    setStopPB(prev => !prev);
  };

  const handleWireBreakToggle = () => {
    setWireBreak(prev => !prev);
  };

  // Vertical layout constants for Network 1 parallel branch so vertical bars connect cleanly to main wire
  const mainWireY = 27; // 15px label + 12px SVG midline
  const bottomBranchOffset = 58;
  const bottomWireY = bottomBranchOffset + mainWireY; // 85px

  return (
    <div
      style={{
        background: C.bg,
        borderRadius: '14px',
        padding: '18px',
        border: `1.5px solid ${C.titleBorder}`,
        fontFamily: 'monospace',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: C.titleBg,
          border: `1px solid ${C.titleBorder}`,
          borderRadius: '8px',
          padding: '8px 14px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: motor ? '#16a34a' : '#dc2626',
              boxShadow: motor ? '0 0 8px #16a34a99' : '0 0 8px #dc262699',
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>
            LAD — Motor_Control [OB1 · 50 ms Scan]
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>CPU 1214C DC/DC/DC</span>
      </div>

      {/* Network 1: Parallel branch (Start_PB || Motor_Q) + NO Stop_PB (%I0.1) + Motor_Q Coil */}
      <Network
        num="Network 1"
        comment="Motor START-STOP with self-holding seal-in circuit"
        note="Stop_PB is wired NC (fail-safe): %I0.1 = 1 at rest, so the program uses a NO contact. A broken wire stops the motor."
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          {/* Feed from Left Power Rail into branch split node (always energized from left rail) */}
          <div style={{ width: 16, height: 2, background: C.wire, marginTop: mainWireY - 1, flexShrink: 0 }} />

          {/* Parallel branch container with left & right vertical bus bars joined to the main rung */}
          <div style={{ position: 'relative', width: 92, height: bottomBranchOffset + 54, flexShrink: 0 }}>
            <svg
              width="92"
              height={bottomBranchOffset + 54}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              {/* Top branch left horizontal stub */}
              <line x1="0" y1={mainWireY} x2="18" y2={mainWireY} stroke={C.wire} strokeWidth="2" />
              {/* Left vertical drop to bottom branch (energized from left rail) */}
              <line x1="2" y1={mainWireY} x2="2" y2={bottomWireY} stroke={C.wire} strokeWidth="2" />
              {/* Bottom branch left horizontal stub */}
              <line x1="2" y1={bottomWireY} x2="18" y2={bottomWireY} stroke={C.wire} strokeWidth="2" />

              {/* Top branch right horizontal stub */}
              <line
                x1="74"
                y1={mainWireY}
                x2="92"
                y2={mainWireY}
                stroke={branchOr ? C.wire : C.wireOff}
                strokeWidth="2"
              />
              {/* Bottom branch right horizontal stub */}
              <line
                x1="74"
                y1={bottomWireY}
                x2="90"
                y2={bottomWireY}
                stroke={holdContact ? C.wire : C.wireOff}
                strokeWidth="2"
              />
              {/* Right vertical join bar rising from bottom branch back to main wire */}
              <line
                x1="90"
                y1={mainWireY}
                x2="90"
                y2={bottomWireY}
                stroke={holdContact ? C.wire : C.wireOff}
                strokeWidth="2"
              />
            </svg>

            {/* Top contact: Start_PB (%I0.0) */}
            <div style={{ position: 'absolute', top: 0, left: 18 }}>
              <ContactNO
                label="Start_PB"
                addr="%I0.0"
                active={startContact}
                wireLeftActive={true}
                wireRightActive={startContact}
              />
            </div>

            {/* Bottom contact: Seal-in Motor_Q (%Q0.0) */}
            <div style={{ position: 'absolute', top: bottomBranchOffset, left: 18 }}>
              <ContactNO
                label="Motor_Q"
                addr="%Q0.0"
                active={holdContact}
                wireLeftActive={true}
                wireRightActive={holdContact}
              />
            </div>
          </div>

          {/* Wire between parallel branch join and Stop_PB */}
          <div style={{ marginTop: 15 }}>
            <Wire active={branchOr} width={28} />
          </div>

          {/* Stop_PB NO contact (%I0.1 = 1 at rest because physical NC switch) */}
          <ContactNO
            label="Stop_PB"
            addr="%I0.1"
            active={I0_1}
            wireLeftActive={branchOr}
            wireRightActive={rung1}
          />

          {/* Main wire extending to output coil */}
          <div style={{ flex: 1, marginTop: 15, display: 'flex' }}>
            <Wire active={rung1} />
          </div>

          {/* Output coil flush against the right power rail */}
          <Coil label="Motor_Q" addr="%Q0.0" active={motor} />
        </div>
      </Network>

      {/* Network 2: Running status indicator lamp */}
      <Network num="Network 2" comment="Running status indicator lamp">
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          <div style={{ width: 16, height: 2, background: C.wire, marginTop: mainWireY - 1, flexShrink: 0 }} />
          <ContactNO
            label="Motor_Q"
            addr="%Q0.0"
            active={motor}
            wireLeftActive={true}
            wireRightActive={motor}
          />
          <div style={{ flex: 1, marginTop: 15, display: 'flex' }}>
            <Wire active={motor} />
          </div>
          <Coil label="Run_Lamp" addr="%Q0.1" active={motor} />
        </div>
      </Network>

      {/* Controls + Monitor */}
      <div style={{ borderTop: `1.5px dashed ${C.border}`, paddingTop: '14px', marginTop: '4px' }}>
        <div
          style={{
            fontSize: '11px',
            color: C.comment,
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
          }}
        >
          Simulate Field I/O
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Momentary START button */}
          <button
            onClick={handleStartPulse}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: `2px solid ${startPB ? '#16a34a' : '#86efac'}`,
              background: startPB ? '#dcfce7' : '#f0fdf4',
              color: startPB ? '#15803d' : '#16a34a',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.15s',
            }}
          >
            ▶ START
          </button>

          {/* Physical NC STOP button */}
          <button
            onClick={handleStopToggle}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: `2px solid ${stopPB ? '#dc2626' : '#fca5a5'}`,
              background: stopPB ? '#fee2e2' : '#fff1f2',
              color: stopPB ? '#b91c1c' : '#dc2626',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.15s',
            }}
          >
            ■ STOP
          </button>

          {/* Wire break fault simulation button */}
          <button
            onClick={handleWireBreakToggle}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: `2px solid ${wireBreak ? '#d97706' : '#fcd34d'}`,
              background: wireBreak ? '#fef3c7' : '#fffbeb',
              color: wireBreak ? '#b45309' : '#d97706',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.15s',
            }}
          >
            Wire break
          </button>

          {/* Tag Monitor */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { addr: '%I0.0', label: 'Start_PB', val: I0_0 },
              { addr: '%I0.1', label: 'Stop_PB', val: I0_1 },
              { addr: '%Q0.0', label: 'Motor_Q', val: motor },
              { addr: '%Q0.1', label: 'Run_Lamp', val: motor },
            ].map(t => (
              <div
                key={t.addr}
                style={{
                  padding: '6px 10px',
                  background: t.val ? C.tagActive : C.tagBg,
                  border: `1px solid ${t.val ? C.tagActiveBorder : C.tagBorder}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  minWidth: '64px',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    color: t.val ? '#1d4ed8' : '#475569',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {t.addr}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '2px', fontWeight: 600 }}>
                  {t.label}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: t.val ? '#16a34a' : '#ef4444',
                    lineHeight: 1,
                  }}
                >
                  {t.val ? '1' : '0'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

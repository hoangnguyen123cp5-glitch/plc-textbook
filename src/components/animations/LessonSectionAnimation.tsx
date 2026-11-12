'use client';

import { asset } from '@/lib/asset';

import React, { useState, useEffect } from 'react';

interface Props {
  slug: string;
  sectionIndex: number;
  sectionTitle: string;
}

export default function LessonSectionAnimation({ slug, sectionIndex, sectionTitle }: Props) {
  if (slug === '01-programmable-control') {
    // Section 1.1: 5 Core Elements of Control System
    if (sectionIndex === 0 || sectionTitle.includes('1.1')) {
      return <Section1_1FiveElementsAnimation />;
    }
    // Section 1.2: Open-Loop vs Closed-Loop
    if (sectionIndex === 1 || sectionTitle.includes('1.2')) {
      return <Section1_2LoopAnimation />;
    }
    // Section 1.3: Hardwired vs Programmable
    if (sectionIndex === 2 || sectionTitle.includes('1.3')) {
      return <Section1_3RelayVsPlcMiniAnimation />;
    }
    // Section 1.8: Scan Cycle Flow
    if (sectionIndex === 7 || sectionTitle.includes('1.8')) {
      return <Section1_8ScanCycleMiniAnimation />;
    }
  }

  return null;
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.1: 5 CORE FUNCTIONAL ELEMENTS OF INDUSTRIAL CONTROL
   Interactive Hardware Visualizer & Closed-Loop Architecture
═════════════════════════════════════════════════════════════════════════ */
function Section1_1FiveElementsAnimation() {
  const [activeId, setActiveId] = useState<number>(0);
  const [setpoint, setSetpoint] = useState<number>(50.0);
  const [actuatorType, setActuatorType] = useState<'vfd' | 'valve'>('vfd');

  const pv = 48.6; // Measured process variable from sensor
  const error = Math.round((setpoint - pv) * 10) / 10;
  // Computed output percentage based on error
  const rawOutput = Math.round((error * 15 + 40) * 10) / 10;
  const outputPercent = Math.min(100, Math.max(0, rawOutput));

  const elements = [
    {
      id: 0,
      code: '01',
      title: 'Setpoint (SP)',
      sub: 'Reference Target',
      desc: 'The desired target reference value for the physical process variable (e.g. target temperature 50.0 °C, pressure, flow rate, or speed). Configured by an operator on the HMI touchscreen or dictated by supervisory SCADA systems.',
      signal: 'Process Tag (REAL 32-bit Floating-Point)',
      hardware: 'Siemens SIMATIC HMI KTP700 Basic PN / SCADA Tag Database',
      role: 'Establishes the command target for the feedback loop without requiring hardwired circuit reconfiguration.',
    },
    {
      id: 1,
      code: '02',
      title: 'Comparator',
      sub: 'Summing Junction (Σ)',
      desc: 'Calculates the real-time instantaneous control error: e(t) = SP(t) − PV(t). If e(t) > 0, the process variable is below target and demands additional energy. In modern PLCs, this is executed as an IEEE 754 32-bit floating-point subtraction instruction in CPU cyclic execution (OB1 / OB30).',
      signal: 'Error Vector e(t) = SP - PV (REAL)',
      hardware: 'CPU Arithmetic Logic Unit (REAL 32-bit Floating-Point SUB Instruction)',
      role: 'Generates the instantaneous deviation signal that drives all subsequent controller decision-making.',
    },
    {
      id: 2,
      code: '03',
      title: 'Controller',
      sub: 'PLC CPU (OB1 / OB30)',
      desc: 'The computational core executing control algorithms (PID_Compact, Ladder logic interlocks) cyclically every scan cycle (e.g. 50 ms in OB30). Calculates the corrective action u(t) needed to eliminate error e(t) and maintain steady-state stability.',
      signal: 'Corrective Action u(t) (0.0..100.0% / %QW80)',
      hardware: 'Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC',
      role: 'Translates control deviation into actionable modulation signals while enforcing safety interlocks.',
    },
    {
      id: 3,
      code: '04',
      title: 'Actuator',
      sub: 'Final Control Element',
      desc: 'Transduces low-power digital/analog control signals from the PLC into high-power mechanical, thermal, or fluid-flow action upon the physical plant. Examples include variable frequency drives (SINAMICS VFD) driving motors or proportional motorized control valves.',
      signal: '4–20 mA Current Loop / PROFINET Speed Telegram',
      hardware: 'SINAMICS V20 VFD + 3-Phase Motor / Proportional Valve',
      role: 'Delivers physical energy directly into the process medium to alter its state.',
    },
    {
      id: 4,
      code: '05',
      title: 'Feedback Sensor',
      sub: 'Transducer / Measurement',
      desc: 'Continuously measures the actual physical process variable (PV) and converts it into a standardized, noise-immune industrial signal (4–20 mA current loop or PT100 RTD resistance). The PLC Analog Input module (%IW64) digitizes this signal to close the loop.',
      signal: 'Standardized 4–20 mA Loop ➔ %IW64 (0..27648)',
      hardware: 'Industrial PT100 RTD with 4–20 mA Head Transmitter',
      role: 'Provides reality feedback to close the loop; without a sensor, the system cannot verify whether the target was reached.',
    },
  ];

  const current = elements[activeId];

  const handleNextStep = () => {
    setActiveId((prev) => (prev + 1) % elements.length);
  };

  const handleReset = () => {
    setActiveId(0);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      padding: '16px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '10px',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            CLOSED-LOOP CONTROL ARCHITECTURE
          </span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
            5 Core Functional Elements of an Industrial Closed-Loop System
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset Diagram
          </button>
          <button
            onClick={handleNextStep}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid #0284c7',
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Next Step ({current.code}/05)
          </button>
        </div>
      </div>

      {/* SVG Signal Flow Schematic: Orthogonal lines, no crossing */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px', marginBottom: '14px' }}>
        <svg width="100%" height="90" viewBox="0 0 760 90" style={{ display: 'block' }}>
          <defs>
            <marker id="arrow-flow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#475569" />
            </marker>
          </defs>

          {/* Forward Paths */}
          <line x1="125" y1="35" x2="165" y2="35" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-flow)" />
          <line x1="265" y1="35" x2="305" y2="35" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-flow)" />
          <line x1="425" y1="35" x2="465" y2="35" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-flow)" />
          <line x1="585" y1="35" x2="635" y2="35" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-flow)" />

          {/* Plant Box on right */}
          <rect x="635" y="15" width="115" height="40" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="692" y="32" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">Physical Plant</text>
          <text x="692" y="46" fill="#64748b" fontSize="8.5" textAnchor="middle">Process Medium</text>

          {/* Feedback Orthogonal Loop */}
          <path d="M 692,55 L 692,75 L 425,75" fill="none" stroke="#475569" strokeWidth="1.5" />
          <line x1="305" y1="75" x2="215" y2="75" stroke="#475569" strokeWidth="1.5" />
          <path d="M 215,75 L 215,55" fill="none" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-flow)" />

          {/* 5 Functional Elements as Clickable Blocks */}
          {[
            { id: 0, x: 10, y: 15, w: 115, h: 40, label: '01. Setpoint (SP)', sub: 'Reference Target' },
            { id: 1, x: 165, y: 15, w: 100, h: 40, label: '02. Comparator', sub: 'Summing Junction (Σ)' },
            { id: 2, x: 305, y: 15, w: 120, h: 40, label: '03. Controller', sub: 'PLC CPU (OB1/30)' },
            { id: 3, x: 465, y: 15, w: 120, h: 40, label: '04. Actuator', sub: 'Final Element' },
            { id: 4, x: 305, y: 58, w: 120, h: 32, label: '05. Sensor (PV)', sub: 'Feedback Transducer' },
          ].map((b) => {
            const isAct = activeId === b.id;
            return (
              <g key={b.id} onClick={() => setActiveId(b.id)} style={{ cursor: 'pointer' }}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="4"
                  fill={isAct ? '#eff6ff' : '#ffffff'}
                  stroke={isAct ? '#0284c7' : '#cbd5e1'}
                  strokeWidth={isAct ? 2 : 1}
                />
                <text
                  x={b.x + b.w / 2}
                  y={b.y + (b.h === 32 ? 14 : 17)}
                  fill={isAct ? '#0284c7' : '#0f172a'}
                  fontSize="10"
                  fontWeight={isAct ? 'bold' : '600'}
                  textAnchor="middle"
                >
                  {b.label}
                </text>
                <text
                  x={b.x + b.w / 2}
                  y={b.y + (b.h === 32 ? 26 : 31)}
                  fill={isAct ? '#0369a1' : '#64748b'}
                  fontSize="8.5"
                  textAnchor="middle"
                >
                  {b.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2-Column Responsive Layout: Left Technical Specs, Right Visual Illustration Mockup */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: '14px', alignItems: 'stretch' }}>
        {/* Left Column: Technical Breakdown */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontFamily: 'Consolas, monospace',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '3px',
              }}>
                [{current.code}]
              </span>
              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{current.title}</strong>
              <span style={{ fontSize: '11px', color: '#64748b' }}>({current.sub})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px', marginBottom: '12px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  Industrial Hardware Implementation:
                </span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{current.hardware}</span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  I/O Signal Characteristics:
                </span>
                <span style={{ fontFamily: 'Consolas, monospace', color: '#0284c7', fontWeight: 700 }}>{current.signal}</span>
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.55 }}>
              <strong style={{ color: '#0f172a' }}>Control Principle:</strong> {current.desc}
            </div>
          </div>

          <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '11px', color: '#475569', lineHeight: 1.45 }}>
            <strong style={{ color: '#0284c7' }}>Role in Closed-Loop:</strong> {current.role}
          </div>
        </div>

        {/* Right Column: Interactive Hardware Illustration */}
        <div>
          {activeId === 0 && (
            <div style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', border: '2px solid #334155', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              {/* HMI Bezel Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#00646e', letterSpacing: '0.08em' }}>SIEMENS</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>SIMATIC HMI KTP700 Basic</span>
                </div>
                <span style={{ fontSize: '9px', background: '#065f46', color: '#6ee7b7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  ● PROFINET RUN
                </span>
              </div>

              {/* Touchscreen Glass */}
              <div style={{ background: '#090d16', borderRadius: '6px', border: '1px solid #1e293b', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}>PROCESS LOOP 01 · TEMPERATURE</span>
                  <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace' }}>IP: 192.168.0.2</span>
                </div>

                {/* Center Readout & Controls */}
                <div style={{ textAlign: 'center', padding: '6px 0' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    Target Setpoint (SP)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '8px 0' }}>
                    <button
                      onClick={() => setSetpoint(prev => Math.max(20, Math.round((prev - 1) * 10) / 10))}
                      style={{ width: '34px', height: '34px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}
                      title="Decrease Setpoint"
                    >
                      −
                    </button>
                    <div style={{ background: '#020617', border: '1.5px solid #0284c7', borderRadius: '6px', padding: '6px 16px', minWidth: '120px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                        {setpoint.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0ea5e9', marginLeft: '6px' }}>°C</span>
                    </div>
                    <button
                      onClick={() => setSetpoint(prev => Math.min(90, Math.round((prev + 1) * 10) / 10))}
                      style={{ width: '34px', height: '34px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}
                      title="Increase Setpoint"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick Set Presets */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                    {[40, 50, 65, 80].map(val => (
                      <button
                        key={val}
                        onClick={() => setSetpoint(val)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          background: setpoint === val ? '#0284c7' : '#1e293b',
                          border: setpoint === val ? '1px solid #38bdf8' : '1px solid #334155',
                          color: setpoint === val ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        {val}°C
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag Info */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px', padding: '6px 10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
                  <span>PLC Tag: <strong style={{ color: '#f1f5f9' }}>%DB1.DBD0 &quot;Process_SP&quot;</strong></span>
                  <span style={{ color: '#38bdf8' }}>Data Type: REAL</span>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
                Interactive Touch Panel · Tap [−] or [+] to adjust the live Setpoint
              </div>
            </div>
          )}

          {activeId === 1 && (
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                  TIA Portal LAD/FBD: Error Calculation
                </span>
                <span style={{ fontSize: '9.5px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  Network 1 (Cyclic OB30)
                </span>
              </div>

              {/* Math Instruction Graphic */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 0' }}>
                {/* Left Power Rail */}
                <div style={{ width: '4px', height: '110px', background: '#0284c7', borderRadius: '2px' }} />
                <div style={{ width: '16px', height: '2px', background: '#0284c7' }} />

                {/* The SUB Box */}
                <div style={{ width: '210px', border: '2px solid #0284c7', borderRadius: '4px', background: '#f8fafc', boxShadow: '0 2px 8px rgba(2,132,199,0.08)' }}>
                  {/* Box Header */}
                  <div style={{ background: '#0284c7', color: '#ffffff', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '12px', letterSpacing: '0.04em' }}>SUB</strong>
                    <span style={{ fontSize: '9px', background: '#ffffff', color: '#0284c7', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>REAL</span>
                  </div>

                  {/* Input / Output Pins */}
                  <div style={{ padding: '8px 10px', fontSize: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>IN1</span>
                        <span style={{ color: '#64748b', fontSize: '9px' }}>%DB1.DBD0</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>{setpoint.toFixed(1)} °C</span>
                    </div>

                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: 800, margin: '2px 0' }}>−</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>IN2</span>
                        <span style={{ color: '#64748b', fontSize: '9px' }}>%MD10 (PV)</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#16a34a', fontFamily: 'monospace' }}>{pv.toFixed(1)} °C</span>
                    </div>

                    <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>OUT</span>
                        <span style={{ color: '#64748b', fontSize: '9px' }}>%MD20</span>
                      </div>
                      <span style={{ fontWeight: 900, color: error >= 0 ? '#ea580c' : '#2563eb', fontFamily: 'monospace', fontSize: '11px' }}>
                        {error >= 0 ? '+' : ''}{error.toFixed(1)} °C
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ width: '16px', height: '2px', background: '#0284c7' }} />
                {/* Right Power Rail */}
                <div style={{ width: '4px', height: '110px', background: '#0284c7', borderRadius: '2px' }} />
              </div>

              {/* Deviation Meaning Status */}
              <div style={{
                marginTop: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: error > 0 ? '#fff7ed' : error === 0 ? '#f0fdf4' : '#eff6ff',
                border: error > 0 ? '1px solid #fdba74' : error === 0 ? '1px solid #86efac' : '1px solid #bfdbfe',
                fontSize: '10.5px',
                color: error > 0 ? '#9a3412' : error === 0 ? '#166534' : '#1e40af',
                lineHeight: 1.4,
              }}>
                <strong>Deviation Status:</strong> {error > 0
                  ? `e(t) = +${error.toFixed(1)} °C > 0 ➔ Process temperature below target; controller output u(t) must increase.`
                  : error === 0
                    ? `e(t) = 0.0 °C ➔ Process variable equals setpoint (equilibrium state).`
                    : `e(t) = ${error.toFixed(1)} °C < 0 ➔ Process temperature exceeds target; controller output u(t) must throttle down.`}
              </div>
            </div>
          )}

          {activeId === 2 && (
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                  Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC
                </span>
                <span style={{ fontSize: '9.5px', background: '#0284c7', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  PROFINET V4.5
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '12px', alignItems: 'center' }}>
                {/* CPU Real Photo with border */}
                <div style={{ position: 'relative', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: '#f8fafc' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset('/images/slides/01-programmable-control/PLC_Slide_1__018.png')}
                    alt="Siemens S7-1200 CPU 1214C"
                    style={{ width: '100%', height: '115px', objectFit: 'contain', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 4, left: 4, right: 4, background: 'rgba(15,23,42,0.85)', color: '#ffffff', fontSize: '8px', padding: '1px 3px', borderRadius: '2px', textAlign: 'center', fontWeight: 600 }}>
                    SIMATIC S7-1200
                  </div>
                </div>

                {/* CPU Diagnostic & Execution Engine */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Diagnostic LEDs */}
                  <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a' }}>RUN</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} />
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b' }}>ERROR</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} />
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b' }}>MAINT</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7', boxShadow: '0 0 6px #0284c7', display: 'inline-block' }} />
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#0284c7' }}>PN LINK</span>
                    </div>
                  </div>

                  {/* Cyclic Scan Details */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px', fontSize: '9.5px' }}>
                    <div style={{ color: '#64748b', marginBottom: '2px' }}>
                      Execution Block: <strong style={{ color: '#0f172a' }}>OB30 Cyclic (50 ms)</strong>
                    </div>
                    <div style={{ color: '#64748b', marginBottom: '2px' }}>
                      Algorithm: <strong style={{ color: '#0f172a' }}>PID_Compact (V2.2)</strong>
                    </div>
                    <div style={{ color: '#0284c7', fontWeight: 700 }}>
                      Calculated Output: u(t) = {outputPercent}% ➔ %QW80
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', lineHeight: 1.4 }}>
                The S7-1200 CPU cyclically reads error e(t), computes PID control, and writes the output word to industrial actuator channels.
              </div>
            </div>
          )}

          {activeId === 3 && (
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                  Final Control Element (Actuator)
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setActuatorType('vfd')}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      border: 'none',
                      background: actuatorType === 'vfd' ? '#0284c7' : '#f1f5f9',
                      color: actuatorType === 'vfd' ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ VFD &amp; Motor
                  </button>
                  <button
                    onClick={() => setActuatorType('valve')}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      border: 'none',
                      background: actuatorType === 'valve' ? '#0284c7' : '#f1f5f9',
                      color: actuatorType === 'valve' ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    🔥 Valve / Heater
                  </button>
                </div>
              </div>

              {actuatorType === 'vfd' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                  {/* VFD Box */}
                  <div style={{ background: '#0f172a', borderRadius: '6px', padding: '10px', color: '#ffffff', border: '1.5px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>SINAMICS V20</span>
                      <span style={{ color: '#4ade80' }}>● RUN</span>
                    </div>
                    <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '4px', padding: '6px', textAlign: 'center', margin: '4px 0' }}>
                      <span style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>
                        {(outputPercent * 0.5).toFixed(1)}
                      </span>
                      <span style={{ fontSize: '11px', color: '#fbbf24', marginLeft: '4px' }}>Hz</span>
                    </div>
                    <div style={{ fontSize: '8.5px', color: '#94a3b8', textAlign: 'center' }}>
                      Input: 4–20 mA (%QW80)
                    </div>
                  </div>

                  {/* Motor Box */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '2px' }}>⚙️</div>
                    <strong style={{ fontSize: '11px', color: '#0f172a', display: 'block' }}>3-Phase AC Motor</strong>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>400 VAC · 1.5 kW</span>
                    <div style={{ marginTop: '4px', fontSize: '10.5px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                      {Math.round(outputPercent * 14.2)} RPM
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                  {/* Valve Graphic */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Control Valve Position
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '14px', overflow: 'hidden', margin: '6px 0' }}>
                      <div style={{ width: `${outputPercent}%`, height: '100%', background: '#0284c7', transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700 }}>
                      <span style={{ color: '#475569' }}>Stroke Opening:</span>
                      <span style={{ color: '#0284c7' }}>{outputPercent}%</span>
                    </div>
                  </div>

                  {/* SCR Heater */}
                  <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>🔥</div>
                    <strong style={{ fontSize: '11px', color: '#9a3412', display: 'block' }}>SCR Heating Element</strong>
                    <span style={{ fontSize: '9px', color: '#c2410c' }}>Power: {(outputPercent * 0.05).toFixed(2)} kW</span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', lineHeight: 1.4 }}>
                Converts the low-power analog control signal into physical kinetic, fluid-flow, or thermal energy delivered directly to the plant.
              </div>
            </div>
          )}

          {activeId === 4 && (
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                  Industrial PT100 RTD &amp; 4–20 mA Transmitter
                </span>
                <span style={{ fontSize: '9.5px', background: '#0284c7', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  IEC 60751 Class A
                </span>
              </div>

              {/* 3-Stage Signal Transformation Pipeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>1. Physical Process Variable (PV)</span>
                    <div style={{ color: '#64748b', fontSize: '9px' }}>Immersion Thermowell in Tank</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{pv.toFixed(1)} °C</strong>
                    <div style={{ color: '#64748b', fontSize: '9px' }}>R = {(100 * (1 + 0.00385 * pv)).toFixed(1)} Ω</div>
                  </div>
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#1e40af' }}>2. Head Transmitter (4–20 mA Loop)</span>
                    <div style={{ color: '#3b82f6', fontSize: '9px' }}>Noise-immune current loop</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#1d4ed8', fontFamily: 'monospace' }}>
                      {(4 + (pv / 100) * 16).toFixed(2)} mA
                    </strong>
                    <div style={{ color: '#3b82f6', fontSize: '9px' }}>Span: 0..100 °C</div>
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#166534' }}>3. PLC Analog Input (%IW64)</span>
                    <div style={{ color: '#22c55e', fontSize: '9px' }}>S7-1200 ADC ➔ NORM_X + SCALE_X</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#15803d', fontFamily: 'monospace' }}>
                      {Math.round((pv / 100) * 27648)} counts
                    </strong>
                    <div style={{ color: '#16a34a', fontSize: '9px' }}>➔ REAL {pv.toFixed(1)} °C</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', lineHeight: 1.4 }}>
                Transduces the physical variable into a standardized 4–20 mA current loop that the PLC digitizes to close the feedback loop.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.2: OPEN-LOOP VS CLOSED-LOOP SIMULATOR (Light Theme)
═════════════════════════════════════════════════════════════════════════ */
function Section1_2LoopAnimation() {
  const [activeScenario, setActiveScenario] = useState<'light' | 'oven'>('light');

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #cbd5e1',
      borderRadius: '14px',
      padding: '18px 22px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Top Bar with Scenario Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Industrial Bench: Open-Loop vs Closed-Loop Control System
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveScenario('light')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeScenario === 'light' ? '#0284c7' : 'transparent',
              color: activeScenario === 'light' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            💡 Municipal Lighting
          </button>
          <button
            onClick={() => setActiveScenario('oven')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeScenario === 'oven' ? '#0284c7' : 'transparent',
              color: activeScenario === 'oven' ? '#ffffff' : '#475569',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🔥 Industrial Metallurgy Furnace
          </button>
        </div>
      </div>

      {activeScenario === 'light' ? <StreetLightScenario /> : <HeatingOvenScenario />}
    </div>
  );
}

/* Scenario 1: Street Light (Timer vs Photocell Sensor) */
function StreetLightScenario() {
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(true);
  const [isStormy, setIsStormy] = useState<boolean>(false);
  const [timeHour, setTimeHour] = useState<number>(14); // 14:00 (2 PM)

  // Open-Loop: schedule only (ON 18:00 - 06:00)
  const openLoopLampOn = timeHour >= 18 || timeHour < 6;

  // Closed-Loop: sensor measures Lux. Threshold is 60 Lux.
  const daylightLux = (timeHour >= 18 || timeHour < 6) ? 5 : isStormy ? 25 : 850;
  const closedLoopLampOn = daylightLux < 60;

  const lampState = isClosedLoop ? closedLoopLampOn : openLoopLampOn;

  return (
    <div>
      {/* Topology Mode Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <button
          onClick={() => setIsClosedLoop(false)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: !isClosedLoop ? '2px solid #d97706' : '1px solid #e2e8f0',
            background: !isClosedLoop ? '#fef3c7' : '#ffffff',
            color: !isClosedLoop ? '#b45309' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          ⏱️ Open-Loop Mode (Fixed Timer Schedule 18:00–06:00)
        </button>
        <button
          onClick={() => setIsClosedLoop(true)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: isClosedLoop ? '2px solid #0284c7' : '1px solid #e2e8f0',
            background: isClosedLoop ? '#eff6ff' : '#ffffff',
            color: isClosedLoop ? '#0369a1' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          📡 Closed-Loop Mode (LDR Lux Sensor Feedback)
        </button>
      </div>

      {/* Balanced 2-Column: Left Visualizer, Right Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px' }}>
        {/* Left: Plant & Environmental Controls */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Time of Day:</span>
            <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'monospace', color: '#0284c7' }}>{timeHour}:00</span>
          </div>
          <input
            type="range"
            min={0}
            max={23}
            value={timeHour}
            onChange={(e) => setTimeHour(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer', marginBottom: '12px' }}
          />

          {/* Disturbance Trigger */}
          <button
            onClick={() => setIsStormy(!isStormy)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: isStormy ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
              background: isStormy ? '#fee2e2' : '#ffffff',
              color: isStormy ? '#991b1b' : '#334155',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            {isStormy ? '⛈️ Disturbance: Sudden Thunderstorm (Sky Darkens)' : '☀️ Weather: Normal Clear Daylight'}
          </button>

          {/* Lamp Visual Graphic */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              background: lampState ? '#fef08a' : '#f1f5f9',
              border: lampState ? '2px solid #eab308' : '1px solid #cbd5e1',
              boxShadow: lampState ? '0 0 24px rgba(234,179,8,0.5)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              {lampState ? '💡' : '⚪'}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, marginTop: '8px', color: lampState ? '#16a34a' : '#64748b' }}>
              Lamp State: {lampState ? 'ENERGIZED (ON)' : 'DE-ENERGIZED (OFF)'}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Metrics & Result */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Process Measurement Telemetry:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Ambient Lux (PV):</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{daylightLux} Lux</span>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Setpoint Threshold (SP):</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>60 Lux</span>
              </div>
            </div>
          </div>

          {/* Outcome Badge */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            border: isClosedLoop
              ? '1.5px solid #86efac'
              : isStormy && timeHour < 18
              ? '1.5px solid #fca5a5'
              : '1.5px solid #fde68a',
            background: isClosedLoop
              ? '#f0fdf4'
              : isStormy && timeHour < 18
              ? '#fef2f2'
              : '#fffbeb',
            fontSize: '12px',
            lineHeight: 1.6,
            color: isClosedLoop
              ? '#166534'
              : isStormy && timeHour < 18
              ? '#991b1b'
              : '#92400e',
          }}>
            {!isClosedLoop ? (
              isStormy && timeHour < 18 ? (
                <span>❌ <strong>Open-Loop Limitation:</strong> Thunderstorm plunges the street into darkness during daytime, but timer logic remains blind until 18:00 ➔ Hazardous blackout!</span>
              ) : (
                <span>⚠️ <strong>Open-Loop Architecture:</strong> Executes rigid schedule regardless of environmental changes. Cannot sense or reject unmodelled disturbances.</span>
              )
            ) : (
              <span>✅ <strong>Closed-Loop Advantage:</strong> LDR lux sensor detects ambient light dropping below 60 Lux ➔ PLC immediately energizes the streetlights to reject disturbance!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Scenario 2: Industrial Thermal Oven */
function HeatingOvenScenario() {
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(true);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const targetTemp = 60;
  const temperature = isClosedLoop ? (doorOpen ? 58.8 : 60.0) : (doorOpen ? 37.5 : 60.0);

  return (
    <div>
      {/* Topology Mode Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <button
          onClick={() => setIsClosedLoop(false)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: !isClosedLoop ? '2px solid #d97706' : '1px solid #e2e8f0',
            background: !isClosedLoop ? '#fef3c7' : '#ffffff',
            color: !isClosedLoop ? '#b45309' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          ⚡ Open-Loop: Fixed 50% Heating Power
        </button>
        <button
          onClick={() => setIsClosedLoop(true)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: isClosedLoop ? '2px solid #0284c7' : '1px solid #e2e8f0',
            background: isClosedLoop ? '#eff6ff' : '#ffffff',
            color: isClosedLoop ? '#0369a1' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          📡 Closed-Loop: PT100 Sensor + PID Algorithm
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px' }}>
        {/* Left: Oven Door Disturbance */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
          <button
            onClick={() => setDoorOpen(!doorOpen)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: doorOpen ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
              background: doorOpen ? '#fee2e2' : '#ffffff',
              color: doorOpen ? '#991b1b' : '#334155',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            {doorOpen ? '🚪 Oven Door OPEN (Cold Draft Thermal Inrush)' : '🚪 Oven Door CLOSED (Optimal Enclosure Insulation)'}
          </button>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}>
            <span style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: temperature < 55 ? '#dc2626' : '#d97706' }}>
              {temperature.toFixed(1)}°C
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Target Setpoint (SP): {targetTemp}°C
            </span>
          </div>
        </div>

        {/* Right: Controller Response */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Controller Real-Time Response:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Heating Drive Output:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                  {!isClosedLoop ? '50% (Static)' : doorOpen ? '95% (High Drive)' : '52% (Steady)'}
                </span>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Control Error e(t) = SP − PV:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                  {(targetTemp - temperature).toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            border: isClosedLoop
              ? '1.5px solid #86efac'
              : doorOpen
              ? '1.5px solid #fca5a5'
              : '1.5px solid #fde68a',
            background: isClosedLoop
              ? '#f0fdf4'
              : doorOpen
              ? '#fef2f2'
              : '#fffbeb',
            fontSize: '12px',
            lineHeight: 1.6,
            color: isClosedLoop
              ? '#166534'
              : doorOpen
              ? '#991b1b'
              : '#92400e',
          }}>
            {!isClosedLoop ? (
              doorOpen ? (
                <span>❌ <strong>Open-Loop Collapse:</strong> Temperature falls drastically to {temperature}°C because static 50% power cannot compensate for cold draft heat losses!</span>
              ) : (
                <span>⚠️ <strong>Open-Loop Limitation:</strong> No feedback measurement. Mains voltage sag or ambient chills produce permanent steady-state temperature offsets.</span>
              )
            ) : (
              <span>🎯 <strong>Closed-Loop PID Response:</strong> PT100 senses the temperature drop ➔ PLC increases drive to 95%, swiftly restoring process temperature to 60.0°C!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.3: RELAY VS PLC MINI COMPARISON (Light Theme)
═════════════════════════════════════════════════════════════════════════ */
function Section1_3RelayVsPlcMiniAnimation() {
  const [testingChange, setTestingChange] = useState<boolean>(false);

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #cbd5e1',
      borderRadius: '14px',
      padding: '18px 22px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706', display: 'inline-block' }} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Architecture Comparison: Hardwired Relay Panel vs S7-1200 PLC
          </h4>
        </div>
        <button
          onClick={() => setTestingChange(!testingChange)}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            background: testingChange ? '#0284c7' : '#f1f5f9',
            color: testingChange ? '#ffffff' : '#334155',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {testingChange ? '🔄 Reset Specification Baseline' : '⚡ Simulate Engineering Spec Change'}
        </button>
      </div>

      {/* Balanced 2-Column Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Left: Hardwired Relay */}
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '10px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#b45309', marginBottom: '10px', fontSize: '13.5px' }}>
            <span>🗄️</span> Hardwired Relay Control Panel
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#78350f', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>• <strong>Logic Interconnection:</strong> Rigid point-to-point copper wiring between coils and mechanical contacts.</li>
            <li>• <strong>Reliability & MTBF:</strong> Mechanical contact wear, contact bounce, and electric arc pitting degrade contacts.</li>
            <li>• <strong>Panel Enclosure:</strong> Heavy steel floor-standing enclosure (1200 × 800 mm) housing dozens of mechanical relays.</li>
          </ul>
          {testingChange && (
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '6px',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '11.5px',
              lineHeight: 1.5,
            }}>
              ⚠️ <strong>Impact of Spec Change:</strong> Full plant shutdown required, drilling enclosure, unstringing bundles, rewiring ➔ <strong>6–8 hours downtime</strong>, high risk of human wiring mistakes!
            </div>
          )}
        </div>

        {/* Right: S7-1200 PLC */}
        <div style={{
          background: '#eff6ff',
          border: '1.5px solid #bfdbfe',
          borderRadius: '10px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#1d4ed8', marginBottom: '10px', fontSize: '13.5px' }}>
            <span>💻</span> Siemens SIMATIC S7-1200 PLC System
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#1e3a8a', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>• <strong>Logic Interconnection:</strong> Software algorithm executed in CPU RAM/work memory (OB1 cyclic evaluation).</li>
            <li>• <strong>Reliability & MTBF:</strong> Solid-state microprocessor architecture with MTBF exceeding hundreds of thousands of hours.</li>
            <li>• <strong>Panel Enclosure:</strong> Ultra-compact TS35 DIN-rail mounting (110 × 100 mm), reducing panel footprint by &gt;80%.</li>
          </ul>
          {testingChange && (
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '6px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              color: '#166534',
              fontSize: '11.5px',
              lineHeight: 1.5,
            }}>
              ✅ <strong>Impact of Spec Change:</strong> Simply open TIA Portal, modify Ladder / SCL networks, and download to PLC in <strong>5 seconds</strong> ➔ Zero physical rewiring required!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.8: MINI SCAN CYCLE FLOW (Light Theme)
═════════════════════════════════════════════════════════════════════════ */
function Section1_8ScanCycleMiniAnimation() {
  const [activePhase, setActivePhase] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const phases = [
    {
      num: 1,
      title: 'Read Inputs',
      mem: 'DI ➔ PII',
      desc: 'CPU scans all physical input channels simultaneously and snapshots their states into the Process Image Input (PII) table.',
      icon: '📥',
    },
    {
      num: 2,
      title: 'Execute Logic',
      mem: 'OB1 Evaluation',
      desc: 'CPU executes user program networks sequentially from top to bottom, evaluating rung logic based on static PII values.',
      icon: '⚙️',
    },
    {
      num: 3,
      title: 'Comms & Diagnostics',
      mem: 'Comms & Diag',
      desc: 'CPU services PROFINET network exchanges, updates HMI graphic tags, and executes internal hardware self-diagnostics.',
      icon: '🛡️',
    },
    {
      num: 4,
      title: 'Write Outputs',
      mem: 'PIQ ➔ DO',
      desc: 'CPU copies the entire Process Image Output (PIQ) table to the physical output drivers (relays/transistors) concurrently.',
      icon: '📤',
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const cur = phases[activePhase];

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #cbd5e1',
      borderRadius: '14px',
      padding: '18px 22px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header with Step / Play Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Deterministic PLC Scan Cycle Pipeline
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: autoPlay ? '#dcfce7' : '#ffffff',
              color: autoPlay ? '#15803d' : '#334155',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {autoPlay ? '⏸ Pause Scan' : '▶ Auto Cycle'}
          </button>
          <button
            onClick={() => {
              setAutoPlay(false);
              setActivePhase((prev) => (prev + 1) % 4);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Next Phase ❯
          </button>
        </div>
      </div>

      {/* 4 Cyclic Phase Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {phases.map((p, idx) => {
          const isCurrent = activePhase === idx;
          return (
            <button
              key={p.num}
              onClick={() => {
                setAutoPlay(false);
                setActivePhase(idx);
              }}
              style={{
                padding: '10px 8px',
                borderRadius: '10px',
                border: isCurrent ? '2px solid #0284c7' : '1px solid #e2e8f0',
                background: isCurrent ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: isCurrent ? '0 4px 12px rgba(2,132,199,0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '20px', marginBottom: '4px' }}>{p.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: isCurrent ? '#0f172a' : '#334155', lineHeight: 1.2 }}>
                {p.num}. {p.title}
              </span>
              <span style={{ fontSize: '10px', color: isCurrent ? '#0284c7' : '#64748b', fontFamily: 'monospace', fontWeight: 700, marginTop: '3px' }}>
                {p.mem}
              </span>
            </button>
          );
        })}
      </div>

      {/* Balanced 2-Column Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
        {/* Left: Active Phase Explanation */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Execution Phase: Step {cur.num} of 4
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
              {cur.mem}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
            {cur.desc}
          </p>
        </div>

        {/* Right: Real-time Scan Insight */}
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '10px',
          padding: '12px 16px',
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            ⏱️ Deterministic Real-Time Guarantee
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#78350f', lineHeight: 1.6 }}>
            Scan time $T_{'{scan}'}$ typically ranges from <strong>1 to 10 ms</strong>. Program logic evaluates static PII snapshots, completely immune to mechanical contact bounce during execution.
          </p>
        </div>
      </div>
    </div>
  );
}

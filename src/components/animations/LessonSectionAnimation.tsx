'use client';

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
   SECTION 1.1: 5 CORE FUNCTIONAL ELEMENTS OF CONTROL SYSTEMS (Light Theme)
═════════════════════════════════════════════════════════════════════════ */
function Section1_1FiveElementsAnimation() {
  const [activeId, setActiveId] = useState<number>(2); // Default to Controller

  const elements = [
    {
      id: 0,
      num: '1',
      title: 'Setpoint (SP)',
      sub: 'Reference Target',
      icon: '🎯',
      desc: 'The desired target value for the physical process variable (e.g., temperature, pressure, flow rate, or positioning coordinate).',
      example: 'Temperature SP = 60.0°C | Conveyor speed SP = 1.5 m/s (Entered via Siemens KTP700 HMI)',
      badge: 'Reference Input Signal',
      color: '#0284c7',
    },
    {
      id: 1,
      num: '2',
      title: 'Comparator',
      sub: 'Summing Junction (Σ)',
      icon: '⚖️',
      desc: 'Calculates the real-time instantaneous control error between target setpoint and physical feedback: e(t) = SP − PV.',
      example: 'Control Error e(t) = 60.0°C − 42.0°C = +18.0°C ➔ Drives corrective controller response',
      badge: 'Summing Junction (Σ)',
      color: '#d97706',
    },
    {
      id: 2,
      num: '3',
      title: 'Controller',
      sub: 'PLC CPU (OB1 Execution)',
      icon: '💻',
      desc: 'The computational processing core executing control algorithms (PID, Ladder logic, safety interlocks) to compute output u(t).',
      example: 'Siemens S7-1200 CPU 1214C DC/DC/DC executing PID_Compact FB in 1ms cyclic OB interrupt',
      badge: 'Decision Logic / Control Core',
      color: '#16a34a',
    },
    {
      id: 3,
      num: '4',
      title: 'Actuator',
      sub: 'Final Control Element',
      icon: '⚡',
      desc: 'Transduces low-power digital/analog control signals from the PLC into high-power kinetic, thermal, or pneumatic action.',
      example: 'SINAMICS V20 Inverter (VFD) driving AC motor, 4–20 mA proportional control valve, Solid-State Relay (SSR)',
      badge: 'Final Control Element',
      color: '#dc2626',
    },
    {
      id: 4,
      num: '5',
      title: 'Feedback Sensor',
      sub: 'Transducer / Measurement',
      icon: '📡',
      desc: 'Continuously measures the actual physical process variable (PV) and converts it to a standard electrical signal to close the loop.',
      example: 'PT100 RTD temperature probe with 4–20 mA transmitter, 1024 PPR optical incremental encoder',
      badge: 'Feedback Measurement Loop',
      color: '#7c3aed',
    },
  ];

  const current = elements[activeId];

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #cbd5e1',
      borderRadius: '14px',
      padding: '18px 22px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Top Header */}
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
            Signal Flow Architecture: 5 Core Functional Elements
          </h4>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
          💡 Click any block to inspect hardware implementation & telemetry
        </span>
      </div>

      {/* Signal Flow Block Diagram */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        marginBottom: '14px',
      }}>
        {elements.map((el) => {
          const isActive = activeId === el.id;
          return (
            <button
              key={el.id}
              onClick={() => setActiveId(el.id)}
              style={{
                padding: '10px 8px',
                borderRadius: '10px',
                border: isActive ? `2px solid ${el.color}` : '1px solid #e2e8f0',
                background: isActive ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: isActive ? `0 4px 12px ${el.color}25` : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '22px', marginBottom: '4px' }}>{el.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#0f172a' : '#334155', lineHeight: 1.2 }}>
                {el.num}. {el.title}
              </span>
              <span style={{ fontSize: '10px', color: isActive ? el.color : '#64748b', marginTop: '3px', fontWeight: 600 }}>
                {el.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Signal Flow Arrow Graphic */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '11px',
        color: '#475569',
        fontFamily: 'Consolas, monospace',
        marginBottom: '14px',
        fontWeight: 600,
        overflowX: 'auto',
      }}>
        <span style={{ color: '#0284c7' }}>Feedforward:</span>
        <span style={{ color: '#0f172a' }}>SP [Target] ──▶ (Σ) [Error e(t)] ──▶ PLC CPU [OB1] ──▶ Actuator ──▶ Plant Process</span>
        <span style={{ color: '#16a34a' }}>Feedback: ◀── Sensor [PV Transducer]</span>
      </div>

      {/* Balanced 2-Column Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Left Column: Role & Mathematical Formulation */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: current.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {current.badge}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
              {current.num}. {current.title}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
            {current.desc}
          </p>
        </div>

        {/* Right Column: Industrial Field Hardware Implementation */}
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '10px',
          padding: '12px 16px',
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            🏭 Industrial Field Hardware Implementation
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#78350f', lineHeight: 1.6, fontWeight: 500 }}>
            {current.example}
          </p>
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
  const [temperature, setTemperature] = useState<number>(60);
  const targetTemp = 60;

  useEffect(() => {
    if (isClosedLoop) {
      setTemperature(doorOpen ? 58.8 : 60.0);
    } else {
      setTemperature(doorOpen ? 37.5 : 60.0);
    }
  }, [isClosedLoop, doorOpen]);

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

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
   SECTION 1.1: 5 CORE FUNCTIONAL ELEMENTS OF CONTROL SYSTEMS
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
      desc: 'The target command or recipe value that the process variable must reach.',
      example: 'Target temperature: 60.0°C | Conveyor velocity: 1.5 m/s',
      badge: 'Input Signal',
    },
    {
      id: 1,
      num: '2',
      title: 'Comparator',
      sub: 'Error Detector (Σ)',
      icon: '⚖️',
      desc: 'Calculates instantaneous deviation between command and feedback: e(t) = SP − PV.',
      example: 'Error e = 60°C − 42°C = +18°C (Heater boost required)',
      badge: 'Summing Node',
    },
    {
      id: 2,
      num: '3',
      title: 'Controller',
      sub: 'PLC CPU (OB1)',
      icon: '💻',
      desc: 'Executes programmed logic (PID, ladder interlocks) to compute corrective action.',
      example: 'Siemens S7-1200 CPU 1214C running cyclic logic algorithms',
      badge: 'Decision Logic',
    },
    {
      id: 3,
      num: '4',
      title: 'Actuator',
      sub: 'Final Control Element',
      icon: '⚡',
      desc: 'Converts low-power electrical output signals into physical process energy.',
      example: 'VFD motor drive, proportional control valve, SSR heater',
      badge: 'Physical Output',
    },
    {
      id: 4,
      num: '5',
      title: 'Sensor',
      sub: 'Feedback Transducer',
      icon: '📡',
      desc: 'Continuously measures physical state (PV) and transmits back to comparator.',
      example: 'PT100 RTD sensor, optical encoder, 4–20 mA transmitter',
      badge: 'Feedback Loop',
    },
  ];

  const current = elements[activeId];

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-700 shadow-md">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-400">
            Interactive Signal Flow: 5 Core Elements
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Click any block to inspect</span>
      </div>

      {/* Signal Flow Block Diagram */}
      <div className="grid grid-cols-5 gap-1.5 mb-3 text-center">
        {elements.map((el) => {
          const isActive = activeId === el.id;
          return (
            <button
              key={el.id}
              onClick={() => setActiveId(el.id)}
              className={`p-2 rounded-lg transition-all flex flex-col items-center justify-center border text-left cursor-pointer ${
                isActive
                  ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
              }`}
            >
              <span className="text-base mb-0.5">{el.icon}</span>
              <span className="text-[10px] font-bold leading-tight block text-center">
                {el.num}. {el.title.split(' ')[0]}
              </span>
              <span className="text-[8px] text-slate-400 truncate max-w-full block">
                {el.sub.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Negative Feedback Arrow Graphic */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950/60 rounded-md border border-slate-800/80 text-[10px] text-slate-400 mb-3 font-mono">
        <span className="text-cyan-400 font-sans font-semibold">Feedforward:</span>
        <span>SP ──▶ (Σ) ──▶ PLC CPU ──▶ Actuator ──▶ Plant</span>
        <span className="text-emerald-400 font-sans font-semibold">Feedback: ◀── Sensor</span>
      </div>

      {/* Balanced 2-Column Inspector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Left Column: Role & Formula */}
        <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wide">
              {current.badge}
            </span>
            <span className="text-[11px] font-bold text-white">
              {current.num}. {current.title}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed m-0">
            {current.desc}
          </p>
        </div>

        {/* Right Column: Industrial Equipment Example */}
        <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wide mb-1">
            Industrial Field Hardware
          </div>
          <p className="text-slate-200 text-[11px] leading-relaxed font-mono m-0">
            {current.example}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.2: OPEN-LOOP VS CLOSED-LOOP SIMULATOR
═════════════════════════════════════════════════════════════════════════ */
function Section1_2LoopAnimation() {
  const [activeScenario, setActiveScenario] = useState<'light' | 'oven'>('light');

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-700 shadow-md">
      {/* Top Bar with Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-300 m-0">
            Simulation: Open-Loop vs Closed-Loop
          </h4>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg text-[11px]">
          <button
            onClick={() => setActiveScenario('light')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeScenario === 'light'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💡 Street Light
          </button>
          <button
            onClick={() => setActiveScenario('oven')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeScenario === 'oven'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 Thermal Oven
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
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setIsClosedLoop(false)}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
            !isClosedLoop
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
          }`}
        >
          ⏱️ Open-Loop (Timer Schedule)
        </button>
        <button
          onClick={() => setIsClosedLoop(true)}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
            isClosedLoop
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
          }`}
        >
          📡 Closed-Loop (LDR Sensor Feedback)
        </button>
      </div>

      {/* Balanced 2-Column: Left Visualizer, Right Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Left: Plant & Environmental Controls */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Time of Day:</span>
              <span className="font-mono font-bold text-cyan-400">{timeHour}:00</span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              value={timeHour}
              onChange={(e) => setTimeHour(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer mb-2"
            />
          </div>

          {/* Disturbance Trigger */}
          <button
            onClick={() => setIsStormy(!isStormy)}
            className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
              isStormy
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <span>{isStormy ? '⛈️ Sudden Storm (Sky Darkens)' : '☀️ Normal Clear Sky'}</span>
          </button>

          {/* Lamp Visual Graphic */}
          <div className="mt-3 py-2 flex flex-col items-center justify-center bg-slate-900/90 rounded-lg border border-slate-800 relative overflow-hidden">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                lampState
                  ? 'bg-amber-300 text-amber-950 shadow-[0_0_35px_15px_rgba(251,191,36,0.6)]'
                  : 'bg-slate-700 text-slate-500'
              }`}
            >
              {lampState ? '💡' : '⚪'}
            </div>
            <span className="text-[10px] font-bold mt-2 uppercase tracking-wide">
              Lamp Status: {lampState ? 'ENERGIZED (ON)' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Metrics & Result */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Process Telemetry:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Ambient Lux (PV):</span>
                <span className="font-mono font-bold text-white text-sm">{daylightLux} Lux</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Threshold (SP):</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">60 Lux</span>
              </div>
            </div>
          </div>

          {/* Outcome Badge */}
          <div className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
            isClosedLoop
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : isStormy && timeHour < 18
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
          }`}>
            {!isClosedLoop ? (
              isStormy && timeHour < 18 ? (
                <span>❌ <strong>Open-Loop Flaw:</strong> Severe storm blacks out road, but timer waits for 18:00 ➔ Lamp stays OFF!</span>
              ) : (
                <span>⚠️ <strong>Open-Loop:</strong> Fixed schedule control only. Cannot detect weather changes.</span>
              )
            ) : (
              <span>✅ <strong>Closed-Loop Success:</strong> LDR sensor detects lux drop ➔ PLC instantly turns lamp ON, rejecting disturbance!</span>
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
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setIsClosedLoop(false)}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
            !isClosedLoop
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
          }`}
        >
          ⚡ Open-Loop (Fixed 50% Power)
        </button>
        <button
          onClick={() => setIsClosedLoop(true)}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
            isClosedLoop
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
          }`}
        >
          📡 Closed-Loop (PT100 + PID)
        </button>
      </div>

      {/* Balanced 2-Column: Left Visualizer, Right Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Left: Oven Door Disturbance */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col justify-between">
          <button
            onClick={() => setDoorOpen(!doorOpen)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
              doorOpen
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <span>{doorOpen ? '🚪 Oven Door OPEN (Cold Air Draft)' : '🚪 Oven Door CLOSED'}</span>
          </button>

          <div className="mt-3 py-3 flex flex-col items-center justify-center bg-slate-900/90 rounded-lg border border-slate-800">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {temperature.toFixed(1)}°C
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Target Setpoint: {targetTemp}°C
            </span>
          </div>
        </div>

        {/* Right: Controller Response */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              PID Controller Reaction:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Heater Output:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {!isClosedLoop ? '50% (Static)' : doorOpen ? '95% (Boost)' : '52% (Steady)'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Error e(t):</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {(targetTemp - temperature).toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
            isClosedLoop
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : doorOpen
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
          }`}>
            {!isClosedLoop ? (
              doorOpen ? (
                <span>❌ <strong>Cold Draft Failure:</strong> Temp plunges to {temperature}°C. Static 50% power cannot adapt.</span>
              ) : (
                <span>⚠️ <strong>Open-Loop:</strong> Fixed heater power. Sensitive to ambient room temperature.</span>
              )
            ) : (
              <span>🎯 <strong>PID Feedback:</strong> PT100 senses heat loss ➔ Output jumps to 95% to hold setpoint at 60°C!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.3: RELAY VS PLC MINI COMPARISON
═════════════════════════════════════════════════════════════════════════ */
function Section1_3RelayVsPlcMiniAnimation() {
  const [testingChange, setTestingChange] = useState<boolean>(false);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-700 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 m-0">
            Hardwired Relay vs S7-1200 PLC Architecture
          </h4>
        </div>
        <button
          onClick={() => setTestingChange(!testingChange)}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border cursor-pointer ${
            testingChange
              ? 'bg-blue-600 border-blue-400 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
          }`}
        >
          {testingChange ? '🔄 Reset Spec' : '⚡ Simulate Logic Change'}
        </button>
      </div>

      {/* Balanced 2-Column Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Left: Hardwired Relay */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2">
            <span>🗄️</span> Hardwired Relay Panel
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300 list-none p-0 m-0">
            <li>• <strong>Logic Medium:</strong> Physical copper wiring & relay coils</li>
            <li>• <strong>Maintenance:</strong> Mechanical wear & contact pitting</li>
            <li>• <strong>Panel Size:</strong> Large steel enclosure (1200×800 mm)</li>
          </ul>
          {testingChange && (
            <div className="mt-2.5 p-2 rounded bg-rose-950/70 border border-rose-500/60 text-rose-300 text-[10px]">
              ⚠️ <strong>Process Change Required:</strong> Power down line, unmount relays, drill panel, manual rewiring (~6 hours downtime).
            </div>
          )}
        </div>

        {/* Right: S7-1200 PLC */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-2">
            <span>💻</span> Siemens S7-1200 PLC
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300 list-none p-0 m-0">
            <li>• <strong>Logic Medium:</strong> Software code stored in CPU RAM</li>
            <li>• <strong>Maintenance:</strong> Solid-state reliability (no moving parts)</li>
            <li>• <strong>Panel Size:</strong> Compact DIN-rail mount (110×100 mm)</li>
          </ul>
          {testingChange && (
            <div className="mt-2.5 p-2 rounded bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 text-[10px]">
              ✅ <strong>Process Change Required:</strong> Update ladder network in TIA Portal, download to CPU in 5 seconds (zero rewiring!).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.8: MINI SCAN CYCLE FLOW
═════════════════════════════════════════════════════════════════════════ */
function Section1_8ScanCycleMiniAnimation() {
  const [activePhase, setActivePhase] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const phases = [
    {
      num: 1,
      title: 'Read Inputs',
      mem: 'DI ➔ PII',
      desc: 'CPU polls physical input terminals and writes snapshot to Process Image Input table.',
      icon: '📥',
    },
    {
      num: 2,
      title: 'Execute Logic',
      mem: 'OB1 Evaluation',
      desc: 'CPU executes user networks sequentially top-to-bottom using PII values.',
      icon: '⚙️',
    },
    {
      num: 3,
      title: 'Housekeeping',
      mem: 'Comms & Diag',
      desc: 'CPU processes PROFINET network messages, HMI polling, and self-diagnostics.',
      icon: '🛡️',
    },
    {
      num: 4,
      title: 'Write Outputs',
      mem: 'PIQ ➔ DO',
      desc: 'CPU simultaneously copies the Process Image Output table to physical output terminals.',
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
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-700 shadow-md">
      {/* Header with Step / Play Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 m-0">
            PLC Deterministic Scan Cycle
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border cursor-pointer ${
              autoPlay
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {autoPlay ? '⏸ Pause' : '▶ Auto Cycle'}
          </button>
          <button
            onClick={() => {
              setAutoPlay(false);
              setActivePhase((prev) => (prev + 1) % 4);
            }}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 cursor-pointer"
          >
            Next ❯
          </button>
        </div>
      </div>

      {/* 4 Cyclic Phase Pipeline */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
        {phases.map((p, idx) => {
          const isCurrent = activePhase === idx;
          return (
            <button
              key={p.num}
              onClick={() => {
                setAutoPlay(false);
                setActivePhase(idx);
              }}
              className={`p-2 rounded-lg transition-all border flex flex-col items-center justify-center cursor-pointer ${
                isCurrent
                  ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-sm mb-0.5">{p.icon}</span>
              <span className="text-[10px] font-bold leading-tight block">
                {p.num}. {p.title}
              </span>
              <span className="text-[8px] text-cyan-300/80 font-mono mt-0.5 block">
                {p.mem}
              </span>
            </button>
          );
        })}
      </div>

      {/* Balanced 2-Column Inspector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Left: Active Phase Explanation */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wide">
              Active Phase {cur.num} of 4
            </span>
            <span className="text-[11px] font-bold text-white font-mono">
              {cur.mem}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed m-0">
            {cur.desc}
          </p>
        </div>

        {/* Right: Real-time Scan Insight */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wide mb-1">
            Deterministic Timing Guarantee
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed m-0">
            Total scan time $T_{'{scan}'}$ is typically <strong>1–10 ms</strong>. Logic evaluates the frozen PII image rather than physical pins directly, guaranteeing rung data consistency.
          </p>
        </div>
      </div>
    </div>
  );
}

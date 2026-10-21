'use client';

import React, { useState, useEffect } from 'react';

/* ═════════════════════════════════════════════════════════════════════════
   L01 — Interactive Engineering Hub: Programmable Control Fundamentals
   Chapter 1: Programmable Control Concepts & The PLC Scan Cycle

   Comprehensive Interactive Learning Modules:
     1. The PLC Scan Cycle & Process Images (PII / PIQ)
     2. Open-Loop vs Closed-Loop Control Systems (+ Disturbance Simulation)
     3. Hardwired Relay Control vs PLC Comparison
     4. S7-1200 Hardware Architecture & Diagnostic LEDs (CPU 1214C)
     5. IEC 61131-3 Languages: LAD vs FBD vs SCL (Interactive Comparison)
═════════════════════════════════════════════════════════════════════════ */

type TabType = 'scan' | 'loop' | 'relay' | 'hw' | 'languages';

export default function Lesson01InteractiveHub() {
  const [activeTab, setActiveTab] = useState<TabType>('scan');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8 transition-all">
      {/* Hub Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interactive Learning Hub
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 m-0">
              Interactive Simulation — Control Systems & The PLC Scan Cycle
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'scan'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔄</span> Scan Cycle
            </button>
            <button
              onClick={() => setActiveTab('loop')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'loop'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔁</span> Open vs Closed Loop
            </button>
            <button
              onClick={() => setActiveTab('relay')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'relay'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡</span> Relay vs PLC
            </button>
            <button
              onClick={() => setActiveTab('hw')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'hw'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🖥️</span> Architecture & LEDs
            </button>
            <button
              onClick={() => setActiveTab('languages')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'languages'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📝</span> IEC Languages
            </button>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-6">
        {activeTab === 'scan' && <ScanCycleSimulator />}
        {activeTab === 'loop' && <ControlLoopSimulator />}
        {activeTab === 'relay' && <RelayVsPlcComparison />}
        {activeTab === 'hw' && <HardwareAndLedExplorer />}
        {activeTab === 'languages' && <IecLanguagesShowcase />}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 1: Scan Cycle Simulator (Interactive Process Images & Logic Flow)
═════════════════════════════════════════════════════════════════════════ */
function ScanCycleSimulator() {
  const [phase, setPhase] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [scanSpeed, setScanSpeed] = useState<number>(1400); // ms per step
  const [cycleCount, setCycleCount] = useState<number>(1);

  // Field Inputs
  const [swStart, setSwStart] = useState<boolean>(false);
  const [swStop, setSwStop] = useState<boolean>(false);
  const [swSensor, setSwSensor] = useState<boolean>(false);

  // Process Images in RAM
  const [piiStart, setPiiStart] = useState<boolean>(false);
  const [piiStop, setPiiStop] = useState<boolean>(false);
  const [piiSensor, setPiiSensor] = useState<boolean>(false);

  // Program Logic & Output Image
  const [piqMotor, setPiqMotor] = useState<boolean>(false);
  const [piqAlarm, setPiqAlarm] = useState<boolean>(false);

  // Physical Output Terminals
  const [physicalMotor, setPhysicalMotor] = useState<boolean>(false);
  const [physicalAlarm, setPhysicalAlarm] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      advanceStep();
    }, scanSpeed);
    return () => clearInterval(interval);
  }, [isRunning, scanSpeed, phase, swStart, swStop, swSensor, piiStart, piiStop, piiSensor, piqMotor, piqAlarm]);

  const advanceStep = () => {
    setPhase((prevPhase) => {
      const nextPhase = (prevPhase + 1) % 4;

      if (nextPhase === 0) {
        // Phase 1: Read Inputs into PII (Process Image Input)
        setPiiStart(swStart);
        setPiiStop(swStop);
        setPiiSensor(swSensor);
        setCycleCount((c) => c + 1);
      } else if (nextPhase === 1) {
        // Phase 2: Execute OB1 program logic:
        const nextMotor = (piiStart || piqMotor) && !piiStop;
        const nextAlarm = piiSensor && nextMotor;
        setPiqMotor(nextMotor);
        setPiqAlarm(nextAlarm);
      } else if (nextPhase === 2) {
        // Phase 3: Communication & Diagnostics (CPU Internal Housekeeping)
      } else if (nextPhase === 3) {
        // Phase 4: Write PIQ to physical outputs
        setPhysicalMotor(piqMotor);
        setPhysicalAlarm(piqAlarm);
      }

      return nextPhase;
    });
  };

  const phases = [
    {
      id: 0,
      title: '1. Read Inputs to PII',
      tag: 'PII Snapshot',
      color: '#0284c7',
      desc: 'The CPU scans all 24V DI terminals (I0.0, I0.1, I0.2) and takes a snapshot into the Process Image Input (PII) table.',
      action: 'Instantaneous snapshot: field signal changes during program execution will NOT affect the current scan cycle!',
    },
    {
      id: 1,
      title: '2. Execute Program (OB1)',
      tag: 'Ladder Logic',
      color: '#16a34a',
      desc: 'The CPU evaluates networks top-to-bottom and left-to-right, reading from PII memory rather than field screw terminals.',
      action: 'Logic evaluation: Q0.0 = (I0.0 OR Q0.0) AND NOT I0.1. Intermediate results are stored in the PIQ buffer.',
    },
    {
      id: 2,
      title: '3. Housekeeping & Diagnostics',
      tag: 'Self-Test',
      color: '#d97706',
      desc: 'The CPU checks hardware integrity, monitors operating temperatures, and services PROFINET / HMI communication requests.',
      action: 'Updates diagnostic buffer and detects module disconnects or wire breaks before energizing loads.',
    },
    {
      id: 3,
      title: '4. Write PIQ to Outputs',
      tag: 'PIQ -> Physical',
      color: '#dc2626',
      desc: 'The CPU copies values from the Process Image Output (PIQ) table to the physical output transistors/relays (Q0.0, Q0.1).',
      action: 'Energizes contactors and field solenoids simultaneously, completing one cycle before looping back to Phase 1.',
    },
  ];

  return (
    <div>
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isRunning
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Resume Auto Scan'}
          </button>
          <button
            onClick={advanceStep}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⏭ Single Step
          </button>
          <span className="text-xs text-slate-500 font-mono ml-2">
            Scan Count: <strong className="text-slate-800">#{cycleCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span>Cycle Time:</span>
          <input
            type="range"
            min={400}
            max={2500}
            step={100}
            value={scanSpeed}
            onChange={(e) => setScanSpeed(Number(e.target.value))}
            className="w-24 accent-blue-600"
          />
          <span className="font-mono text-slate-800 w-12 text-right">{(scanSpeed / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* 4-Phase Progress Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
        {phases.map((p) => {
          const isActive = phase === p.id;
          return (
            <div
              key={p.id}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-50/80 border-blue-400 shadow-sm ring-2 ring-blue-400/20'
                  : 'bg-slate-50/50 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Phase {p.id + 1}
                </span>
                {isActive && (
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 m-0 line-clamp-1">
                {p.title}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                {p.action}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Diagram: Data Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
        {/* Column 1: Physical Inputs & PII */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0 flex items-center gap-1.5">
              <span>🔌</span> 1. Field Input Devices
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Field Inputs
            </span>
          </div>

          <div className="space-y-3">
            {/* Input 1: Start Button */}
            <div className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-slate-800">START Button (I0.0)</div>
                <div className="text-[11px] text-slate-500">Normally Open (NO) Contact</div>
              </div>
              <button
                onClick={() => setSwStart(!swStart)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  swStart
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {swStart ? 'PRESSED (24V)' : 'RELEASED (0V)'}
              </button>
            </div>

            {/* Input 2: Stop Button */}
            <div className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-slate-800">STOP Button (I0.1)</div>
                <div className="text-[11px] text-slate-500">Emergency Stop / Halt</div>
              </div>
              <button
                onClick={() => setSwStop(!swStop)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  swStop
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {swStop ? 'ENGAGED (1)' : 'NORMAL (0)'}
              </button>
            </div>

            {/* Input 3: Safety Sensor */}
            <div className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-slate-800">Interlock Sensor (I0.2)</div>
                <div className="text-[11px] text-slate-500">High Temp/Pressure Alarm</div>
              </div>
              <button
                onClick={() => setSwSensor(!swSensor)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  swSensor
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {swSensor ? 'ALARM (1)' : 'SAFE (0)'}
              </button>
            </div>
          </div>

          {/* PII Table snapshot */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>📸</span> Process Image Input (PII Memory)
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${phase === 0 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                {phase === 0 ? 'Sampling Inputs' : 'Snapshot Locked'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
              <div className={`p-1.5 rounded border ${piiStart ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                I0.0 = {piiStart ? '1' : '0'}
              </div>
              <div className={`p-1.5 rounded border ${piiStop ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                I0.1 = {piiStop ? '1' : '0'}
              </div>
              <div className={`p-1.5 rounded border ${piiSensor ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                I0.2 = {piiSensor ? '1' : '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Program Execution (OB1) */}
        <div className={`bg-white p-4 rounded-xl border transition-all shadow-xs ${
          phase === 1 ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0 flex items-center gap-1.5">
              <span>🧠</span> 2. Central Processing Unit (OB1)
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${phase === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {phase === 1 ? 'Executing' : 'Idle'}
            </span>
          </div>

          {/* Ladder Diagram visualization */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-xs">
            <div className="text-[11px] text-slate-500 font-sans font-bold mb-2">Network 1: Motor Start / Seal-In Circuit</div>
            
            <svg viewBox="0 0 320 80" className="w-full h-auto bg-white rounded border border-slate-200">
              {/* Power Rails */}
              <line x1="10" y1="10" x2="10" y2="70" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="310" y1="10" x2="310" y2="70" stroke="#0284c7" strokeWidth="2.5" />

              {/* Rung line */}
              <line x1="10" y1="30" x2="50" y2="30" stroke={piiStart || piqMotor ? '#16a34a' : '#94a3b8'} strokeWidth="2" />
              
              {/* Start Contact (I0.0) */}
              <line x1="50" y1="20" x2="50" y2="40" stroke="#334155" strokeWidth="2" />
              <line x1="65" y1="20" x2="65" y2="40" stroke="#334155" strokeWidth="2" />
              <text x="57" y="15" fontSize="8" textAnchor="middle" fill="#0369a1" fontWeight="bold">I0.0</text>
              {piiStart && <line x1="50" y1="30" x2="65" y2="30" stroke="#16a34a" strokeWidth="2" />}

              {/* Seal-in branch (Q0.0) */}
              <line x1="40" y1="30" x2="40" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="40" y1="60" x2="50" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="50" y1="50" x2="50" y2="70" stroke="#334155" strokeWidth="2" />
              <line x1="65" y1="50" x2="65" y2="70" stroke="#334155" strokeWidth="2" />
              <text x="57" y="77" fontSize="8" textAnchor="middle" fill="#0369a1" fontWeight="bold">Q0.0</text>
              {piqMotor && <line x1="50" y1="60" x2="65" y2="60" stroke="#16a34a" strokeWidth="2" />}
              <line x1="65" y1="60" x2="75" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="75" y1="60" x2="75" y2="30" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Connection after Start */}
              <line x1="65" y1="30" x2="110" y2="30" stroke={piiStart || piqMotor ? '#16a34a' : '#94a3b8'} strokeWidth="2" />

              {/* Stop Contact NC (I0.1) */}
              <line x1="110" y1="20" x2="110" y2="40" stroke="#334155" strokeWidth="2" />
              <line x1="125" y1="20" x2="125" y2="40" stroke="#334155" strokeWidth="2" />
              <line x1="108" y1="42" x2="127" y2="18" stroke="#dc2626" strokeWidth="2" />
              <text x="117" y="15" fontSize="8" textAnchor="middle" fill="#dc2626" fontWeight="bold">I0.1 (NC)</text>

              {/* Line to coil */}
              <line x1="125" y1="30" x2="230" y2="30" stroke={piqMotor ? '#16a34a' : '#94a3b8'} strokeWidth="2" />

              {/* Coil Q0.0 */}
              <path d="M 230 20 Q 235 30 230 40" fill="none" stroke="#334155" strokeWidth="2" />
              <path d="M 245 20 Q 240 30 245 40" fill="none" stroke="#334155" strokeWidth="2" />
              <text x="238" y="15" fontSize="8" textAnchor="middle" fill="#16a34a" fontWeight="bold">Q0.0</text>
              <line x1="245" y1="30" x2="310" y2="30" stroke={piqMotor ? '#16a34a' : '#94a3b8'} strokeWidth="2" />
            </svg>

            <div className="mt-2 text-[11px] text-slate-600 space-y-1">
              <div>• Boolean Expression: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">Q0.0 := (I0.0 OR Q0.0) AND NOT I0.1</code></div>
              <div>• Evaluated State: <strong className={piqMotor ? 'text-emerald-700' : 'text-slate-500'}>{piqMotor ? 'MOTOR = TRUE' : 'MOTOR = FALSE'}</strong></div>
            </div>
          </div>

          {/* PIQ Table */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>📝</span> Process Image Output (PIQ Buffer)
              </span>
              <span className="text-[10px] text-slate-500">Awaiting terminal write</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-center text-xs">
              <div className={`p-1.5 rounded border ${piqMotor ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                PIQ.Q0.0 = {piqMotor ? '1 (ON)' : '0 (OFF)'}
              </div>
              <div className={`p-1.5 rounded border ${piqAlarm ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                PIQ.Q0.1 = {piqAlarm ? '1 (ALARM)' : '0 (QUIET)'}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Physical Outputs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0 flex items-center gap-1.5">
              <span>💡</span> 3. Physical Actuators
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${phase === 3 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              {phase === 3 ? 'Updating DO' : 'Outputs Latched'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Actuator 1: Motor */}
            <div className={`p-3 rounded-lg border transition-all ${
              physicalMotor ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${physicalMotor ? 'animate-spin' : ''}`}>⚙️</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">CONVEYOR MOTOR (Q0.0)</div>
                    <div className="text-[11px] text-slate-500">3-Phase 380VAC Contactor</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  physicalMotor ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {physicalMotor ? 'ENERGIZED' : 'STOPPED'}
                </span>
              </div>
            </div>

            {/* Actuator 2: Alarm Light */}
            <div className={`p-3 rounded-lg border transition-all ${
              physicalAlarm ? 'bg-rose-50 border-rose-300 animate-pulse' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{physicalAlarm ? '🚨' : '⚪'}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">WARNING TOWER LIGHT (Q0.1)</div>
                    <div className="text-[11px] text-slate-500">24VDC Strobe & Siren</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  physicalAlarm ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {physicalAlarm ? 'ALARM ON' : 'NORMAL'}
                </span>
              </div>
            </div>

            {/* Lesson Takeaway Card */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <strong className="block text-amber-950 font-bold mb-1">💡 Key Scan Cycle Takeaway:</strong>
              If you press and release the <strong>START</strong> button extremely fast while the CPU is executing Phase 2, the PLC will only catch the input when it loops back to <strong>Phase 1</strong> in the next cycle!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 2: Control Loop Simulator (Open-Loop vs Closed-Loop)
═════════════════════════════════════════════════════════════════════════ */
function ControlLoopSimulator() {
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(true);
  const [setpoint, setSetpoint] = useState<number>(60);
  const [temp, setTemp] = useState<number>(25);
  const [heaterPower, setHeaterPower] = useState<number>(0);
  const [disturbance, setDisturbance] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTemp((currentTemp) => {
        const ambient = disturbance ? 12 : 24;
        const coolingLoss = (currentTemp - ambient) * 0.08;
        const heatingGain = (heaterPower / 100) * 8.5;
        const newTemp = Math.max(10, Math.min(100, currentTemp + heatingGain - coolingLoss));
        return parseFloat(newTemp.toFixed(1));
      });
    }, 400);

    return () => clearInterval(timer);
  }, [heaterPower, disturbance]);

  useEffect(() => {
    if (isClosedLoop) {
      const error = setpoint - temp;
      let power = 0;
      if (error > 0) {
        power = Math.min(100, Math.max(0, error * 8));
      } else {
        power = 0;
      }
      setHeaterPower(Math.round(power));
    } else {
      setHeaterPower(45);
    }
  }, [isClosedLoop, setpoint, temp]);

  return (
    <div>
      {/* Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            Control Mode Selection
          </div>
          <h3 className="text-sm font-bold text-slate-900 m-0">
            {isClosedLoop ? 'Closed-Loop Control System (Sensor Feedback)' : 'Open-Loop Control System (No Feedback)'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsClosedLoop(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isClosedLoop
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Open-Loop
          </button>
          <button
            onClick={() => setIsClosedLoop(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isClosedLoop
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Closed-Loop
          </button>
        </div>
      </div>

      {/* Interactive Controls & Live Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Setpoint & Disturbance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <span>🎯</span> Setpoint & Disturbance
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Target Temperature (Setpoint):</span>
                <span className="font-bold text-blue-700 font-mono">{setpoint}°C</span>
              </div>
              <input
                type="range"
                min={30}
                max={85}
                value={setpoint}
                onChange={(e) => setSetpoint(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-medium text-slate-700 mb-2">Simulate Environmental Disturbance:</div>
              <button
                onClick={() => setDisturbance(!disturbance)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  disturbance
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{disturbance ? '❄️ OVEN DOOR OPEN (Cold Draft 12°C)' : '🚪 Oven Door Closed'}</span>
              </button>
              <p className="text-[11px] text-slate-500 mt-1">
                Click to see how each control topology reacts when an unexpected disturbance occurs!
              </p>
            </div>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <span>🌡️</span> Actual Temperature (PV)
          </h4>

          <div className="text-center my-auto py-2">
            <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {temp}°C
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Error e(t): <span className={Math.abs(setpoint - temp) > 3 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {(setpoint - temp).toFixed(1)}°C
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-linear-to-r from-blue-500 via-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, temp))}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
            {isClosedLoop
              ? '✅ Thermocouple sensor feeds actual temperature back to the comparator.'
              : '❌ No feedback sensor — the controller has no knowledge of actual temperature.'}
          </div>
        </div>

        {/* Controller Output */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <span>⚡</span> Heating Command (MV)
          </h4>

          <div className="text-center my-auto py-2">
            <div className="text-4xl font-extrabold text-amber-600 font-mono tracking-tight">
              {heaterPower}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Solid-State Relay Output Duty
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${heaterPower}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
            {isClosedLoop ? (
              <span>
                When the oven door opens, the PLC automatically <strong>boosts output to {heaterPower}%</strong> to compensate for heat loss.
              </span>
            ) : (
              <span>
                Output power is fixed at 45%. When cold wind enters, the chamber cools down with no ability to compensate!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Block Diagram SVG */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Functional Block Diagram: {isClosedLoop ? 'Closed-Loop Feedback Architecture' : 'Open-Loop Architecture'}
        </h4>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 760 170" className="w-full min-w-[650px] h-auto">
            {/* Setpoint Input */}
            <rect x="10" y="50" width="90" height="40" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="55" y="68" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">Setpoint (SP)</text>
            <text x="55" y="82" fontSize="9" textAnchor="middle" fill="#0284c7" fontWeight="bold">{setpoint}°C</text>

            <line x1="100" y1="70" x2="135" y2="70" stroke="#0284c7" strokeWidth="2" />

            {/* Comparator */}
            <circle cx="150" cy="70" r="14" fill={isClosedLoop ? '#eff6ff' : '#f1f5f9'} stroke={isClosedLoop ? '#0284c7' : '#94a3b8'} strokeWidth="2" />
            <text x="150" y="74" fontSize="14" fontWeight="bold" textAnchor="middle" fill={isClosedLoop ? '#0284c7' : '#94a3b8'}>
              {isClosedLoop ? 'Σ' : '—'}
            </text>

            <line x1="164" y1="70" x2="195" y2="70" stroke="#0284c7" strokeWidth="2" />

            {/* Controller */}
            <rect x="195" y="45" width="115" height="50" rx="8" fill="#eff6ff" stroke="#0284c7" strokeWidth="2" />
            <text x="252" y="68" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Controller</text>
            <text x="252" y="82" fontSize="9" textAnchor="middle" fill="#0284c7">PLC S7-1200</text>

            <line x1="310" y1="70" x2="350" y2="70" stroke="#0284c7" strokeWidth="2" />

            {/* Actuator */}
            <rect x="350" y="45" width="105" height="50" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="402" y="68" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#78350f">Actuator</text>
            <text x="402" y="82" fontSize="9" textAnchor="middle" fill="#d97706">SSR / Heating Coil</text>

            <line x1="455" y1="70" x2="495" y2="70" stroke="#d97706" strokeWidth="2" />

            {/* Process */}
            <rect x="495" y="40" width="115" height="60" rx="8" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
            <text x="552" y="68" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#14532d">Process</text>
            <text x="552" y="82" fontSize="9" textAnchor="middle" fill="#16a34a">Thermal Chamber</text>

            <line x1="610" y1="70" x2="665" y2="70" stroke="#16a34a" strokeWidth="2" />

            {/* Controlled Output */}
            <rect x="665" y="50" width="85" height="40" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="707" y="68" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">Output (PV)</text>
            <text x="707" y="82" fontSize="9" textAnchor="middle" fill="#16a34a" fontWeight="bold">{temp}°C</text>

            {/* Disturbance Arrow */}
            <line x1="552" y1="10" x2="552" y2="35" stroke={disturbance ? '#dc2626' : '#94a3b8'} strokeWidth="2" strokeDasharray="3 3" />
            <text x="552" y="8" fontSize="9" fontWeight="bold" textAnchor="middle" fill={disturbance ? '#dc2626' : '#64748b'}>
              {disturbance ? '⚠️ Disturbance: Cold Draft' : 'Disturbance'}
            </text>

            {/* Feedback Loop */}
            {isClosedLoop ? (
              <g>
                <line x1="635" y1="70" x2="635" y2="135" stroke="#0284c7" strokeWidth="2" />
                <line x1="635" y1="135" x2="480" y2="135" stroke="#0284c7" strokeWidth="2" />
                
                <rect x="365" y="115" width="115" height="40" rx="6" fill="#eff6ff" stroke="#0284c7" strokeWidth="1.5" />
                <text x="422" y="133" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Sensor</text>
                <text x="422" y="146" fontSize="8" textAnchor="middle" fill="#0284c7">PT100 / Thermocouple</text>

                <line x1="365" y1="135" x2="150" y2="135" stroke="#0284c7" strokeWidth="2" />
                <line x1="150" y1="135" x2="150" y2="88" stroke="#0284c7" strokeWidth="2" />
                <text x="140" y="105" fontSize="11" fontWeight="bold" fill="#dc2626">-</text>
              </g>
            ) : (
              <g opacity="0.3">
                <line x1="635" y1="70" x2="635" y2="135" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="635" y1="135" x2="150" y2="135" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="150" y1="135" x2="150" y2="88" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="390" y="130" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">
                  ❌ NO FEEDBACK PATH
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 3: Relay Hardwired vs PLC Comparison
═════════════════════════════════════════════════════════════════════════ */
function RelayVsPlcComparison() {
  const [requirementChanged, setRequirementChanged] = useState<boolean>(false);

  return (
    <div>
      {/* Requirement Scenario Box */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Real-World Factory Scenario
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1 mb-0.5">
              Two-Motor Conveyor: Sudden Production Specification Change
            </h3>
            <p className="text-xs text-slate-600 m-0">
              {requirementChanged
                ? 'New Specification: Motor 1 starts first -> 5s delay -> Motor 2 starts. UPON STOP: Motor 2 must stop first, 3s delay before Motor 1 stops.'
                : 'Initial Specification: Press Start -> Motor 1 starts. After 5 seconds, Motor 2 starts automatically.'}
            </p>
          </div>

          <button
            onClick={() => setRequirementChanged(!requirementChanged)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 ${
              requirementChanged
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {requirementChanged ? '↺ Revert to Initial Spec' : '⚡ Request Engineering Change'}
          </button>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Traditional Relay Cabinet */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗄️</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 m-0">1. Hardwired Relay Cabinet</h4>
                  <span className="text-[11px] text-slate-500">Electromechanical timers & contactors</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Pre-1970 Technology
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 font-mono text-xs">
              <div className="text-[11px] font-sans font-bold text-slate-700 mb-2">Panel Status:</div>
              {requirementChanged ? (
                <div className="space-y-2 text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200 text-[11px]">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🛑</span> MANDATORY SHUTDOWN & PHYSICAL REWIRING:
                  </div>
                  <div>• Purchase: 1 OFF-delay pneumatic timer + 2 auxiliary ice-cube relays.</div>
                  <div>• Remove 14 existing terminal ferrules, install new wire ducts.</div>
                  <div>• Factory Line Downtime: <strong>3 – 4 Hours</strong> (costly production loss).</div>
                  <div>• High risk of wiring errors, mechanical contact pitting over time.</div>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>• Bulky floor-standing enclosure (800x1200mm).</div>
                  <div>• Dozens of relays with complex point-to-point copper wiring.</div>
                  <div>• Continuous power consumption energizing mechanical coils.</div>
                  <div>• Difficult troubleshooting when contacts oxidize or fail.</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
            <strong className="text-slate-800 block mb-0.5">Core Limitation:</strong>
            Control logic is permanently locked into copper wires. Any algorithmic modification demands costly physical rewiring and machine downtime!
          </div>
        </div>

        {/* Right: Modern PLC Solution */}
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <div>
                  <h4 className="text-sm font-bold text-blue-950 m-0">2. Programmable Controller (PLC)</h4>
                  <span className="text-[11px] text-blue-700 font-medium">Logic Resides in Software Memory</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Modern Standard
              </span>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 mb-4 font-mono text-xs">
              <div className="text-[11px] font-sans font-bold text-slate-700 mb-2">PLC System Status:</div>
              {requirementChanged ? (
                <div className="space-y-2 text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200 text-[11px]">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚡</span> FIELD WIRING UNTOUCHED (100% PRESERVED):
                  </div>
                  <div>• No physical rewiring required!</div>
                  <div>• Open TIA Portal, insert a TOF timer block into OB1.</div>
                  <div>• Download to CPU in <strong>10 Seconds</strong> without interrupting field cables.</div>
                  <div>• Solid-state reliability: millions of trouble-free switching operations.</div>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>• Compact DIN-rail footprint (110x100mm).</div>
                  <div>• Minimal wiring: sensors wired to DI, contactors wired to DO.</div>
                  <div>• Real-time online monitoring (Go Online) with Watch Tables.</div>
                  <div>• Native Ethernet PROFINET networking and diagnostic buffer.</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 border border-blue-100">
            <strong className="text-blue-950 block mb-0.5">Revolutionary Advantage:</strong>
            Learning PLC is not merely learning a syntax; it is learning how to place logic in memory to <strong>make operational changes fast, inexpensive, and risk-free</strong>!
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 4: Hardware Architecture & Status LEDs
═════════════════════════════════════════════════════════════════════════ */
function HardwareAndLedExplorer() {
  const [cpuMode, setCpuMode] = useState<'run' | 'stop' | 'error' | 'maint'>('run');
  const [selectedBlock, setSelectedBlock] = useState<string>('cpu');

  const blocks: Record<string, { title: string; desc: string; specs: string[] }> = {
    cpu: {
      title: 'Central Processing Unit (CPU & Microprocessor)',
      desc: 'The central brain of the S7-1200 executing a real-time deterministic operating system (RTOS) and compiled user OB1 rungs.',
      specs: [
        'Execution speed: ~0.08 µs per boolean instruction',
        'Work Memory: 100 KB high-speed RAM',
        'Load Memory: 4 MB internal Flash (expandable up to 32 GB via SD card)',
        'Retentive Memory: 10 KB NVRAM (retains setpoints on power loss without battery)',
      ],
    },
    power: {
      title: 'Power Supply Module',
      desc: 'Regulates industrial 24VDC or 120/230VAC mains to provide isolated internal voltages for the processor and auxiliary sensors.',
      specs: [
        'Supply Voltage: 24 VDC (or 120/230 VAC depending on CPU part number)',
        'Permissible range: 20.4 VDC – 28.8 VDC',
        'Auxiliary Sensor Power Output: 24 VDC, up to 400 mA',
      ],
    },
    di: {
      title: 'Digital Input Section (14 DI · 24VDC)',
      desc: 'Interfaces field switches, pushbuttons, and proximity sensors. Optocouplers provide galvanic isolation against high-voltage surges.',
      specs: [
        '14 integrated digital inputs 24VDC (Sink or Source via 1M terminal)',
        'Logic 0 threshold: 0 – 5 VDC (< 1 mA)',
        'Logic 1 threshold: 15 – 30 VDC (4 mA nominal)',
        '6 integrated High-Speed Counters (HSC) up to 100 kHz',
      ],
    },
    do: {
      title: 'Digital Output Section (10 DO · Transistor 0.5A)',
      desc: 'Solid-state transistor outputs switching 24VDC to drive auxiliary relays, solenoid valves, or VFD control terminals.',
      specs: [
        '10 integrated transistor outputs (or 2A mechanical relays on ...-1BE40 models)',
        'Current capacity: 0.5A per transistor channel',
        'Supports 4 high-speed pulse outputs (PTO/PWM) up to 100 kHz',
      ],
    },
    profinet: {
      title: 'PROFINET Communication Port (RJ45)',
      desc: 'Real-time Industrial Ethernet port for engineering software (TIA Portal), HMI connection, and decentralized I/O.',
      specs: [
        'Data Rate: 10/100 Mbit/s Full Duplex with Auto-Crossover',
        'Protocols: PROFINET IO Controller/Device, S7 Communication, Modbus TCP, Open User Comms',
        'Shielded RJ45 industrial standard',
      ],
    },
  };

  return (
    <div>
      {/* Interactive LED State Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Diagnostics</span>
          <h3 className="text-sm font-bold text-slate-900 m-0">Inspect CPU Status LED Indicators</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCpuMode('run')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'run' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🟢 RUN (Normal)
          </button>
          <button
            onClick={() => setCpuMode('stop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'stop' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🟡 STOP (Halted)
          </button>
          <button
            onClick={() => setCpuMode('error')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'error' ? 'bg-rose-600 text-white shadow-xs animate-pulse' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🔴 ERROR (Fault)
          </button>
          <button
            onClick={() => setCpuMode('maint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'maint' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🟠 MAINT (Maintenance)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Front Panel Elevation (SVG) */}
        <div className="lg:col-span-7 bg-slate-100/70 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-700 mb-2">Click on any section to inspect technical specifications:</div>
          
          <svg viewBox="0 0 340 320" className="w-full max-w-[340px] h-auto drop-shadow-sm select-none">
            {/* CPU Chassis Base */}
            <rect x="20" y="20" width="300" height="280" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Top Terminal Strip */}
            <g onClick={() => setSelectedBlock('di')} className="cursor-pointer group">
              <rect x="35" y="30" width="270" height="40" rx="4" fill={selectedBlock === 'di' ? '#bae6fd' : '#f8fafc'} stroke="#64748b" strokeWidth="1.5" />
              <text x="170" y="54" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0369a1">INPUT TERMINAL STRIP (14 DI · 24VDC)</text>
            </g>

            {/* Central Display & Logo Area */}
            <rect x="35" y="78" width="270" height="150" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
            
            {/* Siemens Brand */}
            <text x="50" y="102" fontSize="13" fontWeight="900" fill="#00646e" letterSpacing="0.05em">SIEMENS</text>
            <text x="50" y="118" fontSize="11" fontWeight="bold" fill="#334155">SIMATIC S7-1200</text>
            <text x="50" y="132" fontSize="9" fill="#64748b">CPU 1214C DC/DC/DC</text>

            {/* Diagnostic LED Indicators */}
            <g transform="translate(185, 92)">
              <circle
                cx="15" cy="12" r="5"
                fill={cpuMode === 'run' ? '#16a34a' : cpuMode === 'stop' ? '#eab308' : '#94a3b8'}
                stroke="#334155" strokeWidth="1"
              />
              <text x="26" y="15" fontSize="8" fontWeight="bold" fill="#1e293b">RUN/STOP</text>

              <circle
                cx="15" cy="27" r="5"
                fill={cpuMode === 'error' ? '#dc2626' : '#94a3b8'}
                stroke="#334155" strokeWidth="1"
                className={cpuMode === 'error' ? 'animate-pulse' : ''}
              />
              <text x="26" y="30" fontSize="8" fontWeight="bold" fill={cpuMode === 'error' ? '#dc2626' : '#64748b'}>ERROR</text>

              <circle
                cx="15" cy="42" r="5"
                fill={cpuMode === 'maint' ? '#f59e0b' : '#94a3b8'}
                stroke="#334155" strokeWidth="1"
              />
              <text x="26" y="45" fontSize="8" fontWeight="bold" fill="#64748b">MAINT</text>
            </g>

            {/* CPU Core Block */}
            <g onClick={() => setSelectedBlock('cpu')} className="cursor-pointer">
              <rect x="50" y="150" width="130" height="65" rx="6" fill={selectedBlock === 'cpu' ? '#dbeafe' : '#ffffff'} stroke="#3b82f6" strokeWidth="1.5" />
              <text x="115" y="178" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e40af">CPU & MEMORY</text>
              <text x="115" y="195" fontSize="8" textAnchor="middle" fill="#64748b">Load / Work / Retentive</text>
            </g>

            {/* PROFINET Port */}
            <g onClick={() => setSelectedBlock('profinet')} className="cursor-pointer">
              <rect x="195" y="150" width="110" height="65" rx="6" fill={selectedBlock === 'profinet' ? '#ccfbf1' : '#ffffff'} stroke="#0d9488" strokeWidth="1.5" />
              <text x="250" y="178" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f766e">PROFINET</text>
              <text x="250" y="195" fontSize="8" textAnchor="middle" fill="#64748b">RJ45 Port (100Mbps)</text>
            </g>

            {/* Bottom Terminal Strip */}
            <g onClick={() => setSelectedBlock('do')} className="cursor-pointer">
              <rect x="35" y="235" width="270" height="40" rx="4" fill={selectedBlock === 'do' ? '#fee2e2' : '#f8fafc'} stroke="#64748b" strokeWidth="1.5" />
              <text x="170" y="259" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#991b1b">OUTPUT TERMINAL STRIP (10 DO · TRANSISTOR 0.5A)</text>
            </g>
          </svg>

          {/* LED Diagnosis Description */}
          <div className="w-full mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
            <strong className="text-slate-900 block mb-1">Diagnostic Meaning of Current LED Pattern:</strong>
            {cpuMode === 'run' && (
              <p className="text-emerald-800 m-0">
                🟢 <strong>RUN (Solid Green):</strong> The CPU is actively executing the OB1 user program. Field outputs are updated cyclically.
              </p>
            )}
            {cpuMode === 'stop' && (
              <p className="text-amber-800 m-0">
                🟡 <strong>STOP (Solid Yellow):</strong> The CPU is halted. All digital and analog outputs are forced into a safe de-energized state (0V).
              </p>
            )}
            {cpuMode === 'error' && (
              <p className="text-rose-800 m-0">
                🔴 <strong>ERROR (Flashing Red):</strong> Hardware fault, wire break, expansion module timeout, or fatal programming error (e.g. divide-by-zero). Open TIA Portal <em>Diagnostic Buffer</em> to read the event timestamp!
              </p>
            )}
            {cpuMode === 'maint' && (
              <p className="text-amber-800 m-0">
                🟠 <strong>MAINT (Solid Yellow):</strong> Maintenance demanded, RTC backup capacitor discharged, or unformatted Memory Card detected.
              </p>
            )}
          </div>
        </div>

        {/* Right: Selected Block Technical Specs */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Technical Specifications
              </span>
              <span className="text-xs text-slate-400 font-mono">S7-1200 Catalog</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              {blocks[selectedBlock].title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {blocks[selectedBlock].desc}
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Catalog Parameters:</div>
              <ul className="m-0 p-0 list-none space-y-1.5 text-xs text-slate-600">
                {blocks[selectedBlock].specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            💡 Click on other sections on the interactive CPU illustration to inspect!
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 5: IEC 61131-3 Languages Showcase (LAD / FBD / SCL)
═════════════════════════════════════════════════════════════════════════ */
function IecLanguagesShowcase() {
  const [selectedLang, setSelectedLang] = useState<'lad' | 'fbd' | 'scl'>('lad');
  const [isMotorOn, setIsMotorOn] = useState<boolean>(false);
  const [isStartPressed, setIsStartPressed] = useState<boolean>(false);

  const handleStart = () => {
    setIsStartPressed(true);
    setIsMotorOn(true);
    setTimeout(() => setIsStartPressed(false), 600);
  };

  const handleStop = () => {
    setIsMotorOn(false);
  };

  return (
    <div>
      {/* Header & Language Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">IEC 61131-3 Standard</span>
          <h3 className="text-sm font-bold text-slate-900 m-0">Comparing 3 Standard Languages on the Same Circuit</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setSelectedLang('lad')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'lad' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            LAD (Ladder Diagram)
          </button>
          <button
            onClick={() => setSelectedLang('fbd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'fbd' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            FBD (Function Block)
          </button>
          <button
            onClick={() => setSelectedLang('scl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'scl' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            SCL (Structured Text)
          </button>
        </div>
      </div>

      {/* Interactive circuit tester */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs">
        <span className="font-bold text-blue-900">Interactive Circuit Test:</span>
        <button
          onClick={handleStart}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs"
        >
          Press START Button
        </button>
        <button
          onClick={handleStop}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow-xs"
        >
          Press STOP Button
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span>Motor State:</span>
          <span className={`px-2 py-0.5 rounded font-bold font-mono ${isMotorOn ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'}`}>
            {isMotorOn ? 'RUNNING (Q0.0=1)' : 'STOPPED (Q0.0=0)'}
          </span>
        </div>
      </div>

      {/* Code Display Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        {selectedLang === 'lad' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 m-0">LAD — Ladder Diagram</h4>
                <p className="text-xs text-slate-500 m-0">Simulates electromechanical relay contact rails. Most widely used in industrial electrical engineering.</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Electrical & Controls</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <svg viewBox="0 0 460 110" className="w-full h-auto bg-white rounded border border-slate-200">
                {/* Left/Right rails */}
                <line x1="15" y1="10" x2="15" y2="100" stroke="#0284c7" strokeWidth="3" />
                <line x1="445" y1="10" x2="445" y2="100" stroke="#0284c7" strokeWidth="3" />

                {/* Main line */}
                <line x1="15" y1="40" x2="70" y2="40" stroke={isStartPressed || isMotorOn ? '#16a34a' : '#94a3b8'} strokeWidth="2.5" />

                {/* Start NO Contact */}
                <line x1="70" y1="28" x2="70" y2="52" stroke="#334155" strokeWidth="2.5" />
                <line x1="88" y1="28" x2="88" y2="52" stroke="#334155" strokeWidth="2.5" />
                <text x="79" y="20" fontSize="10" textAnchor="middle" fill="#0369a1" fontWeight="bold">"btn_Start"</text>
                <text x="79" y="64" fontSize="8" textAnchor="middle" fill="#64748b">I0.0</text>
                {isStartPressed && <line x1="70" y1="40" x2="88" y2="40" stroke="#16a34a" strokeWidth="3" />}

                {/* Seal-in branch */}
                <line x1="50" y1="40" x2="50" y2="80" stroke="#94a3b8" strokeWidth="2" />
                <line x1="50" y1="80" x2="70" y2="80" stroke="#94a3b8" strokeWidth="2" />
                <line x1="70" y1="68" x2="70" y2="92" stroke="#334155" strokeWidth="2.5" />
                <line x1="88" y1="68" x2="88" y2="92" stroke="#334155" strokeWidth="2.5" />
                <text x="79" y="103" fontSize="9" textAnchor="middle" fill="#0369a1" fontWeight="bold">"motor_Q0_0"</text>
                {isMotorOn && <line x1="70" y1="80" x2="88" y2="80" stroke="#16a34a" strokeWidth="3" />}
                <line x1="88" y1="80" x2="105" y2="80" stroke="#94a3b8" strokeWidth="2" />
                <line x1="105" y1="80" x2="105" y2="40" stroke="#94a3b8" strokeWidth="2" />

                <line x1="88" y1="40" x2="160" y2="40" stroke={isStartPressed || isMotorOn ? '#16a34a' : '#94a3b8'} strokeWidth="2.5" />

                {/* Stop NC Contact */}
                <line x1="160" y1="28" x2="160" y2="52" stroke="#334155" strokeWidth="2.5" />
                <line x1="178" y1="28" x2="178" y2="52" stroke="#334155" strokeWidth="2.5" />
                <line x1="158" y1="54" x2="180" y2="26" stroke="#dc2626" strokeWidth="2" />
                <text x="169" y="20" fontSize="10" textAnchor="middle" fill="#dc2626" fontWeight="bold">"btn_Stop"</text>
                <text x="169" y="64" fontSize="8" textAnchor="middle" fill="#64748b">I0.1 (NC)</text>

                {/* Line to coil */}
                <line x1="178" y1="40" x2="350" y2="40" stroke={isMotorOn ? '#16a34a' : '#94a3b8'} strokeWidth="2.5" />

                {/* Motor Coil */}
                <path d="M 350 25 Q 360 40 350 55" fill="none" stroke="#334155" strokeWidth="2.5" />
                <path d="M 375 25 Q 365 40 375 55" fill="none" stroke="#334155" strokeWidth="2.5" />
                <text x="362" y="20" fontSize="10" textAnchor="middle" fill="#16a34a" fontWeight="bold">"motor_Q0_0"</text>
                <text x="362" y="65" fontSize="8" textAnchor="middle" fill="#64748b">Q0.0</text>

                <line x1="375" y1="40" x2="445" y2="40" stroke={isMotorOn ? '#16a34a' : '#94a3b8'} strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        )}

        {selectedLang === 'fbd' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 m-0">FBD — Function Block Diagram</h4>
                <p className="text-xs text-slate-500 m-0">Based on interconnected boolean logic gates (AND, OR, NOT). Natural for electronics engineers.</p>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Digital Electronics</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <svg viewBox="0 0 460 110" className="w-full h-auto bg-white rounded border border-slate-200">
                {/* OR Block */}
                <rect x="80" y="20" width="60" height="60" rx="4" fill="#eff6ff" stroke="#0284c7" strokeWidth="2" />
                <text x="110" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#0369a1">&gt;=1</text>
                <text x="25" y="38" fontSize="9" fontWeight="bold" fill="#334155">"btn_Start"</text>
                <line x1="50" y1="35" x2="80" y2="35" stroke="#94a3b8" strokeWidth="2" />
                <text x="25" y="68" fontSize="9" fontWeight="bold" fill="#334155">"motor_Q0_0"</text>
                <line x1="50" y1="65" x2="80" y2="65" stroke="#94a3b8" strokeWidth="2" />

                {/* OR Output to AND */}
                <line x1="140" y1="50" x2="220" y2="50" stroke={isStartPressed || isMotorOn ? '#16a34a' : '#94a3b8'} strokeWidth="2" />

                {/* AND Block */}
                <rect x="220" y="25" width="60" height="60" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                <text x="250" y="52" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#15803d">&amp;</text>
                
                {/* Inverted Stop Input */}
                <text x="165" y="80" fontSize="9" fontWeight="bold" fill="#dc2626">"btn_Stop"</text>
                <line x1="190" y1="75" x2="212" y2="75" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="216" cy="75" r="4" fill="none" stroke="#dc2626" strokeWidth="2" />

                {/* Output */}
                <line x1="280" y1="55" x2="360" y2="55" stroke={isMotorOn ? '#16a34a' : '#94a3b8'} strokeWidth="2" />
                <rect x="360" y="40" width="85" height="30" rx="4" fill={isMotorOn ? '#dcfce7' : '#f1f5f9'} stroke="#16a34a" strokeWidth="1.5" />
                <text x="402" y="59" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#14532d">"motor_Q0_0"</text>
              </svg>
            </div>
          </div>
        )}

        {selectedLang === 'scl' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 m-0">SCL — Structured Control Language</h4>
                <p className="text-xs text-slate-500 m-0">High-level structured text resembling Pascal / C. Powerful for math formulas, arrays, and algorithms.</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Computer Science & Algorithms</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre className="m-0 leading-relaxed">
{`// ─────────────────────────────────────────────────────────────
// S7-1200 SCL: Motor Start / Seal-In Interlock Logic
// ─────────────────────────────────────────────────────────────
IF ("btn_Start" OR "motor_Q0_0") AND NOT "btn_Stop" THEN
    "motor_Q0_0" := TRUE;   // Motor latched and running
ELSE
    "motor_Q0_0" := FALSE;  // Stop command overrides and unlatches
END_IF;

// Evaluated Variable States:
"btn_Start"  := ${isStartPressed ? 'TRUE' : 'FALSE'};
"btn_Stop"   := FALSE;
"motor_Q0_0" => ${isMotorOn ? 'TRUE (Active 380VAC)' : 'FALSE (De-energized)'};`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

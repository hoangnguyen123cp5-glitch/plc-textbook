'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  slug: string;
  sectionIndex: number;
  sectionTitle: string;
}

export default function LessonSectionAnimation({ slug, sectionIndex, sectionTitle }: Props) {
  // Lesson 1 Section Animations
  if (slug === '01-programmable-control') {
    // Section 1.2: Open-Loop vs Closed-Loop
    if (sectionIndex === 1 || sectionTitle.includes('1.2')) {
      return <Section1_2LoopAnimation />;
    }
    // Section 1.1: 5 Core Elements of Control System
    if (sectionIndex === 0 || sectionTitle.includes('1.1')) {
      return <Section1_1FiveElementsAnimation />;
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
   SECTION 1.2: OPEN-LOOP VS CLOSED-LOOP SIMULATOR
═════════════════════════════════════════════════════════════════════════ */
function Section1_2LoopAnimation() {
  const [activeScenario, setActiveScenario] = useState<'light' | 'oven'>('light');

  return (
    <div className="my-5 p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-blue-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
            🎬
          </span>
          <h4 className="text-sm font-bold text-slate-900 m-0">
            Interactive Simulation: Open-Loop vs Closed-Loop Control
          </h4>
        </div>

        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveScenario('light')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeScenario === 'light' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            💡 Street Light (Illuminance)
          </button>
          <button
            onClick={() => setActiveScenario('oven')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeScenario === 'oven' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            🔥 Thermal Oven (Temperature)
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
  const [timeHour, setTimeHour] = useState<number>(15); // 15:00 (3 PM)

  // In Open Loop: Light is ON only between 18:00 and 06:00
  const openLoopLampOn = timeHour >= 18 || timeHour < 6;

  // In Closed Loop: Sensor measures Lux.
  const daylightLux = (timeHour >= 18 || timeHour < 6) ? 5 : isStormy ? 25 : 850;
  // Lamp turns ON if measured light < 60 Lux
  const closedLoopLampOn = daylightLux < 60;

  const lampState = isClosedLoop ? closedLoopLampOn : openLoopLampOn;

  return (
    <div>
      {/* Controls row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Mode selector */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Control Topology:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setIsClosedLoop(false)}
              className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all ${
                !isClosedLoop
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Open Loop (Timer)
            </button>
            <button
              onClick={() => setIsClosedLoop(true)}
              className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all ${
                isClosedLoop
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Closed Loop (LDR)
            </button>
          </div>
        </div>

        {/* Time of day slider */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-slate-600">Time of Day:</span>
            <span className="font-mono font-bold text-blue-700">{timeHour}:00</span>
          </div>
          <input
            type="range"
            min={0}
            max={23}
            value={timeHour}
            onChange={(e) => setTimeHour(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>00:00 (Night)</span>
            <span>12:00 (Noon)</span>
            <span>23:00 (Evening)</span>
          </div>
        </div>

        {/* Weather Disturbance */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Environmental Disturbance:
          </span>
          <button
            onClick={() => setIsStormy(!isStormy)}
            className={`w-full py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isStormy
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{isStormy ? '⛈️ SUDDEN STORM & DARK SKY' : '☀️ Clear Normal Daylight'}</span>
          </button>
        </div>
      </div>

      {/* Visual Simulation Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900 text-white p-4 rounded-xl mb-4 overflow-hidden relative">
        {/* Sky background illumination */}
        <div
          className="absolute inset-0 transition-all duration-700 pointer-events-none"
          style={{
            background:
              daylightLux > 500
                ? 'linear-gradient(to bottom, #38bdf8 0%, #bae6fd 100%)'
                : daylightLux > 100
                ? 'linear-gradient(to bottom, #64748b 0%, #94a3b8 100%)'
                : isStormy
                ? 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)'
                : 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)',
          }}
        />

        {/* Left: Street Lamp Illustration */}
        <div className="md:col-span-5 relative z-10 flex flex-col items-center justify-center py-2">
          {/* Light Bulb & Glow */}
          <div className="relative flex flex-col items-center">
            {/* Lamp Head */}
            <div className="w-16 h-8 bg-slate-700 rounded-t-full border border-slate-600 relative">
              {/* Sensor eye on top (in closed loop) */}
              {isClosedLoop && (
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-cyan-400 rounded-t-sm border border-cyan-200 animate-pulse"
                  title="Photocell LDR Sensor"
                />
              )}
            </div>

            {/* Glowing Lamp */}
            <div
              className={`w-12 h-10 rounded-b-xl transition-all duration-300 flex items-center justify-center ${
                lampState
                  ? 'bg-amber-200 shadow-[0_0_50px_20px_rgba(251,191,36,0.8)] border border-amber-100'
                  : 'bg-slate-600/70 border border-slate-500'
              }`}
            >
              <span className="text-xl">{lampState ? '💡' : '⚪'}</span>
            </div>

            {/* Pole */}
            <div className="w-2.5 h-24 bg-slate-400 border-x border-slate-500" />
            <div className="w-12 h-3 bg-slate-600 rounded" />
          </div>

          <div className="mt-2 text-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold inline-block shadow-sm ${
                lampState ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'
              }`}
            >
              STREET LIGHT: {lampState ? 'ENERGIZED (ON)' : 'DE-ENERGIZED (OFF)'}
            </span>
          </div>
        </div>

        {/* Right: Real-time Analysis & State Explanation */}
        <div className="md:col-span-7 relative z-10 bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl border border-slate-700 text-xs text-slate-200 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Operating State Diagnostics:
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isClosedLoop ? 'bg-blue-900 text-blue-200' : 'bg-amber-900 text-amber-200'}`}>
              {isClosedLoop ? 'Closed-Loop System' : 'Open-Loop System'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              • Current Time: <strong className="text-white font-mono">{timeHour}:00</strong>
            </div>
            <div>
              • Ambient Illuminance: <strong className="text-cyan-400 font-mono">{daylightLux} Lux</strong>
            </div>
          </div>

          {/* Core Lesson Outcome */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700">
            {!isClosedLoop ? (
              <div>
                <strong className="text-amber-400 block mb-1">
                  ⚠️ Open-Loop (Timer Schedule Only):
                </strong>
                {timeHour >= 18 || timeHour < 6 ? (
                  <span className="text-slate-300">Scheduled time window active (night) ➔ Timer contact closes, lamp turns ON.</span>
                ) : isStormy ? (
                  <span className="text-rose-400 font-bold">
                    ❌ OPEN-LOOP FLAW: A severe storm causes pitch-black darkness at {timeHour}:00 (hazardous for traffic), but because the timer hasn&apos;t reached 18:00, the lamp REMAINS OFF! The open-loop controller has no feedback.
                  </span>
                ) : (
                  <span className="text-slate-300">Daytime before 18:00 ➔ Lamp stays OFF per fixed timetable.</span>
                )}
              </div>
            ) : (
              <div>
                <strong className="text-emerald-400 block mb-1">
                  ✅ Closed-Loop (LDR Photocell Feedback):
                </strong>
                {isStormy && timeHour < 18 ? (
                  <span className="text-emerald-300 font-bold">
                    🎯 AUTOMATIC DISTURBANCE REJECTION: Even though it is {timeHour}:00, the LDR sensor detects illuminance plunging to {daylightLux} Lux (&lt; 60 Lux) ➔ PLC immediately ENERGIZES THE LAMP, ensuring road safety!
                  </span>
                ) : closedLoopLampOn ? (
                  <span className="text-slate-300">Ambient light is {daylightLux} Lux (&lt; 60 Lux) ➔ Sensor feedback signals low light, PLC keeps lamp energized.</span>
                ) : (
                  <span className="text-slate-300">Ambient light is {daylightLux} Lux (&gt; 60 Lux) ➔ Sensor feedback confirms daylight, PLC turns off lamp to save power.</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Diagram Flow for Section 1.2 */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
        <div className="font-bold text-slate-700 mb-2">Signal Flow Diagram:</div>
        {!isClosedLoop ? (
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-800">
              Schedule Setpoint (18:00)
            </span>
            <span className="text-slate-400">──▶</span>
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded font-bold text-amber-800">
              Timer Relay
            </span>
            <span className="text-slate-400">──▶</span>
            <span className="px-2.5 py-1 bg-blue-50 border border-blue-300 rounded font-bold text-blue-800">
              Street Light (Actuator / Load)
            </span>
            <span className="ml-auto text-rose-600 font-sans font-medium">
              (One-way Feedforward — No Sensor Feedback)
            </span>
          </div>
        ) : (
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-800">
                Lux Threshold (60 Lux)
              </span>
              <span className="text-slate-400">──▶</span>
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-300 rounded text-blue-800 font-bold">
                Comparator (Σ)
              </span>
              <span className="text-slate-400">──▶</span>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-300 rounded font-bold text-blue-800">
                PLC Controller
              </span>
              <span className="text-slate-400">──▶</span>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-800">
                Street Light (Load)
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-800 bg-cyan-50/70 p-1.5 rounded border border-cyan-200">
              <span className="font-sans font-bold">Feedback Loop:</span>
              <span>Actual Illuminance ──▶ Photocell LDR ──▶ Return signal to Comparator to calculate error e = SP − PV!</span>
            </div>
          </div>
        )}
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
      // Closed loop maintains target temp even if door is open
      setTemperature(doorOpen ? 58.5 : 60);
    } else {
      // Open loop drops drastically if door open
      setTemperature(doorOpen ? 37.2 : 60);
    }
  }, [isClosedLoop, doorOpen]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Oven Mode:</span>
          <button
            onClick={() => setIsClosedLoop(false)}
            className={`px-3 py-1 rounded text-xs font-bold ${!isClosedLoop ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Open Loop (Fixed 50% Power)
          </button>
          <button
            onClick={() => setIsClosedLoop(true)}
            className={`px-3 py-1 rounded text-xs font-bold ${isClosedLoop ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Closed Loop (PT100 RTD + PLC PID)
          </button>
        </div>

        <button
          onClick={() => setDoorOpen(!doorOpen)}
          className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
            doorOpen ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {doorOpen ? '🚪 Oven Door OPEN (Cold Draft Inrush)' : '🚪 Oven Door CLOSED'}
        </button>
      </div>

      <div className="p-4 bg-slate-900 text-white rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="text-center sm:text-left">
          <div className="text-xs text-slate-400">Measured Chamber Temperature:</div>
          <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1">
            {temperature}°C
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Desired Setpoint: <strong>{targetTemp}°C</strong>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-800 p-3 rounded-lg border border-slate-700">
          {!isClosedLoop ? (
            <div>
              <strong className="text-amber-400 block mb-1">Open-Loop System:</strong>
              {doorOpen ? (
                <span className="text-rose-400">
                  ⚠️ When the door opens to cold ambient air, temperature plunges to {temperature}°C! Controller applies static 50% power and cannot compensate, spoiling batch quality.
                </span>
              ) : (
                <span>Stable undisturbed environment: temperature reaches ~60°C purely from initial bench calibration.</span>
              )}
            </div>
          ) : (
            <div>
              <strong className="text-emerald-400 block mb-1">Closed-Loop System:</strong>
              {doorOpen ? (
                <span className="text-emerald-300">
                  🎯 PT100 sensor immediately detects heat loss ➔ PLC ramps heater output to 95%, stabilizing the chamber right back at {temperature}°C!
                </span>
              ) : (
                <span>Continuous sensor feedback maintains setpoint at precisely 60°C with optimal energy modulation.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.1: 5 CORE FUNCTIONAL ELEMENTS OF CONTROL SYSTEMS
═════════════════════════════════════════════════════════════════════════ */
function Section1_1FiveElementsAnimation() {
  const [activeBlock, setActiveBlock] = useState<number>(2); // 2: Controller

  const elements = [
    { id: 0, title: '1. Setpoint (SP)', sub: 'Reference Input', desc: 'The target command or desired value set by an operator or recipe program (e.g., target temperature 60°C, conveyor speed 1.5 m/s).' },
    { id: 1, title: '2. Comparator', sub: 'Error Detector', desc: 'Computes the instantaneous control error e(t) = SP − PV between the setpoint and the actual process variable measured from the plant.' },
    { id: 2, title: '3. Controller', sub: 'PLC / CPU Logic', desc: 'The decision-making computing brain that processes control algorithms (logic, timers, PID) to produce corrective manipulated variables.' },
    { id: 3, title: '4. Actuator', sub: 'Final Control Element', desc: 'Transduces low-power electrical output signals into physical mechanical, thermal, or fluid action: VFDs, motors, control valves, contactors.' },
    { id: 4, title: '5. Feedback Sensor', sub: 'Measurement Element', desc: 'Measures the output process variable (PV) directly from the physical plant and converts it into standard analog/digital signals back to the controller.' },
  ];

  return (
    <div className="my-5 p-4 bg-slate-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🎬</span>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0">
          Interactive Architecture: 5 Core Elements of Every Control System
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
        {elements.map((el) => (
          <button
            key={el.id}
            onClick={() => setActiveBlock(el.id)}
            className={`p-2 rounded-lg text-left transition-all border ${
              activeBlock === el.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-[11px] font-bold">{el.title}</div>
            <div className={`text-[10px] ${activeBlock === el.id ? 'text-blue-100' : 'text-slate-400'}`}>
              {el.sub}
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
        <strong className="text-blue-700 block mb-1">{elements[activeBlock].title} ({elements[activeBlock].sub}):</strong>
        {elements[activeBlock].desc}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.3: RELAY VS PLC MINI COMPARISON
═════════════════════════════════════════════════════════════════════════ */
function Section1_3RelayVsPlcMiniAnimation() {
  return (
    <div className="my-4 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-slate-700">
      <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
        <span>⚡</span> Core Technical Distinction: Hardwired vs Programmable Logic Control:
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
          <strong className="text-amber-800 block mb-0.5">🗄️ Hardwired Relay Panel:</strong>
          Control logic is physically hardwired into copper cables and relay coils. Any change in operational sequence requires power disconnection, mechanical rewiring, and adding physical hardware.
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-blue-200">
          <strong className="text-blue-800 block mb-0.5">💻 Programmable Logic Controller (PLC):</strong>
          Control logic resides in CPU software memory. Physical field wiring to I/O screw terminals remains 100% static; program updates and recipe changes download in seconds via Ethernet.
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   SECTION 1.8: MINI SCAN CYCLE FLOW
═════════════════════════════════════════════════════════════════════════ */
function Section1_8ScanCycleMiniAnimation() {
  return (
    <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
      <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
        <span>🔄</span> 4 Sequential Phases of the PLC Scan Cycle:
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded font-bold text-blue-800">
          1. Read Inputs<br/><span className="text-[10px] font-normal text-slate-500">Copy DI into PII</span>
        </div>
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded font-bold text-emerald-800">
          2. Execute OB1<br/><span className="text-[10px] font-normal text-slate-500">Scan rungs top-to-bottom</span>
        </div>
        <div className="p-2 bg-amber-50 border border-amber-200 rounded font-bold text-amber-800">
          3. Housekeeping<br/><span className="text-[10px] font-normal text-slate-500">Self-diagnostics & Comms</span>
        </div>
        <div className="p-2 bg-rose-50 border border-rose-200 rounded font-bold text-rose-800">
          4. Write Outputs<br/><span className="text-[10px] font-normal text-slate-500">Copy PIQ to physical DO</span>
        </div>
      </div>
    </div>
  );
}

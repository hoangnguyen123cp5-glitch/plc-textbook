'use client';

import React, { useState } from 'react';

export default function PowerBudgetCalculator() {
  const [cpuModel, setCpuModel] = useState<'1212C' | '1214C' | '1215C'>('1214C');
  const [numSmDi, setNumSmDi] = useState(2); // SM 1221 16DI
  const [numSmDo, setNumSmDo] = useState(2); // SM 1222 16DO
  const [numSmAi, setNumSmAi] = useState(1); // SM 1231 4AI
  const [activeSolLoads, setActiveSolLoads] = useState(8); // 8 active DC solenoid valves (0.5A each)
  const [sensorCount, setSensorCount] = useState(24); // 24 proximity sensors (20mA each)

  // Calculations
  const cpuInternalCurrent = cpuModel === '1212C' ? 0.35 : cpuModel === '1214C' ? 0.5 : 0.6; // Amperes
  const maxBackplaneLimit = cpuModel === '1212C' ? 1000 : 1600; // mA 5VDC
  
  // Backplane 5V draw (mA)
  const backplane5VDraw = (numSmDi * 130) + (numSmDo * 140) + (numSmAi * 80);
  const backplaneOk = backplane5VDraw <= maxBackplaneLimit;

  // External 24VDC Field Load Current (Amperes)
  const sensorCurrent = (sensorCount * 0.02); // 20mA each
  const solenoidCurrent = (activeSolLoads * 0.5); // 0.5A each
  const module24VConsumption = (numSmDi * 0.05) + (numSmDo * 0.08) + (numSmAi * 0.06);

  const totalCurrent24V = parseFloat((cpuInternalCurrent + sensorCurrent + solenoidCurrent + module24VConsumption).toFixed(2));
  const recommendedPsuAmps = totalCurrent24V <= 3.5 ? 5.0 : totalCurrent24V <= 7.0 ? 10.0 : 20.0;
  const psuLoadingPercent = Math.round((totalCurrent24V / recommendedPsuAmps) * 100);

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
          <span style={{ fontSize: '18px' }}>⚡</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            24VDC System Power & Backplane Bus Budget Sizer
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '4px 8px', borderRadius: '4px' }}>
          S7-1200 Panel Engineering
        </span>
      </div>

      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
        Adjust CPU tier, expansion cards, field sensors, and inductive solenoid loads to calculate the total current consumption and determine the required SITOP regulated power supply rating:
      </p>

      {/* Control sliders & selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
            CPU Model (Max {cpuModel === '1212C' ? '2' : '8'} SM Modules)
          </label>
          <select
            value={cpuModel}
            onChange={(e) => setCpuModel(e.target.value as any)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }}
          >
            <option value="1212C">CPU 1212C (1000 mA 5V Bus)</option>
            <option value="1214C">CPU 1214C (1600 mA 5V Bus)</option>
            <option value="1215C">CPU 1215C (1600 mA 5V Bus)</option>
          </select>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
            <span>SM 1221 DI (16 DI cards):</span>
            <span style={{ color: '#0284c7' }}>{numSmDi} cards</span>
          </div>
          <input
            type="range" min="0" max="4" value={numSmDi}
            onChange={(e) => setNumSmDi(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
            <span>SM 1222 DO (16 DO cards):</span>
            <span style={{ color: '#0284c7' }}>{numSmDo} cards</span>
          </div>
          <input
            type="range" min="0" max="4" value={numSmDo}
            onChange={(e) => setNumSmDo(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
            <span>Active 24VDC Solenoids (0.5A):</span>
            <span style={{ color: '#0284c7' }}>{activeSolLoads} valves</span>
          </div>
          <input
            type="range" min="0" max="20" value={activeSolLoads}
            onChange={(e) => setActiveSolLoads(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#0284c7' }}
          />
        </div>
      </div>

      {/* Engineering Results Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {/* Total 24V Current */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total 24VDC Current</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {totalCurrent24V} A
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            CPU: {cpuInternalCurrent}A · Field Loads: {(sensorCurrent + solenoidCurrent).toFixed(2)}A
          </div>
        </div>

        {/* Recommended SITOP PSU */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Recommended PSU</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
            SITOP 24V / {recommendedPsuAmps}A
          </div>
          <div style={{ fontSize: '11px', color: '#166534' }}>
            PSU Operating Load: <strong>{psuLoadingPercent}%</strong> (Safe Headroom)
          </div>
        </div>

        {/* Backplane 5V Bus */}
        <div style={{ background: backplaneOk ? '#f0f9ff' : '#fef2f2', border: `1px solid ${backplaneOk ? '#bae6fd' : '#fecaca'}`, borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: backplaneOk ? '#0369a1' : '#b91c1c', textTransform: 'uppercase' }}>Backplane 5V Logic</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: backplaneOk ? '#0284c7' : '#dc2626', margin: '4px 0' }}>
            {backplane5VDraw} / {maxBackplaneLimit} mA
          </div>
          <div style={{ fontSize: '11px', color: backplaneOk ? '#0369a1' : '#b91c1c' }}>
            {backplaneOk ? '✓ Within CPU power budget' : '⚠️ Bus Overload! Reduce SM cards'}
          </div>
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
        💡 <strong>Design Margin Standard:</strong> Professional engineering rules mandate sizing 24VDC power supplies with at least <strong>30% headroom</strong> ({Math.round(totalCurrent24V * 1.3 * 10) / 10} A minimum required capacity) to absorb inductive inrush surges from multiple contactors and solenoid valves energizing at the same scan cycle.
      </div>
    </div>
  );
}

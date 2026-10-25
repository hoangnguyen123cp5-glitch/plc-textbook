'use client';

import React, { useState } from 'react';

interface MigrationScenario {
  sourceFamily: string;
  sourceDesc: string;
  targetFamily: string;
  targetCpu: string;
  softwareTool: string;
  automationRate: string;
  manualTasks: string[];
  hardwareWiringSolution: string;
  rollbackStrategy: string;
}

const SCENARIOS: MigrationScenario[] = [
  {
    sourceFamily: 'S7-200 (STEP 7 Micro/WIN)',
    sourceDesc: 'Legacy compact micro-PLC installed between 1995–2010. Discontinued spare parts.',
    targetFamily: 'SIMATIC S7-1200',
    targetCpu: 'CPU 1214C DC/DC/DC or 1215C',
    softwareTool: 'Manual Code Re-Engineering (No automatic converter)',
    automationRate: '0% Automatic (100% Structured Rewrite)',
    manualTasks: [
      'Export tag list and I/O assignments to Excel as baseline bridge document',
      'Rewrite discrete ladder rungs into standard IEC 61131-3 LAD in TIA Portal V19',
      'Replace proprietary S7-200 timers (T32/T96) with standardized IEC TON/TOF blocks',
      'Upgrade legacy TD200 text displays to modern SIMATIC KTP400/KTP700 Basic HMI',
    ],
    hardwareWiringSolution: 'New DIN rail layout; rewire field sensors to removable push-in terminal blocks.',
    rollbackStrategy: 'Mount new S7-1200 side-by-side on spare DIN rail space; preserve legacy S7-200 until 48-hour continuous test passes.',
  },
  {
    sourceFamily: 'S7-300 (STEP 7 Classic V5.5)',
    sourceDesc: 'Modular workhorse PLC with active backplane bus and PROFIBUS-DP remote I/O.',
    targetFamily: 'SIMATIC S7-1500',
    targetCpu: 'CPU 1515-2 PN or CPU 1516-3 PN/DP',
    softwareTool: 'TIA Portal Migration Tool V19 (Automated Project Import)',
    automationRate: '70% – 85% Automated Code Conversion',
    manualTasks: [
      'Resolve "Check Block Consistency" errors in STEP 7 V5.5 prior to export',
      'Convert legacy accumulator-based STL indirect pointers (AR1/AR2) into symbolic SCL',
      'Reconfigure hardware rack: map legacy SM 321/322 to ET 200MP / ET 200SP modules',
      'Convert Standard DBs to Optimized Block Access for 5x performance gains',
    ],
    hardwareWiringSolution: 'Siemens Front-Connector Wiring Adapters: snap directly onto existing S7-300 terminal strips without unscrewing field wires.',
    rollbackStrategy: 'Keep S7-300 rack mounted in cabinet; if SAT fails, unplug wiring adapters back to S7-300 front connectors within 15 minutes.',
  },
  {
    sourceFamily: 'S7-400 (Process & Large Machine)',
    sourceDesc: 'High-availability process controller with redundant racks and multi-computing.',
    targetFamily: 'SIMATIC S7-1500R/H Redundant',
    targetCpu: 'CPU 1517H-3 PN Redundant System',
    softwareTool: 'TIA Portal Migration Tool + PCS 7 Modernization Bridge',
    automationRate: '60% – 75% Automated Conversion',
    manualTasks: [
      'Synchronize dual-redundant PROFINET fiber-optic ring network (MRP)',
      'Migrate legacy WinCC V7 SCADA tags and alarms to WinCC Unified',
      'Validate failover bumpless switchover times (< 50 ms)',
      'Conduct 100% loop check across distributed ET 200SP remote I/O drops',
    ],
    hardwareWiringSolution: 'Pre-fabricated cable harnesses linking existing marshalling cabinets to ET 200MP high-density terminal blocks.',
    rollbackStrategy: 'Parallel running during scheduled annual plant turnaround; dual-fed sensor loops enable instant failback to S7-400.',
  },
];

export default function MigrationDecisionMatrix() {
  const [selectedIdx, setSelectedIdx] = useState(1); // Default to S7-300 -> S7-1500
  const scenario = SCENARIOS[selectedIdx];

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
          <span style={{ fontSize: '18px' }}>♻️</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            Legacy PLC Migration Matrix & 15-Minute Rollback Planner
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>
          TIA Portal Modernization Framework
        </span>
      </div>

      <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
        Select a legacy PLC migration path to evaluate target hardware, software toolchain automation rates, required manual engineering tasks, and zero-downtime rollback protocols:
      </p>

      {/* Selector tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {SCENARIOS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedIdx === idx ? '1px solid #16a34a' : '1px solid #e2e8f0',
              background: selectedIdx === idx ? '#16a34a' : '#f8fafc',
              color: selectedIdx === idx ? '#ffffff' : '#334155',
              transition: 'all 0.15s ease',
            }}
          >
            {s.sourceFamily.split(' ')[0]} ➔ {s.targetFamily}
          </button>
        ))}
      </div>

      {/* Migration Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Legacy Source Platform</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{scenario.sourceFamily}</div>
          <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.4 }}>{scenario.sourceDesc}</div>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Recommended Target Target</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>{scenario.targetFamily}</div>
          <div style={{ fontSize: '11.5px', color: '#166534', lineHeight: 1.4 }}>Recommended CPU: <strong>{scenario.targetCpu}</strong></div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Conversion Tool & Rate</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#1d4ed8', margin: '4px 0' }}>{scenario.automationRate}</div>
          <div style={{ fontSize: '11.5px', color: '#1e40af', lineHeight: 1.4 }}>{scenario.softwareTool}</div>
        </div>
      </div>

      {/* Manual Rework Checklist */}
      <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
          ⚠️ Critical Manual Engineering Tasks (Post-Migration):
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
          {scenario.manualTasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      </div>

      {/* Zero-Rewiring & Rollback Plan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        <div style={{ background: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '10px 12px', borderRadius: '0 6px 6px 0', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
          🔌 <strong>Zero-Rewiring Hardware:</strong> {scenario.hardwareWiringSolution}
        </div>
        <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '10px 12px', borderRadius: '0 6px 6px 0', fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
          ⏱️ <strong>15-Minute Rollback Plan:</strong> {scenario.rollbackStrategy}
        </div>
      </div>
    </div>
  );
}

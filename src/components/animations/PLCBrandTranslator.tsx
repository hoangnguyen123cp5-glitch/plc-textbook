'use client';

import React, { useState } from 'react';

interface BrandMapping {
  element: string;
  siemens: string;
  mitsubishi: string;
  omron: string;
  notes: string;
}

const BRAND_DATA: BrandMapping[] = [
  {
    element: 'Digital Input (Bit 0)',
    siemens: '%I0.0 (Byte 0, Bit 0)',
    mitsubishi: 'X0 (Octal base: X0–X7, X10...)',
    omron: '0.00 (Channel 0, Bit 0)',
    notes: 'Siemens uses byte.bit. Mitsubishi uses octal (no X8, X9). Omron uses word.bit notation.',
  },
  {
    element: 'Digital Output (Bit 0)',
    siemens: '%Q0.0 (24VDC PNP Sourcing)',
    mitsubishi: 'Y0 (24VDC NPN Sinking default)',
    omron: '100.00 (Channel 100, Bit 0)',
    notes: 'Siemens outputs +24V. Japanese PLCs (Mitsubishi/Omron) traditionally sink load current to 0V.',
  },
  {
    element: 'Internal Memory Bit',
    siemens: '%M0.0 (Bit Memory Marker)',
    mitsubishi: 'M0 (Auxiliary Relay)',
    omron: 'W0.00 (Work Bit)',
    notes: 'Used for internal intermediate latching flags, interlocking, and state machine registers.',
  },
  {
    element: '16-bit Data Register',
    siemens: '%MW10 / DB1.DBD0',
    mitsubishi: 'D0 (Data Register, 16-bit signed)',
    omron: 'D0 / DM0 (Data Memory word)',
    notes: 'Siemens uses byte addressing (%MW10 = bytes 10-11). Japanese brands use word registers (D0, D1).',
  },
  {
    element: 'On-Delay Timer (5.0s)',
    siemens: 'TON (PT := T#5s, IEC_Timer DB)',
    mitsubishi: 'T0 K50 (50 x 100ms = 5.0s)',
    omron: 'TIM 000 #0050 (100ms base)',
    notes: 'Siemens uses instance DBs. Mitsubishi & Omron use constant decimal (K) or BCD (#) timer presets.',
  },
  {
    element: 'Latch Set / Reset',
    siemens: '---(S)--- and ---(R)---',
    mitsubishi: '[SET Y0] and [RST Y0]',
    omron: '[SET 100.00] and [RSET 100.00]',
    notes: 'Latches output state across scans. Reset takes priority in safety-critical interlocking.',
  },
  {
    element: 'Data Move (16-bit)',
    siemens: 'MOVE (IN := %MW10, OUT := %MW20)',
    mitsubishi: '[MOV D0 D10]',
    omron: 'MOV(021) D0 D10',
    notes: 'Copies 16-bit word value without altering the source operand register.',
  },
  {
    element: 'Program End Delimiter',
    siemens: 'Implicit in OB1 OS loop',
    mitsubishi: '[END] / [FEND] (Mandatory)',
    omron: 'END(001) (Mandatory)',
    notes: 'Missing END instruction in Mitsubishi or Omron will trigger an immediate CPU watchdog fault!',
  },
];

export default function PLCBrandTranslator() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = BRAND_DATA[selectedIdx];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🌏</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            Multi-Brand PLC Syntax & Addressing Cross-Translator
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
          Siemens S7 · Mitsubishi FX · Omron CP
        </span>
      </div>

      <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
        Select a standard automation element to inspect how register addressing, timer syntax, and I/O conventions map across the three major industrial PLC manufacturers:
      </p>

      {/* Selector pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {BRAND_DATA.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedIdx === idx ? '1px solid #0284c7' : '1px solid #e2e8f0',
              background: selectedIdx === idx ? '#0284c7' : '#f8fafc',
              color: selectedIdx === idx ? '#ffffff' : '#334155',
              transition: 'all 0.15s ease',
            }}
          >
            {item.element}
          </button>
        ))}
      </div>

      {/* 3-Column Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {/* Siemens */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Siemens (S7-1200)</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#14532d', background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #dcfce7' }}>
            {selected.siemens}
          </div>
        </div>

        {/* Mitsubishi */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Mitsubishi (FX3U/FX5U)</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#1e3a8a', background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #dbeafe' }}>
            {selected.mitsubishi}
          </div>
        </div>

        {/* Omron */}
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>Omron (CP1H/CP2E)</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#7c2d12', background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #ffedd5' }}>
            {selected.omron}
          </div>
        </div>
      </div>

      {/* Engineering notes callout */}
      <div style={{ background: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '10px 14px', borderRadius: '0 6px 6px 0', fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
        💡 <strong>Engineering Rule:</strong> {selected.notes}
      </div>
    </div>
  );
}

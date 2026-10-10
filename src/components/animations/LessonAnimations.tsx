'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   1. PLC Scan Cycle Animation
───────────────────────────────────────────── */
export function ScanCycleAnimation() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);

  const steps = [
    { label: 'Đọc đầu vào', sub: 'CPU đọc trạng thái tất cả DI, AI', color: '#3b82f6', icon: '📥' },
    { label: 'Thực thi chương trình', sub: 'CPU chạy từng network trong OB1', color: '#16a34a', icon: '⚙️' },
    { label: 'Kiểm tra nội bộ', sub: 'CPU kiểm tra lỗi, xử lý ngắt', color: '#f59e0b', icon: '🔍' },
    { label: 'Ghi đầu ra', sub: 'CPU cập nhật trạng thái DO, AO', color: '#ef4444', icon: '📤' },
  ];

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setActive(a => (a + 1) % steps.length), 1000);
    return () => clearInterval(t);
  }, [running, steps.length]);

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🎬 PLC Scan Cycle — Mô phỏng
        </span>
        <button
          onClick={() => setRunning(r => !r)}
          style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: running ? '#fee2e2' : '#dcfce7', color: running ? '#dc2626' : '#16a34a', cursor: 'pointer', fontWeight: 600 }}
        >
          {running ? '⏸ Dừng' : '▶ Chạy'}
        </button>
      </div>

      {/* Circle layout */}
      <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 20px' }}>
        {/* Center label */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontSize: '28px' }}>🖥️</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#737373' }}>CPU</div>
        </div>

        {/* 4 nodes around circle */}
        {steps.map((step, i) => {
          const angle = (i / steps.length) * 2 * Math.PI - Math.PI / 2;
          const r = 88;
          const x = 110 + r * Math.cos(angle);
          const y = 110 + r * Math.sin(angle);
          const isActive = active === i;
          return (
            <div
              key={i}
              onClick={() => { setRunning(false); setActive(i); }}
              style={{
                position: 'absolute',
                left: x - 32, top: y - 32,
                width: 64, height: 64,
                borderRadius: '50%',
                background: isActive ? step.color : '#fff',
                border: `2px solid ${isActive ? step.color : '#e5e5e5'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                boxShadow: isActive ? `0 0 0 4px ${step.color}33` : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {step.icon}
            </div>
          );
        })}

        {/* SVG circle with rotating arrow */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="220" height="220">
          <circle cx="110" cy="110" r="65" fill="none" stroke="#e5e5e5" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Active step detail */}
      <div style={{
        background: `${steps[active].color}11`,
        border: `1px solid ${steps[active].color}33`,
        borderRadius: '10px', padding: '14px 16px',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: steps[active].color, marginBottom: '4px' }}>
          Bước {active + 1}: {steps[active].label}
        </div>
        <div style={{ fontSize: '13px', color: '#525252' }}>{steps[active].sub}</div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => { setRunning(false); setActive(i); }} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: active === i ? s.color : '#e5e5e5',
            cursor: 'pointer', transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. Timer TON Animation
───────────────────────────────────────────── */
export function TimerTONAnimation() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0); // 0..100
  const TOTAL = 40; // ticks for PT
  const PT = 30;    // preset time tick

  useEffect(() => {
    if (!running) return;
    if (tick >= TOTAL) { setRunning(false); return; }
    const t = setInterval(() => setTick(p => p + 1), 80);
    return () => clearInterval(t);
  }, [running, tick]);

  const reset = () => { setTick(0); setRunning(false); };
  const inOn = tick >= 5 && tick <= TOTAL;
  const qOn  = tick > PT && tick <= TOTAL;
  const et   = Math.min(tick - 5, PT);
  const etPct = Math.max(0, Math.min(100, ((tick - 5) / PT) * 100));

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ⏱️ Timer TON — Mô phỏng
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setTick(0); setRunning(true); }}
            style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #dcfce7', background: '#dcfce7', color: '#16a34a', cursor: 'pointer', fontWeight: 600 }}>
            ▶ Chạy thử
          </button>
          <button onClick={reset}
            style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', color: '#737373', cursor: 'pointer', fontWeight: 600 }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Waveform diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {/* IN signal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', minWidth: '28px' }}>IN</span>
          <div style={{ flex: 1, height: '36px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              height: inOn ? '100%' : '8px',
              width: `${(tick / TOTAL) * 100}%`,
              background: '#3b82f6',
              borderRadius: '4px',
              transition: 'height 0.1s ease',
            }} />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: inOn ? '#3b82f6' : '#f0f0f0', color: inOn ? '#fff' : '#aaa', minWidth: '44px', textAlign: 'center' }}>
            {inOn ? '1' : '0'}
          </div>
        </div>

        {/* ET bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', minWidth: '28px' }}>ET</span>
          <div style={{ flex: 1, height: '36px', background: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              height: '100%', width: `${etPct}%`,
              background: 'linear-gradient(90deg, #fde68a, #f59e0b)',
              borderRadius: '4px',
              transition: 'width 0.08s linear',
            }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '10px', fontSize: '11px', fontWeight: 700, color: '#92400e' }}>
              {et > 0 ? `${et * 80}ms / PT = ${PT * 80}ms` : 'Chờ IN = 1'}
            </div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', minWidth: '44px', textAlign: 'center' }}>
            {Math.round(etPct)}%
          </div>
        </div>

        {/* Q output */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', minWidth: '28px' }}>Q</span>
          <div style={{ flex: 1, height: '36px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              height: qOn ? '100%' : '8px',
              width: `${(tick / TOTAL) * 100}%`,
              background: '#16a34a',
              borderRadius: '4px',
              transition: 'height 0.1s ease',
            }} />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: qOn ? '#16a34a' : '#f0f0f0', color: qOn ? '#fff' : '#aaa', minWidth: '44px', textAlign: 'center' }}>
            {qOn ? '1' : '0'}
          </div>
        </div>
      </div>

      {/* Status box */}
      <div style={{ background: qOn ? '#f0fdf4' : inOn ? '#fffbeb' : '#f8f9fa', border: `1px solid ${qOn ? '#bbf7d0' : inOn ? '#fde68a' : '#e5e5e5'}`, borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
        {tick === 0 && '⏳ Nhấn "Chạy thử" để xem mô phỏng TON timer'}
        {tick > 0 && !inOn && '⏳ IN = 0 — Timer chưa bắt đầu'}
        {inOn && !qOn && `⏱️ IN = 1 — Đang đếm: ET = ${et * 80}ms, cần thêm ${(PT - et) * 80}ms nữa...`}
        {qOn && '✅ ET ≥ PT → Q = 1 — Đầu ra đã bật!'}
        {tick === TOTAL && ' (Hoàn thành)'}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. Start-Stop Ladder Logic Animation
───────────────────────────────────────────── */
export function StartStopAnimation() {
  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [motor, setMotor] = useState(false);

  const handleStart = () => {
    setStartPressed(true);
    setMotor(true);
    setTimeout(() => setStartPressed(false), 300);
  };

  const handleStop = () => {
    setStopPressed(true);
    setMotor(false);
    setTimeout(() => setStopPressed(false), 300);
  };

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
        🪜 Mạch Start-Stop — Tương tác
      </div>

      {/* Ladder diagram */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '20px', marginBottom: '16px', overflowX: 'auto' }}>
        {/* Left power rail */}
        <div style={{ width: 6, height: 80, background: '#374151', borderRadius: '3px', flexShrink: 0 }} />
        <div style={{ height: 3, background: '#374151', flex: 1, minWidth: 12 }} />

        {/* Start contact (NO) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: startPressed ? '#3b82f6' : '#374151' }}>I0.0<br/>START</span>
          <div style={{ width: 36, height: 36, border: `2.5px solid ${startPressed ? '#3b82f6' : '#374151'}`, borderRadius: '4px', background: startPressed ? '#dbeafe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', position: 'relative' }}>
            <div style={{ width: 20, height: 2.5, background: startPressed ? '#3b82f6' : '#374151', borderRadius: '1px' }} />
            {/* NO symbol lines */}
            <div style={{ position: 'absolute', left: -8, width: 8, height: 2, background: startPressed ? '#3b82f6' : '#374151' }} />
            <div style={{ position: 'absolute', right: -8, width: 8, height: 2, background: startPressed ? '#3b82f6' : '#374151' }} />
          </div>
        </div>

        <div style={{ height: 3, background: motor ? '#3b82f6' : '#374151', flex: 1, minWidth: 8, transition: 'background 0.3s' }} />

        {/* Self-hold contact */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: motor ? '#16a34a' : '#9ca3af' }}>Q0.0<br/>HOLD</span>
          <div style={{ width: 36, height: 36, border: `2.5px solid ${motor ? '#16a34a' : '#d1d5db'}`, borderRadius: '4px', background: motor ? '#dcfce7' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', position: 'relative' }}>
            <div style={{ width: 20, height: 2.5, background: motor ? '#16a34a' : '#d1d5db', borderRadius: '1px', transition: 'background 0.3s' }} />
            <div style={{ position: 'absolute', left: -8, width: 8, height: 2, background: motor ? '#16a34a' : '#d1d5db', transition: 'background 0.3s' }} />
            <div style={{ position: 'absolute', right: -8, width: 8, height: 2, background: motor ? '#16a34a' : '#d1d5db', transition: 'background 0.3s' }} />
          </div>
        </div>

        <div style={{ height: 3, background: motor ? '#3b82f6' : '#374151', flex: 1, minWidth: 8, transition: 'background 0.3s' }} />

        {/* Stop contact (NC) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: stopPressed ? '#ef4444' : '#374151' }}>I0.1<br/>STOP</span>
          <div style={{ width: 36, height: 36, border: `2.5px solid ${stopPressed ? '#ef4444' : '#374151'}`, borderRadius: '4px', background: stopPressed ? '#fee2e2' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', position: 'relative' }}>
            <div style={{ width: 20, height: 2.5, background: stopPressed ? '#ef4444' : '#374151', borderRadius: '1px', transform: stopPressed ? 'rotate(-20deg)' : 'none', transition: 'all 0.2s' }} />
            <div style={{ position: 'absolute', left: -8, width: 8, height: 2, background: stopPressed ? '#ef4444' : '#374151' }} />
            <div style={{ position: 'absolute', right: -8, width: 8, height: 2, background: stopPressed ? '#ef4444' : '#374151' }} />
            {/* NC diagonal */}
            <div style={{ position: 'absolute', width: 28, height: 2, background: stopPressed ? '#ef4444' : '#374151', transform: 'rotate(-45deg)', opacity: 0.6 }} />
          </div>
        </div>

        <div style={{ height: 3, background: motor && !stopPressed ? '#3b82f6' : '#374151', flex: 1, minWidth: 12, transition: 'background 0.3s' }} />

        {/* Output coil */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: motor ? '#16a34a' : '#374151' }}>Q0.0<br/>MOTOR</span>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2.5px solid ${motor ? '#16a34a' : '#374151'}`, background: motor ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: motor ? '0 0 10px #16a34a55' : 'none' }}>
            <span style={{ fontSize: '14px' }}>{motor ? '✓' : ''}</span>
          </div>
        </div>

        <div style={{ height: 3, background: '#374151', flex: 1, minWidth: 12 }} />
        {/* Right power rail */}
        <div style={{ width: 6, height: 80, background: '#374151', borderRadius: '3px', flexShrink: 0 }} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
        <button
          onMouseDown={handleStart}
          style={{ padding: '10px 24px', borderRadius: '8px', border: '2px solid #3b82f6', background: startPressed ? '#3b82f6' : '#eff6ff', color: startPressed ? '#fff' : '#3b82f6', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none' }}
        >
          ▶ START (I0.0)
        </button>
        <button
          onMouseDown={handleStop}
          style={{ padding: '10px 24px', borderRadius: '8px', border: '2px solid #ef4444', background: stopPressed ? '#ef4444' : '#fff1f2', color: stopPressed ? '#fff' : '#ef4444', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none' }}
        >
          ■ STOP (I0.1)
        </button>
      </div>

      {/* Motor status */}
      <div style={{ textAlign: 'center', padding: '12px', background: motor ? '#f0fdf4' : '#fafafa', border: `1px solid ${motor ? '#bbf7d0' : '#e5e5e5'}`, borderRadius: '8px', transition: 'all 0.3s' }}>
        <span style={{ fontSize: '24px' }}>{motor ? '🟢' : '🔴'}</span>
        <span style={{ marginLeft: '10px', fontWeight: 700, fontSize: '14px', color: motor ? '#16a34a' : '#ef4444' }}>
          MOTOR: {motor ? 'ĐANG CHẠY (Q0.0 = 1)' : 'DỪNG (Q0.0 = 0)'}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   4. NORM_X / SCALE_X Calculator
───────────────────────────────────────────── */
export function AnalogScaleAnimation() {
  const [raw, setRaw] = useState(13824);
  const minRaw = 0, maxRaw = 27648;
  const minEng = -50, maxEng = 150;

  const norm  = (raw - minRaw) / (maxRaw - minRaw);
  const temp  = minEng + norm * (maxEng - minEng);
  const pct   = norm * 100;

  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
        🌡️ NORM_X / SCALE_X — Máy tính tương tác
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Raw value slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Raw AI Value (AIW64)</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a3a6b' }}>{raw}</span>
          </div>
          <input type="range" min={0} max={27648} value={raw}
            onChange={e => setRaw(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#1a3a6b' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af' }}>
            <span>0 (0mA)</span><span>5530 (4mA)</span><span>27648 (20mA)</span>
          </div>
        </div>

        {/* Arrow steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center', flex: 1, minWidth: '100px' }}>
            <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600 }}>Raw Input</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8' }}>{raw}</div>
          </div>
          <div style={{ fontSize: '20px', color: '#9ca3af' }}>→</div>
          <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center', flex: 1, minWidth: '100px' }}>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>NORM_X</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#b45309' }}>{norm.toFixed(4)}</div>
          </div>
          <div style={{ fontSize: '20px', color: '#9ca3af' }}>→</div>
          <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center', flex: 1, minWidth: '100px' }}>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>SCALE_X (°C)</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803d' }}>{temp.toFixed(1)}°C</div>
          </div>
        </div>

        {/* Thermometer visual */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ flex: 1, height: '24px', background: '#f0f0f0', borderRadius: '99px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `hsl(${200 - pct * 1.4}, 80%, 50%)`, borderRadius: '99px', transition: 'width 0.1s linear' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151', minWidth: '60px' }}>{pct.toFixed(1)}%</span>
        </div>

        <div style={{ fontSize: '12px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px', padding: '10px 14px', fontFamily: 'monospace' }}>
          Cảm biến PT100: [{minEng}°C → {maxEng}°C] | Raw [{minRaw} → {maxRaw}]<br/>
          Công thức: {temp.toFixed(1)} = {minEng} + {norm.toFixed(3)} × ({maxEng} − {minEng})
        </div>
      </div>
    </div>
  );
}

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
      sub: 'Giá trị Đặt Chuẩn',
      icon: '🎯',
      desc: 'Giá trị mục tiêu mong muốn mà đại lượng vật lý cần đạt (nhiệt độ, áp suất, vận tốc, vị trí).',
      example: 'Nhiệt độ cài đặt SP = 60.0°C | Tốc độ băng tải SP = 1.5 m/s (Nhập từ màn hình HMI)',
      badge: 'Tín hiệu Đầu vào (Input Signal)',
      color: '#0284c7',
    },
    {
      id: 1,
      num: '2',
      title: 'Khâu So sánh',
      sub: 'Bộ Tính Sai số (Σ)',
      icon: '⚖️',
      desc: 'Tính toán độ lệch tức thời giữa tín hiệu đặt và phản hồi thực tế: e(t) = SP − PV.',
      example: 'Sai số e(t) = 60°C − 42°C = +18°C ➔ Cần tăng công suất gia nhiệt cấp tốc',
      badge: 'Điểm Cộng Trừ (Summing Junction)',
      color: '#d97706',
    },
    {
      id: 2,
      num: '3',
      title: 'Bộ Điều khiển',
      sub: 'PLC CPU (OB1)',
      icon: '💻',
      desc: 'Bộ não xử lý thuật toán (PID, Logic Ladder, liên động an toàn) để tính ra tín hiệu điều khiển u(t).',
      example: 'Siemens S7-1200 CPU 1214C DC/DC/DC quét chu kỳ 1ms chạy khối PID_Compact FB',
      badge: 'Khối Xử lý Quyết định (Decision Logic)',
      color: '#16a34a',
    },
    {
      id: 3,
      num: '4',
      title: 'Cơ cấu Chấp hành',
      sub: 'Actuator Công suất',
      icon: '⚡',
      desc: 'Chuyển đổi tín hiệu điện áp/dòng điện nhỏ từ PLC thành cơ năng/nhiệt năng/áp suất vật lý.',
      example: 'Biến tần VFD SINAMICS V20 điều khiển motor, van điều khiển tỉ lệ 4–20mA, SSR heater',
      badge: 'Thiết bị Chấp hành (Final Element)',
      color: '#dc2626',
    },
    {
      id: 4,
      num: '5',
      title: 'Cảm biến Phản hồi',
      sub: 'Transducer / Sensor',
      icon: '📡',
      desc: 'Đo lường liên tục trạng thái vật lý thực (PV) và truyền ngược về khâu so sánh để khép kín vòng.',
      example: 'Cảm biến nhiệt độ PT100 + Bộ chuyển đổi 4–20mA, Encoder đo góc 1024 xung/vòng',
      badge: 'Vòng Phản hồi (Feedback Loop)',
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
            Sơ đồ Dòng Tín hiệu 5 Khối Cốt lõi của Hệ thống Điều khiển
          </h4>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
          💡 Nhấp vào từng khối để xem phân tích phần cứng & tín hiệu
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
      }}>
        <span style={{ color: '#0284c7' }}>Dòng Tiến (Feedforward):</span>
        <span style={{ color: '#0f172a' }}>SP [Đặt] ──▶ (Σ) [Sai số] ──▶ PLC CPU [OB1] ──▶ Actuator [Cơ cấu] ──▶ Plant [Đối tượng]</span>
        <span style={{ color: '#16a34a' }}>Hồi tiếp: ◀── Sensor [Đo lường]</span>
      </div>

      {/* Balanced 2-Column Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Left Column: Role & Formula */}
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

        {/* Right Column: Industrial Equipment Example */}
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '10px',
          padding: '12px 16px',
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            🏭 Thiết Bị Phần Cứng Thực Tế Trong Nhà Máy
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
            Mô Phỏng Thực Tế: Hệ Thống Điều Khiển Vòng Hở (Open-Loop) vs Vòng Kín (Closed-Loop)
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
            💡 Đèn Chiếu Sáng Đô Thị
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
            🔥 Lò Gia Nhiệt Công Nghiệp
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
          ⏱️ Chế Độ VÒNG HỞ (Bộ Định Giờ Timer Cố Định 18h–06h)
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
          📡 Chế Độ VÒNG KÍN (Cảm Biến Ánh Sáng Quang Trở LDR Hồi Tiếp)
        </button>
      </div>

      {/* Balanced 2-Column: Left Visualizer, Right Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px' }}>
        {/* Left: Plant & Environmental Controls */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Thời gian trong ngày:</span>
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
            {isStormy ? '⛈️ Nhiễu: Giông bão bất ngờ (Trời tối sầm lại)' : '☀️ Thời tiết: Bình thường (Trời sáng quang đãng)'}
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
              Trạng thái Đèn: {lampState ? 'BẬT SÁNG (ON)' : 'TẮT (OFF)'}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Metrics & Result */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Dữ Liệu Đo Lường Quá Trình (Telemetry):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Quang độ Thực PV:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{daylightLux} Lux</span>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Ngưỡng Bật SP:</span>
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
                <span>❌ <strong>Nhược điểm Vòng Hở:</strong> Bão đen trời lúc ban ngày, nhưng bộ Timer vẫn chờ đúng 18h mới bật ➔ Đường phố tối đen nguy hiểm!</span>
              ) : (
                <span>⚠️ <strong>Hệ Vòng Hở:</strong> Chạy theo kịch bản thời gian cố định. Không có khả năng tự khử nhiễu khi môi trường thay đổi.</span>
              )
            ) : (
              <span>✅ <strong>Ưu điểm Vòng Kín:</strong> Cảm biến LDR phát hiện ánh sáng tụt xuống &lt; 60 Lux ➔ PLC lập tức bật đèn tự động khử nhiễu thành công!</span>
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
          ⚡ VÒNG HỞ: Công Suất Điện Trở Cố Định 50%
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
          📡 VÒNG KÍN: Cảm Biến PT100 + Thuật Toán PID Tự Động
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
            {doorOpen ? '🚪 Cửa Lò BỊ MỞ (Gió lạnh lùa vào làm sụt nhiệt)' : '🚪 Cửa Lò ĐANG ĐÓNG KÍN (Cách nhiệt tốt)'}
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
              Nhiệt độ Đặt Mục tiêu (SP): {targetTemp}°C
            </span>
          </div>
        </div>

        {/* Right: Controller Response */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Phản ứng của Bộ Điều Khiển:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Công Suất Gia Nhiệt:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                  {!isClosedLoop ? '50% (Cố định)' : doorOpen ? '95% (Tăng áp)' : '52% (Ổn định)'}
                </span>
              </div>
              <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Sai Số e(t) = SP − PV:</span>
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
                <span>❌ <strong>Thất bại khi mở cửa:</strong> Nhiệt độ tụt mạnh xuống {temperature}°C vì công suất 50% cố định không bù được nhiệt thất thoát!</span>
              ) : (
                <span>⚠️ <strong>Vòng Hở:</strong> Không có cảm biến giám sát. Nếu điện lưới chập chờn hoặc phòng quá lạnh sẽ bị sai lệch nhiệt.</span>
              )
            ) : (
              <span>🎯 <strong>PID Vòng Kín Phản Ứng:</strong> Cảm biến PT100 báo nhiệt giảm ➔ PLC lập tức bơm công suất lên 95%, nhanh chóng đưa nhiệt độ về đúng 60°C!</span>
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
            So Sánh Kiến Trúc: Tủ Rơ Le Cố Định (Hardwired) vs Khả Trình PLC S7-1200
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
          {testingChange ? '🔄 Khôi Phục Ban Đầu' : '⚡ Thử Nghiệm Đổi Yêu Cầu Công Nghệ'}
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
            <span>🗄️</span> Tủ Điều Khiển Rơ Le Cố Định (Hardwired Relay)
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#78350f', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>• <strong>Phương thức liên kết logic:</strong> Dây đồng vật lý đấu nối giữa cuộn hút & tiếp điểm.</li>
            <li>• <strong>Độ tin cậy:</strong> Tiếp điểm cơ khí mòn cơ học, dễ phóng điện hồ quang làm rỗ tiếp điểm.</li>
            <li>• <strong>Kích thước tủ:</strong> Tủ thép kích thước lớn (1200 × 800 mm) để chứa hàng chục rơ le & rơ le thời gian.</li>
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
              ⚠️ <strong>Hệ quả khi đổi công nghệ:</strong> Phải cắt nguồn toàn nhà máy, khoan cắt tủ, tháo lắp rơ le, đi lại toàn bộ dây đồng ➔ <strong>Ngừng máy 6–8 giờ</strong>, rủi ro đấu sai dây cực cao!
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
            <span>💻</span> Hệ Thống Điều Khiển PLC Siemens S7-1200
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#1e3a8a', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>• <strong>Phương thức liên kết logic:</strong> Thuật toán phần mềm nạp trong bộ nhớ RAM/ROM của CPU.</li>
            <li>• <strong>Độ tin cậy:</strong> Mạch bán dẫn thể rắn (Solid-State), tuổi thọ MTBF hàng trăm nghìn giờ.</li>
            <li>• <strong>Kích thước tủ:</strong> Nhỏ gọn gắn thanh ray DIN TS35 (chỉ 110 × 100 mm), tiết kiệm 80% không gian.</li>
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
              ✅ <strong>Hệ quả khi đổi công nghệ:</strong> Chỉ cần mở TIA Portal, sửa mạng lệnh Ladder / SCL và ấn Download xuống PLC trong <strong>5 giây</strong> ➔ Không cần chạm vào dây điện!
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
      title: 'Đọc Ngõ Vào',
      mem: 'DI ➔ PII',
      desc: 'CPU quét tức thời toàn bộ chân đấu nối vật lý và ghi ảnh chụp vào Vùng Đệm Ngõ Vào (Process Image Input).',
      icon: '📥',
    },
    {
      num: 2,
      title: 'Thực Thi Logic',
      mem: 'OB1 Evaluation',
      desc: 'CPU chạy tuần tự từng Network lệnh trong chương trình người dùng từ trên xuống dưới theo giá trị PII.',
      icon: '⚙️',
    },
    {
      num: 3,
      title: 'Truyền Thông & Tự Kiểm',
      mem: 'Comms & Diag',
      desc: 'CPU xử lý trao đổi dữ liệu mạng PROFINET, giao tiếp màn hình HMI và tự chẩn đoán lỗi phần cứng.',
      icon: '🛡️',
    },
    {
      num: 4,
      title: 'Ghi Ngõ Ra',
      mem: 'PIQ ➔ DO',
      desc: 'CPU đồng loạt sao chép toàn bộ Vùng Đệm Ngõ Ra (Process Image Output) ra các rơ le / transistor vật lý.',
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
            Chu Kỳ Quét Xác Định Của PLC (Deterministic Scan Cycle)
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
            {autoPlay ? '⏸ Tạm Dừng Quét' : '▶ Tự Động Quét'}
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
            Bước Kế Tiếp ❯
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
              Giai Đoạn Đang Thực Hiện: Bước {cur.num}/4
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
            ⏱️ Đảm Bảo Tính Xác Định Thời Gian Thực
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#78350f', lineHeight: 1.6 }}>
            Thời gian quét chu kỳ $T_{'{scan}'}$ thường từ <strong>1 đến 10 ms</strong>. Lệnh chỉ đọc ảnh chụp PII cố định, tránh hiện tượng nhiễu rung tiếp điểm cơ khí.
          </p>
        </div>
      </div>
    </div>
  );
}

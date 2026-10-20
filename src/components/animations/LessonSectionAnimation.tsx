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
   MỤC 1.2: ANIMATION MINH HỌA VÒNG HỞ VS VÒNG KÍN (OPEN VS CLOSED LOOP)
═════════════════════════════════════════════════════════════════════════ */
function Section1_2LoopAnimation() {
  const [activeScenario, setActiveScenario] = useState<'light' | 'oven'>('light');

  return (
    <div className="my-5 p-4 sm:p-5 bg-linear-to-b from-slate-50 to-white rounded-xl border border-blue-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
            🎬
          </span>
          <h4 className="text-sm font-bold text-slate-900 m-0">
            Mô phỏng Trực quan Mục 1.2: Hệ thống Điều khiển Vòng hở vs Vòng kín
          </h4>
        </div>

        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveScenario('light')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeScenario === 'light' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            💡 Đèn đường (Chiếu sáng)
          </button>
          <button
            onClick={() => setActiveScenario('oven')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeScenario === 'oven' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            🔥 Lò nhiệt (Nhiệt độ)
          </button>
        </div>
      </div>

      {activeScenario === 'light' ? <StreetLightScenario /> : <HeatingOvenScenario />}
    </div>
  );
}

/* Tình huống 1: Hệ thống Đèn đường Hẹn giờ vs Cảm biến quang */
function StreetLightScenario() {
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(true);
  const [isStormy, setIsStormy] = useState<boolean>(false);
  const [timeHour, setTimeHour] = useState<number>(15); // 15:00 (3 PM)

  // In Open Loop: Light is ON only between 18:00 and 06:00
  const openLoopLampOn = timeHour >= 18 || timeHour < 6;

  // In Closed Loop: Sensor measures Lux.
  // Normal daylight at 15:00 = 800 Lux. If storm = 20 Lux. Night = 5 Lux.
  const daylightLux = (timeHour >= 18 || timeHour < 6) ? 5 : isStormy ? 25 : 850;
  // Lamp turns ON if measured light < 60 Lux
  const closedLoopLampOn = daylightLux < 60;

  const lampState = isClosedLoop ? closedLoopLampOn : openLoopLampOn;

  return (
    <div>
      {/* Controls row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Mode selector */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Chọn mô hình:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setIsClosedLoop(false)}
              className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all ${
                !isClosedLoop
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Vòng hở (Hẹn giờ)
            </button>
            <button
              onClick={() => setIsClosedLoop(true)}
              className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all ${
                isClosedLoop
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Vòng kín (Cảm biến)
            </button>
          </div>
        </div>

        {/* Time of day slider */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-slate-600">Thời gian trong ngày:</span>
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
            <span>0h (Đêm)</span>
            <span>12h (Trưa)</span>
            <span>23h (Tối)</span>
          </div>
        </div>

        {/* Weather Disturbance */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Gây nhiễu thời tiết:
          </span>
          <button
            onClick={() => setIsStormy(!isStormy)}
            className={`w-full py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isStormy
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{isStormy ? '⛈️ ĐANG MƯA DÔNG SẬP TỐI' : '☀️ Thời tiết bình thường'}</span>
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
                  title="Cảm biến quang LDR"
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
              ĐÈN ĐƯỜNG: {lampState ? 'ĐANG BẬT SÁNG' : 'ĐANG TẮT'}
            </span>
          </div>
        </div>

        {/* Right: Real-time Analysis & State Explanation */}
        <div className="md:col-span-7 relative z-10 bg-slate-800/90 backdrop-blur-xs p-4 rounded-xl border border-slate-700 text-xs text-slate-200 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Chẩn đoán Trạng thái Hoạt động:
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isClosedLoop ? 'bg-blue-900 text-blue-200' : 'bg-amber-900 text-amber-200'}`}>
              {isClosedLoop ? 'Hệ thống Vòng Kín' : 'Hệ thống Vòng Hở'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              • Giờ hiện tại: <strong className="text-white font-mono">{timeHour}:00</strong>
            </div>
            <div>
              • Độ sáng môi trường: <strong className="text-cyan-400 font-mono">{daylightLux} Lux</strong>
            </div>
          </div>

          {/* Core Lesson Outcome */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700">
            {!isClosedLoop ? (
              <div>
                <strong className="text-amber-400 block mb-1">
                  ⚠️ Vòng hở (Chỉ theo Timer hẹn giờ):
                </strong>
                {timeHour >= 18 || timeHour < 6 ? (
                  <span className="text-slate-300">Đã đến khung giờ hẹn (sau 18h) ➔ Tiếp điểm timer đóng, đèn bật.</span>
                ) : isStormy ? (
                  <span className="text-rose-400 font-bold">
                    ❌ LỖI VÒNG HỞ: Trời mưa dông sập tối lúc {timeHour}:00 (nguy hiểm cho xe cộ), nhưng vì Timer chưa đến 18:00 nên đèn VẪN TẮT! Bộ điều khiển không hề hay biết đường phố đang tối.
                  </span>
                ) : (
                  <span className="text-slate-300">Chưa đến 18:00 và trời sáng ➔ Đèn tắt đúng theo lịch trình.</span>
                )}
              </div>
            ) : (
              <div>
                <strong className="text-emerald-400 block mb-1">
                  ✅ Vòng kín (Cảm biến quang phản hồi):
                </strong>
                {isStormy && timeHour < 18 ? (
                  <span className="text-emerald-300 font-bold">
                    🎯 TỰ ĐỘNG BÙ NHIỄU: Mặc dù mới {timeHour}:00 nhưng cảm biến LDR phát hiện ánh sáng tụt xuống {daylightLux} Lux (&lt; 60 Lux) ➔ Bộ điều khiển lập tức BẬT ĐÈN NGAY, đảm bảo an toàn tuyệt đối!
                  </span>
                ) : closedLoopLampOn ? (
                  <span className="text-slate-300">Ánh sáng ngoài trời {daylightLux} Lux (&lt; 60 Lux) ➔ Cảm biến báo về, PLC duy trì bật đèn.</span>
                ) : (
                  <span className="text-slate-300">Ánh sáng ngoài trời {daylightLux} Lux (&gt; 60 Lux) ➔ Cảm biến báo đủ sáng, PLC ngắt đèn tiết kiệm điện.</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Diagram Flow for Section 1.2 */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
        <div className="font-bold text-slate-700 mb-2">Sơ đồ luồng tín hiệu tương ứng:</div>
        {!isClosedLoop ? (
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-800">
              Cài đặt giờ (18h)
            </span>
            <span className="text-slate-400">──▶</span>
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded font-bold text-amber-800">
              Đồng hồ Timer
            </span>
            <span className="text-slate-400">──▶</span>
            <span className="px-2.5 py-1 bg-blue-50 border border-blue-300 rounded font-bold text-blue-800">
              Đèn đường (Output)
            </span>
            <span className="ml-auto text-rose-600 font-sans font-medium">
              (Đường thẳng một chiều — Không có cảm biến phản hồi)
            </span>
          </div>
        ) : (
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-800">
                Ngưỡng đặt (60 Lux)
              </span>
              <span className="text-slate-400">──▶</span>
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-300 rounded text-blue-800 font-bold">
                Bộ so sánh (Σ)
              </span>
              <span className="text-slate-400">──▶</span>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-300 rounded font-bold text-blue-800">
                PLC / Vi xử lý
              </span>
              <span className="text-slate-400">──▶</span>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-800">
                Đèn đường (Tải)
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-800 bg-cyan-50/70 p-1.5 rounded border border-cyan-200">
              <span className="font-sans font-bold">Đường phản hồi (Feedback Loop):</span>
              <span>Độ sáng thực tế ──▶ Cảm biến LDR ──▶ Gửi về Bộ so sánh để tính sai số!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Tình huống 2: Lò nhiệt công nghiệp */
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
          <span className="text-xs font-bold text-slate-700">Chế độ lò sấy:</span>
          <button
            onClick={() => setIsClosedLoop(false)}
            className={`px-3 py-1 rounded text-xs font-bold ${!isClosedLoop ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Vòng hở (Công suất cố định 50%)
          </button>
          <button
            onClick={() => setIsClosedLoop(true)}
            className={`px-3 py-1 rounded text-xs font-bold ${isClosedLoop ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Vòng kín (Cảm biến PT100 + PLC)
          </button>
        </div>

        <button
          onClick={() => setDoorOpen(!doorOpen)}
          className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
            doorOpen ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {doorOpen ? '🚪 Cửa lò đang MỞ (Gió lạnh lùa vào)' : '🚪 Cửa lò ĐÓNG kín'}
        </button>
      </div>

      <div className="p-4 bg-slate-900 text-white rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="text-center sm:text-left">
          <div className="text-xs text-slate-400">Nhiệt độ đo được trong lò:</div>
          <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1">
            {temperature}°C
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Nhiệt độ cài đặt mong muốn: <strong>{targetTemp}°C</strong>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-800 p-3 rounded-lg border border-slate-700">
          {!isClosedLoop ? (
            <div>
              <strong className="text-amber-400 block mb-1">Hệ vòng hở (Open Loop):</strong>
              {doorOpen ? (
                <span className="text-rose-400">
                  ⚠️ Khi mở cửa gió lạnh, nhiệt độ tụt xuống {temperature}°C! Bộ điều khiển cấp nhiệt cố định nên không thể bù nhiệt, sản phẩm sấy bị hỏng.
                </span>
              ) : (
                <span>Trời yên gió lặng, nhiệt độ duy trì ~60°C nhờ cân chỉnh công suất ban đầu.</span>
              )}
            </div>
          ) : (
            <div>
              <strong className="text-emerald-400 block mb-1">Hệ vòng kín (Closed Loop):</strong>
              {doorOpen ? (
                <span className="text-emerald-300">
                  🎯 Cảm biến PT100 phát hiện nhiệt độ giảm ➔ PLC lập tức kích hoạt tăng công suất thanh nhiệt lên 95%, giữ nhiệt độ ổn định ở {temperature}°C!
                </span>
              ) : (
                <span>Cảm biến liên tục phản hồi, nhiệt độ giữ chuẩn xác 60°C với công suất tiết kiệm.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   MỤC 1.1: ANIMATION SƠ ĐỒ KHỐI 5 THÀNH PHẦN HỆ THỐNG ĐIỀU KHIỂN
═════════════════════════════════════════════════════════════════════════ */
function Section1_1FiveElementsAnimation() {
  const [activeBlock, setActiveBlock] = useState<number>(3); // 3: Controller

  const elements = [
    { id: 0, title: '1. Tín hiệu đặt (Setpoint)', sub: 'Reference Input', desc: 'Giá trị mục tiêu mong muốn do con người hoặc máy tính cài đặt (ví dụ: nhiệt độ 60°C, áp suất 4 bar).' },
    { id: 1, title: '2. Bộ so sánh (Comparator)', sub: 'Error Detector', desc: 'Tính toán độ sai lệch e = SP - PV giữa giá trị mong muốn và giá trị đo thực tế.' },
    { id: 2, title: '3. Bộ điều khiển (Controller)', sub: 'PLC / Computer', desc: 'Bộ não tính toán thuật toán logic, quyết định cần tăng/giảm ngõ ra bao nhiêu để triệt tiêu sai số.' },
    { id: 3, title: '4. Cơ cấu chấp hành (Actuator)', sub: 'Drive / Motor / Valve', desc: 'Biến tín hiệu điện yếu từ PLC thành tác động vật lý mạnh mẽ: quay động cơ, mở van hơi, đóng contactor.' },
    { id: 4, title: '5. Phần tử đo lường (Sensor)', sub: 'Measurement Element', desc: 'Cảm biến quan sát và đo lường biến thực tế ở ngõ ra, biến đổi thành tín hiệu điện gửi ngược về bộ so sánh.' },
  ];

  return (
    <div className="my-5 p-4 bg-slate-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🎬</span>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0">
          Mô hình 5 Khối chức năng cơ bản của mọi Hệ thống Điều khiển
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
        {elements.map((el) => (
          <button
            key={el.id}
            onClick={() => setActiveBlock(el.id)}
            className={`p-2 rounded-lg text-left transition-all border ${
              activeBlock === el.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
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
   MỤC 1.3: SO SÁNH NHANH RƠ-LE VS PLC
═════════════════════════════════════════════════════════════════════════ */
function Section1_3RelayVsPlcMiniAnimation() {
  return (
    <div className="my-4 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-slate-700">
      <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
        <span>⚡</span> So sánh Cốt lõi giữa Điều khiển Nối dây cứng & PLC:
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
          <strong className="text-amber-800 block mb-0.5">🗄️ Tủ rơ-le cứng (Hardwired):</strong>
          Logic nằm ở <strong>cách nối dây đồng</strong>. Muốn đổi logic phải ngắt điện, mua thêm linh kiện, tháo dỡ và đi lại toàn bộ dây!
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-blue-200">
          <strong className="text-blue-800 block mb-0.5">💻 Bộ điều khiển lập trình (PLC):</strong>
          Logic nằm ở <strong>bộ nhớ phần mềm</strong>. Dây điện nối vào cọc I/O giữ nguyên 100%, chỉ cần sửa code và nạp trong 10 giây!
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   MỤC 1.8: MINI SCAN CYCLE FLOW
═════════════════════════════════════════════════════════════════════════ */
function Section1_8ScanCycleMiniAnimation() {
  return (
    <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
      <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
        <span>🔄</span> 4 Giai đoạn Tuần tự của Vòng quét PLC (Scan Cycle):
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded font-bold text-blue-800">
          1. Đọc ngõ vào<br/><span className="text-[10px] font-normal text-slate-500">Chụp ảnh vào PII</span>
        </div>
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded font-bold text-emerald-800">
          2. Thực thi OB1<br/><span className="text-[10px] font-normal text-slate-500">Chạy từ trên xuống</span>
        </div>
        <div className="p-2 bg-amber-50 border border-amber-200 rounded font-bold text-amber-800">
          3. Tự chẩn đoán<br/><span className="text-[10px] font-normal text-slate-500">Kiểm tra lỗi & HMI</span>
        </div>
        <div className="p-2 bg-rose-50 border border-rose-200 rounded font-bold text-rose-800">
          4. Xuất ngõ ra<br/><span className="text-[10px] font-normal text-slate-500">Ghi từ PIQ ra tải</span>
        </div>
      </div>
    </div>
  );
}

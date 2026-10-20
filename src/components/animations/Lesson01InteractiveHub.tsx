'use client';

import React, { useState, useEffect } from 'react';

/* ═════════════════════════════════════════════════════════════════════════
   L01 — Interactive Engineering Hub: Programmable Control Fundamentals
   Chương 1: Khái niệm Điều khiển lập trình & Chu kỳ quét PLC

   Mô-đun học tập tương tác toàn diện:
     1. Vòng quét PLC (Scan Cycle & PII / PIQ Process Images)
     2. Hệ điều khiển Vòng hở vs Vòng kín (Open vs Closed Loop + Disturbance)
     3. Rơ-le nối dây cứng vs PLC (Hardwired vs Programmable Comparison)
     4. Cấu trúc phần cứng S7-1200 & Đèn LED chẩn đoán (CPU 1214C)
     5. Ngôn ngữ IEC 61131-3: LAD vs FBD vs SCL (Interactive Code Viewer)
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
              Mô phỏng Trực quan — Khái niệm Điều khiển & Vòng quét PLC
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
              <span>🔄</span> Vòng quét PLC
            </button>
            <button
              onClick={() => setActiveTab('loop')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'loop'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔁</span> Vòng hở / Vòng kín
            </button>
            <button
              onClick={() => setActiveTab('relay')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'relay'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡</span> Rơ-le vs PLC
            </button>
            <button
              onClick={() => setActiveTab('hw')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'hw'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🖥️</span> Cấu trúc & LED
            </button>
            <button
              onClick={() => setActiveTab('languages')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'languages'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📝</span> Ngôn ngữ IEC
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
   TAB 1: Scan Cycle Simulator (Mô phỏng Vòng quét & Vùng ảnh I/O)
═════════════════════════════════════════════════════════════════════════ */
function ScanCycleSimulator() {
  const [phase, setPhase] = useState<number>(0); // 0: Read Inputs, 1: Execute OB1, 2: Comms/Diag, 3: Write Outputs
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [scanSpeed, setScanSpeed] = useState<number>(1400); // ms per step
  const [cycleCount, setCycleCount] = useState<number>(1);

  // Inputs
  const [swStart, setSwStart] = useState<boolean>(false);
  const [swStop, setSwStop] = useState<boolean>(false);
  const [swSensor, setSwSensor] = useState<boolean>(false);

  // Process Images
  const [piiStart, setPiiStart] = useState<boolean>(false);
  const [piiStop, setPiiStop] = useState<boolean>(false);
  const [piiSensor, setPiiSensor] = useState<boolean>(false);

  // Program Logic & Outputs
  const [piqMotor, setPiqMotor] = useState<boolean>(false);
  const [piqAlarm, setPiqAlarm] = useState<boolean>(false);

  // Physical Output terminals
  const [physicalMotor, setPhysicalMotor] = useState<boolean>(false);
  const [physicalAlarm, setPhysicalAlarm] = useState<boolean>(false);

  // Auto scan cycle loop
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
        // Logic: Motor := (piiStart OR piqMotor) AND (NOT piiStop)
        const nextMotor = (piiStart || piqMotor) && !piiStop;
        const nextAlarm = piiSensor && nextMotor;
        setPiqMotor(nextMotor);
        setPiqAlarm(nextAlarm);
      } else if (nextPhase === 2) {
        // Phase 3: Communication & Diagnostics (CPU Internal Housekeeping)
        // No I/O changes
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
      title: '1. Đọc ngõ vào vào PII (Process Image Input)',
      tag: 'PII Snapshot',
      color: '#0284c7',
      desc: 'CPU đọc toàn bộ trạng thái điện áp 24V từ các đầu nối DI (I0.0, I0.1, I0.2) và sao chép vào bộ nhớ đệm PII.',
      action: 'Chụp ảnh tức thời (Snapshot) — tín hiệu vật lý thay đổi sau thời điểm này sẽ KHÔNG ảnh hưởng tới vòng quét hiện tại!',
    },
    {
      id: 1,
      title: '2. Thực thi chương trình (Execute OB1)',
      tag: 'Ladder Logic',
      color: '#16a34a',
      desc: 'CPU quét qua các Network từ trên xuống dưới, từ trái qua phải, chỉ đọc giá trị từ vùng nhớ PII chứ KHÔNG đọc lại cọc đấu dây.',
      action: 'Tính toán logic: Q0.0 = (I0.0 OR Q0.0) AND NOT I0.1. Kết quả tính được ghi tạm vào PIQ.',
    },
    {
      id: 2,
      title: '3. Truyền thông & Tự chẩn đoán (Diagnostics)',
      tag: 'Self-Test',
      color: '#d97706',
      desc: 'CPU kiểm tra tính toàn vẹn phần cứng, giám sát nhiệt độ, xử lý kết nối PROFINET tới TIA Portal hoặc màn hình HMI.',
      action: 'Cập nhật Diagnostic Buffer, phát hiện đứt dây hoặc lỗi bus trước khi xuất lệnh ra tải.',
    },
    {
      id: 3,
      title: '4. Ghi ngõ ra từ PIQ ra thiết bị (Write Outputs)',
      tag: 'PIQ -> Physical',
      color: '#dc2626',
      desc: 'CPU chuyển toàn bộ dữ liệu từ bộ nhớ đệm PIQ ra các transistor/rơ-le ngõ ra vật lý (Q0.0, Q0.1) điều khiển động cơ và đèn.',
      action: 'Đóng/ngắt cuộn hút contactor thực tế. Kết thúc 1 chu kỳ quét và quay lại Bước 1.',
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
            {isRunning ? '⏸ Tạm dừng' : '▶ Tiếp tục chạy'}
          </button>
          <button
            onClick={advanceStep}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⏭ Chạy 1 Bước (Single Step)
          </button>
          <span className="text-xs text-slate-500 font-mono ml-2">
            Chu kỳ: <strong className="text-slate-800">#{cycleCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span>Tốc độ quét:</span>
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
                  Giai đoạn {p.id + 1}
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
              <span>🔌</span> 1. Thiết bị ngõ vào vật lý
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Field Inputs
            </span>
          </div>

          <div className="space-y-3">
            {/* Input 1: Start Button */}
            <div className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-slate-800">Nút ấn START (I0.0)</div>
                <div className="text-[11px] text-slate-500">Tiếp điểm thường mở (NO)</div>
              </div>
              <button
                onClick={() => setSwStart(!swStart)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  swStart
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {swStart ? 'ĐANG NHẤN (24V)' : 'THẢ RA (0V)'}
              </button>
            </div>

            {/* Input 2: Stop Button */}
            <div className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-slate-800">Nút ấn STOP (I0.1)</div>
                <div className="text-[11px] text-slate-500">Dừng khẩn cấp / Dừng máy</div>
              </div>
              <button
                onClick={() => setSwStop(!swStop)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  swStop
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {swStop ? 'ĐANG NGẮT (1)' : 'BÌNH THƯỜNG (0)'}
              </button>
            </div>

            {/* Input 3: Safety Sensor */}
            <div className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-slate-800">Cảm biến nhiệt/áp (I0.2)</div>
                <div className="text-[11px] text-slate-500">Cảnh báo nhiệt độ cao</div>
              </div>
              <button
                onClick={() => setSwSensor(!swSensor)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  swSensor
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {swSensor ? 'BÁO ĐỘNG (1)' : 'AN TOÀN (0)'}
              </button>
            </div>
          </div>

          {/* PII Table snapshot */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>📸</span> Vùng đệm ảnh PII (Bộ nhớ RAM)
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${phase === 0 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                {phase === 0 ? 'Đang nạp dữ liệu' : 'Đã khóa snapshot'}
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
              <span>🧠</span> 2. Khối xử lý trung tâm OB1
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${phase === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {phase === 1 ? 'Đang thực thi' : 'Chờ vòng quét'}
            </span>
          </div>

          {/* Ladder Diagram visualization */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-xs">
            <div className="text-[11px] text-slate-500 font-sans font-bold mb-2">Network 1: Mạch khởi động động cơ tự giữ</div>
            
            {/* Visual LAD rung */}
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
              <div>• Biểu thức: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">Q0.0 := (I0.0 OR Q0.0) AND NOT I0.1</code></div>
              <div>• Trạng thái tính toán: <strong className={piqMotor ? 'text-emerald-700' : 'text-slate-500'}>{piqMotor ? 'MOTOR = TRUE' : 'MOTOR = FALSE'}</strong></div>
            </div>
          </div>

          {/* PIQ Table */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>📝</span> Vùng đệm ảnh PIQ (Process Image Output)
              </span>
              <span className="text-[10px] text-slate-500">Chờ cập nhật cọc đấu dây</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-center text-xs">
              <div className={`p-1.5 rounded border ${piqMotor ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                PIQ.Q0.0 = {piqMotor ? '1 (BẬT)' : '0 (TẮT)'}
              </div>
              <div className={`p-1.5 rounded border ${piqAlarm ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                PIQ.Q0.1 = {piqAlarm ? '1 (CÒI HÚ)' : '0 (IM LẶNG)'}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Physical Outputs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0 flex items-center gap-1.5">
              <span>💡</span> 3. Thiết bị chấp hành vật lý
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${phase === 3 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              {phase === 3 ? 'Cập nhật DO' : 'Giữ trạng thái'}
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
                    <div className="text-xs font-bold text-slate-800">ĐỘNG CƠ BĂNG TẢI (Q0.0)</div>
                    <div className="text-[11px] text-slate-500">Contactor 3P 380VAC</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  physicalMotor ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {physicalMotor ? 'ĐANG QUAY' : 'DỪNG'}
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
                    <div className="text-xs font-bold text-slate-800">ĐÈN / CÒI CẢNH BÁO (Q0.1)</div>
                    <div className="text-[11px] text-slate-500">Đèn tháp 24VDC</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  physicalAlarm ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {physicalAlarm ? 'BÁO ĐỘNG!' : 'BÌNH THƯỜNG'}
                </span>
              </div>
            </div>

            {/* Lesson Takeaway Card */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <strong className="block text-amber-950 font-bold mb-1">💡 Điểm mấu chốt của Vòng quét:</strong>
              Nếu bạn nhấn rồi nhả nút <strong>START</strong> cực nhanh trong khi CPU đang ở Bước 2, PLC sẽ chỉ ghi nhận tín hiệu khi quay trở lại <strong>Bước 1</strong> ở chu kỳ tiếp theo!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 2: Control Loop Simulator (Hệ thống Vòng hở vs Vòng kín)
═════════════════════════════════════════════════════════════════════════ */
function ControlLoopSimulator() {
  const [isClosedLoop, setIsClosedLoop] = useState<boolean>(true);
  const [setpoint, setSetpoint] = useState<number>(60); // 60°C
  const [temp, setTemp] = useState<number>(25); // Current temp
  const [heaterPower, setHeaterPower] = useState<number>(0); // 0-100%
  const [disturbance, setDisturbance] = useState<boolean>(false); // Cold draft / door open

  // Live simulation tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTemp((currentTemp) => {
        const ambient = disturbance ? 12 : 24; // If cold wind, ambient drops to 12°C
        const coolingLoss = (currentTemp - ambient) * 0.08;
        const heatingGain = (heaterPower / 100) * 8.5;
        const newTemp = Math.max(10, Math.min(100, currentTemp + heatingGain - coolingLoss));
        return parseFloat(newTemp.toFixed(1));
      });
    }, 400);

    return () => clearInterval(timer);
  }, [heaterPower, disturbance]);

  // Controller algorithm
  useEffect(() => {
    if (isClosedLoop) {
      // Closed loop: Proportional controller (P-control)
      const error = setpoint - temp;
      let power = 0;
      if (error > 0) {
        power = Math.min(100, Math.max(0, error * 8)); // Kp = 8
      } else {
        power = 0;
      }
      setHeaterPower(Math.round(power));
    } else {
      // Open loop: Fixed manual output power (e.g. 45% based on assumption)
      setHeaterPower(45);
    }
  }, [isClosedLoop, setpoint, temp]);

  return (
    <div>
      {/* Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            Lựa chọn chế độ điều khiển
          </div>
          <h3 className="text-sm font-bold text-slate-900 m-0">
            {isClosedLoop ? 'Hệ thống Điều khiển Vòng kín (Closed-Loop with Sensor Feedback)' : 'Hệ thống Điều khiển Vòng hở (Open-Loop Control)'}
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
            Vòng hở (Open-Loop)
          </button>
          <button
            onClick={() => setIsClosedLoop(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isClosedLoop
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Vòng kín (Closed-Loop)
          </button>
        </div>
      </div>

      {/* Interactive Controls & Live Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Setpoint & Disturbance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <span>🎯</span> Giá trị đặt & Nhiễu tác động
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Nhiệt độ mong muốn (Setpoint):</span>
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
              <div className="text-xs font-medium text-slate-700 mb-2">Thử nghiệm gây nhiễu môi trường:</div>
              <button
                onClick={() => setDisturbance(!disturbance)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  disturbance
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{disturbance ? '❄️ ĐANG MỞ CỬA LÒ (Gió lạnh 12°C)' : '🚪 Cửa lò đang đóng kín'}</span>
              </button>
              <p className="text-[11px] text-slate-500 mt-1">
                Nhấn để xem hệ thống phản ứng thế nào khi có nhiễu đột ngột xuất hiện!
              </p>
            </div>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <span>🌡️</span> Trạng thái nhiệt độ thực tế (PV)
          </h4>

          <div className="text-center my-auto py-2">
            <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {temp}°C
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Sai lệch: <span className={Math.abs(setpoint - temp) > 3 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {(setpoint - temp).toFixed(1)}°C
              </span>
            </div>

            {/* Visual Temperature Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-linear-to-r from-blue-500 via-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, temp))}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
            {isClosedLoop
              ? '✅ Cảm biến nhiệt gửi phản hồi liên tục về bộ so sánh.'
              : '❌ Không có cảm biến phản hồi — bộ điều khiển không hề biết nhiệt độ thực.'}
          </div>
        </div>

        {/* Controller Output */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <span>⚡</span> Tín hiệu điều khiển lò (MV)
          </h4>

          <div className="text-center my-auto py-2">
            <div className="text-4xl font-extrabold text-amber-600 font-mono tracking-tight">
              {heaterPower}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Công suất thanh điện trở
            </div>

            {/* Visual Power Bar */}
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
                Khi mở cửa lò lạnh, PLC tự động <strong>tăng công suất lên {heaterPower}%</strong> để bù lại nhiệt mất đi.
              </span>
            ) : (
              <span>
                Công suất cố định ở 45%. Khi gặp gió lạnh, lò bị nguội đi mà không thể tự bù nhiệt!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Block Diagram SVG */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Sơ đồ khối chức năng: {isClosedLoop ? 'Hệ thống Vòng kín (Closed-Loop Block Diagram)' : 'Hệ thống Vòng hở (Open-Loop Block Diagram)'}
        </h4>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 760 170" className="w-full min-w-[650px] h-auto">
            {/* Setpoint Input */}
            <rect x="10" y="50" width="90" height="40" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="55" y="68" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">Giá trị đặt SP</text>
            <text x="55" y="82" fontSize="9" textAnchor="middle" fill="#0284c7" fontWeight="bold">{setpoint}°C</text>

            <line x1="100" y1="70" x2="135" y2="70" stroke="#0284c7" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Comparator (Only active in closed loop) */}
            <circle cx="150" cy="70" r="14" fill={isClosedLoop ? '#eff6ff' : '#f1f5f9'} stroke={isClosedLoop ? '#0284c7' : '#94a3b8'} strokeWidth="2" />
            <text x="150" y="74" fontSize="14" fontWeight="bold" textAnchor="middle" fill={isClosedLoop ? '#0284c7' : '#94a3b8'}>
              {isClosedLoop ? 'Σ' : '—'}
            </text>

            <line x1="164" y1="70" x2="195" y2="70" stroke="#0284c7" strokeWidth="2" />

            {/* Controller (PLC) */}
            <rect x="195" y="45" width="115" height="50" rx="8" fill="#eff6ff" stroke="#0284c7" strokeWidth="2" />
            <text x="252" y="68" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Bộ điều khiển</text>
            <text x="252" y="82" fontSize="9" textAnchor="middle" fill="#0284c7">PLC S7-1200</text>

            <line x1="310" y1="70" x2="350" y2="70" stroke="#0284c7" strokeWidth="2" />

            {/* Actuator */}
            <rect x="350" y="45" width="105" height="50" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="402" y="68" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#78350f">Cơ cấu chấp hành</text>
            <text x="402" y="82" fontSize="9" textAnchor="middle" fill="#d97706">SSR / Thanh nhiệt</text>

            <line x1="455" y1="70" x2="495" y2="70" stroke="#d97706" strokeWidth="2" />

            {/* Process */}
            <rect x="495" y="40" width="115" height="60" rx="8" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
            <text x="552" y="68" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#14532d">Đối tượng</text>
            <text x="552" y="82" fontSize="9" textAnchor="middle" fill="#16a34a">Lò sấy / Quá trình</text>

            <line x1="610" y1="70" x2="665" y2="70" stroke="#16a34a" strokeWidth="2" />

            {/* Controlled Output */}
            <rect x="665" y="50" width="85" height="40" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="707" y="68" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">Đầu ra (PV)</text>
            <text x="707" y="82" fontSize="9" textAnchor="middle" fill="#16a34a" fontWeight="bold">{temp}°C</text>

            {/* Disturbance Arrow */}
            <line x1="552" y1="10" x2="552" y2="35" stroke={disturbance ? '#dc2626' : '#94a3b8'} strokeWidth="2" strokeDasharray="3 3" />
            <text x="552" y="8" fontSize="9" fontWeight="bold" textAnchor="middle" fill={disturbance ? '#dc2626' : '#64748b'}>
              {disturbance ? '⚠️ Nhiễu: Gió lạnh 12°C' : 'Nhiễu (Disturbance)'}
            </text>

            {/* Feedback Loop (Closed loop only) */}
            {isClosedLoop ? (
              <g>
                <line x1="635" y1="70" x2="635" y2="135" stroke="#0284c7" strokeWidth="2" />
                <line x1="635" y1="135" x2="480" y2="135" stroke="#0284c7" strokeWidth="2" />
                
                {/* Sensor block */}
                <rect x="365" y="115" width="115" height="40" rx="6" fill="#eff6ff" stroke="#0284c7" strokeWidth="1.5" />
                <text x="422" y="133" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Cảm biến đo (Sensor)</text>
                <text x="422" y="146" fontSize="8" textAnchor="middle" fill="#0284c7">Can nhiệt PT100 / K</text>

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
                  ❌ KHÔNG CÓ ĐƯỜNG PHẢN HỒI (NO FEEDBACK)
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
   TAB 3: Relay Hardwired vs PLC Comparison (So sánh Tủ Rơ-le & PLC)
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
              Tình huống thực tế trong nhà máy
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1 mb-0.5">
              Khởi động 2 động cơ: Yêu cầu thay đổi công nghệ đột xuất
            </h3>
            <p className="text-xs text-slate-600 m-0">
              {requirementChanged
                ? 'Yêu cầu mới: Động cơ 1 chạy trước 5s -> Động cơ 2 chạy. KHI DỪNG: Động cơ 2 phải dừng trước, 3s sau Động cơ 1 mới được dừng.'
                : 'Yêu cầu ban đầu: Nhấn Start -> Động cơ 1 chạy. Sau 5 giây, Động cơ 2 tự động khởi động theo.'}
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
            {requirementChanged ? '↺ Quay lại yêu cầu ban đầu' : '⚡ Yêu cầu Khách hàng Đổi công nghệ'}
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
                  <h4 className="text-sm font-bold text-slate-900 m-0">1. Tủ Điều khiển Rơ-le Cứng (Hardwired)</h4>
                  <span className="text-[11px] text-slate-500">Mạch rơ-le trung gian & contactor</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Công nghệ trước 1970
              </span>
            </div>

            {/* Visual Representation */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 font-mono text-xs">
              <div className="text-[11px] font-sans font-bold text-slate-700 mb-2">Trạng thái tủ điện:</div>
              {requirementChanged ? (
                <div className="space-y-2 text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200 text-[11px]">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🛑</span> PHẢI CẮT NGUỒN & ĐẤU LẠI DÂY VẬT LÝ:
                  </div>
                  <div>• Mua thêm: 1 Rơ-le thời gian OFF-Delay + 2 Rơ-le kiếng phụ.</div>
                  <div>• Tháo gỡ 14 đầu cosse dây điện cũ, đi máng dây mới.</div>
                  <div>• Thời gian dừng máy: <strong>3 – 4 giờ</strong> (tổn thất sản xuất).</div>
                  <div>• Nguy cơ đấu sai sót, rơ-le cơ khí bị kẹt tiếp điểm theo thời gian.</div>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>• Tủ điện kích thước lớn (600x800mm), nặng nề.</div>
                  <div>• Hàng chục rơ-le trung gian, dây điện chằng chịt trong máng.</div>
                  <div>• Tiêu hao điện liên tục để giữ cuộn hút rơ-le đóng.</div>
                  <div>• Khó tìm điểm lỗi khi một tiếp điểm bị move rỉ sét.</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
            <strong className="text-slate-800 block mb-0.5">Hạn chế cốt lõi:</strong>
            Logic điều khiển bị "khóa cứng" trong các sợi dây đồng nối giữa các linh kiện. Muốn đổi thuật toán bắt buộc phải thay đổi phần cứng!
          </div>
        </div>

        {/* Right: Modern PLC Solution */}
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <div>
                  <h4 className="text-sm font-bold text-blue-950 m-0">2. Điều khiển Lập trình PLC S7-1200</h4>
                  <span className="text-[11px] text-blue-700 font-medium">Logic nằm trong Bộ nhớ phần mềm</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Chuẩn công nghiệp hiện đại
              </span>
            </div>

            {/* Visual Representation */}
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 mb-4 font-mono text-xs">
              <div className="text-[11px] font-sans font-bold text-slate-700 mb-2">Trạng thái hệ thống PLC:</div>
              {requirementChanged ? (
                <div className="space-y-2 text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200 text-[11px]">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚡</span> DÂY ĐIỆN VẬT LÝ GIỮ NGUYÊN 100%:
                  </div>
                  <div>• Không cần chạm tay vào 1 sợi dây điện nào trong tủ!</div>
                  <div>• Mở TIA Portal, sửa 2 Network trong khối OB1 (thêm khối TOF).</div>
                  <div>• Bấm <strong>Download</strong> nạp xuống PLC mất đúng <strong>10 giây</strong>.</div>
                  <div>• Hoạt động bền bỉ, tuổi thọ điện tử hàng triệu chu kỳ đóng cắt.</div>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>• Kích thước nhỏ gọn gắn vừa thanh ray DIN TS35 tiêu chuẩn.</div>
                  <div>• Dây đấu nối tối giản: cảm biến nối vào DI, động cơ nối vào DO.</div>
                  <div>• Giám sát online (Go Online) xem trạng thái logic thời gian thực.</div>
                  <div>• Tích hợp sẵn bộ nhớ lưu trữ, truyền thông Ethernet PROFINET.</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 border border-blue-100">
            <strong className="text-blue-950 block mb-0.5">Ưu thế mang tính cách mạng:</strong>
            Mục tiêu học PLC không đơn thuần là học một ngôn ngữ lập trình, mà là học cách đưa logic vào bộ nhớ để <strong>biến việc thay đổi công nghệ trở nên cực kỳ rẻ và tức thì</strong>!
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 4: Hardware Architecture & Status LEDs (Cấu trúc & Đèn LED)
═════════════════════════════════════════════════════════════════════════ */
function HardwareAndLedExplorer() {
  const [cpuMode, setCpuMode] = useState<'run' | 'stop' | 'error' | 'maint'>('run');
  const [selectedBlock, setSelectedBlock] = useState<string>('cpu');

  const blocks: Record<string, { title: string; desc: string; specs: string[] }> = {
    cpu: {
      title: 'Khối Vi xử lý Trung tâm (CPU & Microprocessor)',
      desc: 'Bộ não của PLC S7-1200 thực thi hệ điều hành thời gian thực (RTOS) và chương trình người dùng được biên dịch sẵn.',
      specs: [
        'Tốc độ xử lý: ~0.08 µs / lệnh boolean',
        'Bộ nhớ Work Memory: 100 KB RAM tốc độ cao',
        'Bộ nhớ Load Memory: 4 MB Flash (mở rộng tới 32 GB bằng thẻ SD)',
        'Bộ nhớ Retentive: 10 KB giữ dữ liệu khi mất nguồn (không cần pin dự phòng)',
      ],
    },
    power: {
      title: 'Khối Nguồn cấp (Power Supply Module)',
      desc: 'Biến đổi nguồn 220VAC hoặc nhận nguồn 24VDC công nghiệp để hạ áp nuôi vi xử lý và cấp nguồn cảm biến phụ trợ.',
      specs: [
        'Điện áp cấp: 24 VDC (hoặc 120/230 VAC tùy mã CPU)',
        'Dải dung sai cho phép: 20.4 VDC – 28.8 VDC',
        'Nguồn ra phụ L+/M: 24 VDC, tối đa 400 mA nuôi cảm biến',
      ],
    },
    di: {
      title: 'Khối Ngõ vào Số (Digital Input Module)',
      desc: 'Giao tiếp với nút ấn, công tắc hành trình, cảm biến quang/tiệm cận. Cách ly quang học để bảo vệ CPU khỏi xung sét lan truyền.',
      specs: [
        '14 ngõ vào số 24VDC (Sink hoặc Source theo chân 1M)',
        'Mức logic 0: 0 – 5 VDC (dưới 1 mA)',
        'Mức logic 1: 15 – 30 VDC (dòng kích 4 mA)',
        'Tích hợp 6 bộ đếm tốc độ cao HSC (High Speed Counter) tới 100 kHz',
      ],
    },
    do: {
      title: 'Khối Ngõ ra Số (Digital Output Module)',
      desc: 'Xuất tín hiệu đóng cắt điều khiển rơ-le trung gian, van khí nén hoặc ngõ vào biến tần.',
      specs: [
        '10 ngõ ra transistor 24VDC (hoặc rơ-le 2A đối với mã CPU ...-1BE40)',
        'Dòng tải tối đa: 0.5A / ngõ ra transistor',
        'Hỗ trợ 4 kênh phát xung tốc độ cao PTO/PWM tới 100 kHz',
      ],
    },
    profinet: {
      title: 'Cổng Truyền thông PROFINET (RJ45 Port)',
      desc: 'Giao tiếp mạng công nghiệp thời gian thực dựa trên Ethernet, dùng để nạp code từ TIA Portal, kết nối HMI và biến tần.',
      specs: [
        'Tốc độ: 10/100 Mbit/s Full Duplex',
        'Giao thức hỗ trợ: PROFINET IO Controller/Device, S7 Communication, Modbus TCP, Open User Comms',
        'Đầu cắm chuẩn RJ45 công nghiệp có chống nhiễu',
      ],
    },
  };

  return (
    <div>
      {/* Interactive LED State Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Chẩn đoán sự cố</span>
          <h3 className="text-sm font-bold text-slate-900 m-0">Kiểm tra trạng thái các Đèn LED trên mặt trước CPU</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCpuMode('run')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'run' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🟢 RUN (Bình thường)
          </button>
          <button
            onClick={() => setCpuMode('stop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'stop' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🟡 STOP (Dừng CPU)
          </button>
          <button
            onClick={() => setCpuMode('error')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'error' ? 'bg-rose-600 text-white shadow-xs animate-pulse' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🔴 ERROR (Lỗi hệ thống)
          </button>
          <button
            onClick={() => setCpuMode('maint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cpuMode === 'maint' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            🟠 MAINT (Bảo trì/Thẻ)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Front Panel Elevation (SVG) */}
        <div className="lg:col-span-7 bg-slate-100/70 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-700 mb-2">Nhấp vào từng bộ phận trên CPU để tra cứu:</div>
          
          <svg viewBox="0 0 340 320" className="w-full max-w-[340px] h-auto drop-shadow-sm select-none">
            {/* CPU Chassis Base */}
            <rect x="20" y="20" width="300" height="280" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Top Terminal Strip (Power & Digital Inputs) */}
            <g onClick={() => setSelectedBlock('di')} className="cursor-pointer group">
              <rect x="35" y="30" width="270" height="40" rx="4" fill={selectedBlock === 'di' ? '#bae6fd' : '#f8fafc'} stroke="#64748b" strokeWidth="1.5" />
              <text x="170" y="54" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0369a1">CẦU ĐẤU NGÕ VÀO (14 DI · 24VDC)</text>
            </g>

            {/* Central Display & Logo Area */}
            <rect x="35" y="78" width="270" height="150" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
            
            {/* Siemens Brand */}
            <text x="50" y="102" fontSize="13" fontWeight="900" fill="#00646e" letterSpacing="0.05em">SIEMENS</text>
            <text x="50" y="118" fontSize="11" fontWeight="bold" fill="#334155">SIMATIC S7-1200</text>
            <text x="50" y="132" fontSize="9" fill="#64748b">CPU 1214C DC/DC/DC</text>

            {/* Diagnostic LED Indicators */}
            <g transform="translate(185, 92)">
              {/* RUN/STOP LED */}
              <circle
                cx="15" cy="12" r="5"
                fill={cpuMode === 'run' ? '#16a34a' : cpuMode === 'stop' ? '#eab308' : '#94a3b8'}
                stroke="#334155" strokeWidth="1"
              />
              <text x="26" y="15" fontSize="8" fontWeight="bold" fill="#1e293b">RUN/STOP</text>

              {/* ERROR LED */}
              <circle
                cx="15" cy="27" r="5"
                fill={cpuMode === 'error' ? '#dc2626' : '#94a3b8'}
                stroke="#334155" strokeWidth="1"
                className={cpuMode === 'error' ? 'animate-pulse' : ''}
              />
              <text x="26" y="30" fontSize="8" fontWeight="bold" fill={cpuMode === 'error' ? '#dc2626' : '#64748b'}>ERROR</text>

              {/* MAINT LED */}
              <circle
                cx="15" cy="42" r="5"
                fill={cpuMode === 'maint' ? '#f59e0b' : '#94a3b8'}
                stroke="#334155" strokeWidth="1"
              />
              <text x="26" y="45" fontSize="8" fontWeight="bold" fill="#64748b">MAINT</text>
            </g>

            {/* CPU Core Block Clickable */}
            <g onClick={() => setSelectedBlock('cpu')} className="cursor-pointer">
              <rect x="50" y="150" width="130" height="65" rx="6" fill={selectedBlock === 'cpu' ? '#dbeafe' : '#ffffff'} stroke="#3b82f6" strokeWidth="1.5" />
              <text x="115" y="178" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e40af">CPU & BỘ NHỚ</text>
              <text x="115" y="195" fontSize="8" textAnchor="middle" fill="#64748b">Load / Work / Retentive</text>
            </g>

            {/* PROFINET Port Clickable */}
            <g onClick={() => setSelectedBlock('profinet')} className="cursor-pointer">
              <rect x="195" y="150" width="110" height="65" rx="6" fill={selectedBlock === 'profinet' ? '#ccfbf1' : '#ffffff'} stroke="#0d9488" strokeWidth="1.5" />
              <text x="250" y="178" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f766e">PROFINET</text>
              <text x="250" y="195" fontSize="8" textAnchor="middle" fill="#64748b">Cổng RJ45 (100Mbps)</text>
            </g>

            {/* Bottom Terminal Strip (Digital Outputs & Power Out) */}
            <g onClick={() => setSelectedBlock('do')} className="cursor-pointer">
              <rect x="35" y="235" width="270" height="40" rx="4" fill={selectedBlock === 'do' ? '#fee2e2' : '#f8fafc'} stroke="#64748b" strokeWidth="1.5" />
              <text x="170" y="259" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#991b1b">CẦU ĐẤU NGÕ RA (10 DO · TRANSISTOR 0.5A)</text>
            </g>
          </svg>

          {/* LED Diagnosis Description */}
          <div className="w-full mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
            <strong className="text-slate-900 block mb-1">Ý nghĩa chẩn đoán thực tế của đèn LED hiện tại:</strong>
            {cpuMode === 'run' && (
              <p className="text-emerald-800 m-0">
                🟢 <strong>RUN (Xanh lá sáng liên tục):</strong> CPU đang thực thi chương trình OB1 bình thường. Mọi ngõ ra được cập nhật theo logic.
              </p>
            )}
            {cpuMode === 'stop' && (
              <p className="text-amber-800 m-0">
                🟡 <strong>STOP (Vàng sáng liên tục):</strong> CPU bị tạm dừng (người dùng chuyển chế độ từ TIA Portal hoặc thiếu OB xử lý lỗi). Tất cả ngõ ra DO bị ngắt về 0V an toàn.
              </p>
            )}
            {cpuMode === 'error' && (
              <p className="text-rose-800 m-0">
                🔴 <strong>ERROR (Đỏ nhấp nháy):</strong> Đang có lỗi phần cứng (đứt dây sensor, mất module mở rộng, tràn bộ nhớ hoặc lỗi chia cho 0 trong logic). Cần mở <em>Diagnostic Buffer</em> trên TIA Portal để đọc mã lỗi!
              </p>
            )}
            {cpuMode === 'maint' && (
              <p className="text-amber-800 m-0">
                🟠 <strong>MAINT (Vàng):</strong> Nhắc nhở bảo trì, pin nuôi đồng hồ thời gian thực yếu, hoặc thẻ nhớ Micro SD chưa được gán đúng định dạng.
              </p>
            )}
          </div>
        </div>

        {/* Right: Selected Block Technical Specs */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Chi tiết kỹ thuật
              </span>
              <span className="text-xs text-slate-400 font-mono">Catalog S7-1200</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              {blocks[selectedBlock].title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {blocks[selectedBlock].desc}
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Thông số kỹ thuật tiêu chuẩn:</div>
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
            💡 Nhấp vào các khối khác trên hình vẽ CPU bên cạnh để khám phá thêm!
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tiêu chuẩn quốc tế IEC 61131-3</span>
          <h3 className="text-sm font-bold text-slate-900 m-0">So sánh 3 ngôn ngữ lập trình trên cùng một bài toán</h3>
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
            FBD (Khối hàm Logic)
          </button>
          <button
            onClick={() => setSelectedLang('scl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'scl' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            SCL (Văn bản có cấu trúc)
          </button>
        </div>
      </div>

      {/* Interactive circuit tester */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs">
        <span className="font-bold text-blue-900">Thử nghiệm tương tác:</span>
        <button
          onClick={handleStart}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs"
        >
          Nhấn nút START
        </button>
        <button
          onClick={handleStop}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow-xs"
        >
          Nhấn nút STOP
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span>Trạng thái động cơ:</span>
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
                <h4 className="text-sm font-bold text-slate-900 m-0">LAD — Ladder Diagram (Sơ đồ hình thang)</h4>
                <p className="text-xs text-slate-500 m-0">Mô phỏng đường cấp nguồn và các tiếp điểm rơ-le. Phổ biến nhất tại Việt Nam.</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Ngành Điện - Tự động</span>
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
                <h4 className="text-sm font-bold text-slate-900 m-0">FBD — Function Block Diagram (Sơ đồ khối hàm)</h4>
                <p className="text-xs text-slate-500 m-0">Dựa trên các cổng logic điện tử số (AND, OR, NOT). Rất trực quan với kỹ sư điện tử.</p>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Ngành Điện tử - Điều khiển</span>
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
                <h4 className="text-sm font-bold text-slate-900 m-0">SCL — Structured Control Language (Ngôn ngữ có cấu trúc)</h4>
                <p className="text-xs text-slate-500 m-0">Dạng văn bản cấp cao tương tự Pascal / C. Cực mạnh khi xử lý công thức toán, mảng và thuật toán phức tạp.</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Ngành Công nghệ thông tin</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre className="m-0 leading-relaxed">
{`// ─────────────────────────────────────────────────────────────
// S7-1200 SCL: Mạch khởi động và tự giữ động cơ
// ─────────────────────────────────────────────────────────────
IF ("btn_Start" OR "motor_Q0_0") AND NOT "btn_Stop" THEN
    "motor_Q0_0" := TRUE;   // Động cơ được kích hoạt và tự giữ
ELSE
    "motor_Q0_0" := FALSE;  // Ngắt động cơ khi nhấn nút Stop
END_IF;

// Trạng thái biến thực tế hiện tại:
"btn_Start"  := ${isStartPressed ? 'TRUE' : 'FALSE'};
"btn_Stop"   := FALSE;
"motor_Q0_0" => ${isMotorOn ? 'TRUE (Đang chạy 380V)' : 'FALSE (Đang dừng)'};`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

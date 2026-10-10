'use client';

import { useState, useId } from 'react';

/* ═══════════════════════════════════════════════════════════════
   L02 — SIMATIC S7-1200 Rack Explorer

   Hình chiếu đứng (front elevation) của một rack S7-1200 thật.
   ⚠ Toạ độ SVG dùng trực tiếp đơn vị MILIMÉT theo catalog Siemens
     (S7-1200 System Manual — Technical Specifications):
       · Mọi module:       cao 100 mm, sâu 75 mm
       · CM 1241:          rộng  30 mm
       · CPU 1214C:        rộng 110 mm
       · SM 1221/22/31/32: rộng  45 mm
       · PM 1207:          rộng  70 mm
   Thứ tự lắp đúng chuẩn: CM (tối đa 3) ← CPU → SM (tối đa 8).
   PM 1207 KHÔNG cắm backplane — chỉ gá cạnh trên cùng thanh DIN TS35.
═══════════════════════════════════════════════════════════════ */

type Pins = { count: number; label: string; names?: string[] };

type Mod = {
  id: string;
  w: number;
  label: string;        // nhãn trong UI
  print: string;        // chữ in trên vỏ
  print2?: string;
  order: string;        // MLFB (Order No.)
  color: string;
  desc: string;
  specs: string[];
  leds: { t: string; c: 'run' | 'err' | 'diag' | 'warn' }[];
  doors: 'screw' | 'dsub';
  top?: Pins[];
  bot?: Pins[];
  port?: boolean;       // cổng PROFINET RJ45
  cardSlot?: boolean;   // khe SIMATIC Memory Card
  bus?: boolean;        // có chân cắm backplane
};

const RACK: Mod[] = [
  {
    id: 'cm',
    w: 30,
    label: 'CM 1241 — RS485',
    print: 'CM 1241',
    print2: 'RS485',
    order: '6ES7 241-1CH32-0XB0',
    color: '#0891b2',
    doors: 'dsub',
    bus: true,
    desc:
      'Communication Module — cổng nối tiếp RS422/RS485 cách ly, dùng cho Modbus RTU, USS Drive hoặc giao thức Freeport tự định nghĩa. Lắp BÊN TRÁI CPU, tối đa 3 module. Được CPU cấp nguồn qua backplane nên không cần nguồn ngoài.',
    specs: [
      'RS422 / RS485 cách ly',
      '300 bps – 115.2 kbps',
      'Modbus RTU · USS · Freeport',
      'Đầu nối D-sub 9 chân',
      'Tối đa 3 CM bên trái CPU',
    ],
    leds: [
      { t: 'DIAG', c: 'diag' },
      { t: 'TxD', c: 'warn' },
      { t: 'RxD', c: 'warn' },
    ],
  },
  {
    id: 'cpu',
    w: 110,
    label: 'CPU 1214C DC/DC/RLY',
    print: 'CPU 1214C',
    print2: 'DC/DC/RLY',
    order: '6ES7 214-1HG40-0XB0',
    color: '#1a3a6b',
    doors: 'screw',
    bus: true,
    desc:
      'Bộ xử lý trung tâm — chứa chương trình người dùng, thực thi chu kỳ quét (đọc PII → xử lý logic → ghi PIQ), quản lý toàn bộ I/O trên backplane và truyền thông PROFINET. Biến thể DC/DC/RLY: nguồn nuôi 24VDC, đầu vào 24VDC, đầu ra tiếp điểm relay.',
    specs: [
      '14 × DI 24VDC (sink/source)',
      '10 × DQ relay 2A',
      '2 × AI 0–10V, 10-bit',
      '100 KB work memory',
      '4 MB load memory',
      'PROFINET 100 Mbps (RJ45)',
      '6 × HSC 100 kHz',
      'Tối đa 8 SM + 3 CM + 1 SB',
    ],
    leds: [
      { t: 'RUN/STOP', c: 'run' },
      { t: 'ERROR', c: 'err' },
      { t: 'MAINT', c: 'warn' },
    ],
    top: [
      { count: 8, label: 'DI a' },
      { count: 6, label: 'DI b' },
    ],
    bot: [
      { count: 8, label: 'DQ a' },
      { count: 2, label: 'DQ b' },
    ],
    port: true,
    cardSlot: true,
  },
  {
    id: 'sm-di',
    w: 45,
    label: 'SM 1221 — DI',
    print: 'SM 1221',
    print2: 'DI 8×24VDC',
    order: '6ES7 221-1BF32-0XB0',
    color: '#3b82f6',
    doors: 'screw',
    bus: true,
    desc:
      'Signal Module đầu vào số. Mở rộng thêm 8 (hoặc 16) kênh DI 24VDC. Cắm nối tiếp BÊN PHẢI CPU qua backplane, tự nhận địa chỉ khi khai báo trong Device Configuration của TIA Portal.',
    specs: [
      '8 × DI 24VDC',
      'IEC 61131-2 Type 1 sink',
      'Ngưỡng ON: 15–30 VDC',
      'Ngưỡng OFF: −3…+5 VDC',
      'Cách ly quang 500 VAC',
      'Lọc nhiễu 0.2–12.8 ms',
    ],
    leds: [{ t: 'DIAG', c: 'diag' }],
    top: [{ count: 8, label: 'DI a' }],
  },
  {
    id: 'sm-do',
    w: 45,
    label: 'SM 1222 — DQ',
    print: 'SM 1222',
    print2: 'DQ 8×24VDC',
    order: '6ES7 222-1BF32-0XB0',
    color: '#ef4444',
    doors: 'screw',
    bus: true,
    desc:
      'Signal Module đầu ra số. Hai biến thể: transistor (24VDC, 0.5A, chuyển mạch nhanh, chỉ tải DC) và relay (2A, đóng được tải AC nhưng tuổi thọ tiếp điểm hữu hạn — cỡ 10⁵ lần đóng cắt ở tải định mức).',
    specs: [
      '8 × DQ 24VDC / 0.5A',
      'Biến thể relay: 2A AC/DC',
      'Dòng rò ≤ 10 µA',
      'KHÔNG bảo vệ quá dòng',
      'Cần diode dập cho tải cảm',
    ],
    leds: [{ t: 'DIAG', c: 'diag' }],
    bot: [{ count: 8, label: 'DQ a' }],
  },
  {
    id: 'sm-ai',
    w: 45,
    label: 'SM 1231 — AI',
    print: 'SM 1231',
    print2: 'AI 4×13bit',
    order: '6ES7 231-4HD32-0XB0',
    color: '#f59e0b',
    doors: 'screw',
    bus: true,
    desc:
      'Signal Module đầu vào tương tự. Đọc điện áp ±10V/±5V/±2.5V hoặc dòng 0–20 mA. Giá trị số hoá trả về dải chuẩn hoá 0–27648 (đơn cực) — con số phải nhớ khi dùng NORM_X / SCALE_X.',
    specs: [
      '4 × AI, 12-bit + dấu',
      '±10V / ±5V / ±2.5V / 0–20mA',
      'Dải số: 0–27648',
      'Trở kháng vào ≥ 9 MΩ (áp)',
      'Chuyển đổi 625 µs/kênh',
      'Khử nhiễu 400/60/50/10 Hz',
    ],
    leds: [{ t: 'DIAG', c: 'diag' }],
    top: [
      { count: 8, label: 'AI 0–3', names: ['0+', '0−', '1+', '1−', '2+', '2−', '3+', '3−'] },
    ],
  },
  {
    id: 'sm-ao',
    w: 45,
    label: 'SM 1232 — AQ',
    print: 'SM 1232',
    print2: 'AQ 2×14bit',
    order: '6ES7 232-4HB32-0XB0',
    color: '#8b5cf6',
    doors: 'screw',
    bus: true,
    desc:
      'Signal Module đầu ra tương tự. Phát ±10V (14-bit) hoặc 0–20 mA (13-bit) để điều khiển biến tần, van tỷ lệ, servo drive. Lưu ý giới hạn tải: ≤ 1 kΩ với ngõ ra dòng, ≥ 1 kΩ với ngõ ra áp.',
    specs: [
      '2 × AQ',
      '±10V: 14-bit',
      '0–20 mA: 13-bit',
      'Dải số: 0–27648',
      'Tải ≤ 1 kΩ (dòng) / ≥ 1 kΩ (áp)',
      'Thời gian ổn định 300 µs',
    ],
    leds: [{ t: 'DIAG', c: 'diag' }],
    bot: [{ count: 4, label: 'AQ 0–1', names: ['0', '0M', '1', '1M'] }],
  },
];

const PSU: Mod = {
  id: 'psu',
  w: 70,
  label: 'PM 1207 — Nguồn 24VDC',
  print: 'PM 1207',
  print2: '24V / 2.5A',
  order: '6EP1332-1SH71',
  color: '#16a34a',
  doors: 'screw',
  bus: false,
  desc:
    'Bộ nguồn ổn áp AC/DC cấp 24VDC cho CPU, các module và thiết bị hiện trường. QUAN TRỌNG: PM 1207 KHÔNG cắm vào backplane — nó chỉ gá cạnh CPU trên cùng thanh DIN và nối bằng dây tới cặp cực L+/M. Đây là lỗi rất hay gặp khi sinh viên vẽ sơ đồ lắp đặt lần đầu.',
  specs: [
    'Vào: 120/230 VAC (85–264 V)',
    'Ra: 24 VDC ± 3%, 2.5 A',
    'Ripple < 150 mV pp',
    'Hiệu suất ~ 87%',
    'Bảo vệ quá tải / ngắn mạch',
    'Không chiếm slot backplane',
  ],
  leds: [{ t: 'DC OK', c: 'run' }],
  top: [{ count: 3, label: 'AC IN', names: ['L', 'N', 'PE'] }],
  bot: [{ count: 4, label: 'OUT 24VDC', names: ['L+', 'L+', 'M', 'M'] }],
};

/* ── Bố trí ngang: cộng dồn bề rộng thật (mm) ── */
const GAP = 14;
const PSU_X = 4;
const RACK_X = PSU_X + PSU.w + GAP;

const PLACED = (() => {
  let x = RACK_X;
  return RACK.map((m) => {
    const p = { ...m, x };
    x += m.w;
    return p;
  });
})();

const LAST = PLACED[PLACED.length - 1];
const RACK_END = LAST.x + LAST.w;
const VB_W = RACK_END + 5;

/* ── Phân tầng mặt trước vỏ S7-1200 (mm, gốc = mép trên module) ── */
const TOP = 6;
const H = 100;
const BOT = TOP + H;
const VENT_Y = TOP + 1.8;
const VENT_H = 14;
const BRAND_Y = TOP + 17.5;
const DOOR_H = 13;
const TOP_DOOR_Y = TOP + 27;
const MID_Y = TOP + 41.5;
const BOT_DOOR_Y = BOT - 16;
const VB_H = BOT + 11;

const C = {
  vent: '#1f232a',
  slat: '#3d444d',
  door: '#767d88',
  doorEdge: '#4e555f',
  pin: '#15181c',
  print: '#dde1e6',
  printDim: '#a2a9b3',
  printFaint: '#8a919b',
  siemens: '#099',
  gold: '#c8a63c',
  rail: '#c2c8ce',
  railDark: '#949aa2',
};

export default function S7RackExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(true);
  const uid = useId().replace(/:/g, '');

  const all: (Mod & { x: number })[] = [...PLACED, { ...PSU, x: PSU_X }];
  const sel = all.find((m) => m.id === selected);
  const pick = (id: string) => setSelected((s) => (s === id ? null : id));

  const renderModule = (m: Mod & { x: number }) => {
    const on = selected === m.id;
    const { w } = m;
    const isCpu = m.id === 'cpu';

    return (
      <g
        key={m.id}
        transform={`translate(${m.x} 0)`}
        onClick={() => pick(m.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick(m.id);
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={on}
        aria-label={m.label}
        className={`s7mod-${uid}`}
        style={{ cursor: 'pointer', outline: 'none' }}
      >
        {/* bóng đổ */}
        <rect x={1} y={TOP + 2} width={w} height={H} rx={1.6} fill="#000" opacity={0.15} />

        {/* thân vỏ */}
        <rect
          x={0}
          y={TOP}
          width={w}
          height={H}
          rx={1.6}
          fill={`url(#${uid}-body)`}
          stroke={on ? m.color : '#3a4048'}
          strokeWidth={on ? 0.9 : 0.28}
        />
        <rect x={0.35} y={TOP + 0.4} width={0.8} height={H - 0.8} rx={0.4} fill="#b6bcc4" opacity={0.5} />
        <rect x={w - 1.15} y={TOP + 0.4} width={0.8} height={H - 0.8} rx={0.4} fill="#2f343b" opacity={0.45} />

        {/* khe tản nhiệt đỉnh */}
        <rect x={2.2} y={VENT_Y} width={w - 4.4} height={VENT_H} rx={1} fill={C.vent} />
        {Array.from({ length: 5 }).map((_, i) => (
          <rect
            key={i}
            x={3.4}
            y={VENT_Y + 1.5 + i * 2.5}
            width={w - 6.8}
            height={1.1}
            rx={0.5}
            fill={C.slat}
            opacity={0.9}
          />
        ))}

        {/* dải thương hiệu */}
        {isCpu ? (
          <g>
            <rect x={4} y={BRAND_Y} width={17.6} height={5.4} rx={0.8} fill={C.siemens} />
            <text x={12.8} y={BRAND_Y + 3.9} fontSize={3.2} fill="#fff" textAnchor="middle" fontWeight={800} letterSpacing={-0.1}>
              SIEMENS
            </text>
            <text x={w - 5} y={BRAND_Y + 2.6} fontSize={2.9} fill={C.printDim} textAnchor="end" fontWeight={600}>
              SIMATIC
            </text>
            <text x={w - 5} y={BRAND_Y + 7} fontSize={4.2} fill={C.print} textAnchor="end" fontWeight={700} letterSpacing={-0.12}>
              S7-1200
            </text>
          </g>
        ) : (
          <g>
            <rect x={4} y={BRAND_Y + 0.6} width={12.6} height={4} rx={0.6} fill={C.siemens} opacity={0.92} />
            <text x={10.3} y={BRAND_Y + 3.5} fontSize={2.35} fill="#fff" textAnchor="middle" fontWeight={800} letterSpacing={-0.06}>
              SIEMENS
            </text>
          </g>
        )}

        {/* cửa terminal trên */}
        {m.doors === 'screw' && (
          <>
            <rect
              x={2.2}
              y={TOP_DOOR_Y}
              width={w - 4.4}
              height={DOOR_H}
              rx={0.9}
              fill={`url(#${uid}-door)`}
              stroke={C.doorEdge}
              strokeWidth={0.22}
            />
            {renderPins(m.top, w, TOP_DOOR_Y)}
          </>
        )}

        {/* mặt trước giữa */}
        <rect
          x={2.2}
          y={MID_Y}
          width={w - 4.4}
          height={BOT_DOOR_Y - MID_Y - 1}
          rx={0.9}
          fill={`url(#${uid}-face)`}
        />

        {/* đầu nối D-sub 9 chân (chỉ CM) */}
        {m.doors === 'dsub' && (
          <g transform={`translate(${w / 2 - 9} ${TOP_DOOR_Y + 2})`}>
            <path d="M1.4 0 H16.6 L18 8 H0 Z" fill="#1a1d22" />
            <path d="M2.6 1.6 H15.4 L16.4 6.6 H1.6 Z" fill="#0d0f12" />
            {Array.from({ length: 5 }).map((_, i) => (
              <circle key={`a${i}`} cx={4 + i * 2.6} cy={3.4} r={0.5} fill={C.gold} />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <circle key={`b${i}`} cx={5.3 + i * 2.6} cy={5.6} r={0.5} fill={C.gold} />
            ))}
            <text x={9} y={11.6} fontSize={2.1} fill={C.printFaint} textAnchor="middle" fontWeight={600}>
              X20 · RS485
            </text>
          </g>
        )}

        {/* LED chỉ thị */}
        <g transform={`translate(4.4 ${MID_Y + 3})`}>
          {m.leds.map((l, i) => {
            const lit = l.c === 'err' ? false : l.c === 'warn' ? false : running;
            const col =
              l.c === 'run' || l.c === 'diag' ? (running ? '#22c55e' : '#f59e0b')
              : l.c === 'err' ? '#ef4444'
              : '#f59e0b';
            return (
              <g key={l.t} transform={`translate(0 ${i * 5})`}>
                {lit && <rect x={-0.6} y={-0.6} width={4.6} height={3} rx={1} fill={col} opacity={0.3} />}
                <rect
                  x={0}
                  y={0}
                  width={3.4}
                  height={1.8}
                  rx={0.5}
                  fill={lit ? col : '#2a2f36'}
                  stroke="#181b1f"
                  strokeWidth={0.15}
                  className={lit && l.c === 'diag' ? `s7blink-${uid}` : undefined}
                />
                <text x={4.6} y={1.65} fontSize={2.1} fill={C.printDim} fontWeight={600}>
                  {l.t}
                </text>
              </g>
            );
          })}
        </g>

        {/* khe SIMATIC Memory Card + cổng PROFINET (chỉ CPU) */}
        {m.cardSlot && (
          <g>
            <rect x={w - 20} y={MID_Y + 3.4} width={13} height={2.4} rx={0.6} fill="#1c1f24" />
            <rect x={w - 19} y={MID_Y + 4} width={11} height={1.2} rx={0.3} fill="#0d0f12" />
            <text x={w - 6.6} y={MID_Y + 10} fontSize={2.2} fill={C.printFaint} textAnchor="end" fontWeight={600}>
              MEMORY CARD
            </text>
          </g>
        )}
        {m.port && (
          <g transform={`translate(4.4 ${BOT_DOOR_Y - 14})`}>
            <rect x={3.6} y={-1.4} width={4.6} height={2.4} rx={0.5} fill="#14171b" />
            <rect x={0} y={0} width={11.8} height={9.6} rx={0.9} fill="#14171b" />
            <rect x={0.9} y={0.9} width={10} height={5.4} rx={0.4} fill="#0a0c0e" />
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={1.6 + i * 1.15} y={1.4} width={0.6} height={3.4} fill={C.gold} opacity={0.9} />
            ))}
            <circle cx={2.6} cy={8} r={0.7} fill={running ? '#22c55e' : '#2a2f36'} />
            <circle cx={9.2} cy={8} r={0.7} fill={running ? '#f59e0b' : '#2a2f36'} />
            <text x={13.4} y={4.4} fontSize={2.4} fill={C.printDim} fontWeight={700}>
              PROFINET
            </text>
            <text x={13.4} y={7.8} fontSize={2} fill={C.printFaint}>
              X1 P1 · 10/100
            </text>
          </g>
        )}

        {/* tên module in trên vỏ */}
        {isCpu ? (
          <g>
            <text x={w - 5} y={BOT_DOOR_Y - 8.4} fontSize={4} fill={C.print} textAnchor="end" fontWeight={700}>
              CPU 1214C
            </text>
            <text x={w - 5} y={BOT_DOOR_Y - 4} fontSize={2.9} fill={C.printDim} textAnchor="end" fontWeight={600}>
              DC/DC/RLY
            </text>
          </g>
        ) : (
          <g transform={`translate(${w - 3.6} ${BOT_DOOR_Y - 2.5}) rotate(-90)`}>
            <text x={0} y={0} fontSize={3.1} fill={C.print} fontWeight={700}>
              {m.print}
            </text>
            <text x={0} y={-3.7} fontSize={2.4} fill={C.printDim} fontWeight={600}>
              {m.print2}
            </text>
          </g>
        )}

        {/* số MLFB in mờ ở góc dưới trái */}
        <text x={3.4} y={BOT_DOOR_Y - 2.4} fontSize={1.75} fill={C.printFaint} fontFamily="monospace">
          {m.order}
        </text>

        {/* cửa terminal dưới */}
        {m.doors === 'screw' && (
          <>
            <rect
              x={2.2}
              y={BOT_DOOR_Y}
              width={w - 4.4}
              height={DOOR_H}
              rx={0.9}
              fill={`url(#${uid}-door)`}
              stroke={C.doorEdge}
              strokeWidth={0.22}
            />
            {renderPins(m.bot, w, BOT_DOOR_Y)}
          </>
        )}

        {/* chân cắm backplane bên phải (module cuối dãy không có module kế nên bỏ) */}
        {m.bus && m.id !== LAST.id && (
          <g>
            <rect x={w - 0.9} y={MID_Y - 2} width={1.9} height={15} rx={0.4} fill="#282c32" />
            {Array.from({ length: 7 }).map((_, i) => (
              <rect key={i} x={w - 0.55} y={MID_Y - 0.6} width={1.15} height={0.9} fill={C.gold} transform={`translate(0 ${i * 1.9})`} />
            ))}
          </g>
        )}

        {on && <rect x={0} y={TOP} width={w} height={H} rx={1.6} fill={m.color} opacity={0.13} />}
      </g>
    );
  };

  return (
    <div
      style={{
        background: '#fafafa',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
      }}
    >
      <style>{`
        @keyframes s7bk-${uid} { 0%,45%{opacity:1} 55%,100%{opacity:.3} }
        .s7blink-${uid} { animation: s7bk-${uid} 1.6s steps(1,end) infinite; }
        .s7mod-${uid} > rect:nth-of-type(2) { transition: filter .15s; }
        .s7mod-${uid}:hover > rect:nth-of-type(2) { filter: brightness(1.1); }
        .s7mod-${uid}:focus-visible > rect:nth-of-type(2) { stroke: #1a3a6b; stroke-width: 1.1; }
        @media (prefers-reduced-motion: reduce) { .s7blink-${uid} { animation: none; } }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#737373',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          🔧 Rack SIMATIC S7-1200 — click vào module
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setRunning((r) => !r)}
          aria-label="Đổi trạng thái CPU giữa RUN và STOP"
          style={{
            padding: '6px 14px',
            borderRadius: '99px',
            border: `1px solid ${running ? '#16a34a44' : '#f59e0b44'}`,
            background: running ? '#16a34a12' : '#f59e0b12',
            color: running ? '#16a34a' : '#b45309',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: running ? '#16a34a' : '#f59e0b',
              display: 'inline-block',
            }}
          />
          {running ? 'RUN' : 'STOP'}
        </button>
      </div>

      {/* ── RACK ── */}
      <div
        style={{
          overflowX: 'auto',
          background: 'linear-gradient(#f5f6f8, #e9ebef)',
          border: '1px solid #e0e2e6',
          borderRadius: '10px',
          padding: '12px 12px 4px',
        }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ width: '100%', minWidth: '880px', display: 'block' }}
          role="group"
          aria-label="Sơ đồ rack SIMATIC S7-1200"
        >
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#98a0a9" />
              <stop offset="16%" stopColor="#828993" />
              <stop offset="70%" stopColor="#6d747d" />
              <stop offset="100%" stopColor="#59606a" />
            </linearGradient>
            <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#79808a" />
              <stop offset="100%" stopColor="#6b727c" />
            </linearGradient>
            <linearGradient id={`${uid}-door`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#878e98" />
              <stop offset="55%" stopColor="#757c86" />
              <stop offset="100%" stopColor="#666d77" />
            </linearGradient>
            <linearGradient id={`${uid}-rail`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfe3e8" />
              <stop offset="45%" stopColor={C.rail} />
              <stop offset="100%" stopColor={C.railDark} />
            </linearGradient>
          </defs>

          {/* thanh DIN TS35 chạy suốt phía sau */}
          <rect x={0} y={BOT - 3.5} width={VB_W} height={7} rx={0.8} fill={`url(#${uid}-rail)`} />
          <rect x={0} y={BOT - 3.5} width={VB_W} height={1.1} fill="#eef1f4" opacity={0.75} />
          {Array.from({ length: Math.floor(VB_W / 24) }).map((_, i) => (
            <ellipse key={i} cx={11 + i * 24} cy={BOT + 0.4} rx={2.5} ry={1.1} fill="#8e959d" opacity={0.5} />
          ))}

          {/* PM 1207 — gá riêng, KHÔNG cắm backplane */}
          {renderModule({ ...PSU, x: PSU_X })}

          {/* cụm backplane: CM ← CPU → SM */}
          {PLACED.map((m) => renderModule(m))}

          {/* chú thích khoảng hở PSU ↔ rack (vẽ SAU module để không bị che) */}
          <g>
            <line
              x1={PSU_X + PSU.w + 0.8}
              y1={BOT_DOOR_Y + 4}
              x2={RACK_X - 0.8}
              y2={BOT_DOOR_Y + 4}
              stroke="#dc2626"
              strokeWidth={0.6}
              strokeDasharray="1.6 1.2"
              strokeLinecap="round"
            />
            <circle cx={PSU_X + PSU.w + 0.8} cy={BOT_DOOR_Y + 4} r={0.9} fill="#dc2626" />
            <circle cx={RACK_X - 0.8} cy={BOT_DOOR_Y + 4} r={0.9} fill="#dc2626" />
            <text
              x={PSU_X + PSU.w + GAP / 2}
              y={BOT_DOOR_Y + 1.4}
              fontSize={2.6}
              fill="#dc2626"
              textAnchor="middle"
              fontWeight={800}
            >
              L+ / M
            </text>
            <text
              x={PSU_X + PSU.w + GAP / 2}
              y={MID_Y + 4}
              fontSize={2.3}
              fill="#9ca3af"
              textAnchor="middle"
              fontWeight={700}
            >
              KHÔNG
            </text>
            <text
              x={PSU_X + PSU.w + GAP / 2}
              y={MID_Y + 7.4}
              fontSize={2.3}
              fill="#9ca3af"
              textAnchor="middle"
              fontWeight={700}
            >
              backplane
            </text>
          </g>

          {/* thước bề rộng cụm backplane */}
          <g opacity={0.85}>
            <line x1={RACK_X} y1={VB_H - 3} x2={RACK_END} y2={VB_H - 3} stroke="#9ca3af" strokeWidth={0.35} />
            <line x1={RACK_X} y1={VB_H - 4.6} x2={RACK_X} y2={VB_H - 1.4} stroke="#9ca3af" strokeWidth={0.35} />
            <line x1={RACK_END} y1={VB_H - 4.6} x2={RACK_END} y2={VB_H - 1.4} stroke="#9ca3af" strokeWidth={0.35} />
            <rect x={(RACK_X + RACK_END) / 2 - 11} y={VB_H - 5.4} width={22} height={4.6} fill="#eceef1" />
            <text
              x={(RACK_X + RACK_END) / 2}
              y={VB_H - 2}
              fontSize={2.9}
              fill="#6b7280"
              textAnchor="middle"
              fontWeight={700}
            >
              {RACK_END - RACK_X} mm
            </text>
          </g>
        </svg>
      </div>

      {/* ── Bảng thông số ── */}
      {sel ? (
        <div
          style={{
            marginTop: '14px',
            background: `${sel.color}08`,
            border: `1px solid ${sel.color}33`,
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: sel.color }}>{sel.label}</div>
            <code
              style={{
                fontSize: '11px',
                color: '#6b7280',
                background: '#fff',
                border: '1px solid #e5e5e5',
                padding: '2px 8px',
                borderRadius: '5px',
              }}
            >
              {sel.order}
            </code>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>{sel.w} × 100 × 75 mm</span>
          </div>
          <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>{sel.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {sel.specs.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  background: `${sel.color}15`,
                  color: sel.color,
                  borderRadius: '99px',
                  fontWeight: 600,
                  border: `1px solid ${sel.color}33`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: '14px',
            padding: '14px',
            background: '#f9fafb',
            border: '1px solid #f0f0f0',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '13px',
          }}
        >
          👆 Click vào module bất kỳ để xem thông số · Hình vẽ đúng tỉ lệ mm theo catalog Siemens
        </div>
      )}

      <p style={{ fontSize: '11px', color: '#a3a3a3', marginTop: '10px', lineHeight: 1.6 }}>
        Thứ tự lắp chuẩn: <strong>CM (tối đa 3) ← CPU → SM (tối đa 8)</strong>. PM 1207 không chiếm slot
        backplane, chỉ gá cùng thanh DIN TS35 rồi nối dây L+/M sang CPU. Kích thước và thông số theo{' '}
        <em>S7-1200 System Manual</em> — số MLFB nên đối chiếu lại trên Siemens Industry Mall trước khi đặt hàng.
      </p>
    </div>
  );
}

/* ── Dãy chân terminal in trên cửa (kiểu nhãn .0 .1 .2 … của Siemens) ── */
function renderPins(groups: Pins[] | undefined, w: number, doorY: number) {
  const pad = 4;
  const avail = w - pad * 2;

  // Cửa không khai báo chân: vẫn vẽ dãy vít trơn cho đúng hình dáng vỏ thật
  if (!groups) {
    const n = Math.max(4, Math.round(avail / 5.4));
    const step = avail / n;
    return (
      <g opacity={0.75}>
        {Array.from({ length: n }).map((_, k) => (
          <rect
            key={k}
            x={pad + k * step + step / 2 - 0.75}
            y={doorY + 2.6}
            width={1.5}
            height={1.5}
            rx={0.25}
            fill={C.pin}
          />
        ))}
      </g>
    );
  }

  // Khe phân nhóm: Siemens in DI a / DI b tách rời, không phải một dãy liền
  const GRP_GAP = 0.9; // tính bằng "đơn vị ô"
  const total = groups.reduce((s, g) => s + g.count, 0) + (groups.length - 1) * GRP_GAP;
  const step = avail / total;
  let idx = 0;

  return (
    <g>
      {groups.map((g, gi) => {
        const start = idx;
        idx += g.count + GRP_GAP;
        const mid = pad + (start + g.count / 2) * step;
        return (
          <g key={gi}>
            {Array.from({ length: g.count }).map((_, k) => {
              const cx = pad + (start + k) * step + step / 2;
              return (
                <g key={k}>
                  <rect x={cx - 0.75} y={doorY + 2.2} width={1.5} height={1.5} rx={0.25} fill={C.pin} />
                  <text x={cx} y={doorY + 6.4} fontSize={1.7} fill={C.printDim} textAnchor="middle">
                    {g.names ? g.names[k] : `.${k}`}
                  </text>
                </g>
              );
            })}
            <text x={mid} y={doorY + 10.6} fontSize={2.2} fill={C.print} textAnchor="middle" fontWeight={700}>
              {g.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

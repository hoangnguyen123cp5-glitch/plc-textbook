import { LessonMeta, LessonSource } from '@/types/lesson';

/**
 * Chương trình học — dựng theo ĐỀ CƯƠNG THẬT trong thư mục Slide/.
 *
 * Thư mục slide chứa hai môn riêng biệt, không phải một:
 *   · AUT206 — PLC CƠ BẢN   → bài 01–07
 *   · AUT207 — PLC NÂNG CAO → bài 08–15
 * Ở đây hai môn được gộp thành một lộ trình liền mạch đi từ cơ bản lên nâng cao,
 * đánh số lại 01–15. Mã môn gốc giữ trong trường `course` để đối chiếu với
 * chương trình của trường; file slide nguồn nằm ở src/data/slide-index.ts.
 *
 * Số mục (x.y) trong tiêu đề topic là số mục THẬT trên slide gốc — giữ nguyên
 * để sinh viên đối chiếu được giữa video, web và tập slide in.
 */

const lessonSources: LessonSource[] = [
  {
    id: 1, slug: '01-programmable-control', title: 'Programmable Control Fundamentals',
    description: 'Hardwired vs programmable control, PLC architecture, scan cycle, IEC 61131-3 languages',
    course: 'AUT206', session: 1, lab: 'Lab 1', clo: 'G1',
    color: '#1a3a6b', icon: '🏭',
    topics: [
      { id: 1, slug: 'control-system-basics', title: '1.1 What a Control System Is', durationMinutes: 7, parentLessonSlug: '01-programmable-control' },
      { id: 2, slug: 'loop-types', title: '1.2 Open-Loop, Closed-Loop and Computerised Control', durationMinutes: 6, parentLessonSlug: '01-programmable-control' },
      { id: 3, slug: 'hardwired-vs-programmable', title: '1.3 Hardwired versus Programmable Control', durationMinutes: 7, parentLessonSlug: '01-programmable-control' },
      { id: 4, slug: 'why-plc', title: '1.4 Why Industry Switched to the PLC', durationMinutes: 6, parentLessonSlug: '01-programmable-control' },
      { id: 5, slug: 'defining-plc', title: '1.5 Defining the PLC', durationMinutes: 5, parentLessonSlug: '01-programmable-control' },
      { id: 6, slug: 'plc-structure', title: '1.6 Structure of a PLC', durationMinutes: 8, parentLessonSlug: '01-programmable-control' },
      { id: 7, slug: 'memory-and-leds', title: '1.7 Memory Structure and Status Indicators', durationMinutes: 7, parentLessonSlug: '01-programmable-control' },
      { id: 8, slug: 'scan-cycle', title: '1.8 The Scan Cycle', durationMinutes: 7, parentLessonSlug: '01-programmable-control' },
      { id: 9, slug: 'languages-structure', title: '1.9 Programming Languages and Program Structure', durationMinutes: 5, parentLessonSlug: '01-programmable-control' },
    ],
  },
  {
    id: 2, slug: '02-s7-1200-tia-portal', title: 'S7-1200 Hardware and TIA Portal',
    description: 'S7-1200 device family, program processing, field wiring, TIA Portal installation and use',
    course: 'AUT206', session: 1, lab: 'Lab 1', clo: 'G1',
    color: '#1a3a6b', icon: '💻',
    topics: [
      { id: 1, slug: 's7-1200-device', title: '1.3 The S7-1200 Programmable Controller', durationMinutes: 12, parentLessonSlug: '02-s7-1200-tia-portal' },
      { id: 2, slug: 'program-processing', title: '1.4 Program Processing in TIA Portal', durationMinutes: 10, parentLessonSlug: '02-s7-1200-tia-portal' },
      { id: 3, slug: 'field-wiring', title: '1.5 Wiring the PLC to Field Devices', durationMinutes: 12, parentLessonSlug: '02-s7-1200-tia-portal' },
      { id: 4, slug: 'verify-wiring', title: '1.6 Verifying Wiring in Software', durationMinutes: 8, parentLessonSlug: '02-s7-1200-tia-portal' },
      { id: 5, slug: 'install-tia', title: '1.7 Installing TIA Portal', durationMinutes: 8, parentLessonSlug: '02-s7-1200-tia-portal' },
      { id: 6, slug: 'using-tia', title: '1.8 Working with TIA Portal', durationMinutes: 14, parentLessonSlug: '02-s7-1200-tia-portal' },
      { id: 7, slug: 'comms-setup', title: '1.9 Communication Setup (PC/PPI Cable)', durationMinutes: 8, parentLessonSlug: '02-s7-1200-tia-portal' },
    ],
  },
  {
    id: 3, slug: '03-binary-operations', title: 'Binary Operations',
    description: 'Logic links, set/reset instructions, timers, counters and a worked application',
    course: 'AUT206', session: 1, lab: 'Lab 2', clo: 'G2',
    color: '#c9a227', icon: '⚡',
    topics: [
      { id: 1, slug: 'logic-links', title: '2.1 Logic Links (AND, OR, NOT)', durationMinutes: 10, parentLessonSlug: '03-binary-operations' },
      { id: 2, slug: 'set-reset', title: '2.2 Set / Reset Instructions for Contacts', durationMinutes: 8, parentLessonSlug: '03-binary-operations' },
      { id: 3, slug: 'timers', title: '2.3 Timers (TON, TOF, TP)', durationMinutes: 14, parentLessonSlug: '03-binary-operations' },
      { id: 4, slug: 'counters', title: '2.4 Counters (CTU, CTD, CTUD)', durationMinutes: 12, parentLessonSlug: '03-binary-operations' },
      { id: 5, slug: 'binary-application', title: '2.5 Application Exercise', durationMinutes: 10, parentLessonSlug: '03-binary-operations' },
    ],
  },
  {
    id: 4, slug: '04-numeric-operations', title: 'Numeric Operations',
    description: 'Data space, comparison, rotate and shift, arithmetic functions, real-time clock',
    course: 'AUT206', session: 1, lab: 'Lab 3', clo: 'G2',
    color: '#c9a227', icon: '🔢',
    topics: [
      { id: 1, slug: 'data-space', title: '3.1 Data Space and Data Types', durationMinutes: 9, parentLessonSlug: '04-numeric-operations' },
      { id: 2, slug: 'comparison', title: '3.2 Comparison Functions', durationMinutes: 7, parentLessonSlug: '04-numeric-operations' },
      { id: 3, slug: 'rotate-shift', title: '3.3 Rotate and Shift Functions', durationMinutes: 8, parentLessonSlug: '04-numeric-operations' },
      { id: 4, slug: 'math-functions', title: '3.4 Arithmetic Functions', durationMinutes: 9, parentLessonSlug: '04-numeric-operations' },
      { id: 5, slug: 'real-time-clock', title: '3.5 Real-Time Clock', durationMinutes: 6, parentLessonSlug: '04-numeric-operations' },
    ],
  },
  {
    id: 5, slug: '05-analog-signals', title: 'Analog Signal Processing',
    description: 'Analog signals, wiring analog I/O, S7-1200 analog modules, scaling and normalisation',
    course: 'AUT206', session: 1, lab: 'Lab 5', clo: 'G3',
    color: '#dc2626', icon: '📊',
    topics: [
      { id: 1, slug: 'analog-signals', title: '4.1 Analog Signals (4–20 mA, 0–10 V)', durationMinutes: 9, parentLessonSlug: '05-analog-signals' },
      { id: 2, slug: 'analog-wiring', title: '4.2 Wiring Analog Inputs and Outputs', durationMinutes: 9, parentLessonSlug: '05-analog-signals' },
      { id: 3, slug: 'analog-modules', title: '4.3 S7-1200 Analog Modules', durationMinutes: 8, parentLessonSlug: '05-analog-signals' },
      { id: 4, slug: 'norm-scale', title: 'Normalising and Scaling (NORM_X / SCALE_X)', durationMinutes: 8, parentLessonSlug: '05-analog-signals' },
    ],
  },
  {
    id: 6, slug: '06-other-plc-brands', title: 'PLC Platforms Beyond Siemens',
    description: 'Omron and Mitsubishi PLCs, input/output circuits, programming console, ladder diagram',
    course: 'AUT206', session: 1, lab: '—', clo: 'G1',
    color: '#c9a227', icon: '🌏',
    topics: [
      { id: 1, slug: 'omron-mitsubishi', title: '5.1 Omron and Mitsubishi PLCs', durationMinutes: 11, parentLessonSlug: '06-other-plc-brands' },
      { id: 2, slug: 'io-circuits', title: '5.2 Input and Output Circuits', durationMinutes: 9, parentLessonSlug: '06-other-plc-brands' },
      { id: 3, slug: 'programming-console', title: '5.3 Programming Console', durationMinutes: 8, parentLessonSlug: '06-other-plc-brands' },
      { id: 4, slug: 'ladder-diagram', title: '5.4 Ladder Diagram Programming', durationMinutes: 11, parentLessonSlug: '06-other-plc-brands' },
      { id: 5, slug: 'common-instructions', title: '5.5 Other Common Instructions', durationMinutes: 9, parentLessonSlug: '06-other-plc-brands' },
    ],
  },
  {
    id: 7, slug: '07-system-design', title: 'Designing a PLC Control Application',
    description: 'Selecting devices from requirements, system design, expansion modules, fault handling',
    course: 'AUT206', session: 2, lab: 'Lab 6', clo: 'G4',
    color: '#16a34a', icon: '🧩',
    topics: [
      { id: 1, slug: 'device-selection', title: '6.1 Analysing Requirements and Selecting Devices', durationMinutes: 11, parentLessonSlug: '07-system-design' },
      { id: 2, slug: 'design-program', title: '6.2 Designing and Programming the System', durationMinutes: 13, parentLessonSlug: '07-system-design' },
      { id: 3, slug: 'digital-expansion', title: '6.3 Connecting Digital Expansion Modules', durationMinutes: 8, parentLessonSlug: '07-system-design' },
      { id: 4, slug: 'analog-expansion', title: '6.4 Connecting Analog Expansion Modules', durationMinutes: 8, parentLessonSlug: '07-system-design' },
      { id: 5, slug: 'fault-handling', title: '6.5 Troubleshooting a PLC Control System', durationMinutes: 10, parentLessonSlug: '07-system-design' },
    ],
  },
  {
    id: 8, slug: '08-advanced-instructions', title: 'Advanced Instruction Set',
    description: 'Time-handling instructions, string and character data, interrupt handling',
    course: 'AUT207', session: 1, lab: 'Lab 3', clo: 'G2',
    color: '#c9a227', icon: '🛠️',
    topics: [
      { id: 1, slug: 'time-instructions', title: '3.1 Time-Handling Instructions', durationMinutes: 14, parentLessonSlug: '08-advanced-instructions' },
      { id: 2, slug: 'string-instructions', title: '3.2 String and Character Instructions', durationMinutes: 12, parentLessonSlug: '08-advanced-instructions' },
      { id: 3, slug: 'interrupt-instructions', title: '3.3 Interrupt-Handling Instructions', durationMinutes: 12, parentLessonSlug: '08-advanced-instructions' },
    ],
  },
  {
    id: 9, slug: '09-high-speed-counting', title: 'High-Speed Counting and Pulse Output',
    description: 'Encoders, high-speed counters, PWM, position control with Motion Control',
    course: 'AUT207', session: 2, lab: 'Lab 4', clo: 'G3',
    color: '#dc2626', icon: '⚙️',
    topics: [
      { id: 1, slug: 'encoder-basics', title: '4.1 Encoder Construction and Operating Principle', durationMinutes: 11, parentLessonSlug: '09-high-speed-counting' },
      { id: 2, slug: 'high-speed-counter', title: '4.2 S7-1200 High-Speed Counters', durationMinutes: 12, parentLessonSlug: '09-high-speed-counting' },
      { id: 3, slug: 'pwm-output', title: '4.3 Pulse Output with PWM', durationMinutes: 11, parentLessonSlug: '09-high-speed-counting' },
      { id: 4, slug: 'motion-control', title: '4.4 Position Control with Motion Control', durationMinutes: 13, parentLessonSlug: '09-high-speed-counting' },
      { id: 5, slug: 'analog-in-motion', title: '4.5 Analog Signal Handling in Motion Applications', durationMinutes: 9, parentLessonSlug: '09-high-speed-counting' },
    ],
  },
  {
    id: 10, slug: '10-closed-loop-pid', title: 'Closed-Loop Control with PID',
    description: 'Closed-loop system design, PID_Compact, tuning and commissioning',
    course: 'AUT207', session: 1, lab: 'Lab 5', clo: 'G3',
    color: '#dc2626', icon: '🎯',
    topics: [
      { id: 1, slug: 'closed-loop-design', title: '5.3 Designing a Closed-Loop Control System', durationMinutes: 13, parentLessonSlug: '10-closed-loop-pid' },
      { id: 2, slug: 'pid-compact', title: 'PID_Compact on the S7-1200', durationMinutes: 12, parentLessonSlug: '10-closed-loop-pid' },
      { id: 3, slug: 'pid-tuning', title: 'Pre-tuning, Fine-tuning and Commissioning', durationMinutes: 13, parentLessonSlug: '10-closed-loop-pid' },
    ],
  },
  {
    id: 11, slug: '11-communication', title: 'Communication Protocols',
    description: 'Point-to-point communication, PROFINET and PROFIBUS',
    course: 'AUT207', session: 1, lab: 'Lab 6', clo: 'G2',
    color: '#7c3aed', icon: '🌐',
    topics: [
      { id: 1, slug: 'point-to-point', title: '6.1 Point-to-Point Communication', durationMinutes: 14, parentLessonSlug: '11-communication' },
      { id: 2, slug: 'profinet-profibus', title: '6.2 PROFINET and PROFIBUS', durationMinutes: 15, parentLessonSlug: '11-communication' },
    ],
  },
  {
    id: 12, slug: '12-fault-diagnostics', title: 'Fault Diagnostic Tools',
    description: 'Online diagnostics, diagnostic buffer, watch and force tables, troubleshooting workflow',
    course: 'AUT207', session: 1, lab: '—', clo: 'G4',
    color: '#7c3aed', icon: '🔍',
    topics: [
      { id: 1, slug: 'diagnostic-overview', title: 'Diagnostic Tools Overview', durationMinutes: 7, parentLessonSlug: '12-fault-diagnostics' },
      { id: 2, slug: 'diagnostic-buffer', title: 'Reading the Diagnostic Buffer', durationMinutes: 7, parentLessonSlug: '12-fault-diagnostics' },
      { id: 3, slug: 'watch-force-tables', title: 'Watch Table and Force Table', durationMinutes: 8, parentLessonSlug: '12-fault-diagnostics' },
    ],
  },
  {
    id: 13, slug: '13-s7-300', title: 'SIMATIC S7-300 Overview',
    description: 'S7-300 platform, instruction set, and its role in existing factory installations',
    course: 'AUT207', session: 1, lab: '—', clo: 'G1',
    color: '#1a3a6b', icon: '🗄️',
    topics: [
      { id: 1, slug: 's7-300-overview', title: 'S7-300 Platform Overview', durationMinutes: 10, parentLessonSlug: '13-s7-300' },
      { id: 2, slug: 's7-300-instructions', title: '8.2 S7-300 Instruction Set', durationMinutes: 12, parentLessonSlug: '13-s7-300' },
      { id: 3, slug: 's7-300-applications', title: '8.3 S7-300 in Factory Applications', durationMinutes: 10, parentLessonSlug: '13-s7-300' },
    ],
  },
  {
    id: 14, slug: '14-system-upgrade', title: 'Upgrading Legacy PLC Systems',
    description: 'Migration paths from S7-200/S7-300, project conversion, risk planning',
    course: 'AUT207', session: 2, lab: '—', clo: 'G4',
    color: '#16a34a', icon: '♻️',
    topics: [
      { id: 1, slug: 'why-upgrade', title: 'Why and When to Upgrade', durationMinutes: 9, parentLessonSlug: '14-system-upgrade' },
      { id: 2, slug: 'migration-paths', title: 'Migration Paths and Tooling', durationMinutes: 12, parentLessonSlug: '14-system-upgrade' },
      { id: 3, slug: 'project-conversion', title: 'Converting an Existing Project', durationMinutes: 12, parentLessonSlug: '14-system-upgrade' },
      { id: 4, slug: 'upgrade-risks', title: 'Planning and Risk Management', durationMinutes: 9, parentLessonSlug: '14-system-upgrade' },
    ],
  },
  {
    id: 15, slug: '15-system-integration', title: 'Whole-System Integration',
    description: 'Connecting the full automation stack and a real-world worked application',
    course: 'AUT207', session: 2, lab: 'Project', clo: 'G4',
    color: '#16a34a', icon: '🏆',
    topics: [
      { id: 1, slug: 'automation-pyramid', title: 'The Automation Stack End to End', durationMinutes: 10, parentLessonSlug: '15-system-integration' },
      { id: 2, slug: 'integration-walkthrough', title: 'Integrating PLC, HMI and Supervision', durationMinutes: 13, parentLessonSlug: '15-system-integration' },
      { id: 3, slug: 'real-world-case', title: 'Real-World Application Case Study', durationMinutes: 12, parentLessonSlug: '15-system-integration' },
    ],
  },
];

/**
 * Số chủ đề và thời lượng được TÍNH TỪ mảng topics, không lấy từ khai báo tay.
 * Một giá trị phái sinh không bao giờ nên được lưu song song với nguồn của nó —
 * đó chính là cách hai con số lệch nhau mà không ai phát hiện.
 */
export const lessons: LessonMeta[] = lessonSources.map((l) => ({
  ...l,
  totalTopics: l.topics.length,
  durationMinutes: l.topics.reduce((sum, t) => sum + t.durationMinutes, 0),
}));

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonById(id: number): LessonMeta | undefined {
  return lessons.find((l) => l.id === id);
}

export const totalLessons = lessons.length;
export const totalTopics = lessons.reduce((sum, l) => sum + l.totalTopics, 0);
export const totalDurationMinutes = lessons.reduce((sum, l) => sum + l.durationMinutes, 0);

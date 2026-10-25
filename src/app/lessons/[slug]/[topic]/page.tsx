// Topic viewer page: /lessons/[slug]/[topic]
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLessonBySlug, lessons } from '@/lib/lessons';
import { lessonContent } from '@/data/lesson-content';
import LessonVideo from '@/components/content/LessonVideo';
import TopicAnimationWrapper from '@/components/animations/TopicAnimationWrapper';
import TopicQuiz from '@/components/content/TopicQuiz';
import { asset } from '@/lib/asset';
import type { Metadata } from 'next';

const TOPIC_DIAGRAMS: Record<string, { src: string; caption: string }> = {
  // ── Lesson 01: Programmable Control Fundamentals ──
  'control-system-basics': {
    src: '/images/slides/01-programmable-control/PLC_Slide_1__018.png',
    caption: 'Figure 1.1: Automated Control System Building Blocks — Reference Input, Sensors, Controller & Actuators',
  },
  'loop-types': {
    src: '/images/diagrams/pid-block-diagram.jpg',
    caption: 'Figure 1.2: Feedback Loop Dynamics — Closed-Loop Negative Feedback & Disturbance Compensation',
  },
  'hardwired-vs-programmable': {
    src: '/images/slides/01-programmable-control/PLC_Slide_1__007.jpg',
    caption: 'Figure 1.3: Hardwired Relay Panel vs Programmable Logic Controller Hardware Architecture',
  },
  'why-plc': {
    src: '/images/slides/01-programmable-control/PLC_Slide_1__026.jpeg',
    caption: 'Figure 1.4: Industrial Economics: Relay Re-wiring Downtime vs 10-Second PLC Software Download',
  },
  'defining-plc': {
    src: '/images/slides/01-programmable-control/PLC_Slide_1__027.jpeg',
    caption: 'Figure 1.5: NEMA Microprocessor Standards & Optoisolated Industrial Field Interfaces',
  },
  'plc-structure': {
    src: '/images/diagrams/plc-wiring-di.jpg',
    caption: 'Figure 1.6: Anatomical PLC Architecture: Power Supply, CPU, Backplane Bus & Discrete I/O',
  },
  'memory-and-leds': {
    src: '/images/slides/01-programmable-control/PLC_Slide_1__031.jpeg',
    caption: 'Figure 1.7: S7-1200 Memory Organization (Load/Work/Retentive) & Front Status Diagnostic LEDs',
  },
  'scan-cycle': {
    src: '/images/diagrams/plc-scan-cycle.jpg',
    caption: 'Figure 1.8: Deterministic 4-Phase PLC Scan Cycle & Process Image Registers (PII / PIQ)',
  },
  'languages-structure': {
    src: '/images/slides/01-programmable-control/PLC_Slide_1__003.jpeg',
    caption: 'Figure 1.9: IEC 61131-3 Standardized Languages (LAD, FBD, SCL, STL, SFC) & Block Hierarchy',
  },

  // ── Lesson 02: S7-1200 Hardware and TIA Portal ──
  's7-1200-device': {
    src: '/images/slides/02-s7-1200-tia-portal/PLC___Slide__001.png',
    caption: 'Figure 2.1: SIMATIC S7-1200 Modular Hardware Family: CPUs, Signal Boards, and Signal Modules',
  },
  'program-processing': {
    src: '/images/slides/02-s7-1200-tia-portal/PLC___Slide__006.png',
    caption: 'Figure 2.2: Program Processing in TIA Portal: OB1 Main Cycle, FCs, FBs, and Instance Data Blocks',
  },
  'field-wiring': {
    src: '/images/diagrams/plc-wiring-di.jpg',
    caption: 'Figure 2.3: Industrial Field Wiring Schematic for 24VDC Digital Inputs (Sinking / Sourcing Circuits)',
  },
  'verify-wiring': {
    src: '/images/slides/02-s7-1200-tia-portal/PLC___Slide__031.png',
    caption: 'Figure 2.4: Online Wiring Verification: Hardware Status LEDs, Watch Tables, and Signal Diagnostics',
  },
  'install-tia': {
    src: '/images/slides/02-s7-1200-tia-portal/PLC___Slide__050.png',
    caption: 'Figure 2.5: TIA Portal Engineering Suite: STEP 7 Professional, WinCC, and ALM Licensing',
  },
  'using-tia': {
    src: '/images/slides/02-s7-1200-tia-portal/PLC___Slide__062.png',
    caption: 'Figure 2.6: TIA Portal Project View: Device Configuration, Hardware Catalog, and Network Topology',
  },
  'comms-setup': {
    src: '/images/diagrams/profinet-network-diagram.jpg',
    caption: 'Figure 2.7: PROFINET IP Subnetting, PG/PC Interface, and Accessible Devices Discovery Scan',
  },

  // ── Lesson 03: Binary Operations ──
  'logic-links': {
    src: '/images/diagrams/ladder-start-stop.jpg',
    caption: 'Figure 3.1: Start/Stop Motor Latch Circuit (Seal-in Network) in TIA Portal Ladder Diagram',
  },
  'set-reset': {
    src: '/images/slides/03-binary-operations/03-bin_carved_046.png',
    caption: 'Figure 3.2: Set (S) and Reset (R) Dominant Latch Instructions and RS/SR Flip-Flop Blocks',
  },
  'timers': {
    src: '/images/diagrams/timer-timing-diagram.jpg',
    caption: 'Figure 3.3: IEC Timing Diagram: TON (On-Delay), TOF (Off-Delay), and TP (Pulse Timer) Waveforms',
  },
  'counters': {
    src: '/images/slides/03-binary-operations/03-bin_carved_022.png',
    caption: 'Figure 3.4: IEC Counter Function Blocks: CTU (Count Up), CTD (Count Down), and CTUD Execution',
  },
  'binary-application': {
    src: '/images/slides/03-binary-operations/03-bin_carved_045.png',
    caption: 'Figure 3.5: Multi-Step Sequential Machine Control with Latch Flags & Safety Interlocks',
  },

  // ── Lesson 04: Numeric Operations ──
  'data-space': {
    src: '/images/slides/04-numeric-operations/04-num_carved_025.png',
    caption: 'Figure 4.1: IEC Elementary Data Types (Byte, Word, Int, Real) & S7-1200 Big-Endian Memory Alignment',
  },
  'comparison': {
    src: '/images/slides/04-numeric-operations/04-num_carved_029.png',
    caption: 'Figure 4.2: Relational Comparison Contact Blocks (==, <>, >=, <=) and Window Comparators in LAD',
  },
  'rotate-shift': {
    src: '/images/slides/04-numeric-operations/04-num_carved_026.png',
    caption: 'Figure 4.3: Bit-Shift (SHL/SHR) and Rotate (ROL/ROR) Registers for Conveyor Item Tracking',
  },
  'math-functions': {
    src: '/images/slides/04-numeric-operations/04-num_carved_022.png',
    caption: 'Figure 4.4: Mathematical Execution Blocks (ADD, SUB, MUL, DIV, MOD) and CALCULATE Formula Evaluator',
  },
  'real-time-clock': {
    src: '/images/slides/04-numeric-operations/04-num_carved_001.jpg',
    caption: 'Figure 4.5: Hardware Real-Time Clock (RTC) Architecture, DTL Structure, and System Functions (RD_SYS_T)',
  },

  // ── Lesson 05: Analog Signals ──
  'analog-signals': {
    src: '/images/slides/05-analog-signals/05-ana_carved_037.png',
    caption: 'Figure 5.1: 0–10V vs 4–20mA Current Loops: Live Zero (4mA) and Industrial Noise Immunity',
  },
  'analog-wiring': {
    src: '/images/slides/05-analog-signals/05-ana_carved_017.png',
    caption: 'Figure 5.2: 2-Wire (Loop-Powered) vs 4-Wire Transmitter Wiring and Shield Grounding Standards',
  },
  'analog-modules': {
    src: '/images/slides/05-analog-signals/05-ana_carved_032.png',
    caption: 'Figure 5.3: S7-1200 SM 1231 Analog Hardware Quantization: Raw Integer Representation (0 to 27648)',
  },
  'norm-scale': {
    src: '/images/slides/05-analog-signals/05-ana_carved_031.png',
    caption: 'Figure 5.4: Mathematical Signal Conditioning: NORM_X Normalization & SCALE_X Engineering Units',
  },

  // ── Lesson 06: PLC Platforms Beyond Siemens ──
  'omron-mitsubishi': {
    src: '/images/slides/06-other-plc-brands/06-oth_carved_039.png',
    caption: 'Figure 6.1: Japanese Industrial PLCs: Omron CP1H and Mitsubishi MELSEC FX3U / FX5U Architecture',
  },
  'io-circuits': {
    src: '/images/slides/06-other-plc-brands/06-oth_carved_043.png',
    caption: 'Figure 6.2: S/S Terminal Jumper Wiring & NPN Sinking vs PNP Sourcing Field Connections',
  },
  'programming-console': {
    src: '/images/slides/06-other-plc-brands/06-oth_carved_032.png',
    caption: 'Figure 6.3: Handheld Programming Consoles (HPP): Keypad Mnemonics (LD, AND, OR) & Mode Selector',
  },
  'ladder-diagram': {
    src: '/images/slides/06-other-plc-brands/06-oth_carved_040.png',
    caption: 'Figure 6.4: Ladder Diagram Syntax & Address Cross-Reference: Siemens vs Omron vs Mitsubishi',
  },
  'common-instructions': {
    src: '/images/slides/06-other-plc-brands/06-oth_carved_038.png',
    caption: 'Figure 6.5: Vendor-Specific Logic: MOV Blocks, Master Control Relays (MC/MCR) & Mandatory END Rung',
  },

  // ── Lesson 07: System Design ──
  'device-selection': {
    src: '/images/slides/07-system-design/PLC__Slide_7_012.png',
    caption: 'Figure 7.1: Master I/O Schedule Development, 20% Spare Margin, and 24VDC Power Budget Sizing',
  },
  'design-program': {
    src: '/images/slides/07-system-design/PLC__Slide_7_003.png',
    caption: 'Figure 7.2: Control Architecture Design: Electrical CAD Schematics & Finite State Machine States',
  },
  'digital-expansion': {
    src: '/images/slides/07-system-design/PLC__Slide_7_013.jpg',
    caption: 'Figure 7.3: SM 1221/1222 Digital Expansion Modules: Backplane Slide Bus Mechanical Attachment',
  },
  'analog-expansion': {
    src: '/images/slides/07-system-design/PLC__Slide_7_007.jpg',
    caption: 'Figure 7.4: SM 1231 Analog Input Module Installation, Noise Filtering, and Shield Clamping',
  },
  'fault-handling': {
    src: '/images/slides/07-system-design/PLC__Slide_7_022.png',
    caption: 'Figure 7.5: 5-Step Systematic Control Panel Troubleshooting & Multimeter Signal Tracing Protocol',
  },

  // ── Lesson 08: Advanced Instructions ──
  'time-instructions': {
    src: '/images/slides/08-advanced-instructions/PLC___Slide__009.jpg',
    caption: 'Figure 8.1: High-Resolution Timestamp Calculations (TIME_TCK) & Time-of-Day Interrupts (OB10)',
  },
  'string-instructions': {
    src: '/images/slides/08-advanced-instructions/PLC___Slide__016.jpg',
    caption: 'Figure 8.2: ASCII String Data Architecture and Substring Manipulation (CONCAT, MID, VAL_STRG)',
  },
  'interrupt-instructions': {
    src: '/images/slides/08-advanced-instructions/PLC___Slide__021.png',
    caption: 'Figure 8.3: Asynchronous Interrupt Architecture: Hardware Edge Interrupts (OB40) & Cyclic Timers (OB30)',
  },

  // ── Lesson 09: High-Speed Counting ──
  'encoder-basics': {
    src: '/images/slides/09-high-speed-counting/PL___Slide_4_001.jpeg',
    caption: 'Figure 9.1: Incremental Optical Rotary Encoder: Quadrature A/B Phase Shift & Z Index Pulse',
  },
  'high-speed-counter': {
    src: '/images/slides/09-high-speed-counting/PL___Slide_4_012.jpeg',
    caption: 'Figure 9.2: S7-1200 High-Speed Counter (HSC) Hardware Configuration & 4x Resolution Multiplier',
  },
  'pwm-output': {
    src: '/images/slides/09-high-speed-counting/PL___Slide_4_020.jpeg',
    caption: 'Figure 9.3: Pulse Width Modulation (PWM) Duty Cycle Control on Fast S7-1200 Transistor Outputs',
  },
  'motion-control': {
    src: '/images/slides/09-high-speed-counting/PL___Slide_4_014.jpeg',
    caption: 'Figure 9.4: Pulse Train Output (PTO) & PLCopen Motion Technology Objects (MC_Power, MC_MoveAbsolute)',
  },
  'analog-in-motion': {
    src: '/images/slides/09-high-speed-counting/PL___Slide_4_013.jpeg',
    caption: 'Figure 9.5: ±10V Bipolar Analog Velocity Setpoint Interface to AC Variable Frequency Drives',
  },

  // ── Lesson 10: Closed-Loop Control with PID ──
  'closed-loop-design': {
    src: '/images/diagrams/pid-block-diagram.jpg',
    caption: 'Figure 10.1: Standard Industrial Closed-Loop Feedback Control Block Diagram with Disturbance Input',
  },
  'pid-compact': {
    src: '/images/slides/10-closed-loop-pid/PLC___Slide__036.png',
    caption: 'Figure 10.2: Siemens PID_Compact Technology Object Architecture, Input_PER & Anti-Windup Clamping',
  },
  'pid-tuning': {
    src: '/images/slides/10-closed-loop-pid/PLC___Slide__020.png',
    caption: 'Figure 10.3: TIA Portal PID Commissioning Dashboard: Real-Time Pre-Tuning & Fine-Tuning Curves',
  },

  // ── Lesson 11: Communication Protocols ──
  'point-to-point': {
    src: '/images/slides/11-communication/PLC___Slide__022.png',
    caption: 'Figure 11.1: Point-to-Point (PtP) RS485 Modbus RTU Network Architecture & MB_MASTER Function Block',
  },
  'profinet-profibus': {
    src: '/images/diagrams/profinet-network-diagram.jpg',
    caption: 'Figure 11.2: PROFINET Real-Time (RT/IRT) Industrial Ethernet Topology with S7-1200 & ET 200SP I/O',
  },

  // ── Lesson 12: Fault Diagnostic Tools ──
  'diagnostic-overview': {
    src: '/images/slides/12-fault-diagnostics/PLC___Slide__015.png',
    caption: 'Figure 12.1: TIA Portal Online Diagnostics Suite, Network Status Icons, and Cross-Reference Tool',
  },
  'diagnostic-buffer': {
    src: '/images/slides/12-fault-diagnostics/PLC___Slide__004.png',
    caption: 'Figure 12.2: CPU Diagnostic Buffer: Timestamped Event Log & Error Organization Blocks (OB82, OB86)',
  },
  'watch-force-tables': {
    src: '/images/slides/12-fault-diagnostics/PLC___Slide__003.png',
    caption: 'Figure 12.3: Watch Tables vs Force Tables: Non-Invasive Monitoring vs Hardware Signal Override',
  },

  // ── Lesson 13: SIMATIC S7-300 Overview ──
  's7-300-overview': {
    src: '/images/slides/13-s7-300/PLC___Slide__015.png',
    caption: 'Figure 13.1: SIMATIC S7-300 Modular Rack Hardware: PS, CPU, IM 360/361, and Backplane U-Connectors',
  },
  's7-300-instructions': {
    src: '/images/slides/13-s7-300/PLC___Slide__016.png',
    caption: 'Figure 13.2: Statement List (STL / AWL) Register Operations: Accumulators ACCU1/ACCU2 & Status Word',
  },
  's7-300-applications': {
    src: '/images/slides/13-s7-300/PLC___Slide__033.jpg',
    caption: 'Figure 13.3: Distributed S7-300 & ET 200M Field Architecture over Purple Shielded PROFIBUS-DP',
  },

  // ── Lesson 14: Upgrading Legacy PLC Systems ──
  'why-upgrade': {
    src: '/images/slides/14-system-upgrade/PLC___Slide__018.png',
    caption: 'Figure 14.1: Automation Hardware Obsolescence Curve & Economic Total Cost of Ownership (TCO)',
  },
  'migration-paths': {
    src: '/images/slides/14-system-upgrade/PLC___Slide__002.png',
    caption: 'Figure 14.2: Official Siemens Migration Paths: S7-200 -> S7-1200 and S7-300 -> S7-1500',
  },
  'project-conversion': {
    src: '/images/slides/14-system-upgrade/PLC___Slide__014.png',
    caption: 'Figure 14.3: TIA Portal Migration Tool Workflow: Converting Legacy STEP 7 Projects (*.s7p)',
  },
  'upgrade-risks': {
    src: '/images/slides/14-system-upgrade/PLC___Slide__001.png',
    caption: 'Figure 14.4: Front-Connector Wiring Adapters & 15-Minute Emergency Rollback Protocol',
  },

  // ── Lesson 15: Whole-System Integration ──
  'automation-pyramid': {
    src: '/images/slides/15-system-integration/PLC___Slide__023.png',
    caption: 'Figure 15.1: The ISA-95 Industrial Automation Pyramid: Field, Control, SCADA, MES, and ERP Layers',
  },
  'integration-walkthrough': {
    src: '/images/slides/15-system-integration/PLC___Slide__019.jpg',
    caption: 'Figure 15.2: Unified Engineering: Tag Database Synchronization between TIA Portal STEP 7 & WinCC',
  },
  'real-world-case': {
    src: '/images/slides/15-system-integration/PLC___Slide__002.png',
    caption: 'Figure 15.3: Automated Liquid Blending Plant: S7-1200, Analog Scaling, PID, HSC & KTP700 HMI',
  },
};

export async function generateStaticParams() {
  const params: { slug: string; topic: string }[] = [];
  for (const lesson of lessons) {
    for (const topic of lesson.topics) {
      params.push({ slug: lesson.slug, topic: topic.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { slug, topic: topicSlug } = await params;
  const lesson = getLessonBySlug(slug);
  const topic = lesson?.topics.find((t) => t.slug === topicSlug);
  if (!lesson || !topic) return {};
  return {
    title: `${topic.title} — ${lesson.title} | PLC Programming`,
    description: `${topic.title}: part of ${lesson.title} in the PLC Programming course at International School, VNU Hanoi.`,
  };
}

function getCategoryColor(id: number) {
  if (id <= 3) return '#1a3a6b';
  if (id <= 7) return '#c9a227';
  if (id <= 10) return '#dc2626';
  if (id <= 14) return '#7c3aed';
  return '#16a34a';
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic: topicSlug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const topicIndex = lesson.topics.findIndex((t) => t.slug === topicSlug);
  if (topicIndex === -1) notFound();

  const topic = lesson.topics[topicIndex];
  const prevTopic = lesson.topics[topicIndex - 1] ?? null;
  const nextTopic = lesson.topics[topicIndex + 1] ?? null;
  const color = getCategoryColor(lesson.id);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: '#a3a3a3', flexWrap: 'wrap' }}>
        <Link href="/lessons" style={{ color: '#a3a3a3', textDecoration: 'none' }} className="nav-link">Lessons</Link>
        <span>/</span>
        <Link href={`/lessons/${lesson.slug}`} style={{ color: '#a3a3a3', textDecoration: 'none' }} className="nav-link">{lesson.title}</Link>
        <span>/</span>
        <span style={{ color: '#0a0a0a', fontWeight: 500 }}>{topic.title}</span>
      </div>

      {/* Topic header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ width: 4, height: 24, borderRadius: 99, background: color, display: 'block' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase' }}>
            {lesson.icon} {lesson.title} · Topic {topicIndex + 1}/{lesson.topics.length}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1.15, marginBottom: '10px' }}>
          {topic.title}
        </h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="tag">{topic.durationMinutes} min</span>
          <span className="tag">{lesson.lab}</span>
        </div>
      </div>

      {/* Video — tự ẩn hoàn toàn nếu topic này chưa được đánh mốc */}
      <LessonVideo lessonSlug={lesson.slug} topicSlug={topic.slug} color={color} />

      {/* Content area: Detailed Technical Notes & Interactive Simulator */}
      {(() => {
        const contentData = lessonContent[lesson.slug];
        const numMatch = topic.title.match(/^(\d+\.\d+)/);
        const section = contentData?.sections.find((s) => {
          if (s.title === topic.title) return true;
          if (numMatch && s.title.includes(numMatch[1])) return true;
          const cleanTopicTitle = topic.title.replace(/^\d+\.\d+\s*/, '').toLowerCase();
          const cleanSecTitle = s.title.replace(/^\d+\.\d+\s*/, '').toLowerCase();
          return cleanSecTitle.includes(cleanTopicTitle) || cleanTopicTitle.includes(cleanSecTitle);
        }) ?? contentData?.sections[topicIndex];

        return (
          <div style={{ marginBottom: '36px' }}>
            {section ? (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '28px 32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase', margin: 0 }}>
                    Technical Notes · {section.title}
                  </p>
                </div>

                {/* Primary Content Paragraph */}
                <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, marginBottom: section.keyPoints ? '20px' : 0 }}>
                  {section.content}
                </p>

                {/* Key Takeaways */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '18px 20px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Key Engineering Points
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {section.keyPoints.map((kp, idx) => {
                        const parts = kp.split(':');
                        const kpTitle = parts[0];
                        const kpDesc = parts.slice(1).join(':').trim();
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', lineHeight: 1.6 }}>
                            <span style={{ color: color, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>▸</span>
                            <div>
                              <strong style={{ color: '#0f172a' }}>{kpTitle}</strong>
                              {kpDesc ? <span style={{ color: '#475569' }}>: {kpDesc}</span> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Note / Tip callout */}
                {section.note && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 18px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#92400e',
                    lineHeight: 1.65,
                  }}>
                    💡 <strong>Engineering Note:</strong> {section.note}
                  </div>
                )}

                {/* Engineering Diagram (if available for this topic) */}
                {TOPIC_DIAGRAMS[topic.slug] && (
                  <div style={{
                    marginTop: '24px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'left' }}>
                      📸 Technical Schematic Diagram
                    </p>
                    <img
                      src={asset(TOPIC_DIAGRAMS[topic.slug].src)}
                      alt={TOPIC_DIAGRAMS[topic.slug].caption}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    />
                    <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '10px', fontStyle: 'italic', margin: '10px 0 0 0' }}>
                      {TOPIC_DIAGRAMS[topic.slug].caption}
                    </p>
                  </div>
                )}

                {/* Topic-specific Interactive Simulator */}
                <TopicAnimationWrapper lessonSlug={lesson.slug} topicSlug={topic.slug} topicIndex={topicIndex} topicTitle={topic.title} />

                {/* Formative Knowledge Check Micro-Quiz */}
                <TopicQuiz topicSlug={topic.slug} color={color} />
              </div>
            ) : (
              <div style={{
                background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '10px',
                padding: '28px 32px', minHeight: '160px',
              }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Lesson Notes
                </p>
                <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.7 }}>
                  Detailed practical laboratory guide for &ldquo;{topic.title}&rdquo;. Consult the Siemens S7-1200 System Manual and TIA Portal help files during bench wiring.
                </p>
                <TopicAnimationWrapper lessonSlug={lesson.slug} topicSlug={topic.slug} topicIndex={topicIndex} topicTitle={topic.title} />
                <TopicQuiz topicSlug={topic.slug} color={color} />
              </div>
            )}
          </div>
        );
      })()}

      {/* Progress: topics in this lesson */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '12px' }}>
          All Topics — {lesson.title}
        </p>
        <div style={{ border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
          {lesson.topics.map((t, i) => (
            <Link key={t.slug} href={`/lessons/${lesson.slug}/${t.slug}`}
              className="lesson-row"
              style={{
                borderBottom: i === lesson.topics.length - 1 ? 'none' : '1px solid #f5f5f5',
                background: t.slug === topicSlug ? '#f0f4ff' : undefined,
              }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: t.slug === topicSlug ? color : '#d4d4d4', minWidth: '22px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: t.slug === topicSlug ? 600 : 450, color: t.slug === topicSlug ? '#0a0a0a' : '#525252' }}>
                  {t.title}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#a3a3a3' }}>{t.durationMinutes} min</span>
              {t.slug === topicSlug && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'block' }} />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
        {prevTopic ? (
          <Link href={`/lessons/${lesson.slug}/${prevTopic.slug}`}
            className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3' }}>Previous</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0a0a0a' }}>{prevTopic.title}</div>
            </div>
          </Link>
        ) : (
          <Link href={`/lessons/${lesson.slug}`}
            className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3' }}>Back</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0a0a0a' }}>{lesson.title}</div>
            </div>
          </Link>
        )}

        {nextTopic ? (
          <Link href={`/lessons/${lesson.slug}/${nextTopic.slug}`}
            className="btn-primary" style={{ background: color, flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75 }}>Next</div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{nextTopic.title}</div>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link href={`/lessons/${lesson.slug}`}
            className="btn-primary" style={{ background: color, flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75 }}>Finished</div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Back to Lesson</div>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

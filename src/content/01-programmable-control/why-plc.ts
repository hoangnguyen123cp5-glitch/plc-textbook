import { TopicContent } from '@/types/content';

export default {
  "slug": "why-plc",
  "sourceRef": "1.4",
  "title": "Why Industry Switched to the PLC",
  "durationMinutes": 6,
  "summary": "Consider a standard industrial manufacturing cell: sequential starting of two conveyor motors, M1 and M2.",
  "body": [
    {
      "heading": "1.4 Why Industry Switched to the PLC: Technical & Economic Case Study",
      "text": "Consider a standard industrial manufacturing cell: sequential starting of two conveyor motors, M1 and M2. Under a traditional relay panel, the circuit requires two magnetic motor starters, an on-delay pneumatic timer relay, auxiliary contact blocks, and dozens of jumper wires. When manufacturing operations require a reverse-sequence shutdown (\"Motor 2 must stop first, followed 5 seconds later by Motor 1\"), the relay cabinet must be powered down, an additional off-delay timer purchased, existing control circuits dismantled, and the entire panel re-verified point-to-point. With a PLC, field cables remain untouched; the automation engineer simply opens TIA Portal, inserts an off-delay timer block (TOF) into OB1, and downloads the revision in seconds. The capability to make operational revisions virtually cost-free and instantaneous is the primary economic driver that eradicated relay panels worldwide.",
      "keyPoints": [
        "Footprint Reduction: A compact 110x100mm PLC CPU replaces an entire 800x1200mm industrial relay enclosure",
        "Near-Zero Modification Overhead: Operational logic alterations are handled in software without wiring re-work or hardware scrap",
        "Integrated Online Diagnostics: Real-time \"Go Online\" and \"Watch Table\" features expose live bit states directly on ladder rungs",
        "Network Scalability: Standardized industrial Ethernet (PROFINET) enables seamless PLC-to-PLC coordination and HMI/SCADA data acquisition",
        "Industrial Reliability: Solid-state microelectronics feature zero moving parts, delivering uninterrupted 24/7 service over 10 to 15 years"
      ]
    }
  ],
  "figures": [
    {
      "src": "/images/slides/01-programmable-control/PLC_Slide_1__026.jpeg",
      "caption": "Figure 1.4: Industrial Economics: Relay Re-wiring Downtime vs 10-Second PLC Software Download"
    }
  ],
  "caseStudy": {
    "title": "Automated Alternation & Duty Cycling for Wastewater Treatment Pumps",
    "context": "A wastewater pumping station utilizes three 45 kW centrifugal pumps operating in rotation to ensure equal wear distribution (runtime balancing), with automatic cut-in of a standby pump during high-inflow storms or pump failure. Implementing runtime hour tracking and automatic fault handover with hardwired mechanical relays and drum timers requires dozens of interconnecting relays. With an S7-1200 PLC, runtime hour counters (TON/TOF) and comparison blocks in software handle the alternation logic seamlessly.",
    "hardware": [
      "Pumping Plant: 3 × 45 kW Heavy-Duty Submersible Centrifugal Pumps",
      "Motor Control: Siemens SINAMICS V20 VFDs / 3RW Soft Starters with Safe Torque Off",
      "Telemetry: Danfoss MBS 3000 Pressure Transmitter (4–20 mA loop to SM 1231 AI)",
      "Operator Interface: SIMATIC HMI KTP700 Basic displaying running hours per pump"
    ],
    "pitfall": "Hardwired relays cannot retain runtime counters across utility power outages. An S7-1200 stores these values in non-volatile Retentive Memory, preventing counter reset."
  },
  "quiz": [
    {
      "q": "How long does a typical control sequence modification take on a modern PLC system?",
      "options": [
        "Several days of wire tracing and contact replacement",
        "A few seconds to minutes via software download over PROFINET, with zero wiring changes",
        "At least 48 hours for CPU reboot",
        "It requires replacing the entire CPU unit"
      ],
      "answer": 1,
      "explain": "Because PLC inputs and outputs are software-addressed, modifying interlocking logic is accomplished instantaneously in TIA Portal without touching physical cables."
    }
  ],
  "narration": {
    "vi": "Trước khi có PLC, mỗi thay đổi logic điều khiển đòi hỏi thợ điện tháo dây và đấu lại tủ rơ-le. Một dây chuyền ô tô có thể chứa hàng nghìn rơ-le, tiêu thụ điện liên tục dù tiếp điểm đóng hay mở, và mỗi rơ-le sẽ hỏng sau vài triệu lần đóng cắt. PLC giải quyết ba vấn đề này cùng lúc — thay đổi bằng phần mềm, tiêu thụ điện ít hơn nhiều, và tuổi thọ cao hơn gấp nhiều lần.",
    "durationSec": 32,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Why Industry Switched to the PLC: Technical & Economic Case Study",
      "points": [
        "Footprint Reduction: A compact 110x100mm PLC CPU replaces an entire 800x1200mm industrial relay enclosure",
        "Near-Zero Modification Overhead: Operational logic alterations are handled in software without wiring re-work or hardware scrap",
        "Integrated Online Diagnostics: Real-time \"Go Online\" and \"Watch Table\" features expose live bit states directly on ladder rungs",
        "Network Scalability: Standardized industrial Ethernet (PROFINET) enables seamless PLC-to-PLC coordination and HMI/SCADA data acquisition",
        "Industrial Reliability: Solid-state microelectronics feature zero moving parts, delivering uninterrupted 24/7 service over 10 to 15 years"
      ],
      "explain": "Consider a standard industrial manufacturing cell: sequential starting of two conveyor motors, M1 and M2. Under a traditional relay panel, the circuit requires two magnetic motor starters, an on-delay pneumatic timer relay, auxiliary contact blocks, and dozens of jumper wires. When manufacturing operations require a reverse-sequence shutdown (\"Motor 2 must stop first, followed 5 seconds later by Motor 1\"), the relay cabinet must be powered down, an additional off-delay timer purchased, existing control circuits dismantled, and the entire panel re-verified point-to-point. With a PLC, field cables remain untouched; the automation engineer simply opens TIA Portal, inserts an off-delay timer block (TOF) into OB1, and downloads the revision in seconds. The capability to make operational revisions virtually cost-free and instantaneous is the primary economic driver that eradicated relay panels worldwide.",
      "figure": {
        "src": "/images/slides/01-programmable-control/PLC_Slide_1__026.jpeg",
        "caption": "Figure 1.4: Industrial Economics: Relay Re-wiring Downtime vs 10-Second PLC Software Download"
      }
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

import { TopicContent } from '@/types/content';

export default {
  "slug": "memory-and-leds",
  "sourceRef": "1.7",
  "title": "Memory Structure and Status Indicators",
  "durationMinutes": 7,
  "summary": "The memory of the Siemens S7-1200 CPU is structured functionally rather than as flat physical address space: Program Area stores compiled code blocks (OB, FC, FB); Parameter Area stores hardware co...",
  "body": [
    {
      "heading": "1.7 Memory Organization and Diagnostic LEDs on the S7-1200",
      "text": "The memory of the Siemens S7-1200 CPU is structured functionally rather than as flat physical address space: Program Area stores compiled code blocks (OB, FC, FB); Parameter Area stores hardware configuration tables, IP addresses, and protection passwords; Data Area stores temporary calculations, I/O process image tables (PII/PIQ), bit memory markers (M), and Data Blocks (DB). Physically, memory consists of: Load Memory (non-volatile Flash retaining the complete project including symbolic tags and comments, expandable via SIMATIC Memory Card), Work Memory (high-speed internal volatile RAM where the CPU executes active code), and Retentive Memory (non-volatile NVRAM backed by supercapacitors that preserves critical tags across power cycles). Front-panel diagnostic LEDs provide immediate visual telemetry into the CPU operating state.",
      "keyPoints": [
        "Load Memory: Non-volatile Flash storing compiled code, hardware configurations, and symbolic tags; expandable via SIMATIC SD card",
        "Work Memory: Ultra-fast volatile RAM (~100 KB); the CPU loads executable runtime blocks from Load Memory during startup",
        "Retentive Memory: Non-volatile storage (~10 KB) maintaining production setpoints, batch recipe tags, and part counters across power interruptions",
        "RUN/STOP LED: Solid Green = CPU executing cyclic scan; Solid Amber = CPU stopped with outputs held in safe de-energized state",
        "ERROR LED: Flashing Red = Hardware diagnostic alarm, broken field sensor loop, or runtime math exception (e.g. division by zero)",
        "MAINT LED: Solid Amber = Maintenance demanded (e.g. RTC battery exhausted or memory card service needed)",
        "I/O Status LEDs (Ix.x, Qx.x): Indicate physical presence of 24VDC potential at the terminal screw (independent of software logic state)"
      ],
      "note": "The input LED Ix.x reflects physical electrical potential directly at the terminal strip. If an input LED is illuminated green but the corresponding tag in TIA Portal remains False (0), the fault is strictly in the software configuration or CPU operating mode—not an external field wiring break!"
    }
  ],
  "figures": [
    {
      "src": "/images/slides/01-programmable-control/PLC_Slide_1__031.jpeg",
      "caption": "Figure 1.7: S7-1200 Memory Organization (Load/Work/Retentive) & Front Status Diagnostic LEDs"
    }
  ],
  "caseStudy": {
    "title": "S7-1200 Memory Organization & Supercapacitor Retentive Memory Architecture",
    "context": "In a chemical batch reactor, utility power failure occurs midway through a 6-hour synthesis cycle. Without configured retentive memory, all recipe setpoints, batch timer elapsed values, and ingredient weights reset to zero upon power restoration, forcing scrap of a multi-thousand-dollar batch. The S7-1200 features a maintenance-free supercapacitor that powers on-chip NVRAM, preserving up to 10 KB of designated retentive tags for over 20 days without requiring battery replacement.",
    "hardware": [
      "Load Memory: Non-volatile Flash ROM storing compiled code, symbolic tags, and comments (1 MB to 24 MB SMC)",
      "Work Memory: Volatile ultra-fast RAM (50 KB–150 KB) where CPU executes real-time code",
      "Retentive Memory: Supercapacitor-backed NVRAM preserving critical batch process values",
      "Diagnostic Telemetry: Front panel RUN/STOP, ERROR, and MAINT status indicator LEDs"
    ],
    "pitfall": "Only tags explicitly flagged as \"Retain\" in Data Blocks (DBs) or bit memory (M) survive power cycles. Unchecked variables default to their initial start values on CPU restart!"
  },
  "quiz": [
    {
      "q": "Which S7-1200 memory area preserves critical production tags across an unpowered plant shutdown without a battery?",
      "options": [
        "Work Memory",
        "Retentive Memory (NVRAM backed by supercapacitor)",
        "Temporary Local Stack (L)",
        "Web Server Cache"
      ],
      "answer": 1,
      "explain": "Retentive Memory uses non-volatile NVRAM backed by an internal supercapacitor to safeguard critical recipe tags, counts, and states during power outages."
    },
    {
      "q": "What does a solid yellow/amber RUN/STOP LED indicate on an S7-1200 CPU front panel?",
      "options": [
        "The CPU is in RUN mode executing OB1",
        "The CPU is in STOP mode and user program execution is halted",
        "A fatal hardware fault has occurred",
        "Firmware update is in progress"
      ],
      "answer": 1,
      "explain": "Green indicates RUN mode; solid yellow indicates STOP mode; flashing red indicates a diagnostic error."
    }
  ],
  "narration": {
    "vi": "S7-1200 có ba vùng nhớ chính. Load Memory lưu toàn bộ project kể cả comment — thường là thẻ nhớ Micro SD. Work Memory là RAM tốc độ cao, CPU chỉ nạp phần cần thực thi vào đây. Retain Memory giữ dữ liệu quan trọng khi mất điện, dùng tụ điện hoặc pin dự phòng. Về đèn LED: RUN xanh là bình thường, STOP vàng là dừng, ERROR đỏ nhấp nháy là có lỗi cần kiểm tra diagnostic buffer.",
    "durationSec": 35,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Memory Organization and Diagnostic LEDs on the S7-1200",
      "points": [
        "Load Memory: Non-volatile Flash storing compiled code, hardware configurations, and symbolic tags; expandable via SIMATIC SD card",
        "Work Memory: Ultra-fast volatile RAM (~100 KB); the CPU loads executable runtime blocks from Load Memory during startup",
        "Retentive Memory: Non-volatile storage (~10 KB) maintaining production setpoints, batch recipe tags, and part counters across power interruptions",
        "RUN/STOP LED: Solid Green = CPU executing cyclic scan; Solid Amber = CPU stopped with outputs held in safe de-energized state",
        "ERROR LED: Flashing Red = Hardware diagnostic alarm, broken field sensor loop, or runtime math exception (e.g. division by zero)",
        "MAINT LED: Solid Amber = Maintenance demanded (e.g. RTC battery exhausted or memory card service needed)",
        "I/O Status LEDs (Ix.x, Qx.x): Indicate physical presence of 24VDC potential at the terminal screw (independent of software logic state)"
      ],
      "explain": "The memory of the Siemens S7-1200 CPU is structured functionally rather than as flat physical address space: Program Area stores compiled code blocks (OB, FC, FB); Parameter Area stores hardware configuration tables, IP addresses, and protection passwords; Data Area stores temporary calculations, I/O process image tables (PII/PIQ), bit memory markers (M), and Data Blocks (DB). Physically, memory consists of: Load Memory (non-volatile Flash retaining the complete project including symbolic tags and comments, expandable via SIMATIC Memory Card), Work Memory (high-speed internal volatile RAM where the CPU executes active code), and Retentive Memory (non-volatile NVRAM backed by supercapacitors that preserves critical tags across power cycles). Front-panel diagnostic LEDs provide immediate visual telemetry into the CPU operating state.",
      "figure": {
        "src": "/images/slides/01-programmable-control/PLC_Slide_1__031.jpeg",
        "caption": "Figure 1.7: S7-1200 Memory Organization (Load/Work/Retentive) & Front Status Diagnostic LEDs"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 1
    }
  ],
  "status": "review"
} satisfies TopicContent;

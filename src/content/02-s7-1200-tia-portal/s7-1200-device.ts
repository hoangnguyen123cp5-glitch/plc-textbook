import { TopicContent } from '@/types/content';

export default {
  "slug": "s7-1200-device",
  "sourceRef": "1.3",
  "title": "The S7-1200 Programmable Controller",
  "durationMinutes": 12,
  "summary": "The Siemens SIMATIC S7-1200 is a modular micro-PLC designed for open-loop and closed-loop process control across discrete manufacturing and process industries.",
  "body": [
    {
      "heading": "1.3 The S7-1200 Programmable Controller",
      "text": "The Siemens SIMATIC S7-1200 is a modular micro-PLC designed for open-loop and closed-loop process control across discrete manufacturing and process industries. The central processing unit (CPU) integrates a 32-bit RISC microprocessor, non-volatile Flash load memory, volatile execution work memory, high-speed digital and analog I/O channels, and an on-board PROFINET Industrial Ethernet port. The hardware family spans five performance tiers: CPU 1211C, 1212C, 1214C, 1215C, and 1217C, differing in work memory capacity (50 KB up to 250 KB), I/O count, and expansion capability. The CPU can be expanded using three modular form factors: Signal Boards (SB) or Communication Boards (CB) that snap directly into the front housing without altering the panel footprint; Signal Modules (SM) providing dense digital/analog expansion attached via high-speed backplane sliding bus connectors to the right; and Communication Modules (CM) providing serial RS232/RS485 or PROFIBUS interfaces attached to the left.",
      "keyPoints": [
        "CPU Form Factor Variants: Available in DC/DC/DC (24VDC supply, 24VDC inputs, 24VDC transistor outputs), AC/DC/Relay (120/230VAC supply, 24VDC inputs, relay outputs), and DC/DC/Relay",
        "Performance Hierarchy: CPU 1211C (50 KB RAM, no SM expansion) to CPU 1214C/1215C/1217C (up to 8 SM expansion modules and 3 CM modules)",
        "Signal Board (SB) Slot: Dedicated front-bezel receptacle supporting 1 SB (e.g. 2 DI/2 DO, 1 AI 12-bit, or 1 AQ 12-bit) without consuming DIN-rail horizontal length",
        "High-Speed Backplane Bus: Proprietary multi-pin slide bus interconnects modules on the right; transfers cyclic process images with hardware synchronization",
        "Communication Modules (CM): Mount to the left of the CPU, supporting up to 3 modules for Point-to-Point (PtP) RS485 Modbus RTU, PROFIBUS-DP, or TeleControl",
        "Mechanical Mounting: Mounts horizontally or vertically on standard 35mm DIN rail (EN 50022) with pull-down locking spring tabs"
      ],
      "note": "For reliable convection cooling, maintain a minimum thermal clearance of 25 mm (1.0 inch) above and below all S7-1200 modules. Maximum ambient operating temperature is 55°C for horizontal DIN-rail mounting and 45°C for vertical mounting."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__001.png",
      "caption": "Figure 2.1: SIMATIC S7-1200 Modular Hardware Family: CPUs, Signal Boards, and Signal Modules"
    }
  ],
  "caseStudy": {
    "title": "Sizing a Lab Station: CPU 1214C Expansion and Power Budget",
    "context": "A training workstation must handle 20 digital inputs, 14 digital outputs, 4 analog inputs (4–20 mA) and 2 analog outputs, plus an RS485 link to a barcode reader. A CPU 1214C DC/DC/DC provides 14 DI / 10 DO / 2 AI on board, so the design adds one SM 1223 (8 DI / 8 DO) to the right, one SM 1231 AI 4 for the transmitters, an SB 1232 AQ 1 on the front face, and a CM 1241 RS422/485 on the left. Before ordering, the engineer checks the power budget in the system manual: every SM and CM draws from the CPU's internal 5 VDC backplane supply (1600 mA on the 1214C), and every powered sensor draws from the 400 mA 24 VDC sensor supply.",
    "hardware": [
      "CPU 1214C DC/DC/DC: 14 DI, 10 DO (transistor), 2 AI 0–10 V on board",
      "Right side: SM 1223 DI 8 / DQ 8 and SM 1231 AI 4 (max. 8 SMs on a 1214C)",
      "Front: SB 1232 AQ 1 — adds an analog output without widening the panel",
      "Left side: CM 1241 RS422/485 for the barcode reader (max. 3 CMs)",
      "Power budget: sum of SM/CM 5 VDC currents ≤ 1600 mA; sensor 24 VDC loads ≤ 400 mA, otherwise add an external 24 VDC supply"
    ],
    "pitfall": "Choosing a CPU 1211C to save cost: it accepts no Signal Modules at all, so the 20-DI requirement cannot be met by expansion and the whole CPU must be replaced. Always check the maximum number of SMs and the power budget table before fixing the CPU model."
  },
  "quiz": [
    {
      "q": "What is the main physical difference between a Signal Board (SB) and a Signal Module (SM) on the S7-1200?",
      "options": [
        "Signal Boards mount directly on the CPU front face without increasing width; Signal Modules expand to the right via the backplane slide connector",
        "Signal Boards only work on 120VAC",
        "Signal Modules cannot handle analog signals",
        "Signal Boards require a separate power supply"
      ],
      "answer": 0,
      "explain": "An SB plugs directly into the CPU front pocket (preserving physical DIN-rail width), while SM modules snap on the right side of the rack."
    },
    {
      "q": "On which side of an S7-1200 CPU are Communication Modules (CM) mounted?",
      "options": [
        "On the right, after the Signal Modules",
        "On the front face, in the Signal Board slot",
        "On the left side of the CPU",
        "On a separate DIN rail connected by PROFINET"
      ],
      "answer": 2,
      "explain": "Communication Modules (e.g. CM 1241 RS485) attach to the left of the CPU, while Signal Modules expand to the right and Signal/Communication Boards plug into the front."
    },
    {
      "q": "A design needs 20 digital inputs. Why is a CPU 1211C an unsuitable choice?",
      "options": [
        "It does not support PROFINET",
        "It cannot accept any Signal Modules, so its 6 on-board inputs cannot be expanded beyond one Signal Board",
        "It only runs on 230 VAC",
        "It has no work memory for user programs"
      ],
      "answer": 1,
      "explain": "The CPU 1211C supports a Signal Board but no right-side Signal Modules; the 1212C accepts up to 2 SMs and the 1214C/1215C/1217C up to 8."
    }
  ],
  "narration": {
    "vi": "CPU S7-1200 là trái tim của hệ thống. Trên mặt CPU có sẵn các cổng DI và DQ tích hợp, cổng Ethernet để kết nối máy tính, và các đèn LED trạng thái. Bên cạnh CPU, bạn có thể gắn thêm Signal Board ngay trên thân CPU để tăng thêm vài cổng I/O. Ngoài ra còn có các Signal Module gắn bên phải để mở rộng DI, DQ hoặc analog tuỳ nhu cầu hệ thống.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "The S7-1200 Programmable Controller",
      "points": [
        "CPU Form Factor Variants: Available in DC/DC/DC (24VDC supply, 24VDC inputs, 24VDC transistor outputs), AC/DC/Relay (120/230VAC supply, 24VDC inputs, relay outputs), and DC/DC/Relay",
        "Performance Hierarchy: CPU 1211C (50 KB RAM, no SM expansion) to CPU 1214C/1215C/1217C (up to 8 SM expansion modules and 3 CM modules)",
        "Signal Board (SB) Slot: Dedicated front-bezel receptacle supporting 1 SB (e.g. 2 DI/2 DO, 1 AI 12-bit, or 1 AQ 12-bit) without consuming DIN-rail horizontal length",
        "High-Speed Backplane Bus: Proprietary multi-pin slide bus interconnects modules on the right; transfers cyclic process images with hardware synchronization",
        "Communication Modules (CM): Mount to the left of the CPU, supporting up to 3 modules for Point-to-Point (PtP) RS485 Modbus RTU, PROFIBUS-DP, or TeleControl",
        "Mechanical Mounting: Mounts horizontally or vertically on standard 35mm DIN rail (EN 50022) with pull-down locking spring tabs"
      ],
      "explain": "The Siemens SIMATIC S7-1200 is a modular micro-PLC designed for open-loop and closed-loop process control across discrete manufacturing and process industries. The central processing unit (CPU) integrates a 32-bit RISC microprocessor, non-volatile Flash load memory, volatile execution work memory, high-speed digital and analog I/O channels, and an on-board PROFINET Industrial Ethernet port. The hardware family spans five performance tiers: CPU 1211C, 1212C, 1214C, 1215C, and 1217C, differing in work memory capacity (50 KB up to 250 KB), I/O count, and expansion capability. The CPU can be expanded using three modular form factors: Signal Boards (SB) or Communication Boards (CB) that snap directly into the front housing without altering the panel footprint; Signal Modules (SM) providing dense digital/analog expansion attached via high-speed backplane sliding bus connectors to the right; and Communication Modules (CM) providing serial RS232/RS485 or PROFIBUS interfaces attached to the left.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__001.png",
        "caption": "Figure 2.1: SIMATIC S7-1200 Modular Hardware Family: CPUs, Signal Boards, and Signal Modules"
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
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 2
    }
  ],
  "status": "review"
} satisfies TopicContent;

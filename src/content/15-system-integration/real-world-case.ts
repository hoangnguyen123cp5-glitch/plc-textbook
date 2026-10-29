import { TopicContent } from '@/types/content';

export default {
  "slug": "real-world-case",
  "title": "Real-World Application Case Study",
  "durationMinutes": 12,
  "summary": "This comprehensive case study synthesizes every automation principle mastered across the course into a complete, operational industrial facility: an Automated Liquid Chemical Blending and Dispensin...",
  "body": [
    {
      "heading": "Real-World Application Case Study",
      "text": "This comprehensive case study synthesizes every automation principle mastered across the course into a complete, operational industrial facility: an Automated Liquid Chemical Blending and Dispensing Plant. The process architecture comprises three raw ingredient storage tanks (Tanks A, B, and C) and a main heated jacketed mixing reactor (Tank D). The system is engineered using a Siemens S7-1200 CPU 1214C DC/DC/DC, an SM 1234 combo analog module (4 AI / 2 AQ), an SM 1221 digital expansion card, and a SIMATIC KTP700 Basic HMI panel connected via PROFINET. Continuous fluid level in Tank D is measured by an ultrasonic 4–20mA level transmitter wired to %IW64, scaled via NORM_X and SCALE_X into 0.0 to 10.0 cubic meters. Temperature in the jacketed reactor is regulated at 65.0°C by a PID_Compact Technology Object executing in Cyclic Interrupt OB30, commanding an analog modulating steam valve via %QW64. Ingredients are metered using high-speed pulse turbine flowmeters tracked via High-Speed Counters (HSC1 and HSC2). Agitator speed is controlled by an incremental encoder feedback loop driving a 3-phase motor via a variable frequency drive over PROFINET. The entire plant is governed by an automated state machine, full emergency stop interlocking, and historical recipe batch logging.",
      "keyPoints": [
        "Multi-Tier System Architecture: Fully integrated S7-1200 CPU 1214C, distributed PROFINET remote I/O, VFD motor drives, and KTP700 touchscreen",
        "High-Speed Metering: High-Speed Counter (HSC1) processes pulses from turbine flowmeters to meter precise ingredient volumes into the reactor",
        "Continuous Level Scaling: NORM_X and SCALE_X transform 4–20mA ultrasonic transmitter readings into accurate volumetric fluid levels (0.0 to 10.0 m³)",
        "Closed-Loop Thermal Regulation: PID_Compact Technology Object in OB30 regulates reactor temperature at 65.0°C via analog steam valve modulation",
        "Finite State Machine Sequence: Automatic batch sequence: Tank Flushing -> Ingredient A Fill -> Ingredient B Fill -> Heating & Agitation -> Drain & Clean",
        "Tri-Tier Safety Interlocking: Hardwired dual-channel emergency stop relay de-energizes main motor contactors; software safety rungs inhibit auto sequencing",
        "Commissioning and Handover Dossier: Complete project delivery documentation: Master I/O Schedule, As-Built Electrical Schematics, Tag Cross-Reference, Factory Acceptance Test (FAT) protocol, and Operator Maintenance Manual"
      ],
      "note": "The mark of an exceptional automation engineer is not just writing code that functions when everything is perfect, but engineering a system that behaves predictably, safely, and informatively when components fail! Always design thorough fault diagnostics, clear alarm banners, and fail-safe fallback states into every industrial project."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/15-system-integration/PLC___Slide__002.png",
      "caption": "Figure 15.3: Automated Liquid Blending Plant: S7-1200, Analog Scaling, PID, HSC & KTP700 HMI"
    }
  ],
  "quiz": [
    {
      "q": "In an automated chemical liquid blending plant, how do the various PLC subsystems collaborate in real time?",
      "options": [
        "Digital inputs detect safety doors, Analog modules measure vat levels, PID loops govern steam heating valves, High-Speed Counters track flow meters, and HMI visualizes recipes",
        "Only timers are used for all functions",
        "The system operates with zero sensors",
        "The PLC only turns on an indicator light"
      ],
      "answer": 0,
      "explain": "Real-world industrial installations orchestrate the entire curriculum stack: discrete interlocks, analog measurement, closed-loop PID, high-speed pulse tracking, and HMI supervision."
    }
  ],
  "narration": {
    "vi": "Hãy xét một dây chuyền đóng gói trong nhà máy thực phẩm. PLC điều khiển băng tải, cân định lượng, và máy hàn miệng túi. HMI cho phép thay đổi trọng lượng đặt và tốc độ dây chuyền mà không cần kỹ sư. SCADA theo dõi năng suất theo giờ và ghi nhận lỗi để báo cáo cuối ca. Toàn bộ hệ thống liên thông giúp quản lý nhà máy ra quyết định dựa trên dữ liệu thực, không phải ước tính.",
    "durationSec": 32,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Real-World Application Case Study",
      "points": [
        "Multi-Tier System Architecture: Fully integrated S7-1200 CPU 1214C, distributed PROFINET remote I/O, VFD motor drives, and KTP700 touchscreen",
        "High-Speed Metering: High-Speed Counter (HSC1) processes pulses from turbine flowmeters to meter precise ingredient volumes into the reactor",
        "Continuous Level Scaling: NORM_X and SCALE_X transform 4–20mA ultrasonic transmitter readings into accurate volumetric fluid levels (0.0 to 10.0 m³)",
        "Closed-Loop Thermal Regulation: PID_Compact Technology Object in OB30 regulates reactor temperature at 65.0°C via analog steam valve modulation",
        "Finite State Machine Sequence: Automatic batch sequence: Tank Flushing -> Ingredient A Fill -> Ingredient B Fill -> Heating & Agitation -> Drain & Clean",
        "Tri-Tier Safety Interlocking: Hardwired dual-channel emergency stop relay de-energizes main motor contactors; software safety rungs inhibit auto sequencing",
        "Commissioning and Handover Dossier: Complete project delivery documentation: Master I/O Schedule, As-Built Electrical Schematics, Tag Cross-Reference, Factory Acceptance Test (FAT) protocol, and Operator Maintenance Manual"
      ],
      "explain": "This comprehensive case study synthesizes every automation principle mastered across the course into a complete, operational industrial facility: an Automated Liquid Chemical Blending and Dispensing Plant. The process architecture comprises three raw ingredient storage tanks (Tanks A, B, and C) and a main heated jacketed mixing reactor (Tank D). The system is engineered using a Siemens S7-1200 CPU 1214C DC/DC/DC, an SM 1234 combo analog module (4 AI / 2 AQ), an SM 1221 digital expansion card, and a SIMATIC KTP700 Basic HMI panel connected via PROFINET. Continuous fluid level in Tank D is measured by an ultrasonic 4–20mA level transmitter wired to %IW64, scaled via NORM_X and SCALE_X into 0.0 to 10.0 cubic meters. Temperature in the jacketed reactor is regulated at 65.0°C by a PID_Compact Technology Object executing in Cyclic Interrupt OB30, commanding an analog modulating steam valve via %QW64. Ingredients are metered using high-speed pulse turbine flowmeters tracked via High-Speed Counters (HSC1 and HSC2). Agitator speed is controlled by an incremental encoder feedback loop driving a 3-phase motor via a variable frequency drive over PROFINET. The entire plant is governed by an automated state machine, full emergency stop interlocking, and historical recipe batch logging.",
      "figure": {
        "src": "/images/slides/15-system-integration/PLC___Slide__002.png",
        "caption": "Figure 15.3: Automated Liquid Blending Plant: S7-1200, Analog Scaling, PID, HSC & KTP700 HMI"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

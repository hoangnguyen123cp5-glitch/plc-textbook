import { TopicContent } from '@/types/content';

export default {
  "slug": "plc-structure",
  "sourceRef": "1.6",
  "title": "Structure of a PLC",
  "durationMinutes": 8,
  "summary": "At its core, a PLC is an industrial-hardened computer enclosed in an impact-resistant, dust-sealed, and vibration-damped chassis.",
  "body": [
    {
      "heading": "1.6 Internal Hardware Architecture of a PLC",
      "text": "At its core, a PLC is an industrial-hardened computer enclosed in an impact-resistant, dust-sealed, and vibration-damped chassis. Its anatomical architecture consists of 5 primary subsystems: (1) Power Supply Unit (PSU), converting 120/230VAC mains or regulating 24VDC to clean internal bus logic voltages (5VDC/3.3VDC); (2) Central Processing Unit (CPU Module), containing the industrial microprocessor, clock generators, and memory chips that govern all system operations; (3) Digital/Analog Input Section, interfacing field switches, encoders, and sensors through optical isolators (optocouplers) and RC filter networks that block transient voltage spikes; (4) Output Section, executing switching commands via electromechanical relays or power MOSFET transistors; (5) Internal System Bus, comprising the Address Bus, Data Bus, and Control Bus for synchronized inter-module backplane communication.",
      "keyPoints": [
        "Power Supply Unit: Provides isolated 24VDC/5VDC rails to internal logic cards; attenuates line noise and surges",
        "CPU Module: System brain executing cyclic input sampling, OB1 user code evaluation, and interrupt service routines",
        "Digital Input (DI) Modules: Feature optocouplers (500VAC isolation) and hardware RC filters to suppress contact bounce and inductive surges",
        "Digital Output (DO) Modules: Relay contacts (2A AC/DC rating, low switching speed) or Transistor outputs (0.5A DC, high-speed switching for PWM/PTO motion)",
        "Backplane Bus: Address Bus (pinpoints register offsets), Data Bus (transfers bit/word values), Control Bus (synchronizes read/write clocks)"
      ]
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/plc-wiring-di.jpg",
      "caption": "Figure 1.6: Anatomical PLC Architecture: Power Supply, CPU, Backplane Bus & Discrete I/O"
    }
  ],
  "caseStudy": {
    "title": "Optical Isolation & 500V Noise Suppression in S7-1200 Digital Input Channels",
    "context": "Field sensor cables running through cable trays alongside 400VAC variable frequency drive motor leads pick up massive inductive spikes and electromagnetic interference. The S7-1200 digital input stage protects the CPU microprocessor through a robust 3-stage defense: 1. Bridge diode polarity protection; 2. Configurable RC hardware filter suppressing contact bounce and high-frequency noise spikes; 3. Optocoupler (phototransistor) that converts electrical pulses into light and back, creating an impenetrable 500VAC electrical barrier.",
    "hardware": [
      "Internal Power: Switched-mode power supply generating clean 5VDC and 3.3VDC logic rails",
      "Galvanic Isolation: Vishay/Toshiba industrial optocouplers with 500VAC isolation rating",
      "Output Stage: Omron 2A mechanical relays or Infineon high-speed MOSFET solid-state switches",
      "Backplane Bus: High-speed synchronized Address, Data, and Control buses"
    ],
    "pitfall": "Setting the input filter time too low (e.g. 0.1 μs) on mechanical pushbuttons causes contact bounce to register as multiple false trigger pulses. Mechanical buttons require 3.2 ms filtering."
  },
  "quiz": [
    {
      "q": "Why are optical isolators (optocouplers) universally installed on PLC digital input channels?",
      "options": [
        "To speed up CPU clock frequency",
        "To electrically decouple sensitive 3.3V/5V microprocessor electronics from high-voltage 24V/230V plant field transients",
        "To convert digital signals into analog signals",
        "To save memory space"
      ],
      "answer": 1,
      "explain": "Optocouplers isolate field wiring from CPU logic using light transmission, protecting silicon microchips against plant ground loops and voltage surges."
    }
  ],
  "narration": {
    "vi": "Bên trong một PLC S7-1200 có năm khối chức năng. CPU xử lý chương trình và điều phối toàn bộ hoạt động. Bộ nhớ lưu chương trình, dữ liệu và vùng ảnh I/O. Khối đầu vào đọc trạng thái từ cảm biến và nút nhấn. Khối đầu ra điều khiển contactor, đèn và van. Nguồn điện cung cấp 24VDC ổn định cho tất cả khối còn lại. Các khối này giao tiếp qua bus nội bộ tốc độ cao.",
    "durationSec": 34,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

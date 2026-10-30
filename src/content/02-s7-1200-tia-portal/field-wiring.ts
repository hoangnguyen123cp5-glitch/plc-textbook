import { TopicContent } from '@/types/content';

export default {
  "slug": "field-wiring",
  "sourceRef": "1.5",
  "title": "Wiring the PLC to Field Devices",
  "durationMinutes": 12,
  "summary": "Wiring field devices to the S7-1200 requires rigorous adherence to industrial electrical standards (IEC 60204-1 and NFPA 79).",
  "body": [
    {
      "heading": "1.5 Wiring the PLC to Field Devices",
      "text": "Wiring field devices to the S7-1200 requires rigorous adherence to industrial electrical standards (IEC 60204-1 and NFPA 79). Control power is supplied via terminals L+ (+24VDC) and M (0VDC return), with protective earth grounded at the PE screw. The discrete digital inputs of the S7-1200 feature optical isolation and can be configured as Sinking or Sourcing circuits by wiring the common terminal '1M'. In a Sinking DI configuration (standard European PNP sensor compatibility), 1M is connected to 0VDC (M), and external sensors switch +24VDC into the input terminals (%I0.0 to %I1.5). For digital outputs, DC/DC/DC CPUs provide high-speed power MOSFET transistor outputs (24VDC sourcing, rated 0.5A per channel) capable of switching up to 100 kHz for pulse train motion control. AC/DC/Relay CPUs feature dry electromechanical relay contacts rated for 2.0A switching of either 24VDC or 120/230VAC external loads. Freewheeling flyback diodes must be wired across all DC inductive loads (solenoids, contactor coils) to suppress destructive high-voltage inductive kickback.",
      "keyPoints": [
        "System Power Supply: 24VDC nominal (allowable range 20.4VDC to 28.8VDC) at L+ and M; provide upstream miniature circuit breaker (MCB) or fuse protection",
        "Digital Input Sinking Circuit (PNP): Connect common terminal 1M to 0VDC (M); input activates when switched high (+24VDC relative to 1M)",
        "Digital Input Sourcing Circuit (NPN): Connect common terminal 1M to +24VDC (L+); input activates when pulled low (0VDC relative to 1M)",
        "Transistor DO Specifications: Sourcing MOSFET outputs (switches +24VDC from 1L+ to output pin); 0.5A max continuous load; 100 kHz maximum switching speed",
        "Relay DO Specifications: Form-A dry contact; 2.0A resistive / inductive load; maximum 1 Hz switching rate; galvanic isolation between relay groups (1L, 2L)",
        "Inductive Suppression: Reverse-biased 1N4007 diodes across DC coils, or RC snubber circuits across AC coils, prevent contact arcing and optical isolator damage",
        "Wiring Practices: Always terminate stranded conductors with insulated ferrule crimp pins (bootlace pins) sized 0.5 mm² to 1.5 mm² (AWG 20 to 16)"
      ],
      "note": "Failure to install freewheeling flyback diodes across DC inductive solenoid valves can generate inductive voltage spikes exceeding 400V, causing immediate breakdown of the S7-1200 transistor output stages or intermittent CPU hardware crashes."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/plc-wiring-di.jpg",
      "caption": "Figure 2.3: Industrial Field Wiring Schematic for 24VDC Digital Inputs (Sinking / Sourcing Circuits)"
    }
  ],
  "quiz": [
    {
      "q": "In a standard European Sinking Digital Input configuration (PNP sensor compatible), what voltage is connected to common terminal 1M?",
      "options": [
        "+24VDC (L+)",
        "0VDC (M)",
        "120VAC Neutral",
        "Protective Earth (PE) only"
      ],
      "answer": 1,
      "explain": "In a Sinking DI circuit, terminal 1M is bonded to 0VDC (M). External PNP sensors switch positive +24VDC into the input channels (%I0.0–%I1.5)."
    },
    {
      "q": "Why must reverse-biased freewheeling diodes be connected across DC solenoid coils?",
      "options": [
        "To increase solenoid actuation speed",
        "To suppress destructive high-voltage inductive kickback spikes when de-energized",
        "To convert AC power into DC power",
        "To provide thermal overload protection"
      ],
      "answer": 1,
      "explain": "When a DC inductive coil de-energizes, the collapsing magnetic field induces negative spikes exceeding 400V. A flyback diode dissipates this surge safely."
    }
  ],
  "narration": {
    "vi": "Khi đấu dây thực tế, bạn cần phân biệt sinking và sourcing. Đầu vào sinking nghĩa là dòng chạy vào chân DI từ thiết bị bên ngoài. Đầu vào sourcing thì ngược lại. Cảm biến NPN thường dùng với đầu vào sinking, cảm biến PNP dùng với sourcing. Đầu ra transistor của S7-1200 là sourcing, nên tải phải nối từ đầu ra về mass. Luôn kiểm tra cực tính và điện áp nguồn trước khi cấp điện.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Wiring the PLC to Field Devices",
      "points": [
        "System Power Supply: 24VDC nominal (allowable range 20.4VDC to 28.8VDC) at L+ and M; provide upstream miniature circuit breaker (MCB) or fuse protection",
        "Digital Input Sinking Circuit (PNP): Connect common terminal 1M to 0VDC (M); input activates when switched high (+24VDC relative to 1M)",
        "Digital Input Sourcing Circuit (NPN): Connect common terminal 1M to +24VDC (L+); input activates when pulled low (0VDC relative to 1M)",
        "Transistor DO Specifications: Sourcing MOSFET outputs (switches +24VDC from 1L+ to output pin); 0.5A max continuous load; 100 kHz maximum switching speed",
        "Relay DO Specifications: Form-A dry contact; 2.0A resistive / inductive load; maximum 1 Hz switching rate; galvanic isolation between relay groups (1L, 2L)",
        "Inductive Suppression: Reverse-biased 1N4007 diodes across DC coils, or RC snubber circuits across AC coils, prevent contact arcing and optical isolator damage",
        "Wiring Practices: Always terminate stranded conductors with insulated ferrule crimp pins (bootlace pins) sized 0.5 mm² to 1.5 mm² (AWG 20 to 16)"
      ],
      "explain": "Wiring field devices to the S7-1200 requires rigorous adherence to industrial electrical standards (IEC 60204-1 and NFPA 79). Control power is supplied via terminals L+ (+24VDC) and M (0VDC return), with protective earth grounded at the PE screw. The discrete digital inputs of the S7-1200 feature optical isolation and can be configured as Sinking or Sourcing circuits by wiring the common terminal '1M'. In a Sinking DI configuration (standard European PNP sensor compatibility), 1M is connected to 0VDC (M), and external sensors switch +24VDC into the input terminals (%I0.0 to %I1.5). For digital outputs, DC/DC/DC CPUs provide high-speed power MOSFET transistor outputs (24VDC sourcing, rated 0.5A per channel) capable of switching up to 100 kHz for pulse train motion control. AC/DC/Relay CPUs feature dry electromechanical relay contacts rated for 2.0A switching of either 24VDC or 120/230VAC external loads. Freewheeling flyback diodes must be wired across all DC inductive loads (solenoids, contactor coils) to suppress destructive high-voltage inductive kickback.",
      "figure": {
        "src": "/images/diagrams/plc-wiring-di.jpg",
        "caption": "Figure 2.3: Industrial Field Wiring Schematic for 24VDC Digital Inputs (Sinking / Sourcing Circuits)"
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

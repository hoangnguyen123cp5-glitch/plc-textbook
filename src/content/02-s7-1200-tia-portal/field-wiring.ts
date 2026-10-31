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
      "caption": "Figure 2.3: 24 VDC Digital Input Wiring Schematic: Normally Open Pushbutton S1 Connected to I0.0 with Common 1M Tied to 0 VDC (M)"
    }
  ],
  "caseStudy": {
    "title": "The Sensor That Never Switched: NPN vs PNP on the 1M Common",
    "context": "During lab assembly a student wires a 3-wire inductive proximity sensor to %I0.2 of a CPU 1214C. The sensor's own LED lights when a metal target is present, but the CPU input LED and the TIA Portal watch table stay at 0. Measuring with a multimeter shows only about 0 V between %I0.2 and 1M. The sensor is an NPN (current-sinking) type, but the input group was wired as a sinking input with 1M tied to 0 V (M), which expects a PNP sensor that switches +24 V to the terminal. An NPN sensor pulls its output to 0 V, so no current flows through the input.",
    "hardware": [
      "Sensor: 3-wire inductive proximity switch, brown = +24 V (L+), blue = 0 V (M), black = signal",
      "PNP sensor + 1M to M: signal switches +24 V into %I0.2 — input reads 1 (correct pairing)",
      "NPN sensor: requires the sourcing arrangement, 1M to +24 V (L+), so the sensor pulls the input to 0 V",
      "One 1M common serves the whole input group — all sensors in that group must be the same type",
      "Check with a multimeter: logic 1 needs at least about 15 VDC between the input terminal and 1M"
    ],
    "pitfall": "Mixing NPN and PNP sensors on inputs that share the same 1M common. Only one polarity can work in that group; either standardise on one sensor type (PNP is usual in Europe and in Siemens labs) or move the odd sensor to a group with its own common."
  },
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
    },
    {
      "q": "An NPN proximity sensor's own LED lights, but the PLC input stays 0. The input group's 1M is connected to 0 V. What is the most likely cause?",
      "options": [
        "The CPU is in STOP mode",
        "The sensor type does not match the 1M wiring — an NPN sensor needs 1M connected to +24 V",
        "The input must be forced in a Force Table",
        "A flyback diode is missing across the sensor"
      ],
      "answer": 1,
      "explain": "With 1M at 0 V the input expects a PNP sensor that switches +24 V. An NPN sensor switches to 0 V, so there is no voltage across the input. Rewire 1M to +24 V (whole group) or use a PNP sensor."
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
      "title": "PC-to-PLC Interface & CPU Power Supply",
      "points": [
        "Correct peripheral wiring is essential for reliable PLC communication and I/O",
        "Legacy S7-200 CPUs require RS-232/PPI or USB/PPI Multi-Master converter cables",
        "S7-1200 DC CPUs operate on 20.4 to 28.8 VDC (24 VDC nominal at L+ and M)",
        "S7-1200 AC CPUs accept 85 to 264 VAC (47 to 63 Hz) line power directly"
      ],
      "explain": "Hardware wiring begins with the programming link and CPU power supply. Whereas legacy S7-200 controllers needed an RS-232/PPI or USB/PPI Multi-Master adapter cable to talk to a PC, S7-1200 CPUs connect directly over Ethernet. Before energizing the CPU, always verify whether the model is a 24 VDC variant (20.4–28.8 VDC) or a wide-range AC variant (85–264 VAC).",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__019.jpeg",
        "caption": "Complete power, digital input, analog input, and relay output wiring on an S7-1200"
      }
    },
    {
      "kind": "concept",
      "title": "Digital Inputs: DC vs AC & Sinking vs Sourcing",
      "points": [
        "DC inputs switch rapidly and operate at safe low voltage (24 VDC)",
        "AC inputs resist electromagnetic noise over long runs but respond slower",
        "Sinking input (1M tied to 0 V): pairs with mechanical contacts and PNP sensors",
        "Sourcing input (1M tied to +24 V): pairs with 3-wire NPN current-sinking sensors"
      ],
      "explain": "Digital inputs on the S7-1200 are grouped around a shared common terminal labeled 1M. Tying 1M to 0 VDC (M) configures the group as sinking inputs, which expect +24 VDC from dry relay contacts, pushbuttons, or PNP proximity sensors. If a machine uses NPN sensors—which pull their signal wire to 0 V when active—you must wire 1M to +24 VDC (L+) so current flows out of the PLC input.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__016.png",
        "caption": "Connecting 24 VDC digital inputs to external devices: (a) relay-output sensor with common M at 0 V, (b) PNP sensor with common M at 0 V, and (c) NPN sensor with common L at +24 V"
      }
    },
    {
      "kind": "concept",
      "title": "Digital Output Stages: Relay, Transistor, and Triac",
      "points": [
        "Relay outputs switch both AC (20–264 VAC) and DC (5–30 VDC) loads up to 2 A",
        "Relay contacts provide galvanic isolation but wear out after millions of cycles",
        "Transistor (MOSFET) outputs switch 20.4–28.8 VDC rapidly with no contact wear",
        "Triac outputs switch AC loads rapidly; clamp inductive coils with diodes or RC snubbers"
      ],
      "explain": "When wiring actuators to PLC outputs, match the output hardware type to the load. Relay outputs are dry contacts that can switch either 24 VDC or 220 VAC contactor coils, but their mechanical life and switching speed are limited. Transistor outputs on DC/DC/DC CPUs switch 24 VDC silently up to 100 kHz for pulse outputs, while triac stages handle fast AC switching.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__017.jpeg",
        "caption": "Internal optocoupler isolation and output stages: transistor, relay, and triac"
      }
    },
    {
      "kind": "diagram",
      "title": "Actuator Output & CPU Terminal Wiring Schematics",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__018.jpeg",
        "caption": "Wiring actuators to 24 VDC, relay, and AC output groups alongside full CPU I/O terminals"
      },
      "explain": "Compare the three output terminal blocks at the top: transistor outputs require a 24 VDC supply on L+ and M, whereas relay common terminals (L) can be fed from either a DC battery or a 220 VAC line to drive lamps and interposing contactors."
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 1
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 2
    }
  ],
  "status": "review"
} satisfies TopicContent;

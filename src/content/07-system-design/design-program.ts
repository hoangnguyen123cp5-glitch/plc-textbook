import { TopicContent } from '@/types/content';

export default {
  "slug": "design-program",
  "sourceRef": "6.2",
  "title": "Designing and Programming the System",
  "durationMinutes": 13,
  "summary": "Once hardware is selected, engineering proceeds into concurrent electrical design and software architecture development.",
  "body": [
    {
      "heading": "6.2 Designing and Programming the System",
      "text": "Once hardware is selected, engineering proceeds into concurrent electrical design and software architecture development. Electrical design produces complete CAD schematic drawings (using tools such as EPLAN Electric P8 or AutoCAD Electrical): power distribution single-line diagrams, emergency stop safety circuits, PLC rack layouts, terminal strip diagrams, and point-to-point field wiring schematics. Concurrently, software development begins with modular process decomposition. Complex automated processes are modeled as finite state machines (FSM) or sequential function charts (SFC / Grafcet), breaking the machine cycle into distinct operational states: Initializing, Ready/Idle, Auto Running, Paused, Manual Jog, and Fault/E-Stop. Programs are structured hierarchically: OB1 invokes specialized Functions (FCs) for stateless math and standard device drivers, and Function Blocks (FBs) with dedicated Instance DBs for complex equipment (pumps, conveyors, pneumatic indexers). Standardized tag naming conventions (e.g. using camelCase or Hungarian notation: 'iStartButton', 'qConveyorMotor', 'rTankTemperature') ensure readability and maintainability.",
      "keyPoints": [
        "Electrical CAD Schematics: Formal drawings detailing 3-phase power distribution, 24VDC control rails, PLC terminal pins, and field wiring cables",
        "Finite State Machine (FSM) Architecture: Structures machine logic into explicit states governed by transition conditions, preventing unexpected state jumps",
        "Modular Program Decomposition: Segregates code into functional blocks: FCs for stateless algorithms; FBs for stateful equipment control",
        "Standardized Tag Tables: Define global symbolic tags with consistent prefixes (e.g. di_, do_, ai_, aq_, st_) before writing ladder rungs",
        "Safety Interlock Separation: Hardwired safety relays govern the master control contactors; software rungs provide secondary operational interlocking",
        "HMI Interface Tag Blocks: Dedicated Global Data Blocks consolidate all supervisory setpoints, status words, and alarm bits in contiguous memory",
        "Revision Control and Documentation: Document all block headers with author, date, functional description, and revision change logs"
      ],
      "note": "Never write an entire machine program as a single massive ladder rung list inside OB1! Monolithic ladder programs are unmaintainable and dangerous to commission. Always divide the application into modular FCs and FBs representing physical machine subsystems."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/07-system-design/PLC__Slide_7_003.png",
      "caption": "Figure 7.2: Control Architecture Design: Electrical CAD Schematics & Finite State Machine States"
    }
  ],
  "quiz": [
    {
      "q": "Why should complex machine sequences be modeled as a Finite State Machine (FSM) before writing ladder rungs?",
      "options": [
        "To guarantee only one defined state is active at a time and eliminate race conditions and latch lockups",
        "To reduce PLC cost",
        "Because TIA Portal cannot compile ladder without it",
        "To invert the AC supply phase"
      ],
      "answer": 0,
      "explain": "State machines provide deterministic, predictable execution where state transitions occur only when strict safety and process criteria are met."
    }
  ],
  "narration": {
    "vi": "Chương trình PLC tốt nên được tổ chức theo cấu trúc rõ ràng. OB1 là khối chính được gọi mỗi vòng quét, chứa các lời gọi đến FC và FB theo chức năng. FC là hàm không có bộ nhớ nội, phù hợp cho các tính toán thuần túy. FB có Instance Data Block riêng để lưu trạng thái giữa các lần gọi, dùng cho điều khiển thiết bị cần nhớ trạng thái. Cách phân chia này giúp code dễ đọc, dễ kiểm thử và tái sử dụng được.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Designing and Programming the System",
      "points": [
        "Electrical CAD Schematics: Formal drawings detailing 3-phase power distribution, 24VDC control rails, PLC terminal pins, and field wiring cables",
        "Finite State Machine (FSM) Architecture: Structures machine logic into explicit states governed by transition conditions, preventing unexpected state jumps",
        "Modular Program Decomposition: Segregates code into functional blocks: FCs for stateless algorithms; FBs for stateful equipment control",
        "Standardized Tag Tables: Define global symbolic tags with consistent prefixes (e.g. di_, do_, ai_, aq_, st_) before writing ladder rungs",
        "Safety Interlock Separation: Hardwired safety relays govern the master control contactors; software rungs provide secondary operational interlocking",
        "HMI Interface Tag Blocks: Dedicated Global Data Blocks consolidate all supervisory setpoints, status words, and alarm bits in contiguous memory",
        "Revision Control and Documentation: Document all block headers with author, date, functional description, and revision change logs"
      ],
      "explain": "Once hardware is selected, engineering proceeds into concurrent electrical design and software architecture development. Electrical design produces complete CAD schematic drawings (using tools such as EPLAN Electric P8 or AutoCAD Electrical): power distribution single-line diagrams, emergency stop safety circuits, PLC rack layouts, terminal strip diagrams, and point-to-point field wiring schematics. Concurrently, software development begins with modular process decomposition. Complex automated processes are modeled as finite state machines (FSM) or sequential function charts (SFC / Grafcet), breaking the machine cycle into distinct operational states: Initializing, Ready/Idle, Auto Running, Paused, Manual Jog, and Fault/E-Stop. Programs are structured hierarchically: OB1 invokes specialized Functions (FCs) for stateless math and standard device drivers, and Function Blocks (FBs) with dedicated Instance DBs for complex equipment (pumps, conveyors, pneumatic indexers). Standardized tag naming conventions (e.g. using camelCase or Hungarian notation: 'iStartButton', 'qConveyorMotor', 'rTankTemperature') ensure readability and maintainability.",
      "figure": {
        "src": "/images/slides/07-system-design/PLC__Slide_7_003.png",
        "caption": "Figure 7.2: Control Architecture Design: Electrical CAD Schematics & Finite State Machine States"
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

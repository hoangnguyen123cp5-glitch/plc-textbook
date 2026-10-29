import { LessonContentFile } from '@/types/content';

export default {
  "slug": "07-system-design",
  "id": 7,
  "title": "Designing a PLC Control Application",
  "description": "Selecting devices from requirements, system design, expansion modules, fault handling",
  "course": "AUT206",
  "session": 2,
  "lab": "Lab 6",
  "clo": "G4",
  "module": 2,
  "topicOrder": [
    "device-selection",
    "design-program",
    "digital-expansion",
    "analog-expansion",
    "fault-handling"
  ],
  "overview": "Procuring a PLC is straightforward; engineering an industrial-grade, reliable, and maintainable automation control system requires a disciplined methodology. This lesson guides students through the complete engineering lifecycle from initial customer functional requirements to device selection, master I/O scheduling, 24VDC power budgeting, electrical schematic design, modular programming, hardware expansion (digital and analog SM modules), and systematic commissioning troubleshooting. Every phase produces formalized engineering deliverables—I/O lists, bills of materials (BOM), panel wiring schematics, and test protocols—that constitute professional automation practice.",
  "objectives": [
    "Translate a written functional plant specification into a fully quantified Master I/O Schedule with 20% engineering spare capacity",
    "Calculate 24VDC system power budgets and select the optimal S7-1200 CPU, power supply, and expansion modules",
    "Design electrical schematics and panel layout drawings following international standards (IEC 60204-1)",
    "Structure modular PLC programs utilizing state machine architectures, Organization Blocks, Functions (FC), and Function Blocks (FB)",
    "Mechanically attach, address, and parameterize digital expansion modules (SM 1221 DI, SM 1222 DO) in TIA Portal",
    "Configure analog expansion modules (SM 1231 AI, SM 1232 AQ) with hardware noise filtering and channel diagnostics",
    "Execute systematic fault troubleshooting using multimeters, CPU diagnostic buffers, Watch Tables, and signal tracing protocols"
  ],
  "review": [
    "Explain the purpose of a Master I/O Schedule and state why professional engineering design rules mandate a minimum of 20% spare capacity.",
    "Detail how to calculate the total 24VDC system power budget when selecting a SITOP regulated power supply for an automated machine cell.",
    "What is the functional difference between an Organization Block (OB), a Function (FC), and a Function Block (FB) in a structured control application?",
    "Describe the mechanical and electrical procedure for connecting an SM 1221 digital expansion module to an S7-1200 CPU on a DIN rail.",
    "How does an automation engineer configure an SM 1231 analog input module in TIA Portal to measure a 4–20mA current loop with automated wire-break detection?",
    "Outline the 5-step systematic troubleshooting methodology used to diagnose an automated machine that halts unexpectedly during production.",
    "An input status LED on an S7-1200 CPU illuminates green when a sensor is blocked, but the ladder logic contact does not evaluate TRUE. Explain the possible causes."
  ]
} satisfies LessonContentFile;

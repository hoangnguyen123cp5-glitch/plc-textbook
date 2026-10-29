import { LessonContentFile } from '@/types/content';

export default {
  "slug": "03-binary-operations",
  "id": 3,
  "title": "Binary Operations",
  "description": "Logic links, set/reset instructions, timers, counters and a worked application",
  "course": "AUT206",
  "session": 1,
  "lab": "Lab 2",
  "clo": "G2 — Write, download, and debug binary logic programs using ladder diagram, timers, and counters",
  "module": 1,
  "topicOrder": [
    "logic-links",
    "set-reset",
    "timers",
    "counters",
    "binary-application"
  ],
  "overview": "This lesson covers the core binary logic foundations of industrial PLC programming in IEC 61131-3 Ladder Diagram (LAD). Students will master Boolean logic gate equivalents (AND, OR, NOT, XOR), the physical evaluation of Normally Open (NO) and Normally Closed (NC) contacts, output coil behaviors, motor start-stop seal-in latching circuits, Set (S) and Reset (R) dominant latch instructions, IEC standard timers (TON, TOF, TP), and IEC counters (CTU, CTD, CTUD). The lesson concludes with a worked industrial application implementing multi-phase sequence control.",
  "objectives": [
    "Evaluate Boolean logic equations in Ladder Diagram using series, parallel, and inverted contact networks",
    "Differentiate the physical operation and software evaluation of Normally Open (NO) and Normally Closed (NC) contacts",
    "Design and analyze standard motor Start-Stop latching circuits with physical hardwired emergency stop interlocking",
    "Apply Set (S) and Reset (R) instructions, evaluating network execution order and SR vs RS dominant flip-flop blocks",
    "Configure IEC 61131-3 timer function blocks (TON On-Delay, TOF Off-Delay, TP Pulse) with instance data blocks",
    "Program IEC counter blocks (CTU Count Up, CTD Count Down, CTUD Bidirectional) for industrial part totalization",
    "Synthesize timers, counters, and edge detection into a fully integrated multi-state manufacturing application"
  ],
  "review": [
    "Explain the functional difference between a Normally Open (NO) and Normally Closed (NC) contact in Ladder Diagram when evaluating a physical sensor.",
    "A physical emergency stop pushbutton with hardwired NC contacts is connected to digital input %I0.0. Should you use a NO or NC contact in your ladder logic rung? Justify your answer.",
    "Compare the operation of a traditional seal-in Start-Stop motor latch against Set (S) and Reset (R) coils. What occurs if both Set and Reset are active simultaneously?",
    "Draw the timing diagrams for TON (On-Delay), TOF (Off-Delay), and TP (Pulse) timers, clearly showing the relationship between input IN, output Q, and elapsed time ET.",
    "Why are software IEC counters in OB1 incapable of accurately counting pulses from high-speed rotary encoders operating at 10 kHz?",
    "Describe how two TON timers can be interconnected to create an oscillating flasher circuit for an industrial alarm beacon.",
    "In the batch diversion case study, explain how a TON timer and a TP timer work together to track and eject defective parts from a moving conveyor."
  ]
} satisfies LessonContentFile;

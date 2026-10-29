import { LessonContentFile } from '@/types/content';

export default {
  "slug": "01-programmable-control",
  "id": 1,
  "title": "Programmable Control Fundamentals",
  "description": "Hardwired vs programmable control, PLC architecture, scan cycle, IEC 61131-3 languages",
  "course": "AUT206",
  "session": 1,
  "lab": "Lab 1",
  "clo": "G1 — Explain the architecture, operating principles, and scan cycle of programmable logic controllers",
  "module": 1,
  "topicOrder": [
    "control-system-basics",
    "loop-types",
    "hardwired-vs-programmable",
    "why-plc",
    "defining-plc",
    "plc-structure",
    "memory-and-leds",
    "scan-cycle",
    "languages-structure"
  ],
  "overview": "Every industrial automation machine—from high-speed elevators and industrial washing systems to automated beverage bottling lines—is fundamentally a control system: an engineered architecture capable of measurement, decision logic, and physical execution. This lesson establishes the theoretical cornerstone for the entire course: the core distinction between open-loop and closed-loop control systems, the economic and operational drivers behind the industrial shift from hardwired relay cabinets to Programmable Logic Controllers (PLCs), the internal hardware architecture of a PLC CPU, and specifically the scan cycle mechanism—the root origin of over 90% of logic errors encountered by beginner automation engineers.",
  "objectives": [
    "Explain the fundamental principles of control systems and accurately contrast open-loop, closed-loop, and computerised control architectures",
    "Compare the technical and operational trade-offs between hardwired relay panels and software-programmable controllers",
    "Describe the internal hardware architecture of a modern PLC: power supply unit, central processing unit (CPU), discrete/analog I/O sections, and internal system buses",
    "Differentiate the functional memory areas of the Siemens S7-1200 (Load Memory, Work Memory, Retentive Memory) and interpret the front-panel diagnostic status LEDs (RUN/STOP, ERROR, MAINT)",
    "Analyze the 4 sequential phases of the PLC scan cycle and explain the critical role of Process Image Input (PII) and Process Image Output (PIQ)",
    "Identify the 5 standardized programming languages defined by IEC 61131-3 (LAD, FBD, SCL, STL, SFC) and assess the primary industrial application domain for each language"
  ],
  "review": [
    "Identify the 5 core functional elements present in all automated control systems and provide an industrial example for each component.",
    "A street lighting circuit is turned on at 18:00 and off at 06:00 using a 24-hour time clock. Classify this control topology as open-loop or closed-loop, and describe the engineering modifications required to convert it to the other topology.",
    "Why does migrating from hardwired relay panels to a PLC architecture save manufacturing plants hundreds of production downtime hours when retooling a production line?",
    "State the NEMA definition of a Programmable Logic Controller and explain the 1968 General Motors specification that catalyzed the invention of the PLC.",
    "Contrast the functional roles of Load Memory, Work Memory, and Retentive Memory in a Siemens S7-1200 CPU. Which memory area is completely volatilized upon power loss?",
    "The CPU RUN LED is illuminated solid green, yet an associated conveyor drive fails to run. Before opening an engineering laptop to connect a programming cable, what front-panel CPU status indicators can you inspect to isolate the fault?",
    "Detail the 4 sequential phases of the PLC scan cycle. Why can an input pulse with a 0.5ms duration be missed by the CPU if the scan cycle time is 5ms?",
    "Compare the technical advantages and ideal application domains of Ladder Diagram (LAD) and Structured Control Language (SCL) in TIA Portal."
  ]
} satisfies LessonContentFile;

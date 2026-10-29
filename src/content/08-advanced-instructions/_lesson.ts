import { LessonContentFile } from '@/types/content';

export default {
  "slug": "08-advanced-instructions",
  "id": 8,
  "title": "Advanced Instruction Set",
  "description": "Time-handling instructions, string and character data, interrupt handling",
  "course": "AUT207",
  "session": 1,
  "lab": "Lab 3",
  "clo": "G2",
  "module": 3,
  "topicOrder": [
    "time-instructions",
    "string-instructions",
    "interrupt-instructions"
  ],
  "overview": "This lesson covers the advanced instruction set of the Siemens S7-1200/1500 controller required for sophisticated industrial applications. Moving beyond elementary binary and math operations, students will master high-resolution time-handling functions, date arithmetic, character string manipulation (for barcode scanners, RFID readers, and serial communication telegrams), and asynchronous interrupt processing (hardware interrupts, cyclic interrupts, and diagnostic error organization blocks). These instructions enable microsecond-level event capture, automated shift scheduling, and deterministic execution of complex process algorithms.",
  "objectives": [
    "Execute high-resolution temporal calculations using TIME_TCK, T_DIFF, T_ADD, T_SUB, and the DTL structure",
    "Configure Time-of-Day Interrupts (OB10) for automated calendar-based machine sequencing and daily shift data archiving",
    "Manipulate ASCII character and string data structures (CHAR, STRING, WSTRING) using CONCAT, LEFT, RIGHT, MID, FIND, and LEN blocks",
    "Convert between numeric values and formatted ASCII strings using VAL_STRG and STRG_VAL for serial telegram processing",
    "Configure and program Hardware Interrupts (OB40–OB47) triggered within microseconds by rising or falling edges on digital inputs",
    "Program Cyclic Interrupts (OB30–OB38) for deterministic, fixed-interval execution of closed-loop PID control loops",
    "Implement Diagnostic and Error Organization Blocks (OB80, OB82, OB86, OB122) to prevent catastrophic CPU STOP faults upon field anomalies"
  ],
  "review": [
    "Explain how the TIME_TCK instruction functions and describe how to accurately benchmark the execution time of an industrial machine sequence.",
    "Detail the byte-level memory architecture of an IEC STRING variable in the Siemens S7-1200 controller.",
    "Describe an industrial application where VAL_STRG and STRG_VAL instructions are required to communicate with a barcode scanner and an inkjet printer.",
    "Explain the preemptive operating system mechanism of a Hardware Interrupt (OB40) versus standard cyclic execution in OB1.",
    "Why must digital closed-loop PID control algorithms always be executed inside a Cyclic Interrupt (OB30) rather than inside OB1?",
    "What occurs to an S7-1200 CPU in RUN mode when a remote PROFINET I/O rack is powered down if OB86 is NOT present in the user program?",
    "Describe how the ATTACH instruction can be used in ladder logic to dynamically enable a hardware interrupt only during a specific packaging machine state."
  ]
} satisfies LessonContentFile;

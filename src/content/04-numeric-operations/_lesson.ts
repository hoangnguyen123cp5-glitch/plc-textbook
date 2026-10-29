import { LessonContentFile } from '@/types/content';

export default {
  "slug": "04-numeric-operations",
  "id": 4,
  "title": "Numeric Operations",
  "description": "Data space, comparison, rotate and shift, arithmetic functions, real-time clock",
  "course": "AUT206",
  "session": 1,
  "lab": "Lab 3",
  "clo": "G2",
  "module": 2,
  "topicOrder": [
    "data-space",
    "comparison",
    "rotate-shift",
    "math-functions",
    "real-time-clock"
  ],
  "overview": "This lesson covers the numeric data processing architecture of modern programmable controllers. Industrial applications require continuous measurement, mathematical calculations, recipes, comparisons, and time stamping. Students will study elementary IEC 61131-3 data types (Bool, Byte, Word, DWord, Int, DInt, Real, Time), memory organization and bit alignment in S7-1200 data blocks, magnitude comparisons, bit-shift and rotate operations for tracking FIFO buffers, arithmetic functions with overflow and division-by-zero protection, and the on-board Real-Time Clock (RTC) for shift-based scheduling.",
  "objectives": [
    "Identify, classify, and size all elementary and complex IEC 61131-3 data types in TIA Portal",
    "Analyze memory allocation, byte addressing, and word boundaries across Bit Memory (%M) and Data Blocks (DB)",
    "Implement relational comparison operations (==, <>, >, >=, <, <=) and window comparators for numeric limits",
    "Apply bit-shift (SHL, SHR) and rotate (ROL, ROR) instructions to implement FIFO shift registers on material conveyors",
    "Perform arithmetic calculations (ADD, SUB, MUL, DIV, MOD) and construct compound equations using the CALCULATE block",
    "Read, write, and manipulate the hardware Real-Time Clock using system functions (RD_SYS_T, WR_SYS_T, RD_LOC_T) and the DTL structure"
  ],
  "review": [
    "List the bit lengths, numeric ranges, and memory representation for BYTE, INT, DINT, and REAL data types in Siemens S7-1200.",
    "Explain what occurs in PLC memory when an engineer assigns %MD10 to a REAL flow value and simultaneously assigns %MW10 to a motor speed reference.",
    "Why is it hazardous to evaluate floating-point equality using a simple '==' comparison block in Ladder Diagram? Provide the recommended solution.",
    "Describe how a Shift Left (SHL) instruction and an optical part sensor can be combined to track defective items along an automated conveyor line.",
    "What specific runtime error occurs if a DIV instruction attempts to divide by zero, and how do you protect against this in your ladder logic?",
    "Explain the internal structure of the DTL data type and contrast the system functions RD_SYS_T and RD_LOC_T.",
    "A plant manager requires a daily production totalizer to automatically reset at exactly 06:00:00 every morning. How would you implement this using the RTC?"
  ]
} satisfies LessonContentFile;

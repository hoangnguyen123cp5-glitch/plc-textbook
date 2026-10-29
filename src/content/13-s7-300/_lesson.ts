import { LessonContentFile } from '@/types/content';

export default {
  "slug": "13-s7-300",
  "id": 13,
  "title": "SIMATIC S7-300 Overview",
  "description": "S7-300 platform, instruction set, and its role in existing factory installations",
  "course": "AUT207",
  "session": 1,
  "lab": "—",
  "clo": "G1",
  "module": 4,
  "topicOrder": [
    "s7-300-overview",
    "s7-300-instructions",
    "s7-300-applications"
  ],
  "overview": "For over two decades, the Siemens SIMATIC S7-300 was the undisputed workhorse of global industrial automation, installed in hundreds of thousands of manufacturing facilities, chemical plants, and automotive assembly lines worldwide. While superseded by the modern S7-1500 family, the S7-300 will remain operational in factories for decades to come due to high replacement costs and validated process certifications. This lesson provides students with the practical engineering foundation required to service legacy S7-300 installations: understanding the active backplane rack hardware architecture (PS, CPU, IM, SM, CP modules), programming in Statement List (STL / AWL) accumulator-based logic and classic STEP 7 V5.x, communicating over MPI and PROFIBUS-DP, and evaluating modernization strategies.",
  "objectives": [
    "Identify physical hardware components and slot allocation rules across S7-300 racks (PS, CPU, IM 360/361, SM, CP)",
    "Connect to legacy S7-300 PLCs using MPI (Multi-Point Interface) and PROFIBUS-DP programming adapters",
    "Navigate and maintain legacy projects using SIMATIC STEP 7 Classic (V5.6/V5.7) and TIA Portal migration bridges",
    "Read, analyze, and troubleshoot register-based Statement List (STL / AWL) instructions (L, T, A, AN, O, =, +I, -I, JC, JU)",
    "Analyze the internal CPU architecture: Accumulators (ACCU1, ACCU2), Address Registers (AR1, AR2), and the Status Word (RLO, STA, OR, OS, OV)",
    "Assess existing S7-300 factory installations to determine when to maintain versus when to schedule migration to S7-1500"
  ],
  "review": [
    "Detail the strict slot allocation rules across an S7-300 hardware rack. What modules must be placed in Slots 1, 2, and 3?",
    "Explain the mechanical and electrical role of the U-shaped active bus connector in an S7-300 backplane rack.",
    "Translate the following S7-300 STL instruction sequence into an equivalent Ladder Diagram rung: L MW10 / L 100 / >=I / = Q0.0.",
    "Explain the functional roles of Accumulator 1 (ACCU1), Accumulator 2 (ACCU2), and the RLO bit in Statement List execution.",
    "What is an MMC (Micro Memory Card) in the S7-300 platform, and why must it never be extracted while the CPU is powered?",
    "Why are hundreds of thousands of S7-300 PLCs still running in active production lines despite being superseded by the S7-1500?",
    "List three technical or operational factors that would compel a plant manager to migrate a legacy S7-300 control system to a modern S7-1500."
  ]
} satisfies LessonContentFile;

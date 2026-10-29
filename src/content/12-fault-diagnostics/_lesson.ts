import { LessonContentFile } from '@/types/content';

export default {
  "slug": "12-fault-diagnostics",
  "id": 12,
  "title": "Fault Diagnostic Tools",
  "description": "Online diagnostics, diagnostic buffer, watch and force tables, troubleshooting workflow",
  "course": "AUT207",
  "session": 1,
  "lab": "—",
  "clo": "G4",
  "module": 4,
  "topicOrder": [
    "diagnostic-overview",
    "diagnostic-buffer",
    "watch-force-tables"
  ],
  "overview": "Minimizing production downtime is the central metric of industrial plant engineering. When automated machinery trips, every minute of halted production represents thousands of dollars in lost revenue. This lesson teaches students how to utilize the comprehensive online diagnostic suite built into Siemens TIA Portal and the S7-1200 CPU. Students will explore online hardware topology views, front-panel LED decoding, reading and interpreting the non-volatile CPU Diagnostic Buffer, utilizing Error Organization Blocks (OB80, OB82, OB86, OB122) to prevent nuisance CPU stops, and utilizing Watch Tables and Force Tables for safe online signal intervention during commissioning and breakdown recovery.",
  "objectives": [
    "Navigate and interpret TIA Portal Online Diagnostics, Device View health indicators, and network topology status icons",
    "Decode front-panel CPU status LEDs (RUN/STOP, ERROR, MAINT, I/O indicators) into actionable troubleshooting priorities",
    "Open, read, filter, and interpret timestamped event entries in the internal CPU Diagnostic Buffer",
    "Identify root causes of hardware diagnostic interrupts (wire breaks, module unseated, auxiliary 24V missing) and software execution faults",
    "Deploy Error Organization Blocks (OB82 diagnostic alarm, OB86 rack fault, OB122 I/O access) to maintain CPU runtime during non-critical field faults",
    "Construct and utilize Watch Tables for non-invasive live monitoring and dynamic tag value modification",
    "Execute safe hardware overriding using the Force Table complying with industrial safety protocols (FORCE LED warning)"
  ],
  "review": [
    "Explain what each front-panel status LED (RUN/STOP, ERROR, MAINT) indicates on a Siemens S7-1200 CPU.",
    "What specific information does the CPU Diagnostic Buffer record, and how does it assist an engineer in finding the root cause of a sudden machine shutdown?",
    "Describe what happens to an S7-1200 CPU in RUN mode when a field wire on an analog input module breaks, both with and without OB82 present in the program.",
    "Explain the functional difference between using 'Modify' in a Watch Table versus using 'Force' in a Force Table.",
    "Why does the S7-1200 CPU illuminate a flashing yellow FORCE LED whenever any variable in the Force Table is active?",
    "How does the Cross-Reference List tool in TIA Portal prevent catastrophic double-coil allocation errors in ladder programs?",
    "Describe the recommended step-by-step procedure for performing an Online/Offline Program Comparison before downloading modifications to a running plant PLC."
  ]
} satisfies LessonContentFile;

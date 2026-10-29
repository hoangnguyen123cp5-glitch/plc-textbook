import { LessonContentFile } from '@/types/content';

export default {
  "slug": "14-system-upgrade",
  "id": 14,
  "title": "Upgrading Legacy PLC Systems",
  "description": "Migration paths from S7-200/S7-300, project conversion, risk planning",
  "course": "AUT207",
  "session": 2,
  "lab": "—",
  "clo": "G4",
  "module": 4,
  "topicOrder": [
    "why-upgrade",
    "migration-paths",
    "project-conversion",
    "upgrade-risks"
  ],
  "overview": "Industrial automation systems inevitably reach the end of their technological and economic lifecycles. Replacing legacy programmable controllers (such as the SIMATIC S7-200, S7-300, and S7-400) is a high-stakes capital engineering project requiring meticulous risk management, automated code conversion, physical field wiring adaptations, and commissioning protocols. A botched migration can halt factory production for days, costing millions of dollars. This lesson provides a structured engineering roadmap for executing seamless PLC migrations: defining business and technical justifications, identifying official Siemens hardware and software upgrade paths, utilizing the TIA Portal Migration Tool, converting legacy register-based logic (STL) into modern symbolic structured text (SCL), and developing comprehensive risk registers and rollback plans.",
  "objectives": [
    "Evaluate technical obsolescence, spare part costs, safety directives, and IIoT business drivers to justify a PLC modernization project",
    "Identify official Siemens hardware replacement matrices (S7-200 to S7-1200; S7-300/400 to S7-1500; ET 200M to ET 200MP/SP)",
    "Prepare legacy STEP 7 Classic projects (V5.5/V5.6) for migration, resolving library conflicts and code protections",
    "Execute automated project conversion using the TIA Portal Migration Tool and resolve unmigrated instruction warnings",
    "Translate legacy Statement List (STL) accumulator instructions and indirect pointer memory access into optimized SCL code",
    "Deploy physical front-connector wiring adapters to execute zero-rewiring hardware swaps on factory panels",
    "Draft a formal Commissioning Risk Register, Site Acceptance Test (SAT) protocol, and a 15-minute emergency rollback procedure"
  ],
  "review": [
    "List three critical business or technical reasons that justify migrating an aging S7-300 PLC system to an S7-1500.",
    "Describe the official Siemens migration paths for the SIMATIC S7-200 and SIMATIC S7-300/400 controller families.",
    "Why can the TIA Portal Migration Tool NOT convert S7-200 projects automatically, and what engineering workflow must be followed instead?",
    "Detail the 6-step engineering methodology for converting a STEP 7 Classic V5.5 project into TIA Portal.",
    "Explain why legacy S7-300 Statement List (STL) code utilizing indirect pointer registers (AR1/AR2) should be rewritten in Structured Control Language (SCL) for S7-1500.",
    "How do pre-fabricated front-connector wiring adapters eliminate the risk of field wiring mistakes during a hardware upgrade?",
    "Define what an 'Emergency Rollback Plan' is in the context of a factory PLC migration, and state what technical preparations are required to execute it in under 15 minutes."
  ]
} satisfies LessonContentFile;

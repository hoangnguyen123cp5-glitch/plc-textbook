import { LessonContentFile } from '@/types/content';

export default {
  "slug": "02-s7-1200-tia-portal",
  "id": 2,
  "title": "S7-1200 Hardware and TIA Portal",
  "description": "S7-1200 device family, program processing, field wiring, TIA Portal installation and use",
  "course": "AUT206",
  "session": 1,
  "lab": "Lab 1",
  "clo": "G1 — Explain the architecture, operating principles, and scan cycle of programmable logic controllers",
  "module": 1,
  "topicOrder": [
    "s7-1200-device",
    "program-processing",
    "field-wiring",
    "verify-wiring",
    "install-tia",
    "using-tia",
    "comms-setup"
  ],
  "overview": "This lesson provides an exhaustive engineering walkthrough of the Siemens SIMATIC S7-1200 compact automation platform and the TIA Portal (Totally Integrated Automation Portal) engineering suite. Students will master the mechanical assembly and thermal clearance guidelines for TS35 DIN-rail mounting, 24VDC control power distribution, electrical topologies for sinking vs sourcing digital inputs (DI), solid-state transistor vs electromechanical relay digital outputs (DO), PROFINET industrial Ethernet network commissioning, and software workflows in STEP 7 V19 for hardware configuration, code compilation, and online diagnostics.",
  "objectives": [
    "Identify and specify CPU variants (1211C, 1212C, 1214C, 1215C, 1217C), Signal Modules (SM), Communication Modules (CM), and Signal Boards (SB) in the S7-1200 family",
    "Mount and anchor S7-1200 controllers onto standard 35mm DIN rail with proper thermal ventilation clearances",
    "Wire 24VDC system power, digital input sinking/sourcing circuits (1M common), and relay/transistor digital outputs with flyback diode protection",
    "Verify field wiring using TIA Portal Watch Tables, Force Tables, and physical front-panel diagnostic LEDs",
    "Install and license TIA Portal V19, STEP 7 Professional, WinCC Advanced, and S7-PLCSIM using Automation License Manager",
    "Navigate Project View and Portal View, configure exact CPU hardware catalog numbers (MLFB), and assign static PROFINET IP addresses",
    "Configure PG/PC communication interfaces, establish online connectivity, and execute program downloads to real and virtual CPUs"
  ],
  "review": [
    "List the five CPU performance tiers in the SIMATIC S7-1200 family and explain the functional differences between Signal Boards (SB) and Signal Modules (SM).",
    "Describe the mechanical mounting and thermal clearance rules for mounting S7-1200 hardware onto a TS35 DIN rail in high-temperature industrial control panels.",
    "Explain the electrical distinction between Sinking and Sourcing digital input configurations on the S7-1200. What terminal connection determines this operating mode?",
    "Why must reverse-biased freewheeling flyback diodes be installed across DC inductive solenoid coils driven by S7-1200 transistor digital outputs?",
    "Compare the operational safety characteristics and runtime effects of using a Watch Table versus a Force Table in TIA Portal.",
    "Detail the step-by-step engineering workflow required to configure, compile, and download a new S7-1200 hardware project in TIA Portal V19.",
    "A technician cannot connect an engineering laptop to a newly unboxed S7-1200 CPU. Explain how to configure the laptop IP settings and use the Accessible Devices tool to establish communication."
  ]
} satisfies LessonContentFile;

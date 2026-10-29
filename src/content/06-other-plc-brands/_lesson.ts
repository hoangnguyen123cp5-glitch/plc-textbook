import { LessonContentFile } from '@/types/content';

export default {
  "slug": "06-other-plc-brands",
  "id": 6,
  "title": "PLC Platforms Beyond Siemens",
  "description": "Omron and Mitsubishi PLCs, input/output circuits, programming console, ladder diagram",
  "course": "AUT206",
  "session": 1,
  "lab": "—",
  "clo": "G1",
  "module": 2,
  "topicOrder": [
    "omron-mitsubishi",
    "io-circuits",
    "programming-console",
    "ladder-diagram",
    "common-instructions"
  ],
  "overview": "While Siemens holds a dominant share of European industrial automation, automation engineers operating across Asia, North America, and global manufacturing plants regularly encounter other major PLC brands. In Vietnamese and Southeast Asian manufacturing facilities, Japanese manufacturers Omron and Mitsubishi account for over 35% of all installed machinery. This lesson broadens the student's professional competency by examining Omron (CP-series, Sysmac) and Mitsubishi (FX-series, MELSEC iQ-F) hardware architectures, I/O circuit topologies (shared COM vs S/S terminals), handheld programming consoles, memory addressing conventions, and Ladder Diagram dialects, mapping each directly to familiar Siemens concepts.",
  "objectives": [
    "Identify and compare hardware architectures of Omron CP1E/CP1H/CP2E and Mitsubishi FX3U/FX5U PLCs against Siemens S7-1200",
    "Wire sinking and sourcing digital I/O circuits according to Japanese engineering standards (shared COM and S/S terminal jumpers)",
    "Operate handheld programming consoles (HPP) to inspect, force, and edit ladder rungs in field emergency situations",
    "Map bit and word addressing conventions across Siemens (%I, %Q, %M, DB), Omron (CIO, W, D), and Mitsubishi (X, Y, M, D)",
    "Translate timer and counter programming logic across TIA Portal, Omron CX-Programmer, and Mitsubishi GX Works",
    "Identify vendor-specific instructions including Master Control Relays (MC/MCR), jumps, and mandatory END delimiters"
  ],
  "review": [
    "Identify two compact CPU models from Omron and two from Mitsubishi, stating their respective engineering software programming suites.",
    "Explain how the 'S/S' terminal on a Mitsubishi FX3U PLC determines whether digital inputs operate in NPN Sinking or PNP Sourcing mode.",
    "Why are Japanese PLC digital transistor outputs predominantly NPN open-collector, and how must external loads be wired relative to the +24VDC rail?",
    "Explain the three operational modes (PROGRAM, MONITOR, RUN) found on handheld programming consoles such as the Omron CQM1-PRO01.",
    "Translate the following Siemens LAD addresses into their Mitsubishi FX equivalents: input %I0.0, output %Q0.0, internal marker %M10, data word %MW100.",
    "Explain why the address 'X8' is invalid on a Mitsubishi FX PLC controller.",
    "What is the operational function of the mandatory END instruction in Omron and Mitsubishi ladder programs, and what occurs if it is omitted?"
  ]
} satisfies LessonContentFile;

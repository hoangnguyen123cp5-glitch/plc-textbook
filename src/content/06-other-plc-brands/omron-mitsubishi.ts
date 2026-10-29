import { TopicContent } from '@/types/content';

export default {
  "slug": "omron-mitsubishi",
  "sourceRef": "5.1",
  "title": "Omron and Mitsubishi PLCs",
  "durationMinutes": 11,
  "summary": "In Vietnamese, Japanese, and Asian automotive, semiconductor, and consumer electronics manufacturing plants, Omron Corporation and Mitsubishi Electric represent the dominant control platforms along...",
  "body": [
    {
      "heading": "5.1 Omron and Mitsubishi PLCs",
      "text": "In Vietnamese, Japanese, and Asian automotive, semiconductor, and consumer electronics manufacturing plants, Omron Corporation and Mitsubishi Electric represent the dominant control platforms alongside Siemens. Omron's micro-PLC portfolio is spearheaded by the CP series (CP1E economical, CP1H high-speed, and CP2E modern IoT-ready), programmed via CX-Programmer within the CX-One engineering suite or modern Sysmac Studio. Mitsubishi Electric dominates with the MELSEC FX series: the legendary FX3U (the world's most widely cloned compact PLC) and the modern FX5U (MELSEC iQ-F series) featuring integrated Ethernet and high-speed motion control, programmed via GX Works2 or GX Works3. Both Japanese brands adopt a compact brick-chassis form factor with expandable right-side bus extensions. While core CPU execution loops (input scan -> logic execution -> output scan) and IEC 61131-3 compliance are universal, each manufacturer utilizes proprietary tag syntax, register boundaries, and engineering software paradigms that require systematic cross-referencing.",
      "keyPoints": [
        "Omron CP Series Architecture: Compact DIN-rail form factor; USB/Ethernet programming ports; expandable with CPM1A-style expansion I/O blocks",
        "Mitsubishi MELSEC FX Series: FX3U (RS422 mini-DIN programming port, modular expansion) and FX5U (embedded Ethernet, 4-axis 200kHz motion control)",
        "Power Supply Engineering: Both brands offer 100–240VAC line supply or 24VDC control supply models with integrated 24VDC auxiliary sensor supplies",
        "Engineering Software Suites: Omron CX-One (CX-Programmer) and Sysmac Studio; Mitsubishi GX Works2 (legacy FX) and GX Works3 (iQ-F and iQ-R)",
        "IEC 61131-3 Compliance: All three platforms support Ladder Diagram (LAD) and Structured Text (ST), but proprietary dialects persist",
        "Global Market Coexistence: A single factory floor frequently runs Siemens on packaging machines, Mitsubishi on CNC tooling, and Omron on robotics"
      ],
      "note": "When inspecting an unfamiliar Japanese machine, check the CPU model label carefully. Omron CP1H CPUs use standard USB Type-B cables, whereas older Mitsubishi FX3U controllers require an RS422-to-USB programming cable with specialized drivers."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/06-other-plc-brands/06-oth_carved_039.png",
      "caption": "Figure 6.1: Japanese Industrial PLCs: Omron CP1H and Mitsubishi MELSEC FX3U / FX5U Architecture"
    }
  ],
  "quiz": [
    {
      "q": "In Mitsubishi MELSEC FX PLCs, what addressing prefixes denote physical digital inputs and physical digital outputs?",
      "options": [
        "%I and %Q",
        "X for physical inputs and Y for physical outputs",
        "D and M",
        "IN and OUT"
      ],
      "answer": 1,
      "explain": "Mitsubishi uses octal addressing prefixed by X for inputs (X0, X1...) and Y for outputs (Y0, Y1...)."
    }
  ],
  "narration": {
    "vi": "Ngoài Siemens, hai hãng PLC phổ biến tại Việt Nam là Omron và Mitsubishi. Omron dòng CP1H và CP1L rất thông dụng trong máy móc vừa và nhỏ, phần mềm lập trình là CX-Programmer. Mitsubishi dòng FX3U và FX5U mạnh về tốc độ xử lý và tích hợp nhiều lệnh chuyên dụng, dùng phần mềm GX Works. Cả hai đều hỗ trợ LAD và có thể lập trình bằng console cầm tay mà không cần máy tính.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

import { TopicContent } from '@/types/content';

export default {
  "slug": "languages-structure",
  "sourceRef": "1.9",
  "title": "Programming Languages and Program Structure",
  "durationMinutes": 5,
  "summary": "The international standard IEC 61131-3 defines five standardized programming languages for industrial control systems.",
  "body": [
    {
      "heading": "1.9 IEC 61131-3 Programming Languages and Block Architecture",
      "text": "The international standard IEC 61131-3 defines five standardized programming languages for industrial control systems. The three most prevalent in industry originate from distinct engineering backgrounds: Ladder Diagram (LAD) emulates relay contact ladder schematics, offering immediate familiarity to industrial electricians and technicians; Function Block Diagram (FBD) portrays program logic as interconnected functional blocks, favored in safety interlock and process control loops; Structured Control Language (SCL / ST) is a high-level Pascal/C-like text language, exceptionally powerful for complex mathematical formulas, data array sorting, recipe indexing, and nested iterative loops. All three languages coexist seamlessly within the same TIA Portal project. Above the language syntax is the program block hierarchy: Organization Blocks (OB, handling cyclic and interrupt-driven execution), Functions (FC, stateless modular subroutines), and Function Blocks (FB, stateful subroutines backed by dedicated Instance Data Blocks).",
      "keyPoints": [
        "LAD (Ladder Diagram): Graphical relay-ladder representation; ideal for discrete digital interlocks and straightforward online troubleshooting",
        "FBD (Function Block Diagram): Graphical signal-flow block representation; ideal for analog signal conditioning and burner management systems",
        "SCL (Structured Control Language): Textual structured syntax; optimal for complex mathematical algorithms, data table manipulation, and loop operations",
        "IL (Instruction List) & SFC (Sequential Function Chart): The remaining IEC languages; SFC is particularly dominant for state-machine sequential processes",
        "Main Organization Block (OB1): The top-level entry routine called cyclically by the operating system in every scan",
        "FC vs FB Modular Architecture: Functions (FC) execute stateless logic; Function Blocks (FB) maintain static state memory within dedicated Instance DBs"
      ]
    }
  ],
  "figures": [
    {
      "src": "/images/slides/01-programmable-control/PLC_Slide_1__003.jpeg",
      "caption": "Figure 1.9: IEC 61131-3 Standardized Languages (LAD, FBD, SCL, STL, SFC) & Block Hierarchy"
    }
  ],
  "caseStudy": {
    "title": "Industrial Decision Matrix for the 5 Standardized IEC 61131-3 Languages",
    "context": "Complex automation systems rarely rely on a single programming language. Machine safety interlocks, start/stop motor circuits, and simple discrete sequencing are implemented in Ladder Diagram (LAD) for plant electrician accessibility; continuous analog signal conditioning and closed-loop PID control utilize Function Block Diagram (FBD); mathematical calculations, array sorting, and ASCII barcode string parsing are written in Structured Control Language (SCL / Structured Text); multi-stage sequential batch processes utilize Sequential Function Chart (SFC).",
    "hardware": [
      "LAD (Ladder Diagram): Graphical language modeled after electromechanical relay schematics",
      "FBD (Function Block Diagram): Block-oriented language modeled after logic gate diagrams",
      "SCL (Structured Control Language): High-level text language with Pascal/C-like syntax",
      "STL (Statement List): Low-level accumulator-based assembly language (legacy S7-300)",
      "SFC (Sequential Function Chart): State-transition graphical language for sequential workflows"
    ],
    "pitfall": "Attempting to implement complex math formulas or loops (FOR / WHILE) in Ladder Diagram results in dozens of convoluted rungs that are virtually impossible to debug compared to 5 clean lines of SCL."
  },
  "quiz": [
    {
      "q": "Which IEC 61131-3 programming language resembles high-level Pascal and is best suited for complex math and data algorithms?",
      "options": [
        "Ladder Diagram (LAD)",
        "Structured Text / SCL (Structured Control Language)",
        "Function Block Diagram (FBD)",
        "Instruction List (IL/STL)"
      ],
      "answer": 1,
      "explain": "Structured Text (SCL in Siemens) provides high-level algorithmic control (FOR loops, IF-THEN-ELSE, math arrays) ideal for complex data processing."
    }
  ],
  "narration": {
    "vi": "IEC 61131-3 chuẩn hóa năm ngôn ngữ lập trình PLC. Ladder Diagram giống sơ đồ rơ-le, phổ biến nhất ở châu Âu và Việt Nam. Function Block Diagram dùng khối kết nối, quen thuộc với kỹ sư điều khiển tự động. Structured Text giống Pascal, mạnh cho tính toán phức tạp. Instruction List là mã hợp ngữ, ít dùng trên S7-1200. Sequential Function Chart dùng cho quy trình tuần tự nhiều bước. Trong khóa học này chúng ta chủ yếu dùng Ladder và một ít SCL.",
    "durationSec": 38,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "IEC 61131-3 Programming Languages and Block Architecture",
      "points": [
        "LAD (Ladder Diagram): Graphical relay-ladder representation; ideal for discrete digital interlocks and straightforward online troubleshooting",
        "FBD (Function Block Diagram): Graphical signal-flow block representation; ideal for analog signal conditioning and burner management systems",
        "SCL (Structured Control Language): Textual structured syntax; optimal for complex mathematical algorithms, data table manipulation, and loop operations",
        "IL (Instruction List) & SFC (Sequential Function Chart): The remaining IEC languages; SFC is particularly dominant for state-machine sequential processes",
        "Main Organization Block (OB1): The top-level entry routine called cyclically by the operating system in every scan",
        "FC vs FB Modular Architecture: Functions (FC) execute stateless logic; Function Blocks (FB) maintain static state memory within dedicated Instance DBs"
      ],
      "explain": "The international standard IEC 61131-3 defines five standardized programming languages for industrial control systems. The three most prevalent in industry originate from distinct engineering backgrounds: Ladder Diagram (LAD) emulates relay contact ladder schematics, offering immediate familiarity to industrial electricians and technicians; Function Block Diagram (FBD) portrays program logic as interconnected functional blocks, favored in safety interlock and process control loops; Structured Control Language (SCL / ST) is a high-level Pascal/C-like text language, exceptionally powerful for complex mathematical formulas, data array sorting, recipe indexing, and nested iterative loops. All three languages coexist seamlessly within the same TIA Portal project. Above the language syntax is the program block hierarchy: Organization Blocks (OB, handling cyclic and interrupt-driven execution), Functions (FC, stateless modular subroutines), and Function Blocks (FB, stateful subroutines backed by dedicated Instance Data Blocks).",
      "figure": {
        "src": "/images/slides/01-programmable-control/PLC_Slide_1__003.jpeg",
        "caption": "Figure 1.9: IEC 61131-3 Standardized Languages (LAD, FBD, SCL, STL, SFC) & Block Hierarchy"
      }
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

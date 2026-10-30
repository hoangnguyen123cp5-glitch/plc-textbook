import { TopicContent } from '@/types/content';

export default {
  "slug": "s7-300-instructions",
  "sourceRef": "8.2",
  "title": "S7-300 Instruction Set",
  "durationMinutes": 12,
  "summary": "While the S7-300 supports Ladder Diagram (LAD) and Function Block Diagram (FBD), a vast proportion of legacy European machinery was programmed in Statement List (STL / AWL in German).",
  "body": [
    {
      "heading": "8.2 S7-300 Instruction Set",
      "text": "While the S7-300 supports Ladder Diagram (LAD) and Function Block Diagram (FBD), a vast proportion of legacy European machinery was programmed in Statement List (STL / AWL in German). STL is a low-level, machine-oriented language that operates on two 32-bit hardware data registers known as Accumulator 1 (ACCU1) and Accumulator 2 (ACCU2), coordinated by a 9-bit Status Word register. The fundamental data transfer sequence is Load and Transfer: 'L MW10' pushes the old content of ACCU1 into ACCU2 and loads the value of MW10 into ACCU1; 'T MW12' copies the content of ACCU1 into memory word MW12 without disturbing ACCU1. Binary logic operations evaluate into the Result of Logic Operation (RLO) bit of the Status Word: 'A I0.0' evaluates Boolean AND; 'AN I0.1' evaluates AND-NOT; 'O I0.2' evaluates Boolean OR; and '= Q0.0' assigns the evaluated RLO to the output. Mathematical instructions operate directly between accumulators: '+I' adds the 16-bit integer in ACCU2 to ACCU1 and stores the result in ACCU1. Program flow is controlled via unconditional jumps ('JU Target') or conditional jumps ('JC Target', executed only if RLO=1).",
      "keyPoints": [
        "Accumulator Architecture: ACCU1 (primary working register) and ACCU2 (secondary operand register) execute 16-bit and 32-bit arithmetic",
        "Load and Transfer Syntax: 'L [address]' loads value into ACCU1 (shifts old ACCU1 into ACCU2); 'T [address]' transfers ACCU1 to destination memory",
        "Status Word Bits: RLO (Result of Logic Operation), STA (Status of evaluated bit), OR (Or logic memory), OS (Overflow Stored), OV (Overflow)",
        "Boolean Mnemonics: A (AND), AN (AND-NOT), O (OR), ON (OR-NOT), X (XOR), = (Assign), S (Set), R (Reset)",
        "Arithmetic Mnemonics: +I (Add Int), -I (Subtract Int), *I (Multiply Int), /I (Divide Int); for floating point: +R, -R, *R, /R",
        "Conditional Flow Control: JC (Jump if RLO=1), JCN (Jump if RLO=0), JU (Jump Unconditional); jumps skip intermediate STL instructions",
        "Pointer Indirect Addressing: Address Registers (AR1, AR2) and pointer constants (e.g. P#DBX10.0) allow dynamic runtime memory indexing"
      ],
      "note": "When troubleshooting STL logic online, always monitor the RLO column! A rung in STL does not display colored power flow lines; instead, STEP 7 displays the instantaneous binary state of the evaluated contact (STA column) and the resulting running logic state (RLO column)."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/13-s7-300/PLC___Slide__016.png",
      "caption": "Figure 13.2: Statement List (STL / AWL) Register Operations: Accumulators ACCU1/ACCU2 & Status Word"
    }
  ],
  "quiz": [
    {
      "q": "In S7-300 Statement List (STL / AWL), what CPU registers hold numerical values for arithmetic operations?",
      "options": [
        "ACCU1 and ACCU2 (32-bit Accumulators)",
        "The Graphic Card Framebuffer",
        "The PROFINET PHY Chip",
        "The Flash Memory Card"
      ],
      "answer": 0,
      "explain": "S7-300 CPUs utilize two 32-bit accumulators (ACCU1 and ACCU2) with load (L) and transfer (T) operations for numerical manipulation."
    }
  ],
  "narration": {
    "vi": "S7-300 dùng ngôn ngữ STL — còn gọi là AWL trong tiếng Đức — gần giống ngôn ngữ assembly. Thanh ghi trung tâm là ACCU, dùng để chứa kết quả tính toán tạm thời. Lệnh L nạp giá trị vào ACCU, lệnh T chuyển ACCU ra vùng nhớ đích. Cú pháp tường minh, hiệu quả cao, nhưng đòi hỏi người lập trình hiểu rõ kiến trúc CPU hơn so với Ladder hay FBD.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "S7-300 Instruction Set",
      "points": [
        "Accumulator Architecture: ACCU1 (primary working register) and ACCU2 (secondary operand register) execute 16-bit and 32-bit arithmetic",
        "Load and Transfer Syntax: 'L [address]' loads value into ACCU1 (shifts old ACCU1 into ACCU2); 'T [address]' transfers ACCU1 to destination memory",
        "Status Word Bits: RLO (Result of Logic Operation), STA (Status of evaluated bit), OR (Or logic memory), OS (Overflow Stored), OV (Overflow)",
        "Boolean Mnemonics: A (AND), AN (AND-NOT), O (OR), ON (OR-NOT), X (XOR), = (Assign), S (Set), R (Reset)",
        "Arithmetic Mnemonics: +I (Add Int), -I (Subtract Int), *I (Multiply Int), /I (Divide Int); for floating point: +R, -R, *R, /R",
        "Conditional Flow Control: JC (Jump if RLO=1), JCN (Jump if RLO=0), JU (Jump Unconditional); jumps skip intermediate STL instructions",
        "Pointer Indirect Addressing: Address Registers (AR1, AR2) and pointer constants (e.g. P#DBX10.0) allow dynamic runtime memory indexing"
      ],
      "explain": "While the S7-300 supports Ladder Diagram (LAD) and Function Block Diagram (FBD), a vast proportion of legacy European machinery was programmed in Statement List (STL / AWL in German). STL is a low-level, machine-oriented language that operates on two 32-bit hardware data registers known as Accumulator 1 (ACCU1) and Accumulator 2 (ACCU2), coordinated by a 9-bit Status Word register. The fundamental data transfer sequence is Load and Transfer: 'L MW10' pushes the old content of ACCU1 into ACCU2 and loads the value of MW10 into ACCU1; 'T MW12' copies the content of ACCU1 into memory word MW12 without disturbing ACCU1. Binary logic operations evaluate into the Result of Logic Operation (RLO) bit of the Status Word: 'A I0.0' evaluates Boolean AND; 'AN I0.1' evaluates AND-NOT; 'O I0.2' evaluates Boolean OR; and '= Q0.0' assigns the evaluated RLO to the output. Mathematical instructions operate directly between accumulators: '+I' adds the 16-bit integer in ACCU2 to ACCU1 and stores the result in ACCU1. Program flow is controlled via unconditional jumps ('JU Target') or conditional jumps ('JC Target', executed only if RLO=1).",
      "figure": {
        "src": "/images/slides/13-s7-300/PLC___Slide__016.png",
        "caption": "Figure 13.2: Statement List (STL / AWL) Register Operations: Accumulators ACCU1/ACCU2 & Status Word"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

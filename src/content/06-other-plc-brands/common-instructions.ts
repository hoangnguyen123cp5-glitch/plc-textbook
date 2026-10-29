import { TopicContent } from '@/types/content';

export default {
  "slug": "common-instructions",
  "sourceRef": "5.5",
  "title": "Other Common Instructions",
  "durationMinutes": 9,
  "summary": "Beyond elementary contacts, coils, timers, and counters, every PLC manufacturer provides functional instruction blocks for data transfer, arithmetic, comparison, program jumps, and scan termination.",
  "body": [
    {
      "heading": "5.5 Other Common Instructions",
      "text": "Beyond elementary contacts, coils, timers, and counters, every PLC manufacturer provides functional instruction blocks for data transfer, arithmetic, comparison, program jumps, and scan termination. In Mitsubishi GX Works, instructions are enclosed in horizontal bracketed boxes: [MOV D10 D20] transfers the 16-bit contents of register D10 to D20; arithmetic operations appear as [+ D0 D2 D4] (adds D0 + D2 and writes the sum to D4); comparisons appear as inline contact blocks: [= D0 K100] conducts power flow when D0 equals 100. In Omron CX-Programmer, instructions use three-letter mnemonics with operands: MOV(021) 10 D100 copies channel 10 to data memory D100; CMP(020) compares two values and sets dedicated internal comparison flags (P_GT, P_EQ, P_LT). Both Japanese platforms implement Master Control Relay zones (Mitsubishi [MC N0 M100] / [MCR N0]; Omron MILH / MILR) to conditionally de-energize entire sections of ladder code. Crucially, both Mitsubishi and Omron require a mandatory END instruction at the termination of the ladder logic; without an END instruction, the CPU scan cannot return, triggering an immediate execution watchdog fault.",
      "keyPoints": [
        "Data Transfer (MOVE): Siemens MOVE ≡ Mitsubishi [MOV D0 D10] ≡ Omron MOV(021) D0 D10",
        "Inline Mathematical Blocks: Mitsubishi [+ D0 D2 D4] adds operands; Omron utilizes ADD(030) with carry flag management",
        "Master Control Relay (MC/MCR): De-energizes an entire block of ladder rungs without evaluating individual contact conditions",
        "Conditional Program Jumps: Mitsubishi [CJ P1] skips rungs directly to label P1; Omron JMP(004) / JME(005) skips networks to minimize scan time",
        "Subroutine Execution: Mitsubishi [CALL P10] -> [SRET] ≡ Omron SBS(091) -> SBN(092) -> RET(093); modularizes repetitive routines",
        "Mandatory END Instruction: Mitsubishi [FEND] / [END] and Omron END(001) must terminate the ladder program; missing END trips watchdog error",
        "Pulse Execution Prefix: In Mitsubishi, prefixing an instruction with 'P' (e.g. [MOVP D0 D10]) causes it to execute strictly on a rising edge"
      ],
      "note": "Never omit the END instruction when writing ladder logic for Mitsubishi or Omron controllers! Unlike Siemens TIA Portal where the cyclic scan boundary is managed transparently by the operating system, a missing END statement in GX Works will trigger an immediate CPU execution fault (error code 6400)."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/06-other-plc-brands/06-oth_carved_038.png",
      "caption": "Figure 6.5: Vendor-Specific Logic: MOV Blocks, Master Control Relays (MC/MCR) & Mandatory END Rung"
    }
  ],
  "quiz": [
    {
      "q": "What is the function of a Master Control Relay (MC / MCR) zone in PLC programming?",
      "options": [
        "To de-energize and inhibit an entire block of rungs simultaneously when a master condition is FALSE",
        "To measure CPU temperature",
        "To communicate with SCADA",
        "To reset the timer prescaler"
      ],
      "answer": 0,
      "explain": "MCR zones permit a single master contact to disable all non-retentive coils inside the zone, functioning as an operational sub-master."
    }
  ],
  "narration": {
    "vi": "Dù mỗi hãng có ngôn ngữ riêng, các lệnh cốt lõi đều tương đương nhau. MOV chuyển dữ liệu từ nguồn sang đích. ADD và SUB thực hiện cộng và trừ số nguyên. CMP so sánh hai giá trị và đặt cờ trạng thái. JUMP nhảy đến một nhãn trong chương trình, thường dùng để bỏ qua khối lệnh khi điều kiện không thỏa. Khi chuyển từ hãng này sang hãng khác, hãy lập bảng đối chiếu lệnh để tránh nhầm lẫn.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

import { TopicContent } from '@/types/content';

export default {
  "slug": "ladder-diagram",
  "sourceRef": "5.4",
  "title": "Ladder Diagram Programming",
  "durationMinutes": 11,
  "summary": "While all three manufacturers comply with the overarching IEC 61131-3 standard for Ladder Diagram, each brand retains distinct syntactic conventions, address notations, and timer/counter mechanisms.",
  "body": [
    {
      "heading": "5.4 Ladder Diagram Programming",
      "text": "While all three manufacturers comply with the overarching IEC 61131-3 standard for Ladder Diagram, each brand retains distinct syntactic conventions, address notations, and timer/counter mechanisms. In address notation: Siemens uses IEC absolute syntax (%I0.0, %Q0.0, %MW10); Mitsubishi uses single-letter octal/decimal identifiers (Inputs: X0, X1... X7, X10; Outputs: Y0, Y1... Y7, Y10; Bit Memory: M0–M1023; Data Registers: D0–D8000); Omron uses channel-and-bit decimal numbers (Inputs: 0.00 to 0.15; Outputs: 100.00 to 100.15; Work Bits: W0.00; Data Memories: D0). Timer execution differs fundamentally: Siemens utilizes IEC function blocks with millisecond TIME literals (T#5s); Mitsubishi uses timer coils (e.g. T0 K50, where K50 represents 50 x 100ms = 5.0 seconds); Omron uses BCD/binary timer blocks (TIM 000 #0050, representing 5.0 seconds). Counter directions also vary: Siemens CTU counts up; Mitsubishi C0 counts up toward preset K-values; Omron CNT is historically a down-counter that decrements toward zero from a preset value.",
      "keyPoints": [
        "Digital Input Address Syntax: Siemens %I0.0 ≡ Mitsubishi X0 (octal numbering) ≡ Omron 0.00 (channel.bit)",
        "Digital Output Address Syntax: Siemens %Q0.0 ≡ Mitsubishi Y0 (octal numbering) ≡ Omron 100.00 (channel.bit)",
        "Internal Register Syntax: Siemens %MW10 / DB1.DBD0 ≡ Mitsubishi D0 (16-bit) ≡ Omron D0 / DM0",
        "Mitsubishi Timer Notation: T0 K50 (T0 = timer identifier, K50 = constant decimal 50 ticks of 100ms = 5.0 seconds)",
        "Omron Timer Notation: TIM 000 #0050 (TIM 000 = timer 0, #0050 = 5.0 seconds in BCD format)",
        "Counter Logic Divergence: Siemens CTU counts up; Mitsubishi C counts up; vintage Omron CNT decrements downward to zero",
        "Latching Coils: Siemens (S)/(R) ≡ Mitsubishi [SET Y0] / [RST Y0] ≡ Omron [SET 100.00] / [RSET 100.00]"
      ],
      "note": "Pay close attention to Mitsubishi FX octal addressing! Inputs and outputs are numbered in base-8: X0, X1, X2, X3, X4, X5, X6, X7, followed immediately by X10! Addresses X8, X9, Y8, and Y9 do not exist; entering 'X8' will produce an immediate syntax error in GX Works."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/06-other-plc-brands/06-oth_carved_040.png",
      "caption": "Figure 6.4: Ladder Diagram Syntax & Address Cross-Reference: Siemens vs Omron vs Mitsubishi"
    }
  ],
  "quiz": [
    {
      "q": "What is mandatory at the end of every user program in Mitsubishi FX ladder programming?",
      "options": [
        "An END instruction rung",
        "A STOP coil",
        "A RESET block",
        "A comment line"
      ],
      "answer": 0,
      "explain": "The CPU requires the END instruction to mark the termination of cyclic code execution and initiate the I/O refresh phase."
    }
  ],
  "narration": {
    "vi": "LAD của Omron và Mitsubishi về cơ bản giống Siemens — vẫn là các tiếp điểm và cuộn dây trên nhánh ngang. Tuy nhiên có một số điểm khác biệt. Omron đặt cuộn dây OUT ở cuối mỗi nhánh tương tự Siemens, nhưng địa chỉ dùng ký hiệu riêng như 0.00 hay W0.00. Mitsubishi dùng ký hiệu X cho input, Y cho output và M cho bit nội. Hiểu được cú pháp địa chỉ của từng hãng là bước đầu tiên khi làm việc với PLC mới.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Ladder Diagram Programming",
      "points": [
        "Digital Input Address Syntax: Siemens %I0.0 ≡ Mitsubishi X0 (octal numbering) ≡ Omron 0.00 (channel.bit)",
        "Digital Output Address Syntax: Siemens %Q0.0 ≡ Mitsubishi Y0 (octal numbering) ≡ Omron 100.00 (channel.bit)",
        "Internal Register Syntax: Siemens %MW10 / DB1.DBD0 ≡ Mitsubishi D0 (16-bit) ≡ Omron D0 / DM0",
        "Mitsubishi Timer Notation: T0 K50 (T0 = timer identifier, K50 = constant decimal 50 ticks of 100ms = 5.0 seconds)",
        "Omron Timer Notation: TIM 000 #0050 (TIM 000 = timer 0, #0050 = 5.0 seconds in BCD format)",
        "Counter Logic Divergence: Siemens CTU counts up; Mitsubishi C counts up; vintage Omron CNT decrements downward to zero",
        "Latching Coils: Siemens (S)/(R) ≡ Mitsubishi [SET Y0] / [RST Y0] ≡ Omron [SET 100.00] / [RSET 100.00]"
      ],
      "explain": "While all three manufacturers comply with the overarching IEC 61131-3 standard for Ladder Diagram, each brand retains distinct syntactic conventions, address notations, and timer/counter mechanisms. In address notation: Siemens uses IEC absolute syntax (%I0.0, %Q0.0, %MW10); Mitsubishi uses single-letter octal/decimal identifiers (Inputs: X0, X1... X7, X10; Outputs: Y0, Y1... Y7, Y10; Bit Memory: M0–M1023; Data Registers: D0–D8000); Omron uses channel-and-bit decimal numbers (Inputs: 0.00 to 0.15; Outputs: 100.00 to 100.15; Work Bits: W0.00; Data Memories: D0). Timer execution differs fundamentally: Siemens utilizes IEC function blocks with millisecond TIME literals (T#5s); Mitsubishi uses timer coils (e.g. T0 K50, where K50 represents 50 x 100ms = 5.0 seconds); Omron uses BCD/binary timer blocks (TIM 000 #0050, representing 5.0 seconds). Counter directions also vary: Siemens CTU counts up; Mitsubishi C0 counts up toward preset K-values; Omron CNT is historically a down-counter that decrements toward zero from a preset value.",
      "figure": {
        "src": "/images/slides/06-other-plc-brands/06-oth_carved_040.png",
        "caption": "Figure 6.4: Ladder Diagram Syntax & Address Cross-Reference: Siemens vs Omron vs Mitsubishi"
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

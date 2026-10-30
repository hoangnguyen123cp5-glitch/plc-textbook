import { TopicContent } from '@/types/content';

export default {
  "slug": "set-reset",
  "sourceRef": "2.2",
  "title": "Set / Reset Instructions for Contacts",
  "durationMinutes": 10,
  "summary": "Standard output coils are momentary: when rung conditions become FALSE, the coil immediately turns OFF.",
  "body": [
    {
      "heading": "From Seal-In Latching to Set / Reset Coils",
      "text": "A standard output coil is momentary: the instant rung conditions become FALSE, the coil turns OFF, which is why the previous topic's seal-in circuit needs an auxiliary feedback contact just to hold itself on. Set (---(S)---) and Reset (---(R)---) coils remove that need. When power flow reaches a Set coil, the target memory bit latches to TRUE and stays TRUE even after the rung's own power flow is removed; the bit only returns to FALSE when a separate rung carrying a Reset coil for that same address is energized. Because the two coils can live in entirely different networks, and the CPU evaluates networks sequentially from top to bottom, whichever one executes last within a given scan determines the bit's final state if both conditions happen to be true in the same scan — a last-write-wins outcome that is easy to overlook when Set and Reset rungs are far apart in the program.",
      "keyPoints": [
        "Set coil (---(S)---): latches the bit to 1 on a single TRUE scan, independent of later rung conditions",
        "Reset coil (---(R)---): unlatches the bit to 0 on a single TRUE scan",
        "Set and Reset for the same bit can live in separate, distant networks",
        "If both conditions are TRUE in the same scan, the network executed later wins",
        "Keep Set/Reset pairs for one bit close together, or replace them with one SR/RS block"
      ],
      "note": "Scattering Set and Reset coils for the same bit across distant parts of the program makes online debugging difficult, because the bit's behavior depends on network order rather than on anything visible at either rung. A consolidated SR or RS function block removes the ambiguity."
    },
    {
      "heading": "SR / RS Flip-Flop Blocks and Safety Dominance",
      "text": "TIA Portal also offers the Set/Reset conflict as a single, explicit function block rather than two separate coils. The SR flip-flop block is Set-dominant: when both its S and R1 inputs are TRUE in the same scan, the Set input wins and output Q stays latched TRUE. The RS flip-flop block is Reset-dominant: when both its S1 and R inputs are TRUE in the same scan, the Reset input wins and Q is forced FALSE. The choice between them is not cosmetic. A Start condition and a Stop condition should never both demand opposite outcomes at once, but if they ever do, through a wiring fault or a logic error, a safety-critical stop circuit must resolve that conflict toward the de-energized, safe state — exactly what a Reset-dominant RS block guarantees and a Set-dominant SR block does not.",
      "keyPoints": [
        "SR block: Set-dominant. S and R1 both TRUE -> Q stays TRUE",
        "RS block: Reset-dominant. S1 and R both TRUE -> Q is forced FALSE",
        "Any stop, fault, or safety circuit must resolve ties toward OFF: use RS, never SR",
        "Edge instructions (P_TRIG / N_TRIG) ahead of S/R inputs prevent re-triggering on a held signal"
      ],
      "note": "A Set-dominant SR block in a stop circuit can leave a machine running even while the Stop button is pressed, if Start happens to be held at the same instant. Always use RS for anything safety-related."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/03-binary-operations/03-bin_carved_046.png",
      "caption": "Figure 3.2: Set (S) and Reset (R) Dominant Latch Instructions and RS/SR Flip-Flop Blocks"
    }
  ],
  "caseStudy": {
    "title": "Set-Dominant Logic in a Stop Circuit: a Near-Miss",
    "context": "A commissioning engineer builds a hopper agitator control using an SR (Set-dominant) flip-flop block: Start pulses the S input, Stop pulses the R1 input. During testing, a sticking Start pushbutton stays pressed while an operator presses Stop to clear a jam. Because the block is Set-dominant, S being held TRUE overrides the Stop pulse on R1, and the agitator keeps running with an operator's hand still near the hopper opening. The fix is to replace the SR block with an RS block, wiring the same Start signal to S1 and Stop to R, so that a held Start can never override a Stop command.",
    "hardware": [
      "SR block (Set-dominant): S, R1 inputs — used here for Start/Stop, incorrectly",
      "RS block (Reset-dominant): S1, R inputs — the correct choice for any stop circuit",
      "Sticking pushbutton: mechanical contacts can stay closed longer than the operator intends",
      "Fix: swap the function block, keep the same field wiring — Start to S1, Stop to R"
    ],
    "pitfall": "Picking SR over RS out of habit, or because it was first in the instruction list. For any instruction that includes a stop, fault-reset, or interlock condition, default to Reset-dominant and change that choice only for a documented reason."
  },
  "quiz": [
    {
      "q": "What is the key characteristic of a Reset-Dominant Latch (RS flip-flop) instruction?",
      "options": [
        "If both Set (S) and Reset (R1) are TRUE simultaneously, the output Q resolves to FALSE (0)",
        "The output remains permanently ON",
        "It only works with analog tags",
        "It resets the CPU hardware clock"
      ],
      "answer": 0,
      "explain": "In safety-critical design, Reset Dominance ensures that an active STOP/RESET command always overrides a START command if both trigger together."
    }
  ],
  "narration": {
    "vi": "Lệnh SET và RESET hoạt động như một flip-flop nhớ trạng thái. Khi tín hiệu SET kích lên một lần, bit đầu ra sẽ giữ ở mức một dù tín hiệu SET đã tắt. Chỉ khi RESET được kích thì bit mới về không. Đây là cách điều khiển mô-tơ chuẩn trong nhà máy: nút Start SET cuộn dây khởi động, nút Stop hoặc bảo vệ quá tải RESET lại. Tránh SET và RESET cùng cuộn dây ở hai nhánh song song vì dễ xung đột.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "From Seal-In Latching to Set / Reset Coils",
      "points": [
        "Set coil (---(S)---): latches the bit to 1 on a single TRUE scan, independent of later rung conditions",
        "Reset coil (---(R)---): unlatches the bit to 0 on a single TRUE scan",
        "Set and Reset for the same bit can live in separate, distant networks",
        "If both conditions are TRUE in the same scan, the network executed later wins",
        "Keep Set/Reset pairs for one bit close together, or replace them with one SR/RS block"
      ],
      "explain": "A standard output coil is momentary: the instant rung conditions become FALSE, the coil turns OFF, which is why the previous topic's seal-in circuit needs an auxiliary feedback contact just to hold itself on. Set (---(S)---) and Reset (---(R)---) coils remove that need. When power flow reaches a Set coil, the target memory bit latches to TRUE and stays TRUE even after the rung's own power flow is removed; the bit only returns to FALSE when a separate rung carrying a Reset coil for that same address is energized. Because the two coils can live in entirely different networks, and the CPU evaluates networks sequentially from top to bottom, whichever one executes last within a given scan determines the bit's final state if both conditions happen to be true in the same scan — a last-write-wins outcome that is easy to overlook when Set and Reset rungs are far apart in the program."
    },
    {
      "kind": "concept",
      "title": "SR / RS Flip-Flop Blocks and Safety Dominance",
      "points": [
        "SR block: Set-dominant. S and R1 both TRUE -> Q stays TRUE",
        "RS block: Reset-dominant. S1 and R both TRUE -> Q is forced FALSE",
        "Any stop, fault, or safety circuit must resolve ties toward OFF: use RS, never SR",
        "Edge instructions (P_TRIG / N_TRIG) ahead of S/R inputs prevent re-triggering on a held signal"
      ],
      "explain": "TIA Portal also offers the Set/Reset conflict as a single, explicit function block rather than two separate coils. The SR flip-flop block is Set-dominant: when both its S and R1 inputs are TRUE in the same scan, the Set input wins and output Q stays latched TRUE. The RS flip-flop block is Reset-dominant: when both its S1 and R inputs are TRUE in the same scan, the Reset input wins and Q is forced FALSE. The choice between them is not cosmetic. A Start condition and a Stop condition should never both demand opposite outcomes at once, but if they ever do, through a wiring fault or a logic error, a safety-critical stop circuit must resolve that conflict toward the de-energized, safe state — exactly what a Reset-dominant RS block guarantees and a Set-dominant SR block does not.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_046.png",
        "caption": "Figure 3.2: Set (S) and Reset (R) Dominant Latch Instructions and RS/SR Flip-Flop Blocks"
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

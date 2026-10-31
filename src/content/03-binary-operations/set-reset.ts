import { TopicContent } from '@/types/content';

export default {
  "slug": "set-reset",
  "sourceRef": "2.2",
  "title": "Set / Reset Instructions for Contacts",
  "durationMinutes": 8,
  "summary": "Standard output coils are momentary: when rung conditions become FALSE, the coil immediately turns OFF.",
  "body": [
    {
      "heading": "2.2 Set / Reset Instructions for Contacts",
      "text": "Standard output coils are momentary: when rung conditions become FALSE, the coil immediately turns OFF. In industrial automation, maintaining a machine state across cycles requires memory latching. Two primary methods achieve this: the traditional Seal-In Latching circuit (where an auxiliary NO contact of output coil %Q0.0 is wired in parallel with the momentary Start pushbutton), and dedicated Set (---(S)---) and Reset (---(R)---) latching instructions. When power flow reaches a Set coil, the designated memory bit is latched to TRUE (1) and remains locked even after rung power flow is removed. The bit can only be restored to FALSE (0) when a separate rung with a Reset coil is energized. Because a PLC executes networks sequentially, if both Set and Reset conditions for the same bit are active simultaneously, the 'Last-Write Wins' rule determines the outcome. Siemens provides dedicated bistable function blocks: the SR Flip-Flop (Set-dominant, where Set overrides Reset if both inputs are TRUE) and the RS Flip-Flop (Reset-dominant, where Reset overrides Set for enhanced machine safety).",
      "keyPoints": [
        "Seal-In Latch Topology: Traditional 3-wire motor circuit using a momentary start pushbutton in parallel with %Q0.0 auxiliary feedback contact",
        "Set Coil (---(S)---): Latches the targeted boolean bit to logic 1 on a single TRUE scan; persists independently of future rung conditions",
        "Reset Coil (---(R)---): Unlatches the targeted boolean bit to logic 0 on a single TRUE scan, clearing previous latched states",
        "SR Flip-Flop Block (Set-Dominant): If both S and R1 inputs are TRUE simultaneously, the output Q remains latched TRUE (Set takes priority)",
        "RS Flip-Flop Block (Reset-Dominant): If both S1 and R inputs are TRUE simultaneously, the output Q is forced FALSE (Reset takes priority)",
        "Safety Engineering Standard: In safety-critical stop circuits, Reset-dominant (RS) logic or hardwired de-energization must always be utilized",
        "Edge Detection Integration: Triggering Set/Reset coils through one-shot edge instructions (P_TRIG / N_TRIG) prevents perpetual coil overwrite"
      ],
      "note": "Avoid scattering multiple Set and Reset coils for the same bit address across different program blocks or distant networks. Uncoordinated S/R coils make online debugging notoriously difficult; prefer consolidated RS blocks or state machine registers."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/03-binary-operations/03-bin_carved_046.png",
      "caption": "Figure 3.2: Set (S) and Reset (R) Dominant Latch Instructions and RS/SR Flip-Flop Blocks"
    }
  ],
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
      "title": "Set / Reset Instructions for Contacts",
      "points": [
        "Seal-In Latch Topology: Traditional 3-wire motor circuit using a momentary start pushbutton in parallel with %Q0.0 auxiliary feedback contact",
        "Set Coil (---(S)---): Latches the targeted boolean bit to logic 1 on a single TRUE scan; persists independently of future rung conditions",
        "Reset Coil (---(R)---): Unlatches the targeted boolean bit to logic 0 on a single TRUE scan, clearing previous latched states",
        "SR Flip-Flop Block (Set-Dominant): If both S and R1 inputs are TRUE simultaneously, the output Q remains latched TRUE (Set takes priority)",
        "RS Flip-Flop Block (Reset-Dominant): If both S1 and R inputs are TRUE simultaneously, the output Q is forced FALSE (Reset takes priority)",
        "Safety Engineering Standard: In safety-critical stop circuits, Reset-dominant (RS) logic or hardwired de-energization must always be utilized",
        "Edge Detection Integration: Triggering Set/Reset coils through one-shot edge instructions (P_TRIG / N_TRIG) prevents perpetual coil overwrite"
      ],
      "explain": "Standard output coils are momentary: when rung conditions become FALSE, the coil immediately turns OFF. In industrial automation, maintaining a machine state across cycles requires memory latching. Two primary methods achieve this: the traditional Seal-In Latching circuit (where an auxiliary NO contact of output coil %Q0.0 is wired in parallel with the momentary Start pushbutton), and dedicated Set (---(S)---) and Reset (---(R)---) latching instructions. When power flow reaches a Set coil, the designated memory bit is latched to TRUE (1) and remains locked even after rung power flow is removed. The bit can only be restored to FALSE (0) when a separate rung with a Reset coil is energized. Because a PLC executes networks sequentially, if both Set and Reset conditions for the same bit are active simultaneously, the 'Last-Write Wins' rule determines the outcome. Siemens provides dedicated bistable function blocks: the SR Flip-Flop (Set-dominant, where Set overrides Reset if both inputs are TRUE) and the RS Flip-Flop (Reset-dominant, where Reset overrides Set for enhanced machine safety).",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_046.png",
        "caption": "Figure 3.2: Set (S) and Reset (R) Dominant Latch Instructions and RS/SR Flip-Flop Blocks"
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

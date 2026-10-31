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
      "title": "Single-Bit Latching: Set (S) and Reset (R)",
      "points": [
        "Parameters IN (Bool condition) and OUT (Bool target bit) control single-bit latching",
        "When S (Set) is activated (RLO = 1), the bit at OUT is written to 1 and latched",
        "When R (Reset) is activated (RLO = 1), the bit at OUT is cleared back to 0",
        "When S or R is not activated (RLO = 0), the current state of OUT stays unchanged"
      ],
      "explain": "Unlike a standard output coil that drops to 0 as soon as rung continuity stops, Set and Reset coils only modify the target bit when their rung evaluates to TRUE. This conditional behavior allows a momentary start pulse to lock a machine state bit ON across scans until a separate stop condition energizes the matching Reset coil.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_007.jpg",
        "caption": "LAD Set -(S)- and Reset -(R)- coils alongside FBD Set (S) and Reset (R) boxes with IN and OUT"
      }
    },
    {
      "kind": "concept",
      "title": "Bit-Field Latching: SET_BF and RESET_BF",
      "points": [
        "SET_BF writes logic 1 to n consecutive bits starting at the OUT bit address",
        "RESET_BF writes logic 0 to n consecutive bits starting at the OUT bit address",
        "Parameter n (Constant) specifies the exact count of contiguous bits to modify",
        "OUT points to the starting Boolean bit or array element, such as #MyArray[3]"
      ],
      "explain": "In multi-step sequence control or alarm annunciation, engineers often need to clear or initialize an entire group of step flags at once. Instead of placing dozens of individual Reset coils in parallel, a single RESET_BF instruction clears a contiguous block of n Boolean bits in one scan whenever the master reset condition is triggered.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_008.jpg",
        "caption": "LAD and FBD representations of SET_BF and RESET_BF instructions with bit count n and target OUT"
      }
    },
    {
      "kind": "concept",
      "title": "Bistable Flip-Flops: RS and SR Dominance",
      "points": [
        "RS and SR blocks combine Set and Reset inputs into a single bistable instruction",
        "In TIA Portal, the suffix '1' on input S1 or R1 marks the dominant input pin",
        "RS block (Set-dominant): if R = 1 and S1 = 1 simultaneously, OUT and Q equal 1",
        "SR block (Reset-dominant): if S = 1 and R1 = 1 simultaneously, OUT and Q equal 0"
      ],
      "explain": "When separate S and R coils are placed in different networks, whichever network executes later in the OB1 scan wins when both inputs are active. Consolidating the latch into an SR or RS flip-flop block makes dominance explicit in a single network and prevents accidental last-rung-wins bugs during maintenance."
    },
    {
      "kind": "diagram",
      "title": "Comparing RS and SR Flip-Flop Blocks",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_009.jpg",
        "caption": "Bistable flip-flop function blocks: Set-dominant RS (R, S1, Q) and Reset-dominant SR (S, R1, Q)"
      },
      "explain": "Inspect the lower input pin on each block: RS labels its lower pin S1 (Set-dominant when both R and S1 are 1), whereas SR labels its lower pin R1 (Reset-dominant when both S and R1 are 1). For motor stop and safety interlocks, ensure the stop signal drives the dominant reset input."
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

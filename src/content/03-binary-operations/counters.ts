import { TopicContent } from '@/types/content';

export default {
  "slug": "counters",
  "sourceRef": "2.4",
  "title": "Counters (CTU, CTD, CTUD)",
  "durationMinutes": 12,
  "summary": "Counting discrete occurrences—such as parts traversing a conveyor, machine cycles, or batch quantities—is implemented via standardized IEC 61131-3 counter function blocks: CTU (Count Up), CTD (Coun...",
  "body": [
    {
      "heading": "2.4 Counters (CTU, CTD, CTUD)",
      "text": "Counting discrete occurrences—such as parts traversing a conveyor, machine cycles, or batch quantities—is implemented via standardized IEC 61131-3 counter function blocks: CTU (Count Up), CTD (Count Down), and CTUD (Bidirectional Count Up/Down). Each counter requires an Instance Data Block to store current count value (CV) and status flags. The CTU block monitors its count input (CU): on every rising edge (FALSE to TRUE transition), the current count value (CV) increments by 1. When CV becomes greater than or equal to the preset value (PV), the output flag (Q) evaluates TRUE. Asserting the Reset (R) input instantly forces CV to 0 and clears Q. The CTD block decrements CV on each rising edge of CD, initializing CV to PV when the Load (LD) input is pulsed; output Q turns TRUE when CV decrements to <= 0. The CTUD block combines both mechanisms with independent CU and CD clock inputs, separate QU and QD outputs, and simultaneous Reset and Load controls, making it ideal for tracking bidirectional storage buffers or parking garage capacity.",
      "keyPoints": [
        "Edge-Triggered Clocking: Counters increment/decrement strictly on the rising edge of input pulses; steady-state TRUE inputs do not cause repeated counts",
        "Instance Data Block Architecture: Dedicated DB retains current count value (CV) across power interruptions if configured with retentive memory",
        "Data Type Flexibility: Supported integer types include SInt (8-bit, max 127), Int (16-bit, max 32,767), and DInt (32-bit, max 2.14 billion counts)",
        "CTU (Count Up): Increments CV on CU rising edge; Q activates when CV >= PV; Reset input (R) takes priority and forces CV = 0",
        "CTD (Count Down): Decrements CV on CD rising edge; Q activates when CV <= 0; Load input (LD) loads preset PV into CV",
        "CTUD (Bidirectional): Independent CU (up) and CD (down) inputs; QU flags over-target while QD flags empty buffer condition",
        "Counting Speed Limitation: Software IEC counters in OB1 are limited by the PLC scan cycle time (max reliable input frequency ~50 Hz); higher frequencies require hardware High-Speed Counters (HSC)"
      ],
      "note": "If an optical sensor generates pulses narrower than the PLC scan cycle (e.g. small parts passing rapidly on a conveyor), an IEC counter in OB1 will miss counts! Use hardware High-Speed Counter (HSC) inputs or pulse-stretching sensor amplifiers for high-speed tracking."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/03-binary-operations/03-bin_carved_022.png",
      "caption": "Figure 3.4: IEC Counter Function Blocks: CTU (Count Up), CTD (Count Down), and CTUD Execution"
    }
  ],
  "quiz": [
    {
      "q": "What triggers an IEC CTU (Count Up) counter block to increment its Current Value (CV)?",
      "options": [
        "A continuous HIGH level on CU",
        "A rising edge (0 to 1 transition) on input CU",
        "A falling edge (1 to 0 transition) on CU",
        "A CPU scan cycle tick"
      ],
      "answer": 1,
      "explain": "IEC counters are edge-triggered: they increment only when a positive 0-to-1 rising edge occurs on the count input."
    }
  ],
  "narration": {
    "vi": "Bộ đếm trong S7-1200 gồm CTU đếm lên, CTD đếm xuống và CTUD đếm cả hai chiều. Mỗi xung cạnh lên ở đầu vào CU làm giá trị CV tăng thêm một. Khi CV đạt đến PV, đầu ra Q lên mức một. Đầu vào R dùng để reset về không. Counters thường dùng để đếm sản phẩm trên băng tải, đếm số chai đã đóng nắp hoặc kiểm soát số vòng quay của trục máy.",
    "durationSec": 28,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Counters (CTU, CTD, CTUD)",
      "points": [
        "Edge-Triggered Clocking: Counters increment/decrement strictly on the rising edge of input pulses; steady-state TRUE inputs do not cause repeated counts",
        "Instance Data Block Architecture: Dedicated DB retains current count value (CV) across power interruptions if configured with retentive memory",
        "Data Type Flexibility: Supported integer types include SInt (8-bit, max 127), Int (16-bit, max 32,767), and DInt (32-bit, max 2.14 billion counts)",
        "CTU (Count Up): Increments CV on CU rising edge; Q activates when CV >= PV; Reset input (R) takes priority and forces CV = 0",
        "CTD (Count Down): Decrements CV on CD rising edge; Q activates when CV <= 0; Load input (LD) loads preset PV into CV",
        "CTUD (Bidirectional): Independent CU (up) and CD (down) inputs; QU flags over-target while QD flags empty buffer condition",
        "Counting Speed Limitation: Software IEC counters in OB1 are limited by the PLC scan cycle time (max reliable input frequency ~50 Hz); higher frequencies require hardware High-Speed Counters (HSC)"
      ],
      "explain": "Counting discrete occurrences—such as parts traversing a conveyor, machine cycles, or batch quantities—is implemented via standardized IEC 61131-3 counter function blocks: CTU (Count Up), CTD (Count Down), and CTUD (Bidirectional Count Up/Down). Each counter requires an Instance Data Block to store current count value (CV) and status flags. The CTU block monitors its count input (CU): on every rising edge (FALSE to TRUE transition), the current count value (CV) increments by 1. When CV becomes greater than or equal to the preset value (PV), the output flag (Q) evaluates TRUE. Asserting the Reset (R) input instantly forces CV to 0 and clears Q. The CTD block decrements CV on each rising edge of CD, initializing CV to PV when the Load (LD) input is pulsed; output Q turns TRUE when CV decrements to <= 0. The CTUD block combines both mechanisms with independent CU and CD clock inputs, separate QU and QD outputs, and simultaneous Reset and Load controls, making it ideal for tracking bidirectional storage buffers or parking garage capacity.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_022.png",
        "caption": "Figure 3.4: IEC Counter Function Blocks: CTU (Count Up), CTD (Count Down), and CTUD Execution"
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

import { TopicContent } from '@/types/content';

export default {
  "slug": "counters",
  "sourceRef": "2.4",
  "title": "Counters (CTU, CTD, CTUD)",
  "durationMinutes": 14,
  "summary": "Counting discrete occurrences—such as parts traversing a conveyor, machine cycles, or batch quantities—is implemented via standardized IEC 61131-3 counter function blocks: CTU (Count Up), CTD (Coun...",
  "body": [
    {
      "heading": "CTU and CTD: Edge-Triggered Counting",
      "text": "Counting discrete occurrences, such as parts on a conveyor or completed machine cycles, is implemented with the standardized IEC 61131-3 counter blocks CTU (Count Up), CTD (Count Down), and CTUD (bidirectional). Each counter instance keeps its running Current Value (CV) in its own Instance Data Block. The CTU block watches its count input (CU) and increments CV by one on every rising edge, a FALSE-to-TRUE transition, not on a steady-state TRUE level; output Q turns TRUE once CV reaches or exceeds the preset value (PV), and asserting the Reset input (R) forces CV back to zero immediately, overriding any counting. The CTD block works the opposite way: it decrements CV on every rising edge of its CD input, starting from a value loaded into CV when the Load (LD) input is pulsed, and its output Q turns TRUE once CV falls to zero or below.",
      "keyPoints": [
        "Counters only respond to a rising (0-to-1) edge on their count input, never a steady TRUE level",
        "CTU: CV increments on each CU edge; Q turns TRUE once CV >= PV; R forces CV back to 0",
        "CTD: CV decrements on each CD edge from a value set by LD; Q turns TRUE once CV <= 0",
        "Reset on CTU and Load on CTD both take priority over the normal counting action"
      ],
      "note": "A counter that never seems to reach its preset is almost always being driven by a signal that is TRUE continuously rather than pulsing. Check the field device and the rung logic for a genuine rising edge, not a held contact."
    },
    {
      "heading": "CTUD and the High-Speed Counting Limit",
      "text": "The CTUD block combines both directions in one instance, with independent CU and CD clock inputs, separate QU (over-target) and QD (empty) status outputs, and simultaneous Reset and Load controls, which suits applications like tracking the level of a buffer that both fills and empties, such as parts waiting in a storage lane. The counter's data type, SInt, Int, or DInt, sets its maximum range, from 127 counts up to roughly 2.14 billion. Every software IEC counter, however it is wired, only sees a pulse if that pulse is present during the input-scan phase of a program cycle: a part passing fast enough that the sensor's pulse is narrower than the scan time will simply be missed, which puts a practical ceiling of roughly 50 Hz on software counting in OB1. Applications that must count faster than that, such as encoder pulses or very fast part streams, require a dedicated hardware High-Speed Counter (HSC) channel instead.",
      "keyPoints": [
        "CTUD: independent up/down clocks, QU and QD status, simultaneous Reset and Load",
        "Data type sets range: SInt (127), Int (32,767), DInt (about 2.14 billion)",
        "Software IEC counters in OB1 only see pulses present during the scan's input phase",
        "Practical ceiling for software counting: roughly 50 Hz — faster signals need a hardware HSC"
      ],
      "note": "If an optical sensor generates pulses narrower than the PLC scan cycle, a software counter in OB1 will silently undercount. Use a hardware High-Speed Counter input, or a pulse-stretching sensor amplifier, for any signal faster than about 50 Hz."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/03-binary-operations/03-bin_carved_022.png",
      "caption": "Figure 3.4: IEC Counter Function Blocks: CTU (Count Up), CTD (Count Down), and CTUD Execution"
    }
  ],
  "caseStudy": {
    "title": "Undercounting Caps on a High-Speed Capping Line",
    "context": "A capping machine's totalizer, built from a CTU counter in OB1, consistently reports fewer bottles than the line's mechanical cycle counter, with the gap growing as the line speed increases. At the line's rated speed, bottles pass the optical sensor roughly every 15 ms, while the PLC's own scan cycle sits around 8 ms, so in principle every pulse should be seen — until the sensor's output pulse itself turns out to be only 2 ms wide, well under the scan time, so a sizeable fraction of passes are missed whenever the pulse happens to fall between two input-scan phases. The fix is not a faster PLC: the technician adds a pulse-stretching relay between the sensor and the input card so every pulse is held wide enough to guarantee capture, and the counts match.",
    "hardware": [
      "CTU counter driven directly from a 2 ms sensor pulse — too narrow relative to the scan",
      "PLC scan cycle ~8 ms: fast enough in principle, but only samples once per cycle",
      "Fix: pulse-stretching relay (or a sensor with a built-in minimum pulse width) ahead of the input",
      "Alternative fix: move the signal to a hardware High-Speed Counter (HSC) channel instead of OB1"
    ],
    "pitfall": "Assuming that a PLC scan time faster than the average time between pulses guarantees every pulse is seen. What matters is the width of each individual pulse compared to the scan time, not the average rate."
  },
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
      "title": "CTU and CTD: Edge-Triggered Counting",
      "points": [
        "Counters only respond to a rising (0-to-1) edge on their count input, never a steady TRUE level",
        "CTU: CV increments on each CU edge; Q turns TRUE once CV >= PV; R forces CV back to 0",
        "CTD: CV decrements on each CD edge from a value set by LD; Q turns TRUE once CV <= 0",
        "Reset on CTU and Load on CTD both take priority over the normal counting action"
      ],
      "explain": "Counting discrete occurrences, such as parts on a conveyor or completed machine cycles, is implemented with the standardized IEC 61131-3 counter blocks CTU (Count Up), CTD (Count Down), and CTUD (bidirectional). Each counter instance keeps its running Current Value (CV) in its own Instance Data Block. The CTU block watches its count input (CU) and increments CV by one on every rising edge, a FALSE-to-TRUE transition, not on a steady-state TRUE level; output Q turns TRUE once CV reaches or exceeds the preset value (PV), and asserting the Reset input (R) forces CV back to zero immediately, overriding any counting. The CTD block works the opposite way: it decrements CV on every rising edge of its CD input, starting from a value loaded into CV when the Load (LD) input is pulsed, and its output Q turns TRUE once CV falls to zero or below.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_022.png",
        "caption": "Figure 3.4: IEC Counter Function Blocks: CTU (Count Up), CTD (Count Down), and CTUD Execution"
      }
    },
    {
      "kind": "concept",
      "title": "CTUD and the High-Speed Counting Limit",
      "points": [
        "CTUD: independent up/down clocks, QU and QD status, simultaneous Reset and Load",
        "Data type sets range: SInt (127), Int (32,767), DInt (about 2.14 billion)",
        "Software IEC counters in OB1 only see pulses present during the scan's input phase",
        "Practical ceiling for software counting: roughly 50 Hz — faster signals need a hardware HSC"
      ],
      "explain": "The CTUD block combines both directions in one instance, with independent CU and CD clock inputs, separate QU (over-target) and QD (empty) status outputs, and simultaneous Reset and Load controls, which suits applications like tracking the level of a buffer that both fills and empties, such as parts waiting in a storage lane. The counter's data type, SInt, Int, or DInt, sets its maximum range, from 127 counts up to roughly 2.14 billion. Every software IEC counter, however it is wired, only sees a pulse if that pulse is present during the input-scan phase of a program cycle: a part passing fast enough that the sensor's pulse is narrower than the scan time will simply be missed, which puts a practical ceiling of roughly 50 Hz on software counting in OB1. Applications that must count faster than that, such as encoder pulses or very fast part streams, require a dedicated hardware High-Speed Counter (HSC) channel instead."
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

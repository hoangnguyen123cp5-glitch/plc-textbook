import { TopicContent } from '@/types/content';

export default {
  "slug": "high-speed-counter",
  "sourceRef": "4.2",
  "title": "S7-1200 High-Speed Counters",
  "durationMinutes": 12,
  "summary": "Standard digital inputs read during the cyclic input scan are limited by the PLC scan cycle time (frequencies above 50–100 Hz are completely aliased and missed).",
  "body": [
    {
      "heading": "4.2 S7-1200 High-Speed Counters",
      "text": "Standard digital inputs read during the cyclic input scan are limited by the PLC scan cycle time (frequencies above 50–100 Hz are completely aliased and missed). To process high-speed signals from encoders and flow meters, the S7-1200 integrates up to 6 dedicated on-board hardware High-Speed Counters (HSC1 through HSC6). These counters operate entirely independent of the CPU scan cycle, accumulating pulses directly into hardware registers at frequencies up to 100 kHz on standard CPU inputs (or up to 200 kHz when using 24VDC/5VDC Signal Boards). In TIA Portal, each HSC is parameterized for its specific operating mode: Single Phase (simple count up/down with external direction input), Two Phase (independent up and down clock inputs), or AB Quadrature (1x, 2x, or 4x mode). In AB Quadrature 4x mode, the hardware increments on both the rising and falling edges of both Channel A and Channel B, effectively quadrupling the encoder's angular resolution (e.g. converting a 1,000 PPR encoder into 4,000 counts per revolution). Current count values are read continuously from assigned memory double-words (%ID1000 for HSC1), while the CTRL_HSC instruction block dynamically updates presets, resets counts, and enables gate controls.",
      "keyPoints": [
        "Independent Hardware Architecture: Operates directly in silicon logic outside the OB1 scan cycle; eliminates pulse loss at high shaft speeds",
        "Frequency Capabilities: On-board inputs support up to 100 kHz (HSC1/HSC2 on CPU 1214C/1215C); 200 kHz supported via Signal Board (SB 1221)",
        "Operating Modes: Single Phase (clock + direction), Two Phase (Clock Up + Clock Down), and A/B Quadrature (1x, 2x, or 4x resolution multiplication)",
        "Quadrature 4x Multiplication: Samples all 4 transitions (rising & falling edges of A and B) per cycle, delivering 4x mechanical resolution",
        "Direct Process Image Reading: Read the instantaneous 32-bit signed count value directly from assigned double-word memory: %ID1000:P",
        "Hardware Comparison Interrupts: HSC hardware compares current count against a reference value in silicon, triggering a hardware interrupt (OB40) within microseconds",
        "CTRL_HSC Function Block: System block used to dynamically write new reference presets, change counting direction, or reset the accumulator"
      ],
      "note": "When using high-speed counter inputs (%I0.0–%I0.5), remember to lower the digital input hardware filter time in CPU properties! The factory default input filter is 6.4 ms (which blocks all frequencies above ~78 Hz). Change the filter time to 0.8 µs to permit 100 kHz pulses to pass into the HSC circuitry."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/09-high-speed-counting/PL___Slide_4_012.jpeg",
      "caption": "Figure 9.2: S7-1200 High-Speed Counter (HSC) Hardware Configuration & 4x Resolution Multiplier"
    }
  ],
  "quiz": [
    {
      "q": "Why cannot standard digital input addresses (%I0.0) be used in ladder logic to count 50 kHz encoder pulses?",
      "options": [
        "Because the normal PLC scan cycle (5–20 ms) is far too slow and will alias/miss virtually 100% of the pulses",
        "Because encoders only output analog signals",
        "Because 50 kHz trips the circuit breaker",
        "Because Ladder logic does not support integers"
      ],
      "answer": 0,
      "explain": "A 50 kHz pulse arrives every 20 microseconds; a 10 ms CPU scan would skip 500 pulses per cycle without dedicated HSC hardware."
    }
  ],
  "narration": {
    "vi": "Trong mục này, chúng ta cấu hình bộ đếm tốc độ cao — HSC — trong TIA Portal. CPU S7-1200 tích hợp sẵn sáu HSC, đếm được tới 100 kHz. Bạn khai báo HSC trong Device Configuration, chọn chế độ đếm và gán chân vào. Instruction CTRL_HSC trong chương trình cho phép reset giá trị đếm, thay giá trị so sánh, hoặc bật tắt HSC ngay khi đang chạy.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "S7-1200 High-Speed Counters",
      "points": [
        "Independent Hardware Architecture: Operates directly in silicon logic outside the OB1 scan cycle; eliminates pulse loss at high shaft speeds",
        "Frequency Capabilities: On-board inputs support up to 100 kHz (HSC1/HSC2 on CPU 1214C/1215C); 200 kHz supported via Signal Board (SB 1221)",
        "Operating Modes: Single Phase (clock + direction), Two Phase (Clock Up + Clock Down), and A/B Quadrature (1x, 2x, or 4x resolution multiplication)",
        "Quadrature 4x Multiplication: Samples all 4 transitions (rising & falling edges of A and B) per cycle, delivering 4x mechanical resolution",
        "Direct Process Image Reading: Read the instantaneous 32-bit signed count value directly from assigned double-word memory: %ID1000:P",
        "Hardware Comparison Interrupts: HSC hardware compares current count against a reference value in silicon, triggering a hardware interrupt (OB40) within microseconds",
        "CTRL_HSC Function Block: System block used to dynamically write new reference presets, change counting direction, or reset the accumulator"
      ],
      "explain": "Standard digital inputs read during the cyclic input scan are limited by the PLC scan cycle time (frequencies above 50–100 Hz are completely aliased and missed). To process high-speed signals from encoders and flow meters, the S7-1200 integrates up to 6 dedicated on-board hardware High-Speed Counters (HSC1 through HSC6). These counters operate entirely independent of the CPU scan cycle, accumulating pulses directly into hardware registers at frequencies up to 100 kHz on standard CPU inputs (or up to 200 kHz when using 24VDC/5VDC Signal Boards). In TIA Portal, each HSC is parameterized for its specific operating mode: Single Phase (simple count up/down with external direction input), Two Phase (independent up and down clock inputs), or AB Quadrature (1x, 2x, or 4x mode). In AB Quadrature 4x mode, the hardware increments on both the rising and falling edges of both Channel A and Channel B, effectively quadrupling the encoder's angular resolution (e.g. converting a 1,000 PPR encoder into 4,000 counts per revolution). Current count values are read continuously from assigned memory double-words (%ID1000 for HSC1), while the CTRL_HSC instruction block dynamically updates presets, resets counts, and enables gate controls.",
      "figure": {
        "src": "/images/slides/09-high-speed-counting/PL___Slide_4_012.jpeg",
        "caption": "Figure 9.2: S7-1200 High-Speed Counter (HSC) Hardware Configuration & 4x Resolution Multiplier"
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

import { TopicContent } from '@/types/content';

export default {
  "slug": "timers",
  "sourceRef": "2.3",
  "title": "Timers (TON, TOF, TP)",
  "durationMinutes": 14,
  "summary": "IEC 61131-3 defines three standardized timer function blocks in the S7-1200, each backed by an internal Instance Data Block (IEC_Timer DB): TON (On-Delay Timer), TOF (Off-Delay Timer), and TP (Puls...",
  "body": [
    {
      "heading": "2.3 Timers (TON, TOF, TP)",
      "text": "IEC 61131-3 defines three standardized timer function blocks in the S7-1200, each backed by an internal Instance Data Block (IEC_Timer DB): TON (On-Delay Timer), TOF (Off-Delay Timer), and TP (Pulse Timer). The TON block delays the energization of an output: when the enable input (IN) transitions from FALSE to TRUE, the timer begins accumulating elapsed time (ET). When ET reaches the preset time (PT), the output (Q) turns TRUE and remains active until IN goes FALSE, which immediately resets ET to zero and drops Q to FALSE. The TOF block delays the de-energization of an output: when IN is TRUE, output Q is instantly TRUE; when IN transitions from TRUE to FALSE, timing begins, maintaining Q at TRUE until ET reaches PT, whereupon Q turns FALSE. The TP block generates an output pulse of exact duration PT: upon a rising edge at IN, output Q turns TRUE and timing commences; Q remains TRUE for the entire preset duration PT regardless of whether IN is released early or held on, after which Q drops FALSE.",
      "keyPoints": [
        "IEC_Timer Instance Data Block: Every timer instantiation consumes a dedicated data block storing internal state, elapsed time, and status bits",
        "Preset Time (PT) Syntax: Expressed in IEC Time format: T#500ms, T#2s, T#1m30s, or T#1d (stored internally as a signed 32-bit millisecond integer)",
        "TON (On-Delay Timer): Delays output turn-on; timing begins on IN rising edge; Q goes TRUE when ET >= PT; resets immediately if IN goes FALSE",
        "TOF (Off-Delay Timer): Delays output turn-off; Q activates immediately with IN; timing begins on IN falling edge; Q turns FALSE when ET >= PT",
        "TP (Pulse Timer): Generates fixed-width pulse of duration PT upon IN rising edge; immune to input contact bounce or premature input release",
        "Elapsed Time (ET): Continuous output port exposing instantaneous running time in millisecond resolution, readable for HMI progress bars",
        "Flasher Generator Circuit: Two TON timers cascaded in a closed loop (Timer 1 reset by Timer 2) create deterministic symmetric or asymmetric square waves"
      ],
      "note": "Do not attempt to pass an elapsed timer output (ET) to an analog actuator directly. ET is of data type TIME (milliseconds). To display timer countdowns on an HMI, divide ET by 1000 in a math block to convert milliseconds into integer seconds."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/timer-timing-diagram.jpg",
      "caption": "Figure 3.3: IEC Timing Diagram: TON (On-Delay), TOF (Off-Delay), and TP (Pulse Timer) Waveforms"
    }
  ],
  "quiz": [
    {
      "q": "What happens to the elapsed time (ET) of a standard IEC TON (On-Delay) timer if input IN goes FALSE before PT expires?",
      "options": [
        "ET pauses and retains its current value",
        "ET immediately resets to 0 ms and output Q remains FALSE",
        "Output Q turns ON immediately",
        "The CPU generates a hardware interrupt"
      ],
      "answer": 1,
      "explain": "A standard TON timer requires an uninterrupted TRUE signal on IN for the entire Preset Time (PT); if IN drops to FALSE early, ET resets to zero immediately."
    }
  ],
  "narration": {
    "vi": "S7-1200 có ba loại timer chính. TON là timer đóng trễ — đầu vào lên thì bắt đầu đếm, sau khoảng thời gian PT thì đầu ra Q lên. TOF là timer mở trễ — đầu vào xuống thì mới đếm rồi mới tắt Q. TP tạo xung đơn có độ rộng cố định PT. Trong TIA Portal, kéo khối IEC Timer vào chương trình, nối đầu vào IN và đặt giá trị PT kiểu TIME, ví dụ T#5s là năm giây.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Timers (TON, TOF, TP)",
      "points": [
        "IEC_Timer Instance Data Block: Every timer instantiation consumes a dedicated data block storing internal state, elapsed time, and status bits",
        "Preset Time (PT) Syntax: Expressed in IEC Time format: T#500ms, T#2s, T#1m30s, or T#1d (stored internally as a signed 32-bit millisecond integer)",
        "TON (On-Delay Timer): Delays output turn-on; timing begins on IN rising edge; Q goes TRUE when ET >= PT; resets immediately if IN goes FALSE",
        "TOF (Off-Delay Timer): Delays output turn-off; Q activates immediately with IN; timing begins on IN falling edge; Q turns FALSE when ET >= PT",
        "TP (Pulse Timer): Generates fixed-width pulse of duration PT upon IN rising edge; immune to input contact bounce or premature input release",
        "Elapsed Time (ET): Continuous output port exposing instantaneous running time in millisecond resolution, readable for HMI progress bars",
        "Flasher Generator Circuit: Two TON timers cascaded in a closed loop (Timer 1 reset by Timer 2) create deterministic symmetric or asymmetric square waves"
      ],
      "explain": "IEC 61131-3 defines three standardized timer function blocks in the S7-1200, each backed by an internal Instance Data Block (IEC_Timer DB): TON (On-Delay Timer), TOF (Off-Delay Timer), and TP (Pulse Timer). The TON block delays the energization of an output: when the enable input (IN) transitions from FALSE to TRUE, the timer begins accumulating elapsed time (ET). When ET reaches the preset time (PT), the output (Q) turns TRUE and remains active until IN goes FALSE, which immediately resets ET to zero and drops Q to FALSE. The TOF block delays the de-energization of an output: when IN is TRUE, output Q is instantly TRUE; when IN transitions from TRUE to FALSE, timing begins, maintaining Q at TRUE until ET reaches PT, whereupon Q turns FALSE. The TP block generates an output pulse of exact duration PT: upon a rising edge at IN, output Q turns TRUE and timing commences; Q remains TRUE for the entire preset duration PT regardless of whether IN is released early or held on, after which Q drops FALSE.",
      "figure": {
        "src": "/images/diagrams/timer-timing-diagram.jpg",
        "caption": "Figure 3.3: IEC Timing Diagram: TON (On-Delay), TOF (Off-Delay), and TP (Pulse Timer) Waveforms"
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

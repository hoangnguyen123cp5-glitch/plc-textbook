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
      "title": "IEC Timer Instructions in S7-1200 TIA Portal",
      "points": [
        "Each S7-1200 timer uses an IEC_Timer instance DB (%DB1, %DB2) to store timing state",
        "Preset Time (PT) and Elapsed Time (ET) use the 32-bit TIME type (e.g., T#10000MS)",
        "Four core timer blocks: TP (Pulse), TON (On-Delay), TOF (Off-Delay), and TONR",
        "The RT (Reset Timer) instruction clears stored time data in a target timer DB"
      ],
      "explain": "Unlike legacy PLCs that relied on fixed hardware timer numbers with manual time-base multipliers, the S7-1200 allocates an IEC_Timer data block for every timer you drop onto a rung. You simply type a TIME literal such as T#5s or T#500ms at the PT pin, and the CPU tracks elapsed milliseconds in ET."
    },
    {
      "kind": "concept",
      "title": "Pulse Timer (TP) and On-Delay Timer (TON)",
      "points": [
        "TP sets output Q = 1 on an IN rising edge and holds Q = 1 for the exact width PT",
        "While a TP pulse is running, further changes on IN cannot shorten or extend Q",
        "TON starts accumulating ET when IN = 1 and turns output Q = 1 once ET reaches PT",
        "If IN drops to 0 on a TON before ET reaches PT, ET resets to 0 ms and Q stays 0"
      ],
      "explain": "Use a TP block when an actuator such as a pneumatic reject pusher or horn needs a guaranteed fixed-width pulse regardless of how briefly a sensor is triggered. Use a TON block for startup warning delays or sensor debouncing, where the input condition must remain continuously TRUE for the full preset duration."
    },
    {
      "kind": "concept",
      "title": "Off-Delay Timer (TOF) Operation",
      "points": [
        "When input IN transitions to 1, a TOF timer sets output Q = 1 immediately",
        "While IN remains 1, elapsed time ET stays at 0 ms and output Q remains 1",
        "Timing begins on the falling edge (1 to 0) of IN, incrementing ET toward PT",
        "Once ET reaches PT, Q drops to 0; if IN returns to 1 early, ET resets to 0 ms"
      ],
      "explain": "An Off-Delay timer keeps an auxiliary device running for a cooldown or clearing period after the main machine command stops. Typical plant uses include running a spindle cooling fan for 30 seconds after motor shutdown or holding a stairwell light ON after a motion sensor clears."
    },
    {
      "kind": "concept",
      "title": "Retentive On-Delay Timer (TONR) and Reset (RT)",
      "points": [
        "TONR accumulates elapsed time ET across multiple separate IN = 1 intervals",
        "When IN drops to 0, TONR pauses and retains its current ET value in the DB",
        "Output Q turns 1 as soon as cumulative elapsed time ET reaches preset PT",
        "Asserting input R = 1 (or energizing an RT coil) clears ET to 0 and resets Q"
      ],
      "explain": "Whereas a standard TON loses its progress whenever the input flickers OFF, a TONR block acts as a cumulative runtime totalizer. Maintenance engineers use TONR to track total operating hours on a pump or heating element across shift starts and stops, triggering a service alert once cumulative runtime reaches PT."
    },
    {
      "kind": "diagram",
      "title": "Comparing TON, TOF, and TP Waveforms",
      "figure": {
        "src": "/images/diagrams/timer-timing-diagram.jpg",
        "caption": "Timing waveforms comparing Input Signal (IN) and Output Signal (Q) for TON, TOF, and TP timers"
      },
      "explain": "Compare the three Output Signal (Q) traces against Input Signal (IN): TON delays the rising edge of Q by Preset Time (T) after IN turns ON, TOF delays the falling edge of Q by T after IN turns OFF, and TP fires a fixed-width pulse of length T on each rising edge of IN."
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

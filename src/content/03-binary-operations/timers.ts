import { TopicContent } from '@/types/content';

export default {
  "slug": "timers",
  "sourceRef": "2.3",
  "title": "Timers (TON, TOF, TP)",
  "durationMinutes": 16,
  "summary": "IEC 61131-3 defines three standardized timer function blocks in the S7-1200, each backed by an internal Instance Data Block (IEC_Timer DB): TON (On-Delay Timer), TOF (Off-Delay Timer), and TP (Puls...",
  "body": [
    {
      "heading": "TON and TOF: Delaying a Transition",
      "text": "IEC 61131-3 defines three standardized timer function blocks for the S7-1200, each backed by its own Instance Data Block that stores elapsed time (ET) and internal status. The TON (On-Delay) block delays the energizing of an output: when input IN transitions from FALSE to TRUE, the timer starts accumulating elapsed time; when ET reaches the preset time (PT), output Q turns TRUE and stays TRUE for as long as IN remains TRUE. The instant IN drops to FALSE, ET resets to zero immediately and Q drops to FALSE, with no memory of how far the countdown had progressed. The TOF (Off-Delay) block delays the de-energizing of an output instead: Q follows IN TRUE immediately, but when IN falls to FALSE, Q stays TRUE for an additional PT before finally dropping, which is useful for things like keeping a cooling fan running briefly after a motor stops.",
      "keyPoints": [
        "Preset Time (PT): written as T#500ms, T#2s, T#1m30s — stored internally in milliseconds",
        "TON: Q turns TRUE only after IN has been continuously TRUE for the full PT",
        "TON resets to ET = 0 immediately if IN drops to FALSE before PT is reached",
        "TOF: Q follows IN TRUE immediately, but stays TRUE for PT after IN drops to FALSE"
      ],
      "note": "A standard TON timer requires an uninterrupted TRUE signal for the entire preset time. A noisy or bouncing sensor that drops out even briefly resets the countdown to zero, and the delayed output never fires."
    },
    {
      "heading": "TP Pulse Timer and Building a Flasher Circuit",
      "text": "The TP (Pulse) block generates an output of exact, fixed duration regardless of how long the input is held: a rising edge on IN starts the timer and turns Q TRUE immediately, and Q stays TRUE for the full preset time PT even if IN is released early or held on far longer than PT, which makes TP immune to contact bounce or an operator who holds a pushbutton too long. Every timer block also exposes its running Elapsed Time (ET) as a continuous output, in milliseconds, which can drive an HMI progress bar once divided down to seconds. A practical use of two TON timers together is an industrial flasher: Timer 1's output feeds Timer 2's input, and Timer 2's output, inverted, feeds back to reset Timer 1, producing a symmetric or asymmetric square wave suitable for driving an alarm beacon without any dedicated flasher instruction.",
      "keyPoints": [
        "TP: fixed-duration output pulse, unaffected by how long IN is actually held",
        "ET (Elapsed Time): read live in milliseconds; divide by 1000 before sending to an HMI",
        "Two TON timers cross-wired, each resetting the other, produce an alarm beacon flasher",
        "TP is the natural choice whenever a signal must be de-bounced into one clean, timed pulse"
      ],
      "note": "Never feed an Elapsed Time (ET) output straight into an analog actuator. ET is of data type TIME in milliseconds, not an engineering unit — convert it explicitly before using it anywhere outside a timer comparison."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/timer-timing-diagram.jpg",
      "caption": "Figure 3.3: IEC Timing Diagram: TON (On-Delay), TOF (Off-Delay), and TP (Pulse Timer) Waveforms"
    }
  ],
  "caseStudy": {
    "title": "The Reject Pusher That Fired Early",
    "context": "On a bottling line, a TON timer delays the reject-pusher solenoid so it fires exactly when a defective bottle reaches the pusher. During a trial run, the pusher fires at random, sometimes early, sometimes not at all. The cause traces to a worn proximity sensor whose signal glitches low for a few milliseconds while a bottle passes, which is enough to reset the TON's elapsed time to zero and restart the delay from scratch on an essentially random trigger. The technician fixes it by latching the sensor's rising edge into a memory bit with an RS block first, then driving the TON from that stable latch instead of from the raw, noisy sensor signal.",
    "hardware": [
      "TON driven directly from a raw sensor signal: any dropout restarts the delay from zero",
      "Fix: latch the sensor edge first (SR/RS block), then feed the latch to TON.IN",
      "TON.ET can be watched online to confirm the countdown is running continuously, not restarting",
      "A worn or misaligned proximity sensor is a common source of this kind of intermittent glitch"
    ],
    "pitfall": "Wiring a timer's IN input straight from a noisy or marginal field sensor. Any instruction whose output depends on an uninterrupted input signal — TON above all — should be driven from a clean, latched condition, not raw field wiring."
  },
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
      "title": "TON and TOF: Delaying a Transition",
      "points": [
        "Preset Time (PT): written as T#500ms, T#2s, T#1m30s — stored internally in milliseconds",
        "TON: Q turns TRUE only after IN has been continuously TRUE for the full PT",
        "TON resets to ET = 0 immediately if IN drops to FALSE before PT is reached",
        "TOF: Q follows IN TRUE immediately, but stays TRUE for PT after IN drops to FALSE"
      ],
      "explain": "IEC 61131-3 defines three standardized timer function blocks for the S7-1200, each backed by its own Instance Data Block that stores elapsed time (ET) and internal status. The TON (On-Delay) block delays the energizing of an output: when input IN transitions from FALSE to TRUE, the timer starts accumulating elapsed time; when ET reaches the preset time (PT), output Q turns TRUE and stays TRUE for as long as IN remains TRUE. The instant IN drops to FALSE, ET resets to zero immediately and Q drops to FALSE, with no memory of how far the countdown had progressed. The TOF (Off-Delay) block delays the de-energizing of an output instead: Q follows IN TRUE immediately, but when IN falls to FALSE, Q stays TRUE for an additional PT before finally dropping, which is useful for things like keeping a cooling fan running briefly after a motor stops.",
      "figure": {
        "src": "/images/diagrams/timer-timing-diagram.jpg",
        "caption": "Figure 3.3: IEC Timing Diagram: TON (On-Delay), TOF (Off-Delay), and TP (Pulse Timer) Waveforms"
      }
    },
    {
      "kind": "concept",
      "title": "TP Pulse Timer and Building a Flasher Circuit",
      "points": [
        "TP: fixed-duration output pulse, unaffected by how long IN is actually held",
        "ET (Elapsed Time): read live in milliseconds; divide by 1000 before sending to an HMI",
        "Two TON timers cross-wired, each resetting the other, produce an alarm beacon flasher",
        "TP is the natural choice whenever a signal must be de-bounced into one clean, timed pulse"
      ],
      "explain": "The TP (Pulse) block generates an output of exact, fixed duration regardless of how long the input is held: a rising edge on IN starts the timer and turns Q TRUE immediately, and Q stays TRUE for the full preset time PT even if IN is released early or held on far longer than PT, which makes TP immune to contact bounce or an operator who holds a pushbutton too long. Every timer block also exposes its running Elapsed Time (ET) as a continuous output, in milliseconds, which can drive an HMI progress bar once divided down to seconds. A practical use of two TON timers together is an industrial flasher: Timer 1's output feeds Timer 2's input, and Timer 2's output, inverted, feeds back to reset Timer 1, producing a symmetric or asymmetric square wave suitable for driving an alarm beacon without any dedicated flasher instruction."
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

import { TopicContent } from '@/types/content';

export default {
  "slug": "binary-application",
  "sourceRef": "2.5",
  "title": "Application Exercise",
  "durationMinutes": 12,
  "summary": "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station.",
  "body": [
    {
      "heading": "Process Description: an Inspection and Reject Station",
      "text": "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station. An infeed conveyor motor (M1, %Q0.0) transports cartons past an optical part sensor (%I0.2). An inductive proximity sensor (%I0.3) inspects each carton for the presence of a metallic safety seal. As cartons pass, a CTU counter increments the total production count. If a carton passes the optical sensor without triggering the proximity sensor, a defective-part condition is latched, and a TON timer begins a calibrated delay matching the conveyor's transit time to the reject pusher. When that timer elapses, a solenoid actuator (%Q0.1) pulses for 500 ms, via a TP timer, to divert the unsealed carton onto a reject chute. Once the batch reaches 50 accepted cartons, conveyor M1 halts, a buzzer (%Q0.2) sounds for 3 seconds via a TOF timer, and a packaging gate indexes the completed batch.",
      "keyPoints": [
        "Infeed conveyor M1 (%Q0.0), optical sensor (%I0.2), seal proximity sensor (%I0.3)",
        "CTU counter totals cartons; TON delays the reject pusher to match conveyor transit time",
        "TP fires the reject solenoid (%Q0.1) for a fixed 500 ms pulse",
        "TOF sounds the batch-complete buzzer (%Q0.2) for 3 seconds once 50 cartons are accepted"
      ],
      "note": "Draw the I/O list and the sequence of events before writing a single rung — every block used in this topic (CTU, TON, TP, TOF) maps to one clearly identified step in that sequence."
    },
    {
      "heading": "Program Structure: States, Interlocks, and Commissioning",
      "text": "A workcell this size is easiest to build, and to debug later, as a short list of named states — Idle, Running, Rejecting, Batch Complete, and Fault — rather than one tangled block of logic. Hardwired interlocks, the Normally Closed emergency stop (%I0.0) and the thermal motor overload contact (%I0.1), are examined first, ahead of every other rung, so that a safety trip cannot be bypassed by anything downstream. Because a defective-part condition must survive long enough for the operator to clear the reject bin, it is latched with a Reset-dominant RS block rather than a plain coil, and the program will not allow the conveyor to restart until both the bin is cleared and an explicit Reset input is pressed. Keeping the program split into clearly labeled networks, Safety, Conveyor Control, Inspection Logic, Pusher Actuation, Batch Counter, each with a short comment describing the mechanical step it corresponds to, is what turns a five-minute fault search on the factory floor into a two-hour one if it is skipped.",
      "keyPoints": [
        "Name the machine's states explicitly: Idle, Running, Rejecting, Batch Complete, Fault",
        "Safety interlocks (E-stop, overload) are examined first, ahead of every other rung",
        "Defect latch uses an RS (Reset-dominant) block: operator must clear the bin and press Reset",
        "One labeled network per mechanical step — comments are what make a fault findable fast"
      ],
      "note": "Always document each network with a short, specific title describing the mechanical step it performs. In commissioning, well-commented ladder logic is routinely the difference between a two-minute fault search and a two-hour one."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/03-binary-operations/03-bin_carved_045.png",
      "caption": "Figure 3.5: Multi-Step Sequential Machine Control with Latch Flags & Safety Interlocks"
    }
  ],
  "caseStudy": {
    "title": "Double-Coil Fault: the Pusher That Fired on Every Carton",
    "context": "During integration testing, the reject pusher fires on every carton, sealed or not. Reviewing the program shows that %Q0.1 is driven by two separate rungs: Network 4 pulses it correctly through the TP timer for rejects, but a leftover test rung from an earlier debugging session, Network 7, also writes %Q0.1 directly from the optical sensor %I0.2 and was never removed. Because the CPU evaluates both networks every scan and the physical output only ever reflects whichever rung wrote it last, Network 7's unconditional write overrides Network 4's reject logic on every single scan, firing the pusher for every carton that passes the optical sensor.",
    "hardware": [
      "Two rungs writing the same coil address (%Q0.1) is a double-coil fault, the same failure mode covered in the Bài 1 scan-cycle topic",
      "TIA Portal's cross-reference list flags every coil address written more than once in the program",
      "Fix: delete or disable the leftover test rung so %Q0.1 has exactly one coil in the whole program",
      "Habit: remove or comment out every temporary debugging rung before moving from test to commissioning"
    ],
    "pitfall": "Leaving a temporary test rung in the program after debugging is finished. Any address with more than one coil is a bug waiting to surface, since whichever rung executes last in the scan silently wins over all the others."
  },
  "quiz": [
    {
      "q": "In a conveyor latch seal-in circuit, why is the STOP contact wired in series before the START parallel branch?",
      "options": [
        "To provide immediate power cut-off that breaks the seal-in loop unconditionally",
        "To increase motor speed",
        "To prevent contact bounce",
        "To save one memory byte"
      ],
      "answer": 0,
      "explain": "Placing the STOP contact in series ensures that opening the stop circuit immediately breaks both the start and the auxiliary hold-in contact paths."
    }
  ],
  "narration": {
    "vi": "Trong mục ứng dụng thực tế, chúng ta kết hợp logic, timer và counter để xây dựng mạch điều khiển hoàn chỉnh. Ví dụ điển hình là băng tải hai tốc độ: nhấn Start thì chạy chậm trong năm giây nhờ TON, sau đó tự động chuyển sang chạy nhanh. Counter đếm sản phẩm và tự dừng khi đủ số lượng. Bài tập này giúp bạn thấy rõ cách các lệnh cơ bản phối hợp với nhau trong thực tế.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Process Description: an Inspection and Reject Station",
      "points": [
        "Infeed conveyor M1 (%Q0.0), optical sensor (%I0.2), seal proximity sensor (%I0.3)",
        "CTU counter totals cartons; TON delays the reject pusher to match conveyor transit time",
        "TP fires the reject solenoid (%Q0.1) for a fixed 500 ms pulse",
        "TOF sounds the batch-complete buzzer (%Q0.2) for 3 seconds once 50 cartons are accepted"
      ],
      "explain": "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station. An infeed conveyor motor (M1, %Q0.0) transports cartons past an optical part sensor (%I0.2). An inductive proximity sensor (%I0.3) inspects each carton for the presence of a metallic safety seal. As cartons pass, a CTU counter increments the total production count. If a carton passes the optical sensor without triggering the proximity sensor, a defective-part condition is latched, and a TON timer begins a calibrated delay matching the conveyor's transit time to the reject pusher. When that timer elapses, a solenoid actuator (%Q0.1) pulses for 500 ms, via a TP timer, to divert the unsealed carton onto a reject chute. Once the batch reaches 50 accepted cartons, conveyor M1 halts, a buzzer (%Q0.2) sounds for 3 seconds via a TOF timer, and a packaging gate indexes the completed batch."
    },
    {
      "kind": "concept",
      "title": "Program Structure: States, Interlocks, and Commissioning",
      "points": [
        "Name the machine's states explicitly: Idle, Running, Rejecting, Batch Complete, Fault",
        "Safety interlocks (E-stop, overload) are examined first, ahead of every other rung",
        "Defect latch uses an RS (Reset-dominant) block: operator must clear the bin and press Reset",
        "One labeled network per mechanical step — comments are what make a fault findable fast"
      ],
      "explain": "A workcell this size is easiest to build, and to debug later, as a short list of named states — Idle, Running, Rejecting, Batch Complete, and Fault — rather than one tangled block of logic. Hardwired interlocks, the Normally Closed emergency stop (%I0.0) and the thermal motor overload contact (%I0.1), are examined first, ahead of every other rung, so that a safety trip cannot be bypassed by anything downstream. Because a defective-part condition must survive long enough for the operator to clear the reject bin, it is latched with a Reset-dominant RS block rather than a plain coil, and the program will not allow the conveyor to restart until both the bin is cleared and an explicit Reset input is pressed. Keeping the program split into clearly labeled networks, Safety, Conveyor Control, Inspection Logic, Pusher Actuation, Batch Counter, each with a short comment describing the mechanical step it corresponds to, is what turns a five-minute fault search on the factory floor into a two-hour one if it is skipped.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_045.png",
        "caption": "Figure 3.5: Multi-Step Sequential Machine Control with Latch Flags & Safety Interlocks"
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

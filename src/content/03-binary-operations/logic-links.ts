import { TopicContent } from '@/types/content';

export default {
  "slug": "logic-links",
  "sourceRef": "2.1",
  "title": "Logic Links (AND, OR, NOT)",
  "durationMinutes": 12,
  "summary": "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically within the CPU.",
  "body": [
    {
      "heading": "AND / OR Links: Contacts, Coils, and Power Flow",
      "text": "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically inside the CPU. The fundamental building blocks are the Normally Open (NO) contact (---[ ]---), the Normally Closed (NC) contact (---[/]---), and the output coil (---( )---). Virtual power flow is evaluated from the left power rail across the rung to the right rail on every scan. Wiring two or more contacts in series implements Boolean AND logic: every contact in the chain must conduct for power to reach the coil. Wiring contacts in parallel branches implements Boolean OR logic: power reaches the coil if at least one branch conducts. These two wiring patterns, repeated and nested, are the building blocks for every combinational rung in the program.",
      "keyPoints": [
        "NO contact (---[ ]---): conducts virtual power when the assigned address is TRUE",
        "NC contact (---[/]---): conducts virtual power when the assigned address is FALSE",
        "Output coil (---( )---): writes the Result of Logic Operation (RLO) to a %Q or %M address",
        "Series contacts = Boolean AND: every contact in the chain must conduct",
        "Parallel branches = Boolean OR: at least one branch must conduct"
      ],
      "note": "Power flow in LAD is a simulation, not a real current: the CPU evaluates the rung top-to-bottom, left-to-right on every scan, and writes the result to the coil at the end of that evaluation, not instantaneously as the contacts are drawn."
    },
    {
      "heading": "NOT Logic and the Start/Stop Seal-In Latch",
      "text": "The NC contact is also the ladder representation of the Boolean NOT operator: it is closed (conducting) when its address is FALSE and opens when the address becomes TRUE. This matters most for safety wiring. A hardwired emergency-stop pushbutton is wired Normally Closed at the field terminal block, so its healthy, unpressed state delivers +24V (logic 1) into the input; pressing the button, or a broken wire, drops the input to 0. Because the field device is already inverted, the ladder rung must examine that input with an NO contact, not an NC contact, so that power flows while the button is healthy. Combining series AND, parallel OR, and this NOT convention produces the classic three-wire Start/Stop motor latch: a momentary Start (NO) contact is wired in parallel with an auxiliary feedback contact from the output coil itself (%Q0.0), and that parallel pair is wired in series with a Stop contact (NO, examining the hardwired NC button). Once Start is pressed, the coil energizes and its own auxiliary contact seals the circuit in, holding the motor running after the operator releases the button.",
      "keyPoints": [
        "NC contact = Boolean NOT: it inverts the TRUE/FALSE sense of its address",
        "Golden rule: a hardwired NC field device must be examined with an NO ladder contact",
        "Seal-in latch: Start (NO) in parallel with the %Q0.0 auxiliary contact, both in series with Stop",
        "The auxiliary %Q0.0 contact is what lets the motor keep running after Start is released",
        "XOR can be built from two cross-coupled branches: (A AND NOT B) OR (NOT A AND B)"
      ],
      "note": "Always remember the golden rule of field sensors: if a physical emergency stop pushbutton is hardwired Normally Closed for fail-safe field integrity, it delivers +24V (TRUE) into its input in the normal, safe state. In the ladder program you must examine that input with a Normally Open contact so power flows while the button is healthy and unpressed."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/ladder-start-stop.jpg",
      "caption": "Figure 3.1: Start/Stop Motor Latch Circuit (Seal-in Network) in TIA Portal Ladder Diagram"
    }
  ],
  "caseStudy": {
    "title": "The Seal-In Latch That Wouldn't Stay On",
    "context": "A student wires the three-wire Start/Stop latch for a bench-top motor demo. Pressing Start spins the motor, but the moment the button is released the motor stops immediately, as if no latch exists at all. Tracing the rung in the TIA Portal watch table shows %Q0.0 going TRUE for exactly one scan and then dropping back to FALSE. The auxiliary contact placed in parallel with Start is wired to %M0.0, a spare memory bit that is never written anywhere else in the program, instead of to %Q0.0, the actual output coil the student intended to feed back.",
    "hardware": [
      "Correct seal-in rung: [Stop NO examining NC field device] AND ( [Start NO] OR [%Q0.0 NO] ) -> coil %Q0.0",
      "The parallel feedback contact must reference the SAME address as the coil it is sealing in",
      "Watch table: monitor %Q0.0 across two scans to confirm it stays TRUE after Start is released",
      "Common variants of this mistake: feeding back an unused memory bit, or feeding back a different output entirely"
    ],
    "pitfall": "Copy-pasting a seal-in rung from another project without updating every address. The auxiliary contact only works if it reads the exact same coil address it sits beside; any mismatch silently turns the latch into a momentary, unlatched circuit."
  },
  "quiz": [
    {
      "q": "In Ladder Diagram, placing contacts in parallel branches executes which Boolean operation?",
      "options": [
        "Boolean AND",
        "Boolean OR",
        "Boolean NOT",
        "Boolean NAND"
      ],
      "answer": 1,
      "explain": "Parallel branches create alternative conduction paths: virtual power flow passes if either Branch A OR Branch B evaluates to TRUE."
    },
    {
      "q": "If a physical emergency stop button is Normally Closed (NC), what contact symbol must be used in your ladder rung?",
      "options": [
        "Normally Closed contact (---[/]---)",
        "Normally Open contact (---[ ]---)",
        "Negated output coil (---(/)---)",
        "Set coil (---(S)---)"
      ],
      "answer": 1,
      "explain": "In its normal healthy state, the NC E-Stop delivers +24V (logic 1) to the input. An NO ladder contact (---[ ]---) examines for logic 1 and conducts power flow safely."
    }
  ],
  "narration": {
    "vi": "Trong mục này, chúng ta học ba phép logic cơ bản trong LAD. AND là nối tiếp — tất cả tiếp điểm phải đóng thì cuộn dây mới có điện. OR là song song — chỉ cần một trong các tiếp điểm đóng là đủ. NOT đảo trạng thái — tiếp điểm thường đóng trong LAD chính là biểu diễn của NOT. Bảng chân lý giúp bạn kiểm tra logic trước khi nạp chương trình vào PLC thực.",
    "durationSec": 28,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "AND / OR Links: Contacts, Coils, and Power Flow",
      "points": [
        "NO contact (---[ ]---): conducts virtual power when the assigned address is TRUE",
        "NC contact (---[/]---): conducts virtual power when the assigned address is FALSE",
        "Output coil (---( )---): writes the Result of Logic Operation (RLO) to a %Q or %M address",
        "Series contacts = Boolean AND: every contact in the chain must conduct",
        "Parallel branches = Boolean OR: at least one branch must conduct"
      ],
      "explain": "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically inside the CPU. The fundamental building blocks are the Normally Open (NO) contact (---[ ]---), the Normally Closed (NC) contact (---[/]---), and the output coil (---( )---). Virtual power flow is evaluated from the left power rail across the rung to the right rail on every scan. Wiring two or more contacts in series implements Boolean AND logic: every contact in the chain must conduct for power to reach the coil. Wiring contacts in parallel branches implements Boolean OR logic: power reaches the coil if at least one branch conducts. These two wiring patterns, repeated and nested, are the building blocks for every combinational rung in the program."
    },
    {
      "kind": "concept",
      "title": "NOT Logic and the Start/Stop Seal-In Latch",
      "points": [
        "NC contact = Boolean NOT: it inverts the TRUE/FALSE sense of its address",
        "Golden rule: a hardwired NC field device must be examined with an NO ladder contact",
        "Seal-in latch: Start (NO) in parallel with the %Q0.0 auxiliary contact, both in series with Stop",
        "The auxiliary %Q0.0 contact is what lets the motor keep running after Start is released",
        "XOR can be built from two cross-coupled branches: (A AND NOT B) OR (NOT A AND B)"
      ],
      "explain": "The NC contact is also the ladder representation of the Boolean NOT operator: it is closed (conducting) when its address is FALSE and opens when the address becomes TRUE. This matters most for safety wiring. A hardwired emergency-stop pushbutton is wired Normally Closed at the field terminal block, so its healthy, unpressed state delivers +24V (logic 1) into the input; pressing the button, or a broken wire, drops the input to 0. Because the field device is already inverted, the ladder rung must examine that input with an NO contact, not an NC contact, so that power flows while the button is healthy. Combining series AND, parallel OR, and this NOT convention produces the classic three-wire Start/Stop motor latch: a momentary Start (NO) contact is wired in parallel with an auxiliary feedback contact from the output coil itself (%Q0.0), and that parallel pair is wired in series with a Stop contact (NO, examining the hardwired NC button). Once Start is pressed, the coil energizes and its own auxiliary contact seals the circuit in, holding the motor running after the operator releases the button.",
      "figure": {
        "src": "/images/diagrams/ladder-start-stop.jpg",
        "caption": "Figure 3.1: Start/Stop Motor Latch Circuit (Seal-in Network) in TIA Portal Ladder Diagram"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 1
    }
  ],
  "status": "review"
} satisfies TopicContent;

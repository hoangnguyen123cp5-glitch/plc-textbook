import { TopicContent } from '@/types/content';

export default {
  "slug": "logic-links",
  "sourceRef": "2.1",
  "title": "Logic Links (AND, OR, NOT)",
  "durationMinutes": 10,
  "summary": "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically within the CPU.",
  "body": [
    {
      "heading": "2.1 Logic Links (AND, OR, NOT)",
      "text": "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically within the CPU. The fundamental building blocks are Normally Open (NO) contacts (---[ ]---), Normally Closed (NC) contacts (---[/]---), standard output coils (---( )---), and negated coils (---(/)---). In LAD, power flow evaluates virtually from the left power rail across the rung to the right rail. Series connection of contacts implements Boolean AND logic (both Contact A AND Contact B must conduct for the output to energize). Parallel branch connections implement Boolean OR logic (conduction across either Branch A OR Branch B completes the circuit). An NC contact functions as a Boolean NOT operator: when the referenced memory bit is logic 0 (FALSE), the virtual contact remains closed and conducts; when the bit becomes logic 1 (TRUE), the contact opens, interrupting power flow. Combining series and parallel combinations allows engineers to construct complex combinational logic, including Exclusive-OR (XOR) circuits where an output is true if exactly one of two inputs is active.",
      "keyPoints": [
        "Normally Open (NO) Contact (---[ ]---): Passes virtual power flow only when the assigned boolean address evaluates to TRUE (logic 1)",
        "Normally Closed (NC) Contact (---[/]---): Passes virtual power flow when the assigned address is FALSE (logic 0); opens when address is TRUE",
        "Standard Output Coil (---( )---): Writes the evaluated Result of Logic Operation (RLO) directly to the designated memory address (%Q or %M)",
        "Boolean AND Link: Configured by placing two or more contacts in series along a single rung path; all series conditions must evaluate TRUE",
        "Boolean OR Link: Configured by wiring contacts in parallel branches; power flow conducts if at least one branch evaluates TRUE",
        "Boolean NOT (Invert RLO): An inline NOT contact block (---[NOT]---) or negated coil (---(/)---) reverses the current rung logic state",
        "Exclusive-OR (XOR) Logic: Constructed using two parallel branches containing cross-coupled NO and NC contacts: (A AND NOT B) OR (NOT A AND B)"
      ],
      "note": "Always remember the golden rule of field sensors: if a physical emergency stop pushbutton is hardwired as Normally Closed (NC) for fail-safe field integrity, it delivers +24V (TRUE) into %I0.0 in its normal safe state. In your PLC ladder program, you must examine %I0.0 using a Normally Open (NO) contact to allow power flow when the button is healthy and unpressed!"
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/ladder-start-stop.jpg",
      "caption": "Figure 3.1: Start/Stop Motor Latch Circuit (Seal-in Network) in TIA Portal Ladder Diagram"
    }
  ],
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
      "title": "Logic Links (AND, OR, NOT)",
      "points": [
        "Normally Open (NO) Contact (---[ ]---): Passes virtual power flow only when the assigned boolean address evaluates to TRUE (logic 1)",
        "Normally Closed (NC) Contact (---[/]---): Passes virtual power flow when the assigned address is FALSE (logic 0); opens when address is TRUE",
        "Standard Output Coil (---( )---): Writes the evaluated Result of Logic Operation (RLO) directly to the designated memory address (%Q or %M)",
        "Boolean AND Link: Configured by placing two or more contacts in series along a single rung path; all series conditions must evaluate TRUE",
        "Boolean OR Link: Configured by wiring contacts in parallel branches; power flow conducts if at least one branch evaluates TRUE",
        "Boolean NOT (Invert RLO): An inline NOT contact block (---[NOT]---) or negated coil (---(/)---) reverses the current rung logic state",
        "Exclusive-OR (XOR) Logic: Constructed using two parallel branches containing cross-coupled NO and NC contacts: (A AND NOT B) OR (NOT A AND B)"
      ],
      "explain": "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically within the CPU. The fundamental building blocks are Normally Open (NO) contacts (---[ ]---), Normally Closed (NC) contacts (---[/]---), standard output coils (---( )---), and negated coils (---(/)---). In LAD, power flow evaluates virtually from the left power rail across the rung to the right rail. Series connection of contacts implements Boolean AND logic (both Contact A AND Contact B must conduct for the output to energize). Parallel branch connections implement Boolean OR logic (conduction across either Branch A OR Branch B completes the circuit). An NC contact functions as a Boolean NOT operator: when the referenced memory bit is logic 0 (FALSE), the virtual contact remains closed and conducts; when the bit becomes logic 1 (TRUE), the contact opens, interrupting power flow. Combining series and parallel combinations allows engineers to construct complex combinational logic, including Exclusive-OR (XOR) circuits where an output is true if exactly one of two inputs is active.",
      "figure": {
        "src": "/images/diagrams/ladder-start-stop.jpg",
        "caption": "Figure 3.1: Start/Stop Motor Latch Circuit (Seal-in Network) in TIA Portal Ladder Diagram"
      }
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 1
    }
  ],
  "status": "review"
} satisfies TopicContent;

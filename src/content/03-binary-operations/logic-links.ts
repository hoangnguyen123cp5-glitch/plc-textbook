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
      "title": "LAD Contacts (NO, NC) and Series/Parallel Links",
      "points": [
        "Parameter IN (Bool) assigns a single memory bit (%I, %Q, %M, or DB) to a contact",
        "Normally Open (NO, ---[ ]---) closes and conducts when its assigned bit equals 1",
        "Normally Closed (NC, ---[/]---) conducts when its assigned bit equals 0",
        "Contacts wired in series form a Boolean AND; parallel branches form a Boolean OR"
      ],
      "explain": "Ladder Diagram (LAD) evaluates virtual power flow from the left rail to the right rail during each CPU scan. Because an NC contact passes power when its bit is 0, you must match your ladder contact to the physical wiring of the field sensor. For example, a hardwired NC emergency-stop button sends +24 VDC (bit 1) when healthy, so the rung must examine that input with an NO contact to permit operation."
    },
    {
      "kind": "concept",
      "title": "FBD Logic Blocks: AND, OR, and XOR",
      "points": [
        "FBD represents combinational logic using gate boxes with Bool inputs IN1 and IN2",
        "AND block (&) sets its output TRUE only when every input pin is TRUE (1)",
        "OR block (>=1) sets its output TRUE when at least one input pin is TRUE (1)",
        "XOR block (x) sets its output TRUE when an odd number of inputs are TRUE"
      ],
      "explain": "Function Block Diagram (FBD) expresses the exact same Boolean logic as LAD using IEC 61131-3 gate symbols instead of relay contacts. In TIA Portal, you can switch a block between LAD and FBD views seamlessly when inspecting combinational interlocks. An XOR block is particularly handy for two-point alternation or discrepancy checks where two sensors must never share the same state.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_003.jpg",
        "caption": "FBD logic blocks in TIA Portal: AND (&), OR (>=1), and XOR (x) with Boolean inputs IN1 and IN2"
      }
    },
    {
      "kind": "concept",
      "title": "Logic Inversion with the NOT Instruction",
      "points": [
        "The inline NOT contact (---|NOT|---) inverts the RLO power flow on a LAD rung",
        "If incoming power flow into NOT is 0 (FALSE), the outgoing power flow becomes 1",
        "If incoming power flow into NOT is 1 (TRUE), the outgoing power flow becomes 0",
        "In FBD, inversion is shown by a small negation bubble on an input or output pin"
      ],
      "explain": "Unlike an NC contact that only tests a single bit for 0, the inline NOT instruction inverts the entire upstream Result of Logic Operation (RLO) computed by a complex series-parallel branch. Engineers place a NOT element after a multi-sensor permissive network when they need an alarm coil to energize whenever the combined permissive condition drops out."
    },
    {
      "kind": "concept",
      "title": "Output Coils (LAD) and Assignment Boxes (FBD)",
      "points": [
        "Parameter OUT (Bool) specifies the target bit (%Q, %M, or DB) written each scan",
        "Standard Output Coil ---( )--- writes the current rung RLO directly to OUT",
        "Negated Output Coil ---(/)--- writes the inverted RLO to OUT on every scan",
        "FBD uses the Assignment box (=) and Negated Assignment box (/=) for the same role"
      ],
      "explain": "An output coil or assignment box is non-retentive: it actively writes either 1 or 0 to its target bit on every single scan cycle. Avoid assigning the same %Q0.0 address to multiple standard coils in different networks, because only the last network evaluated before the process-image update will control the physical output terminal."
    },
    {
      "kind": "diagram",
      "title": "Start/Stop Motor Seal-In Network in LAD",
      "figure": {
        "src": "/images/diagrams/ladder-start-stop.jpg",
        "caption": "Network 1 Start/Stop motor latch circuit with Start I0.0, self-hold Q0.0, Stop I0.1, and Motor Q0.0"
      },
      "explain": "Follow the virtual power flow from the 24V DC rail: pressing Start (I0.0) energizes coil Q0.0, which closes the parallel self-hold contact Q0.0 (OR branch) so the motor stays running after I0.0 is released. Opening the series Stop contact (I0.1) breaks the AND path and drops Q0.0."
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

import { TopicContent } from '@/types/content';

export default {
  "slug": "binary-application",
  "sourceRef": "2.5",
  "title": "Application Exercise",
  "durationMinutes": 10,
  "summary": "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station.",
  "body": [
    {
      "heading": "2.5 Application Exercise",
      "text": "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station. The process operates as follows: an infeed conveyor motor (M1, %Q0.0) transports cartons past an optical part sensor (%I0.2). An inductive proximity sensor (%I0.3) inspects each carton for the presence of a metallic safety seal. As cartons pass, an IEC counter (CTU) increments the total production count. If a carton passes the optical sensor without triggering the metal proximity sensor, a defective-part condition is latched, and a TON timer initiates a calibrated delay matching the conveyor transit time to the reject pusher. When the timer elapses, a solenoid actuator (%Q0.1) pulses for 500 ms (via a TP timer) to divert the unsealed carton onto a reject chute. Upon reaching a batch count of 50 acceptable cartons, conveyor M1 halts, an acoustic buzzer (%Q0.2) sounds for 3 seconds via a TOF timer, and a packaging gate indexes the batch.",
      "keyPoints": [
        "System State Decomposition: Break complex machine cycles into discrete states: Idle, Running, Rejecting, Batch Complete, and Fault",
        "Fail-Safe Interlocking: Hardwired NC emergency stop (%I0.0) and thermal motor overload (%I0.1) contacts precede all rung power flow",
        "Part Tracking Mechanism: Synchronize sensor edge detection with conveyor mechanical travel time using precision TON timers",
        "Defect Latching: Latch fault flags with Reset-dominant RS blocks; prevent machine restart until the reject bin is cleared and reset is pressed",
        "Batch Management: Automatic counter reset upon batch completion combined with totalizer accumulation in a non-volatile Global DB",
        "Structured Network Layout: Segregate code into logical networks: Network 1 (Safety & E-Stop), Network 2 (Conveyor Control), Network 3 (Inspection Logic), Network 4 (Pusher Actuation), Network 5 (Batch Counter)"
      ],
      "note": "Always document each ladder network with descriptive titles and comment headers explaining the mechanical sequence. In factory commissioning, well-commented ladder logic reduces fault diagnosis time from hours to minutes."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/03-binary-operations/03-bin_carved_045.png",
      "caption": "Figure 3.5: Multi-Step Sequential Machine Control with Latch Flags & Safety Interlocks"
    }
  ],
  "quiz": [
    {
      "q": "In a conveyor Start/Stop seal-in network, why is the Stop condition placed in series with the entire parallel Start and self-hold branch?",
      "options": [
        "So that opening the Stop contact breaks continuity for both the Start path and the self-hold feedback branch",
        "So that pressing Stop latches the motor coil ON until the Start button is pressed again",
        "Because TIA Portal does not allow Normally Closed contacts to be placed inside a parallel branch",
        "To allow the motor to keep running via the self-hold contact even while Stop is held open"
      ],
      "answer": 0,
      "explain": "Placing the Stop contact in series ensures that opening the stop circuit immediately interrupts both the momentary Start path and the auxiliary hold-in path."
    },
    {
      "q": "In the example cut-to-length conveyor solution, why does counter output Q (when CV >= PV) unlatch the feed drive before triggering the cutting shear?",
      "options": [
        "Because an IEC CTU counter cannot increment CV while a motor output coil is energized",
        "To force the roller encoder to count backward to zero during the cutting stroke",
        "To stop the metal strip from advancing while the shear blade is engaged, preventing buckled material",
        "Because TIA Portal prohibits energizing two output coils (%Q0.0 and %Q0.1) in the same program block"
      ],
      "answer": 2,
      "explain": "Stopping the feed drive as soon as CV reaches PV holds the strip stationary during the shear stroke; once the cut completes, input R resets CV = 0 for the next sheet."
    },
    {
      "q": "In an industrial drive application such as the steel rolling mill example, how should an Emergency Stop (E-Stop) be handled between hardware wiring and the PLC program?",
      "options": [
        "Wire the E-Stop only to a PLC digital input and rely on a software TON timer to ramp down VFD power",
        "Use a Set-dominant RS block so the operator can override an active E-Stop by holding the Start button",
        "Bypass the PLC completely and omit E-Stop status monitoring from the ladder program",
        "Hardwire the E-Stop circuit to remove drive power directly, while the PLC latches the fault status (SR) to block automatic restart"
      ],
      "answer": 3,
      "explain": "Safety standards require E-Stop circuits to remove actuator power via hardwired safety components; the PLC monitors an auxiliary contact and uses a Reset-dominant (SR) latch to prevent unexpected restart when the E-Stop is released."
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
      "title": "Conveyor Bottle Counting and Cap Sealer Control",
      "points": [
        "Example solution: entry sensor (%I0.2) detects each bottle and pulses CTU input CU",
        "When bottle position reaches the cap sealer, an SR latch stops conveyor motor %Q0.0",
        "A TON/TP timer holds the cap sealer cylinder (%Q0.1) down for Sealing Time (T#2s)",
        "Exit sensor (%I0.3) confirms discharge and resets the batch counter at PV target"
      ],
      "explain": "The source slide asks students to propose a control sequence for a bottle conveyor and cap sealer; the %I/%Q addresses above illustrate one example solution. Simulating the bottle counter and 2-second sealing timer in TIA Portal lets you verify that the conveyor motor restarts only after the sealer retracts.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_036.png",
        "caption": "Bottle conveyor with entry/exit sensors, cap sealer actuator, and Siemens HMI counter display"
      }
    },
    {
      "kind": "concept",
      "title": "Conveyor Length Measuring and Cutting System",
      "points": [
        "Example solution: a roller encoder (%I0.0) pulses a counter to track strip length",
        "While CV < PV, the feed drive coil (%Q0.0) stays latched ON to advance the strip",
        "When CV >= PV, counter output Q unlatches %Q0.0 and triggers shear coil %Q0.1",
        "Once the cutting blade completes its stroke, input R clears CV = 0 for the next cut"
      ],
      "explain": "In this cut-to-length exercise, binary latching and counting work together in an example solution that converts discrete roller pulses into a target sheet length. Before testing on hardware, simulate the counter reset timing in TIA Portal so the feed roller never advances while the shear blade is engaged.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_045.png",
        "caption": "Sheet-metal conveyor using a roller encoder and cutting mechanism connected to a Siemens PLC"
      }
    },
    {
      "kind": "concept",
      "title": "Steel Rolling Mill Timing and Interlock Logic",
      "points": [
        "Example solution: furnace TT (%I0.2) and PT (%I0.3) permissives form an AND chain",
        "A TON timer verifies slab soak time in the furnace before starting exit rollers",
        "Cascaded TON/TOF timers sequence VFD stands (%Q0.0–%Q0.3) as the strip advances",
        "E-Stop is hardwired to remove drive power; the PLC only latches the fault status (SR) to block restart"
      ],
      "explain": "For the steel rolling mill exercise, this example solution combines timer sequencing and Reset-dominant (SR) fault latching to coordinate furnace discharge, rolling stands, and the coiler. Grouping safety interlocks, drive latches, and delay timers into separate LAD networks keeps the program easy to debug."
    },
    {
      "kind": "diagram",
      "title": "Steel Rolling Mill Control Architecture",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_046.png",
        "caption": "Steel rolling mill control architecture with furnace TT/PT sensors, four VFDs, and rolling stands"
      },
      "explain": "Trace the slab path from left to right: the PLC reads Furnace sensors TT and PT, enables the infeed VFD after the heating timer expires, coordinates the two 4-high rolling-stand VFDs as the red-hot strip thins, and synchronizes the downstream coiler VFD."
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
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 2
    }
  ],
  "status": "review"
} satisfies TopicContent;

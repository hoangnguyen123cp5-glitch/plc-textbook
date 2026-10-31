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
      "title": "Conveyor Bottle Counting and Cap Sealer Control",
      "points": [
        "Entry photoelectric sensor (%I0.2) detects each bottle and pulses CTU input CU",
        "When bottle position reaches the cap sealer, an SR latch stops conveyor motor %Q0.0",
        "A TON/TP timer holds the cap sealer cylinder (%Q0.1) down for Sealing Time (T#2s)",
        "Exit sensor (%I0.3) confirms discharge and resets the batch counter at PV target"
      ],
      "explain": "Analyzing a conveyor station begins with decomposing its process sequence into sensor reads, counter updates, and latched outputs. Simulating the bottle counter and 2-second sealing timer in TIA Portal lets you verify that the conveyor motor restarts cleanly only after the cap sealer cylinder retracts.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_036.png",
        "caption": "Bottle conveyor with entry/exit sensors, cap sealer actuator, and Siemens HMI counter display"
      }
    },
    {
      "kind": "concept",
      "title": "Conveyor Length Measuring and Cutting System",
      "points": [
        "A measuring roller encoder feeds pulses into a counter to track strip length",
        "While CV < PV, the feed drive coil remains latched ON to advance the metal strip",
        "When CV >= PV, counter output Q unlatches the feed drive and triggers the shear",
        "Once the cutting blade completes its stroke, input R clears CV = 0 for the next cut"
      ],
      "explain": "In a cut-to-length line, binary latching and counting work together to convert discrete roller pulses into a repeatable sheet length. Before downloading to the PLC, always simulate the counter reset timing in TIA Portal so the feed roller never advances while the shear blade is still engaged.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_045.png",
        "caption": "Sheet-metal conveyor using a roller encoder and cutting mechanism connected to a Siemens PLC"
      }
    },
    {
      "kind": "concept",
      "title": "Steel Rolling Mill Timing and Interlock Logic",
      "points": [
        "Furnace temperature (TT) and pressure (PT) permissives form an AND safety chain",
        "A TON timer verifies slab soak time in the furnace before starting exit rollers",
        "Cascaded TON/TOF timers sequence VFD stands 1 to 4 as the hot strip advances",
        "Fault or E-Stop inputs drive Reset-dominant (SR) latches to halt all VFD drives"
      ],
      "explain": "Heavy process lines like a steel rolling mill rely on deterministic timer sequencing and fail-safe latching to coordinate furnace discharge, rolling stands, and the coiler. Grouping safety interlocks, drive Set/Reset latches, and delay timers into separate LAD networks keeps the control program auditable."
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
    }
  ],
  "status": "review"
} satisfies TopicContent;

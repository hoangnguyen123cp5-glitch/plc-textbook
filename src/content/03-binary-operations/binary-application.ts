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
      "title": "Application Exercise",
      "points": [
        "System State Decomposition: Break complex machine cycles into discrete states: Idle, Running, Rejecting, Batch Complete, and Fault",
        "Fail-Safe Interlocking: Hardwired NC emergency stop (%I0.0) and thermal motor overload (%I0.1) contacts precede all rung power flow",
        "Part Tracking Mechanism: Synchronize sensor edge detection with conveyor mechanical travel time using precision TON timers",
        "Defect Latching: Latch fault flags with Reset-dominant RS blocks; prevent machine restart until the reject bin is cleared and reset is pressed",
        "Batch Management: Automatic counter reset upon batch completion combined with totalizer accumulation in a non-volatile Global DB",
        "Structured Network Layout: Segregate code into logical networks: Network 1 (Safety & E-Stop), Network 2 (Conveyor Control), Network 3 (Inspection Logic), Network 4 (Pusher Actuation), Network 5 (Batch Counter)"
      ],
      "explain": "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station. The process operates as follows: an infeed conveyor motor (M1, %Q0.0) transports cartons past an optical part sensor (%I0.2). An inductive proximity sensor (%I0.3) inspects each carton for the presence of a metallic safety seal. As cartons pass, an IEC counter (CTU) increments the total production count. If a carton passes the optical sensor without triggering the metal proximity sensor, a defective-part condition is latched, and a TON timer initiates a calibrated delay matching the conveyor transit time to the reject pusher. When the timer elapses, a solenoid actuator (%Q0.1) pulses for 500 ms (via a TP timer) to divert the unsealed carton onto a reject chute. Upon reaching a batch count of 50 acceptable cartons, conveyor M1 halts, an acoustic buzzer (%Q0.2) sounds for 3 seconds via a TOF timer, and a packaging gate indexes the batch.",
      "figure": {
        "src": "/images/slides/03-binary-operations/03-bin_carved_045.png",
        "caption": "Figure 3.5: Multi-Step Sequential Machine Control with Latch Flags & Safety Interlocks"
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

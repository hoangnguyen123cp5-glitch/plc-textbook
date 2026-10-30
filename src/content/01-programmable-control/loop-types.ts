import { TopicContent } from '@/types/content';

export default {
  "slug": "loop-types",
  "sourceRef": "1.2",
  "title": "Open-Loop, Closed-Loop and Computerised Control",
  "durationMinutes": 6,
  "summary": "In an open-loop control system, the output process variable has zero influence on the controller action.",
  "body": [
    {
      "heading": "1.2 Open-Loop, Closed-Loop, and Computerised Control",
      "text": "In an open-loop control system, the output process variable has zero influence on the controller action. A classic example is a time-clock street lighting system: lamps turn on at 18:00 and off at 06:00 regardless of whether the sky is overcast by a severe thunderstorm or illuminated by a full moon. When the timer is replaced by a photo-conductive sensor (LDR photocell) measuring ambient light lux, the system becomes closed-loop: the measured light intensity is fed back to the comparator, dynamically switching the luminaires when lux drops below a calibrated threshold. Closed-loop systems exhibit high precision and automatic disturbance rejection, though they introduce loop complexity and potential closed-loop instability (hunting/oscillation). Computerised control refers to closed-loop architectures where digital microprocessors (such as PLCs or industrial PCs) sample process variables at discrete time intervals.",
      "keyPoints": [
        "Open-Loop: Simple topology, low upfront capital cost, unconditionally stable without feedback oscillation, but vulnerable to process disturbances",
        "Closed-Loop: Automatically compensates for dynamic disturbances via continuous negative feedback loops",
        "Control Error Formulation: e(t) = Setpoint (SP) − Process Variable (PV)",
        "Computerised Control: Utilizes digital microprocessors running discrete-time cyclic scan algorithms",
        "Engineering Design Rule: Closed-loop is not universally superior; for non-critical loads with predictable dynamics, open-loop remains the most cost-effective choice"
      ],
      "note": "Avoid the naive assumption that \"closed-loop is always better\". Engineering selection depends on operational tolerances, safety criticality, and project budget. A lawn sprinkler timer rarely justifies the capital expense of soil moisture telemetry."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/pid-block-diagram.jpg",
      "caption": "Figure 1.2: Feedback Loop Dynamics — Closed-Loop Negative Feedback & Disturbance Compensation"
    }
  ],
  "caseStudy": {
    "title": "Thermal Heat Treatment Furnace: Open-Loop vs Closed-Loop PID Dynamics",
    "context": "An industrial steel hardening furnace must maintain internal temperature at 850°C ± 2°C. Under open-loop control (static 70% thyristor firing angle on a timer schedule), when an operator opens the door to load cold alloy billets, temperature plunges by 150°C without the controller ever detecting the drop, ruining the entire metallurgy batch. In closed-loop mode, an Inconel-sheathed Type K thermocouple continuously transmits PV feedback to the S7-1200 PID_Compact block, which automatically boosts power to 95% to reject the thermal draft disturbance.",
    "hardware": [
      "Temperature Sensor: Inconel Mineral-Insulated Type K Thermocouple (0–1200°C)",
      "Signal Module: Siemens SM 1231 AI 4 × 16-bit Thermocouple Card",
      "Power Actuator: Eurotherm EPack SCR Power Controller / Proportional Gas Valve",
      "Control Block: TIA Portal PID_Compact Technology Object with Anti-Windup"
    ],
    "pitfall": "Assuming closed-loop is always superior: For non-critical loads with predictable dynamics (such as warehouse exhaust fans or timed conveyor purges), open-loop control remains the most cost-effective choice without feedback oscillation risks."
  },
  "quiz": [
    {
      "q": "How is the mathematical control error e(t) formulated in a closed-loop system?",
      "options": [
        "e(t) = Setpoint (SP) − Process Variable (PV)",
        "e(t) = Process Variable (PV) + Setpoint (SP)",
        "e(t) = Output Voltage × Current",
        "e(t) = Scan Time / 2"
      ],
      "answer": 0,
      "explain": "In negative feedback control, error is strictly the difference between target setpoint and measured process variable: e(t) = SP − PV."
    },
    {
      "q": "Why is an open-loop system NOT suitable for maintaining an exact chemical vat temperature in variable ambient weather?",
      "options": [
        "Open-loop controllers have slower CPU clock speeds",
        "Open-loop systems have zero feedback and cannot detect or compensate for environmental disturbances",
        "Open-loop systems require special 3-phase wiring",
        "Open-loop controllers cannot run Ladder Logic"
      ],
      "answer": 1,
      "explain": "Because open-loop systems lack feedback sensors, any external disturbance (e.g. cold draft, temperature drop) directly introduces steady-state error."
    }
  ],
  "narration": {
    "vi": "Có ba kiểu điều khiển cơ bản. Vòng hở không có phản hồi — máy giặt đơn giản chạy đúng thời gian rồi dừng dù quần áo chưa sạch. Vòng kín dùng cảm biến đo kết quả thực tế và điều chỉnh liên tục — lò nhiệt đo nhiệt độ rồi bật tắt cho đến khi đạt giá trị đặt. Điều khiển vi tính kết hợp cả hai, thêm khả năng lập trình phức tạp và giao tiếp mạng.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Open-Loop, Closed-Loop, and Computerised Control",
      "points": [
        "Open-Loop: Simple topology, low upfront capital cost, unconditionally stable without feedback oscillation, but vulnerable to process disturbances",
        "Closed-Loop: Automatically compensates for dynamic disturbances via continuous negative feedback loops",
        "Control Error Formulation: e(t) = Setpoint (SP) − Process Variable (PV)",
        "Computerised Control: Utilizes digital microprocessors running discrete-time cyclic scan algorithms",
        "Engineering Design Rule: Closed-loop is not universally superior; for non-critical loads with predictable dynamics, open-loop remains the most cost-effective choice"
      ],
      "explain": "In an open-loop control system, the output process variable has zero influence on the controller action. A classic example is a time-clock street lighting system: lamps turn on at 18:00 and off at 06:00 regardless of whether the sky is overcast by a severe thunderstorm or illuminated by a full moon. When the timer is replaced by a photo-conductive sensor (LDR photocell) measuring ambient light lux, the system becomes closed-loop: the measured light intensity is fed back to the comparator, dynamically switching the luminaires when lux drops below a calibrated threshold. Closed-loop systems exhibit high precision and automatic disturbance rejection, though they introduce loop complexity and potential closed-loop instability (hunting/oscillation). Computerised control refers to closed-loop architectures where digital microprocessors (such as PLCs or industrial PCs) sample process variables at discrete time intervals.",
      "figure": {
        "src": "/images/diagrams/pid-block-diagram.jpg",
        "caption": "Figure 1.2: Feedback Loop Dynamics — Closed-Loop Negative Feedback & Disturbance Compensation"
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

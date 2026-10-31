import { TopicContent } from '@/types/content';

export default {
  "slug": "closed-loop-design",
  "sourceRef": "5.3",
  "title": "Designing a Closed-Loop Control System",
  "durationMinutes": 13,
  "summary": "A closed-loop control system continuously measures the actual physical state of a technological process—the Process Variable (PV)—compares it against the desired target value—the Setpoint (SP)—and...",
  "body": [
    {
      "heading": "5.3 Designing a Closed-Loop Control System",
      "text": "A closed-loop control system continuously measures the actual physical state of a technological process—the Process Variable (PV)—compares it against the desired target value—the Setpoint (SP)—and computes a Control Error: e(t) = SP(t) - PV(t). The controller calculates a corrective Manipulated Variable (MV / Output) directed to a physical actuator (such as a modulating control valve, electric heating element, or variable-speed pump). The standard continuous PID equation is formulated as: u(t) = Kp * [ e(t) + (1 / Ti) * ∫ e(τ) dτ + Td * (de(t) / dt) ]. The Proportional term (Kp) produces an output directly proportional to the current error; higher Kp increases responsiveness but can induce closed-loop instability and cannot eliminate steady-state offset alone. The Integral term (Ti) continuously integrates historical error over time, steadily driving the control output until steady-state error is completely eliminated (e(t) = 0). The Derivative term (Td) acts on the rate of change of the error, predicting future error trends to provide damping against rapid overshoots. In discrete microprocessor implementations (PLCs), the continuous equation is discretized using a fixed sampling time (Ts), requiring execution inside a strictly deterministic cyclic interrupt.",
      "keyPoints": [
        "Closed-Loop Architecture: Setpoint (SP), Measurement Transmitter, Error Comparator, PID Controller, Final Control Element (Actuator), and Plant Dynamics",
        "Control Error Formulation: e(t) = SP(t) - PV(t); positive error indicates the process variable is below target; negative error indicates overshoot",
        "Proportional Gain (Kp): Accelerates loop response speed; proportional to current error; excessive gain causes high-frequency oscillations and instability",
        "Integral Time (Ti): Eliminates steady-state offset by accumulating error over time; smaller Ti produces more aggressive reset action; excessive integration causes slow hunting",
        "Derivative Time (Td): Provides anticipatory damping proportional to error slope; improves stability in sluggish thermal systems; highly sensitive to high-frequency sensor noise",
        "Discrete Sampling Period (Ts): The fixed time interval between consecutive algorithm executions; must be significantly faster than the process time constant (typically Ts <= 0.1 * Tau)",
        "Disturbance Rejection: The primary industrial purpose of closed loop control is maintaining PV at SP despite external load changes (e.g. cold fluid inrush into a heated vessel)"
      ],
      "note": "Never use the Derivative term (Td) on noisy, fast-responding process variables such as flow rate or liquid pressure! High-frequency measurement noise will be amplified by the derivative derivative term (de/dt), causing erratic, violent chattering of modulating control valves."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/pid-block-diagram.jpg",
      "caption": "Figure 10.1: Standard Industrial Closed-Loop Feedback Control Block Diagram with Disturbance Input"
    }
  ],
  "quiz": [
    {
      "q": "What is the role of the Integral (I) term in a standard PID controller algorithm?",
      "options": [
        "To eliminate steady-state error by continuously accumulating error over time",
        "To predict future trends based on error rate of change",
        "To provide instantaneous reaction proportional to error",
        "To filter out measurement noise"
      ],
      "answer": 0,
      "explain": "The integral action integrates the error over time, forcing control effort to increase until steady-state error is driven precisely to zero."
    }
  ],
  "narration": {
    "vi": "Vòng kín nghĩa là hệ thống tự đo kết quả của chính mình và điều chỉnh liên tục. Cảm biến đo giá trị thực, bộ điều khiển tính sai lệch so với giá trị đặt, rồi ra lệnh điều chỉnh thiết bị chấp hành. Để thiết kế tốt, bạn cần hiểu đặc tính hệ thống — độ trễ, thời gian đáp ứng, độ khuếch đại — vì những thông số đó quyết định bộ PID cần chỉnh như thế nào.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Designing a Closed-Loop Control System",
      "points": [
        "Closed-Loop Architecture: Setpoint (SP), Measurement Transmitter, Error Comparator, PID Controller, Final Control Element (Actuator), and Plant Dynamics",
        "Control Error Formulation: e(t) = SP(t) - PV(t); positive error indicates the process variable is below target; negative error indicates overshoot",
        "Proportional Gain (Kp): Accelerates loop response speed; proportional to current error; excessive gain causes high-frequency oscillations and instability",
        "Integral Time (Ti): Eliminates steady-state offset by accumulating error over time; smaller Ti produces more aggressive reset action; excessive integration causes slow hunting",
        "Derivative Time (Td): Provides anticipatory damping proportional to error slope; improves stability in sluggish thermal systems; highly sensitive to high-frequency sensor noise",
        "Discrete Sampling Period (Ts): The fixed time interval between consecutive algorithm executions; must be significantly faster than the process time constant (typically Ts <= 0.1 * Tau)",
        "Disturbance Rejection: The primary industrial purpose of closed loop control is maintaining PV at SP despite external load changes (e.g. cold fluid inrush into a heated vessel)"
      ],
      "explain": "A closed-loop control system continuously measures the actual physical state of a technological process—the Process Variable (PV)—compares it against the desired target value—the Setpoint (SP)—and computes a Control Error: e(t) = SP(t) - PV(t). The controller calculates a corrective Manipulated Variable (MV / Output) directed to a physical actuator (such as a modulating control valve, electric heating element, or variable-speed pump). The standard continuous PID equation is formulated as: u(t) = Kp * [ e(t) + (1 / Ti) * ∫ e(τ) dτ + Td * (de(t) / dt) ]. The Proportional term (Kp) produces an output directly proportional to the current error; higher Kp increases responsiveness but can induce closed-loop instability and cannot eliminate steady-state offset alone. The Integral term (Ti) continuously integrates historical error over time, steadily driving the control output until steady-state error is completely eliminated (e(t) = 0). The Derivative term (Td) acts on the rate of change of the error, predicting future error trends to provide damping against rapid overshoots. In discrete microprocessor implementations (PLCs), the continuous equation is discretized using a fixed sampling time (Ts), requiring execution inside a strictly deterministic cyclic interrupt.",
      "figure": {
        "src": "/images/diagrams/pid-block-diagram.jpg",
        "caption": "Figure 10.1: Standard Industrial Closed-Loop Feedback Control Block Diagram with Disturbance Input"
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

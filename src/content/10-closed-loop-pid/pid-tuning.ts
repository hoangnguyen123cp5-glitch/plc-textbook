import { TopicContent } from '@/types/content';

export default {
  "slug": "pid-tuning",
  "title": "Pre-tuning, Fine-tuning and Commissioning",
  "durationMinutes": 13,
  "summary": "Tuning PID parameters (Kp, Ti, Td) manually using trial-and-error in a live plant is tedious and risks destabilizing expensive machinery.",
  "body": [
    {
      "heading": "Pre-tuning, Fine-tuning and Commissioning",
      "text": "Tuning PID parameters (Kp, Ti, Td) manually using trial-and-error in a live plant is tedious and risks destabilizing expensive machinery. TIA Portal integrates a comprehensive graphical PID Commissioning dashboard featuring real-time trend recording and built-in auto-tuning algorithms. PID_Compact supports five distinct operating modes: Inactive (Mode 0), Pre-Tuning (Mode 1), Fine-Tuning (Mode 2), Automatic Mode (Mode 3), and Manual Mode (Mode 4). Pre-Tuning executes an open-loop step response test: the controller applies an output step, measures process dead time (delay) and maximum rate of temperature/pressure rise (inflection point), and calculates baseline Kp, Ti, and Td parameters using an adapted Ziegler-Nichols algorithm. Fine-Tuning executes a closed-loop oscillation test around the current operating point: the controller introduces controlled limit-cycle oscillations, analyzes the natural oscillation period and amplitude, and optimizes the parameters for minimal overshoot and rapid disturbance rejection. In production, operators switch between Manual Mode (directly entering output percentage from the HMI) and Automatic Mode using Bumpless Transfer, which automatically pre-loads internal registers so the control valve does not jump when mode transitions occur.",
      "keyPoints": [
        "TIA Portal Commissioning Dashboard: Interactive graphical panel displaying live trends of Setpoint (black), Process Variable (green), and Output (red)",
        "Pre-Tuning (Mode 1): Open-loop step excitation; analyzes plant dead time and inflection tangent; derives baseline Kp, Ti, Td parameters rapidly",
        "Fine-Tuning (Mode 2): Closed-loop oscillation method; induces small controlled limit-cycle oscillations; optimizes damping and eliminates overshoot",
        "Automatic Mode (Mode 3): Normal closed-loop execution continuously regulating PV to SP using active PID parameters",
        "Manual Mode (Mode 4): Overrides automatic calculation; operator manually enters fixed output percentage (0.0% to 100.0%) for maintenance",
        "Bumpless Transfer: When switching from Manual to Auto (or vice versa), the controller seamlessly matches internal states to prevent sudden valve movements",
        "Parameter Retention: Calculated auto-tuning parameters are permanently saved to non-volatile Load Memory upon operator confirmation"
      ],
      "note": "Before initiating Pre-Tuning, ensure the process variable is in a steady state and far enough below the target setpoint to permit a step output! If Pre-Tuning is started when the process is already fluctuating or near setpoint, the tuning algorithm will abort with an error."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/10-closed-loop-pid/PLC___Slide__020.png",
      "caption": "Figure 10.3: TIA Portal PID Commissioning Dashboard: Real-Time Pre-Tuning & Fine-Tuning Curves"
    }
  ],
  "quiz": [
    {
      "q": "In TIA Portal PID Commissioning, what is the difference between Pre-Tuning and Fine-Tuning?",
      "options": [
        "Pre-Tuning applies an open-loop step change to identify plant parameters; Fine-Tuning tunes closed-loop oscillation response near the setpoint",
        "Pre-Tuning is for AC motors; Fine-Tuning is for DC motors",
        "Pre-Tuning requires a licensed USB dongle",
        "There is no difference"
      ],
      "answer": 0,
      "explain": "Pre-tuning calculates baseline PID parameters via step inflection; Fine-tuning optimizes overshoot, damping, and settling time under active closed-loop feedback."
    }
  ],
  "narration": {
    "vi": "TIA Portal có công cụ tự động chỉnh định PID gồm hai bước. Pre-tuning chạy trước — PLC tự kích thích hệ thống rồi ước lượng tham số thô. Fine-tuning chạy sau khi hệ thống đang ở trạng thái ổn định, tinh chỉnh lại để giảm vọt lố và dao động. Sau khi tuning xong, bạn vào tab Commissioning để xem đồ thị đáp ứng và xác nhận kết quả trước khi lưu tham số.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Pre-tuning, Fine-tuning and Commissioning",
      "points": [
        "TIA Portal Commissioning Dashboard: Interactive graphical panel displaying live trends of Setpoint (black), Process Variable (green), and Output (red)",
        "Pre-Tuning (Mode 1): Open-loop step excitation; analyzes plant dead time and inflection tangent; derives baseline Kp, Ti, Td parameters rapidly",
        "Fine-Tuning (Mode 2): Closed-loop oscillation method; induces small controlled limit-cycle oscillations; optimizes damping and eliminates overshoot",
        "Automatic Mode (Mode 3): Normal closed-loop execution continuously regulating PV to SP using active PID parameters",
        "Manual Mode (Mode 4): Overrides automatic calculation; operator manually enters fixed output percentage (0.0% to 100.0%) for maintenance",
        "Bumpless Transfer: When switching from Manual to Auto (or vice versa), the controller seamlessly matches internal states to prevent sudden valve movements",
        "Parameter Retention: Calculated auto-tuning parameters are permanently saved to non-volatile Load Memory upon operator confirmation"
      ],
      "explain": "Tuning PID parameters (Kp, Ti, Td) manually using trial-and-error in a live plant is tedious and risks destabilizing expensive machinery. TIA Portal integrates a comprehensive graphical PID Commissioning dashboard featuring real-time trend recording and built-in auto-tuning algorithms. PID_Compact supports five distinct operating modes: Inactive (Mode 0), Pre-Tuning (Mode 1), Fine-Tuning (Mode 2), Automatic Mode (Mode 3), and Manual Mode (Mode 4). Pre-Tuning executes an open-loop step response test: the controller applies an output step, measures process dead time (delay) and maximum rate of temperature/pressure rise (inflection point), and calculates baseline Kp, Ti, and Td parameters using an adapted Ziegler-Nichols algorithm. Fine-Tuning executes a closed-loop oscillation test around the current operating point: the controller introduces controlled limit-cycle oscillations, analyzes the natural oscillation period and amplitude, and optimizes the parameters for minimal overshoot and rapid disturbance rejection. In production, operators switch between Manual Mode (directly entering output percentage from the HMI) and Automatic Mode using Bumpless Transfer, which automatically pre-loads internal registers so the control valve does not jump when mode transitions occur.",
      "figure": {
        "src": "/images/slides/10-closed-loop-pid/PLC___Slide__020.png",
        "caption": "Figure 10.3: TIA Portal PID Commissioning Dashboard: Real-Time Pre-Tuning & Fine-Tuning Curves"
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

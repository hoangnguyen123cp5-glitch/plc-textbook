import { TopicContent } from '@/types/content';

export default {
  "slug": "pwm-output",
  "sourceRef": "4.3",
  "title": "Pulse Output with PWM",
  "durationMinutes": 11,
  "summary": "Pulse Width Modulation (PWM) is a solid-state control technique where a digital output is switched between ON and OFF at a constant carrier frequency, while dynamically modulating the ratio of ON t...",
  "body": [
    {
      "heading": "4.3 Pulse Output with PWM",
      "text": "Pulse Width Modulation (PWM) is a solid-state control technique where a digital output is switched between ON and OFF at a constant carrier frequency, while dynamically modulating the ratio of ON time to the total cycle period (known as the Duty Cycle: 0.0% to 100.0%). The S7-1200 controller with transistor outputs (DC/DC/DC variants) incorporates up to four dedicated hardware pulse generators (Pulse 1 through Pulse 4) capable of generating PWM signals on outputs %Q0.0, %Q0.1, %Q0.2, and %Q0.3 at frequencies up to 100 kHz. In TIA Portal, configuring a pulse generator as PWM allows the automation engineer to define the timebase (milliseconds or microseconds) and the period duration (e.g. 10 ms for a 100 Hz signal). Programmatic control is executed via the CTRL_PWM instruction block, where the user passes a numeric duty cycle (scaled from 0 to 100, or 0 to 10,000 for high resolution). By modulating duty cycle, the average electrical power delivered to a load is controlled with near-zero heat dissipation in the switching transistor. Industrial applications include modulating electric heating elements via solid-state relays (SSR), controlling proportional hydraulic solenoid valves, and modulating small DC motor velocities.",
      "keyPoints": [
        "PWM Fundamental Principle: Fixed carrier frequency (period T); modulated pulse width (ON time t_on); Average Voltage = V_supply * (t_on / T)",
        "Hardware Pulse Generators: Up to 4 on-board hardware pulse generators operating on fast transistor outputs %Q0.0–%Q0.3; up to 100 kHz switching speed",
        "Zero-Loss Solid-State Switching: Power MOSFET transistors operate purely saturated (ON) or cutoff (OFF), minimizing internal thermal dissipation",
        "CTRL_PWM System Block: System instruction block that activates/deactivates the pulse generator and writes new duty cycle values on the fly",
        "Timebase Options: Microseconds (µs) or milliseconds (ms); selectable period duration from 10 µs to 65,535 ms",
        "Duty Cycle Formatting: Scaled as Hundredths (0 to 10,000 where 5000 = 50.00% duty cycle) or integer percent (0 to 100)",
        "Industrial Applications: Proportional heating chamber control via SSRs, LED industrial lighting dimming, chemical metering pump pulse stroking"
      ],
      "note": "PWM pulse generation is ONLY supported on DC/DC/DC CPUs with solid-state transistor outputs! Never attempt to configure PWM on AC/DC/Relay CPUs; electromechanical relays have a maximum switching rate of 1 Hz, and attempting to switch them with PWM will destroy the mechanical relay contacts within minutes."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/09-high-speed-counting/PL___Slide_4_020.jpeg",
      "caption": "Figure 9.3: Pulse Width Modulation (PWM) Duty Cycle Control on Fast S7-1200 Transistor Outputs"
    }
  ],
  "quiz": [
    {
      "q": "What parameter of a Pulse Width Modulation (PWM) signal is modulated to control the power delivered to a DC heater or motor?",
      "options": [
        "Carrier frequency",
        "Duty cycle (ratio of ON time to total period)",
        "Output voltage amplitude",
        "Phase shift"
      ],
      "answer": 1,
      "explain": "PWM holds frequency constant while modulating the duty cycle percentage (0% to 100%) to vary the average power transferred."
    }
  ],
  "narration": {
    "vi": "PWM là tín hiệu xung vuông với tần số cố định nhưng độ rộng xung thay đổi được. Duty cycle càng cao thì thiết bị nhận càng nhiều năng lượng. S7-1200 hỗ trợ PWM trực tiếp trên ngõ ra transistor. Bạn kích hoạt trong Device Configuration, rồi dùng instruction CTRL_PWM để thay đổi duty cycle từ chương trình PLC mà không cần dừng xung.",
    "durationSec": 28,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Pulse Output with PWM",
      "points": [
        "PWM Fundamental Principle: Fixed carrier frequency (period T); modulated pulse width (ON time t_on); Average Voltage = V_supply * (t_on / T)",
        "Hardware Pulse Generators: Up to 4 on-board hardware pulse generators operating on fast transistor outputs %Q0.0–%Q0.3; up to 100 kHz switching speed",
        "Zero-Loss Solid-State Switching: Power MOSFET transistors operate purely saturated (ON) or cutoff (OFF), minimizing internal thermal dissipation",
        "CTRL_PWM System Block: System instruction block that activates/deactivates the pulse generator and writes new duty cycle values on the fly",
        "Timebase Options: Microseconds (µs) or milliseconds (ms); selectable period duration from 10 µs to 65,535 ms",
        "Duty Cycle Formatting: Scaled as Hundredths (0 to 10,000 where 5000 = 50.00% duty cycle) or integer percent (0 to 100)",
        "Industrial Applications: Proportional heating chamber control via SSRs, LED industrial lighting dimming, chemical metering pump pulse stroking"
      ],
      "explain": "Pulse Width Modulation (PWM) is a solid-state control technique where a digital output is switched between ON and OFF at a constant carrier frequency, while dynamically modulating the ratio of ON time to the total cycle period (known as the Duty Cycle: 0.0% to 100.0%). The S7-1200 controller with transistor outputs (DC/DC/DC variants) incorporates up to four dedicated hardware pulse generators (Pulse 1 through Pulse 4) capable of generating PWM signals on outputs %Q0.0, %Q0.1, %Q0.2, and %Q0.3 at frequencies up to 100 kHz. In TIA Portal, configuring a pulse generator as PWM allows the automation engineer to define the timebase (milliseconds or microseconds) and the period duration (e.g. 10 ms for a 100 Hz signal). Programmatic control is executed via the CTRL_PWM instruction block, where the user passes a numeric duty cycle (scaled from 0 to 100, or 0 to 10,000 for high resolution). By modulating duty cycle, the average electrical power delivered to a load is controlled with near-zero heat dissipation in the switching transistor. Industrial applications include modulating electric heating elements via solid-state relays (SSR), controlling proportional hydraulic solenoid valves, and modulating small DC motor velocities.",
      "figure": {
        "src": "/images/slides/09-high-speed-counting/PL___Slide_4_020.jpeg",
        "caption": "Figure 9.3: Pulse Width Modulation (PWM) Duty Cycle Control on Fast S7-1200 Transistor Outputs"
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

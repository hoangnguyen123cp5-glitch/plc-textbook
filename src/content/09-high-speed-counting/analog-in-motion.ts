import { TopicContent } from '@/types/content';

export default {
  "slug": "analog-in-motion",
  "sourceRef": "4.5",
  "title": "Analog Signal Handling in Motion Applications",
  "durationMinutes": 9,
  "summary": "While pulse-train output (PTO) is dominant for stepper and low-cost servo drives, heavy industrial motion applications—including large conveyor drives, centrifugal extruders, web unwinders, and ove...",
  "body": [
    {
      "heading": "4.5 Analog Signal Handling in Motion Applications",
      "text": "While pulse-train output (PTO) is dominant for stepper and low-cost servo drives, heavy industrial motion applications—including large conveyor drives, centrifugal extruders, web unwinders, and overhead bridge cranes—frequently utilize variable frequency drives (VFDs) and heavy-duty AC servodrives commanded via analog velocity setpoints. The S7-1200 interfaces to these drives via high-resolution analog output modules (SM 1232, 14-bit) generating bipolar ±10V DC speed commands where polarity dictates motor rotation direction (-10V = full speed reverse, 0V = standstill, +10V = full speed forward). Closed-loop position regulation is implemented within the PLC: the controller reads instantaneous position feedback from an incremental encoder connected to an HSC channel or an absolute magnetostrictive linear transducer connected to an analog input channel. In software, a position error comparator continuously computes: e = Target_Position - Actual_Position, multiplying error by a position proportional gain to generate the analog speed setpoint. To ensure smooth motion, software S-curve ramp generators profile the speed demand, preventing abrupt acceleration steps that cause mechanical backlash and belt slipping.",
      "keyPoints": [
        "Bipolar Analog Interface (±10V): Industry standard velocity reference; voltage magnitude commands speed, polarity commands direction",
        "High-Resolution Analog Output: 14-bit SM 1232 module provides 16,384 discrete steps, ensuring smooth acceleration without velocity stepping",
        "Closed-Loop Position Loop: PLC executes closed-loop algorithm: reads position via HSC or linear transducer, computes error, outputs analog speed demand",
        "Linear Displacement Transducers: Magnetostrictive or optical linear scales outputting 0–10V or 4–20mA provide absolute carriage position feedback",
        "Software Velocity Profiling: Ramping algorithms govern acceleration, steady-state run, deceleration, and creep-to-target phases to prevent mechanical overshoot",
        "Analog Torque Limiting: Secondary analog output channels command drive torque limits to protect sensitive web materials from breaking during winding",
        "Drive Ready/Fault Interlocks: Digital handshake lines (Drive Enabled, Drive Running, Drive Faulted) wired to PLC discrete I/O supervise drive safety"
      ],
      "note": "Always bond the shield of the ±10V analog speed reference cable directly to the metal enclosure grounding bar using a high-conductivity saddle clamp. Electrical noise induced by the adjacent motor power inverter will cause analog speed setpoint jitter, leading to motor hunting and rough bearing vibration."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/09-high-speed-counting/PL___Slide_4_013.jpeg",
      "caption": "Figure 9.5: ±10V Bipolar Analog Velocity Setpoint Interface to AC Variable Frequency Drives"
    }
  ],
  "quiz": [
    {
      "q": "What analog signal format is conventionally used to command bidirectional velocity on AC Variable Frequency Drives?",
      "options": [
        "0–10V unipolar",
        "±10V bipolar voltage signal",
        "0–20mA current loop",
        "5V TTL logic"
      ],
      "answer": 1,
      "explain": "A ±10V bipolar command represents full reverse speed at −10V, standstill at 0V, and full forward speed at +10V."
    }
  ],
  "narration": {
    "vi": "Trong ứng dụng motion control, tín hiệu analog thường dùng để đặt tốc độ hoặc lực. Ví dụ, joystick 0–10V có thể ánh xạ sang tốc độ 0–3000 vòng mỗi phút. PLC đọc giá trị analog qua module AI, chuẩn hóa về đơn vị kỹ thuật, rồi truyền xuống drive. Điều quan trọng là lọc nhiễu và giới hạn tốc độ thay đổi để tránh giật cơ học.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

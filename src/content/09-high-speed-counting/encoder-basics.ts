import { TopicContent } from '@/types/content';

export default {
  "slug": "encoder-basics",
  "sourceRef": "4.1",
  "title": "Encoder Construction and Operating Principle",
  "durationMinutes": 11,
  "summary": "A rotary encoder converts mechanical angular displacement and rotational velocity into digital electrical pulse trains.",
  "body": [
    {
      "heading": "4.1 Encoder Construction and Operating Principle",
      "text": "A rotary encoder converts mechanical angular displacement and rotational velocity into digital electrical pulse trains. In factory automation, incremental optical rotary encoders are the predominant feedback device for conveyor synchronization, web winders, and motor shafts. The physical construction comprises a precision stainless-steel shaft, an optical glass or etched metal disk patterned with radial transparent and opaque slits, an array of infrared light-emitting diodes (LEDs), and matching photodiode receivers. As the shaft rotates, the grating chops the infrared beams, generating two square-wave electrical signals: Channel A and Channel B. Crucially, the optical masks for Channel A and Channel B are physically offset by 90 electrical degrees: a geometric relationship known as Quadrature. By examining the phase relationship, the controller detects direction: when rotating clockwise (CW), Channel A leads Channel B; when rotating counter-clockwise (CCW), Channel B leads Channel A. A third channel—the Z Index channel—generates exactly one narrow pulse per full 360-degree mechanical revolution, establishing an absolute physical zero reference marker for machine homing.",
      "keyPoints": [
        "Optical Grating Mechanics: Etched glass/metal disk with alternating transparent slits; optical resolution rated in Pulses Per Revolution (PPR, e.g. 1024 or 2048 PPR)",
        "Quadrature Phase Shift (90°): Channel A leads Channel B during forward rotation; Channel B leads Channel A during reverse rotation, enabling directional sensing",
        "Z Index Marker Channel: Fires exactly one pulse per 360° mechanical turn; provides precision zero-datum homing reference independent of tooth count",
        "Electrical Output Interfaces: Push-Pull (HTL 24VDC, standard for PLC inputs), Open Collector (NPN/PNP), or Differential Line Driver (RS422 / TTL 5VDC for high noise immunity)",
        "Velocity Calculation Formula: Rotational Velocity (RPM) = (Pulses Counted per second / PPR) * 60",
        "Incremental vs Absolute Encoders: Incremental encoders lose position upon power loss (requiring homing at startup); absolute encoders report true position immediately via Gray code"
      ],
      "note": "Never use 24VDC push-pull (HTL) single-ended encoder signals over cable runs longer than 20 meters near powerful VFD cables! Fast switching edges degrade over cable capacitance. For long distances, use differential RS422 (line driver) encoders paired with an S7-1200 high-speed differential signal board (SB 1221 200kHz)."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/09-high-speed-counting/PL___Slide_4_001.jpeg",
      "caption": "Figure 9.1: Incremental Optical Rotary Encoder: Quadrature A/B Phase Shift & Z Index Pulse"
    }
  ],
  "quiz": [
    {
      "q": "Why are the A and B pulse channels of an incremental optical encoder shifted by 90 electrical degrees (quadrature)?",
      "options": [
        "To allow the controller to determine both rotation speed and direction of rotation",
        "To double the supply voltage",
        "To provide electrical redundancy",
        "To reduce mechanical vibration"
      ],
      "answer": 0,
      "explain": "Phase quadrature allows phase detection: if A leads B, rotation is clockwise; if B leads A, rotation is counter-clockwise."
    }
  ],
  "narration": {
    "vi": "Encoder tăng dần là cảm biến vị trí phổ biến nhất trong tự động hóa. Nó tạo ra hai kênh xung lệch pha 90 độ, gọi là A và B, để PLC biết chiều quay. Kênh Z là xung zero — xuất hiện đúng một lần mỗi vòng, dùng để căn chỉnh điểm gốc. Độ phân giải thường tính bằng xung mỗi vòng, ví dụ 1000 PPR nghĩa là mỗi vòng có 1000 xung.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

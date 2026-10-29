import { TopicContent } from '@/types/content';

export default {
  "slug": "analog-wiring",
  "sourceRef": "4.2",
  "title": "Wiring Analog Inputs and Outputs",
  "durationMinutes": 9,
  "summary": "Proper physical wiring and shielding are critical to prevent ground loops and electromagnetic interference from corrupting sensitive analog readings.",
  "body": [
    {
      "heading": "4.2 Wiring Analog Inputs and Outputs",
      "text": "Proper physical wiring and shielding are critical to prevent ground loops and electromagnetic interference from corrupting sensitive analog readings. Analog wiring must utilize individually shielded twisted-pair (STP) cables routed in grounded metallic conduits segregated from 400VAC motor power conductors by at least 200 mm. Grounding the cable shield requires strict discipline: the overall shield must be grounded at ONE end only—typically at the PLC control panel's dedicated analog grounding busbar using a 360-degree shield clamp. Grounding both ends of a cable shield creates circulating ground loop currents caused by earth potential differences between distant plant locations, introducing devastating 50Hz/60Hz AC ripple into the analog measurement. For 2-wire loop-powered transmitters, the +24VDC power supply connects to the transmitter positive terminal, the transmitter negative terminal connects to the PLC analog input channel (+), and the PLC analog common (-) connects back to 0VDC (M). For analog outputs driving proportional valves or VFD speed references, two-wire shielded cables connect the PLC AQ channel directly to the actuator input impedance load.",
      "keyPoints": [
        "Shielded Twisted-Pair (STP) Cabling: Twisting cancels magnetic noise induction; braided copper or foil shield repels electrostatic noise fields",
        "Single-Point Shield Grounding Rule: Terminate cable shields strictly at the control enclosure end using 360-degree conductive saddle clamps; leave the field end isolated",
        "Ground Loop Hazard: Connecting cable shields to ground at both ends induces large circulating ground currents, generating artificial measurement fluctuations",
        "2-Wire Transmitter Topology: 24VDC (+) -> Transmitter (+) -> Transmitter (-) -> PLC AI (+) -> PLC AI (-) -> Power Supply 0VDC (M)",
        "4-Wire Transmitter Topology: External Power connects to Line/Neutral or L+/M; isolated analog output terminals connect to PLC AI (+) and AI (-)",
        "Analog Output Wiring: PLC AQ channels (0–10V or 4–20mA) connect to field actuators; observe maximum load resistance limits (typically <= 500 ohms for current outputs)",
        "Cable Conduit Segregation: Maintain >= 200 mm physical spacing between analog signal conduits and 3-phase AC motor or inverter power cables"
      ],
      "note": "If an analog reading in TIA Portal fluctuates wildly when a nearby motor starts, the root cause is almost always an ungrounded cable shield, a shield grounded at both ends creating a ground loop, or routing signal cables inside the same wire duct as inverter output leads."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/05-analog-signals/05-ana_carved_017.png",
      "caption": "Figure 5.2: 2-Wire (Loop-Powered) vs 4-Wire Transmitter Wiring and Shield Grounding Standards"
    }
  ],
  "quiz": [
    {
      "q": "How must the shield of an analog signal cable be grounded to prevent ground loops?",
      "options": [
        "Ground both ends securely to separate machine frames",
        "Ground the shield at only ONE end (typically at the PLC cabinet side) to an equipotential PE busbar",
        "Leave the shield disconnected at both ends",
        "Connect the shield to 24VDC positive"
      ],
      "answer": 1,
      "explain": "Grounding analog shields at a single point prevents circulating noise currents caused by earth potential differences between distant plant locations."
    }
  ],
  "narration": {
    "vi": "Đấu dây analog cần cẩn thận hơn tín hiệu số vì nhiễu rất dễ ảnh hưởng đến giá trị đo. Dùng cáp xoắn đôi có vỏ bọc chống nhiễu và nối đất vỏ bọc tại một đầu duy nhất để tránh vòng đất. Với cảm biến hai dây loại dòng, nối nguồn qua cảm biến rồi về đầu vào analog của module. Với cảm biến ba hoặc bốn dây, nguồn cảm biến và tín hiệu được tách riêng. Kiểm tra cực tính cộng và trừ trước khi cấp nguồn.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

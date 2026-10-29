import { TopicContent } from '@/types/content';

export default {
  "slug": "analog-expansion",
  "sourceRef": "6.4",
  "title": "Connecting Analog Expansion Modules",
  "durationMinutes": 8,
  "summary": "Analog expansion modules are installed when a process requires acquiring multi-channel continuous sensor data or generating analog commands.",
  "body": [
    {
      "heading": "6.4 Connecting Analog Expansion Modules",
      "text": "Analog expansion modules are installed when a process requires acquiring multi-channel continuous sensor data or generating analog commands. Available modules include the SM 1231 Analog Input module (4 AI or 8 AI with 13-bit or 16-bit resolution supporting 0–10V, ±10V, 0–20mA, or 4–20mA), the SM 1232 Analog Output module (2 AQ or 4 AQ with 14-bit resolution), the SM 1234 combo module (4 AI / 2 AQ), and specialized SM 1231 RTD and Thermocouple temperature modules. Analog modules attach to the right of the CPU via the sliding bus connector. In TIA Portal, each analog channel is configured individually in the module properties: selecting measurement type (Voltage, Current, or Thermal Sensor), measurement range, and digital interference frequency filtering (50 Hz, 60 Hz, or 400 Hz). The module firmware automatically executes analog-to-digital conversions, filtering out high-frequency electrical noise and updating process image input registers (%IW68, %IW70, etc.) on every scan. Analog output channels (%QW64, %QW66) are similarly configured for 0–10V or 4–20mA and parameterized with safe fallback states in the event of CPU STOP.",
      "keyPoints": [
        "Analog Module Catalog: SM 1231 (4AI / 8AI, 13-bit / 16-bit), SM 1232 (2AQ / 4AQ, 14-bit), SM 1234 (4AI / 2AQ), SM 1231 RTD (Pt100/Pt1000), SM 1231 TC",
        "Channel-by-Channel Configuration: In TIA Portal properties, each input channel is parameterized independently for Voltage (0–10V, ±10V) or Current (4–20mA, 0–20mA)",
        "Interference Frequency Suppression: Hardware ADC integration time configured for 50 Hz or 60 Hz to reject AC line hum with >60 dB attenuation",
        "Hardware Diagnostic Interrupts: Enable wire break and low-limit/high-limit alarms directly in hardware properties; triggers OB82 upon loop failure",
        "Analog Output Fallback Strategy: Configure output channels to either hold last value or force to safe zero (0V / 0mA) upon CPU transitioning to STOP",
        "RTD Temperature Measurement: Pt100/Pt1000 sensors wire directly using 2-wire, 3-wire, or 4-wire compensation; raw integer = temperature x 10 (e.g. 250 = 25.0°C)",
        "Shield Connection: Terminate analog cable shields directly to the grounded metal shield bracket supplied with every S7-1200 analog module"
      ],
      "note": "When configuring 4–20mA current inputs on an SM 1231 module, always enable the 'Wire Break' diagnostic alarm in TIA Portal. If a field sensor wire is severed, the input current drops below 3.6mA, immediately triggering a diagnostic event in the CPU without requiring complex custom ladder code."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/07-system-design/PLC__Slide_7_007.jpg",
      "caption": "Figure 7.4: SM 1231 Analog Input Module Installation, Noise Filtering, and Shield Clamping"
    }
  ],
  "quiz": [
    {
      "q": "What happens to the total 5VDC backplane current budget when adding multiple analog expansion cards?",
      "options": [
        "The CPU internal 5V supply provides up to ~1400–1600mA; if module draw exceeds this, an expansion power supply or decoupling must be used",
        "Analog modules produce their own 5V power",
        "Backplane power is unlimited",
        "Backplane voltage drops to 0V"
      ],
      "answer": 0,
      "explain": "The CPU internal backplane regulator has a strict maximum mA capacity; designers must sum the backplane current draw of all attached cards."
    }
  ],
  "narration": {
    "vi": "Mở rộng analog dùng SM 1231 cho đầu vào và SM 1232 cho đầu ra. Ngoài ra có module chuyên dụng cho cảm biến nhiệt điện trở RTD như SM 1231 AI 4xRTD và module cặp nhiệt ngẫu thermocouple. Các module này có độ phân giải cao và tích hợp sẵn bộ lọc nhiễu. Khi cấu hình trong TIA Portal, chọn đúng loại cảm biến và bù nhiệt đầu lạnh nếu dùng thermocouple. Địa chỉ vùng nhớ analog được hiển thị ngay sau khi kéo module vào rack.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

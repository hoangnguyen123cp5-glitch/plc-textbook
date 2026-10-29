import { TopicContent } from '@/types/content';

export default {
  "slug": "analog-modules",
  "sourceRef": "4.3",
  "title": "S7-1200 Analog Modules",
  "durationMinutes": 8,
  "summary": "The S7-1200 hardware architecture provides both integrated and expandable analog processing capabilities.",
  "body": [
    {
      "heading": "4.3 S7-1200 Analog Modules",
      "text": "The S7-1200 hardware architecture provides both integrated and expandable analog processing capabilities. All CPU models (1211C through 1217C) feature two integrated analog input channels on the CPU terminal strip, mapped to peripheral word addresses %IW64 and %IW66. These on-board channels measure 0–10V DC with 10-bit resolution (1,024 discrete steps) and an input impedance of 100 k-ohms. To expand capacity or introduce analog outputs, engineers install Signal Boards (SB) or Signal Modules (SM). The SB 1231 provides 1 AI channel (12-bit), while the SB 1232 provides 1 AQ channel (12-bit). Dense modular expansion is achieved via SM 1231 analog input modules (available in 4-channel or 8-channel variants with 13-bit or 16-bit resolution supporting 0–10V, ±10V, 0–20mA, and 4–20mA), SM 1232 analog output modules (2 or 4 channels, 14-bit), and SM 1234 combo modules (4 AI / 2 AQ). Siemens uses a standardized internal integer representation: regardless of whether a module has 10-bit, 12-bit, or 16-bit hardware resolution, the ADC firmware automatically left-shifts the conversion result into a standardized 16-bit integer spanning 0 to 27648 for nominal range.",
      "keyPoints": [
        "Integrated CPU Analog Inputs: 2 channels (0–10V DC only), 10-bit hardware resolution, mapped by default to addresses %IW64 and %IW66",
        "Siemens Standard Integer Range: Nominal full-scale signal (0–10V or 4–20mA) corresponds to integer values 0 to 27648",
        "Overrange and Underrange Limits: 27649 to 32511 represents overrange (linear up to 118.5%); 32512 to 32767 represents digital overflow saturation",
        "Negative Limits (Bipolar): Nominal bipolar range (-10V to +10V) spans integer values -27648 to +27648",
        "Signal Board Expansion: SB 1231 (1 AI, 12-bit) or SB 1232 (1 AQ, 12-bit) snaps into the CPU faceplate without altering DIN-rail width",
        "Signal Module Expansion: SM 1231 (4AI/8AI, 13/16-bit), SM 1232 (2AQ/4AQ, 14-bit), SM 1234 (4AI/2AQ combo), and RTD/TC temperature modules",
        "Hardware Smoothing Filters: TIA Portal module properties configure digital RC smoothing (None, Weak, Medium, Strong) to reject 50Hz/60Hz line noise"
      ],
      "note": "Remember that the on-board analog inputs on the S7-1200 CPU only measure 0–10V! If you need to connect a 4–20mA sensor to %IW64, you must wire a high-precision 500-ohm resistor (tolerance 0.1%, 1/4W) across the input terminals to convert 4–20mA into 2–10V."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/05-analog-signals/05-ana_carved_032.png",
      "caption": "Figure 5.3: S7-1200 SM 1231 Analog Hardware Quantization: Raw Integer Representation (0 to 27648)"
    }
  ],
  "quiz": [
    {
      "q": "What raw integer range represents nominal 0–10V or 4–20mA in standard Siemens S7-1200 analog input channels?",
      "options": [
        "0 to 1024",
        "0 to 4095",
        "0 to 27648",
        "0 to 65535"
      ],
      "answer": 2,
      "explain": "Siemens standardizes the full nominal analog scale to 0–27648 counts across all 12-bit, 13-bit, and 16-bit analog input cards."
    }
  ],
  "narration": {
    "vi": "Module SM 1231 là analog input của S7-1200, có bốn hoặc tám kênh, hỗ trợ cả tín hiệu dòng và điện áp. SM 1232 là analog output dùng để điều khiển van tỷ lệ hay biến tần. Trong TIA Portal, sau khi thêm module vào Device Configuration, bạn cấu hình từng kênh riêng biệt — chọn loại tín hiệu, dải đo và bộ lọc nhiễu. Địa chỉ vùng nhớ analog tự động được gán và hiển thị ngay trong giao diện cấu hình.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "S7-1200 Analog Modules",
      "points": [
        "Integrated CPU Analog Inputs: 2 channels (0–10V DC only), 10-bit hardware resolution, mapped by default to addresses %IW64 and %IW66",
        "Siemens Standard Integer Range: Nominal full-scale signal (0–10V or 4–20mA) corresponds to integer values 0 to 27648",
        "Overrange and Underrange Limits: 27649 to 32511 represents overrange (linear up to 118.5%); 32512 to 32767 represents digital overflow saturation",
        "Negative Limits (Bipolar): Nominal bipolar range (-10V to +10V) spans integer values -27648 to +27648",
        "Signal Board Expansion: SB 1231 (1 AI, 12-bit) or SB 1232 (1 AQ, 12-bit) snaps into the CPU faceplate without altering DIN-rail width",
        "Signal Module Expansion: SM 1231 (4AI/8AI, 13/16-bit), SM 1232 (2AQ/4AQ, 14-bit), SM 1234 (4AI/2AQ combo), and RTD/TC temperature modules",
        "Hardware Smoothing Filters: TIA Portal module properties configure digital RC smoothing (None, Weak, Medium, Strong) to reject 50Hz/60Hz line noise"
      ],
      "explain": "The S7-1200 hardware architecture provides both integrated and expandable analog processing capabilities. All CPU models (1211C through 1217C) feature two integrated analog input channels on the CPU terminal strip, mapped to peripheral word addresses %IW64 and %IW66. These on-board channels measure 0–10V DC with 10-bit resolution (1,024 discrete steps) and an input impedance of 100 k-ohms. To expand capacity or introduce analog outputs, engineers install Signal Boards (SB) or Signal Modules (SM). The SB 1231 provides 1 AI channel (12-bit), while the SB 1232 provides 1 AQ channel (12-bit). Dense modular expansion is achieved via SM 1231 analog input modules (available in 4-channel or 8-channel variants with 13-bit or 16-bit resolution supporting 0–10V, ±10V, 0–20mA, and 4–20mA), SM 1232 analog output modules (2 or 4 channels, 14-bit), and SM 1234 combo modules (4 AI / 2 AQ). Siemens uses a standardized internal integer representation: regardless of whether a module has 10-bit, 12-bit, or 16-bit hardware resolution, the ADC firmware automatically left-shifts the conversion result into a standardized 16-bit integer spanning 0 to 27648 for nominal range.",
      "figure": {
        "src": "/images/slides/05-analog-signals/05-ana_carved_032.png",
        "caption": "Figure 5.3: S7-1200 SM 1231 Analog Hardware Quantization: Raw Integer Representation (0 to 27648)"
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

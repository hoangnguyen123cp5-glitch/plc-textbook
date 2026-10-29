import { TopicContent } from '@/types/content';

export default {
  "slug": "norm-scale",
  "title": "Normalising and Scaling (NORM_X / SCALE_X)",
  "durationMinutes": 8,
  "summary": "Converting a raw analog integer (%IW64) into meaningful engineering units (such as degrees Celsius, bars of pressure, or cubic meters per hour) requires a two-step mathematical transformation in TI...",
  "body": [
    {
      "heading": "Normalising and Scaling (NORM_X / SCALE_X)",
      "text": "Converting a raw analog integer (%IW64) into meaningful engineering units (such as degrees Celsius, bars of pressure, or cubic meters per hour) requires a two-step mathematical transformation in TIA Portal using the NORM_X and SCALE_X instruction blocks. Step 1: Normalization (NORM_X). The NORM_X block converts the raw integer count (0 to 27648) into a dimensionless floating-point ratio spanning 0.0 to 1.0. The mathematical equation executed is: OUT = (VALUE - MIN) / (MAX - MIN). When raw input VALUE = 0, OUT = 0.0; when VALUE = 27648, OUT = 1.0; when VALUE = 13824, OUT = 0.5. Step 2: Scaling (SCALE_X). The SCALE_X block takes the normalized floating-point ratio and maps it onto the real-world physical engineering range defined by MIN and MAX. The equation executed is: OUT = VALUE * (MAX - MIN) + MIN. For example, to scale a 4–20mA pressure transmitter measuring 0.0 to 10.0 bar: NORM_X normalizes %IW64 from [0, 27648] to a temporary REAL variable [0.0, 1.0]; SCALE_X then scales this ratio with MIN = 0.0 and MAX = 10.0 bar. Conversely, to drive an analog output (%QW64) from an engineering setpoint, the order is reversed: NORM_X maps the setpoint to [0.0, 1.0], and SCALE_X maps [0.0, 1.0] to [0, 27648].",
      "keyPoints": [
        "Two-Step Standard Pipeline: Raw Input (%IW) -> [NORM_X] -> Normalized Ratio (0.0 to 1.0 REAL) -> [SCALE_X] -> Engineering Units (REAL)",
        "NORM_X Mathematical Formula: OUT = (VALUE - MIN) / (MAX - MIN); converts raw integers into normalized floating-point range",
        "SCALE_X Mathematical Formula: OUT = VALUE * (MAX - MIN) + MIN; projects normalized ratio onto physical engineering boundaries",
        "Input Parameter Configuration: For nominal unipolar inputs: MIN = 0, MAX = 27648; for bipolar inputs (±10V): MIN = -27648, MAX = +27648",
        "Engineering Units Real World Example: Temperature sensor 0–150°C: MIN = 0.0, MAX = 150.0; at raw count 13824, scaled temperature = 75.0°C",
        "Analog Output Scaling Pipeline: Engineering Setpoint (REAL) -> [NORM_X with Eng Units] -> Ratio [0.0, 1.0] -> [SCALE_X with 0, 27648] -> %QW64",
        "Value Clamping with LIMIT: Precede or follow scaling with a LIMIT block to clamp out-of-range sensor spikes caused by electrical noise surges"
      ],
      "note": "Never perform manual integer arithmetic to scale analog signals (e.g. dividing by 276)! Integer division truncates all decimal remainders, resulting in stepped, coarse measurements. Always normalize to a 32-bit REAL variable first using NORM_X and SCALE_X."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/05-analog-signals/05-ana_carved_031.png",
      "caption": "Figure 5.4: Mathematical Signal Conditioning: NORM_X Normalization & SCALE_X Engineering Units"
    }
  ],
  "quiz": [
    {
      "q": "What is the output range of the NORM_X instruction in TIA Portal?",
      "options": [
        "A normalized REAL number between 0.0 and 1.0",
        "An integer between 0 and 27648",
        "A temperature in Celsius",
        "A current in milliamperes"
      ],
      "answer": 0,
      "explain": "NORM_X performs linear normalization: OUT = (VALUE − MIN) / (MAX − MIN), yielding a dimensionless ratio from 0.0 to 1.0."
    },
    {
      "q": "To convert a raw sensor count (0–27648) into a 0.0–150.0°C temperature, what sequence of blocks is standard?",
      "options": [
        "SCALE_X followed by NORM_X",
        "NORM_X (converting raw to 0.0–1.0) followed by SCALE_X (converting 0.0–1.0 to 0.0–150.0°C)",
        "DIV block only",
        "TON timer block"
      ],
      "answer": 1,
      "explain": "The standard Siemens analog pipeline chains NORM_X (raw integer to 0.0–1.0 REAL) directly into SCALE_X (0.0–1.0 REAL to engineering units)."
    }
  ],
  "narration": {
    "vi": "Giá trị raw từ module analog là số nguyên trong khoảng không đến hai mươi bảy nghìn sáu trăm bốn mươi tám. Để chuyển về đơn vị thực như độ C hay bar, dùng hai lệnh. NORM_X chuẩn hóa giá trị raw về dải không đến một kiểu REAL. SCALE_X nhân kết quả đó với dải thực tế của cảm biến. Ví dụ cảm biến nhiệt độ không đến một trăm độ C, ta chỉ cần đặt MIN bằng không và MAX bằng một trăm là ra ngay giá trị độ C thực tế.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

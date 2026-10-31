import { TopicContent } from '@/types/content';

export default {
  "slug": "device-selection",
  "sourceRef": "6.1",
  "title": "Analysing Requirements and Selecting Devices",
  "durationMinutes": 11,
  "summary": "The engineering lifecycle begins with analyzing the customer's functional process specification and translating prose descriptions into a formalized Master I/O Schedule.",
  "body": [
    {
      "heading": "6.1 Analysing Requirements and Selecting Devices",
      "text": "The engineering lifecycle begins with analyzing the customer's functional process specification and translating prose descriptions into a formalized Master I/O Schedule. Every sensor, limit switch, pushbutton, solenoid valve, contactor, and analog transmitter must be enumerated with its physical location, voltage rating, signal format (e.g. 24VDC discrete, 4–20mA analog), and functional description. Professional engineering rules require adding a minimum of 20% spare capacity across all I/O types to accommodate field modifications during commissioning and future plant expansions. Once the total I/O count is established, the engineer calculates the 24VDC system power budget: summing the quiescent current of the CPU, the backplane consumption of expansion cards, and the external load currents drawn by inductive coils, sensors, and indicator lamps. This calculation determines the sizing of the 24VDC regulated power supply (e.g. SITOP PSU 24V/5A or 10A). The CPU model is selected based on work memory requirements, communication interfaces, and backplane expansion slots (e.g. selecting CPU 1214C to support up to 8 SM modules).",
      "keyPoints": [
        "Master I/O Schedule Creation: Tabular matrix detailing Tag Name, Address, Signal Type, Electrical Voltage, Location, and Functional Description",
        "20% Engineering Spare Rule: Always specify at least 20% unallocated spare channels on all digital and analog I/O cards for commissioning flexibility",
        "24VDC Power Budget Calculation: Total Current = CPU Internal Bus + Expansion Card Consumption + Total Field Sensor & Solenoid Loads",
        "SITOP Power Supply Sizing: Select industrial regulated switch-mode power supplies (e.g. 24VDC 5A/10A) with minimum 30% thermal headroom",
        "CPU Sizing Criteria: Evaluate user program work memory, communication socket budget, and maximum number of attachable Signal Modules",
        "Bill of Materials (BOM) Generation: Exact Siemens order part numbers (MLFB), quantities, auxiliary circuit breakers, terminal blocks, and wire ducts",
        "Panel Heat Dissipation: Calculate total enclosure thermal dissipation (Watts) to determine required ventilation fans or air conditioning"
      ],
      "note": "Never size an industrial 24VDC power supply to 100% of calculated full-load current! Inductive inrush currents from multiple solenoids energizing simultaneously can cause voltage sags below 20.4VDC, triggering instantaneous brownout restarts of the S7-1200 CPU."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/07-system-design/PLC__Slide_7_012.png",
      "caption": "Figure 7.1: Master I/O Schedule Development, 20% Spare Margin, and 24VDC Power Budget Sizing"
    }
  ],
  "quiz": [
    {
      "q": "What standard safety engineering margin should be reserved for spare I/O channels when specifying a new PLC panel?",
      "options": [
        "0% (exact count)",
        "At least 15% to 20% spare capacity",
        "100% spare modules",
        "50% spare CPUs"
      ],
      "answer": 1,
      "explain": "Good automation engineering practices dictate reserving 15–20% spare I/O terminals and cabinet DIN rail space for future plant expansions."
    }
  ],
  "narration": {
    "vi": "Bước đầu tiên thiết kế hệ thống PLC là phân tích yêu cầu kỹ thuật. Đếm tổng số đầu vào và đầu ra số, số kênh analog cần dùng, và xác định giao thức truyền thông nếu có. Từ đó chọn CPU phù hợp — CPU 1211C cho hệ nhỏ dưới mười sáu I/O, CPU 1214C hoặc 1215C cho hệ vừa và lớn hơn. Nên thêm dự phòng khoảng hai mươi phần trăm số I/O để dễ mở rộng sau này mà không phải thay CPU.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Analysing Requirements and Selecting Devices",
      "points": [
        "Master I/O Schedule Creation: Tabular matrix detailing Tag Name, Address, Signal Type, Electrical Voltage, Location, and Functional Description",
        "20% Engineering Spare Rule: Always specify at least 20% unallocated spare channels on all digital and analog I/O cards for commissioning flexibility",
        "24VDC Power Budget Calculation: Total Current = CPU Internal Bus + Expansion Card Consumption + Total Field Sensor & Solenoid Loads",
        "SITOP Power Supply Sizing: Select industrial regulated switch-mode power supplies (e.g. 24VDC 5A/10A) with minimum 30% thermal headroom",
        "CPU Sizing Criteria: Evaluate user program work memory, communication socket budget, and maximum number of attachable Signal Modules",
        "Bill of Materials (BOM) Generation: Exact Siemens order part numbers (MLFB), quantities, auxiliary circuit breakers, terminal blocks, and wire ducts",
        "Panel Heat Dissipation: Calculate total enclosure thermal dissipation (Watts) to determine required ventilation fans or air conditioning"
      ],
      "explain": "The engineering lifecycle begins with analyzing the customer's functional process specification and translating prose descriptions into a formalized Master I/O Schedule. Every sensor, limit switch, pushbutton, solenoid valve, contactor, and analog transmitter must be enumerated with its physical location, voltage rating, signal format (e.g. 24VDC discrete, 4–20mA analog), and functional description. Professional engineering rules require adding a minimum of 20% spare capacity across all I/O types to accommodate field modifications during commissioning and future plant expansions. Once the total I/O count is established, the engineer calculates the 24VDC system power budget: summing the quiescent current of the CPU, the backplane consumption of expansion cards, and the external load currents drawn by inductive coils, sensors, and indicator lamps. This calculation determines the sizing of the 24VDC regulated power supply (e.g. SITOP PSU 24V/5A or 10A). The CPU model is selected based on work memory requirements, communication interfaces, and backplane expansion slots (e.g. selecting CPU 1214C to support up to 8 SM modules).",
      "figure": {
        "src": "/images/slides/07-system-design/PLC__Slide_7_012.png",
        "caption": "Figure 7.1: Master I/O Schedule Development, 20% Spare Margin, and 24VDC Power Budget Sizing"
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

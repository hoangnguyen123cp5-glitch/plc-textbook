import { TopicContent } from '@/types/content';

export default {
  "slug": "integration-walkthrough",
  "title": "Integrating PLC, HMI and Supervision",
  "durationMinutes": 13,
  "summary": "Integrating a programmable controller with an operator touchscreen (HMI) or SCADA system in TIA Portal represents a unified engineering workflow.",
  "body": [
    {
      "heading": "Integrating PLC, HMI and Supervision",
      "text": "Integrating a programmable controller with an operator touchscreen (HMI) or SCADA system in TIA Portal represents a unified engineering workflow. Rather than manually exporting and re-typing memory addresses across separate software packages—which introduces severe addressing mismatch errors—TIA Portal combines STEP 7 and WinCC into a single shared database. In TIA Portal, the engineer creates an HMI device (e.g. SIMATIC KTP700 Basic or Unified Comfort Panel) and establishes an S7-subnet connection to the PLC in Network View with a single drag-and-drop link. Tags defined in the PLC Tag Table or Global Data Blocks are dragged directly onto HMI screen graphics: pushbuttons, status pilot lights, analog gauge bars, and numerical input boxes automatically bind to the underlying PLC tag. Alarm management is structured according to ISA-18.2: Discrete Alarms (triggered by PLC boolean fault bits, such as thermal motor overloads) and Analog Alarms (triggered when continuous process variables breach low-low, low, high, or high-high warning thresholds) are automatically logged, timestamped by the CPU clock, and presented in priority-ranked alarm banners requiring operator acknowledgment.",
      "keyPoints": [
        "Unified Engineering Database: STEP 7 PLC logic and WinCC HMI screens reside within the same TIA Portal project; tags are synchronized automatically",
        "Symbolic Addressing Integration: Renaming a tag in the PLC Tag Table (e.g. 'Pump_Speed') instantly updates all bound HMI screens, scripts, and trend charts without breaking links",
        "ISA-101 High-Performance HMI Guidelines: Utilize clean, low-contrast grayscale backgrounds; reserve bright saturated colors (red, yellow) exclusively for abnormal alarm conditions",
        "ISA-18.2 Alarm Architecture: Categorize alarms into Warning (Yellow), Critical (Orange), and Emergency (Red); implement required operator acknowledgment sequences",
        "Real-Time Trend Recording: High-speed cyclic polling buffers historical analog data (temperatures, pressures) into continuous trend graphs for operator analysis",
        "Recipe Management: Pre-configured parameter tables (e.g. blending proportions) stored in HMI memory and downloaded as complete datasets to PLC Data Blocks",
        "User Access Security: Multi-tier password authorization restricting sensitive calibration and tuning screens to certified maintenance engineers"
      ],
      "note": "Follow the ISA-101 standard for HMI design: avoid flashy 3D graphics, spinning animations, and garish background colors! A professional industrial HMI should resemble an aircraft cockpit: muted, clear grayscale displays where an illuminated red warning immediately captures the operator's attention during an emergency."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/15-system-integration/PLC___Slide__019.jpg",
      "caption": "Figure 15.2: Unified Engineering: Tag Database Synchronization between TIA Portal STEP 7 & WinCC"
    }
  ],
  "quiz": [
    {
      "q": "What is the key advantage of unified engineering inside TIA Portal when integrating an S7-1200 PLC with a KTP Comfort HMI panel?",
      "options": [
        "Shared global tag database: HMI variables link directly to symbolic PLC tags with automatic synchronization when tag names or data types change",
        "The HMI screen can run without power",
        "The PLC no longer needs ladder code",
        "It eliminates all wiring"
      ],
      "answer": 0,
      "explain": "Unified database architecture eliminates manual tag re-typing, preventing communication address mismatches between PLC logic and graphical HMI screens."
    }
  ],
  "narration": {
    "vi": "Trong mục này, chúng ta đi qua một ví dụ tích hợp thực tế. PLC S7-1500 giao tiếp với biến tần qua PROFINET, đọc tốc độ động cơ và trạng thái lỗi. HMI WinCC kết nối với PLC qua Ethernet, hiển thị thông số và cho phép vận hành viên đặt tốc độ. SCADA thu thập dữ liệu lịch sử từ nhiều PLC, vẽ xu hướng và gửi cảnh báo qua email khi có bất thường.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Integrating PLC, HMI and Supervision",
      "points": [
        "Unified Engineering Database: STEP 7 PLC logic and WinCC HMI screens reside within the same TIA Portal project; tags are synchronized automatically",
        "Symbolic Addressing Integration: Renaming a tag in the PLC Tag Table (e.g. 'Pump_Speed') instantly updates all bound HMI screens, scripts, and trend charts without breaking links",
        "ISA-101 High-Performance HMI Guidelines: Utilize clean, low-contrast grayscale backgrounds; reserve bright saturated colors (red, yellow) exclusively for abnormal alarm conditions",
        "ISA-18.2 Alarm Architecture: Categorize alarms into Warning (Yellow), Critical (Orange), and Emergency (Red); implement required operator acknowledgment sequences",
        "Real-Time Trend Recording: High-speed cyclic polling buffers historical analog data (temperatures, pressures) into continuous trend graphs for operator analysis",
        "Recipe Management: Pre-configured parameter tables (e.g. blending proportions) stored in HMI memory and downloaded as complete datasets to PLC Data Blocks",
        "User Access Security: Multi-tier password authorization restricting sensitive calibration and tuning screens to certified maintenance engineers"
      ],
      "explain": "Integrating a programmable controller with an operator touchscreen (HMI) or SCADA system in TIA Portal represents a unified engineering workflow. Rather than manually exporting and re-typing memory addresses across separate software packages—which introduces severe addressing mismatch errors—TIA Portal combines STEP 7 and WinCC into a single shared database. In TIA Portal, the engineer creates an HMI device (e.g. SIMATIC KTP700 Basic or Unified Comfort Panel) and establishes an S7-subnet connection to the PLC in Network View with a single drag-and-drop link. Tags defined in the PLC Tag Table or Global Data Blocks are dragged directly onto HMI screen graphics: pushbuttons, status pilot lights, analog gauge bars, and numerical input boxes automatically bind to the underlying PLC tag. Alarm management is structured according to ISA-18.2: Discrete Alarms (triggered by PLC boolean fault bits, such as thermal motor overloads) and Analog Alarms (triggered when continuous process variables breach low-low, low, high, or high-high warning thresholds) are automatically logged, timestamped by the CPU clock, and presented in priority-ranked alarm banners requiring operator acknowledgment.",
      "figure": {
        "src": "/images/slides/15-system-integration/PLC___Slide__019.jpg",
        "caption": "Figure 15.2: Unified Engineering: Tag Database Synchronization between TIA Portal STEP 7 & WinCC"
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

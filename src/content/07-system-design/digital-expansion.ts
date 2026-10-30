import { TopicContent } from '@/types/content';

export default {
  "slug": "digital-expansion",
  "sourceRef": "6.3",
  "title": "Connecting Digital Expansion Modules",
  "durationMinutes": 8,
  "summary": "When field discrete I/O counts exceed the on-board capacity of the S7-1200 CPU (e.g.",
  "body": [
    {
      "heading": "6.3 Connecting Digital Expansion Modules",
      "text": "When field discrete I/O counts exceed the on-board capacity of the S7-1200 CPU (e.g. 14 DI / 10 DO on CPU 1214C), Signal Modules (SM) are attached to expand capacity. The S7-1200 architecture supports SM 1221 digital input modules (8 DI or 16 DI 24VDC), SM 1222 digital output modules (8 DO or 16 DO 24VDC transistor or relay), and SM 1223 combination modules (e.g. 8 DI / 8 DO or 16 DI / 16 DO). Expansion modules mount mechanically to the right-hand side of the CPU on the same TS35 DIN rail. Interconnection is established via a high-speed sliding bus connector integrated into the upper-right housing of each module. When pushed to the left, this bus connector mates with the adjacent module's bus receptacle, locking the hardware backplane electrically. In TIA Portal Device View, the engineer drags the matching SM module from the hardware catalog into the adjacent virtual rack slot (Slot 2, Slot 3, etc.). TIA Portal automatically allocates consecutive peripheral byte addresses (e.g. %I2.0–%I3.7 and %Q2.0–%Q3.7) which can be customized in module properties.",
      "keyPoints": [
        "Expansion Module Types: SM 1221 (Digital Inputs), SM 1222 (Digital Outputs), SM 1223 (Combination DI/DO)",
        "Mechanical Bus Connector: Slide bus connector on top-right housing slides left to engage the adjacent module's backplane bus securely",
        "Rack Mounting Capacity: CPU 1211C supports 0 SMs; CPU 1212C supports up to 2 SMs; CPU 1214C, 1215C, and 1217C support up to 8 SM modules",
        "Default Address Allocation: First digital SM starts addressing at byte 2 (%I2.0... / %Q2.0...); addresses are fully reconfigurable in TIA Portal",
        "Backplane Power Supply Budget: The CPU delivers up to 1600 mA of 5VDC logic power to the backplane; verify that total SM draw does not exceed CPU limit",
        "External Field Power Wiring: Digital output modules require external 24VDC field power wired to terminal L+ and M to drive physical output loads",
        "Hardware Compilation: Press Ctrl+B to compile hardware configuration; validates rack slot order, address overlap, and power budgets"
      ],
      "note": "Always de-energize system power before sliding bus connectors together or separating modules! Mating backplane bus connectors while 24VDC power is applied will trigger backplane bus communication errors and can damage internal CMOS logic transceivers."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/07-system-design/PLC__Slide_7_013.jpg",
      "caption": "Figure 7.3: SM 1221/1222 Digital Expansion Modules: Backplane Slide Bus Mechanical Attachment"
    }
  ],
  "quiz": [
    {
      "q": "How are SM 1221 digital expansion modules mechanically connected to the S7-1200 CPU backplane?",
      "options": [
        "Via an integrated slide bus connector on the top right side that clicks firmly into place",
        "Using external USB cables",
        "Through wireless Bluetooth",
        "Using RS232 null modem cables"
      ],
      "answer": 0,
      "explain": "S7-1200 modules dock side-by-side on the DIN rail and interlock via an integrated top slide connector that forms the backplane bus."
    }
  ],
  "narration": {
    "vi": "Khi CPU S7-1200 không đủ I/O số, bạn gắn thêm Signal Module bên phải. SM 1221 là module input số tám hoặc mười sáu kênh. SM 1222 là module output số. SM 1223 kết hợp cả DI và DQ trên một module. Trong TIA Portal, kéo thả module vào vị trí slot mong muốn trong Device Configuration. Địa chỉ I/O tự động được gán theo thứ tự slot. Số module mở rộng tối đa phụ thuộc vào dòng CPU bạn chọn.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Connecting Digital Expansion Modules",
      "points": [
        "Expansion Module Types: SM 1221 (Digital Inputs), SM 1222 (Digital Outputs), SM 1223 (Combination DI/DO)",
        "Mechanical Bus Connector: Slide bus connector on top-right housing slides left to engage the adjacent module's backplane bus securely",
        "Rack Mounting Capacity: CPU 1211C supports 0 SMs; CPU 1212C supports up to 2 SMs; CPU 1214C, 1215C, and 1217C support up to 8 SM modules",
        "Default Address Allocation: First digital SM starts addressing at byte 2 (%I2.0... / %Q2.0...); addresses are fully reconfigurable in TIA Portal",
        "Backplane Power Supply Budget: The CPU delivers up to 1600 mA of 5VDC logic power to the backplane; verify that total SM draw does not exceed CPU limit",
        "External Field Power Wiring: Digital output modules require external 24VDC field power wired to terminal L+ and M to drive physical output loads",
        "Hardware Compilation: Press Ctrl+B to compile hardware configuration; validates rack slot order, address overlap, and power budgets"
      ],
      "explain": "When field discrete I/O counts exceed the on-board capacity of the S7-1200 CPU (e.g. 14 DI / 10 DO on CPU 1214C), Signal Modules (SM) are attached to expand capacity. The S7-1200 architecture supports SM 1221 digital input modules (8 DI or 16 DI 24VDC), SM 1222 digital output modules (8 DO or 16 DO 24VDC transistor or relay), and SM 1223 combination modules (e.g. 8 DI / 8 DO or 16 DI / 16 DO). Expansion modules mount mechanically to the right-hand side of the CPU on the same TS35 DIN rail. Interconnection is established via a high-speed sliding bus connector integrated into the upper-right housing of each module. When pushed to the left, this bus connector mates with the adjacent module's bus receptacle, locking the hardware backplane electrically. In TIA Portal Device View, the engineer drags the matching SM module from the hardware catalog into the adjacent virtual rack slot (Slot 2, Slot 3, etc.). TIA Portal automatically allocates consecutive peripheral byte addresses (e.g. %I2.0–%I3.7 and %Q2.0–%Q3.7) which can be customized in module properties.",
      "figure": {
        "src": "/images/slides/07-system-design/PLC__Slide_7_013.jpg",
        "caption": "Figure 7.3: SM 1221/1222 Digital Expansion Modules: Backplane Slide Bus Mechanical Attachment"
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

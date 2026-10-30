import { TopicContent } from '@/types/content';

export default {
  "slug": "automation-pyramid",
  "title": "The Automation Stack End to End",
  "durationMinutes": 10,
  "summary": "Modern automated manufacturing is structured according to the international standard ANSI/ISA-95 (Enterprise-Control System Integration), which conceptualizes industrial technology as a 5-tier Auto...",
  "body": [
    {
      "heading": "The Automation Stack End to End",
      "text": "Modern automated manufacturing is structured according to the international standard ANSI/ISA-95 (Enterprise-Control System Integration), which conceptualizes industrial technology as a 5-tier Automation Pyramid. Level 0 (Field Level) encompasses physical sensors (inductive proximity, 4–20mA pressure/temperature transmitters, quadrature encoders) and final control elements (solenoid valves, motor contactors, VFDs) operating with physical electrical signals. Level 1 (Control Level) consists of Programmable Logic Controllers (PLCs), PACs, and dedicated motion controllers that sample field I/O and execute deterministic logic within millisecond scan cycles. Level 2 (Supervisory Level) comprises Human-Machine Interfaces (HMI touchscreens) and Supervisory Control and Data Acquisition (SCADA) systems that provide plant-wide visualization, real-time trend archiving, recipe selection, and alarm logging for human operators. Level 3 (Manufacturing Operations Management / MES) tracks work orders, batch execution records, maintenance schedules, and Overall Equipment Effectiveness (OEE) metrics. Level 4 (Enterprise Level / ERP) integrates corporate business software (such as SAP or Oracle) managing global supply chains, customer procurement, and inventory. High-performance industrial Ethernet (PROFINET, OPC-UA) bridges these tiers seamlessly.",
      "keyPoints": [
        "Level 0 (Field Level): Physical instrumentation and electrical energy actuators; 24VDC discrete, 4–20mA analog, and IO-Link protocols",
        "Level 1 (Control Level): Industrial microprocessors (S7-1200/1500) executing deterministic real-time cyclic logic (< 10 ms cycle time)",
        "Level 2 (Supervisory Level): Local HMI touchscreens (SIMATIC Comfort/Unified panels) and centralized SCADA platforms (WinCC Professional) for process supervision",
        "Level 3 (MES Level): Manufacturing Execution Systems governing batch recipes, electronic batch records (EBR), and OEE production tracking",
        "Level 4 (ERP Level): Enterprise Resource Planning systems coordinating business financials, sales orders, raw material logistics, and inventory",
        "OPC Unified Architecture (OPC-UA): Secure, platform-independent, encrypted communication standard bridging Level 1 PLCs directly to Level 3 MES and cloud servers",
        "Temporal Hierarchy: Milliseconds at Levels 0–1; seconds at Level 2; minutes/shifts at Level 3; days/months at Level 4"
      ],
      "note": "Never allow direct corporate office network connections to Level 1 PLC controllers! Industrial cybersecurity standard IEC 62443 mandates separating corporate IT networks from operational technology (OT) plant networks using segmented subnets, managed industrial firewalls, and demilitarized zones (DMZ)."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/15-system-integration/PLC___Slide__023.png",
      "caption": "Figure 15.1: The ISA-95 Industrial Automation Pyramid: Field, Control, SCADA, MES, and ERP Layers"
    }
  ],
  "quiz": [
    {
      "q": "According to the ISA-95 Automation Pyramid, which layer sits directly between the Control Layer (PLCs) and the MES / Business Layer?",
      "options": [
        "SCADA / HMI Supervisory Level (Supervisory Control and Data Acquisition)",
        "The Field Sensor Layer",
        "The Hydraulic Power Unit",
        "The Raw Material Warehouse"
      ],
      "answer": 0,
      "explain": "SCADA (Supervisory Control and Data Acquisition) bridges factory floor real-time PLCs with high-level manufacturing execution and enterprise ERP systems."
    }
  ],
  "narration": {
    "vi": "Tháp tự động hóa mô tả cách thông tin chảy từ tầng thấp nhất lên cao nhất trong nhà máy. Tầng Field là cảm biến và cơ cấu chấp hành. Tầng Control là PLC và DCS. Tầng Supervisory là SCADA và HMI. Tầng trên cùng là MES và ERP — nơi quản lý kế hoạch sản xuất và kinh doanh. Hiểu tháp này giúp bạn xác định đúng thiết bị và giao thức cho từng tầng.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "The Automation Stack End to End",
      "points": [
        "Level 0 (Field Level): Physical instrumentation and electrical energy actuators; 24VDC discrete, 4–20mA analog, and IO-Link protocols",
        "Level 1 (Control Level): Industrial microprocessors (S7-1200/1500) executing deterministic real-time cyclic logic (< 10 ms cycle time)",
        "Level 2 (Supervisory Level): Local HMI touchscreens (SIMATIC Comfort/Unified panels) and centralized SCADA platforms (WinCC Professional) for process supervision",
        "Level 3 (MES Level): Manufacturing Execution Systems governing batch recipes, electronic batch records (EBR), and OEE production tracking",
        "Level 4 (ERP Level): Enterprise Resource Planning systems coordinating business financials, sales orders, raw material logistics, and inventory",
        "OPC Unified Architecture (OPC-UA): Secure, platform-independent, encrypted communication standard bridging Level 1 PLCs directly to Level 3 MES and cloud servers",
        "Temporal Hierarchy: Milliseconds at Levels 0–1; seconds at Level 2; minutes/shifts at Level 3; days/months at Level 4"
      ],
      "explain": "Modern automated manufacturing is structured according to the international standard ANSI/ISA-95 (Enterprise-Control System Integration), which conceptualizes industrial technology as a 5-tier Automation Pyramid. Level 0 (Field Level) encompasses physical sensors (inductive proximity, 4–20mA pressure/temperature transmitters, quadrature encoders) and final control elements (solenoid valves, motor contactors, VFDs) operating with physical electrical signals. Level 1 (Control Level) consists of Programmable Logic Controllers (PLCs), PACs, and dedicated motion controllers that sample field I/O and execute deterministic logic within millisecond scan cycles. Level 2 (Supervisory Level) comprises Human-Machine Interfaces (HMI touchscreens) and Supervisory Control and Data Acquisition (SCADA) systems that provide plant-wide visualization, real-time trend archiving, recipe selection, and alarm logging for human operators. Level 3 (Manufacturing Operations Management / MES) tracks work orders, batch execution records, maintenance schedules, and Overall Equipment Effectiveness (OEE) metrics. Level 4 (Enterprise Level / ERP) integrates corporate business software (such as SAP or Oracle) managing global supply chains, customer procurement, and inventory. High-performance industrial Ethernet (PROFINET, OPC-UA) bridges these tiers seamlessly.",
      "figure": {
        "src": "/images/slides/15-system-integration/PLC___Slide__023.png",
        "caption": "Figure 15.1: The ISA-95 Industrial Automation Pyramid: Field, Control, SCADA, MES, and ERP Layers"
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

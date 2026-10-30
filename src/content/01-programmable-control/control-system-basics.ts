import { TopicContent } from '@/types/content';

export default {
  "slug": "control-system-basics",
  "sourceRef": "1.1",
  "title": "What a Control System Is",
  "durationMinutes": 7,
  "summary": "A control system manages, commands, directs, or regulates the behavior of other devices or technological processes.",
  "body": [
    {
      "heading": "1.1 Fundamentals of Control Systems",
      "text": "A control system manages, commands, directs, or regulates the behavior of other devices or technological processes. Scope spans from a simple household bimetallic thermostat to a sprawling chemical refinery encompassing thousands of I/O loops; however, the anatomical architecture invariably comprises 5 foundational elements: Reference Input / Setpoint (SP), Measurement Element / Sensor, Error Detector / Comparator, Controller, and Actuator (Final Control Element). Understanding these 5 building blocks allows automation engineers to clearly delineate the software domain of the PLC: the PLC functions as the controller block, receiving digitized feedback from sensors and executing logic to command physical actuators.",
      "keyPoints": [
        "Setpoint (SP): The target or desired value the process variable must attain (e.g. 60°C, 4.0 bar, 2.5 m level)",
        "Process Variable (PV): The actual measured physical state dynamically sampled at the plant output",
        "Disturbance: Uncontrolled internal or external factors that perturb process equilibrium (e.g. ambient draft, voltage sag, mechanical friction)",
        "Actuator: The physical device converting low-power electrical commands into mechanical, thermal, or fluid energy (e.g. electric motors, control valves, heating elements)",
        "These 5 elements recur systematically across all industrial automation tiers, from discrete relay interlocks to distributed SCADA / DCS architectures"
      ]
    }
  ],
  "figures": [
    {
      "src": "/images/slides/01-programmable-control/PLC_Slide_1__018.png",
      "caption": "Figure 1.1: Automated Control System Building Blocks — Reference Input, Sensors, Controller & Actuators"
    }
  ],
  "caseStudy": {
    "title": "Application of the 5 Core Elements in High-Speed Beverage Bottling Lines",
    "context": "A modern bottling facility operating at 120 bottles/minute requires precise volumetric filling of 500 ml ± 2 ml. The anatomical architecture delineates into the 5 universal building blocks: Reference Input / Setpoint (500 ml calibrated target via HMI), Measurement Element / Sensor (High-resolution optical neck detection sensor + dynamic loadcell), Error Detector / Comparator (Real-time deviation calculation e(t) = SP − PV), Controller (Siemens S7-1200 CPU executing cyclic logic algorithms), and Actuator (Pneumatic solenoid valve commanding the liquid dosing cylinder).",
    "hardware": [
      "Controller: Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC",
      "Sensors: Sick W16 Retro-reflective Optical Sensor + HBM Digital Loadcell",
      "Actuator: Festo VTUG High-Speed Solenoid Valve & Guided Pneumatic Cylinder",
      "Industrial Interfaces: 24VDC PNP Discrete I/O, 4–20 mA Analog, PROFINET RT"
    ],
    "pitfall": "Confusing the Actuator with the Controller: The PLC CPU is purely a low-power digital decision engine (0.5A/24VDC rating). It never directly drives heavy physical loads without interposing actuators such as contactors, variable frequency drives, or solid-state relays."
  },
  "quiz": [
    {
      "q": "Which of the following is NOT one of the 5 fundamental building blocks of an automated control system?",
      "options": [
        "Setpoint / Reference Input",
        "Measurement Element / Sensor",
        "Operator Coffee Machine",
        "Actuator / Final Control Element"
      ],
      "answer": 2,
      "explain": "The 5 universal anatomical blocks of a control system are Setpoint, Sensor, Comparator/Error Detector, Controller, and Actuator."
    },
    {
      "q": "What is the industrial role of an actuator in a control loop?",
      "options": [
        "To sample physical measurements and produce raw millivolt signals",
        "To convert low-power electrical commands into mechanical, thermal, or fluid energy",
        "To compile ladder rungs into machine code",
        "To store historical audit logs"
      ],
      "answer": 1,
      "explain": "Actuators (e.g. motors, pneumatic cylinders, control valves) translate low-energy electrical controller outputs into physical action."
    }
  ],
  "narration": {
    "vi": "Trong mục này, chúng ta tìm hiểu hệ thống điều khiển là gì. Một hệ thống điều khiển nhận tín hiệu đầu vào từ cảm biến, xử lý theo logic đã lập trình, rồi đưa ra lệnh điều khiển thiết bị chấp hành. Ví dụ đơn giản nhất là bộ điều nhiệt ở nhà bạn — nó đo nhiệt độ, so sánh với giá trị đặt, và bật hoặc tắt máy điều hòa.",
    "durationSec": 28,
    "by": "ai",
    "updatedAt": "2026-10-10"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Fundamentals of Control Systems",
      "points": [
        "Setpoint (SP): The target or desired value the process variable must attain (e.g. 60°C, 4.0 bar, 2.5 m level)",
        "Process Variable (PV): The actual measured physical state dynamically sampled at the plant output",
        "Disturbance: Uncontrolled internal or external factors that perturb process equilibrium (e.g. ambient draft, voltage sag, mechanical friction)",
        "Actuator: The physical device converting low-power electrical commands into mechanical, thermal, or fluid energy (e.g. electric motors, control valves, heating elements)",
        "These 5 elements recur systematically across all industrial automation tiers, from discrete relay interlocks to distributed SCADA / DCS architectures"
      ],
      "explain": "A control system manages, commands, directs, or regulates the behavior of other devices or technological processes. Scope spans from a simple household bimetallic thermostat to a sprawling chemical refinery encompassing thousands of I/O loops; however, the anatomical architecture invariably comprises 5 foundational elements: Reference Input / Setpoint (SP), Measurement Element / Sensor, Error Detector / Comparator, Controller, and Actuator (Final Control Element). Understanding these 5 building blocks allows automation engineers to clearly delineate the software domain of the PLC: the PLC functions as the controller block, receiving digitized feedback from sensors and executing logic to command physical actuators.",
      "figure": {
        "src": "/images/slides/01-programmable-control/PLC_Slide_1__018.png",
        "caption": "Figure 1.1: Automated Control System Building Blocks — Reference Input, Sensors, Controller & Actuators"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 1
    }
  ],
  "status": "review"
} satisfies TopicContent;

import { LessonContentFile } from '@/types/content';

export default {
  "slug": "15-system-integration",
  "id": 15,
  "title": "Whole-System Integration",
  "description": "Connecting the full automation stack and a real-world worked application",
  "course": "AUT207",
  "session": 2,
  "lab": "Project",
  "clo": "G4",
  "module": 5,
  "topicOrder": [
    "automation-pyramid",
    "integration-walkthrough",
    "real-world-case"
  ],
  "overview": "This capstone lesson integrates every discipline studied throughout the curriculum into an end-to-end, multi-tier industrial automation architecture. Real-world manufacturing plants do not operate PLCs in isolation; controllers function as the real-time core within an integrated automation pyramid governed by ISA-95 standards. Students will master the complete hierarchy spanning physical field instrumentation (sensors and actuators), real-time control (S7-1200/1500 PLCs), human-machine interface (HMI operator touchscreens), supervisory control and data acquisition (SCADA), manufacturing execution systems (MES), and enterprise resource planning (ERP). The lesson culminates in an exhaustive real-world industrial case study detailing the design, tag synchronization, alarm engineering, commissioning, and handover documentation of a modern multi-tank liquid batching plant.",
  "objectives": [
    "Analyze the 5 functional tiers of the ISA-95 Industrial Automation Pyramid and delineate real-time control from enterprise data layers",
    "Engineer unified cross-tier tag databases linking TIA Portal STEP 7 PLC logic, WinCC Comfort/Unified HMI screens, and SCADA servers",
    "Design ergonomic operator HMI interfaces complying with High-Performance HMI (ISA-101) standards for situational awareness",
    "Configure plant-wide discrete and analog alarm management architectures adhering to ISA-18.2 standards",
    "Synthesize discrete interlocks, high-speed counters, closed-loop PID algorithms, and PROFINET remote I/O into a unified system",
    "Execute full virtual and physical commissioning protocols: factory acceptance testing (FAT), site acceptance testing (SAT), and handover dossiers"
  ],
  "review": [
    "Diagram the 5 functional levels of the ISA-95 Industrial Automation Pyramid and identify the technologies operating at each level.",
    "Explain how the unified database architecture in Siemens TIA Portal prevents tag addressing and naming errors between the PLC and HMI.",
    "Describe the key principles of the ISA-101 High-Performance HMI standard. Why are bright saturated colors discouraged for normal operational displays?",
    "Explain the role and architecture of an ISA-18.2 compliant industrial alarm management system.",
    "In the chemical blending case study, detail how NORM_X and SCALE_X convert raw 4–20mA analog counts into cubic meters of fluid volume.",
    "Explain how the High-Speed Counter (HSC) and the PID_Compact closed-loop controller operate concurrently within the S7-1200 CPU.",
    "List the critical engineering deliverables that must be compiled into the final handover dossier delivered to a plant owner upon project completion."
  ]
} satisfies LessonContentFile;

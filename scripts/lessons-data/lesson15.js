module.exports = {
  overview: "This capstone lesson integrates every discipline studied throughout the curriculum into an end-to-end, multi-tier industrial automation architecture. Real-world manufacturing plants do not operate PLCs in isolation; controllers function as the real-time core within an integrated automation pyramid governed by ISA-95 standards. Students will master the complete hierarchy spanning physical field instrumentation (sensors and actuators), real-time control (S7-1200/1500 PLCs), human-machine interface (HMI operator touchscreens), supervisory control and data acquisition (SCADA), manufacturing execution systems (MES), and enterprise resource planning (ERP). The lesson culminates in an exhaustive real-world industrial case study detailing the design, tag synchronization, alarm engineering, commissioning, and handover documentation of a modern multi-tank liquid batching plant.",
  objectives: [
    "Analyze the 5 functional tiers of the ISA-95 Industrial Automation Pyramid and delineate real-time control from enterprise data layers",
    "Engineer unified cross-tier tag databases linking TIA Portal STEP 7 PLC logic, WinCC Comfort/Unified HMI screens, and SCADA servers",
    "Design ergonomic operator HMI interfaces complying with High-Performance HMI (ISA-101) standards for situational awareness",
    "Configure plant-wide discrete and analog alarm management architectures adhering to ISA-18.2 standards",
    "Synthesize discrete interlocks, high-speed counters, closed-loop PID algorithms, and PROFINET remote I/O into a unified system",
    "Execute full virtual and physical commissioning protocols: factory acceptance testing (FAT), site acceptance testing (SAT), and handover dossiers"
  ],
  sections: [
    {
      title: "The Automation Stack End to End",
      content: "Modern automated manufacturing is structured according to the international standard ANSI/ISA-95 (Enterprise-Control System Integration), which conceptualizes industrial technology as a 5-tier Automation Pyramid. Level 0 (Field Level) encompasses physical sensors (inductive proximity, 4–20mA pressure/temperature transmitters, quadrature encoders) and final control elements (solenoid valves, motor contactors, VFDs) operating with physical electrical signals. Level 1 (Control Level) consists of Programmable Logic Controllers (PLCs), PACs, and dedicated motion controllers that sample field I/O and execute deterministic logic within millisecond scan cycles. Level 2 (Supervisory Level) comprises Human-Machine Interfaces (HMI touchscreens) and Supervisory Control and Data Acquisition (SCADA) systems that provide plant-wide visualization, real-time trend archiving, recipe selection, and alarm logging for human operators. Level 3 (Manufacturing Operations Management / MES) tracks work orders, batch execution records, maintenance schedules, and Overall Equipment Effectiveness (OEE) metrics. Level 4 (Enterprise Level / ERP) integrates corporate business software (such as SAP or Oracle) managing global supply chains, customer procurement, and inventory. High-performance industrial Ethernet (PROFINET, OPC-UA) bridges these tiers seamlessly.",
      keyPoints: [
        "Level 0 (Field Level): Physical instrumentation and electrical energy actuators; 24VDC discrete, 4–20mA analog, and IO-Link protocols",
        "Level 1 (Control Level): Industrial microprocessors (S7-1200/1500) executing deterministic real-time cyclic logic (< 10 ms cycle time)",
        "Level 2 (Supervisory Level): Local HMI touchscreens (SIMATIC Comfort/Unified panels) and centralized SCADA platforms (WinCC Professional) for process supervision",
        "Level 3 (MES Level): Manufacturing Execution Systems governing batch recipes, electronic batch records (EBR), and OEE production tracking",
        "Level 4 (ERP Level): Enterprise Resource Planning systems coordinating business financials, sales orders, raw material logistics, and inventory",
        "OPC Unified Architecture (OPC-UA): Secure, platform-independent, encrypted communication standard bridging Level 1 PLCs directly to Level 3 MES and cloud servers",
        "Temporal Hierarchy: Milliseconds at Levels 0–1; seconds at Level 2; minutes/shifts at Level 3; days/months at Level 4"
      ],
      note: "Never allow direct corporate office network connections to Level 1 PLC controllers! Industrial cybersecurity standard IEC 62443 mandates separating corporate IT networks from operational technology (OT) plant networks using segmented subnets, managed industrial firewalls, and demilitarized zones (DMZ)."
    },
    {
      title: "Integrating PLC, HMI and Supervision",
      content: "Integrating a programmable controller with an operator touchscreen (HMI) or SCADA system in TIA Portal represents a unified engineering workflow. Rather than manually exporting and re-typing memory addresses across separate software packages—which introduces severe addressing mismatch errors—TIA Portal combines STEP 7 and WinCC into a single shared database. In TIA Portal, the engineer creates an HMI device (e.g. SIMATIC KTP700 Basic or Unified Comfort Panel) and establishes an S7-subnet connection to the PLC in Network View with a single drag-and-drop link. Tags defined in the PLC Tag Table or Global Data Blocks are dragged directly onto HMI screen graphics: pushbuttons, status pilot lights, analog gauge bars, and numerical input boxes automatically bind to the underlying PLC tag. Alarm management is structured according to ISA-18.2: Discrete Alarms (triggered by PLC boolean fault bits, such as thermal motor overloads) and Analog Alarms (triggered when continuous process variables breach low-low, low, high, or high-high warning thresholds) are automatically logged, timestamped by the CPU clock, and presented in priority-ranked alarm banners requiring operator acknowledgment.",
      keyPoints: [
        "Unified Engineering Database: STEP 7 PLC logic and WinCC HMI screens reside within the same TIA Portal project; tags are synchronized automatically",
        "Symbolic Addressing Integration: Renaming a tag in the PLC Tag Table (e.g. 'Pump_Speed') instantly updates all bound HMI screens, scripts, and trend charts without breaking links",
        "ISA-101 High-Performance HMI Guidelines: Utilize clean, low-contrast grayscale backgrounds; reserve bright saturated colors (red, yellow) exclusively for abnormal alarm conditions",
        "ISA-18.2 Alarm Architecture: Categorize alarms into Warning (Yellow), Critical (Orange), and Emergency (Red); implement required operator acknowledgment sequences",
        "Real-Time Trend Recording: High-speed cyclic polling buffers historical analog data (temperatures, pressures) into continuous trend graphs for operator analysis",
        "Recipe Management: Pre-configured parameter tables (e.g. blending proportions) stored in HMI memory and downloaded as complete datasets to PLC Data Blocks",
        "User Access Security: Multi-tier password authorization restricting sensitive calibration and tuning screens to certified maintenance engineers"
      ],
      note: "Follow the ISA-101 standard for HMI design: avoid flashy 3D graphics, spinning animations, and garish background colors! A professional industrial HMI should resemble an aircraft cockpit: muted, clear grayscale displays where an illuminated red warning immediately captures the operator's attention during an emergency."
    },
    {
      title: "Real-World Application Case Study",
      content: "This comprehensive case study synthesizes every automation principle mastered across the course into a complete, operational industrial facility: an Automated Liquid Chemical Blending and Dispensing Plant. The process architecture comprises three raw ingredient storage tanks (Tanks A, B, and C) and a main heated jacketed mixing reactor (Tank D). The system is engineered using a Siemens S7-1200 CPU 1214C DC/DC/DC, an SM 1234 combo analog module (4 AI / 2 AQ), an SM 1221 digital expansion card, and a SIMATIC KTP700 Basic HMI panel connected via PROFINET. Continuous fluid level in Tank D is measured by an ultrasonic 4–20mA level transmitter wired to %IW64, scaled via NORM_X and SCALE_X into 0.0 to 10.0 cubic meters. Temperature in the jacketed reactor is regulated at 65.0°C by a PID_Compact Technology Object executing in Cyclic Interrupt OB30, commanding an analog modulating steam valve via %QW64. Ingredients are metered using high-speed pulse turbine flowmeters tracked via High-Speed Counters (HSC1 and HSC2). Agitator speed is controlled by an incremental encoder feedback loop driving a 3-phase motor via a variable frequency drive over PROFINET. The entire plant is governed by an automated state machine, full emergency stop interlocking, and historical recipe batch logging.",
      keyPoints: [
        "Multi-Tier System Architecture: Fully integrated S7-1200 CPU 1214C, distributed PROFINET remote I/O, VFD motor drives, and KTP700 touchscreen",
        "High-Speed Metering: High-Speed Counter (HSC1) processes pulses from turbine flowmeters to meter precise ingredient volumes into the reactor",
        "Continuous Level Scaling: NORM_X and SCALE_X transform 4–20mA ultrasonic transmitter readings into accurate volumetric fluid levels (0.0 to 10.0 m³)",
        "Closed-Loop Thermal Regulation: PID_Compact Technology Object in OB30 regulates reactor temperature at 65.0°C via analog steam valve modulation",
        "Finite State Machine Sequence: Automatic batch sequence: Tank Flushing -> Ingredient A Fill -> Ingredient B Fill -> Heating & Agitation -> Drain & Clean",
        "Tri-Tier Safety Interlocking: Hardwired dual-channel emergency stop relay de-energizes main motor contactors; software safety rungs inhibit auto sequencing",
        "Commissioning and Handover Dossier: Complete project delivery documentation: Master I/O Schedule, As-Built Electrical Schematics, Tag Cross-Reference, Factory Acceptance Test (FAT) protocol, and Operator Maintenance Manual"
      ],
      note: "The mark of an exceptional automation engineer is not just writing code that functions when everything is perfect, but engineering a system that behaves predictably, safely, and informatively when components fail! Always design thorough fault diagnostics, clear alarm banners, and fail-safe fallback states into every industrial project."
    }
  ],
  review: [
    "Diagram the 5 functional levels of the ISA-95 Industrial Automation Pyramid and identify the technologies operating at each level.",
    "Explain how the unified database architecture in Siemens TIA Portal prevents tag addressing and naming errors between the PLC and HMI.",
    "Describe the key principles of the ISA-101 High-Performance HMI standard. Why are bright saturated colors discouraged for normal operational displays?",
    "Explain the role and architecture of an ISA-18.2 compliant industrial alarm management system.",
    "In the chemical blending case study, detail how NORM_X and SCALE_X convert raw 4–20mA analog counts into cubic meters of fluid volume.",
    "Explain how the High-Speed Counter (HSC) and the PID_Compact closed-loop controller operate concurrently within the S7-1200 CPU.",
    "List the critical engineering deliverables that must be compiled into the final handover dossier delivered to a plant owner upon project completion."
  ]
};

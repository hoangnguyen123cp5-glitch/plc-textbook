// Nội dung bài học — ánh xạ từ nội dung cũ sang cấu trúc theo đề cương slide thật.
// Map: lessonSlug -> nội dung từng section
//
// LƯU Ý: nội dung đang là tiếng Việt và sẽ được dịch sang tiếng Anh theo lộ trình.
// Bốn bài mới dựng từ slide (06, 07, 13, 14) chưa có nội dung — xem CONTENT-GAPS.md.

export interface LessonContent {
  overview: string;
  objectives: string[];
  sections: {
    title: string;
    content: string;
    keyPoints?: string[];
    note?: string;
  }[];
  review?: string[];
}

export const lessonContent: Record<string, LessonContent> = {

  '01-programmable-control': {
    "overview": "Every industrial automation machine—from high-speed elevators and industrial washing systems to automated beverage bottling lines—is fundamentally a control system: an engineered architecture capable of measurement, decision logic, and physical execution. This lesson establishes the theoretical cornerstone for the entire course: the core distinction between open-loop and closed-loop control systems, the economic and operational drivers behind the industrial shift from hardwired relay cabinets to Programmable Logic Controllers (PLCs), the internal hardware architecture of a PLC CPU, and specifically the scan cycle mechanism—the root origin of over 90% of logic errors encountered by beginner automation engineers.",
    "objectives": [
      "Explain the fundamental principles of control systems and accurately contrast open-loop, closed-loop, and computerised control architectures",
      "Compare the technical and operational trade-offs between hardwired relay panels and software-programmable controllers",
      "Describe the internal hardware architecture of a modern PLC: power supply unit, central processing unit (CPU), discrete/analog I/O sections, and internal system buses",
      "Differentiate the functional memory areas of the Siemens S7-1200 (Load Memory, Work Memory, Retentive Memory) and interpret the front-panel diagnostic status LEDs (RUN/STOP, ERROR, MAINT)",
      "Analyze the 4 sequential phases of the PLC scan cycle and explain the critical role of Process Image Input (PII) and Process Image Output (PIQ)",
      "Identify the 5 standardized programming languages defined by IEC 61131-3 (LAD, FBD, SCL, STL, SFC) and assess the primary industrial application domain for each language"
    ],
    "sections": [
      {
        "title": "1.1 Fundamentals of Control Systems",
        "content": "A control system manages, commands, directs, or regulates the behavior of other devices or technological processes. Scope spans from a simple household bimetallic thermostat to a sprawling chemical refinery encompassing thousands of I/O loops; however, the anatomical architecture invariably comprises 5 foundational elements: Reference Input / Setpoint (SP), Measurement Element / Sensor, Error Detector / Comparator, Controller, and Actuator (Final Control Element). Understanding these 5 building blocks allows automation engineers to clearly delineate the software domain of the PLC: the PLC functions as the controller block, receiving digitized feedback from sensors and executing logic to command physical actuators.",
        "keyPoints": [
          "Setpoint (SP): The target or desired value the process variable must attain (e.g. 60°C, 4.0 bar, 2.5 m level)",
          "Process Variable (PV): The actual measured physical state dynamically sampled at the plant output",
          "Disturbance: Uncontrolled internal or external factors that perturb process equilibrium (e.g. ambient draft, voltage sag, mechanical friction)",
          "Actuator: The physical device converting low-power electrical commands into mechanical, thermal, or fluid energy (e.g. electric motors, control valves, heating elements)",
          "These 5 elements recur systematically across all industrial automation tiers, from discrete relay interlocks to distributed SCADA / DCS architectures"
        ]
      },
      {
        "title": "1.2 Open-Loop, Closed-Loop, and Computerised Control",
        "content": "In an open-loop control system, the output process variable has zero influence on the controller action. A classic example is a time-clock street lighting system: lamps turn on at 18:00 and off at 06:00 regardless of whether the sky is overcast by a severe thunderstorm or illuminated by a full moon. When the timer is replaced by a photo-conductive sensor (LDR photocell) measuring ambient light lux, the system becomes closed-loop: the measured light intensity is fed back to the comparator, dynamically switching the luminaires when lux drops below a calibrated threshold. Closed-loop systems exhibit high precision and automatic disturbance rejection, though they introduce loop complexity and potential closed-loop instability (hunting/oscillation). Computerised control refers to closed-loop architectures where digital microprocessors (such as PLCs or industrial PCs) sample process variables at discrete time intervals.",
        "keyPoints": [
          "Open-Loop: Simple topology, low upfront capital cost, unconditionally stable without feedback oscillation, but vulnerable to process disturbances",
          "Closed-Loop: Automatically compensates for dynamic disturbances via continuous negative feedback loops",
          "Control Error Formulation: e(t) = Setpoint (SP) − Process Variable (PV)",
          "Computerised Control: Utilizes digital microprocessors running discrete-time cyclic scan algorithms",
          "Engineering Design Rule: Closed-loop is not universally superior; for non-critical loads with predictable dynamics, open-loop remains the most cost-effective choice"
        ],
        "note": "Avoid the naive assumption that \"closed-loop is always better\". Engineering selection depends on operational tolerances, safety criticality, and project budget. A lawn sprinkler timer rarely justifies the capital expense of soil moisture telemetry."
      },
      {
        "title": "1.3 Hardwired Relay Logic versus Programmable Control",
        "content": "Historically, industrial automation evolved across two distinct paradigms. Hardwired control comprises electromechanical contact logic (interposing relays, contactors, pneumatic timers) and static solid-state logic (discrete logic gates, transistor arrays, SCR/TRIAC trigger modules). In both implementations, the control sequence is physically locked into copper wiring topologies. By contrast, programmable control encapsulates the decision logic entirely within microprocessor memory addresses. This distinction fundamentally transforms engineering workflows: re-sequencing a hardwired panel requires scheduled line shutdowns, mechanical panel re-drilling, contactor additions, and labor-intensive rewiring; a PLC system retains 100% of existing field terminal wiring, requiring only software logic modification and a 10-second program download.",
        "keyPoints": [
          "Electromechanical Relay Systems: Utilize moving mechanical contacts subject to contact pitting, mechanical wear, and arc erosion after hundreds of thousands of duty cycles",
          "Solid-State Discrete Systems: Utilize discrete transistor and IC logic gates; offers faster switching speeds but remains topologically rigid to wiring layout",
          "Programmable Logic Controllers: Physical copper wiring terminates once at screw terminals (DI/DO); all interlocking rules reside in software code",
          "Hardwired Engineering Workflow: Requirement → Schematic Drafting → Component Procurement → Panel Wiring → Commissioning",
          "PLC Engineering Workflow: Requirement → Algorithm Modeling → Software Coding → CPU Download → Online Debugging"
        ]
      },
      {
        "title": "1.4 Why Industry Switched to the PLC: Technical & Economic Case Study",
        "content": "Consider a standard industrial manufacturing cell: sequential starting of two conveyor motors, M1 and M2. Under a traditional relay panel, the circuit requires two magnetic motor starters, an on-delay pneumatic timer relay, auxiliary contact blocks, and dozens of jumper wires. When manufacturing operations require a reverse-sequence shutdown (\"Motor 2 must stop first, followed 5 seconds later by Motor 1\"), the relay cabinet must be powered down, an additional off-delay timer purchased, existing control circuits dismantled, and the entire panel re-verified point-to-point. With a PLC, field cables remain untouched; the automation engineer simply opens TIA Portal, inserts an off-delay timer block (TOF) into OB1, and downloads the revision in seconds. The capability to make operational revisions virtually cost-free and instantaneous is the primary economic driver that eradicated relay panels worldwide.",
        "keyPoints": [
          "Footprint Reduction: A compact 110x100mm PLC CPU replaces an entire 800x1200mm industrial relay enclosure",
          "Near-Zero Modification Overhead: Operational logic alterations are handled in software without wiring re-work or hardware scrap",
          "Integrated Online Diagnostics: Real-time \"Go Online\" and \"Watch Table\" features expose live bit states directly on ladder rungs",
          "Network Scalability: Standardized industrial Ethernet (PROFINET) enables seamless PLC-to-PLC coordination and HMI/SCADA data acquisition",
          "Industrial Reliability: Solid-state microelectronics feature zero moving parts, delivering uninterrupted 24/7 service over 10 to 15 years"
        ]
      },
      {
        "title": "1.5 Defining the PLC: NEMA Standards and Historical Origins",
        "content": "The National Electrical Manufacturers Association (NEMA) defines a PLC as: \"A digitally operating electronic apparatus which uses a programmable memory for the internal storage of instructions for implementing specific functions such as logic, sequencing, timing, counting, and arithmetic, to control, through digital or analog input/output modules, various types of machines or processes.\" The concept originated in 1968, when manufacturing engineers at General Motors' Hydramatic Division issued a 10-point technical specification seeking a replacement for hardwired relay panels: easy programming without electrician retraining, logic revisions without panel rewiring, compact footprint, lower cost, and high reliability in harsh plant floor conditions. The resulting breakthrough—the Modicon 084 designed by Dick Morley—inaugurated the modern industrial automation era.",
        "keyPoints": [
          "NEMA Standard Definition: Digital apparatus, programmable internal memory, logic/timer/counter/math functions, modular digital/analog I/O interface",
          "1968 GM Hydramatic Specification: 10 design criteria intended to eradicate relay panel downtime in automotive stamping and assembly plants",
          "The First Commercial PLC: The Modicon 084 developed in 1969",
          "Terminology: PLC (Programmable Logic Controller) and PC (Programmable Controller in North American literature) represent the identical apparatus",
          "Technical Writing Standard: \"PLC\" is preferred globally to avoid confusion with \"Personal Computer\""
        ]
      },
      {
        "title": "1.6 Internal Hardware Architecture of a PLC",
        "content": "At its core, a PLC is an industrial-hardened computer enclosed in an impact-resistant, dust-sealed, and vibration-damped chassis. Its anatomical architecture consists of 5 primary subsystems: (1) Power Supply Unit (PSU), converting 120/230VAC mains or regulating 24VDC to clean internal bus logic voltages (5VDC/3.3VDC); (2) Central Processing Unit (CPU Module), containing the industrial microprocessor, clock generators, and memory chips that govern all system operations; (3) Digital/Analog Input Section, interfacing field switches, encoders, and sensors through optical isolators (optocouplers) and RC filter networks that block transient voltage spikes; (4) Output Section, executing switching commands via electromechanical relays or power MOSFET transistors; (5) Internal System Bus, comprising the Address Bus, Data Bus, and Control Bus for synchronized inter-module backplane communication.",
        "keyPoints": [
          "Power Supply Unit: Provides isolated 24VDC/5VDC rails to internal logic cards; attenuates line noise and surges",
          "CPU Module: System brain executing cyclic input sampling, OB1 user code evaluation, and interrupt service routines",
          "Digital Input (DI) Modules: Feature optocouplers (500VAC isolation) and hardware RC filters to suppress contact bounce and inductive surges",
          "Digital Output (DO) Modules: Relay contacts (2A AC/DC rating, low switching speed) or Transistor outputs (0.5A DC, high-speed switching for PWM/PTO motion)",
          "Backplane Bus: Address Bus (pinpoints register offsets), Data Bus (transfers bit/word values), Control Bus (synchronizes read/write clocks)"
        ]
      },
      {
        "title": "1.7 Memory Organization and Diagnostic LEDs on the S7-1200",
        "content": "The memory of the Siemens S7-1200 CPU is structured functionally rather than as flat physical address space: Program Area stores compiled code blocks (OB, FC, FB); Parameter Area stores hardware configuration tables, IP addresses, and protection passwords; Data Area stores temporary calculations, I/O process image tables (PII/PIQ), bit memory markers (M), and Data Blocks (DB). Physically, memory consists of: Load Memory (non-volatile Flash retaining the complete project including symbolic tags and comments, expandable via SIMATIC Memory Card), Work Memory (high-speed internal volatile RAM where the CPU executes active code), and Retentive Memory (non-volatile NVRAM backed by supercapacitors that preserves critical tags across power cycles). Front-panel diagnostic LEDs provide immediate visual telemetry into the CPU operating state.",
        "keyPoints": [
          "Load Memory: Non-volatile Flash storing compiled code, hardware configurations, and symbolic tags; expandable via SIMATIC SD card",
          "Work Memory: Ultra-fast volatile RAM (~100 KB); the CPU loads executable runtime blocks from Load Memory during startup",
          "Retentive Memory: Non-volatile storage (~10 KB) maintaining production setpoints, batch recipe tags, and part counters across power interruptions",
          "RUN/STOP LED: Solid Green = CPU executing cyclic scan; Solid Amber = CPU stopped with outputs held in safe de-energized state",
          "ERROR LED: Flashing Red = Hardware diagnostic alarm, broken field sensor loop, or runtime math exception (e.g. division by zero)",
          "MAINT LED: Solid Amber = Maintenance demanded (e.g. RTC battery exhausted or memory card service needed)",
          "I/O Status LEDs (Ix.x, Qx.x): Indicate physical presence of 24VDC potential at the terminal screw (independent of software logic state)"
        ],
        "note": "The input LED Ix.x reflects physical electrical potential directly at the terminal strip. If an input LED is illuminated green but the corresponding tag in TIA Portal remains False (0), the fault is strictly in the software configuration or CPU operating mode—not an external field wiring break!"
      },
      {
        "title": "1.8 The PLC Scan Cycle and Process Image Tables",
        "content": "A PLC does not execute program code once and terminate; rather, it loops perpetually through a deterministic, real-time sequence known as the Scan Cycle. A standard scan cycle comprises 4 sequential phases: (1) Input Scan: The CPU polls all physical input terminals and snapshots their instantaneous states into the Process Image Input (PII) memory buffer; (2) Program Execution: The CPU evaluates user networks in OB1 top-to-bottom, reading exclusively from PII and storing intermediate results in local memory and the Process Image Output (PIQ); (3) Housekeeping & Diagnostics: The CPU performs internal self-tests and processes communication requests from TIA Portal and HMI panels; (4) Output Scan: The CPU writes the contents of PIQ simultaneously to the physical output hardware terminals. Because logic evaluates the PII snapshot rather than physical pins directly, transient input pulses narrower than the scan time can be completely missed by the CPU.",
        "keyPoints": [
          "Phase 1 (Input Scan): Transfers instantaneous states of all physical digital inputs into the PII RAM table",
          "Phase 2 (Program Execution): The CPU evaluates OB1 networks sequentially; ensures data consistency across the entire rung execution",
          "Phase 3 (Housekeeping & Comms): Services background self-tests, PROFINET network stacks, and HMI polling requests",
          "Phase 4 (Output Scan): Transfers the contents of the PIQ image table to physical relay/transistor output terminals",
          "\"Last-Write Wins\" Principle: If a digital coil %Q0.0 is written TRUE in Network 1, but overwritten FALSE in Network 5 within the same scan, the physical output will be DE-ENERGIZED!",
          "Immediate I/O (e.g. %I0.0:P, %Q0.0:P): Bypasses image tables to access physical hardware pins immediately, but incurs CPU scan time penalties"
        ],
        "note": "Typical PLC scan times range from 1ms to 10ms depending on code length. High-speed pulse trains from incremental encoders (tens of kHz) must be handled by dedicated on-chip High-Speed Counters (HSC), never by software counter instructions in OB1."
      },
      {
        "title": "1.9 IEC 61131-3 Programming Languages and Block Architecture",
        "content": "The international standard IEC 61131-3 defines five standardized programming languages for industrial control systems. The three most prevalent in industry originate from distinct engineering backgrounds: Ladder Diagram (LAD) emulates relay contact ladder schematics, offering immediate familiarity to industrial electricians and technicians; Function Block Diagram (FBD) portrays program logic as interconnected functional blocks, favored in safety interlock and process control loops; Structured Control Language (SCL / ST) is a high-level Pascal/C-like text language, exceptionally powerful for complex mathematical formulas, data array sorting, recipe indexing, and nested iterative loops. All three languages coexist seamlessly within the same TIA Portal project. Above the language syntax is the program block hierarchy: Organization Blocks (OB, handling cyclic and interrupt-driven execution), Functions (FC, stateless modular subroutines), and Function Blocks (FB, stateful subroutines backed by dedicated Instance Data Blocks).",
        "keyPoints": [
          "LAD (Ladder Diagram): Graphical relay-ladder representation; ideal for discrete digital interlocks and straightforward online troubleshooting",
          "FBD (Function Block Diagram): Graphical signal-flow block representation; ideal for analog signal conditioning and burner management systems",
          "SCL (Structured Control Language): Textual structured syntax; optimal for complex mathematical algorithms, data table manipulation, and loop operations",
          "IL (Instruction List) & SFC (Sequential Function Chart): The remaining IEC languages; SFC is particularly dominant for state-machine sequential processes",
          "Main Organization Block (OB1): The top-level entry routine called cyclically by the operating system in every scan",
          "FC vs FB Modular Architecture: Functions (FC) execute stateless logic; Function Blocks (FB) maintain static state memory within dedicated Instance DBs"
        ]
      }
    ],
    "review": [
      "Identify the 5 core functional elements present in all automated control systems and provide an industrial example for each component.",
      "A street lighting circuit is turned on at 18:00 and off at 06:00 using a 24-hour time clock. Classify this control topology as open-loop or closed-loop, and describe the engineering modifications required to convert it to the other topology.",
      "Why does migrating from hardwired relay panels to a PLC architecture save manufacturing plants hundreds of production downtime hours when retooling a production line?",
      "State the NEMA definition of a Programmable Logic Controller and explain the 1968 General Motors specification that catalyzed the invention of the PLC.",
      "Contrast the functional roles of Load Memory, Work Memory, and Retentive Memory in a Siemens S7-1200 CPU. Which memory area is completely volatilized upon power loss?",
      "The CPU RUN LED is illuminated solid green, yet an associated conveyor drive fails to run. Before opening an engineering laptop to connect a programming cable, what front-panel CPU status indicators can you inspect to isolate the fault?",
      "Detail the 4 sequential phases of the PLC scan cycle. Why can an input pulse with a 0.5ms duration be missed by the CPU if the scan cycle time is 5ms?",
      "Compare the technical advantages and ideal application domains of Ladder Diagram (LAD) and Structured Control Language (SCL) in TIA Portal."
    ]
  },

  '02-s7-1200-tia-portal': {
    "overview": "This lesson provides a comprehensive engineering walkthrough of Siemens SIMATIC S7-1200/1500 PLC hardware, TS35 DIN-rail mechanical mounting, 24VDC power distribution, discrete digital input (DI) and digital output (DO) field wiring (sinking vs sourcing), and PROFINET industrial Ethernet commissioning. TIA Portal (Totally Integrated Automation Portal) is Siemens' unified engineering environment uniting hardware configuration, PLC logic programming (STEP 7), HMI graphics development (WinCC), and drive network commissioning into a single cohesive interface.",
    "objectives": [
      "Identify and specify all physical hardware modules within the SIMATIC S7-1200 modular family",
      "Mount and secure the S7-1200 CPU and expansion modules onto standard TS35 DIN rail complying with thermal clearance standards",
      "Correctly wire 24VDC system power, discrete sinking/sourcing inputs, and relay/transistor outputs",
      "Configure static IP addressing and subnet masks for the on-board PROFINET interface",
      "Install, license, and navigate the TIA Portal V19 engineering environment",
      "Create a new automation project and configure the exact CPU hardware catalog number (MLFB)",
      "Develop baseline Ladder Diagram logic and download executable code blocks to the CPU",
      "Perform virtual offline simulation using PLCSIM and monitor live tag states via Watch Tables"
    ],
    "sections": [
      {
        "title": "2.1 The S7-1200 Programmable Controller Hardware Family",
        "content": "The modular SIMATIC S7-1200 system comprises: the Central Processing Unit (CPU), Signal Modules (SM for expanding digital/analog I/O count), Communication Modules (CM for serial RS485/RS232 or PROFIBUS networks), and Signal Boards (SB mounted directly into the front receptacle of the CPU).",
        "keyPoints": [
          "Integrated CPU: Incorporates microprocessor, execution work memory, load memory, discrete/analog I/O, and PROFINET port",
          "CPU Power Options: Available in 24VDC or 85–264VAC line supply models",
          "Signal Modules (SM): Mount sequentially to the RIGHT of the CPU, supporting up to 8 SM modules",
          "Communication Modules (CM): Mount to the LEFT of the CPU, supporting up to 3 CM modules",
          "Signal Board (SB): Inserts flush into the CPU front bezel (providing 2DI/2DO or 1AI/1AO without expanding rack width)"
        ]
      },
      {
        "title": "2.2 DIN Rail Mechanical Installation and Thermal Clearances",
        "content": "Proper mechanical installation of the S7-1200 onto a standard 35mm DIN rail (EN 50022). Maintaining proper thermal ventilation clearances is vital for device longevity in industrial enclosures.",
        "keyPoints": [
          "Secure TS35 DIN rail to the enclosure backplate, anchoring screws every 75mm",
          "Hook the top rear notch of the CPU over the upper DIN rail lip and pull down the lower DIN clip",
          "Pivot the CPU flush against the rail and release the spring clip to lock securely",
          "Maintain minimum thermal ventilation clearances: ≥25mm above and below the CPU and expansion modules",
          "Enclosure ambient operating temperature rating: 0°C to 55°C horizontal mounting, 0°C to 45°C vertical"
        ],
        "note": "Always de-energize and lock out all upstream electrical power supplies before mounting or dismounting modules on the DIN rail."
      },
      {
        "title": "2.3 Power Supply and Digital Input (DI) Wiring Topologies",
        "content": "24VDC power connects to the CPU at terminals L+, M, and Protective Earth (PE). The discrete digital inputs of the S7-1200 support Sinking or Sourcing topologies depending on common-terminal wiring.",
        "keyPoints": [
          "24VDC Supply: L+ (positive 24V), M (0V common return), PE (Protective Earth chassis ground)",
          "Sinking Input (NPN sensor compatible): 0V (M) connected to common terminal 1M; external +24VDC signal triggers input ON",
          "Sourcing Input (PNP sensor compatible): +24VDC connected to common terminal 1M; 0V signal triggers input ON",
          "Siemens Default Standard: Configured as Sinking Input (IEC 61131-2 Type 1 Sink)",
          "Input Conditioning: Integrated optical isolation (500VAC) and hardware RC debounce filtering"
        ]
      },
      {
        "title": "2.4 Digital Output (DO) Wiring Topologies",
        "content": "Digital outputs are available in three distinct technologies: Electromechanical Relay (AC/DC loads), Solid-State DC Transistor (MOSFET sourcing, high switching speed), and Triac (AC switching). The CPU 1214C DC/DC/DC variant provides transistor outputs.",
        "keyPoints": [
          "Relay Outputs: Capable of switching AC (up to 250VAC) or DC (up to 30VDC), rated for 2.0A resistive load per point",
          "Transistor Outputs (DC): 24VDC sourcing (PNP), 0.5A max continuous current, switching frequencies up to 100kHz for motion control",
          "Triac Outputs: Solid-state AC switching with zero-crossing turn-off; unsuitable for DC loads",
          "Inductive Load Protection: Always connect reverse-biased freewheeling flyback diodes across DC solenoids and relay coils",
          "Output Grouping: The CPU 1214C provides 10 DO points divided into 2 isolated voltage groups (1L/2L)"
        ]
      },
      {
        "title": "2.5 I/O Addressing and Expansion Architecture",
        "content": "Every discrete physical I/O point is assigned an absolute byte.bit identifier (e.g. %I0.0, %Q0.0). The CPU 1214C provides on-board addresses %I0.0–%I1.5 (14 DI) and %Q0.0–%Q1.1 (10 DO). Expansion modules receive consecutive addresses configured in TIA Portal.",
        "keyPoints": [
          "%I0.0 through %I1.5: 14 integrated digital input channels on CPU 1214C",
          "%Q0.0 through %Q1.1: 10 integrated digital output channels on CPU 1214C",
          "First expansion SM: Default addressing begins at byte %I2.0... and %Q2.0...",
          "Analog Addressing: Words %AIW64, %AIW66 for inputs; %AQW64 for analog outputs",
          "Symbolic Decoupling: Address allocation is governed by hardware configuration rather than physical rack slot number"
        ]
      },
      {
        "title": "2.6 PROFINET Network Configuration and Topology",
        "content": "The CPU S7-1200 integrates an RJ45 PROFINET interface (10/100 Mbps, Auto-Negotiation, Auto-MDI/X). This port serves engineering programming from TIA Portal, operator HMI communication, and real-time distributed PROFINET IO.",
        "keyPoints": [
          "Factory Default IP Address: 192.168.0.1, Subnet Mask: 255.255.255.0",
          "Physical Cabling: Standard Cat5e shielded twisted-pair (STP) Ethernet, maximum 100m segment length",
          "Direct Connection: Auto-MDI/X automatically detects straight-through or crossover patch cables",
          "PROFINET IO Real-Time: Deterministic cyclic data exchange with remote ET200SP drops and VFD drives",
          "Media Redundancy Protocol (MRP): Ring topology support for zero-downtime single-point cable breaks",
          "Connection Budget: Supports up to 16 concurrent S7/HMI/Open-User communication sockets"
        ],
        "note": "When connecting directly between an engineering PC and the PLC without a network switch, ensure the PC network interface card is assigned a static IP address in the same subnet (e.g. 192.168.0.241)."
      },
      {
        "title": "2.7 Signal Boards and Specialized Modules",
        "content": "A Signal Board (SB) inserts directly into the front faceplate of the CPU, expanding I/O capacity without increasing DIN rail width. This is an optimal, cost-effective solution for compact enclosures.",
        "keyPoints": [
          "SB 1221: 4 additional digital inputs supporting 200kHz high-speed counting",
          "SB 1222: 4 additional digital outputs supporting 200kHz pulse trains for stepper/servo drives",
          "SB 1223: Combination board providing 2DI (24VDC) and 2DO (24VDC)",
          "SB 1231: 1 analog input channel (±10V, 0–20mA, or RTD PT100), 12-bit resolution",
          "SB 1232: 1 analog output channel (±10V or 0–20mA, 12-bit)",
          "CB 1241: RS485 communication board for Modbus RTU or USS drive control",
          "Hardware Restriction: Each S7-1200 CPU can host exactly one Signal Board / Communication Board"
        ]
      },
      {
        "title": "2.8 Electrical Safety, Noise Isolation, and Grounding Rules",
        "content": "Rigorous electrical safety and grounding practices are mandatory in industrial control enclosures. Compliance with international standards ensures personnel safety and immunity against electromagnetic interference (EMI).",
        "keyPoints": [
          "ALWAYS isolate and verify zero-energy state before servicing wiring — follow Lockout/Tagout (LOTO) procedures",
          "Bond Protective Earth (PE) directly from the facility grounding bar to the CPU, enclosure chassis, and DIN rail",
          "Segregate low-voltage DC sensor cables from 400VAC motor power conductors in separate wire ducts by ≥100mm",
          "Provide branch circuit fuse or miniature circuit breaker (MCB) protection sized to wire ampacity",
          "Terminate all stranded wire ends using insulated ferrules (bootlace crimp pins) to prevent stray wire shorts",
          "Affix permanent wire labels at both terminal ends matching the schematic drawing designations"
        ],
        "note": "Industrial control panel wiring must strictly adhere to IEC 60204-1 (Safety of Machinery - Electrical Equipment of Machines) and NFPA 79 standards."
      },
      {
        "title": "3.1 Introduction to the TIA Portal Engineering Suite",
        "content": "TIA Portal V19 is Siemens' unified engineering framework supporting S7-1200, S7-1500, S7-300/400, WinCC Comfort/Unified, and SINAMICS motion drives. The user interface features Portal View (task-oriented) and Project View (hierarchical object navigation).",
        "keyPoints": [
          "Recommended System Specifications: 64-bit Windows 10/11, Quad-core processor, ≥16GB RAM, SSD storage",
          "Installation Footprint: Approximately 25GB disk space for STEP 7 Professional, WinCC Advanced, and PLCSIM",
          "Licensing Architecture: Automation License Manager (ALM) manages floating and node-locked licenses",
          "21-Day Trial License: Freely downloadable from the Siemens Industry Online Support (SIOS) portal"
        ]
      },
      {
        "title": "3.2 Project Creation and Hardware Configuration Workflow",
        "content": "Engineering workflow: Create new project → Add new device → Select exact CPU catalog model and firmware revision → Parameterize IP address → Append Signal Modules on the virtual rack.",
        "keyPoints": [
          "Verify the complete MLFB Article Number on the CPU physical label (e.g. 6ES7 214-1AG40-0XB0)",
          "Select the matching firmware version (e.g. V4.6); mismatched firmware can reject block downloads",
          "Hardware Auto-Detection: Use \"Detect unspecific CPU\" to discover and upload connected network hardware",
          "PLC Tag Table: Define meaningful symbolic identifiers (e.g. \"PB_Start_Motor\" instead of %I0.0)",
          "Compile Hardware (Ctrl+B) to validate backplane power budgets and addressing boundaries"
        ]
      },
      {
        "title": "3.3 PLC Program Block Architecture: OB, FC, FB, and DB",
        "content": "The modular program architecture comprises: Organization Blocks (OB, operating system interface), Functions (FC, stateless routines), Function Blocks (FB, stateful routines with Instance DB), and Data Blocks (DB, global shared memory).",
        "keyPoints": [
          "Main OB (OB1): Executed cyclically by the CPU operating system in continuous loop",
          "Startup OB (OB100): Executed exactly once upon CPU transition from STOP to RUN mode",
          "Cyclic Interrupt OB (OB30–OB38): Executed at precise, user-configured time intervals (e.g. 100ms PID loops)",
          "Functions (FC): Modular logic blocks without internal memory; intermediate tags reside in volatile temporary stack",
          "Function Blocks (FB): Stateful logic blocks backed by dedicated Instance Data Blocks (Instance DB)",
          "Global Data Blocks (DB): Project-wide structured memory tables accessible by all program blocks"
        ]
      },
      {
        "title": "3.4 Program Compilation, Downloading, and Online Monitoring",
        "content": "Following ladder development: Compile Software (Ctrl+Shift+B) → Resolve syntax errors → Download to Device (Ctrl+D) → Go Online to monitor real-time rung execution.",
        "keyPoints": [
          "Compilation: Checks data type consistency, symbolic addressing validity, and instruction syntax",
          "Download to Device: Transfers hardware configuration tables and compiled user blocks to CPU Load Memory",
          "Go Online: Establishes active telemetry link to the CPU, visually displaying real-time power flow",
          "Program Status (Glasses Icon): Illuminates energized rungs in green dashed lines showing live boolean states",
          "Watch Table: Real-time tabular monitoring and manual variable forcing for field commissioning"
        ],
        "note": "Switch the CPU to STOP before downloading hardware configuration changes to prevent unpredictable machinery motion."
      },
      {
        "title": "3.5 PLCSIM — Hardware-Free Virtual Simulation",
        "content": "S7-PLCSIM creates a fully virtualized CPU instance within your PC operating system, enabling comprehensive logic testing and offline commissioning without physical PLC hardware.",
        "keyPoints": [
          "Launch PLCSIM: Click \"Start Simulation\" in TIA Portal; the virtual CPU emulator boots automatically",
          "Download code and hardware to the virtual PLC identical to physical target hardware",
          "Simulate Digital Inputs (%I): Toggle input bits manually via SIM tables or integrated Watch Tables",
          "Force Tables: Force specific physical inputs/outputs to evaluate interlocking behavior",
          "Supported Platforms: Fully simulates S7-1200 and S7-1500 instruction sets, timers, counters, and math"
        ]
      },
      {
        "title": "3.6 PLCSIM Advanced — Networked Virtual PLC Emulation",
        "content": "PLCSIM Advanced extends simulation capabilities with a virtual Ethernet runtime, enabling multi-PLC networked testing, HMI communication, and Co-Simulation with digital twin software.",
        "keyPoints": [
          "Creates virtual PLC nodes accessible via real TCP/IP network adapters on your host machine",
          "Simulates complex industrial protocols including PROFINET IO and Open User Communication",
          "API Interfacing: Seamless integration with 3D physics engines (NX MCD, SIMIT, Factory I/O)",
          "Enables multi-instance simulation: Run multiple communicating virtual CPUs concurrently",
          "Accelerates virtual commissioning, reducing physical on-site commissioning time by up to 60%"
        ]
      },
      {
        "title": "3.7 Watch Tables and Force Tables: Online Monitoring and Override",
        "content": "Two indispensable diagnostic tools within TIA Portal. Watch Tables monitor and modify variables within program memory; Force Tables permanently override physical peripheral I/O regardless of user program logic.",
        "keyPoints": [
          "Watch Table: Monitors live tag states and allows temporary single-scan value modification",
          "Modify Value: Injects test values into memory tags without modifying compiled ladder code",
          "Force Table: Forces peripheral inputs and outputs (%I:P, %Q:P) at the operating system hardware layer",
          "FORCE Status LED: Illuminates solid amber on the CPU faceplate whenever any I/O point is forced",
          "Safety Caution: Forcing physical outputs will actuate valves and motors on live machinery without interlocks"
        ],
        "note": "Always verify and clear all active force assignments (\"Stop Forcing\") before handing over an operating system."
      },
      {
        "title": "3.8 Cross-References and Diagnostic Navigation",
        "content": "The Cross-Reference utility tracks every occurrence of an address, tag, or block across the entire project, pinpointing read/write locations and rapidly isolating duplicate coil assignments.",
        "keyPoints": [
          "Access via F11 or right-click any tag → \"Cross-references\"",
          "Clearly indicates whether an address is accessed as a Read contact or a Write coil/assignment",
          "Rapidly identifies \"Duplicate Coil\" defects (multiple rungs attempting to write to the identical %Q bit)",
          "The \"Go To\" navigation feature jumps directly to compiler error locations with a single click",
          "Correlates with the CPU Diagnostic Buffer to locate runtime block execution faults"
        ]
      },
      {
        "title": "3.9 Tag Tables and Symbolic Addressing Best Practices",
        "content": "Employing descriptive symbolic identifiers (tags) in place of raw absolute addresses (%I0.0, %M10.2) is fundamental to professional, maintainable automation software engineering.",
        "keyPoints": [
          "Default Tag Table: Centralized database managing all physical discrete and analog I/O mappings",
          "Supported Data Types: Bool, Byte, Int, DInt, Real, Word, DWord, Time, String",
          "Global Refactoring: Renaming a tag in the Tag Table automatically updates all occurrences project-wide",
          "Excel Integration: Full bi-directional Import/Export capability via .xlsx and .csv files",
          "Standardized Naming Conventions: Use consistent prefixes (e.g. DI_Estop_Active, DO_Conveyor_Run, AI_Oven_Temp)"
        ]
      },
      {
        "title": "3.10 Project Archiving, Backup (.zap19), and Version Control",
        "content": "Creating compressed project archives (.zap format) encapsulates all engineering source code, hardware profiles, and HMI screens into a single portable container for backup and distribution.",
        "keyPoints": [
          "Project Archive: Compresses the multi-gigabyte project folder into a clean, portable .zap19 archive file",
          "Project Retrieve: Decompresses and reconstructs archived project structures intact",
          "Software Upload from Station: Reads compiled blocks and hardware configurations directly from a live CPU",
          "Version Management: Establish clear alphanumeric revision tags (e.g. Project_PackagingLine_V1_2_20261021)",
          "Firmware Archiving: Always document and archive installed module firmware revisions alongside project files"
        ]
      }
    ],
    "review": [
      "List the primary hardware modules that constitute a complete SIMATIC S7-1200 modular PLC system.",
      "Detail the step-by-step mechanical mounting procedure for snapping an S7-1200 CPU onto a standard TS35 DIN rail.",
      "What do the three \"DC\" designations signify in the catalog model CPU 1214C DC/DC/DC?",
      "Why is it critical to install a freewheeling flyback diode across inductive DC solenoid loads controlled by transistor outputs?",
      "Draw the electrical schematic for wiring a normally open (NO) pushbutton switch to digital input %I0.0 in a Sinking configuration.",
      "How does a Signal Board (SB) differ from a Signal Module (SM)? Provide an industrial application example for an SB 1232.",
      "What is the factory default IP address of an unconfigured Siemens S7-1200 CPU, and how is it modified in TIA Portal?",
      "Enumerate the sequential steps required to configure a new S7-1200 CPU project from scratch in TIA Portal V19.",
      "Explain the architectural distinction between a Function (FC) and a Function Block (FB). Under what conditions is an FB required?",
      "Why must a software project be fully compiled before executing a download to the target CPU?",
      "Can PLCSIM simulate an S7-1200 CPU? Describe the steps to launch an offline logic simulation.",
      "What is the operational purpose of a Watch Table, and how are symbolic tags added to it for online monitoring?",
      "What advanced technical capabilities does PLCSIM Advanced offer compared to standard PLCSIM?",
      "Why must automation engineers exercise extreme caution when applying Force Tables on live production machinery?",
      "What is a Siemens .zap archive file, and how is it created in TIA Portal?"
    ]
  },

  '03-binary-operations': {
    "overview": "Discrete bit logic programming in Ladder Diagram (LAD) forms the foundational bedrock of industrial automation. This lesson examines fundamental ladder instructions: normally open (NO) contacts, normally closed (NC) contacts, output coils, Set/Reset latches, start-stop seal-in circuits, and hardware/software interlocks. Timers (TON, TOF, TP) and counters (CTU, CTD, CTUD) provide precision time-delay generation and event counting according to IEC 61131-3 standards.",
    "objectives": [
      "Program combinational logic expressions (AND, OR, NOT) using Ladder Diagram contacts and branches",
      "Construct industrial motor Start-Stop control circuits utilizing self-holding seal-in branches",
      "Apply latch Set (S) and unlatch Reset (R) instructions correctly for memory retention",
      "Design bidirectional motor interlock circuits incorporating electrical and software interlocks",
      "Deploy and parameterize the three standard IEC timer blocks: TON, TOF, and TP",
      "Select and size appropriate timer types for specific industrial delay applications",
      "Implement CTU, CTD, and CTUD counter blocks for batch tracking and production counting",
      "Design sequential step-based state control circuits driven by timer cascades"
    ],
    "sections": [
      {
        "title": "4.1 OB1 and Cyclic Program Execution",
        "content": "All user control algorithms programmed within Main Organization Block 1 (OB1) are executed cyclically by the PLC operating system. Each Network (rung) represents an independent boolean logic expression, evaluated sequentially top-to-bottom and left-to-right.",
        "keyPoints": [
          "Network: The atomic logic unit in LAD, representing a discrete rung between power rails",
          "Power Flow: Conceptual electrical power flows from the left power rail (L+) toward the right neutral rail (M)",
          "Contacts: Represent operational preconditions (field digital inputs, memory bit markers %M)",
          "Coils: Represent execution results (physical digital outputs %Q, internal flags %M, DB bits)"
        ]
      },
      {
        "title": "4.2 Normally Open (NO), Normally Closed (NC) Contacts, and Output Coils",
        "content": "A Normally Open (NO) contact passes conceptual power when its referenced bit equals 1 (TRUE). A Normally Closed (NC) contact passes power when its referenced bit equals 0 (FALSE). An output coil assigns the rung power flow state (1 or 0) directly to its target bit address.",
        "keyPoints": [
          "NO Contact (—| |—): Conducts power when addressed bit = 1",
          "NC Contact (—|/|—): Conducts power when addressed bit = 0 (inverts logical state)",
          "Standard Output Coil (—( )—): Writes 1 to bit when rung is energized; writes 0 when rung is de-energized",
          "Duplicate Coil Warning: Never assign the same physical output address to multiple standard coils across different networks"
        ],
        "note": "An NC contact in software ladder logic does NOT denote a physically normally-closed switch in the field. Software NC performs a logical NOT operation on the sampled state of the addressed bit."
      },
      {
        "title": "4.3 Combinational Boolean Logic: AND, OR, and NOT",
        "content": "Series contacts create logical AND relationships (all preconditions must conduct). Parallel branches create logical OR relationships (any branch conducts). NC contacts execute boolean inversion (NOT).",
        "keyPoints": [
          "AND Logic = Series contacts: %I0.0 AND %I0.1 must both be TRUE to energize output %Q0.0",
          "OR Logic = Parallel contacts: %I0.0 OR %I0.1 energizes output %Q0.0",
          "NOT Logic = NC contact: Inverts the incoming bit status",
          "Complex Expressions: Nested parallel branches implement expressions such as (%I0.0 AND %I0.1) OR %I0.2 → %Q0.0"
        ]
      },
      {
        "title": "4.4 Motor Start-Stop Circuit and Seal-In Latching",
        "content": "The classic Start-Stop seal-in circuit is the most fundamental circuit in motor control. A momentary normally-open Start pushbutton is connected in parallel with an auxiliary contact of the motor output coil to maintain power after the button is released.",
        "keyPoints": [
          "Momentary Start button (%I0.0 NO) placed in parallel with motor auxiliary contact (%Q0.0 NO)",
          "Stop button (%I0.1 NC) placed in series with the parallel combination to break the holding circuit",
          "Boolean Formula: %Q0.0 := (Start OR %Q0.0) AND NOT Stop",
          "Stop-Dominant Principle: If both Start and Stop are depressed simultaneously, the Stop contact overrides and de-energizes %Q0.0",
          "Hardware Failsafe: Field Stop pushbuttons are wired mechanically Normally Closed (NC) to open the circuit upon wire breakage"
        ]
      },
      {
        "title": "4.5 Latch Set (S) and Unlatch Reset (R) Instructions",
        "content": "The Set (S) coil latches an addressed bit to 1 (TRUE) upon power flow and maintains that state even after rung power flow ceases. The Reset (R) coil unlatches the addressed bit back to 0 (FALSE).",
        "keyPoints": [
          "Set (S) Instruction: Writes 1 to bit; state persists indefinitely until cleared by an explicit Reset",
          "Reset (R) Instruction: Writes 0 to bit; clears any prior Set condition",
          "SR Flip-Flop: Set-dominant bistable block (Set wins if both S and R inputs are simultaneously energized)",
          "RS Flip-Flop: Reset-dominant bistable block (Reset wins if both S and R inputs are simultaneously energized)",
          "Application: Ideal for operational modes, alarm holding states, and valve positioning where memory retention is required"
        ]
      },
      {
        "title": "4.6 Electrical and Software Interlocking Circuits",
        "content": "Interlock circuits prevent mutually destructive field outputs from activating concurrently (e.g. forward and reverse contactors on a three-phase motor, which would cause a phase-to-phase dead short).",
        "keyPoints": [
          "Forward Contactor (%Q0.0): Rung contains an NC contact of Reverse (%Q0.1) to inhibit forward motion if reverse is active",
          "Reverse Contactor (%Q0.1): Rung contains an NC contact of Forward (%Q0.0) to inhibit reverse motion if forward is active",
          "Software Interlock: Prevents concurrent energization inside the PLC scan cycle",
          "Hardware Interlock: Auxiliary mechanical contacts on physical contactors wired in series with opposite coils in the field panel"
        ],
        "note": "Software interlocking alone is insufficient for personnel safety and equipment protection. Always implement physical mechanical/electrical contactor interlocks in the field panel."
      },
      {
        "title": "4.7 Bistable Latch Blocks: SR and RS Flip-Flops",
        "content": "The SR (Set dominant) and RS (Reset dominant) function blocks encapsulate latching behavior into standardized function blocks with explicit dominance handling when simultaneous Set and Reset signals occur.",
        "keyPoints": [
          "SR Flip-Flop: Set input overrides if both S and R1 inputs are active simultaneously",
          "RS Flip-Flop: Reset input overrides if both R and S1 inputs are active simultaneously (standard safety practice)",
          "Simplifies multi-condition latch logic without sprawling parallel seal-in rungs",
          "Ideal for alarm latches requiring mandatory operator manual acknowledgment before clearing",
          "Assigns state directly to dedicated %M markers or Data Block boolean tags"
        ]
      },
      {
        "title": "4.8 Edge Detection Instructions: P_TRIG and N_TRIG (One-Shots)",
        "content": "Edge detection instructions detect transitions in signal states: P_TRIG (Positive / rising edge, 0→1) and N_TRIG (Negative / falling edge, 1→0). Output conducts for exactly one PLC scan cycle.",
        "keyPoints": [
          "P_TRIG: Detects rising edge (0→1); commonly triggered upon pushbutton depression or sensor entry",
          "N_TRIG: Detects falling edge (1→0); triggered upon pushbutton release or part exit from sensor beam",
          "Prevents continuous repetitive instruction execution during sustained high signals",
          "Mandatory precursor for counter incrementing, FIFO queue shifting, and math accumulation rungs",
          "Requires an edge memory bit (%M or DB boolean) to store the previous scan cycle status"
        ]
      },
      {
        "title": "4.9 IEC Counter Function Blocks: CTU, CTD, and CTUD",
        "content": "IEC counter blocks track discrete physical events, such as parts produced on a conveyor or pump run cycles. TIA Portal implements Count Up (CTU), Count Down (CTD), and Bidirectional (CTUD) blocks.",
        "keyPoints": [
          "CTU (Count Up): Increments Current Value (CV) by 1 upon each rising edge at CU; output Q turns TRUE when CV ≥ PV",
          "CTD (Count Down): Decrements CV by 1 upon each rising edge at CD; output Q turns TRUE when CV ≤ 0",
          "CTUD: Combines both up and down count inputs into a single block with individual Q outputs",
          "Reset (R): Instantly resets the internal count register CV to 0 on CTU blocks",
          "Preset Value (PV): The calibrated target count threshold defining when output Q energizes"
        ]
      },
      {
        "title": "4.10 In-Line Mathematical and Comparison Instructions in LAD",
        "content": "Ladder Diagram allows embedding math and comparison blocks directly into graphical rungs. This combines boolean discrete conditions with quantitative numerical decision logic.",
        "keyPoints": [
          "Comparison Blocks: ==, <>, >, <, >=, <= evaluate two operands and pass power flow when TRUE",
          "Math Blocks: ADD (+), SUB (−), MUL (×), DIV (÷) execute arithmetic inline",
          "Enable Output (ENO): Propagates power flow to downstream rung elements if arithmetic completes without overflow",
          "Multi-Type Flexibility: Operates on Int, DInt, Real, and Time data types",
          "Enhances LAD capability, allowing ladder programs to perform calculation tasks without forcing a shift to SCL"
        ]
      },
      {
        "title": "4.11 Data Transfer and Conversion: MOVE, CONV, ROUND, and TRUNC",
        "content": "The MOVE instruction transfers data between registers and variables. CONV converts between data types, ROUND rounds floating-point reals to the nearest integer, and TRUNC truncates fractional digits.",
        "keyPoints": [
          "MOVE: Copies data from input IN directly to output OUT",
          "Commonly used to load recipe parameters and initialize operational setpoints",
          "CONV: Executes safe data type conversions (e.g. converting 16-bit INT to 32-bit REAL)",
          "ROUND: Rounds floating-point REAL numbers to the nearest whole integer",
          "TRUNC: Discards fractional digits entirely, converting REAL to integer without rounding"
        ]
      },
      {
        "title": "4.12 Practical Application: Intersection Traffic Light Controller",
        "content": "Synthesizes timers, comparison blocks, Set/Reset instructions, and discrete ladder logic to design an automated 4-way intersection traffic signal sequence with pedestrian crossing intervals.",
        "keyPoints": [
          "Construct timing diagrams mapping Green, Yellow, and Red phases across North-South and East-West corridors",
          "Deploy a master TON timer to establish the total repeatable cycle duration (e.g. 60 seconds)",
          "Use comparison blocks (>=, <=) evaluating current timer elapsed time (ET) to energize phase outputs",
          "Integrate Master Start/Stop commands using RS latch flip-flops",
          "Implement flashing yellow emergency mode via a system clock memory byte"
        ]
      },
      {
        "title": "5.1 TON Timer — On-Delay Timing",
        "content": "TON (Timer On-Delay): Output Q turns ON after a preset time delay (PT) has elapsed following input IN becoming TRUE. If input IN drops to FALSE before PT expires, the timer resets elapsed time to zero.",
        "keyPoints": [
          "IN: Trigger input signal (must remain continuously TRUE throughout the timing interval)",
          "PT: Preset Time interval specified in TIME format (e.g. T#5s, T#500ms)",
          "Q: Output contact; transitions to TRUE when Elapsed Time (ET) ≥ Preset Time (PT)",
          "ET: Elapsed Time accumulator tracking milliseconds elapsed since IN turned TRUE",
          "Early Drop Reset: If IN goes FALSE prior to reaching PT, ET resets to 0ms and Q remains FALSE",
          "Applications: Motor start delays, lube pressure establishment timers, sensor debounce delays"
        ],
        "note": "S7-1200 timers are IEC-compliant Function Blocks (FBs) requiring dedicated Instance Data Blocks. Every timer instance must have a unique Instance DB."
      },
      {
        "title": "5.2 TOF Timer — Off-Delay Timing",
        "content": "TOF (Timer Off-Delay): Output Q turns ON immediately when input IN becomes TRUE. When input IN drops to FALSE, output Q remains ON for the preset time duration (PT) before de-energizing.",
        "keyPoints": [
          "Output Q transitions to TRUE immediately when IN becomes TRUE",
          "Timing countdown commences precisely when input IN drops from TRUE to FALSE",
          "Output Q de-energizes to FALSE once elapsed time ET reaches PT",
          "Retrigger: If IN goes TRUE again during the timing countdown, the timer resets and Q remains TRUE",
          "Applications: Cabinet cooling fan post-run cooldown, delayed lighting shutdown, conveyor clearout intervals"
        ]
      },
      {
        "title": "5.3 TP Timer — Pulse Generation",
        "content": "TP (Timer Pulse): When input IN transitions from FALSE to TRUE, output Q turns ON for exactly the preset duration PT, regardless of whether input IN remains held or drops immediately.",
        "keyPoints": [
          "Output Q energizes for exactly duration PT upon rising edge of input IN",
          "Input variations during the active pulse are completely ignored by the block",
          "Output Q de-energizes once PT expires, requiring a fresh rising edge at IN to trigger again",
          "Generates deterministic pulse widths regardless of operator button-press duration",
          "Applications: Pneumatic reject cylinders, lubrication dosing squirts, horn audible sirens"
        ]
      },
      {
        "title": "5.4 Counter Architecture and Counting Logic",
        "content": "Counter blocks increment or decrement on rising-edge signal transitions. CTU counts up, CTD counts down, and CTUD handles bidirectional tracking.",
        "keyPoints": [
          "CTU: CU (Count Up input), R (Reset), PV (Preset Value), Q (Output active when CV ≥ PV), CV (Current Count)",
          "CTD: CD (Count Down input), LD (Load Preset), PV, Q (Output active when CV ≤ 0), CV",
          "CTUD: Combines both CU and CD inputs with separate QU and QD outputs",
          "Count Register (CV): 16-bit signed integer INT (−32768 to +32767)",
          "Applications: Conveyor item counting, batch packaging control, maintenance duty tracking"
        ]
      },
      {
        "title": "5.5 Edge Detection Instructions: R_TRIG and F_TRIG",
        "content": "R_TRIG generates a single-scan pulse on a rising edge (0→1). F_TRIG generates a single-scan pulse on a falling edge (1→0). Essential for conditioning inputs to counters and accumulators.",
        "keyPoints": [
          "R_TRIG: Output Q conducts for exactly one scan upon rising edge at input CLK",
          "F_TRIG: Output Q conducts for exactly one scan upon falling edge at input CLK",
          "Placed before counter blocks to guarantee exactly one count increment per button press",
          "Applications: Optical part sensor edge detection, recipe step advance buttons"
        ]
      },
      {
        "title": "5.6 Sequential Step Control Using Timers",
        "content": "Deploying cascaded timers to engineer predictable multi-stage sequences: Green (30s) → Yellow (3s) → Red (25s) → Loop. Utilizing bit markers to cleanly manage step transitions.",
        "keyPoints": [
          "Step 1 (Green Phase): TON_1 timing PT=30s; when Q=1, transitions sequence to Step 2",
          "Step 2 (Yellow Phase): TON_2 timing PT=3s; when Q=1, transitions sequence to Step 3",
          "Step 3 (Red Phase): TON_3 timing PT=25s; when Q=1, loops sequence back to Step 1",
          "Memory Bit Markers (%M): Isolate and indicate active step states",
          "Timer Reset: Automatically clears when upstream precondition drops to FALSE"
        ]
      }
    ],
    "review": [
      "Draw the Ladder Diagram for a classic motor Start-Stop seal-in control circuit.",
      "Explain the operational difference between a standard Output Coil and a Set (S) Latch instruction.",
      "What is the purpose of an interlocking circuit? Draw an interlock example for a reversing motor starter.",
      "Why should industrial systems implement both software and hardware interlocking on reversing contactors?",
      "If %I0.0 is addressed by an NC contact in LAD, does that contact conduct power when the physical field input receives 24VDC?",
      "Under what operational conditions should an engineer select an RS Flip-Flop over an SR Flip-Flop?",
      "What is the functional purpose of a P_TRIG instruction, and why does it require an associated edge memory bit?",
      "Explain how comparison instructions (CMP) are combined with timer elapsed time (ET) to control multi-phase lighting.",
      "Sketch timing diagrams for TON, TOF, and TP blocks responding to an identical 3-second input pulse with PT = 5s.",
      "Why is it necessary to insert an R_TRIG one-shot before a CTU block when counting manual pushbutton presses?",
      "Write a ladder rung to generate a 1Hz flasher (0.5s ON, 0.5s OFF) using TON timer blocks.",
      "A CTU counter has accumulated CV = 5 with PV = 10. If input Reset transitions to TRUE, what is the new value of CV?",
      "Design a two-conveyor sequencing circuit where Conveyor 2 automatically starts 5 seconds after Conveyor 1 starts."
    ]
  },

  '04-numeric-operations': {
    "overview": "Numerical data structures and arithmetic manipulation form the core computational framework of modern PLCs. This lesson details fundamental IEC 61131-3 data types (BOOL, BYTE, INT, DINT, REAL, DWORD, STRING, TIME), the MOVE instruction, fixed-point and floating-point mathematics, magnitude comparisons, type conversions, and overflow handling on the S7-1200.",
    "objectives": [
      "Differentiate between IEC data types in TIA Portal (BOOL, BYTE, WORD, INT, DINT, REAL)",
      "Deploy the MOVE instruction to transfer numerical values between memory registers",
      "Execute arithmetic operations: addition, subtraction, multiplication, division, and modulo (MOD)",
      "Utilize magnitude comparison blocks to execute conditional logic decisions",
      "Perform data type conversions and output clamping using CONVERT and LIMIT blocks"
    ],
    "sections": [
      {
        "title": "6.1 Fundamental Data Types and Memory Sizing",
        "content": "TIA Portal fully implements standard data types conforming to IEC 61131-3. Selecting appropriate data types optimizes memory consumption and prevents catastrophic numerical overflow errors.",
        "keyPoints": [
          "BOOL (1 bit): TRUE or FALSE — used for discrete binary states",
          "BYTE (8 bits): Unsigned integer 0 to 255 — used for character codes and status masks",
          "WORD (16 bits): Unsigned integer 0 to 65535 — used for raw registers and bit fields",
          "DWORD (32 bits): Unsigned integer 0 to 4,294,967,295 — used for high-speed counter values and timestamps",
          "INT (16 bits signed): −32,768 to +32,767 — standard signed integer",
          "DINT (32 bits signed): −2,147,483,648 to +2,147,483,647 — double-length integer",
          "REAL (32 bits IEEE 754): Single-precision floating-point number — used for analog scaling and PID mathematics",
          "TIME (32 bits signed ms): T#0ms to T#24d20h31m23s647ms — standardized timer duration format",
          "STRING: ASCII character array supporting up to 254 characters"
        ]
      },
      {
        "title": "6.2 The MOVE and Memory Block Transfer Instructions",
        "content": "The MOVE instruction transfers data from input IN to destination OUT. Operands must share identical or compatible data types. Because MOVE executes every scan, conditional gating is essential when managing setpoint updates.",
        "keyPoints": [
          "MOVE: OUT := IN — copies value into target memory register",
          "MOVE_BLK: Copies a contiguous block of array elements from source to destination",
          "UMOVE_BLK: Uninterruptible memory block transfer protected against process interrupts",
          "Automatic widening: Moving an INT into a DINT is performed automatically without data loss",
          "FILL_BLK: Initializes an entire array by populating all elements with an identical initial value"
        ]
      },
      {
        "title": "6.3 Arithmetic Operations: Addition, Subtraction, Multiplication, Division, and Modulo",
        "content": "The S7-1200 executes arithmetic operations across INT, DINT, and REAL operands. Engineers must account for integer truncation and register overflow when multiplying large values.",
        "keyPoints": [
          "ADD: Addition — OUT := IN1 + IN2",
          "SUB: Subtraction — OUT := IN1 − IN2",
          "MUL: Multiplication — OUT := IN1 × IN2",
          "DIV: Division — OUT := IN1 ÷ IN2 (integer division truncates fractional remainders)",
          "MOD: Modulo — OUT := IN1 MOD IN2 (extracts integer division remainder)",
          "Overflow Mitigation: Convert INT operands to DINT or REAL before multiplication to prevent sign inversion",
          "Floating-Point Precision: REAL calculations provide 7 significant decimal digits of accuracy"
        ],
        "note": "When dividing integer operands (INT ÷ INT), the result is strictly an integer truncated toward zero (e.g. 7 DIV 2 = 3, not 3.5). Convert operands to REAL if fractional precision is required."
      },
      {
        "title": "6.4 Magnitude Comparison and Conditional Branches",
        "content": "Comparison instructions evaluate numerical relationships between two values, outputting boolean TRUE/FALSE power flow to downstream ladder contacts.",
        "keyPoints": [
          "CMP ==: Equal to",
          "CMP <>: Not equal to",
          "CMP >: Greater than",
          "CMP <: Less than",
          "CMP >=: Greater than or equal to",
          "CMP <=: Less than or equal to",
          "Application Example: If Measured_Temperature > 80.0°C, energize high-temperature warning coil"
        ]
      },
      {
        "title": "6.5 Type Conversion and Clamping with CONVERT and LIMIT",
        "content": "CONVERT handles transformations between numeric formats. LIMIT bounds values between calibrated minimum and maximum thresholds, preventing downstream actuator saturation.",
        "keyPoints": [
          "INT_TO_REAL: Transforms 16-bit integer values to floating-point REAL format for decimal arithmetic",
          "REAL_TO_INT: Converts REAL values to integers using standard rounding rules",
          "DINT_TO_INT: Narrowing conversion; will truncate high-order bits if value exceeds 32,767",
          "LIMIT: OUT := LIMIT(MIN, IN, MAX) — clamps values strictly between MIN and MAX",
          "ABS: Absolute value function — strips sign to return non-negative magnitude",
          "MIN / MAX: Extracts lowest or highest value between input operands"
        ]
      },
      {
        "title": "6.6 Bit String Manipulation: DWORD, LWORD, and Bit Masking",
        "content": "DWORD (32-bit) and LWORD (64-bit) represent unformatted bit patterns utilized for bitwise masking, machine status aggregation, and raw communication frame parsing.",
        "keyPoints": [
          "Bitwise Boolean Operations: AND, OR, XOR, NOT operations executed across parallel bit registers",
          "Bit Masking: Use bitwise AND to isolate or clear specific bits; use OR to force specific flag bits TRUE",
          "Ideal for packaging complex multi-station error codes into a single telemetry word",
          "Bit Slicing Syntax: Access individual bits directly via tag name syntax (e.g. StatusWord.%X0)",
          "Distinction: Distinct from signed integers (DINT/LINT); bit strings carry no arithmetic sign bit"
        ]
      },
      {
        "title": "6.7 Text String Processing: STRING Declarations and String Functions",
        "content": "The STRING data type stores ASCII text strings. A declared STRING occupies memory equal to its defined character capacity plus a 2-byte header encoding maximum and current length.",
        "keyPoints": [
          "Memory Header: A STRING[20] variable occupies 22 bytes in memory (2 header bytes + 20 data bytes)",
          "CONCAT: Concatenates two string variables into a unified string output",
          "String Comparison: Evaluates equality (==) and lexicographical ordering (<, >) based on ASCII codes",
          "Substring Extraction: LEFT, RIGHT, and MID instructions extract designated character segments",
          "Applications: Displaying dynamic operator messages on HMI panels, barcode scanner parsing, label printing"
        ]
      },
      {
        "title": "6.8 Real-Time Date and Time Formats: TIME, DATE, TOD, and DTL",
        "content": "The S7-1200 implements standardized IEC time and date structures. TIME defines durations; DATE, TOD, and DTL manage real-time clock (RTC) synchronization and shift scheduling.",
        "keyPoints": [
          "TIME: Duration format (e.g. T#14d_1h_5m), internally stored as a 32-bit signed integer in milliseconds",
          "DATE: Calendar date format (e.g. D#2026-10-21)",
          "TOD (Time_Of_Day): Clock time within a 24-hour cycle (e.g. TOD#23:55:00.000)",
          "Duration Arithmetic: TIME values support direct addition and subtraction (e.g. T#2s + T#3s = T#5s)",
          "DTL Structure: 12-byte comprehensive date and time container resolving down to nanosecond precision"
        ]
      },
      {
        "title": "6.9 Advanced Data Conversions: CONV and BCD Decoding",
        "content": "Beyond standard Int/Real conversions, legacy machines frequently utilize Binary-Coded Decimal (BCD) thumbwheel switches and 7-segment digital displays.",
        "keyPoints": [
          "The universal CONV instruction adapts across diverse numeric formats based on selected types",
          "BCD Encoding: Represents each decimal digit (0–9) using a dedicated 4-bit nibble",
          "BCD_TO_INT: Decodes thumbwheel switch inputs into standard integers for PLC math",
          "INT_TO_BCD: Encodes internal integer registers into BCD format for hardware display driving",
          "Data Truncation Alert: Always verify destination register capacity when performing narrowing conversions"
        ]
      },
      {
        "title": "6.10 Two's Complement Representation and Arithmetic Overflow",
        "content": "The S7-1200 represents signed integers (INT, DINT) using two's complement binary notation. The Most Significant Bit (MSB) serves as the sign flag (0 = positive, 1 = negative).",
        "keyPoints": [
          "16-Bit INT Range: −32,768 to +32,767",
          "Two's Complement Formulation: Invert all bits and add 1 to the result",
          "Arithmetic Overflow: Adding 1 to +32,767 results in −32,768, creating severe operational faults if unmanaged",
          "Overflow Detection: Monitor the instruction ENO output or CPU status flags (OV, OS) to trap overflow exceptions",
          "Safe Practice: Utilize 32-bit DINT or REAL variables for accumulators and totalizers prone to high magnitudes"
        ]
      },
      {
        "title": "6.11 Practical Laboratory: Flow Totalization and HMI Numeric Display",
        "content": "Integrates numerical data operations to calculate instantaneous liquid flow rates, totalize cumulative volumetric consumption, and format clean rounded values for HMI visualization.",
        "keyPoints": [
          "Scale raw analog input counts (INT) into calibrated flow velocity in m³/h (REAL)",
          "Totalize cumulative volume by integrating flow samples over discrete timer intervals",
          "Deploy comparison blocks (CMP) to trigger high-consumption alarm thresholds",
          "Apply the ROUND instruction to convert floating-point totals into clean integers for HMI displays",
          "Format dynamic text alarm strings using STRING concatenation for operator dispatch"
        ]
      }
    ],
    "review": [
      "What are the fundamental differences between REAL and INT data types, and when is REAL mandatory?",
      "Why does integer division 7 DIV 2 yield 3 instead of 3.5 in PLC programming?",
      "Write a ladder rung: If measured oven temperature (MW10, INT) > 80°C, energize output %Q0.0.",
      "Evaluate: LIMIT(0, MW20, 100) when MW20 holds a value of 150. What is the resulting output?",
      "To compute rectangular surface area (Length × Width) yielding decimal precision, what conversion must be executed prior to multiplication?",
      "Describe an industrial application where bitwise AND masking on a DWORD register is technically necessary.",
      "How many bytes of physical PLC memory are occupied by a declared STRING[20] variable?",
      "Why does an integer register overflow when incrementing past +32,767, suddenly becoming −32,768?"
    ]
  },

  '05-analog-signals': {
    "overview": "Industrial analog signals represent continuous physical variables such as temperature, pressure, fluid flow, and tank level. The S7-1200 processes analog inputs through the NORM_X and SCALE_X instructions, converting 12-bit to 16-bit unipolar digitized raw counts (0–27648) into real-world calibrated engineering units.",
    "objectives": [
      "Explain industrial 4–20mA current loop and 0–10V voltage signal standards",
      "Configure analog input (AI) and output (AO) modules and correctly wire 2-wire, 3-wire, and 4-wire transmitters",
      "Deploy NORM_X and SCALE_X instructions to scale raw counts into engineering units",
      "Implement High/Low alarm limits with hysteresis deadbands on analog variables",
      "Filter raw sensor noise utilizing moving average digital filter algorithms"
    ],
    "sections": [
      {
        "title": "9.1 Analog Signals in Industrial Automation",
        "content": "The two prevailing industrial analog signal standards are 4–20mA (current loop: noise-immune, long transmission distances, broken-wire detection) and 0–10V (voltage: straightforward bench testing, vulnerable to line resistance drops). S7-1200 analog modules convert physical signals into standardized raw integer counts ranging from 0 to 27648.",
        "keyPoints": [
          "Current Loop Standard: 4mA corresponds to 0% span; 20mA corresponds to 100% span",
          "Voltage Standard: 0V corresponds to 0% span; 10V corresponds to 100% span",
          "Superiority of 4–20mA: Live zero allows immediate detection of severed field wiring (<3.6mA signifies wire break)",
          "Standard Raw Count: 0 to 27648 corresponds to 0% to 100% nominal measuring span",
          "Full Scale: 27648 counts = 20mA or 10V input",
          "Underflow Region (<0 counts down to −32768): Indicates open circuit, reverse polarity, or sensor failure"
        ]
      },
      {
        "title": "9.2 Analog Input Module Configuration and Transmitter Wiring",
        "content": "The SM 1231 Analog Input module supports 4 or 8 channels. Parameterizing the input type (Current or Voltage) and range in TIA Portal must match the physical field transmitter topology.",
        "keyPoints": [
          "Configuration in TIA Portal: Device Configuration → Signal Module → Channel Properties → Measurement Type",
          "Select Range: ±10V, 0–10V, ±5V, 0–20mA, 4–20mA",
          "2-Wire Transmitter (Loop-Powered): Sensor draws operating power directly from the 4–20mA current loop",
          "3-Wire Transmitter: Shares common power ground, with separate DC supply and active signal lines",
          "4-Wire Transmitter: External line power supply; current output loop is completely isolated",
          "RTD Interfacing: Specialized SM 1231 RTD modules interface directly with PT100/PT1000 sensors without external transmitters"
        ]
      },
      {
        "title": "9.3 NORM_X and SCALE_X — Two-Step Engineering Unit Scaling",
        "content": "NORM_X normalizes raw integer counts (0–27648) into an unscaled floating-point ratio between 0.0 and 1.0. SCALE_X scales that normalized ratio into physical engineering units (°C, bar, m³/h).",
        "keyPoints": [
          "NORM_X: Normalized_Value := (Raw_Input − MIN) / (MAX − MIN) → yields REAL 0.0 to 1.0",
          "SCALE_X: Engineering_Value := MIN + (Normalized_Value × (MAX − MIN)) → yields calibrated real value",
          "Example: PT100 RTD (−50°C to +150°C): NORM_X(0, %AIW64, 27648) → SCALE_X(−50.0, norm, 150.0)",
          "Example: 4–20mA Pressure (0 to 10 bar): NORM_X(5530, %AIW64, 27648) → SCALE_X(0.0, norm, 10.0)",
          "Offset Calibration: 5530 counts corresponds to 4mA (20% of 27648)",
          "Inline Optimization: Scaling formulas can be implemented directly within a single line of SCL code"
        ],
        "note": "When scaling unconditioned 4–20mA signals on a unipolar 0–20mA module, set the MIN parameter of NORM_X to 5530 (4mA), NOT zero."
      },
      {
        "title": "9.4 Digital Noise Filtering and Signal Conditioning",
        "content": "Analog signals in plant environments are susceptible to electromagnetic interference (EMI) from VFDs and large contactors. Moving average digital filtering smooths sensor noise to stabilize control loops.",
        "keyPoints": [
          "Moving Average Algorithm: Computes the arithmetic mean across the N most recent periodic samples",
          "Filter Trade-Off: Higher sample sizes (N) deliver smoother signals but introduce phase lag into fast control loops",
          "Implementation: SCL array buffer shifting executed cyclically within an interrupt OB",
          "Deadband Filtering: Updates process variables only when signal changes exceed a calibrated threshold",
          "High Alarm (Hi): Activates warning when PV exceeds high threshold (e.g. Temperature > 90.0°C)",
          "Alarm Hysteresis: Alarm trips at 90.0°C and resets at 86.0°C, preventing rapid alarm chattering around the setpoint"
        ]
      },
      {
        "title": "9.5 Analog Output (AO) Modules and Actuator Driving",
        "content": "The SM 1232 Analog Output module generates ±10V, 0–20mA, or 4–20mA signals to command variable frequency drives (VFDs), proportional valves, and SCR power controllers.",
        "keyPoints": [
          "Writing to AO: Write integer counts (0–27648) to output word %AQW64",
          "Reverse Scaling: Use reverse SCALE_X and NORM_X to convert engineering values into 0–27648 counts",
          "VFD Frequency Reference: 0Hz corresponds to 4mA (5530 counts); 50Hz corresponds to 20mA (27648 counts)",
          "Control Valve Positioning: 0% stroke = 4mA, 100% stroke = 20mA",
          "PID Loop Integration: Output of PID_Compact (0.0–100.0%) scaled directly to %AQW channel register"
        ]
      },
      {
        "title": "9.6 Signal Modules SM 1231 and SM 1232 Technical Specifications",
        "content": "SM 1231 (AI) and SM 1232 (AO) provide high-resolution analog interfacing. Critical engineering parameters include ADC resolution, conversion speed, and optical isolation ratings.",
        "keyPoints": [
          "SM 1231: Available in 4-channel or 8-channel differential input configurations (Voltage or Current)",
          "SM 1232: Available in 2-channel or 4-channel analog output configurations",
          "Resolution: 12-bit to 16-bit analog-to-digital conversion yielding high measurement granularity",
          "Hardware Diagnostics: Automatic detection of wire breaks, channel short-circuits, and input overrange",
          "Dedicated Power Rails: Requires clean 24VDC field power distributed to module L+/M terminals"
        ]
      },
      {
        "title": "9.7 Hardware Filtering and Moving Average Smoothing",
        "content": "Plant floor noise suppression combines hardware RC integration on the module with digital filtering in software to deliver stable, repeatable measurements.",
        "keyPoints": [
          "Hardware Integration Filter: Configurable in TIA Portal with integration times (None, Weak, Medium, Strong)",
          "Software Averaging: Calculates rolling mean over N successive scan samples",
          "Noise Immunity: Prevents false trips on high-limit safety interlocks",
          "Trend Smoothing: Eliminates high-frequency noise spikes on operator SCADA trend screens"
        ]
      },
      {
        "title": "9.8 Resistance Temperature Detectors: PT100 and PT1000 RTD Interfacing",
        "content": "PT100 and PT1000 RTD sensors measure temperature via positive temperature coefficient platinum resistance. They represent the industry standard for precision thermal monitoring.",
        "keyPoints": [
          "Dedicated RTD Module: Automatically linearizes resistance, outputting temperature × 10 (e.g. 253 counts = 25.3°C)",
          "Direct Temperature Reading: Bypasses manual NORM_X / SCALE_X arithmetic",
          "3-Wire Wiring Topology: Compensates for lead wire resistance using a third sensing conductor",
          "PT100 Specification: Exactly 100.0 Ω resistance at 0.0°C (0.385 Ω/°C sensitivity)",
          "PT1000 Specification: 1000.0 Ω at 0.0°C; offers superior lead-length noise immunity over long cable runs"
        ]
      },
      {
        "title": "9.9 Technical Comparison: 4–20mA Current Loops versus 0–10V Voltage Signals",
        "content": "Understanding physical signal characteristics enables automation engineers to select optimal instrumentation for noisy, sprawling plant installations.",
        "keyPoints": [
          "0–10V Vulnerability: Voltage signals suffer IR drop across long cable runs; susceptible to induced EMI",
          "4–20mA Immunity: Current loop delivers identical current regardless of lead resistance; highly immune to EMI",
          "Failsafe Broken-Wire Detection: A severed cable drops current to 0mA, immediately triggering open-circuit alarms",
          "Loop-Powered Convenience: Allows 2-wire field transmitters to be powered directly from the signaling loop",
          "Industrial Recommendation: Standardize on 4–20mA for all field wiring exceeding 10 meters in distance"
        ]
      },
      {
        "title": "9.10 Analog Output Control of Variable Frequency Drives (VFDs)",
        "content": "A classic automation control loop: The PLC outputs an analog speed setpoint to a VFD via 0–10V or 4–20mA, driving the motor at the proportional operational frequency.",
        "keyPoints": [
          "VFD Analog Input: Configured to interpret 4–20mA as 0.0Hz to 50.0Hz (or 60.0Hz)",
          "PLC Scaling Logic: Reverse SCALE_X converts frequency setpoints into 5530–27648 counts",
          "Drive Macro Configuration: VFD parameter settings must be calibrated to match the analog terminal scaling",
          "Shield Termination: Analog cable shields must be grounded at the PLC cabinet end only to prevent ground loops",
          "Closed-Loop Velocity Regulation: Combines analog speed output with PID feedback to maintain constant conveyor speed"
        ]
      },
      {
        "title": "9.11 Practical Laboratory: Closed-Loop Thermal Control via PID and Analog Outputs",
        "content": "Synthesizes analog signal processing into a complete thermal control system: reading temperatures via RTD, computing PID corrective commands, and modulating heater power.",
        "keyPoints": [
          "Analog Input: Real-time temperature measurement feedback from PT100 RTD sensor",
          "Operator Setpoint: User-adjustable target setpoint entered via HMI touchscreen",
          "PID Controller: PID_Compact evaluates error e(t) and outputs manipulated variable (0–100%)",
          "Power Actuation: Output drives a solid-state relay (SSR) via PWM or analog SCR controller",
          "Commissioning: Execute pre-tuning and fine-tuning to achieve rapid settling without thermal overshoot"
        ]
      }
    ],
    "review": [
      "Why is 4–20mA preferred over 0–10V for long-distance analog signal transmission in industrial plants?",
      "A PT100 RTD sensor measures −50°C to +150°C. If raw input %AIW64 reads 13824 counts, calculate the actual physical temperature in °C.",
      "Write the NORM_X and SCALE_X ladder parameters to scale a 4–20mA pressure transmitter measuring 0 to 10 bar.",
      "If an 8-sample moving average filter is applied, how many sample cycles elapse before a sudden step change is fully reflected in the filtered output?",
      "An analog output controls a 0–50Hz VFD via 4–20mA. To command a motor frequency of 35Hz, what raw integer count must be written to %AQW64?",
      "When reading a PT100 sensor through a dedicated Siemens SM 1231 RTD module, what raw integer format does the module return?",
      "Explain how a 4–20mA current loop detects a severed field wire compared to a 0–10V voltage circuit.",
      "Describe how alarm hysteresis (deadband) prevents relay chattering on analog temperature monitoring circuits."
    ]
  },

  '08-advanced-instructions': {
    "overview": "Advanced PLC software engineering focuses on modular program architecture: Functions (FC), Function Blocks (FB), Instance Data Blocks, Array indexing, shift/rotate registers, and Structured Control Language (SCL). The goal is architecting standardized, maintainable, and reusable automation code.",
    "objectives": [
      "Create and invoke Functions (FC) and Function Blocks (FB) from Main OB1",
      "Understand the architecture of Instance DBs and contrast them with Global DBs",
      "Declare, manipulate, and iterate through single and multi-dimensional Arrays",
      "Implement bitwise shift (SHL/SHR) and rotate (ROL/ROR) instructions for sequential tracking",
      "Develop structured algorithms in SCL using IF/THEN/ELSE, FOR loops, and CASE statements"
    ],
    "sections": [
      {
        "title": "7.1 Functions (FC) — Stateless Logic Subroutines",
        "content": "A Function (FC) is a stateless logic routine that does not possess dedicated internal static memory. Upon block completion, all temporary (TEMP) local stack variables are de-allocated. FCs are ideal for mathematical calculations, unit conversions, and stateless logical transformations.",
        "keyPoints": [
          "No Static Memory: Interface contains Input, Output, InOut, Temp, and Return declarations",
          "Invocation: Called from OB, FB, or peer FC blocks with parameter passing",
          "Return Value: Can return a calculation result directly through its block return identifier",
          "Reusability: Write once, instantiate repeatedly across different process areas",
          "Application Examples: Analog scaling routines, temperature conversion formulas, alarm summary checks"
        ]
      },
      {
        "title": "7.2 Function Blocks (FB) — Stateful Subroutines with Instance Memory",
        "content": "A Function Block (FB) differs fundamentally from an FC by incorporating Static (STAT) memory that persists across successive scan cycles. Every invocation of an FB requires an associated Instance Data Block (Instance DB) to store its unique state.",
        "keyPoints": [
          "Static Memory (STAT): Variables retain their values indefinitely across scan cycles",
          "Instance Data Block: Dedicated DB automatically generated upon FB invocation to store instance state",
          "Object-Oriented Philosophy: Encapsulates recurring equipment (e.g. standard FB for motor starters, valves)",
          "Multi-Instance Architecture: An enclosing parent FB can embed child FBs within a single shared Instance DB",
          "Application Example: FB Motor_Control maintaining internal tags: Running (BOOL), TotalRunHours (REAL)"
        ],
        "note": "Never write directly to the internal static tags of an Instance DB from outside its governing FB. Pass variables cleanly through the block interface parameters."
      },
      {
        "title": "7.3 Arrays — Structured Data Collections",
        "content": "An Array is an indexed collection of identical data types accessed via numerical subscript indexes. Arrays are essential for batch tracking, multi-channel temperature monitoring, recipe storage, and shift data history.",
        "keyPoints": [
          "Declaration Syntax: Array[0..9] of INT defines a 10-element array of integers",
          "Indexing Syntax: MyArray[3] references the fourth element (zero-based indexing)",
          "Dynamic Indexing: Use variable integer tags as indexes within iterative loops",
          "SCL Integration: FOR loops iterate cleanly across array bounds (e.g. FOR i := 0 TO 9 DO)",
          "Multidimensional Arrays: Array[0..2, 0..3] of REAL models 2D coordinate matrices",
          "Applications: Shift production history, recipe setpoint tables, multi-zone thermal logging"
        ]
      },
      {
        "title": "7.4 Bit Shift (SHL/SHR) and Rotate (ROL/ROR) Instructions",
        "content": "Shift and rotate instructions shift bit patterns within WORD or DWORD registers. They are widely utilized for item position tracking on conveyor lines, rotating beacon sequences, and binary protocol encoding.",
        "keyPoints": [
          "SHL (Shift Left): Shifts bits left by N positions; vacant lower bits are filled with zeros",
          "SHR (Shift Right): Shifts bits right by N positions; vacant upper bits are filled with zeros",
          "ROL (Rotate Left): Shifts bits left; overflowing high-order bits wrap around into the lowest bit positions",
          "ROR (Rotate Right): Shifts bits right; overflowing low-order bits wrap around into the highest bit positions",
          "Conveyor Tracking: Shifts a binary \"part present\" flag along a register synchronously with conveyor pulse clocks",
          "Bit Manipulation: Combined with AND/OR masks to manipulate packed status words"
        ]
      },
      {
        "title": "7.5 Structured Control Language (SCL / IEC Structured Text)",
        "content": "SCL is a high-level, textual programming language based on Pascal and C. It allows complex mathematical algorithms, data table manipulation, and sorting routines to be expressed far more concisely than Ladder Diagram.",
        "keyPoints": [
          "Conditional Branching: IF ... THEN ... ELSIF ... ELSE ... END_IF;",
          "State Machine Selection: CASE variable OF 1: ...; 2: ...; ELSE ...; END_CASE;",
          "Iterative Loops: FOR i := 0 TO 9 DO ... END_FOR;",
          "Conditional Loops: WHILE condition DO ... END_WHILE;",
          "Seamless Coexistence: LAD and SCL blocks operate harmoniously within the identical project",
          "Optimal Domain: Complex mathematics, array sorting, string parsing, recipe management"
        ],
        "note": "SCL does not replace LAD; they complement each other. LAD remains optimal for discrete digital safety interlocks and field troubleshooting; SCL excels at data algorithms and mathematical computing."
      },
      {
        "title": "7.6 Block Parameter Passing: IN, OUT, IN_OUT, and Local TEMP Variables",
        "content": "Rigorous parameter management decouples algorithmic logic from absolute addresses, maximizing code modularity and preventing unintended cross-talk between program routines.",
        "keyPoints": [
          "IN (Input): Read-only data passed into the block; original external tag remains unmodified",
          "OUT (Output): Write-only result calculated by the block; updates external tag upon block termination",
          "IN_OUT (In/Out): Read/write parameter passed by reference; allows in-place variable modification",
          "TEMP (Temporary): Local scratchpad memory allocated on the CPU stack; de-allocated upon block exit",
          "Initialization Rule: Always initialize TEMP variables prior to reading to avoid uninitialized garbage values"
        ]
      },
      {
        "title": "7.7 Multi-Instance Function Block Architecture",
        "content": "Multi-instance architecture allows a parent Function Block to embed multiple child Function Blocks, consolidating all static variables into a single unified Instance Data Block.",
        "keyPoints": [
          "Drastically reduces Data Block proliferation across large project trees",
          "Encapsulates complex machinery subsystems into clean, self-contained composite blocks",
          "Simplifies library packaging and version-controlled distribution",
          "Enables dot-notation addressing for nested internal structures (e.g. MasterFB.Pump1.Running)",
          "Ideal for standardized machine templates featuring repetitive multi-head actuator stations"
        ]
      },
      {
        "title": "7.8 Global Data Blocks versus Instance Data Blocks",
        "content": "Data Blocks (DBs) provide structured data storage in PLC memory. Global DBs are universally accessible across all blocks; Instance DBs are strictly bound to a single parent FB.",
        "keyPoints": [
          "Global DB: Universally read and written by any Organization Block, FC, or FB across the project",
          "Use Global DBs for plant-wide setpoints, recipe tables, SCADA tags, and system operating modes",
          "Instance DB: Bound exclusively to an associated Function Block to preserve internal private state",
          "Encapsulation Rule: Restrict external read/write access to Instance DBs to preserve data integrity",
          "Both DB types support Retentive memory configuration to survive power interruptions"
        ]
      },
      {
        "title": "7.9 Retentive Variables and Non-Volatile Memory Preservation",
        "content": "Retentive variable configuration guarantees that critical process setpoints, batch recipe tags, and machine calibration parameters persist intact across CPU power cycles and restarts.",
        "keyPoints": [
          "Utilizes hardware non-volatile NVRAM backed by onboard supercapacitors",
          "Essential for cumulative runtime counters, batch totalizers, and machine home positions",
          "Configured easily by checking the \"Retain\" column checkbox in Data Block interface editors",
          "Retentive capacity is hardware-bounded; allocate retentive memory deliberately for critical tags only",
          "Instance DBs inherit retentive properties from the parent FB variable declarations"
        ]
      },
      {
        "title": "7.10 Project and Global Engineering Libraries",
        "content": "TIA Portal libraries package tested Function Blocks, User Data Types (UDTs), and HMI Faceplates into reusable modules, dramatically accelerating standardized engineering.",
        "keyPoints": [
          "Project Library: Manages reusable blocks local to the current active project",
          "Global Library: Independent, standalone library file shared across different enterprise projects",
          "Version Control: Enforces formal semantic version tracking for library blocks",
          "Unified Packaging: Packages PLC code, UDT structures, and WinCC HMI Faceplates together",
          "Accelerates commissioning by allowing pre-tested, standardized equipment blocks to be dropped onto new rungs"
        ]
      },
      {
        "title": "7.11 Structured Programming and Modular Hierarchy",
        "content": "Structured programming decomposes complex automated machinery into decoupled, manageable subsystems. Main OB1 acts as a top-level dispatcher calling dedicated modular functions.",
        "keyPoints": [
          "OB1 functions as a clean sequence dispatcher calling structured FC and FB blocks",
          "Avoid monolithic rungs: decompose sprawling logic into discrete functional units",
          "Organize code hierarchically by process area (e.g. Raw Material Handling, Heating, Packaging)",
          "Enhances diagnostic transparency, isolating faults quickly during production stoppages",
          "Enables concurrent multi-engineer development across standardized block interfaces"
        ]
      }
    ],
    "review": [
      "Detail the fundamental technical differences between an FC and an FB. Under what criteria is an FB mandatory?",
      "What is an Instance Data Block, and when is it generated during the TIA Portal engineering workflow?",
      "Declare an SCL array of 5 REAL values named \"Zone_Temperatures\" and write an SCL code snippet to compute their arithmetic mean.",
      "Evaluate the result of: SHL(W#16#0001, 3). Provide the output in hexadecimal notation.",
      "Write an SCL CASE statement: If mode = 1, run Pump A; if mode = 2, run Pump B; if mode = 3, run both pumps simultaneously.",
      "Contrast the operational behaviors of IN, OUT, and IN_OUT block interface parameters.",
      "What is the primary architectural advantage of utilizing Multi-Instance Function Blocks?",
      "Explain the scope and access distinctions between a Global Data Block and an Instance Data Block."
    ]
  },

  '09-high-speed-counting': {
    "overview": "High-Speed Counters (HSC) capture high-frequency encoder pulse trains independently of CPU scan time. Pulse Width Modulation (PWM) modulates duty cycle for variable power delivery. Pulse Train Output (PTO) interfaces with stepper and servo drives through PLCopen Motion Control.",
    "objectives": [
      "Configure High-Speed Counter (HSC) channels to decode optical incremental encoders",
      "Read and manipulate high-speed counter values programmatically within ladder code",
      "Configure and modulate Pulse Width Modulation (PWM) duty cycles for variable loads",
      "Implement Pulse Train Output (PTO) and commission PLCopen Motion Control blocks (MC_Power, MC_MoveAbsolute)"
    ],
    "sections": [
      {
        "title": "8.1 High-Speed Counter (HSC) Hardware Architecture",
        "content": "High-Speed Counters (HSC) are dedicated on-chip hardware counters integrated within the S7-1200 microprocessor that accumulate pulse frequencies up to 100kHz asynchronously from the OB1 scan cycle.",
        "keyPoints": [
          "Hardware-Driven: Operates independently of CPU scan time, guaranteeing zero missed pulses",
          "Dedicated Physical Pins: Inputs %I0.0 (HSC1), %I0.2 (HSC2), %I0.4 (HSC3)... reserved for counter channels",
          "3 Operating Modes: Single Phase (single pulse stream), A/B Phase (quadrature encoder), Pulse + Direction",
          "Quadrature A/B Decoding (4x): Evaluates phase relationship between channels A and B to resolve direction and quadruple resolution",
          "Count Register (CV): 32-bit signed DINT spanning −2,147,483,648 to +2,147,483,647",
          "Preset Value (PV): Reference target count that triggers hardware interrupts or automatic counter resets"
        ],
        "note": "When an HSC channel is enabled in TIA Portal, its associated physical digital input pins are dedicated to the hardware counter and cannot be read as standard discrete DI inputs."
      },
      {
        "title": "8.2 HSC Channel Configuration in TIA Portal",
        "content": "HSC channels are configured in Device Configuration → CPU Properties → High Speed Counters. Parameters define counting modes, hardware identifiers, and interrupt assignments.",
        "keyPoints": [
          "Step 1: Open CPU Properties → High Speed Counters → Check \"Enable this high-speed counter\"",
          "Step 2: Select Operational Function: Counting, Frequency measurement, or Period duration",
          "Step 3: Define Counting Mode: Single phase, A/B phase quadrature, or Pulse/Direction",
          "Step 4: Note the Hardware Identifier and input address register (e.g. %ID1000)",
          "Step 5: Compile hardware configuration and download to target CPU",
          "Reading Value: Access %ID register directly or manage dynamically via the CTRL_HSC instruction"
        ]
      },
      {
        "title": "8.3 Pulse Width Modulation (PWM) Control",
        "content": "PWM generates a continuous rectangular wave with a fixed frequency and variable duty cycle (0% to 100%). It is widely applied for heating power modulation, DC motor velocity control, and proportional valve positioning.",
        "keyPoints": [
          "Fixed Frequency: Configurable from 1Hz up to 100kHz",
          "Variable Duty Cycle: 0% (fully de-energized) to 100% (continuously energized)",
          "Hardware Setup: Device Configuration → Pulse Generators (PTO/PWM) → Enable PWM mode",
          "Control Interface: Modulate duty cycle dynamically via output word registers or the CTRL_PWM block",
          "Transistor Output Requirement: PWM channels mandate solid-state DC transistor outputs (CPU DC/DC/DC)"
        ]
      },
      {
        "title": "8.4 Pulse Train Output (PTO) and PLCopen Motion Control",
        "content": "PTO outputs variable-frequency pulse trains to command stepper and servo drive amplifiers. The S7-1200 integrates Motion Control Technology Objects conforming to international PLCopen standards.",
        "keyPoints": [
          "MC_Power: Enables the drive amplifier and initializes the motion axis",
          "MC_Home: Executes homing sequences to calibrate machine zero datum",
          "MC_MoveAbsolute: Commands motion to a specific absolute engineering coordinate (mm, degrees)",
          "MC_MoveRelative: Commands relative positioning travel from the current position",
          "MC_MoveVelocity: Commands continuous velocity jog rotation",
          "MC_Halt / MC_Stop: Decelerates axis to a controlled stop or executes emergency stop abort",
          "Axis Technology Object: Parameterizes mechanical gear ratios, lead-screw pitches, and acceleration limits"
        ],
        "note": "On S7-1200 CPUs, PTO channels utilize on-board outputs %Q0.0 (PTO1) and %Q0.1 (PTO2). These physical outputs cannot be used for standard coils when PTO is active."
      },
      {
        "title": "8.5 Counting Modes, Quadrature A/B Phase, and Hardware Interrupts",
        "content": "Selecting optimal counter decoding modes matches sensor physical dynamics, while hardware interrupts allow immediate response upon reaching target production thresholds.",
        "keyPoints": [
          "Configure Phase Decoding to match encoder electrical outputs (Single-ended or Differential)",
          "Reference Value: Set target count thresholds that trigger OB40 hardware interrupt routines",
          "Zero Latency: Interrupt routines execute immediately, bypassing the normal scan cycle delay",
          "Direction Inversion: Invert direction flags programmatically without swapping physical sensor wires"
        ]
      },
      {
        "title": "8.6 Programmatic Interfacing via the CTRL_HSC Instruction Block",
        "content": "The CTRL_HSC instruction allows user code to dynamically modify counter parameters, reload reference setpoints, and reset current counts during runtime.",
        "keyPoints": [
          "Direct Register Read: Current counter value is continuously available at double-word address %ID (e.g. %ID1000)",
          "CTRL_HSC Instruction: Executes runtime control commands (resetting, changing direction, updating target values)",
          "Parameter NEW_CV: Injects a new starting count value into the hardware register",
          "Parameter DIR: Commands counting direction dynamically from software logic",
          "Diagnostic Feedback: Status and error flags report hardware counter health to the user program"
        ]
      },
      {
        "title": "8.7 Pulse Generator Configuration in TIA Portal",
        "content": "Configuring on-board Pulse Generators (PTO/PWM) dictates physical output channel assignments, signal formats, and hardware identifiers.",
        "keyPoints": [
          "Enable Pulse Generators in CPU Properties (e.g. Pulse 1, Pulse 2)",
          "Select Signal Type: PWM (duty cycle modulation) or PTO (frequency modulation)",
          "Output Format: Assign pulse stream (Pulse A) and direction output (Direction B)",
          "Hardware Identifier: Dedicated hardware ID links software blocks to physical channels",
          "Requires fast solid-state transistor outputs on the CPU mainboard"
        ]
      },
      {
        "title": "8.8 Motor Speed and Heater Control via Dynamic PWM Duty Cycles",
        "content": "Modulating duty cycle proportionally varies average DC voltage delivered to resistive heaters or DC motor armatures.",
        "keyPoints": [
          "The CTRL_PWM instruction enables or disables the pulse output stream programmatically",
          "Write duty cycle values (0–1000 corresponding to 0.0%–100.0%) directly to output word %QW registers",
          "High Switching Frequency: Eliminates audible acoustic hum and mechanical vibration",
          "Power Interfacing: Drives solid-state relays (SSRs) or MOSFET H-bridge amplifiers",
          "Closed-Loop Integration: Serves as the manipulated variable output for PID temperature loops"
        ]
      },
      {
        "title": "8.9 Motion Control Axis Technology Objects and Commissioning",
        "content": "Axis Technology Objects encapsulate drive kinematics, mechanical gear ratios, and safety limit switches into a unified engineering interface.",
        "keyPoints": [
          "Create Technology Object: Axis (Linear or Rotary kinematics)",
          "Mechanical Parameterization: Pulses per revolution, millimeters traveled per motor rotation",
          "Dynamic Limits: Maximum velocity, maximum acceleration, jerk limitation (S-curve smoothing)",
          "Integrated Commissioning Panel: Manual jogging, homing, and positioning tests prior to writing code",
          "Safety Limits: Software travel boundaries and hardware overtravel limit switch assignments"
        ]
      },
      {
        "title": "8.10 Practical Application: Real-Time Motor RPM Measurement via Encoder",
        "content": "Measures rotational motor speed by counting incremental encoder pulses over precise cyclic interrupt time windows.",
        "keyPoints": [
          "Execute calculation inside a cyclic interrupt block (OB30 configured to exactly 100ms)",
          "Delta Pulses Calculation: Delta_Pulses := Current_Count − Previous_Count",
          "Velocity Formula: RPM := (Delta_Pulses / Pulses_Per_Rev) × (60.0 / Sample_Period_Seconds)",
          "High Precision: Utilize DINT and REAL types to eliminate round-off errors at high velocities",
          "Feedforward Data: Calculated RPM feeds directly into closed-loop velocity PID algorithms"
        ]
      }
    ],
    "review": [
      "How does a High-Speed Counter (HSC) fundamentally differ from a standard CTU counter block, and when is an HSC mandatory?",
      "An incremental encoder produces 1000 pulses/rev in A/B Quadrature mode (4x decoding). If the motor shaft completes 5 full rotations, what is the net change in the counter CV register?",
      "A PWM channel operates at a frequency of 1kHz with a 30% duty cycle. What is the active ON duration in microseconds during each cycle?",
      "Enumerate the mandatory prerequisite steps that must be executed before commanding an MC_MoveAbsolute instruction.",
      "An axis is positioned at coordinate 250.0mm. If an MC_MoveRelative instruction is executed with Distance := 100.0mm, what is the final axis position?",
      "Detail the configuration steps required to activate and parameterize an HSC channel in TIA Portal.",
      "How does user logic dynamically modify the active duty cycle of a PWM output channel from Ladder Diagram?",
      "Explain the mathematical formulation for computing motor rotational RPM using encoder pulse differences across timed cyclic interrupts."
    ]
  },

  '10-closed-loop-pid': {
    "overview": "Proportional-Integral-Derivative (PID) control is the dominant closed-loop algorithm in the process and manufacturing industries. The Siemens S7-1200/1500 family incorporates the dedicated PID_Compact technology block featuring integrated auto-tuning in TIA Portal.",
    "objectives": [
      "Understand the mathematical principles of Proportional (P), Integral (I), and Derivative (D) control modes",
      "Configure and instantiate the PID_Compact technology block on an S7-1200 CPU",
      "Execute automated Pre-Tuning and Fine-Tuning workflows and manually trim PID gains",
      "Design closed-loop control architectures for temperature, fluid pressure, and liquid level processes"
    ],
    "sections": [
      {
        "title": "10.1 Mathematical Principles of PID Control",
        "content": "PID calculates corrective control output by evaluating: current instantaneous error (P), cumulative historical error (I), and anticipated rate of error change (D). The objective is compelling the Process Variable (PV) to track the Setpoint (SP) despite plant disturbances.",
        "keyPoints": [
          "Control Error Formulation: e(t) := Setpoint (SP) − Process Variable (PV)",
          "Proportional Term (P): Output proportional to error (Kp × e); provides immediate corrective drive but exhibits steady-state offset",
          "Integral Term (I): Integrates error over time (Ti); systematically eliminates steady-state offset",
          "Derivative Term (D): Differentiates error rate of change (Td); provides anticipatory damping to reduce overshoot",
          "Gain Tuning: Higher Kp accelerates response but risks instability; lower Ti accelerates integral correction; higher Td adds damping but amplifies noise"
        ]
      },
      {
        "title": "10.2 The PID_Compact Technology Block Architecture",
        "content": "PID_Compact is an integrated technology function block in TIA Portal featuring bumpless Auto/Manual transfer, automatic gain tuning, output saturation clamping, and anti-windup protection.",
        "keyPoints": [
          "Setpoint: Desired reference target in physical engineering units (REAL)",
          "Input: Process variable feedback in physical units (REAL), or raw peripheral counts via Input_PER",
          "Output: Calculated manipulated variable (REAL, 0.0% to 100.0%), or direct peripheral word Output_PER",
          "Manual Control: ManualEnable activates manual override; ManualValue sets forced output level",
          "Operating Modes: 0=Inactive, 1=Pre-tuning, 2=Fine-tuning, 3=Automatic, 4=Manual",
          "Deterministic Calling: Must be invoked from a constant-period Cyclic Interrupt OB (e.g. OB30 at 100ms)"
        ]
      },
      {
        "title": "10.3 Auto-Tuning and Commissioning Workflows",
        "content": "TIA Portal provides an interactive Commissioning editor for PID_Compact supporting automated identification (Pre-tuning → Fine-tuning) alongside real-time trend visualization.",
        "keyPoints": [
          "Pre-Tuning: Applies test output steps to measure system dead-time and process gain parameters",
          "Fine-Tuning: Closes the feedback loop to optimize Kp, Ti, and Td gains for minimal overshoot",
          "Automatic Gain Allocation: Optimized tuning constants are populated directly into the Instance DB",
          "Manual Trimming: Engineers can manually trim gains based on operational requirements",
          "Real-Time Trending: Graphically compares Setpoint (SP), Process Variable (PV), and Output (OUT) curves simultaneously"
        ],
        "note": "Always initiate Auto-Tuning when the plant is in a steady, quiescent thermal/fluid state—never during major transient disturbances."
      },
      {
        "title": "10.4 Operating Modes of PID_Compact",
        "content": "PID_Compact supports flexible operational states to facilitate seamless commissioning, operational changeovers, and emergency overrides.",
        "keyPoints": [
          "Inactive Mode (0): Controller is de-energized; output forced to zero or safe configured value",
          "Automatic Mode (3): Closed-loop feedback regulation actively tracking the Setpoint (SP)",
          "Manual Mode (4): Open-loop manual control where operators directly command the output percentage",
          "Integrated Alarm Diagnostics: Built-in monitoring of high/low limits and loop broken-wire detection",
          "Execution Architecture: Requires deterministic time-slice invocation within a Cyclic Interrupt OB"
        ]
      },
      {
        "title": "10.5 Mathematical Principles of Pre-Tuning and Fine-Tuning",
        "content": "The integrated tuning algorithm identifies open-loop and closed-loop process models, utilizing inflection-point methods to derive optimal PID constants.",
        "keyPoints": [
          "Automatically quantifies process dead-time (delay) and time constants",
          "Computes balanced PID gains prioritizing stability or disturbance rejection",
          "Pre-Tuning: Best executed from ambient startup to characterize heating/cooling rates",
          "Fine-Tuning: Executes small closed-loop oscillations to refine damping ratios",
          "Eliminates trial-and-error guesswork, reducing loop commissioning time from hours to minutes"
        ]
      },
      {
        "title": "10.6 Process Variable Conditioning and Output Scaling",
        "content": "Flexible input/output mapping accommodates both direct physical peripheral hardware channels and pre-conditioned software registers.",
        "keyPoints": [
          "Setpoint Source: Configurable from HMI operator entries or automated supervisory recipe DBs",
          "Process Variable Mapping: Select \"Input\" for pre-scaled REAL values; select \"Input_PER\" for raw %AIW counts",
          "Output Options: \"Output\" for 0–100% REAL; \"Output_PER\" for 0–27648 analog outputs; \"Output_PWM\" for pulse pins",
          "Output Rate Limiting: Limits maximum slew rate (% change per second) to prevent mechanical valve shock",
          "Input Noise Filtering: Built-in low-pass filter cleans noise on the incoming process variable"
        ]
      },
      {
        "title": "10.7 Output Saturation Clamping and Anti-Windup Protection",
        "content": "Clamping output bounds protects final control actuators while integral anti-windup algorithms prevent massive transient overshoots following large setpoint changes.",
        "keyPoints": [
          "Output_UpperLimit and Output_LowerLimit: Clamps output between safe physical limits (e.g. 0% to 100%)",
          "Actuator Protection: Prevents overdriving valves, pumps, or electrical heater circuits",
          "Integral Windup Phenomenon: Occurs when sustained error causes integral terms to accumulate to massive values while output is saturated",
          "Anti-Windup Mechanism: Halts integral accumulation whenever output reaches upper or lower clamping limits",
          "Rapid Recovery: Ensures immediate closed-loop recovery the moment the process variable returns within the proportional band"
        ]
      },
      {
        "title": "10.8 Manual Override and Bumpless Transfer",
        "content": "Enables human operators to take manual control of field actuators during maintenance or process anomalies without causing physical plant disturbances.",
        "keyPoints": [
          "Operator Toggle: Switch seamlessly between Automatic and Manual modes via HMI touchscreen controls",
          "ManualValue Tag: Defines the direct actuator command percentage while in Manual mode",
          "Bumpless Transfer: When switching from Manual back to Auto, internal integral states initialize to match current output, preventing sudden jolts",
          "Crucial for system commissioning, initial line charging, and sensor failure recovery",
          "Configurable safe fallback output state triggered automatically upon sensor loop loss"
        ]
      },
      {
        "title": "10.9 Cascade Control Architectures (Master-Slave Loops)",
        "content": "Cascade control pairs two feedback loops in series to rapidly attenuate fast upstream disturbances before they destabilize slow primary process variables.",
        "keyPoints": [
          "Primary Master Controller: Monitors slow outer variable (e.g. reactor temperature) and outputs setpoint for the inner loop",
          "Secondary Slave Controller: Regulates fast inner variable (e.g. steam jacket flow rate or pressure)",
          "Disturbance Rejection: Rejects supply-side line pressure fluctuations before tank temperature is perturbed",
          "Significantly improves settling time and dynamic stability in thermal and chemical processes",
          "Rule of Thumb: The inner slave loop must execute 3 to 5 times faster than the outer master loop"
        ]
      },
      {
        "title": "10.10 Practical Application: Thermal Chamber PID Control with HMI",
        "content": "Implements an industrial thermal chamber regulation system utilizing PID_Compact, RTD temperature telemetry, and interactive HMI operator screens.",
        "keyPoints": [
          "Hardware Architecture: S7-1200 CPU paired with an SM 1231 RTD module and solid-state relay power stage",
          "Block Configuration: PID_Compact parameterized with thermal limits and anti-windup clamping",
          "HMI Screen Development: Real-time numeric entry, live PV display, and historical trending curves",
          "Auto-Tuning Execution: Run pre-tuning and fine-tuning to determine optimal thermal constants",
          "Performance Verification: Quantify control metrics: rise time, percentage overshoot, and steady-state error"
        ]
      }
    ],
    "review": [
      "Explain the distinct physical roles of Proportional (P), Integral (I), and Derivative (D) terms in closed-loop feedback regulation.",
      "Given PID parameters Kp = 2.0, Ti = 10s, and Td = 0.5s, which term is responsible for eliminating steady-state error?",
      "From what type of Organization Block must the PID_Compact block be invoked, and why is this requirement technically critical?",
      "Enumerate the sequential steps required to execute an automated PID Pre-Tuning workflow in TIA Portal.",
      "Design a thermal control loop for a drying oven: Setpoint = 80°C, PT100 RTD sensor input, solid-state relay (SSR) heating output.",
      "What is the practical purpose of \"Bumpless Transfer\" when toggling between Manual and Automatic modes on an HMI?",
      "Why is output clamping combined with integral anti-windup protection mandatory when commanding real physical actuators?",
      "In a cascade PID control architecture, how do the Master and Slave control loops interact with each other?"
    ]
  },

  '11-communication': {
    "overview": "Industrial communication networks integrate the PLC with operator HMIs, peer PLCs, variable speed drives, and plant-wide SCADA supervisory systems. The S7-1200 supports PROFINET, S7 Communication (PUT/GET), Modbus TCP/RTU, and OPC UA protocols.",
    "objectives": [
      "Configure PROFINET IO networks to communicate with distributed remote I/O and field devices",
      "Implement S7 Communication between peer PLCs utilizing PUT and GET client instructions",
      "Program and parameterize Modbus TCP Client/Server and Modbus RTU master/slave networks",
      "Understand the architecture of OPC UA and its critical role in Industrial IoT (IIoT) connectivity"
    ],
    "sections": [
      {
        "title": "11.1 Overview of Industrial Communication Networks",
        "content": "Industrial automation relies on robust standardized communication protocols: PROFINET (real-time Ethernet-based), PROFIBUS-DP (legacy RS485 token-ring), Modbus TCP/RTU (open, universal cross-vendor protocol), and OPC UA (platform-independent secure IIoT protocol).",
        "keyPoints": [
          "PROFINET: Industrial Ethernet, 100 Mbps full-duplex, deterministic cycle times ≥1ms",
          "PROFIBUS-DP: RS485 fieldbus, speeds up to 12 Mbps, widely deployed across legacy installations",
          "Modbus TCP: Universal Modbus protocol encapsulated over standard Ethernet TCP/IP port 502",
          "Modbus RTU: Serial master-slave communication over RS485 or RS232 electrical lines",
          "OPC UA: Open, vendor-neutral, encrypted protocol for enterprise SCADA and cloud integration"
        ]
      },
      {
        "title": "11.2 PROFINET IO Architecture and Device Commissioning",
        "content": "PROFINET IO represents Siemens' primary real-time communication standard. A PROFINET IO Controller (PLC) deterministically commands distributed PROFINET IO Devices (remote I/O racks, VFD drives, HMI panels).",
        "keyPoints": [
          "IO Controller: The master CPU executing control logic and scheduling communication (e.g. S7-1200)",
          "IO Device: Distributed field apparatus (e.g. ET200SP remote I/O drops, SINAMICS drives)",
          "Network Configuration: Drag and drop field devices into the TIA Portal Network View and assign to the controller",
          "Real-Time (RT) Class: Deterministic cyclic data exchange ranging from 1ms to 512ms update times",
          "GSDML Device File: XML device description file provided by equipment manufacturers defining module parameters"
        ]
      },
      {
        "title": "11.3 Modbus TCP and Modbus RTU Communication Protocols",
        "content": "Modbus is a universal, open master-slave protocol supported by virtually all industrial instrumentation. Modbus masters initiate request telegrams; addressed slaves execute commands and return response packets.",
        "keyPoints": [
          "Function Code 01: Read Discrete Output Coils (digital outputs)",
          "Function Code 03: Read Holding Registers (analog/integer registers)",
          "Function Code 05: Write Single Coil",
          "Function Code 06: Write Single Holding Register",
          "MB_COMM_LOAD: Initializes the serial communication module (CM 1241) port parameters",
          "MB_MASTER: Transmits Modbus requests from the PLC to remote slave instrumentation",
          "MB_SLAVE: Configures the PLC to respond as an addressable Modbus slave device"
        ],
        "note": "Modbus RTU requires adding a CM 1241 RS485 communication module or CB 1241 board to the S7-1200. Standard baud rates include 9600, 19200, 38400, and 115200 bps."
      }
    ],
    "review": [
      "Explain the technical distinctions between PROFINET RT (Real-Time) and PROFINET IRT (Isochronous Real-Time).",
      "What is the operational function of Modbus Function Code 03, and what data structure constitutes its request/response packet?",
      "What specific hardware module must be added to an S7-1200 CPU to enable Modbus RTU serial communication?",
      "How does S7 Communication operate when exchanging data between two peer PLCs using PUT and GET instructions?",
      "What architectural advantages does OPC UA offer over legacy Modbus in modern IIoT and Industry 4.0 applications?"
    ]
  },

  '12-fault-diagnostics': {
    "overview": "Fault diagnosis and troubleshooting are essential competencies in maintaining automated manufacturing cells. TIA Portal equips engineers with comprehensive online tools: CPU Diagnostic Buffer, Watch Tables, Force Tables, Signal Traces, and Live Program Status.",
    "objectives": [
      "Inspect and interpret the CPU Diagnostic Buffer to trace historical hardware and software error events",
      "Deploy Watch Tables and Force Tables to validate field I/O and simulate operating conditions",
      "Capture high-speed signal dynamics using the integrated TIA Portal Trace utility",
      "Identify and troubleshoot common operational faults across PLC hardware, wiring, and software logic"
    ],
    "sections": [
      {
        "title": "14.1 Diagnostic Toolset in TIA Portal",
        "content": "TIA Portal provides a comprehensive online diagnostic suite enabling automation technicians to inspect CPU operating status, module health, and ladder power flow in real time without halting production.",
        "keyPoints": [
          "Diagnostic Buffer: Historical log of CPU system events, hardware faults, and programming errors (stores up to 50 entries)",
          "Module Information: Real-time telemetry reporting channel health, supply voltage, and wire breaks on expansion modules",
          "Watch Table: Real-time tabular monitoring and modification of selected process variables",
          "Force Table: Permanently overrides peripheral physical I/O points for hardware verification",
          "Trace Utility: High-resolution signal recorder capturing variables down to individual scan cycle resolution",
          "Program Status (Glasses Icon): Displays live energized power flow through ladder rungs"
        ]
      },
      {
        "title": "14.2 Systematic Troubleshooting of Digital Input (DI) Modules",
        "content": "When a digital input channel fails to report field switch actuation, follow a systematic isolation procedure: verify field sensor power supply, measure voltage at module terminal screws, and verify common-point polarity.",
        "keyPoints": [
          "Measure DC voltage across terminal Ix.x and common terminal 1M with a digital multimeter when sensor is actuated",
          "Voltage < 5VDC while sensor is actuated indicates broken field wiring or a defective sensor output",
          "Voltage ≥ 15VDC present at screw terminal but channel LED remains unlit indicates internal optocoupler module failure",
          "Channel LED illuminates green but software tag remains 0 indicates hardware configuration mismatch or CPU in STOP mode",
          "Verify sensor output topology (PNP vs NPN) matches module common-terminal configuration (Sink vs Source)"
        ]
      },
      {
        "title": "14.3 Systematic Troubleshooting of Digital Output (DO) Modules",
        "content": "When an actuator fails to energize, utilize Force Tables to verify software command delivery, inspect module protection fuses, and check field supply voltage rails.",
        "keyPoints": [
          "Inspect the module branch circuit fuse first; fuses commonly blow due to external coil short-circuits",
          "Force the output channel to 1 in the Force Table and measure voltage directly across terminal Qx.x and neutral M",
          "If voltage toggles to 24VDC but contactor fails to pull in, the fault resides in external wiring or the contactor coil",
          "If voltage remains 0VDC while forced, inspect load power supply rail (1L/2L) or replace the output module",
          "Relay Modules: Check for welded contacts or contact burn-out resulting from unsuppressed inductive arcing"
        ]
      },
      {
        "title": "14.4 Power Supply Quality and Memory Corruption Troubleshooting",
        "content": "Power quality issues cause erratic CPU behavior, watchdog timeouts, and memory loss. Verify 24VDC voltage tolerance, ripple voltage, and grounding integrity.",
        "keyPoints": [
          "Verify 24VDC power supply output voltage (must remain strictly within ±10%, between 21.6VDC and 26.4VDC)",
          "Check AC ripple voltage: High power supply ripple (>150mV pp) causes CPU brownout resets",
          "Electromagnetic Interference (EMI): Install ferrite chokes on analog and communication cables near noisy VFDs",
          "Upload software from the physical CPU to an engineering PC and compare against golden backup archives",
          "\"Memory Card Error\": Requires clearing memory faults or re-formatting the SIMATIC Memory Card via TIA Portal"
        ],
        "note": "Always maintain current, verified project backup archives prior to performing maintenance on industrial PLC systems."
      },
      {
        "title": "14.5 Online Program Monitoring and Real-Time Variable Manipulation",
        "content": "Online monitoring features allow engineers to observe live ladder execution and inject test values to validate machine interlocks.",
        "keyPoints": [
          "Go Online: Establishes active communication session between TIA Portal and physical automation devices",
          "Program Status: Green solid lines indicate true power flow; blue dashes indicate unenergized logic paths",
          "Watch Table: Enables grouping and observing mission-critical tags during live production runs",
          "Force Table: Forces hardware inputs/outputs, bypassing all internal software interlocking logic",
          "Modify Value: Injects transient test values into data block tags to test operational sequences"
        ]
      },
      {
        "title": "14.6 Reading and Decoding the CPU Diagnostic Buffer",
        "content": "The CPU Diagnostic Buffer is the primary forensic flight-recorder of the PLC, recording critical operational events, memory faults, and communication disruptions.",
        "keyPoints": [
          "Stores up to 50 sequential events on S7-1200 (expandable up to 3200 events on S7-1500)",
          "Records hardware faults, programming syntax errors, I/O access violations, and mode transitions",
          "Each event contains a microsecond timestamp, unique Event ID code, and descriptive diagnostic text",
          "\"Open in Editor\" Button: Automatically opens and navigates directly to the exact ladder rung causing the fault",
          "Non-Volatile Retention: Retains historical diagnostic logs intact across power interruptions"
        ]
      },
      {
        "title": "14.7 Front-Panel LED Diagnostics and Fault Decoding",
        "content": "Front-panel status LEDs on the CPU and expansion modules provide instantaneous physical diagnostics on the factory floor without requiring an engineering laptop.",
        "keyPoints": [
          "RUN/STOP LED: Solid Green = RUN mode; Solid Amber = STOP mode; Flashing = Startup transition",
          "ERROR LED: Flashing Red = Minor fault / I/O access error; Solid Red = Fatal CPU hardware or memory fault",
          "MAINT LED: Solid Amber = Maintenance demanded (e.g. RTC battery depleted, SD card service needed)",
          "I/O Channel LEDs: Directly indicate presence of electrical potential at the physical screw terminal",
          "Correlate combinations: RUN Green + ERROR Red Flash indicates program exception with CPU continuing execution"
        ]
      },
      {
        "title": "14.8 Common Execution Faults and Error Organization Blocks",
        "content": "Understanding programming runtime errors that provoke CPU transitions into STOP mode, and deploying error Organization Blocks to maintain continuous operation.",
        "keyPoints": [
          "OB85 (Program Sequence Error): Triggered by missing block calls or operating system exceptions",
          "OB86 (Rack / Subnet Failure): Triggered upon loss of communication with distributed PROFINET IO drops",
          "I/O Access Errors: Triggered by user rungs attempting to read/write addresses of nonexistent expansion modules",
          "Cycle Time Exceeded: Watchdog timer (default 150ms) trips when endless loops stall CPU scan execution",
          "Mathematical Exceptions: Division by zero or floating-point overflow halts CPU if error handling is absent"
        ]
      },
      {
        "title": "14.9 Project Backups and Safe Firmware Upgrade Procedures",
        "content": "Standardized backup workflows and firmware update procedures ensure operational stability, cyber-security compliance, and rapid disaster recovery.",
        "keyPoints": [
          "Project Archiving: Generates compact .zap archive files bundling code, hardware config, and HMI graphics",
          "Upload as New Station: Reconstructs a full engineering project directly from an unknown field CPU",
          "Firmware Upgrades: Applied via TIA Portal online diagnostics or pre-loaded SIMATIC Memory Cards",
          "Uninterruptible Power: Guarantee stable power during firmware flashing; power loss can brick the CPU mainboard",
          "Golden Archive Rule: Always take a full upload backup immediately prior to executing any firmware update"
        ]
      },
      {
        "title": "14.10 Industrial Preventive Maintenance Protocol for Control Panels",
        "content": "Structured periodic preventive maintenance schedules extend electronic lifespan and prevent catastrophic unplanned production shutdowns.",
        "keyPoints": [
          "Terminal Inspection: Annually re-torque all screw terminals to eliminate loose connections caused by vibration",
          "Battery Maintenance: Measure and replace RTC backup batteries prior to voltage degradation",
          "Thermal Management: Clean ventilation louvers, vacuum cabinet dust filters, and verify cooling fan operation",
          "Power Supply Testing: Measure DC output voltage and verify AC ripple remains within catalog specifications",
          "Diagnostic Review: Inspect CPU Diagnostic Buffer during scheduled shutdowns to catch emerging intermittent faults"
        ]
      }
    ],
    "review": [
      "Detail the ordered troubleshooting steps when a digital input channel fails to report field switch actuation.",
      "Explain the fundamental operational differences between a Watch Table and a Force Table in TIA Portal.",
      "Under what troubleshooting circumstances should an engineer deploy the Trace utility rather than a Watch Table?",
      "Enumerate the 5 most prevalent operational faults encountered in PLC control systems along with their corrective remedies.",
      "Why is inspecting branch circuit fuses the first step when a digital output channel fails to energize its load?",
      "How does an engineer utilize the CPU Diagnostic Buffer to identify the root cause of a sudden transition to STOP mode?",
      "Decode the operational meaning of concurrent RUN (Green) and ERROR (Flashing Red) LED indicators on an S7-1200 CPU.",
      "Under what operational conditions does the operating system invoke Organization Block OB86, and how is it resolved?"
    ]
  },

  '15-system-integration': {
    "overview": "The capstone project synthesizes the curriculum into a complete industrial application: designing an integrated PLC-HMI-SCADA system architecture, developing the master I/O schedule, implementing structured ladder logic, engineering HMI graphics, and validating plant-wide supervision.",
    "objectives": [
      "Analyze customer process specifications and design an end-to-end automation system architecture",
      "Develop the comprehensive master I/O Schedule and configure symbolic Tag Tables in TIA Portal",
      "Integrate PLC control logic, local HMI operator graphics, and supervisory SCADA into a cohesive system",
      "Execute Factory Acceptance Testing (FAT), site commissioning, and handover documentation"
    ],
    "sections": [
      {
        "title": "15.1 System Architecture and Topology Engineering",
        "content": "Initial phase: analyze technological process requirements → identify field instrumentation → draft the System Architecture Diagram. Define CPU sizing, I/O count, network protocols, and HMI/SCADA supervisory tiers.",
        "keyPoints": [
          "Process Analysis: Review Process & Instrumentation Diagrams (P&ID) and operational sequence narratives",
          "I/O Quantification: Tabulate total counts and signal types across DI, DO, AI, and AO channels",
          "Hardware Sizing: Select appropriate CPU model and expansion modules, provisioning ≥20% spare capacity",
          "Network Architecture: Design PROFINET, Modbus, and Industrial Ethernet topologies with managed switches",
          "Bill of Materials (BOM): Compile detailed hardware components, part numbers, and power supply budgets"
        ]
      },
      {
        "title": "15.2 Master I/O Schedule and Tag Table Standardization",
        "content": "The Master I/O Schedule is the central engineering document bridging electrical hardware design with software programming. It details every field signal, terminal address, data type, range, and physical device tag.",
        "keyPoints": [
          "Mandatory Data Columns: Symbolic Tag Name, Absolute Address, Data Type, Engineering Units, Description",
          "Recommended Fields: Calibrated Measuring Range, Field Device Tag Number, Junction Box, Cabinet Terminal Pin",
          "Hierarchical Naming Conventions: Use standard AREA_EQUIPMENT_SIGNAL syntax (e.g. PUMP101_FLOW_PV)",
          "Tag Table Population: Import standardized I/O schedules directly from Excel into TIA Portal Tag Tables",
          "Eliminates duplicate address errors and ensures 100% naming consistency across PLC, HMI, and SCADA"
        ]
      },
      {
        "title": "15.3 Integrated Tri-Tier Control: PLC Logic, HMI Graphics, and SCADA Supervision",
        "content": "Integration binds the three operational tiers: the PLC executes real-time deterministic control; the local HMI provides machine-side operator manipulation; SCADA provides plant-wide supervision, alarm archiving, and historical trending.",
        "keyPoints": [
          "PLC ↔ HMI Interfacing: High-speed PROFINET connection sharing symbolic tags directly from the Tag Table",
          "PLC ↔ SCADA Interfacing: Industrial OPC UA or S7 Communication channels streaming telemetry to control room servers",
          "Alarm Management: PLC evaluates thresholds → HMI displays immediate visual banners → SCADA archives historical log",
          "Recipe Management: Central SCADA dispatches production recipe setpoints down to PLC data blocks",
          "Historical Data Logging: SCADA historians record analog process variables at periodic sample intervals (1s to 60s)"
        ]
      },
      {
        "title": "15.4 Testing, Commissioning, and Handover Documentation",
        "content": "Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT) represent mandatory formal milestones validating system performance prior to final customer commercial handover.",
        "keyPoints": [
          "Factory Acceptance Test (FAT): Rigorous testing at panel fabrication facility utilizing simulated I/O panels",
          "Site Acceptance Test (SAT): Live commissioning at the customer site following field installation",
          "Point-to-Point I/O Verification: Methodically verify every sensor and actuator point against the master I/O schedule",
          "Functional Mode Verification: Test manual overrides, automated sequencing, interlocks, and emergency stop circuits",
          "Alarm Testing: Simulate broken wires, high-limit overshoots, and motor overloads to verify alarm responses",
          "Handover Package: As-Built electrical schematics, software backup archives, operator manuals, and SAT sign-off records"
        ]
      }
    ],
    "review": [
      "Enumerate the sequential engineering phases involved in delivering a PLC automation system from requirements to handover.",
      "What mandatory information columns must be populated within a professional Master I/O Schedule, and why is this document vital?",
      "Contrast the operational objectives of a Factory Acceptance Test (FAT) with a Site Acceptance Test (SAT).",
      "Design an integrated control architecture for a multi-pump booster station: 2 duty/standby pumps, 1 level transmitter, 1 pressure transmitter, and automatic lead-lag alternation.",
      "What formal engineering documents must be included in the final handover dossier delivered to the operating plant at project completion?"
    ]
  },

  '06-other-plc-brands': {
    overview: 'While Siemens dominates the European market, real factories contain PLCs from many vendors. Omron and Mitsubishi are the two most common alternatives you will encounter in Vietnamese and Asian manufacturing. This lesson maps their hardware, I/O wiring conventions, handheld programming consoles, and Ladder Diagram dialect onto what you already know from the S7-1200 — so you can read an unfamiliar panel without starting from zero.',
    objectives: [
      'Identify the CPU and I/O modules of an Omron CP1H and a Mitsubishi FX3U',
      'Wire a sinking and a sourcing DI circuit for each brand',
      'Use a handheld programming console to enter and monitor a short ladder program',
      'Write equivalent ladder rungs in Omron CX-Programmer and Mitsubishi GX Works',
      'Compare bit-address notation across Siemens, Omron, and Mitsubishi',
    ],
    sections: [
      {
        title: '5.1 Omron and Mitsubishi — Why Bother?',
        content: 'Roughly 30 % of the PLCs installed in Vietnamese factories are not Siemens. Omron (Japan) and Mitsubishi (Japan) share most of that remainder. Their hardware philosophy is similar to Siemens — CPU + expansion modules on a backplane — but naming, addressing, and software differ enough to cause confusion on a first encounter.',
        keyPoints: [
          'Omron CP-series (CP1E/CP1H/CP2E): compact DIN-rail CPUs, USB programming port, CX-Programmer software',
          'Mitsubishi FX-series (FX3U/FX5U/iQ-F): compact CPUs, GX Works 2/3 software',
          'Both brands use 100–240 VAC or 24 VDC power supply variants',
          'Bit addressing: Siemens I0.0 ≡ Omron 0.00 ≡ Mitsubishi X0',
          'Word addressing: Siemens MW10 ≡ Omron DM0 ≡ Mitsubishi D0',
          'All three brands comply with IEC 61131-3 Ladder Diagram',
        ],
      },
      {
        title: '5.2 Input and Output Circuits',
        content: 'The sinking/sourcing distinction that applies to Siemens DI/DO applies equally to Omron and Mitsubishi. The wiring diagram symbols and terminal labels differ, but the underlying transistor physics is identical.',
        keyPoints: [
          'Omron CP1H: COM terminal shared among groups — check manual for group boundaries',
          'Mitsubishi FX3U: S/S terminal selects sink or source for all DIs together',
          'Transistor output (PNP/NPN) maximum load current: typically 0.5 A per point',
          'Relay output modules: same 2 A per point as Siemens, suitable for AC loads',
          'Analog I/O: 12-bit resolution, 4–20 mA or 0–10 V, add-on cartridge or expansion',
          'Always confirm COM grouping before connecting a mixed-voltage field panel',
        ],
        note: 'Mixing sinking and sourcing devices on the same COM group will short the two power rails. Always verify before energising.',
      },
      {
        title: '5.3 Programming Console',
        content: 'A handheld programming console (HPP) lets you enter, modify, and monitor a ladder program without a laptop. This is the standard tool in small shops and for emergency field changes. Omron and Mitsubishi both ship a console that connects to the CPU programming port.',
        keyPoints: [
          'CX-Programmer (Omron): Windows software; HPP for offline edits',
          'GX Works2/3 (Mitsubishi): Windows software; GOT HMI or HPP for field edits',
          'Console keypad mnemonics: LD (Load), AND, OR, OUT, END — same logic as STL',
          'Monitor mode: force ON/OFF individual bits, watch current values in real time',
          'Typical use: clear a fault, force an output to test a contactor, read a timer value',
          'Download requires PROG mode; switching to RUN resumes execution',
        ],
      },
      {
        title: '5.4 Ladder Diagram Programming',
        content: 'IEC 61131-3 LAD rungs look the same across all three brands, but the instruction library, timer types, and data handling differ in detail. This section maps the most common instructions.',
        keyPoints: [
          'Normally-Open contact: LD in Omron/Mitsubishi — same symbol as Siemens',
          'Normally-Closed contact: LDI (Omron), LDI (Mitsubishi) — slash through contact',
          'Output coil: OUT — single coil, no difference visually',
          'Omron SET/RSET ≡ Mitsubishi SET/RST ≡ Siemens S/R coils',
          'Timers: Omron TIM (100 ms base) / TIMH (10 ms); Mitsubishi T (100 ms) / T (10 ms select)',
          'Counters: Omron CNT (down); Mitsubishi C (up) — direction differs, check preset logic',
        ],
      },
      {
        title: '5.5 Other Common Instructions',
        content: 'Beyond basic contacts and coils, each brand provides data-move, comparison, and arithmetic instructions. The function names differ but the operands are structurally the same.',
        keyPoints: [
          'MOVE: Omron MOV, Mitsubishi MOV — copy a word between registers',
          'Arithmetic: Omron ADD/SUB/MUL/DIV, Mitsubishi + - * / in LAD boxes',
          'Comparison: Omron CMP stores result in flags; Mitsubishi uses contact-box comparison',
          'Jump: Omron JMP/JME, Mitsubishi CJ Pn — skip rungs for efficiency',
          'Subroutine: Omron SBN/RET, Mitsubishi CALL/SRET — reduce code duplication',
          'END instruction required on all three brands to terminate the main program scan',
        ],
      },
    ],
    review: [
      'Name two Omron CPU models and two Mitsubishi CPU models commonly found in Vietnamese factories.',
      'How do you select sink vs source DI mode on a Mitsubishi FX3U? On an Omron CP1H?',
      'Write the Mitsubishi GX Works mnemonic sequence for: load X0, AND-NOT X1, output Y0.',
      'A Mitsubishi timer T0 with K100 and a 100 ms time base — how many seconds does it time?',
      'You open a panel and find an Omron CP1H. Describe three steps to read the current program without a laptop.',
    ],
  },

  '07-system-design': {
    overview: 'Buying a PLC is easy; engineering a reliable control system is not. This lesson takes you from a customer specification through device selection, I/O list, wiring, programming, testing, and handover documentation. Every step produces an artefact — a list, a drawing, a test record — and those artefacts together constitute professional PLC engineering practice.',
    objectives: [
      'Translate a process description into a quantified I/O list',
      'Select an appropriate S7-1200 CPU and expansion modules for a given I/O count',
      'Produce a bill-of-materials and panel layout sketch',
      'Write a structured program (OB1 → FC → FB) that passes a Factory Acceptance Test',
      'Create a Site Acceptance Test checklist and a complete handover document set',
    ],
    sections: [
      {
        title: '6.1 Analysing Requirements and Selecting Devices',
        content: 'The first task on any project is to turn the customer description into a list of signals — what goes in and what comes out. That list drives every hardware choice that follows.',
        keyPoints: [
          'Read the Process and Instrumentation Diagram (P&ID) or functional description carefully',
          'For each field device, record: signal type (DI/DO/AI/AO), voltage/current range, location, safety category',
          'Count I/O totals with 20 % spare margin — panels grow after commissioning',
          'CPU selection: match I/O count, choose AC or DC power, verify communication needs',
          'Safety: identify E-stop loops and motor overloads that must be hardwired regardless of PLC',
          'Budget: CPU + modules + HMI + panel + cables + commissioning time',
        ],
      },
      {
        title: '6.2 Designing and Programming the System',
        content: 'Good program structure prevents the "bowl-of-spaghetti" ladder that nobody can maintain. Divide the program into functions (FC) by process area — one FC per motor group, one for alarms, one for sequencer logic — all called from OB1.',
        keyPoints: [
          'Create the Tag Table first: every I/O point gets a symbolic name before a single rung is written',
          'Use Global DBs for setpoints and production data shared across FCs',
          'Use FBs with Instance DBs for recurring equipment: each pump is the same FB, different DB',
          'State machine (CASE/IF in SCL or SFC) for sequential processes — do not use timers as sequencers',
          'Comment every network: what it does, not what the code says',
          'Simulate with PLCSIM before connecting to hardware — saves hours of panel time',
        ],
        note: 'Program structure is permanent; a "quick fix" rung added outside the structure becomes technical debt immediately.',
      },
      {
        title: '6.3 Connecting Digital Expansion Modules',
        content: 'When the CPU\'s on-board I/O is not enough, Signal Modules (SM) extend the system to the right on the DIN rail. Each SM is configured in TIA Portal\'s hardware catalog and receives an automatic address.',
        keyPoints: [
          'SM 1221: 8×DI or 16×DI — add digital inputs for extra pushbuttons or sensors',
          'SM 1222: 8×DO or 16×DO relay — add digital outputs for extra contactors or lamps',
          'SM 1223: 8×DI + 8×DO — mixed module for compact panels',
          'Addresses: first SM starts at the byte after the CPU\'s last I/O byte',
          'Maximum 8 SMs per CPU 1214C — plan layout before ordering',
          'Each SM needs 24 VDC load power, separate from CPU supply',
        ],
      },
      {
        title: '6.4 Connecting Analog Expansion Modules',
        content: 'Analog signals — pressure, temperature, flow, position — require dedicated SM 1231 (AI) and SM 1232 (AO) modules. Each channel is 12-bit or 13-bit, configurable for voltage or current.',
        keyPoints: [
          'SM 1231 AI 4×13-bit: four analog inputs, ±10 V or 0–20 mA, configure per channel in TIA Portal',
          'SM 1232 AO 2×14-bit: two analog outputs, ±10 V or 0–20 mA',
          'RTD module SM 1231 AI 4×RTD: direct PT100/PT1000 connection, no signal conditioner needed',
          'Thermocouple module SM 1231 AI 4×TC: K, J, T, E, B, R, S types',
          'Always use shielded cable for analog signals, connect shield at one end only',
          'Verify channel configuration (voltage/current) matches field transmitter before powering',
        ],
      },
      {
        title: '6.5 Troubleshooting a PLC Control System',
        content: 'Fault-finding follows a logical progression: confirm power, check CPU LED, go online to read diagnostics, isolate the faulty subsystem, swap suspect hardware last. Most faults are found in the first three steps.',
        keyPoints: [
          'Step 1: Check power supplies — 24 VDC for CPU and I/O modules with a multimeter',
          'Step 2: Read CPU LED — RUN (green), STOP (yellow), ERROR (red flashing)',
          'Step 3: TIA Portal → Online → Diagnostic Buffer — timestamps and event codes',
          'Step 4: Watch Table — monitor suspect signals, force outputs to test actuators',
          'Step 5: Physical check — loose terminals, damaged cables, tripped circuit breakers',
          'Step 6: Module swap — only after software confirms module fault, use anti-static precautions',
        ],
      },
    ],
    review: [
      'A conveyor system has 6 motors, 12 proximity sensors, 4 VFDs (analogue speed reference), and 2 e-stop buttons. List the I/O count by type and propose an S7-1200 hardware configuration.',
      'Why should you write the Tag Table before writing any ladder rungs?',
      'Describe the difference between an FC and an FB. Give one example where each is the right choice.',
      'A technician reports that Q0.3 does not turn on a conveyor motor. List five ordered troubleshooting steps.',
      'What documents should be included in a handover package at the end of a PLC project?',
    ],
  },

  '13-s7-300': {
    overview: 'The SIMATIC S7-300 was Siemens\' workhorse for two decades and remains installed in hundreds of thousands of machines worldwide. You will encounter it on plant tours, in legacy upgrade projects, and in job advertisements. This lesson gives you enough knowledge to read an S7-300 panel, connect to it with STEP 7 Classic or TIA Portal, understand its instruction set, and decide whether it should be migrated to S7-1500.',
    objectives: [
      'Identify S7-300 rack components: PS, CPU, IM, SM, CP modules',
      'Connect to an S7-300 via MPI or PROFIBUS and read the program online',
      'Map S7-300 instructions (OPN, L, T, =, A, AN, O) to their S7-1200 equivalents',
      'Explain why the S7-300 is still widely deployed despite being superseded',
      'Assess whether a given S7-300 installation warrants migration to S7-1200/1500',
    ],
    sections: [
      {
        title: '8.1 S7-300 Platform Overview',
        content: 'The S7-300 uses a backplane rack (not DIN-rail snap modules) and communicates over MPI or PROFIBUS-DP. Its CPUs range from the compact CPU 312 to the high-performance CPU 319-3 PN/DP. All S7-300 programs are stored in STEP 7 Classic projects (*.s7p) or imported into TIA Portal V13+.',
        keyPoints: [
          'Rack: up to 8 modules per rack; multiple racks linked by IM 360/361 send/receive interfaces',
          'Power Supply (PS): 307-1EA80 (2 A) or 307-2BA10 (5 A) — mounts in slot 1',
          'CPU mounts in slot 2; first SM starts in slot 4 (slot 3 is reserved for IM)',
          'MPI network: 187.5 kbit/s default, max 32 nodes — used for programming and HMI',
          'PROFIBUS-DP: up to 12 Mbit/s — used for I/O expansion and drives',
          'PROFINET: available on CPU 315/317/319 PN variants — supports S7 communication',
          'End-of-life announced: spare parts available until ~2030 from authorised distributors',
        ],
      },
      {
        title: '8.2 S7-300 Instruction Set',
        content: 'S7-300 STL (Statement List, called AWL in German) is register-based: you load a value into the accumulator (ACCU), operate on it, then transfer the result. Ladder (KOP) and Function Block Diagram (FBD) are also supported and look similar to S7-1200.',
        keyPoints: [
          'A I0.0 — AND bit; AN I0.1 — AND-NOT; O I0.2 — OR; = Q0.0 — assign output',
          'L MW10 — Load word into ACCU1; T MW12 — Transfer ACCU1 to word',
          'L MD20 — Load double-word (32-bit); L #MyVar — Load local variable',
          'Arithmetic: +I (add int), -I, *I, /I; for REAL: +R, -R, *R, /R',
          'Comparison: ==I, <>I, >I, <I — result goes to RLO (Result of Logic Operation)',
          'JU LAB1 — unconditional jump; JC LAB2 — conditional jump (if RLO = 1)',
          'CALL FC10 — call function; CALL FB20, DB20 — call function block with instance DB',
        ],
      },
      {
        title: '8.3 S7-300 in Factory Applications',
        content: 'Despite being superseded by S7-1500, the S7-300 continues to control critical processes because replacement carries risk and cost. Understanding when to leave it alone and when to migrate is a key engineering judgement.',
        keyPoints: [
          'Still found in: automotive body-in-white, chemical batch reactors, water treatment plants installed before 2015',
          'CPU 315-2 PN/DP with ET200S distributed I/O is a common architecture in large panels',
          'Typical CPU memory: 256 KB work memory — sufficient for most machine programs',
          'STEP 7 Classic (v5.7) still required for some old projects; TIA Portal can import v5.5+ projects',
          'Migration trigger: CPU spare parts unavailable, safety system upgrade, capacity expansion',
          'Migration path: S7-300 → S7-1500 using Siemens TIA Migration Tool (partial automation)',
        ],
      },
    ],
    review: [
      'Draw an S7-300 rack and label the function of slots 1, 2, 3, and 4.',
      'Translate this S7-300 STL to a Ladder rung: A I0.0 / AN I0.1 / = Q0.0',
      'What is the difference between MPI and PROFIBUS-DP? When would you choose each?',
      'An S7-300 CPU 315 has been running a packaging machine for 12 years. The customer asks whether to replace it. What questions do you ask before recommending migration?',
      'Name two software tools used to program S7-300 and state which TIA Portal versions support S7-300.',
    ],
  },

  '14-system-upgrade': {
    overview: 'Legacy PLC systems get replaced for many reasons: obsolete hardware, expanding I/O, functional safety certification, integration with modern SCADA or cloud systems. Migration is never a simple swap — programs must be converted, field wiring checked, and operators retrained. This lesson gives you a structured methodology so that an upgrade project finishes on time and the line restarts on the first attempt.',
    objectives: [
      'List the technical and business triggers that justify a PLC migration project',
      'Identify the correct Siemens migration path: S7-200 → S7-1200, S7-300 → S7-1500',
      'Use the TIA Migration Tool to convert a STEP 7 project and list what requires manual rework',
      'Produce a risk register and a commissioning plan for a live-line migration',
      'Write a rollback procedure and define the acceptance criteria for go-live',
    ],
    sections: [
      {
        title: '9.1 Why and When to Upgrade',
        content: 'A PLC upgrade is a capital project — it needs a business case. The decision is rarely purely technical; it involves production risk, spare-parts cost, functional safety requirements, and integration with new systems.',
        keyPoints: [
          'Hardware obsolescence: CPU discontinued, spare cards unavailable from authorised sources',
          'Capacity: I/O count exceeds maximum expansion, memory full, scan time degraded',
          'Functional safety: new Machinery Directive requires SIL 2 — old CPU not certifiable',
          'Integration: factory MES requires OPC-UA or MQTT — old CPU has no Ethernet port',
          'Total Cost of Ownership: ongoing maintenance cost exceeds a one-time replacement cost',
          'Production window: migrations are easiest during scheduled shutdowns (annual plant turnarounds)',
        ],
      },
      {
        title: '9.2 Migration Paths and Tooling',
        content: 'Siemens provides specific hardware replacements and software tools for each migration path. Using the wrong path increases rework. Always start by identifying the exact source CPU family.',
        keyPoints: [
          'S7-200 (STEP 7 Micro/WIN) → S7-1200: no automatic converter — manual rewrite required',
          'S7-300/400 (STEP 7 Classic) → S7-1500: TIA Migration Tool v17+ gives partial conversion',
          'TIA Migration Tool converts: hardware config, tag table, DB contents, OB/FC/FB structure',
          'TIA Migration Tool does NOT convert: GRAPH (SFC), SCL with system functions, indirect addressing',
          'Logo! 0BA7 → Logo! 0BA8: Logo! Soft Comfort V8 has built-in migration wizard',
          'Third-party (Allen-Bradley, Omron) → Siemens: full manual rewrite; use I/O list as bridge document',
        ],
      },
      {
        title: '9.3 Converting an Existing Project',
        content: 'Even with the Migration Tool, expect 20–40 % of the converted code to need manual inspection and correction. The tool creates placeholders for unresolved instructions — find them all before commissioning.',
        keyPoints: [
          'Step 1: Export STEP 7 project to SEA file; import into TIA Portal via Migration Tool',
          'Step 2: Compile — every red error must be resolved before download',
          'Step 3: Search for "TODO" comments — these mark instructions the tool could not convert',
          'Step 4: Verify all DB offsets — S7-300 optimised DBs differ from S7-1500 standard DBs',
          'Step 5: Update HMI tags — addresses may have shifted after conversion',
          'Step 6: Run full simulation in PLCSIM Advanced before touching hardware',
        ],
        note: 'Keep the original STEP 7 project archived and the old CPU on a shelf — you may need to revert during commissioning.',
      },
      {
        title: '9.4 Planning and Risk Management',
        content: 'A migration on a live production line carries significant risk. Structured risk management — identifying what can go wrong, rating severity × likelihood, and defining mitigations — is what separates a professional project from a gamble.',
        keyPoints: [
          'Risk register: list each risk, rate 1–5 for severity and likelihood, define mitigation and owner',
          'Top risks: program logic error causes machine damage, field wiring mistake causes personnel injury',
          'Mitigation: PLCSIM full simulation, IO simulation panel, dry-run with no loads energised',
          'Rollback plan: keep old CPU in panel on spare DIN rail; define the 15-minute swap-back procedure',
          'Acceptance criteria: all I/O tested point-by-point, all interlocks verified, 4-hour fault-free run',
          'Operator training: minimum 2-hour walkthrough of new HMI screens before go-live',
        ],
      },
    ],
    review: [
      'List three business reasons (not technical) that would justify an S7-300 migration project.',
      'What does the TIA Migration Tool convert automatically, and what must be reworked manually?',
      'You are migrating an S7-200 system. Why is there no automatic conversion tool, and what document do you use as your starting point?',
      'Define "rollback procedure" in the context of a PLC migration. What should it contain?',
      'Write three acceptance criteria for a conveyor system PLC migration go-live decision.',
    ],
  },

};

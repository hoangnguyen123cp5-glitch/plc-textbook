module.exports = {
  overview: "Procuring a PLC is straightforward; engineering an industrial-grade, reliable, and maintainable automation control system requires a disciplined methodology. This lesson guides students through the complete engineering lifecycle from initial customer functional requirements to device selection, master I/O scheduling, 24VDC power budgeting, electrical schematic design, modular programming, hardware expansion (digital and analog SM modules), and systematic commissioning troubleshooting. Every phase produces formalized engineering deliverables—I/O lists, bills of materials (BOM), panel wiring schematics, and test protocols—that constitute professional automation practice.",
  objectives: [
    "Translate a written functional plant specification into a fully quantified Master I/O Schedule with 20% engineering spare capacity",
    "Calculate 24VDC system power budgets and select the optimal S7-1200 CPU, power supply, and expansion modules",
    "Design electrical schematics and panel layout drawings following international standards (IEC 60204-1)",
    "Structure modular PLC programs utilizing state machine architectures, Organization Blocks, Functions (FC), and Function Blocks (FB)",
    "Mechanically attach, address, and parameterize digital expansion modules (SM 1221 DI, SM 1222 DO) in TIA Portal",
    "Configure analog expansion modules (SM 1231 AI, SM 1232 AQ) with hardware noise filtering and channel diagnostics",
    "Execute systematic fault troubleshooting using multimeters, CPU diagnostic buffers, Watch Tables, and signal tracing protocols"
  ],
  sections: [
    {
      title: "6.1 Analysing Requirements and Selecting Devices",
      content: "The engineering lifecycle begins with analyzing the customer's functional process specification and translating prose descriptions into a formalized Master I/O Schedule. Every sensor, limit switch, pushbutton, solenoid valve, contactor, and analog transmitter must be enumerated with its physical location, voltage rating, signal format (e.g. 24VDC discrete, 4–20mA analog), and functional description. Professional engineering rules require adding a minimum of 20% spare capacity across all I/O types to accommodate field modifications during commissioning and future plant expansions. Once the total I/O count is established, the engineer calculates the 24VDC system power budget: summing the quiescent current of the CPU, the backplane consumption of expansion cards, and the external load currents drawn by inductive coils, sensors, and indicator lamps. This calculation determines the sizing of the 24VDC regulated power supply (e.g. SITOP PSU 24V/5A or 10A). The CPU model is selected based on work memory requirements, communication interfaces, and backplane expansion slots (e.g. selecting CPU 1214C to support up to 8 SM modules).",
      keyPoints: [
        "Master I/O Schedule Creation: Tabular matrix detailing Tag Name, Address, Signal Type, Electrical Voltage, Location, and Functional Description",
        "20% Engineering Spare Rule: Always specify at least 20% unallocated spare channels on all digital and analog I/O cards for commissioning flexibility",
        "24VDC Power Budget Calculation: Total Current = CPU Internal Bus + Expansion Card Consumption + Total Field Sensor & Solenoid Loads",
        "SITOP Power Supply Sizing: Select industrial regulated switch-mode power supplies (e.g. 24VDC 5A/10A) with minimum 30% thermal headroom",
        "CPU Sizing Criteria: Evaluate user program work memory, communication socket budget, and maximum number of attachable Signal Modules",
        "Bill of Materials (BOM) Generation: Exact Siemens order part numbers (MLFB), quantities, auxiliary circuit breakers, terminal blocks, and wire ducts",
        "Panel Heat Dissipation: Calculate total enclosure thermal dissipation (Watts) to determine required ventilation fans or air conditioning"
      ],
      note: "Never size an industrial 24VDC power supply to 100% of calculated full-load current! Inductive inrush currents from multiple solenoids energizing simultaneously can cause voltage sags below 20.4VDC, triggering instantaneous brownout restarts of the S7-1200 CPU."
    },
    {
      title: "6.2 Designing and Programming the System",
      content: "Once hardware is selected, engineering proceeds into concurrent electrical design and software architecture development. Electrical design produces complete CAD schematic drawings (using tools such as EPLAN Electric P8 or AutoCAD Electrical): power distribution single-line diagrams, emergency stop safety circuits, PLC rack layouts, terminal strip diagrams, and point-to-point field wiring schematics. Concurrently, software development begins with modular process decomposition. Complex automated processes are modeled as finite state machines (FSM) or sequential function charts (SFC / Grafcet), breaking the machine cycle into distinct operational states: Initializing, Ready/Idle, Auto Running, Paused, Manual Jog, and Fault/E-Stop. Programs are structured hierarchically: OB1 invokes specialized Functions (FCs) for stateless math and standard device drivers, and Function Blocks (FBs) with dedicated Instance DBs for complex equipment (pumps, conveyors, pneumatic indexers). Standardized tag naming conventions (e.g. using camelCase or Hungarian notation: 'iStartButton', 'qConveyorMotor', 'rTankTemperature') ensure readability and maintainability.",
      keyPoints: [
        "Electrical CAD Schematics: Formal drawings detailing 3-phase power distribution, 24VDC control rails, PLC terminal pins, and field wiring cables",
        "Finite State Machine (FSM) Architecture: Structures machine logic into explicit states governed by transition conditions, preventing unexpected state jumps",
        "Modular Program Decomposition: Segregates code into functional blocks: FCs for stateless algorithms; FBs for stateful equipment control",
        "Standardized Tag Tables: Define global symbolic tags with consistent prefixes (e.g. di_, do_, ai_, aq_, st_) before writing ladder rungs",
        "Safety Interlock Separation: Hardwired safety relays govern the master control contactors; software rungs provide secondary operational interlocking",
        "HMI Interface Tag Blocks: Dedicated Global Data Blocks consolidate all supervisory setpoints, status words, and alarm bits in contiguous memory",
        "Revision Control and Documentation: Document all block headers with author, date, functional description, and revision change logs"
      ],
      note: "Never write an entire machine program as a single massive ladder rung list inside OB1! Monolithic ladder programs are unmaintainable and dangerous to commission. Always divide the application into modular FCs and FBs representing physical machine subsystems."
    },
    {
      title: "6.3 Connecting Digital Expansion Modules",
      content: "When field discrete I/O counts exceed the on-board capacity of the S7-1200 CPU (e.g. 14 DI / 10 DO on CPU 1214C), Signal Modules (SM) are attached to expand capacity. The S7-1200 architecture supports SM 1221 digital input modules (8 DI or 16 DI 24VDC), SM 1222 digital output modules (8 DO or 16 DO 24VDC transistor or relay), and SM 1223 combination modules (e.g. 8 DI / 8 DO or 16 DI / 16 DO). Expansion modules mount mechanically to the right-hand side of the CPU on the same TS35 DIN rail. Interconnection is established via a high-speed sliding bus connector integrated into the upper-right housing of each module. When pushed to the left, this bus connector mates with the adjacent module's bus receptacle, locking the hardware backplane electrically. In TIA Portal Device View, the engineer drags the matching SM module from the hardware catalog into the adjacent virtual rack slot (Slot 2, Slot 3, etc.). TIA Portal automatically allocates consecutive peripheral byte addresses (e.g. %I2.0–%I3.7 and %Q2.0–%Q3.7) which can be customized in module properties.",
      keyPoints: [
        "Expansion Module Types: SM 1221 (Digital Inputs), SM 1222 (Digital Outputs), SM 1223 (Combination DI/DO)",
        "Mechanical Bus Connector: Slide bus connector on top-right housing slides left to engage the adjacent module's backplane bus securely",
        "Rack Mounting Capacity: CPU 1211C supports 0 SMs; CPU 1212C supports up to 2 SMs; CPU 1214C, 1215C, and 1217C support up to 8 SM modules",
        "Default Address Allocation: First digital SM starts addressing at byte 2 (%I2.0... / %Q2.0...); addresses are fully reconfigurable in TIA Portal",
        "Backplane Power Supply Budget: The CPU delivers up to 1600 mA of 5VDC logic power to the backplane; verify that total SM draw does not exceed CPU limit",
        "External Field Power Wiring: Digital output modules require external 24VDC field power wired to terminal L+ and M to drive physical output loads",
        "Hardware Compilation: Press Ctrl+B to compile hardware configuration; validates rack slot order, address overlap, and power budgets"
      ],
      note: "Always de-energize system power before sliding bus connectors together or separating modules! Mating backplane bus connectors while 24VDC power is applied will trigger backplane bus communication errors and can damage internal CMOS logic transceivers."
    },
    {
      title: "6.4 Connecting Analog Expansion Modules",
      content: "Analog expansion modules are installed when a process requires acquiring multi-channel continuous sensor data or generating analog commands. Available modules include the SM 1231 Analog Input module (4 AI or 8 AI with 13-bit or 16-bit resolution supporting 0–10V, ±10V, 0–20mA, or 4–20mA), the SM 1232 Analog Output module (2 AQ or 4 AQ with 14-bit resolution), the SM 1234 combo module (4 AI / 2 AQ), and specialized SM 1231 RTD and Thermocouple temperature modules. Analog modules attach to the right of the CPU via the sliding bus connector. In TIA Portal, each analog channel is configured individually in the module properties: selecting measurement type (Voltage, Current, or Thermal Sensor), measurement range, and digital interference frequency filtering (50 Hz, 60 Hz, or 400 Hz). The module firmware automatically executes analog-to-digital conversions, filtering out high-frequency electrical noise and updating process image input registers (%IW68, %IW70, etc.) on every scan. Analog output channels (%QW64, %QW66) are similarly configured for 0–10V or 4–20mA and parameterized with safe fallback states in the event of CPU STOP.",
      keyPoints: [
        "Analog Module Catalog: SM 1231 (4AI / 8AI, 13-bit / 16-bit), SM 1232 (2AQ / 4AQ, 14-bit), SM 1234 (4AI / 2AQ), SM 1231 RTD (Pt100/Pt1000), SM 1231 TC",
        "Channel-by-Channel Configuration: In TIA Portal properties, each input channel is parameterized independently for Voltage (0–10V, ±10V) or Current (4–20mA, 0–20mA)",
        "Interference Frequency Suppression: Hardware ADC integration time configured for 50 Hz or 60 Hz to reject AC line hum with >60 dB attenuation",
        "Hardware Diagnostic Interrupts: Enable wire break and low-limit/high-limit alarms directly in hardware properties; triggers OB82 upon loop failure",
        "Analog Output Fallback Strategy: Configure output channels to either hold last value or force to safe zero (0V / 0mA) upon CPU transitioning to STOP",
        "RTD Temperature Measurement: Pt100/Pt1000 sensors wire directly using 2-wire, 3-wire, or 4-wire compensation; raw integer = temperature x 10 (e.g. 250 = 25.0°C)",
        "Shield Connection: Terminate analog cable shields directly to the grounded metal shield bracket supplied with every S7-1200 analog module"
      ],
      note: "When configuring 4–20mA current inputs on an SM 1231 module, always enable the 'Wire Break' diagnostic alarm in TIA Portal. If a field sensor wire is severed, the input current drops below 3.6mA, immediately triggering a diagnostic event in the CPU without requiring complex custom ladder code."
    },
    {
      title: "6.5 Troubleshooting a PLC Control System",
      content: "When an automated machine fails to operate during commissioning or live plant production, the automation engineer must execute a disciplined, systematic troubleshooting protocol rather than guessing. The troubleshooting methodology follows a 5-step hierarchy: Step 1: Physical Power and Safety Inspection. Verify line voltage and 24VDC power supply output with a calibrated multimeter; verify that all hardwired emergency stops and safety gates are closed. Step 2: CPU Front-Panel Status LED Analysis. Inspect RUN/STOP (green=running, amber=stopped), ERROR (flashing red indicates hardware/software fault), and MAINT LEDs. Step 3: Diagnostic Buffer Interrogation. Go online with TIA Portal (Ctrl+M) and open the CPU Diagnostic Buffer; read the timestamped event log to pinpoint the exact failure (e.g. missing expansion card, wire break on channel %IW68, or cycle time exceeded). Step 4: Watch Table and Signal Tracing. Open Watch Tables to monitor live states of inputs and internal state registers; compare physical LED status on the module with software bit values to isolate field wiring breaks from software logic blocks. Step 5: Peripheral Point Testing. Use Force Tables with caution or temporary test rungs to verify physical actuator actuation.",
      keyPoints: [
        "Systematic 5-Step Diagnostic Protocol: Power Rails -> Front-Panel LEDs -> CPU Diagnostic Buffer -> Watch Tables -> Multimeter Signal Tracing",
        "Multimeter Voltage Verification: Measure 24VDC power supply under load (allowable range 20.4V to 28.8V); measure voltage directly across input terminal and 1M",
        "Diagnostic Buffer Log: The primary diagnostic authority; non-volatile event stack recording exact failure descriptions, timestamps, and OB call references",
        "Hardware vs Software Fault Isolation: If an input LED illuminates on the CPU faceplate but the tag in TIA Portal remains FALSE, the issue is software configuration or operating mode",
        "Watch Table Signal Tracing: Real-time monitoring of machine state registers, interlock conditions, and timer elapsed values to pinpoint stalled transitions",
        "Multimeter Resistance Testing: Always de-energize and isolate circuits before measuring loop resistance or testing for contact closure",
        "Preventive Maintenance Protocols: Periodically check terminal screw torque (0.5 Nm), clean enclosure air filters, inspect DC voltage ripple, and maintain backups"
      ],
      note: "Never clear a fault in the CPU Diagnostic Buffer without identifying and resolving its physical root cause! Repeatedly restarting a tripped PLC without fixing an underlying sensor short or motor overload will inevitably lead to hardware component destruction or plant accidents."
    }
  ],
  review: [
    "Explain the purpose of a Master I/O Schedule and state why professional engineering design rules mandate a minimum of 20% spare capacity.",
    "Detail how to calculate the total 24VDC system power budget when selecting a SITOP regulated power supply for an automated machine cell.",
    "What is the functional difference between an Organization Block (OB), a Function (FC), and a Function Block (FB) in a structured control application?",
    "Describe the mechanical and electrical procedure for connecting an SM 1221 digital expansion module to an S7-1200 CPU on a DIN rail.",
    "How does an automation engineer configure an SM 1231 analog input module in TIA Portal to measure a 4–20mA current loop with automated wire-break detection?",
    "Outline the 5-step systematic troubleshooting methodology used to diagnose an automated machine that halts unexpectedly during production.",
    "An input status LED on an S7-1200 CPU illuminates green when a sensor is blocked, but the ladder logic contact does not evaluate TRUE. Explain the possible causes."
  ]
};

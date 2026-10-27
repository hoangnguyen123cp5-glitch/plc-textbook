'use client';

import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// Comprehensive university-level quiz database for all 15 lessons (66 topics)
const QUIZ_DATABASE: Record<string, QuizQuestion[]> = {
  // ── Lesson 01: Programmable Control Fundamentals ──
  'control-system-basics': [
    {
      question: 'Which of the following is NOT one of the 5 fundamental building blocks of an automated control system?',
      options: ['Setpoint / Reference Input', 'Measurement Element / Sensor', 'Operator Coffee Machine', 'Actuator / Final Control Element'],
      correct: 2,
      explanation: 'The 5 universal anatomical blocks of a control system are Setpoint, Sensor, Comparator/Error Detector, Controller, and Actuator.',
    },
    {
      question: 'What is the industrial role of an actuator in a control loop?',
      options: ['To sample physical measurements and produce raw millivolt signals', 'To convert low-power electrical commands into mechanical, thermal, or fluid energy', 'To compile ladder rungs into machine code', 'To store historical audit logs'],
      correct: 1,
      explanation: 'Actuators (e.g. motors, pneumatic cylinders, control valves) translate low-energy electrical controller outputs into physical action.',
    },
  ],
  'loop-types': [
    {
      question: 'How is the mathematical control error e(t) formulated in a closed-loop system?',
      options: ['e(t) = Setpoint (SP) − Process Variable (PV)', 'e(t) = Process Variable (PV) + Setpoint (SP)', 'e(t) = Output Voltage × Current', 'e(t) = Scan Time / 2'],
      correct: 0,
      explanation: 'In negative feedback control, error is strictly the difference between target setpoint and measured process variable: e(t) = SP − PV.',
    },
    {
      question: 'Why is an open-loop system NOT suitable for maintaining an exact chemical vat temperature in variable ambient weather?',
      options: ['Open-loop controllers have slower CPU clock speeds', 'Open-loop systems have zero feedback and cannot detect or compensate for environmental disturbances', 'Open-loop systems require special 3-phase wiring', 'Open-loop controllers cannot run Ladder Logic'],
      correct: 1,
      explanation: 'Because open-loop systems lack feedback sensors, any external disturbance (e.g. cold draft, temperature drop) directly introduces steady-state error.',
    },
  ],
  'hardwired-vs-programmable': [
    {
      question: 'What is the primary operational drawback of hardwired electromechanical relay logic panels?',
      options: ['They are immune to electrical noise', 'Any sequence change requires physical rewiring, scheduled plant shutdowns, and labor-intensive panel modifications', 'They cannot operate on 24VDC', 'They require ethernet switches'],
      correct: 1,
      explanation: 'In hardwired relay panels, the control logic is physically locked in copper wiring; re-sequencing requires costly manual rewiring and downtime.',
    },
  ],
  'why-plc': [
    {
      question: 'How long does a typical control sequence modification take on a modern PLC system?',
      options: ['Several days of wire tracing and contact replacement', 'A few seconds to minutes via software download over PROFINET, with zero wiring changes', 'At least 48 hours for CPU reboot', 'It requires replacing the entire CPU unit'],
      correct: 1,
      explanation: 'Because PLC inputs and outputs are software-addressed, modifying interlocking logic is accomplished instantaneously in TIA Portal without touching physical cables.',
    },
  ],
  'defining-plc': [
    {
      question: 'What was the breakthrough commercial PLC developed in 1969 to satisfy General Motors Hydramatic specifications?',
      options: ['Siemens S7-1500', 'Modicon 084 (designed by Dick Morley)', 'Intel 8086', 'Raspberry Pi Industrial'],
      correct: 1,
      explanation: 'The Modicon 084, engineered by Dick Morley in 1969, met GM Hydramatic specifications and launched the modern commercial PLC industry.',
    },
  ],
  'plc-structure': [
    {
      question: 'Why are optical isolators (optocouplers) universally installed on PLC digital input channels?',
      options: ['To speed up CPU clock frequency', 'To electrically decouple sensitive 3.3V/5V microprocessor electronics from high-voltage 24V/230V plant field transients', 'To convert digital signals into analog signals', 'To save memory space'],
      correct: 1,
      explanation: 'Optocouplers isolate field wiring from CPU logic using light transmission, protecting silicon microchips against plant ground loops and voltage surges.',
    },
  ],
  'memory-and-leds': [
    {
      question: 'Which S7-1200 memory area preserves critical production tags across an unpowered plant shutdown without a battery?',
      options: ['Work Memory', 'Retentive Memory (NVRAM backed by supercapacitor)', 'Temporary Local Stack (L)', 'Web Server Cache'],
      correct: 1,
      explanation: 'Retentive Memory uses non-volatile NVRAM backed by an internal supercapacitor to safeguard critical recipe tags, counts, and states during power outages.',
    },
    {
      question: 'What does a solid yellow/amber RUN/STOP LED indicate on an S7-1200 CPU front panel?',
      options: ['The CPU is in RUN mode executing OB1', 'The CPU is in STOP mode and user program execution is halted', 'A fatal hardware fault has occurred', 'Firmware update is in progress'],
      correct: 1,
      explanation: 'Green indicates RUN mode; solid yellow indicates STOP mode; flashing red indicates a diagnostic error.',
    },
  ],
  'scan-cycle': [
    {
      question: 'During which phase of the PLC scan cycle are physical output screw terminals updated?',
      options: ['Phase 1: Input Scan', 'Phase 2: Program Execution', 'Phase 3: Housekeeping & Comms', 'Phase 4: Output Scan (from PIQ table)'],
      correct: 3,
      explanation: 'The CPU writes the entire contents of the Process Image Output (PIQ) table to the physical output hardware simultaneously during Phase 4.',
    },
    {
      question: 'What occurs if an input pulse duration is 0.5 ms while the PLC scan cycle time is 10 ms?',
      options: ['The CPU automatically stretches the pulse', 'The input pulse may be completely missed unless a High-Speed Counter (HSC) or interrupt is used', 'The CPU trips into STOP mode', 'The pulse is buffered in Load Memory'],
      correct: 1,
      explanation: 'Because standard inputs are only sampled once per scan cycle (Phase 1), transient pulses shorter than the cycle time are completely aliased and lost.',
    },
  ],
  'languages-structure': [
    {
      question: 'Which IEC 61131-3 programming language resembles high-level Pascal and is best suited for complex math and data algorithms?',
      options: ['Ladder Diagram (LAD)', 'Structured Text / SCL (Structured Control Language)', 'Function Block Diagram (FBD)', 'Instruction List (IL/STL)'],
      correct: 1,
      explanation: 'Structured Text (SCL in Siemens) provides high-level algorithmic control (FOR loops, IF-THEN-ELSE, math arrays) ideal for complex data processing.',
    },
  ],

  // ── Lesson 02: S7-1200 Hardware and TIA Portal ──
  's7-1200-device': [
    {
      question: 'What is the main physical difference between a Signal Board (SB) and a Signal Module (SM) on the S7-1200?',
      options: ['Signal Boards mount directly on the CPU front face without increasing width; Signal Modules expand to the right via the backplane slide connector', 'Signal Boards only work on 120VAC', 'Signal Modules cannot handle analog signals', 'Signal Boards require a separate power supply'],
      correct: 0,
      explanation: 'An SB plugs directly into the CPU front pocket (preserving physical DIN-rail width), while SM modules snap on the right side of the rack.',
    },
  ],
  'program-processing': [
    {
      question: 'What is the fundamental difference between an FC (Function) and an FB (Function Block) in TIA Portal?',
      options: ['An FC has its own instance Data Block (DB); an FB does not', 'An FB requires an Instance Data Block to store static internal tags across scans; an FC has no persistent memory', 'FCs can only be written in STL', 'FBs cannot accept input parameters'],
      correct: 1,
      explanation: 'FBs retain static variable memory between scan cycles via their dedicated Instance DB; FCs are stateless and discard temporary tags after execution.',
    },
  ],
  'field-wiring': [
    {
      question: 'In a standard European Sinking Digital Input configuration (PNP sensor compatible), what voltage is connected to common terminal 1M?',
      options: ['+24VDC (L+)', '0VDC (M)', '120VAC Neutral', 'Protective Earth (PE) only'],
      correct: 1,
      explanation: 'In a Sinking DI circuit, terminal 1M is bonded to 0VDC (M). External PNP sensors switch positive +24VDC into the input channels (%I0.0–%I1.5).',
    },
    {
      question: 'Why must reverse-biased freewheeling diodes be connected across DC solenoid coils?',
      options: ['To increase solenoid actuation speed', 'To suppress destructive high-voltage inductive kickback spikes when de-energized', 'To convert AC power into DC power', 'To provide thermal overload protection'],
      correct: 1,
      explanation: 'When a DC inductive coil de-energizes, the collapsing magnetic field induces negative spikes exceeding 400V. A flyback diode dissipates this surge safely.',
    },
  ],
  'verify-wiring': [
    {
      question: 'Which tool in TIA Portal allows real-time monitoring and safe forcing of individual I/O bits during field commissioning?',
      options: ['Watch Table', 'Project Archiver', 'License Manager', 'Compiler Options'],
      correct: 0,
      explanation: 'Watch Tables enable engineers to view live boolean/integer values of %I, %Q, and %M tags directly during electrical checkout.',
    },
  ],
  'install-tia': [
    {
      question: 'Which Siemens utility manages license keys for STEP 7 and WinCC?',
      options: ['Automation License Manager (ALM)', 'SIMATIC S7-PLCSIM', 'Proneta Professional', 'TIA Portal Updater'],
      correct: 0,
      explanation: 'Siemens Automation License Manager (ALM) handles activation, transfer, and verification of software licenses.',
    },
  ],
  'using-tia': [
    {
      question: 'What is the purpose of "Accessible Devices" scan in TIA Portal?',
      options: ['To detect and display any active Siemens hardware on the PROFINET subnet via MAC broadcast, even if its IP is on a different subnet', 'To compile the PLC code', 'To download safety passwords', 'To calculate electrical power draw'],
      correct: 0,
      explanation: 'Accessible Devices sends Layer-2 DCP discovery broadcasts to find connected CPUs and HMIs regardless of current IP configuration.',
    },
  ],
  'comms-setup': [
    {
      question: 'What industrial Ethernet protocol is the default standard for Siemens S7-1200/1500 inter-device networking?',
      options: ['Modbus ASCII', 'PROFINET (Deterministic Industrial Ethernet)', 'DeviceNet', 'DH+'],
      correct: 1,
      explanation: 'PROFINET is Siemens flagship open industrial Ethernet standard for real-time cyclic I/O data and engineering access.',
    },
  ],

  // ── Lesson 03: Binary Operations ──
  'logic-links': [
    {
      question: 'In Ladder Diagram, placing contacts in parallel branches executes which Boolean operation?',
      options: ['Boolean AND', 'Boolean OR', 'Boolean NOT', 'Boolean NAND'],
      correct: 1,
      explanation: 'Parallel branches create alternative conduction paths: virtual power flow passes if either Branch A OR Branch B evaluates to TRUE.',
    },
    {
      question: 'If a physical emergency stop button is Normally Closed (NC), what contact symbol must be used in your ladder rung?',
      options: ['Normally Closed contact (---[/]---)', 'Normally Open contact (---[ ]---)', 'Negated output coil (---(/)---)', 'Set coil (---(S)---)'],
      correct: 1,
      explanation: 'In its normal healthy state, the NC E-Stop delivers +24V (logic 1) to the input. An NO ladder contact (---[ ]---) examines for logic 1 and conducts power flow safely.',
    },
  ],
  'set-reset': [
    {
      question: 'What is the key characteristic of a Reset-Dominant Latch (RS flip-flop) instruction?',
      options: ['If both Set (S) and Reset (R1) are TRUE simultaneously, the output Q resolves to FALSE (0)', 'The output remains permanently ON', 'It only works with analog tags', 'It resets the CPU hardware clock'],
      correct: 0,
      explanation: 'In safety-critical design, Reset Dominance ensures that an active STOP/RESET command always overrides a START command if both trigger together.',
    },
  ],
  'timers': [
    {
      question: 'What happens to the elapsed time (ET) of a standard IEC TON (On-Delay) timer if input IN goes FALSE before PT expires?',
      options: ['ET pauses and retains its current value', 'ET immediately resets to 0 ms and output Q remains FALSE', 'Output Q turns ON immediately', 'The CPU generates a hardware interrupt'],
      correct: 1,
      explanation: 'A standard TON timer requires an uninterrupted TRUE signal on IN for the entire Preset Time (PT); if IN drops to FALSE early, ET resets to zero immediately.',
    },
  ],
  'counters': [
    {
      question: 'What triggers an IEC CTU (Count Up) counter block to increment its Current Value (CV)?',
      options: ['A continuous HIGH level on CU', 'A rising edge (0 to 1 transition) on input CU', 'A falling edge (1 to 0 transition) on CU', 'A CPU scan cycle tick'],
      correct: 1,
      explanation: 'IEC counters are edge-triggered: they increment only when a positive 0-to-1 rising edge occurs on the count input.',
    },
  ],
  'binary-application': [
    {
      question: 'In a conveyor latch seal-in circuit, why is the STOP contact wired in series before the START parallel branch?',
      options: ['To provide immediate power cut-off that breaks the seal-in loop unconditionally', 'To increase motor speed', 'To prevent contact bounce', 'To save one memory byte'],
      correct: 0,
      explanation: 'Placing the STOP contact in series ensures that opening the stop circuit immediately breaks both the start and the auxiliary hold-in contact paths.',
    },
  ],

  // ── Lesson 04: Numeric Operations ──
  'data-space': [
    {
      question: 'How many bits and what numerical range is represented by an S7-1200 signed INT data type?',
      options: ['8 bits (−128 to +127)', '16 bits (−32,768 to +32,767)', '32 bits (0 to 4,294,967,295)', '64 bits (IEEE Double)'],
      correct: 1,
      explanation: 'A 16-bit signed INT uses two-complement representation spanning −32,768 to +32,767.',
    },
  ],
  'comparison': [
    {
      question: 'How is a range/window comparison (e.g. 10.0 <= Temperature <= 50.0) implemented in Ladder logic?',
      options: ['By placing two comparison contacts (>= 10.0 and <= 50.0) in series', 'By placing two comparison contacts in parallel', 'By using a Math ADD block', 'By using a SHL instruction'],
      correct: 0,
      explanation: 'Series contacts represent Boolean AND: power flows only when the value is both greater than/equal to MIN AND less than/equal to MAX.',
    },
  ],
  'rotate-shift': [
    {
      question: 'What bit instruction is typically used to track parts moving along a multi-station index table or conveyor belt?',
      options: ['SHL / SHR (Shift Left / Right) register bit tracking', 'DTL real-time clock', 'SQRT math block', 'TOF timer'],
      correct: 0,
      explanation: 'Shift registers (SHL/SHR) shift bits synchronously with conveyor index pulses, tracking part inspection results across workstations.',
    },
  ],
  'math-functions': [
    {
      question: 'What occurs if an integer division (DIV) instruction executes with an input value of 0 in the divisor?',
      options: ['The result is safely set to 9999', 'A division-by-zero math fault triggers; without an error handler, the CPU may enter STOP mode', 'The CPU ignores the instruction', 'The divisor is automatically incremented to 1'],
      correct: 1,
      explanation: 'Division by zero is an illegal arithmetic condition that sets system error flags and can halt CPU execution.',
    },
  ],
  'real-time-clock': [
    {
      question: 'What Siemens system data type structure holds complete Date and Time (Year, Month, Day, Hour, Minute, Second, Nanosecond)?',
      options: ['TIME', 'DTL (Date and Time Long)', 'SINT', 'LWORD'],
      correct: 1,
      explanation: 'DTL is a 12-byte structured data type holding year (UINT), month (USINT), day, weekday, hour, minute, second, and nanoseconds.',
    },
  ],

  // ── Lesson 05: Analog Signals ──
  'analog-signals': [
    {
      question: 'Why is a 4–20mA current loop preferred over 0–10V signals in noisy factory environments?',
      options: ['Current loops are immune to lead-wire resistance voltage drop and permit "live zero" wire-break detection at 0mA', '0–10V cannot be sampled by PLCs', '4–20mA requires no power supply', 'Current loops have higher bandwidth than Ethernet'],
      correct: 0,
      explanation: 'In 4–20mA loops, current is identical everywhere regardless of cable length, and any signal below 4mA (0mA) immediately flags a broken cable.',
    },
  ],
  'analog-wiring': [
    {
      question: 'How must the shield of an analog signal cable be grounded to prevent ground loops?',
      options: ['Ground both ends securely to separate machine frames', 'Ground the shield at only ONE end (typically at the PLC cabinet side) to an equipotential PE busbar', 'Leave the shield disconnected at both ends', 'Connect the shield to 24VDC positive'],
      correct: 1,
      explanation: 'Grounding analog shields at a single point prevents circulating noise currents caused by earth potential differences between distant plant locations.',
    },
  ],
  'analog-modules': [
    {
      question: 'What raw integer range represents nominal 0–10V or 4–20mA in standard Siemens S7-1200 analog input channels?',
      options: ['0 to 1024', '0 to 4095', '0 to 27648', '0 to 65535'],
      correct: 2,
      explanation: 'Siemens standardizes the full nominal analog scale to 0–27648 counts across all 12-bit, 13-bit, and 16-bit analog input cards.',
    },
  ],
  'norm-scale': [
    {
      question: 'What is the output range of the NORM_X instruction in TIA Portal?',
      options: ['A normalized REAL number between 0.0 and 1.0', 'An integer between 0 and 27648', 'A temperature in Celsius', 'A current in milliamperes'],
      correct: 0,
      explanation: 'NORM_X performs linear normalization: OUT = (VALUE − MIN) / (MAX − MIN), yielding a dimensionless ratio from 0.0 to 1.0.',
    },
    {
      question: 'To convert a raw sensor count (0–27648) into a 0.0–150.0°C temperature, what sequence of blocks is standard?',
      options: ['SCALE_X followed by NORM_X', 'NORM_X (converting raw to 0.0–1.0) followed by SCALE_X (converting 0.0–1.0 to 0.0–150.0°C)', 'DIV block only', 'TON timer block'],
      correct: 1,
      explanation: 'The standard Siemens analog pipeline chains NORM_X (raw integer to 0.0–1.0 REAL) directly into SCALE_X (0.0–1.0 REAL to engineering units).',
    },
  ],

  // ── Lesson 06: PLC Platforms Beyond Siemens ──
  'omron-mitsubishi': [
    {
      question: 'In Mitsubishi MELSEC FX PLCs, what addressing prefixes denote physical digital inputs and physical digital outputs?',
      options: ['%I and %Q', 'X for physical inputs and Y for physical outputs', 'D and M', 'IN and OUT'],
      correct: 1,
      explanation: 'Mitsubishi uses octal addressing prefixed by X for inputs (X0, X1...) and Y for outputs (Y0, Y1...).',
    },
  ],
  'io-circuits': [
    {
      question: 'When wiring an NPN (sinking output) proximity sensor to a PLC input, how must the PLC common terminal be biased?',
      options: ['Common terminal must be connected to +24VDC (sourcing input circuit)', 'Common terminal must be connected to 0VDC', 'Common terminal must be connected to Earth', 'Common terminal is left floating'],
      correct: 0,
      explanation: 'An NPN sensor pulls the signal pin to 0VDC; therefore, the PLC input circuit must source current from +24VDC through its common terminal.',
    },
  ],
  'programming-console': [
    {
      question: 'What instruction mnemonic is used on legacy handheld consoles to start a new ladder rung from the power rail?',
      options: ['LOAD (LD)', 'OUT', 'AND', 'OR'],
      correct: 0,
      explanation: 'The LD (Load) mnemonic loads a contact directly connected to the left power rail.',
    },
  ],
  'ladder-diagram': [
    {
      question: 'What is mandatory at the end of every user program in Mitsubishi FX ladder programming?',
      options: ['An END instruction rung', 'A STOP coil', 'A RESET block', 'A comment line'],
      correct: 0,
      explanation: 'The CPU requires the END instruction to mark the termination of cyclic code execution and initiate the I/O refresh phase.',
    },
  ],
  'common-instructions': [
    {
      question: 'What is the function of a Master Control Relay (MC / MCR) zone in PLC programming?',
      options: ['To de-energize and inhibit an entire block of rungs simultaneously when a master condition is FALSE', 'To measure CPU temperature', 'To communicate with SCADA', 'To reset the timer prescaler'],
      correct: 0,
      explanation: 'MCR zones permit a single master contact to disable all non-retentive coils inside the zone, functioning as an operational sub-master.',
    },
  ],

  // ── Lesson 07: System Design ──
  'device-selection': [
    {
      question: 'What standard safety engineering margin should be reserved for spare I/O channels when specifying a new PLC panel?',
      options: ['0% (exact count)', 'At least 15% to 20% spare capacity', '100% spare modules', '50% spare CPUs'],
      correct: 1,
      explanation: 'Good automation engineering practices dictate reserving 15–20% spare I/O terminals and cabinet DIN rail space for future plant expansions.',
    },
  ],
  'design-program': [
    {
      question: 'Why should complex machine sequences be modeled as a Finite State Machine (FSM) before writing ladder rungs?',
      options: ['To guarantee only one defined state is active at a time and eliminate race conditions and latch lockups', 'To reduce PLC cost', 'Because TIA Portal cannot compile ladder without it', 'To invert the AC supply phase'],
      correct: 0,
      explanation: 'State machines provide deterministic, predictable execution where state transitions occur only when strict safety and process criteria are met.',
    },
  ],
  'digital-expansion': [
    {
      question: 'How are SM 1221 digital expansion modules mechanically connected to the S7-1200 CPU backplane?',
      options: ['Via an integrated slide bus connector on the top right side that clicks firmly into place', 'Using external USB cables', 'Through wireless Bluetooth', 'Using RS232 null modem cables'],
      correct: 0,
      explanation: 'S7-1200 modules dock side-by-side on the DIN rail and interlock via an integrated top slide connector that forms the backplane bus.',
    },
  ],
  'analog-expansion': [
    {
      question: 'What happens to the total 5VDC backplane current budget when adding multiple analog expansion cards?',
      options: ['The CPU internal 5V supply provides up to ~1400–1600mA; if module draw exceeds this, an expansion power supply or decoupling must be used', 'Analog modules produce their own 5V power', 'Backplane power is unlimited', 'Backplane voltage drops to 0V'],
      correct: 0,
      explanation: 'The CPU internal backplane regulator has a strict maximum mA capacity; designers must sum the backplane current draw of all attached cards.',
    },
  ],
  'fault-handling': [
    {
      question: 'What is the first step in systematic troubleshooting when an automated machine stops unexpectedly?',
      options: ['Immediately rewrite the PLC program', 'Observe CPU status LEDs (RUN, ERROR, MAINT) and consult the TIA Portal Diagnostic Buffer', 'Replace all proximity sensors', 'Power cycle the factory substation'],
      correct: 1,
      explanation: 'The diagnostic buffer logs exact hardware events, timestamped wire breaks, and fault OB calls, pinpointing the root cause in seconds.',
    },
  ],

  // ── Lesson 08: Advanced Instructions ──
  'time-instructions': [
    {
      question: 'Which organization block executes automatically at a specific scheduled time of day (e.g. daily at 02:00)?',
      options: ['OB1 (Main Cycle)', 'OB10 (Time-of-Day Interrupt)', 'OB82 (Diagnostic Interrupt)', 'OB100 (Startup)'],
      correct: 1,
      explanation: 'OB10 is a Time-of-Day interrupt configured to execute periodically at exact calendar dates or daily scheduled timestamps.',
    },
  ],
  'string-instructions': [
    {
      question: 'In Siemens S7 string architecture, what is stored in Byte 0 and Byte 1 of a STRING variable?',
      options: ['The first two ASCII characters', 'Byte 0: Maximum declared length; Byte 1: Current actual string length', 'A checksum and parity bit', 'The CPU serial number'],
      correct: 1,
      explanation: 'Siemens strings use a 2-byte header: the first byte defines allocated capacity, and the second byte holds the actual character count.',
    },
  ],
  'interrupt-instructions': [
    {
      question: 'Why are Hardware Edge Interrupts (OB40) essential for high-speed part rejection sensors on bottling lines?',
      options: ['OB40 immediately preempts OB1 to respond within microseconds, bypassing the delay of the normal cyclic scan', 'OB40 uses less electrical energy', 'OB40 increases memory capacity', 'OB40 operates without sensors'],
      correct: 0,
      explanation: 'Hardware interrupts trigger instantly on electrical signal edges, ensuring zero-latency response for high-speed sorting mechanisms.',
    },
  ],

  // ── Lesson 09: High-Speed Counting ──
  'encoder-basics': [
    {
      question: 'Why are the A and B pulse channels of an incremental optical encoder shifted by 90 electrical degrees (quadrature)?',
      options: ['To allow the controller to determine both rotation speed and direction of rotation', 'To double the supply voltage', 'To provide electrical redundancy', 'To reduce mechanical vibration'],
      correct: 0,
      explanation: 'Phase quadrature allows phase detection: if A leads B, rotation is clockwise; if B leads A, rotation is counter-clockwise.',
    },
  ],
  'high-speed-counter': [
    {
      question: 'Why cannot standard digital input addresses (%I0.0) be used in ladder logic to count 50 kHz encoder pulses?',
      options: ['Because the normal PLC scan cycle (5–20 ms) is far too slow and will alias/miss virtually 100% of the pulses', 'Because encoders only output analog signals', 'Because 50 kHz trips the circuit breaker', 'Because Ladder logic does not support integers'],
      correct: 0,
      explanation: 'A 50 kHz pulse arrives every 20 microseconds; a 10 ms CPU scan would skip 500 pulses per cycle without dedicated HSC hardware.',
    },
  ],
  'pwm-output': [
    {
      question: 'What parameter of a Pulse Width Modulation (PWM) signal is modulated to control the power delivered to a DC heater or motor?',
      options: ['Carrier frequency', 'Duty cycle (ratio of ON time to total period)', 'Output voltage amplitude', 'Phase shift'],
      correct: 1,
      explanation: 'PWM holds frequency constant while modulating the duty cycle percentage (0% to 100%) to vary the average power transferred.',
    },
  ],
  'motion-control': [
    {
      question: 'Which PLCopen standard motion control block is executed to power and enable a servo axis before motion commands can run?',
      options: ['MC_Power', 'MC_MoveAbsolute', 'MC_Halt', 'MC_Reset'],
      correct: 0,
      explanation: 'MC_Power energizes the drive power stage, closes the internal position loop, and sets the axis status to Enabled.',
    },
  ],
  'analog-in-motion': [
    {
      question: 'What analog signal format is conventionally used to command bidirectional velocity on AC Variable Frequency Drives?',
      options: ['0–10V unipolar', '±10V bipolar voltage signal', '0–20mA current loop', '5V TTL logic'],
      correct: 1,
      explanation: 'A ±10V bipolar command represents full reverse speed at −10V, standstill at 0V, and full forward speed at +10V.',
    },
  ],

  // ── Lesson 10: Closed-Loop Control with PID ──
  'closed-loop-design': [
    {
      question: 'What is the role of the Integral (I) term in a standard PID controller algorithm?',
      options: ['To eliminate steady-state error by continuously accumulating error over time', 'To predict future trends based on error rate of change', 'To provide instantaneous reaction proportional to error', 'To filter out measurement noise'],
      correct: 0,
      explanation: 'The integral action integrates the error over time, forcing control effort to increase until steady-state error is driven precisely to zero.',
    },
  ],
  'pid-compact': [
    {
      question: 'Why must the PID_Compact Technology Object be called inside a Cyclic Interrupt (OB30) rather than OB1?',
      options: ['Because OB1 cannot process floating-point REAL numbers', 'To ensure a strictly deterministic, jitter-free sampling time (Ts) required for mathematical integration and derivation', 'To prevent the CPU from running out of load memory', 'Because OB30 executes with lower priority than communications'],
      correct: 1,
      explanation: 'Discrete PID algorithms assume a constant sampling interval (Ts). Variations in OB1 cycle scan time would introduce calculation jitter and loop instability.',
    },
  ],
  'pid-tuning': [
    {
      question: 'In TIA Portal PID Commissioning, what is the difference between Pre-Tuning and Fine-Tuning?',
      options: ['Pre-Tuning applies an open-loop step change to identify plant parameters; Fine-Tuning tunes closed-loop oscillation response near the setpoint', 'Pre-Tuning is for AC motors; Fine-Tuning is for DC motors', 'Pre-Tuning requires a licensed USB dongle', 'There is no difference'],
      correct: 0,
      explanation: 'Pre-tuning calculates baseline PID parameters via step inflection; Fine-tuning optimizes overshoot, damping, and settling time under active closed-loop feedback.',
    },
  ],

  // ── Lesson 11: Communication Protocols ──
  'point-to-point': [
    {
      question: 'What value of terminating resistor must be installed at both physical ends of an RS485 Modbus RTU daisy-chain cable?',
      options: ['10 ohms', '120 ohms', '10,000 ohms', 'No resistor is required'],
      correct: 1,
      explanation: 'A 120-ohm terminating resistor matches the characteristic impedance of standard shielded twisted-pair cables to eliminate signal reflections.',
    },
  ],
  'profinet-profibus': [
    {
      question: 'What is the primary architectural advantage of PROFINET Industrial Ethernet over legacy PROFIBUS-DP?',
      options: ['100 Mbps to 1 Gbps full-duplex bandwidth, standard CAT5e/CAT6 RJ45 cabling, integrated IT web services, and ring redundancy (MRP)', 'PROFINET does not use IP addresses', 'PROFINET requires purple serial cables', 'PROFINET runs on 9V batteries'],
      correct: 0,
      explanation: 'PROFINET combines high-speed real-time determinism with ubiquitous Ethernet hardware, fiber optic media, and enterprise network integration.',
    },
  ],

  // ── Lesson 12: Fault Diagnostic Tools ──
  'diagnostic-overview': [
    {
      question: 'What does a red exclamation mark badge on an S7-1200 module icon in the TIA Portal hardware tree signify?',
      options: ['The module is operating normally', 'A hardware or communication fault has occurred on that specific module (e.g. wire break, missing 24V supply)', 'A software update is recommended', 'The module is in simulation mode'],
      correct: 1,
      explanation: 'TIA Portal overlays diagnostic status icons directly on hardware topologies, allowing instant identification of faulted channels.',
    },
  ],
  'diagnostic-buffer': [
    {
      question: 'How is event information organized inside the CPU Diagnostic Buffer?',
      options: ['Chronologically with precise millisecond timestamps, operating state transitions, and hexadecimal event codes', 'Alphabetically by tag name', 'Grouped by ladder rung number', 'Randomly'],
      correct: 0,
      explanation: 'The diagnostic buffer is a ring buffer recording system events, OB executions, wire breaks, and power losses in strict chronological sequence.',
    },
  ],
  'watch-force-tables': [
    {
      question: 'What makes the Force Table significantly more hazardous than the Watch Table during plant operations?',
      options: ['The Force Table overrides physical I/O at the hardware peripheral layer, bypassing user program safety interlocks and remaining active across CPU restarts', 'The Force Table deletes the program', 'The Force Table disconnects the power supply', 'The Force Table only runs on Tuesdays'],
      correct: 0,
      explanation: 'Forcing locks peripheral addresses at the hardware boundary; mechanical safety limits can be bypassed, requiring extreme caution and physical panel supervision.',
    },
  ],

  // ── Lesson 13: SIMATIC S7-300 Overview ──
  's7-300-overview': [
    {
      question: 'How are I/O modules mechanically connected to the backplane bus on a SIMATIC S7-300 rack?',
      options: ['Using flexible ribbon cables', 'Via small black U-shaped backplane bus connectors plugged into the rear of adjacent modules on the aluminum DIN rail', 'Through wireless RF tags', 'Using standard RJ45 patch cords'],
      correct: 1,
      explanation: 'S7-300 modules click together via U-shaped bus connectors that slide into rear sockets, linking the internal address and data buses across the rail.',
    },
  ],
  's7-300-instructions': [
    {
      question: 'In S7-300 Statement List (STL / AWL), what CPU registers hold numerical values for arithmetic operations?',
      options: ['ACCU1 and ACCU2 (32-bit Accumulators)', 'The Graphic Card Framebuffer', 'The PROFINET PHY Chip', 'The Flash Memory Card'],
      correct: 0,
      explanation: 'S7-300 CPUs utilize two 32-bit accumulators (ACCU1 and ACCU2) with load (L) and transfer (T) operations for numerical manipulation.',
    },
  ],
  's7-300-applications': [
    {
      question: 'What distinctive purple shielded cable is universally associated with S7-300 distributed I/O (ET 200M)?',
      options: ['PROFIBUS-DP RS485 shielded twisted pair', 'Flat ribbon telephone wire', 'Yellow AS-Interface ribbon', 'Coaxial television cable'],
      correct: 0,
      explanation: 'Standard PROFIBUS-DP cables feature an unmistakable violet/purple outer jacket with special high-frequency shielding and 9-pin Sub-D connectors.',
    },
  ],

  // ── Lesson 14: Upgrading Legacy PLC Systems ──
  'why-upgrade': [
    {
      question: 'What is the primary business risk of maintaining obsolete legacy PLCs (e.g. S7-200 or S7-300) in 24/7 manufacturing plants?',
      options: ['Spare modules are no longer manufactured, leading to exorbitant secondary-market prices and catastrophic prolonged downtime in the event of a failure', 'Modern programming software will not run on Windows 11', 'The CPUs run out of serial numbers', 'Ethernet switches refuse to connect to them'],
      correct: 0,
      explanation: 'When manufacturers declare hardware mature/discontinued, replacement modules become scarce, risking weeks of catastrophic production line stoppage.',
    },
  ],
  'migration-paths': [
    {
      question: 'What is the direct, officially recommended Siemens migration path for legacy S7-300 automation systems?',
      options: ['Upgrade to SIMATIC S7-1500 and TIA Portal', 'Downgrade to S7-200', 'Replace with relays', 'Switch to standard Arduino boards'],
      correct: 0,
      explanation: 'The SIMATIC S7-1500 family is the direct technological successor to the S7-300, delivering high-speed backplane communication and seamless TIA integration.',
    },
  ],
  'project-conversion': [
    {
      question: 'What tool does Siemens provide to migrate classic STEP 7 V5.x projects into TIA Portal?',
      options: ['TIA Portal Project Migration Tool (*.s7p conversion)', 'Windows Media Player', 'AutoCAD Electrical', 'Notepad++'],
      correct: 0,
      explanation: 'The Migration Tool parses legacy STEP 7 V5.x project files (*.s7p), converting hardware configurations and user blocks into TIA Portal format.',
    },
  ],
  'upgrade-risks': [
    {
      question: 'Why do automation engineers mandate a pre-planned "15-minute rollback protocol" during plant upgrade shutdowns?',
      options: ['To ensure the original working legacy system can be safely reconnected and restored before production start if unexpected commissioning hurdles occur', 'To avoid paying overtime to electricians', 'Because batteries expire after 15 minutes', 'To reset the fire alarm'],
      correct: 0,
      explanation: 'A rigorous rollback procedure guarantees that if a newly installed PLC encounters insurmountable commissioning bugs, the factory can resume production on time.',
    },
  ],

  // ── Lesson 15: Whole-System Integration ──
  'automation-pyramid': [
    {
      question: 'According to the ISA-95 Automation Pyramid, which layer sits directly between the Control Layer (PLCs) and the MES / Business Layer?',
      options: ['SCADA / HMI Supervisory Level (Supervisory Control and Data Acquisition)', 'The Field Sensor Layer', 'The Hydraulic Power Unit', 'The Raw Material Warehouse'],
      correct: 0,
      explanation: 'SCADA (Supervisory Control and Data Acquisition) bridges factory floor real-time PLCs with high-level manufacturing execution and enterprise ERP systems.',
    },
  ],
  'integration-walkthrough': [
    {
      question: 'What is the key advantage of unified engineering inside TIA Portal when integrating an S7-1200 PLC with a KTP Comfort HMI panel?',
      options: ['Shared global tag database: HMI variables link directly to symbolic PLC tags with automatic synchronization when tag names or data types change', 'The HMI screen can run without power', 'The PLC no longer needs ladder code', 'It eliminates all wiring'],
      correct: 0,
      explanation: 'Unified database architecture eliminates manual tag re-typing, preventing communication address mismatches between PLC logic and graphical HMI screens.',
    },
  ],
  'real-world-case': [
    {
      question: 'In an automated chemical liquid blending plant, how do the various PLC subsystems collaborate in real time?',
      options: ['Digital inputs detect safety doors, Analog modules measure vat levels, PID loops govern steam heating valves, High-Speed Counters track flow meters, and HMI visualizes recipes', 'Only timers are used for all functions', 'The system operates with zero sensors', 'The PLC only turns on an indicator light'],
      correct: 0,
      explanation: 'Real-world industrial installations orchestrate the entire curriculum stack: discrete interlocks, analog measurement, closed-loop PID, high-speed pulse tracking, and HMI supervision.',
    },
  ],
};

// Generic fallback quiz for any topic without explicit questions
const DEFAULT_QUIZ: QuizQuestion[] = [
  {
    question: 'What is the primary advantage of programmable logic controllers over hardwired relay panels?',
    options: [
      'Relays can handle higher temperatures than PLCs',
      'Modifying control sequences in software requires zero rewiring or hardware scrap',
      'PLCs do not require 24VDC power supplies',
      'Relay systems have faster network communications',
    ],
    correct: 1,
    explanation: 'Migrating to a PLC allows re-sequencing machines via simple software downloads in seconds, while hardwired relay panels require physical rewiring and downtime.',
  },
  {
    question: 'Which international standard governs PLC programming languages and architecture?',
    options: [
      'ISO 9001',
      'IEC 61131-3',
      'IEEE 802.11',
      'NEMA MG-1',
    ],
    correct: 1,
    explanation: 'IEC 61131-3 defines the five standardized industrial programming languages: LAD, FBD, SCL (Structured Text), STL (Instruction List), and SFC.',
  },
];

interface Props {
  topicSlug: string;
  color: string;
  isFullscreen?: boolean;
}

export default function TopicQuiz({ topicSlug, color, isFullscreen = false }: Props) {
  const questions = QUIZ_DATABASE[topicSlug] ?? DEFAULT_QUIZ;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const score = Object.keys(selectedAnswers).reduce((acc, qIdxStr) => {
    const qIdx = parseInt(qIdxStr);
    return selectedAnswers[qIdx] === questions[qIdx].correct ? acc + 1 : acc;
  }, 0);

  return (
    <div style={{
      background: isFullscreen ? '#0f172a' : '#ffffff',
      border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: isFullscreen ? '28px 32px' : '24px',
      boxShadow: isFullscreen ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📝</span>
          <h4 style={{ margin: 0, fontSize: isFullscreen ? '16px' : '14px', fontWeight: 700, color: isFullscreen ? '#ffffff' : '#0f172a' }}>
            Formative Knowledge Check · Self-Assessment
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: isFullscreen ? '#38bdf8' : color, background: isFullscreen ? '#1e293b' : `${color}15`, padding: '4px 8px', borderRadius: '4px' }}>
          {questions.length} Questions
        </span>
      </div>

      <p style={{ fontSize: isFullscreen ? '13.5px' : '12.5px', color: isFullscreen ? '#94a3b8' : '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
        Test your understanding of the technical concepts covered in this topic before proceeding:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: questions.length > 1 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', gap: '16px' }}>
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isCorrect = userChoice === q.correct;

          return (
            <div key={qIdx} style={{ background: isFullscreen ? '#1e293b' : '#f8fafc', border: isFullscreen ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontSize: isFullscreen ? '14px' : '13px', fontWeight: 600, color: isFullscreen ? '#f1f5f9' : '#1e293b', marginBottom: '12px', lineHeight: 1.5 }}>
                {qIdx + 1}. {q.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, oIdx) => {
                  let optBg = isFullscreen ? '#0f172a' : '#ffffff';
                  let optBorder = isFullscreen ? '#334155' : '#cbd5e1';
                  let optColor = isFullscreen ? '#cbd5e1' : '#334155';

                  if (submitted) {
                    if (oIdx === q.correct) {
                      optBg = isFullscreen ? '#064e3b' : '#dcfce7';
                      optBorder = '#10b981';
                      optColor = isFullscreen ? '#a7f3d0' : '#166534';
                    } else if (userChoice === oIdx) {
                      optBg = isFullscreen ? '#7f1d1d' : '#fee2e2';
                      optBorder = '#ef4444';
                      optColor = isFullscreen ? '#fca5a5' : '#991b1b';
                    }
                  } else if (userChoice === oIdx) {
                    optBg = isFullscreen ? `${color}30` : `${color}15`;
                    optBorder = color;
                    optColor = isFullscreen ? '#38bdf8' : color;
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: `1px solid ${optBorder}`,
                        background: optBg,
                        color: optColor,
                        fontSize: isFullscreen ? '13px' : '12.5px',
                        textAlign: 'left',
                        cursor: submitted ? 'default' : 'pointer',
                        fontWeight: userChoice === oIdx ? 600 : 450,
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `1px solid ${userChoice === oIdx ? color : '#cbd5e1'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 700, flexShrink: 0,
                        background: userChoice === oIdx ? color : 'transparent',
                        color: userChoice === oIdx ? '#ffffff' : '#64748b',
                      }}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                  background: isCorrect ? (isFullscreen ? '#064e3b' : '#f0fdf4') : (isFullscreen ? '#7f1d1d' : '#fef2f2'),
                  borderLeft: `3px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                  color: isCorrect ? (isFullscreen ? '#a7f3d0' : '#166534') : (isFullscreen ? '#fca5a5' : '#991b1b'),
                }}>
                  <strong>{isCorrect ? '✓ Correct Answer!' : '✗ Review Concept:'}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length === 0}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              background: color,
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: Object.keys(selectedAnswers).length === 0 ? 'not-allowed' : 'pointer',
              opacity: Object.keys(selectedAnswers).length === 0 ? 0.6 : 1,
            }}
          >
            Check Answers & Explanations
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: score === questions.length ? '#16a34a' : '#d97706' }}>
              Your Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
            <button
              onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
                background: isFullscreen ? '#1e293b' : '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: isFullscreen ? '#f1f5f9' : '#475569',
                cursor: 'pointer',
              }}
            >
              Retry Quiz ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
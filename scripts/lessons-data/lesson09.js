module.exports = {
  overview: "This lesson covers high-speed signal processing, rotary encoders, motion control, and pulse generation on the Siemens S7-1200 controller. Standard PLC cyclic inputs are constrained by the scan cycle time (max frequency ~50 Hz); however, industrial motion systems, conveyor line speed synchronization, and servo positioning generate pulse frequencies reaching tens or hundreds of kilohertz. Students will master the mechanical and optical operating principles of incremental encoders (quadrature A/B channels, Z index marker), hardware High-Speed Counters (HSC1–HSC6), Pulse Width Modulation (PWM) for heater and DC motor duty-cycle control, Pulse Train Output (PTO) for stepper and servo position control, and TIA Portal Motion Control Technology Objects complying with PLCopen standards.",
  objectives: [
    "Explain the optical construction and signal waveforms of incremental rotary encoders, including quadrature phase shift and Z index pulses",
    "Configure on-board High-Speed Counters (HSC1–HSC6) in TIA Portal for single-phase, two-phase, and 4x quadrature counting up to 200 kHz",
    "Interface with HSC hardware registers programmatically using the CTRL_HSC instruction block and direct peripheral reads (%ID1000:P)",
    "Configure on-board pulse generators for Pulse Width Modulation (PWM) and modulate duty cycles dynamically using CTRL_PWM",
    "Configure Pulse Train Output (PTO) pulse generators and create Motion Control Axis Technology Objects (TO_Axis)",
    "Execute standardized PLCopen motion control blocks: MC_Power, MC_Reset, MC_Home, MC_MoveJog, MC_MoveAbsolute, and MC_MoveRelative",
    "Interface analog velocity setpoints (±10V) and closed-loop position transducers for variable frequency drives (VFDs) and servo systems"
  ],
  sections: [
    {
      title: "4.1 Encoder Construction and Operating Principle",
      content: "A rotary encoder converts mechanical angular displacement and rotational velocity into digital electrical pulse trains. In factory automation, incremental optical rotary encoders are the predominant feedback device for conveyor synchronization, web winders, and motor shafts. The physical construction comprises a precision stainless-steel shaft, an optical glass or etched metal disk patterned with radial transparent and opaque slits, an array of infrared light-emitting diodes (LEDs), and matching photodiode receivers. As the shaft rotates, the grating chops the infrared beams, generating two square-wave electrical signals: Channel A and Channel B. Crucially, the optical masks for Channel A and Channel B are physically offset by 90 electrical degrees: a geometric relationship known as Quadrature. By examining the phase relationship, the controller detects direction: when rotating clockwise (CW), Channel A leads Channel B; when rotating counter-clockwise (CCW), Channel B leads Channel A. A third channel—the Z Index channel—generates exactly one narrow pulse per full 360-degree mechanical revolution, establishing an absolute physical zero reference marker for machine homing.",
      keyPoints: [
        "Optical Grating Mechanics: Etched glass/metal disk with alternating transparent slits; optical resolution rated in Pulses Per Revolution (PPR, e.g. 1024 or 2048 PPR)",
        "Quadrature Phase Shift (90°): Channel A leads Channel B during forward rotation; Channel B leads Channel A during reverse rotation, enabling directional sensing",
        "Z Index Marker Channel: Fires exactly one pulse per 360° mechanical turn; provides precision zero-datum homing reference independent of tooth count",
        "Electrical Output Interfaces: Push-Pull (HTL 24VDC, standard for PLC inputs), Open Collector (NPN/PNP), or Differential Line Driver (RS422 / TTL 5VDC for high noise immunity)",
        "Velocity Calculation Formula: Rotational Velocity (RPM) = (Pulses Counted per second / PPR) * 60",
        "Incremental vs Absolute Encoders: Incremental encoders lose position upon power loss (requiring homing at startup); absolute encoders report true position immediately via Gray code"
      ],
      note: "Never use 24VDC push-pull (HTL) single-ended encoder signals over cable runs longer than 20 meters near powerful VFD cables! Fast switching edges degrade over cable capacitance. For long distances, use differential RS422 (line driver) encoders paired with an S7-1200 high-speed differential signal board (SB 1221 200kHz)."
    },
    {
      title: "4.2 S7-1200 High-Speed Counters",
      content: "Standard digital inputs read during the cyclic input scan are limited by the PLC scan cycle time (frequencies above 50–100 Hz are completely aliased and missed). To process high-speed signals from encoders and flow meters, the S7-1200 integrates up to 6 dedicated on-board hardware High-Speed Counters (HSC1 through HSC6). These counters operate entirely independent of the CPU scan cycle, accumulating pulses directly into hardware registers at frequencies up to 100 kHz on standard CPU inputs (or up to 200 kHz when using 24VDC/5VDC Signal Boards). In TIA Portal, each HSC is parameterized for its specific operating mode: Single Phase (simple count up/down with external direction input), Two Phase (independent up and down clock inputs), or AB Quadrature (1x, 2x, or 4x mode). In AB Quadrature 4x mode, the hardware increments on both the rising and falling edges of both Channel A and Channel B, effectively quadrupling the encoder's angular resolution (e.g. converting a 1,000 PPR encoder into 4,000 counts per revolution). Current count values are read continuously from assigned memory double-words (%ID1000 for HSC1), while the CTRL_HSC instruction block dynamically updates presets, resets counts, and enables gate controls.",
      keyPoints: [
        "Independent Hardware Architecture: Operates directly in silicon logic outside the OB1 scan cycle; eliminates pulse loss at high shaft speeds",
        "Frequency Capabilities: On-board inputs support up to 100 kHz (HSC1/HSC2 on CPU 1214C/1215C); 200 kHz supported via Signal Board (SB 1221)",
        "Operating Modes: Single Phase (clock + direction), Two Phase (Clock Up + Clock Down), and A/B Quadrature (1x, 2x, or 4x resolution multiplication)",
        "Quadrature 4x Multiplication: Samples all 4 transitions (rising & falling edges of A and B) per cycle, delivering 4x mechanical resolution",
        "Direct Process Image Reading: Read the instantaneous 32-bit signed count value directly from assigned double-word memory: %ID1000:P",
        "Hardware Comparison Interrupts: HSC hardware compares current count against a reference value in silicon, triggering a hardware interrupt (OB40) within microseconds",
        "CTRL_HSC Function Block: System block used to dynamically write new reference presets, change counting direction, or reset the accumulator"
      ],
      note: "When using high-speed counter inputs (%I0.0–%I0.5), remember to lower the digital input hardware filter time in CPU properties! The factory default input filter is 6.4 ms (which blocks all frequencies above ~78 Hz). Change the filter time to 0.8 µs to permit 100 kHz pulses to pass into the HSC circuitry."
    },
    {
      title: "4.3 Pulse Output with PWM",
      content: "Pulse Width Modulation (PWM) is a solid-state control technique where a digital output is switched between ON and OFF at a constant carrier frequency, while dynamically modulating the ratio of ON time to the total cycle period (known as the Duty Cycle: 0.0% to 100.0%). The S7-1200 controller with transistor outputs (DC/DC/DC variants) incorporates up to four dedicated hardware pulse generators (Pulse 1 through Pulse 4) capable of generating PWM signals on outputs %Q0.0, %Q0.1, %Q0.2, and %Q0.3 at frequencies up to 100 kHz. In TIA Portal, configuring a pulse generator as PWM allows the automation engineer to define the timebase (milliseconds or microseconds) and the period duration (e.g. 10 ms for a 100 Hz signal). Programmatic control is executed via the CTRL_PWM instruction block, where the user passes a numeric duty cycle (scaled from 0 to 100, or 0 to 10,000 for high resolution). By modulating duty cycle, the average electrical power delivered to a load is controlled with near-zero heat dissipation in the switching transistor. Industrial applications include modulating electric heating elements via solid-state relays (SSR), controlling proportional hydraulic solenoid valves, and modulating small DC motor velocities.",
      keyPoints: [
        "PWM Fundamental Principle: Fixed carrier frequency (period T); modulated pulse width (ON time t_on); Average Voltage = V_supply * (t_on / T)",
        "Hardware Pulse Generators: Up to 4 on-board hardware pulse generators operating on fast transistor outputs %Q0.0–%Q0.3; up to 100 kHz switching speed",
        "Zero-Loss Solid-State Switching: Power MOSFET transistors operate purely saturated (ON) or cutoff (OFF), minimizing internal thermal dissipation",
        "CTRL_PWM System Block: System instruction block that activates/deactivates the pulse generator and writes new duty cycle values on the fly",
        "Timebase Options: Microseconds (µs) or milliseconds (ms); selectable period duration from 10 µs to 65,535 ms",
        "Duty Cycle Formatting: Scaled as Hundredths (0 to 10,000 where 5000 = 50.00% duty cycle) or integer percent (0 to 100)",
        "Industrial Applications: Proportional heating chamber control via SSRs, LED industrial lighting dimming, chemical metering pump pulse stroking"
      ],
      note: "PWM pulse generation is ONLY supported on DC/DC/DC CPUs with solid-state transistor outputs! Never attempt to configure PWM on AC/DC/Relay CPUs; electromechanical relays have a maximum switching rate of 1 Hz, and attempting to switch them with PWM will destroy the mechanical relay contacts within minutes."
    },
    {
      title: "4.4 Position Control with Motion Control",
      content: "For high-precision positioning applications—such as pick-and-place linear gantries, indexing rotary tables, and ball-screw packaging feeds—the S7-1200 incorporates Pulse Train Output (PTO) motion control conforming to standardized PLCopen specifications. In PTO mode, the hardware pulse generator outputs a train of discrete square-wave pulses where each pulse commands the motor drive to step by an exact mechanical increment (e.g. 0.01 mm). The pulse frequency governs rotational speed, while the total pulse count commands absolute travel distance. In TIA Portal, motion control is engineered using Axis Technology Objects (TO_Axis). The engineer parameterizes the mechanical kinematics (screw lead, gear ratios), velocity limits, S-curve jerk-limiting acceleration/deceleration ramps, and software/hardware end-of-travel limit switches. Control logic is executed using standardized PLCopen function blocks: MC_Power (energizes the servo drive), MC_Reset (clears drive alarm faults), MC_Home (executes active or passive zero-datum calibration using the encoder Z pulse), MC_MoveJog (manual velocity jog for maintenance), MC_MoveAbsolute (travels to an exact coordinate coordinate), and MC_MoveRelative (advances by a relative distance delta).",
      keyPoints: [
        "Pulse Train Output (PTO) Topology: Outputs pulse train on %Q0.0 (frequency represents velocity; pulse count represents displacement) and direction signal on %Q0.1",
        "Axis Technology Object (TO_Axis): Graphical configuration tool parameterizing mechanical pitch, acceleration ramps, jerk filtering, and limits",
        "PLCopen Motion Standard: Vendor-independent motion blocks ensuring portable, standardized programming across diverse drive platforms",
        "MC_Power: Authorizes and enables the drive power stage; must remain active throughout all axis positioning commands",
        "MC_Home: Synchronizes the logical software coordinate system with physical mechanical datum using limit switches and encoder zero markers",
        "MC_MoveAbsolute vs MC_MoveRelative: Absolute moves travel to an exact position relative to origin (X = 250.0 mm); Relative moves advance by a distance increment (+50.0 mm)",
        "S-Curve Jerk Limiting: Smooths acceleration transitions to eliminate mechanical vibration, belt slipping, and structural stress on mechanical carriages"
      ],
      note: "Always wire physical, hardwired Normally Closed (NC) limit switches to positive and negative overtravel inputs! Do not rely solely on software positioning limits in your PLC code. If an encoder coupling slips, software limits are blinded, and physical limit switches are the only barrier preventing mechanical gantry crashes."
    },
    {
      title: "4.5 Analog Signal Handling in Motion Applications",
      content: "While pulse-train output (PTO) is dominant for stepper and low-cost servo drives, heavy industrial motion applications—including large conveyor drives, centrifugal extruders, web unwinders, and overhead bridge cranes—frequently utilize variable frequency drives (VFDs) and heavy-duty AC servodrives commanded via analog velocity setpoints. The S7-1200 interfaces to these drives via high-resolution analog output modules (SM 1232, 14-bit) generating bipolar ±10V DC speed commands where polarity dictates motor rotation direction (-10V = full speed reverse, 0V = standstill, +10V = full speed forward). Closed-loop position regulation is implemented within the PLC: the controller reads instantaneous position feedback from an incremental encoder connected to an HSC channel or an absolute magnetostrictive linear transducer connected to an analog input channel. In software, a position error comparator continuously computes: e = Target_Position - Actual_Position, multiplying error by a position proportional gain to generate the analog speed setpoint. To ensure smooth motion, software S-curve ramp generators profile the speed demand, preventing abrupt acceleration steps that cause mechanical backlash and belt slipping.",
      keyPoints: [
        "Bipolar Analog Interface (±10V): Industry standard velocity reference; voltage magnitude commands speed, polarity commands direction",
        "High-Resolution Analog Output: 14-bit SM 1232 module provides 16,384 discrete steps, ensuring smooth acceleration without velocity stepping",
        "Closed-Loop Position Loop: PLC executes closed-loop algorithm: reads position via HSC or linear transducer, computes error, outputs analog speed demand",
        "Linear Displacement Transducers: Magnetostrictive or optical linear scales outputting 0–10V or 4–20mA provide absolute carriage position feedback",
        "Software Velocity Profiling: Ramping algorithms govern acceleration, steady-state run, deceleration, and creep-to-target phases to prevent mechanical overshoot",
        "Analog Torque Limiting: Secondary analog output channels command drive torque limits to protect sensitive web materials from breaking during winding",
        "Drive Ready/Fault Interlocks: Digital handshake lines (Drive Enabled, Drive Running, Drive Faulted) wired to PLC discrete I/O supervise drive safety"
      ],
      note: "Always bond the shield of the ±10V analog speed reference cable directly to the metal enclosure grounding bar using a high-conductivity saddle clamp. Electrical noise induced by the adjacent motor power inverter will cause analog speed setpoint jitter, leading to motor hunting and rough bearing vibration."
    }
  ],
  review: [
    "Explain the optical operating principle of an incremental rotary encoder and describe how quadrature A/B channels determine rotational direction.",
    "What is the function of the Z index channel on an incremental encoder, and how is it used during machine homing?",
    "Why does an S7-1200 High-Speed Counter (HSC) require reducing the digital input filter time in CPU properties from the default 6.4 ms to 0.8 µs?",
    "Explain the mathematical principle of Quadrature 4x counting mode in an S7-1200 High-Speed Counter. What is the resulting count for a 500 PPR encoder?",
    "Compare the operational mechanisms and industrial application domains of Pulse Width Modulation (PWM) versus Pulse Train Output (PTO).",
    "Describe the sequential execution order of the PLCopen motion blocks (MC_Power, MC_Home, MC_MoveAbsolute) required to position a linear gantry.",
    "Explain how a closed-loop positioning system functions when commanding an AC variable frequency drive using a ±10V analog output reference."
  ]
};

module.exports = {
  overview: "This lesson provides a comprehensive treatment of continuous analog signal acquisition, electrical interfacing, hardware quantization, and mathematical scaling in the Siemens S7-1200 PLC. Industrial processes require measuring real-world variables—temperatures, tank levels, fluid pressures, and motor velocities—that vary continuously across a spectrum. Students will analyze the technical trade-offs between voltage loops (0–10V) and current loops (4–20mA), 2-wire vs 4-wire transmitter wiring, analog-to-digital converter (ADC) quantization, on-board and expansion analog modules, Siemens raw integer representation (0 to 27648), and mathematical signal conditioning using the NORM_X and SCALE_X instructions.",
  objectives: [
    "Differentiate the physical characteristics and industrial noise immunity of 0–10V voltage loops versus 4–20mA current loops",
    "Wire 2-wire (loop-powered) and 4-wire (self-powered) analog transmitters to S7-1200 analog input channels with proper shield grounding",
    "Identify on-board analog I/O specifications and configure SM 1231, SM 1232, and SM 1234 analog expansion modules in TIA Portal",
    "Explain the internal conversion mechanics of 10-bit to 16-bit ADCs and map raw integer counts (0–27648) to physical voltages and currents",
    "Derive the mathematical normalization formula and configure the NORM_X instruction block",
    "Derive the mathematical engineering scaling formula and configure the SCALE_X instruction block for temperature, pressure, and level transmitters",
    "Implement analog input filtering and threshold alarm detection with software deadbands"
  ],
  sections: [
    {
      title: "4.1 Analog Signals (4–20 mA, 0–10 V)",
      content: "Unlike discrete binary signals which exist strictly as ON or OFF, analog signals represent continuous physical phenomena such as temperature, pressure, flow rate, and mechanical displacement. In industrial instrumentation, two standardized electrical signal formats dominate: 0–10V (or ±10V) voltage signals and 4–20mA (or 0–20mA) current loops complying with ANSI/ISA-50.00.01. Voltage loops are inexpensive and simple to troubleshoot with a standard voltmeter; however, they suffer from significant signal degradation over long wire runs because lead wire resistance causes voltage drops (V = I * R), and high-impedance voltage inputs are highly susceptible to electromagnetic interference (EMI) from adjacent motor cables. Conversely, 4–20mA current loops provide superior industrial noise immunity: the transmitter dynamically modulates the current in the loop, meaning the signal remains constant regardless of wire length and resistance. Furthermore, 4–20mA incorporates a 'Live Zero': 4mA represents 0% of the process range, whereas a complete wire break or power failure drops loop current to 0mA, allowing the PLC to instantly distinguish between a true zero measurement and a broken field cable.",
      keyPoints: [
        "Voltage Signals (0–10V, ±10V): Inexpensive; straightforward testing; high susceptibility to capacitive noise coupling and IR lead resistance drop over runs >15m",
        "Current Signals (4–20mA): High noise immunity; loop current is unaffected by cable resistance up to the transmitter voltage compliance limit",
        "Live Zero Principle (4mA): 4mA represents 0% measurement; 0mA indicates a broken cable, open circuit, or transmitter power loss",
        "Current Loop Shunt Resistor: S7-1200 voltage inputs can measure 4–20mA by wiring an external precision 500-ohm (0.1%) shunt resistor across input terminals (producing 2–10V)",
        "2-Wire Loop-Powered Transmitters: The sensor derives its operating power directly from the 4–20mA loop conductors, requiring only two wires",
        "4-Wire Self-Powered Transmitters: The sensor receives external AC/DC mains power via two dedicated wires and outputs an active 4–20mA loop on two signal wires",
        "Digital Communication on 4–20mA: HART (Highway Addressable Remote Transducer) protocol superimposes digital FSK frequency data onto the 4–20mA analog carrier"
      ],
      note: "Never use 0–10V voltage signals for long-distance field runs or near variable frequency drives (VFDs). Always specify 4–20mA current loops for industrial field sensors to guarantee measurement integrity and automated cable break diagnostics."
    },
    {
      title: "4.2 Wiring Analog Inputs and Outputs",
      content: "Proper physical wiring and shielding are critical to prevent ground loops and electromagnetic interference from corrupting sensitive analog readings. Analog wiring must utilize individually shielded twisted-pair (STP) cables routed in grounded metallic conduits segregated from 400VAC motor power conductors by at least 200 mm. Grounding the cable shield requires strict discipline: the overall shield must be grounded at ONE end only—typically at the PLC control panel's dedicated analog grounding busbar using a 360-degree shield clamp. Grounding both ends of a cable shield creates circulating ground loop currents caused by earth potential differences between distant plant locations, introducing devastating 50Hz/60Hz AC ripple into the analog measurement. For 2-wire loop-powered transmitters, the +24VDC power supply connects to the transmitter positive terminal, the transmitter negative terminal connects to the PLC analog input channel (+), and the PLC analog common (-) connects back to 0VDC (M). For analog outputs driving proportional valves or VFD speed references, two-wire shielded cables connect the PLC AQ channel directly to the actuator input impedance load.",
      keyPoints: [
        "Shielded Twisted-Pair (STP) Cabling: Twisting cancels magnetic noise induction; braided copper or foil shield repels electrostatic noise fields",
        "Single-Point Shield Grounding Rule: Terminate cable shields strictly at the control enclosure end using 360-degree conductive saddle clamps; leave the field end isolated",
        "Ground Loop Hazard: Connecting cable shields to ground at both ends induces large circulating ground currents, generating artificial measurement fluctuations",
        "2-Wire Transmitter Topology: 24VDC (+) -> Transmitter (+) -> Transmitter (-) -> PLC AI (+) -> PLC AI (-) -> Power Supply 0VDC (M)",
        "4-Wire Transmitter Topology: External Power connects to Line/Neutral or L+/M; isolated analog output terminals connect to PLC AI (+) and AI (-)",
        "Analog Output Wiring: PLC AQ channels (0–10V or 4–20mA) connect to field actuators; observe maximum load resistance limits (typically <= 500 ohms for current outputs)",
        "Cable Conduit Segregation: Maintain >= 200 mm physical spacing between analog signal conduits and 3-phase AC motor or inverter power cables"
      ],
      note: "If an analog reading in TIA Portal fluctuates wildly when a nearby motor starts, the root cause is almost always an ungrounded cable shield, a shield grounded at both ends creating a ground loop, or routing signal cables inside the same wire duct as inverter output leads."
    },
    {
      title: "4.3 S7-1200 Analog Modules",
      content: "The S7-1200 hardware architecture provides both integrated and expandable analog processing capabilities. All CPU models (1211C through 1217C) feature two integrated analog input channels on the CPU terminal strip, mapped to peripheral word addresses %IW64 and %IW66. These on-board channels measure 0–10V DC with 10-bit resolution (1,024 discrete steps) and an input impedance of 100 k-ohms. To expand capacity or introduce analog outputs, engineers install Signal Boards (SB) or Signal Modules (SM). The SB 1231 provides 1 AI channel (12-bit), while the SB 1232 provides 1 AQ channel (12-bit). Dense modular expansion is achieved via SM 1231 analog input modules (available in 4-channel or 8-channel variants with 13-bit or 16-bit resolution supporting 0–10V, ±10V, 0–20mA, and 4–20mA), SM 1232 analog output modules (2 or 4 channels, 14-bit), and SM 1234 combo modules (4 AI / 2 AQ). Siemens uses a standardized internal integer representation: regardless of whether a module has 10-bit, 12-bit, or 16-bit hardware resolution, the ADC firmware automatically left-shifts the conversion result into a standardized 16-bit integer spanning 0 to 27648 for nominal range.",
      keyPoints: [
        "Integrated CPU Analog Inputs: 2 channels (0–10V DC only), 10-bit hardware resolution, mapped by default to addresses %IW64 and %IW66",
        "Siemens Standard Integer Range: Nominal full-scale signal (0–10V or 4–20mA) corresponds to integer values 0 to 27648",
        "Overrange and Underrange Limits: 27649 to 32511 represents overrange (linear up to 118.5%); 32512 to 32767 represents digital overflow saturation",
        "Negative Limits (Bipolar): Nominal bipolar range (-10V to +10V) spans integer values -27648 to +27648",
        "Signal Board Expansion: SB 1231 (1 AI, 12-bit) or SB 1232 (1 AQ, 12-bit) snaps into the CPU faceplate without altering DIN-rail width",
        "Signal Module Expansion: SM 1231 (4AI/8AI, 13/16-bit), SM 1232 (2AQ/4AQ, 14-bit), SM 1234 (4AI/2AQ combo), and RTD/TC temperature modules",
        "Hardware Smoothing Filters: TIA Portal module properties configure digital RC smoothing (None, Weak, Medium, Strong) to reject 50Hz/60Hz line noise"
      ],
      note: "Remember that the on-board analog inputs on the S7-1200 CPU only measure 0–10V! If you need to connect a 4–20mA sensor to %IW64, you must wire a high-precision 500-ohm resistor (tolerance 0.1%, 1/4W) across the input terminals to convert 4–20mA into 2–10V."
    },
    {
      title: "Normalising and Scaling (NORM_X / SCALE_X)",
      content: "Converting a raw analog integer (%IW64) into meaningful engineering units (such as degrees Celsius, bars of pressure, or cubic meters per hour) requires a two-step mathematical transformation in TIA Portal using the NORM_X and SCALE_X instruction blocks. Step 1: Normalization (NORM_X). The NORM_X block converts the raw integer count (0 to 27648) into a dimensionless floating-point ratio spanning 0.0 to 1.0. The mathematical equation executed is: OUT = (VALUE - MIN) / (MAX - MIN). When raw input VALUE = 0, OUT = 0.0; when VALUE = 27648, OUT = 1.0; when VALUE = 13824, OUT = 0.5. Step 2: Scaling (SCALE_X). The SCALE_X block takes the normalized floating-point ratio and maps it onto the real-world physical engineering range defined by MIN and MAX. The equation executed is: OUT = VALUE * (MAX - MIN) + MIN. For example, to scale a 4–20mA pressure transmitter measuring 0.0 to 10.0 bar: NORM_X normalizes %IW64 from [0, 27648] to a temporary REAL variable [0.0, 1.0]; SCALE_X then scales this ratio with MIN = 0.0 and MAX = 10.0 bar. Conversely, to drive an analog output (%QW64) from an engineering setpoint, the order is reversed: NORM_X maps the setpoint to [0.0, 1.0], and SCALE_X maps [0.0, 1.0] to [0, 27648].",
      keyPoints: [
        "Two-Step Standard Pipeline: Raw Input (%IW) -> [NORM_X] -> Normalized Ratio (0.0 to 1.0 REAL) -> [SCALE_X] -> Engineering Units (REAL)",
        "NORM_X Mathematical Formula: OUT = (VALUE - MIN) / (MAX - MIN); converts raw integers into normalized floating-point range",
        "SCALE_X Mathematical Formula: OUT = VALUE * (MAX - MIN) + MIN; projects normalized ratio onto physical engineering boundaries",
        "Input Parameter Configuration: For nominal unipolar inputs: MIN = 0, MAX = 27648; for bipolar inputs (±10V): MIN = -27648, MAX = +27648",
        "Engineering Units Real World Example: Temperature sensor 0–150°C: MIN = 0.0, MAX = 150.0; at raw count 13824, scaled temperature = 75.0°C",
        "Analog Output Scaling Pipeline: Engineering Setpoint (REAL) -> [NORM_X with Eng Units] -> Ratio [0.0, 1.0] -> [SCALE_X with 0, 27648] -> %QW64",
        "Value Clamping with LIMIT: Precede or follow scaling with a LIMIT block to clamp out-of-range sensor spikes caused by electrical noise surges"
      ],
      note: "Never perform manual integer arithmetic to scale analog signals (e.g. dividing by 276)! Integer division truncates all decimal remainders, resulting in stepped, coarse measurements. Always normalize to a 32-bit REAL variable first using NORM_X and SCALE_X."
    }
  ],
  review: [
    "Compare the electrical advantages and disadvantages of 0–10V voltage signals versus 4–20mA current loops in noisy plant environments.",
    "Explain the 'Live Zero' principle in a 4–20mA loop. How does a PLC distinguish between a valid 0 bar tank measurement and a cut sensor cable?",
    "Describe the single-point grounding rule for shielded analog cables. What physical phenomenon occurs if both ends of the shield are grounded?",
    "Explain how an S7-1200 CPU with on-board 0–10V analog inputs (%IW64) can be adapted to read a 4–20mA industrial pressure transmitter.",
    "State the nominal integer count range used by Siemens S7-1200 analog input channels. What does integer count 27648 represent?",
    "Write out the mathematical formulas executed by NORM_X and SCALE_X. Trace the step-by-step transformation for an input of 13,824 counts on a 0–100°C RTD channel.",
    "Describe the reverse scaling pipeline required to command a proportional control valve (0–100% opening) connected to analog output %QW64."
  ]
};

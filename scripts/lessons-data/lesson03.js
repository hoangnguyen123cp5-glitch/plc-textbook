module.exports = {
  overview: "This lesson covers the core binary logic foundations of industrial PLC programming in IEC 61131-3 Ladder Diagram (LAD). Students will master Boolean logic gate equivalents (AND, OR, NOT, XOR), the physical evaluation of Normally Open (NO) and Normally Closed (NC) contacts, output coil behaviors, motor start-stop seal-in latching circuits, Set (S) and Reset (R) dominant latch instructions, IEC standard timers (TON, TOF, TP), and IEC counters (CTU, CTD, CTUD). The lesson concludes with a worked industrial application implementing multi-phase sequence control.",
  objectives: [
    "Evaluate Boolean logic equations in Ladder Diagram using series, parallel, and inverted contact networks",
    "Differentiate the physical operation and software evaluation of Normally Open (NO) and Normally Closed (NC) contacts",
    "Design and analyze standard motor Start-Stop latching circuits with physical hardwired emergency stop interlocking",
    "Apply Set (S) and Reset (R) instructions, evaluating network execution order and SR vs RS dominant flip-flop blocks",
    "Configure IEC 61131-3 timer function blocks (TON On-Delay, TOF Off-Delay, TP Pulse) with instance data blocks",
    "Program IEC counter blocks (CTU Count Up, CTD Count Down, CTUD Bidirectional) for industrial part totalization",
    "Synthesize timers, counters, and edge detection into a fully integrated multi-state manufacturing application"
  ],
  sections: [
    {
      title: "2.1 Logic Links (AND, OR, NOT)",
      content: "Binary logic operations in Ladder Diagram (LAD) replicate the behavior of electromechanical relay schematics while executing deterministically within the CPU. The fundamental building blocks are Normally Open (NO) contacts (---[ ]---), Normally Closed (NC) contacts (---[/]---), standard output coils (---( )---), and negated coils (---(/)---). In LAD, power flow evaluates virtually from the left power rail across the rung to the right rail. Series connection of contacts implements Boolean AND logic (both Contact A AND Contact B must conduct for the output to energize). Parallel branch connections implement Boolean OR logic (conduction across either Branch A OR Branch B completes the circuit). An NC contact functions as a Boolean NOT operator: when the referenced memory bit is logic 0 (FALSE), the virtual contact remains closed and conducts; when the bit becomes logic 1 (TRUE), the contact opens, interrupting power flow. Combining series and parallel combinations allows engineers to construct complex combinational logic, including Exclusive-OR (XOR) circuits where an output is true if exactly one of two inputs is active.",
      keyPoints: [
        "Normally Open (NO) Contact (---[ ]---): Passes virtual power flow only when the assigned boolean address evaluates to TRUE (logic 1)",
        "Normally Closed (NC) Contact (---[/]---): Passes virtual power flow when the assigned address is FALSE (logic 0); opens when address is TRUE",
        "Standard Output Coil (---( )---): Writes the evaluated Result of Logic Operation (RLO) directly to the designated memory address (%Q or %M)",
        "Boolean AND Link: Configured by placing two or more contacts in series along a single rung path; all series conditions must evaluate TRUE",
        "Boolean OR Link: Configured by wiring contacts in parallel branches; power flow conducts if at least one branch evaluates TRUE",
        "Boolean NOT (Invert RLO): An inline NOT contact block (---[NOT]---) or negated coil (---(/)---) reverses the current rung logic state",
        "Exclusive-OR (XOR) Logic: Constructed using two parallel branches containing cross-coupled NO and NC contacts: (A AND NOT B) OR (NOT A AND B)"
      ],
      note: "Always remember the golden rule of field sensors: if a physical emergency stop pushbutton is hardwired as Normally Closed (NC) for fail-safe field integrity, it delivers +24V (TRUE) into %I0.0 in its normal safe state. In your PLC ladder program, you must examine %I0.0 using a Normally Open (NO) contact to allow power flow when the button is healthy and unpressed!"
    },
    {
      title: "2.2 Set / Reset Instructions for Contacts",
      content: "Standard output coils are momentary: when rung conditions become FALSE, the coil immediately turns OFF. In industrial automation, maintaining a machine state across cycles requires memory latching. Two primary methods achieve this: the traditional Seal-In Latching circuit (where an auxiliary NO contact of output coil %Q0.0 is wired in parallel with the momentary Start pushbutton), and dedicated Set (---(S)---) and Reset (---(R)---) latching instructions. When power flow reaches a Set coil, the designated memory bit is latched to TRUE (1) and remains locked even after rung power flow is removed. The bit can only be restored to FALSE (0) when a separate rung with a Reset coil is energized. Because a PLC executes networks sequentially, if both Set and Reset conditions for the same bit are active simultaneously, the 'Last-Write Wins' rule determines the outcome. Siemens provides dedicated bistable function blocks: the SR Flip-Flop (Set-dominant, where Set overrides Reset if both inputs are TRUE) and the RS Flip-Flop (Reset-dominant, where Reset overrides Set for enhanced machine safety).",
      keyPoints: [
        "Seal-In Latch Topology: Traditional 3-wire motor circuit using a momentary start pushbutton in parallel with %Q0.0 auxiliary feedback contact",
        "Set Coil (---(S)---): Latches the targeted boolean bit to logic 1 on a single TRUE scan; persists independently of future rung conditions",
        "Reset Coil (---(R)---): Unlatches the targeted boolean bit to logic 0 on a single TRUE scan, clearing previous latched states",
        "SR Flip-Flop Block (Set-Dominant): If both S and R1 inputs are TRUE simultaneously, the output Q remains latched TRUE (Set takes priority)",
        "RS Flip-Flop Block (Reset-Dominant): If both S1 and R inputs are TRUE simultaneously, the output Q is forced FALSE (Reset takes priority)",
        "Safety Engineering Standard: In safety-critical stop circuits, Reset-dominant (RS) logic or hardwired de-energization must always be utilized",
        "Edge Detection Integration: Triggering Set/Reset coils through one-shot edge instructions (P_TRIG / N_TRIG) prevents perpetual coil overwrite"
      ],
      note: "Avoid scattering multiple Set and Reset coils for the same bit address across different program blocks or distant networks. Uncoordinated S/R coils make online debugging notoriously difficult; prefer consolidated RS blocks or state machine registers."
    },
    {
      title: "2.3 Timers (TON, TOF, TP)",
      content: "IEC 61131-3 defines three standardized timer function blocks in the S7-1200, each backed by an internal Instance Data Block (IEC_Timer DB): TON (On-Delay Timer), TOF (Off-Delay Timer), and TP (Pulse Timer). The TON block delays the energization of an output: when the enable input (IN) transitions from FALSE to TRUE, the timer begins accumulating elapsed time (ET). When ET reaches the preset time (PT), the output (Q) turns TRUE and remains active until IN goes FALSE, which immediately resets ET to zero and drops Q to FALSE. The TOF block delays the de-energization of an output: when IN is TRUE, output Q is instantly TRUE; when IN transitions from TRUE to FALSE, timing begins, maintaining Q at TRUE until ET reaches PT, whereupon Q turns FALSE. The TP block generates an output pulse of exact duration PT: upon a rising edge at IN, output Q turns TRUE and timing commences; Q remains TRUE for the entire preset duration PT regardless of whether IN is released early or held on, after which Q drops FALSE.",
      keyPoints: [
        "IEC_Timer Instance Data Block: Every timer instantiation consumes a dedicated data block storing internal state, elapsed time, and status bits",
        "Preset Time (PT) Syntax: Expressed in IEC Time format: T#500ms, T#2s, T#1m30s, or T#1d (stored internally as a signed 32-bit millisecond integer)",
        "TON (On-Delay Timer): Delays output turn-on; timing begins on IN rising edge; Q goes TRUE when ET >= PT; resets immediately if IN goes FALSE",
        "TOF (Off-Delay Timer): Delays output turn-off; Q activates immediately with IN; timing begins on IN falling edge; Q turns FALSE when ET >= PT",
        "TP (Pulse Timer): Generates fixed-width pulse of duration PT upon IN rising edge; immune to input contact bounce or premature input release",
        "Elapsed Time (ET): Continuous output port exposing instantaneous running time in millisecond resolution, readable for HMI progress bars",
        "Flasher Generator Circuit: Two TON timers cascaded in a closed loop (Timer 1 reset by Timer 2) create deterministic symmetric or asymmetric square waves"
      ],
      note: "Do not attempt to pass an elapsed timer output (ET) to an analog actuator directly. ET is of data type TIME (milliseconds). To display timer countdowns on an HMI, divide ET by 1000 in a math block to convert milliseconds into integer seconds."
    },
    {
      title: "2.4 Counters (CTU, CTD, CTUD)",
      content: "Counting discrete occurrences—such as parts traversing a conveyor, machine cycles, or batch quantities—is implemented via standardized IEC 61131-3 counter function blocks: CTU (Count Up), CTD (Count Down), and CTUD (Bidirectional Count Up/Down). Each counter requires an Instance Data Block to store current count value (CV) and status flags. The CTU block monitors its count input (CU): on every rising edge (FALSE to TRUE transition), the current count value (CV) increments by 1. When CV becomes greater than or equal to the preset value (PV), the output flag (Q) evaluates TRUE. Asserting the Reset (R) input instantly forces CV to 0 and clears Q. The CTD block decrements CV on each rising edge of CD, initializing CV to PV when the Load (LD) input is pulsed; output Q turns TRUE when CV decrements to <= 0. The CTUD block combines both mechanisms with independent CU and CD clock inputs, separate QU and QD outputs, and simultaneous Reset and Load controls, making it ideal for tracking bidirectional storage buffers or parking garage capacity.",
      keyPoints: [
        "Edge-Triggered Clocking: Counters increment/decrement strictly on the rising edge of input pulses; steady-state TRUE inputs do not cause repeated counts",
        "Instance Data Block Architecture: Dedicated DB retains current count value (CV) across power interruptions if configured with retentive memory",
        "Data Type Flexibility: Supported integer types include SInt (8-bit, max 127), Int (16-bit, max 32,767), and DInt (32-bit, max 2.14 billion counts)",
        "CTU (Count Up): Increments CV on CU rising edge; Q activates when CV >= PV; Reset input (R) takes priority and forces CV = 0",
        "CTD (Count Down): Decrements CV on CD rising edge; Q activates when CV <= 0; Load input (LD) loads preset PV into CV",
        "CTUD (Bidirectional): Independent CU (up) and CD (down) inputs; QU flags over-target while QD flags empty buffer condition",
        "Counting Speed Limitation: Software IEC counters in OB1 are limited by the PLC scan cycle time (max reliable input frequency ~50 Hz); higher frequencies require hardware High-Speed Counters (HSC)"
      ],
      note: "If an optical sensor generates pulses narrower than the PLC scan cycle (e.g. small parts passing rapidly on a conveyor), an IEC counter in OB1 will miss counts! Use hardware High-Speed Counter (HSC) inputs or pulse-stretching sensor amplifiers for high-speed tracking."
    },
    {
      title: "2.5 Application Exercise",
      content: "This practical application synthesizes binary logic, timers, counters, and edge detection into a complete industrial workcell: an automated packaging line inspection and batch diversion station. The process operates as follows: an infeed conveyor motor (M1, %Q0.0) transports cartons past an optical part sensor (%I0.2). An inductive proximity sensor (%I0.3) inspects each carton for the presence of a metallic safety seal. As cartons pass, an IEC counter (CTU) increments the total production count. If a carton passes the optical sensor without triggering the metal proximity sensor, a defective-part condition is latched, and a TON timer initiates a calibrated delay matching the conveyor transit time to the reject pusher. When the timer elapses, a solenoid actuator (%Q0.1) pulses for 500 ms (via a TP timer) to divert the unsealed carton onto a reject chute. Upon reaching a batch count of 50 acceptable cartons, conveyor M1 halts, an acoustic buzzer (%Q0.2) sounds for 3 seconds via a TOF timer, and a packaging gate indexes the batch.",
      keyPoints: [
        "System State Decomposition: Break complex machine cycles into discrete states: Idle, Running, Rejecting, Batch Complete, and Fault",
        "Fail-Safe Interlocking: Hardwired NC emergency stop (%I0.0) and thermal motor overload (%I0.1) contacts precede all rung power flow",
        "Part Tracking Mechanism: Synchronize sensor edge detection with conveyor mechanical travel time using precision TON timers",
        "Defect Latching: Latch fault flags with Reset-dominant RS blocks; prevent machine restart until the reject bin is cleared and reset is pressed",
        "Batch Management: Automatic counter reset upon batch completion combined with totalizer accumulation in a non-volatile Global DB",
        "Structured Network Layout: Segregate code into logical networks: Network 1 (Safety & E-Stop), Network 2 (Conveyor Control), Network 3 (Inspection Logic), Network 4 (Pusher Actuation), Network 5 (Batch Counter)"
      ],
      note: "Always document each ladder network with descriptive titles and comment headers explaining the mechanical sequence. In factory commissioning, well-commented ladder logic reduces fault diagnosis time from hours to minutes."
    }
  ],
  review: [
    "Explain the functional difference between a Normally Open (NO) and Normally Closed (NC) contact in Ladder Diagram when evaluating a physical sensor.",
    "A physical emergency stop pushbutton with hardwired NC contacts is connected to digital input %I0.0. Should you use a NO or NC contact in your ladder logic rung? Justify your answer.",
    "Compare the operation of a traditional seal-in Start-Stop motor latch against Set (S) and Reset (R) coils. What occurs if both Set and Reset are active simultaneously?",
    "Draw the timing diagrams for TON (On-Delay), TOF (Off-Delay), and TP (Pulse) timers, clearly showing the relationship between input IN, output Q, and elapsed time ET.",
    "Why are software IEC counters in OB1 incapable of accurately counting pulses from high-speed rotary encoders operating at 10 kHz?",
    "Describe how two TON timers can be interconnected to create an oscillating flasher circuit for an industrial alarm beacon.",
    "In the batch diversion case study, explain how a TON timer and a TP timer work together to track and eject defective parts from a moving conveyor."
  ]
};

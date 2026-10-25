module.exports = {
  overview: "This lesson provides an advanced engineering exploration of closed-loop feedback control and Proportional-Integral-Derivative (PID) algorithm implementation using the Siemens S7-1200 controller. Continuous technological processes—chemical temperature regulation, clean-water pressure boosting, fluid tank level control, and chemical blending—require automatic compensation against uncontrolled plant disturbances. Students will examine the mathematical foundations of the PID algorithm (proportional gain Kp, integral time Ti, derivative time Td), the Siemens PID_Compact Technology Object architecture, execution within deterministic cyclic interrupts (OB30), anti-windup clamping, pre-tuning and fine-tuning auto-tuning algorithms, and manual override with bumpless transfer.",
  objectives: [
    "Model closed-loop process dynamics and mathematically formulate the standard ISA continuous and discrete PID control algorithms",
    "Analyze the independent and combined effects of Proportional (Kp), Integral (Ti), and Derivative (Td) terms on transient and steady-state response",
    "Instantiate and configure the PID_Compact Technology Object in TIA Portal, parameterizing setpoints, process variables, and manipulated outputs",
    "Assign and execute PID_Compact inside a deterministic Cyclic Interrupt (OB30) with configured sampling time Ts",
    "Configure analog physical scaling (Input_PER / Output_PER) and output limits with integrated integral anti-windup protection",
    "Execute automated Pre-Tuning and Fine-Tuning using the TIA Portal PID Commissioning Control Panel",
    "Implement Manual/Automatic mode selection and demonstrate bumpless transfer to prevent actuator bumps during mode switching"
  ],
  sections: [
    {
      title: "5.3 Designing a Closed-Loop Control System",
      content: "A closed-loop control system continuously measures the actual physical state of a technological process—the Process Variable (PV)—compares it against the desired target value—the Setpoint (SP)—and computes a Control Error: e(t) = SP(t) - PV(t). The controller calculates a corrective Manipulated Variable (MV / Output) directed to a physical actuator (such as a modulating control valve, electric heating element, or variable-speed pump). The standard continuous PID equation is formulated as: u(t) = Kp * [ e(t) + (1 / Ti) * ∫ e(τ) dτ + Td * (de(t) / dt) ]. The Proportional term (Kp) produces an output directly proportional to the current error; higher Kp increases responsiveness but can induce closed-loop instability and cannot eliminate steady-state offset alone. The Integral term (Ti) continuously integrates historical error over time, steadily driving the control output until steady-state error is completely eliminated (e(t) = 0). The Derivative term (Td) acts on the rate of change of the error, predicting future error trends to provide damping against rapid overshoots. In discrete microprocessor implementations (PLCs), the continuous equation is discretized using a fixed sampling time (Ts), requiring execution inside a strictly deterministic cyclic interrupt.",
      keyPoints: [
        "Closed-Loop Architecture: Setpoint (SP), Measurement Transmitter, Error Comparator, PID Controller, Final Control Element (Actuator), and Plant Dynamics",
        "Control Error Formulation: e(t) = SP(t) - PV(t); positive error indicates the process variable is below target; negative error indicates overshoot",
        "Proportional Gain (Kp): Accelerates loop response speed; proportional to current error; excessive gain causes high-frequency oscillations and instability",
        "Integral Time (Ti): Eliminates steady-state offset by accumulating error over time; smaller Ti produces more aggressive reset action; excessive integration causes slow hunting",
        "Derivative Time (Td): Provides anticipatory damping proportional to error slope; improves stability in sluggish thermal systems; highly sensitive to high-frequency sensor noise",
        "Discrete Sampling Period (Ts): The fixed time interval between consecutive algorithm executions; must be significantly faster than the process time constant (typically Ts <= 0.1 * Tau)",
        "Disturbance Rejection: The primary industrial purpose of closed loop control is maintaining PV at SP despite external load changes (e.g. cold fluid inrush into a heated vessel)"
      ],
      note: "Never use the Derivative term (Td) on noisy, fast-responding process variables such as flow rate or liquid pressure! High-frequency measurement noise will be amplified by the derivative derivative term (de/dt), causing erratic, violent chattering of modulating control valves."
    },
    {
      title: "PID_Compact on the S7-1200",
      content: "The Siemens S7-1200 provides the PID_Compact Technology Object: an industrial-grade, fully encapsulated closed-loop controller block implemented in firmware. PID_Compact executes inside a dedicated Cyclic Interrupt Organization Block (OB30), guaranteeing that algorithm iterations execute at exact, jitter-free temporal intervals (e.g. Ts = 100 ms). The block provides flexible signal interfacing: Setpoint can be supplied as a floating-point REAL value (e.g. 65.0°C from an HMI); Process Variable can be connected either as an already-scaled engineering REAL value via the 'Input' pin, or directly as a raw 16-bit analog integer via the 'Input_PER' pin (e.g. %IW64 directly from an RTD or 4–20mA transmitter). When using Input_PER, the Technology Object automatically handles analog quantization and scaling using parameters defined in its graphical configuration wizard. For manipulated outputs, PID_Compact supports three simultaneous formats: 'Output' (continuous 0.0% to 100.0% REAL for internal logic), 'Output_PER' (raw integer 0 to 27648 for analog output modules %QW64 driving control valves), and 'Output_PWM' (time-proportioned duty cycle for solid-state relays controlling industrial heaters).",
      keyPoints: [
        "Technology Object Architecture: Instantiated as an integrated block backed by an internal system Data Block (e.g. 'PID_Compact_1')",
        "Execution in Cyclic Interrupt (OB30): Guarantees strict deterministic execution at fixed sampling intervals (Ts); never call PID_Compact in OB1",
        "Input vs Input_PER: 'Input' accepts floating-point engineering units (e.g. 50.0 bar); 'Input_PER' accepts raw analog integer counts (%IW64) with integrated scaling",
        "Output vs Output_PER vs Output_PWM: Output (0.0–100.0% REAL), Output_PER (0–27648 integer for AQ), Output_PWM (digital pulse train for heaters)",
        "Integral Anti-Windup Protection: Automatically clamps the integral accumulator when actuator limits (0% or 100%) are reached, eliminating saturation recovery delays",
        "Deadband Support: Configurable error deadband suppresses minor actuator adjustments when the error is within acceptable plant tolerances (e.g. ±0.5°C)",
        "Direct/Reverse Acting Direction: Direct-acting (cooling loop: output increases as PV rises above SP); Reverse-acting (heating loop: output increases as PV falls below SP)"
      ],
      note: "Always verify the control direction (Direct vs Reverse) in PID_Compact properties! In heating processes, the loop is Reverse Acting (cooling requires less heat). If configured as Direct Acting, a drop in temperature will cause the PLC to turn OFF the heater, leading to thermal runaway in the wrong direction."
    },
    {
      title: "Pre-tuning, Fine-tuning and Commissioning",
      content: "Tuning PID parameters (Kp, Ti, Td) manually using trial-and-error in a live plant is tedious and risks destabilizing expensive machinery. TIA Portal integrates a comprehensive graphical PID Commissioning dashboard featuring real-time trend recording and built-in auto-tuning algorithms. PID_Compact supports five distinct operating modes: Inactive (Mode 0), Pre-Tuning (Mode 1), Fine-Tuning (Mode 2), Automatic Mode (Mode 3), and Manual Mode (Mode 4). Pre-Tuning executes an open-loop step response test: the controller applies an output step, measures process dead time (delay) and maximum rate of temperature/pressure rise (inflection point), and calculates baseline Kp, Ti, and Td parameters using an adapted Ziegler-Nichols algorithm. Fine-Tuning executes a closed-loop oscillation test around the current operating point: the controller introduces controlled limit-cycle oscillations, analyzes the natural oscillation period and amplitude, and optimizes the parameters for minimal overshoot and rapid disturbance rejection. In production, operators switch between Manual Mode (directly entering output percentage from the HMI) and Automatic Mode using Bumpless Transfer, which automatically pre-loads internal registers so the control valve does not jump when mode transitions occur.",
      keyPoints: [
        "TIA Portal Commissioning Dashboard: Interactive graphical panel displaying live trends of Setpoint (black), Process Variable (green), and Output (red)",
        "Pre-Tuning (Mode 1): Open-loop step excitation; analyzes plant dead time and inflection tangent; derives baseline Kp, Ti, Td parameters rapidly",
        "Fine-Tuning (Mode 2): Closed-loop oscillation method; induces small controlled limit-cycle oscillations; optimizes damping and eliminates overshoot",
        "Automatic Mode (Mode 3): Normal closed-loop execution continuously regulating PV to SP using active PID parameters",
        "Manual Mode (Mode 4): Overrides automatic calculation; operator manually enters fixed output percentage (0.0% to 100.0%) for maintenance",
        "Bumpless Transfer: When switching from Manual to Auto (or vice versa), the controller seamlessly matches internal states to prevent sudden valve movements",
        "Parameter Retention: Calculated auto-tuning parameters are permanently saved to non-volatile Load Memory upon operator confirmation"
      ],
      note: "Before initiating Pre-Tuning, ensure the process variable is in a steady state and far enough below the target setpoint to permit a step output! If Pre-Tuning is started when the process is already fluctuating or near setpoint, the tuning algorithm will abort with an error."
    }
  ],
  review: [
    "Mathematically explain the independent operational roles of Proportional Gain (Kp), Integral Time (Ti), and Derivative Time (Td) in a feedback loop.",
    "Why does pure Proportional control invariably leave a steady-state offset (droop), and how does the Integral term eliminate this error?",
    "Explain why PID_Compact must be called inside a Cyclic Interrupt (OB30) rather than inside the main cyclic organization block (OB1).",
    "Describe the difference between the 'Input' and 'Input_PER' pins on the PID_Compact instruction block.",
    "What is 'Integral Windup', what physical consequences does it have on a modulating control valve, and how does PID_Compact prevent it?",
    "Explain the engineering distinction between Pre-Tuning and Fine-Tuning in the TIA Portal PID commissioning dashboard.",
    "Define 'Bumpless Transfer' and explain why it is an essential safety feature when operating chemical plant control loops."
  ]
};

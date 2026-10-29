import { LessonContentFile } from '@/types/content';

export default {
  "slug": "09-high-speed-counting",
  "id": 9,
  "title": "High-Speed Counting and Pulse Output",
  "description": "Encoders, high-speed counters, PWM, position control with Motion Control",
  "course": "AUT207",
  "session": 2,
  "lab": "Lab 4",
  "clo": "G3",
  "module": 3,
  "topicOrder": [
    "encoder-basics",
    "high-speed-counter",
    "pwm-output",
    "motion-control",
    "analog-in-motion"
  ],
  "overview": "This lesson covers high-speed signal processing, rotary encoders, motion control, and pulse generation on the Siemens S7-1200 controller. Standard PLC cyclic inputs are constrained by the scan cycle time (max frequency ~50 Hz); however, industrial motion systems, conveyor line speed synchronization, and servo positioning generate pulse frequencies reaching tens or hundreds of kilohertz. Students will master the mechanical and optical operating principles of incremental encoders (quadrature A/B channels, Z index marker), hardware High-Speed Counters (HSC1–HSC6), Pulse Width Modulation (PWM) for heater and DC motor duty-cycle control, Pulse Train Output (PTO) for stepper and servo position control, and TIA Portal Motion Control Technology Objects complying with PLCopen standards.",
  "objectives": [
    "Explain the optical construction and signal waveforms of incremental rotary encoders, including quadrature phase shift and Z index pulses",
    "Configure on-board High-Speed Counters (HSC1–HSC6) in TIA Portal for single-phase, two-phase, and 4x quadrature counting up to 200 kHz",
    "Interface with HSC hardware registers programmatically using the CTRL_HSC instruction block and direct peripheral reads (%ID1000:P)",
    "Configure on-board pulse generators for Pulse Width Modulation (PWM) and modulate duty cycles dynamically using CTRL_PWM",
    "Configure Pulse Train Output (PTO) pulse generators and create Motion Control Axis Technology Objects (TO_Axis)",
    "Execute standardized PLCopen motion control blocks: MC_Power, MC_Reset, MC_Home, MC_MoveJog, MC_MoveAbsolute, and MC_MoveRelative",
    "Interface analog velocity setpoints (±10V) and closed-loop position transducers for variable frequency drives (VFDs) and servo systems"
  ],
  "review": [
    "Explain the optical operating principle of an incremental rotary encoder and describe how quadrature A/B channels determine rotational direction.",
    "What is the function of the Z index channel on an incremental encoder, and how is it used during machine homing?",
    "Why does an S7-1200 High-Speed Counter (HSC) require reducing the digital input filter time in CPU properties from the default 6.4 ms to 0.8 µs?",
    "Explain the mathematical principle of Quadrature 4x counting mode in an S7-1200 High-Speed Counter. What is the resulting count for a 500 PPR encoder?",
    "Compare the operational mechanisms and industrial application domains of Pulse Width Modulation (PWM) versus Pulse Train Output (PTO).",
    "Describe the sequential execution order of the PLCopen motion blocks (MC_Power, MC_Home, MC_MoveAbsolute) required to position a linear gantry.",
    "Explain how a closed-loop positioning system functions when commanding an AC variable frequency drive using a ±10V analog output reference."
  ]
} satisfies LessonContentFile;

import { LessonContentFile } from '@/types/content';

export default {
  "slug": "05-analog-signals",
  "id": 5,
  "title": "Analog Signal Processing",
  "description": "Analog signals, wiring analog I/O, S7-1200 analog modules, scaling and normalisation",
  "course": "AUT206",
  "session": 1,
  "lab": "Lab 5",
  "clo": "G3",
  "module": 2,
  "topicOrder": [
    "analog-signals",
    "analog-wiring",
    "analog-modules",
    "norm-scale"
  ],
  "overview": "This lesson provides a comprehensive treatment of continuous analog signal acquisition, electrical interfacing, hardware quantization, and mathematical scaling in the Siemens S7-1200 PLC. Industrial processes require measuring real-world variables—temperatures, tank levels, fluid pressures, and motor velocities—that vary continuously across a spectrum. Students will analyze the technical trade-offs between voltage loops (0–10V) and current loops (4–20mA), 2-wire vs 4-wire transmitter wiring, analog-to-digital converter (ADC) quantization, on-board and expansion analog modules, Siemens raw integer representation (0 to 27648), and mathematical signal conditioning using the NORM_X and SCALE_X instructions.",
  "objectives": [
    "Differentiate the physical characteristics and industrial noise immunity of 0–10V voltage loops versus 4–20mA current loops",
    "Wire 2-wire (loop-powered) and 4-wire (self-powered) analog transmitters to S7-1200 analog input channels with proper shield grounding",
    "Identify on-board analog I/O specifications and configure SM 1231, SM 1232, and SM 1234 analog expansion modules in TIA Portal",
    "Explain the internal conversion mechanics of 10-bit to 16-bit ADCs and map raw integer counts (0–27648) to physical voltages and currents",
    "Derive the mathematical normalization formula and configure the NORM_X instruction block",
    "Derive the mathematical engineering scaling formula and configure the SCALE_X instruction block for temperature, pressure, and level transmitters",
    "Implement analog input filtering and threshold alarm detection with software deadbands"
  ],
  "review": [
    "Compare the electrical advantages and disadvantages of 0–10V voltage signals versus 4–20mA current loops in noisy plant environments.",
    "Explain the 'Live Zero' principle in a 4–20mA loop. How does a PLC distinguish between a valid 0 bar tank measurement and a cut sensor cable?",
    "Describe the single-point grounding rule for shielded analog cables. What physical phenomenon occurs if both ends of the shield are grounded?",
    "Explain how an S7-1200 CPU with on-board 0–10V analog inputs (%IW64) can be adapted to read a 4–20mA industrial pressure transmitter.",
    "State the nominal integer count range used by Siemens S7-1200 analog input channels. What does integer count 27648 represent?",
    "Write out the mathematical formulas executed by NORM_X and SCALE_X. Trace the step-by-step transformation for an input of 13,824 counts on a 0–100°C RTD channel.",
    "Describe the reverse scaling pipeline required to command a proportional control valve (0–100% opening) connected to analog output %QW64."
  ]
} satisfies LessonContentFile;

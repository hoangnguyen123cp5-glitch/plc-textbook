import { LessonContentFile } from '@/types/content';

export default {
  "slug": "10-closed-loop-pid",
  "id": 10,
  "title": "Closed-Loop Control with PID",
  "description": "Closed-loop system design, PID_Compact, tuning and commissioning",
  "course": "AUT207",
  "session": 1,
  "lab": "Lab 5",
  "clo": "G3",
  "module": 3,
  "topicOrder": [
    "closed-loop-design",
    "pid-compact",
    "pid-tuning"
  ],
  "overview": "This lesson provides an advanced engineering exploration of closed-loop feedback control and Proportional-Integral-Derivative (PID) algorithm implementation using the Siemens S7-1200 controller. Continuous technological processes—chemical temperature regulation, clean-water pressure boosting, fluid tank level control, and chemical blending—require automatic compensation against uncontrolled plant disturbances. Students will examine the mathematical foundations of the PID algorithm (proportional gain Kp, integral time Ti, derivative time Td), the Siemens PID_Compact Technology Object architecture, execution within deterministic cyclic interrupts (OB30), anti-windup clamping, pre-tuning and fine-tuning auto-tuning algorithms, and manual override with bumpless transfer.",
  "objectives": [
    "Model closed-loop process dynamics and mathematically formulate the standard ISA continuous and discrete PID control algorithms",
    "Analyze the independent and combined effects of Proportional (Kp), Integral (Ti), and Derivative (Td) terms on transient and steady-state response",
    "Instantiate and configure the PID_Compact Technology Object in TIA Portal, parameterizing setpoints, process variables, and manipulated outputs",
    "Assign and execute PID_Compact inside a deterministic Cyclic Interrupt (OB30) with configured sampling time Ts",
    "Configure analog physical scaling (Input_PER / Output_PER) and output limits with integrated integral anti-windup protection",
    "Execute automated Pre-Tuning and Fine-Tuning using the TIA Portal PID Commissioning Control Panel",
    "Implement Manual/Automatic mode selection and demonstrate bumpless transfer to prevent actuator bumps during mode switching"
  ],
  "review": [
    "Mathematically explain the independent operational roles of Proportional Gain (Kp), Integral Time (Ti), and Derivative Time (Td) in a feedback loop.",
    "Why does pure Proportional control invariably leave a steady-state offset (droop), and how does the Integral term eliminate this error?",
    "Explain why PID_Compact must be called inside a Cyclic Interrupt (OB30) rather than inside the main cyclic organization block (OB1).",
    "Describe the difference between the 'Input' and 'Input_PER' pins on the PID_Compact instruction block.",
    "What is 'Integral Windup', what physical consequences does it have on a modulating control valve, and how does PID_Compact prevent it?",
    "Explain the engineering distinction between Pre-Tuning and Fine-Tuning in the TIA Portal PID commissioning dashboard.",
    "Define 'Bumpless Transfer' and explain why it is an essential safety feature when operating chemical plant control loops."
  ]
} satisfies LessonContentFile;

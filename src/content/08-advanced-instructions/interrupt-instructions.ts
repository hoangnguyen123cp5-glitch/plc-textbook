import { TopicContent } from '@/types/content';

export default {
  "slug": "interrupt-instructions",
  "sourceRef": "3.3",
  "title": "Interrupt-Handling Instructions",
  "durationMinutes": 12,
  "summary": "Standard cyclic execution in OB1 is governed by the scan cycle time (typically 2 ms to 15 ms).",
  "body": [
    {
      "heading": "3.3 Interrupt-Handling Instructions",
      "text": "Standard cyclic execution in OB1 is governed by the scan cycle time (typically 2 ms to 15 ms). However, high-speed industrial events—such as optical print-mark registration, emergency crash detection, and high-precision closed-loop PID control—cannot tolerate cyclic scan jitter. Siemens S7-1200 controllers solve this through an asynchronous interrupt architecture that preempts OB1 to execute specialized Organization Blocks immediately. Three major classes of interrupts exist: (1) Hardware Interrupts (OB40–OB47): Configured in digital input properties to trigger within microseconds upon a rising edge, falling edge, or both edges on high-speed input pins (%I0.0–%I0.3). (2) Cyclic Interrupts (OB30–OB38): Scheduled by high-precision internal hardware timers to execute at deterministic periodic intervals (e.g. every 10.0 ms), providing the jitter-free timebase required for PID control. (3) Diagnostic and Error Interrupts: OB82 (Diagnostic Interrupt, triggered by wire breaks or short circuits on analog/digital modules), OB86 (Rack/Station Failure, triggered by loss of a PROFINET node), and OB80 (Time Error, triggered if OB1 scan exceeds the watchdog timeout). Without error OBs in the project, field faults force the CPU into STOP mode.",
      "keyPoints": [
        "Preemptive Execution Architecture: An interrupt immediately pauses OB1 user code execution, executes the interrupt OB to completion, and resumes OB1 seamlessly",
        "Hardware Interrupts (OB40–OB47): Triggered by digital input signal transitions; response latency is typically < 50 microseconds; ideal for print mark sensors",
        "Cyclic Interrupts (OB30–OB38): Deterministic execution at microsecond/millisecond intervals (e.g. 10 ms for PID_Compact); unaffected by variations in OB1 cycle time",
        "Diagnostic Interrupt (OB82): Invoked when an expansion module detects an internal hardware fault, wire break, or power supply failure",
        "Module/Station Failure (OB86): Invoked when a remote PROFINET IO device or PROFIBUS slave drops offline, allowing the system to execute safe shutdown routines",
        "Time Error Interrupt (OB80): Invoked when cycle time exceeds configured watchdog limit (default 150 ms) or when cyclic interrupts overlap",
        "ATTACH and DETACH Instructions: Programmatically bind or unbind hardware interrupt events to specific OBs during machine mode transitions"
      ],
      "note": "To prevent minor field sensor wire breaks from shutting down an entire multi-million dollar plant, always insert empty or diagnostic OB82 and OB86 blocks into your TIA Portal project! If these error OBs are present in the CPU, the controller logs the fault and stays in RUN mode instead of immediately tripping into catastrophic STOP."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/08-advanced-instructions/PLC___Slide__021.png",
      "caption": "Figure 8.3: Asynchronous Interrupt Architecture: Hardware Edge Interrupts (OB40) & Cyclic Timers (OB30)"
    }
  ],
  "quiz": [
    {
      "q": "Why are Hardware Edge Interrupts (OB40) essential for high-speed part rejection sensors on bottling lines?",
      "options": [
        "OB40 immediately preempts OB1 to respond within microseconds, bypassing the delay of the normal cyclic scan",
        "OB40 uses less electrical energy",
        "OB40 increases memory capacity",
        "OB40 operates without sensors"
      ],
      "answer": 0,
      "explain": "Hardware interrupts trigger instantly on electrical signal edges, ensuring zero-latency response for high-speed sorting mechanisms."
    }
  ],
  "narration": {
    "vi": "Ngắt cho phép CPU tạm dừng OB1 để xử lý sự kiện khẩn cấp ngay lập tức. Ngắt thời gian dùng OB30 đến OB38, mỗi OB được gọi theo chu kỳ cố định bất kể vòng quét chính. Ví dụ OB35 mặc định gọi mỗi một trăm mili giây, dùng cho điều khiển PID. Ngắt phần cứng OB40 được kích khi có cạnh tín hiệu tại đầu vào ngắt chỉ định. Dùng ngắt khi cần phản hồi tức thời mà vòng quét thông thường không đáp ứng được yêu cầu thời gian.",
    "durationSec": 32,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Interrupt-Handling Instructions",
      "points": [
        "Preemptive Execution Architecture: An interrupt immediately pauses OB1 user code execution, executes the interrupt OB to completion, and resumes OB1 seamlessly",
        "Hardware Interrupts (OB40–OB47): Triggered by digital input signal transitions; response latency is typically < 50 microseconds; ideal for print mark sensors",
        "Cyclic Interrupts (OB30–OB38): Deterministic execution at microsecond/millisecond intervals (e.g. 10 ms for PID_Compact); unaffected by variations in OB1 cycle time",
        "Diagnostic Interrupt (OB82): Invoked when an expansion module detects an internal hardware fault, wire break, or power supply failure",
        "Module/Station Failure (OB86): Invoked when a remote PROFINET IO device or PROFIBUS slave drops offline, allowing the system to execute safe shutdown routines",
        "Time Error Interrupt (OB80): Invoked when cycle time exceeds configured watchdog limit (default 150 ms) or when cyclic interrupts overlap",
        "ATTACH and DETACH Instructions: Programmatically bind or unbind hardware interrupt events to specific OBs during machine mode transitions"
      ],
      "explain": "Standard cyclic execution in OB1 is governed by the scan cycle time (typically 2 ms to 15 ms). However, high-speed industrial events—such as optical print-mark registration, emergency crash detection, and high-precision closed-loop PID control—cannot tolerate cyclic scan jitter. Siemens S7-1200 controllers solve this through an asynchronous interrupt architecture that preempts OB1 to execute specialized Organization Blocks immediately. Three major classes of interrupts exist: (1) Hardware Interrupts (OB40–OB47): Configured in digital input properties to trigger within microseconds upon a rising edge, falling edge, or both edges on high-speed input pins (%I0.0–%I0.3). (2) Cyclic Interrupts (OB30–OB38): Scheduled by high-precision internal hardware timers to execute at deterministic periodic intervals (e.g. every 10.0 ms), providing the jitter-free timebase required for PID control. (3) Diagnostic and Error Interrupts: OB82 (Diagnostic Interrupt, triggered by wire breaks or short circuits on analog/digital modules), OB86 (Rack/Station Failure, triggered by loss of a PROFINET node), and OB80 (Time Error, triggered if OB1 scan exceeds the watchdog timeout). Without error OBs in the project, field faults force the CPU into STOP mode.",
      "figure": {
        "src": "/images/slides/08-advanced-instructions/PLC___Slide__021.png",
        "caption": "Figure 8.3: Asynchronous Interrupt Architecture: Hardware Edge Interrupts (OB40) & Cyclic Timers (OB30)"
      }
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

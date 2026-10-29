import { TopicContent } from '@/types/content';

export default {
  "slug": "scan-cycle",
  "sourceRef": "1.8",
  "title": "The Scan Cycle",
  "durationMinutes": 7,
  "summary": "A PLC does not execute program code once and terminate; rather, it loops perpetually through a deterministic, real-time sequence known as the Scan Cycle.",
  "body": [
    {
      "heading": "1.8 The PLC Scan Cycle and Process Image Tables",
      "text": "A PLC does not execute program code once and terminate; rather, it loops perpetually through a deterministic, real-time sequence known as the Scan Cycle. A standard scan cycle comprises 4 sequential phases: (1) Input Scan: The CPU polls all physical input terminals and snapshots their instantaneous states into the Process Image Input (PII) memory buffer; (2) Program Execution: The CPU evaluates user networks in OB1 top-to-bottom, reading exclusively from PII and storing intermediate results in local memory and the Process Image Output (PIQ); (3) Housekeeping & Diagnostics: The CPU performs internal self-tests and processes communication requests from TIA Portal and HMI panels; (4) Output Scan: The CPU writes the contents of PIQ simultaneously to the physical output hardware terminals. Because logic evaluates the PII snapshot rather than physical pins directly, transient input pulses narrower than the scan time can be completely missed by the CPU.",
      "keyPoints": [
        "Phase 1 (Input Scan): Transfers instantaneous states of all physical digital inputs into the PII RAM table",
        "Phase 2 (Program Execution): The CPU evaluates OB1 networks sequentially; ensures data consistency across the entire rung execution",
        "Phase 3 (Housekeeping & Comms): Services background self-tests, PROFINET network stacks, and HMI polling requests",
        "Phase 4 (Output Scan): Transfers the contents of the PIQ image table to physical relay/transistor output terminals",
        "\"Last-Write Wins\" Principle: If a digital coil %Q0.0 is written TRUE in Network 1, but overwritten FALSE in Network 5 within the same scan, the physical output will be DE-ENERGIZED!",
        "Immediate I/O (e.g. %I0.0:P, %Q0.0:P): Bypasses image tables to access physical hardware pins immediately, but incurs CPU scan time penalties"
      ],
      "note": "Typical PLC scan times range from 1ms to 10ms depending on code length. High-speed pulse trains from incremental encoders (tens of kHz) must be handled by dedicated on-chip High-Speed Counters (HSC), never by software counter instructions in OB1."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/plc-scan-cycle.jpg",
      "caption": "Figure 1.8: Deterministic 4-Phase PLC Scan Cycle & Process Image Registers (PII / PIQ)"
    }
  ],
  "caseStudy": {
    "title": "Eliminating Race Conditions via Process Image Input/Output (PII / PIQ) Buffers",
    "context": "If a PLC read physical hardware input pins continuously during program execution, an emergency stop button released midway through a 5 ms scan would result in Network 1 evaluating the button as pressed (STOP), while Network 50 evaluated it as released (RUN), creating severe operational race conditions. The deterministic PLC scan cycle eliminates this risk: At the start of the scan, the CPU takes an instantaneous snapshot of all physical inputs into the Process Image Input (PII) table; all logic rungs evaluate against this consistent snapshot throughout the cycle.",
    "hardware": [
      "Phase 1: Read physical input terminals ➔ Update Process Image Input (PII) table",
      "Phase 2: Execute user program sequentially top-to-bottom (OB1, FC, FB)",
      "Phase 3: Execute internal housekeeping, PROFINET network communications, and diagnostics",
      "Phase 4: Write Process Image Output (PIQ) table simultaneously to physical output terminals"
    ],
    "pitfall": "The Double Coil Fault: If output %Q0.0 is assigned to coils in two different rungs, the physical output will ALWAYS follow the state of the final rung, because physical outputs only update from PIQ at the end of the scan."
  },
  "quiz": [
    {
      "q": "During which phase of the PLC scan cycle are physical output screw terminals updated?",
      "options": [
        "Phase 1: Input Scan",
        "Phase 2: Program Execution",
        "Phase 3: Housekeeping & Comms",
        "Phase 4: Output Scan (from PIQ table)"
      ],
      "answer": 3,
      "explain": "The CPU writes the entire contents of the Process Image Output (PIQ) table to the physical output hardware simultaneously during Phase 4."
    },
    {
      "q": "What occurs if an input pulse duration is 0.5 ms while the PLC scan cycle time is 10 ms?",
      "options": [
        "The CPU automatically stretches the pulse",
        "The input pulse may be completely missed unless a High-Speed Counter (HSC) or interrupt is used",
        "The CPU trips into STOP mode",
        "The pulse is buffered in Load Memory"
      ],
      "answer": 1,
      "explain": "Because standard inputs are only sampled once per scan cycle (Phase 1), transient pulses shorter than the cycle time are completely aliased and lost."
    }
  ],
  "narration": {
    "vi": "PLC không chạy chương trình một lần rồi dừng. Nó lặp liên tục theo chu kỳ quét. Mỗi chu kỳ gồm bốn bước: đọc trạng thái đầu vào vào vùng nhớ ảo, thực thi chương trình từ đầu đến cuối, xử lý truyền thông và tự chẩn đoán, cuối cùng ghi kết quả ra đầu ra vật lý. Chu kỳ này lặp lại hàng nghìn lần mỗi giây.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-10"
  },
  "status": "review"
} satisfies TopicContent;

import { TopicContent } from '@/types/content';

export default {
  "slug": "diagnostic-buffer",
  "title": "Reading the Diagnostic Buffer",
  "durationMinutes": 7,
  "summary": "The Diagnostic Buffer is the definitive forensic authority inside every SIMATIC CPU.",
  "body": [
    {
      "heading": "Reading the Diagnostic Buffer",
      "text": "The Diagnostic Buffer is the definitive forensic authority inside every SIMATIC CPU. It is a non-volatile, circular event memory buffer that continuously logs significant operating system and hardware events in chronological order with microsecond timestamps synchronized to the CPU real-time clock. Events recorded include: CPU operating mode transitions (STOP to RUN, RUN to STOP), hardware component failures (broken sensor wire, missing expansion module, power supply dropout), PROFINET network node disconnections, and software programming errors (division by zero, array index out of bounds, memory address area length errors, cycle execution time exceeded). To access it in TIA Portal, select the CPU in the Project Tree and click 'Online & Diagnostics' -> 'Diagnostic Buffer'. Each entry displays an event number, precise timestamp, clear-text description, and a 'Help on event' button explaining the probable root cause and recommended corrective action. Crucially, the diagnostic buffer records the exact Organization Block, Function, and Network number where a runtime software exception occurred, allowing engineers to jump directly to the faulty line of code.",
      "keyPoints": [
        "Non-Volatile Event Memory: Retains the last 50 to 500 system events (depending on CPU model) across complete power interruptions",
        "Detailed Event Anatomy: Event ID, Date & Timestamp (synchronized via RTC/NTP), Operating Mode, Clear-Text Event Description, and Block Call Stack",
        "One-Click Fault Navigation: Clicking 'Open in editor' jumps directly to the exact ladder network or SCL line that triggered the runtime exception",
        "Error Organization Blocks: If a programming or hardware fault occurs, the CPU attempts to call a specific error OB (e.g. OB82, OB86, OB122)",
        "Preventing CPU STOP Trips: If the corresponding error OB is present in the CPU, the controller executes the error handler and remains in RUN mode",
        "Fatal Watchdog Trips (OB80): Triggered when cyclic program execution time exceeds the configured cycle monitoring time (default 150 ms)",
        "Exporting Diagnostic Logs: Diagnostic buffer records can be exported directly to text or CSV files for vendor warranty claims and incident reports"
      ],
      "note": "When an S7-1200 CPU trips unexpectedly into STOP mode, do NOT immediately cycle the power supply or press the RUN button! Cycling power can erase secondary temporary fault markers. Always connect with TIA Portal first and inspect the Diagnostic Buffer to read the exact timestamped cause of the trip."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/12-fault-diagnostics/PLC___Slide__004.png",
      "caption": "Figure 12.2: CPU Diagnostic Buffer: Timestamped Event Log & Error Organization Blocks (OB82, OB86)"
    }
  ],
  "quiz": [
    {
      "q": "How is event information organized inside the CPU Diagnostic Buffer?",
      "options": [
        "Chronologically with precise millisecond timestamps, operating state transitions, and hexadecimal event codes",
        "Alphabetically by tag name",
        "Grouped by ladder rung number",
        "Randomly"
      ],
      "answer": 0,
      "explain": "The diagnostic buffer is a ring buffer recording system events, OB executions, wire breaks, and power losses in strict chronological sequence."
    }
  ],
  "narration": {
    "vi": "Diagnostic Buffer là nhật ký sự kiện lưu trong CPU, ghi lại tất cả lỗi và cảnh báo theo thứ tự thời gian. Khi có sự cố, đây là nơi đầu tiên bạn nên xem. Mỗi mục gồm nhãn thời gian, loại sự kiện và mô tả nguyên nhân. Nhờ buffer này bạn biết lỗi xảy ra lúc mấy giờ, lỗi gì, và module nào gây ra — rất quan trọng khi cần phân tích sau sự cố.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Reading the Diagnostic Buffer",
      "points": [
        "Non-Volatile Event Memory: Retains the last 50 to 500 system events (depending on CPU model) across complete power interruptions",
        "Detailed Event Anatomy: Event ID, Date & Timestamp (synchronized via RTC/NTP), Operating Mode, Clear-Text Event Description, and Block Call Stack",
        "One-Click Fault Navigation: Clicking 'Open in editor' jumps directly to the exact ladder network or SCL line that triggered the runtime exception",
        "Error Organization Blocks: If a programming or hardware fault occurs, the CPU attempts to call a specific error OB (e.g. OB82, OB86, OB122)",
        "Preventing CPU STOP Trips: If the corresponding error OB is present in the CPU, the controller executes the error handler and remains in RUN mode",
        "Fatal Watchdog Trips (OB80): Triggered when cyclic program execution time exceeds the configured cycle monitoring time (default 150 ms)",
        "Exporting Diagnostic Logs: Diagnostic buffer records can be exported directly to text or CSV files for vendor warranty claims and incident reports"
      ],
      "explain": "The Diagnostic Buffer is the definitive forensic authority inside every SIMATIC CPU. It is a non-volatile, circular event memory buffer that continuously logs significant operating system and hardware events in chronological order with microsecond timestamps synchronized to the CPU real-time clock. Events recorded include: CPU operating mode transitions (STOP to RUN, RUN to STOP), hardware component failures (broken sensor wire, missing expansion module, power supply dropout), PROFINET network node disconnections, and software programming errors (division by zero, array index out of bounds, memory address area length errors, cycle execution time exceeded). To access it in TIA Portal, select the CPU in the Project Tree and click 'Online & Diagnostics' -> 'Diagnostic Buffer'. Each entry displays an event number, precise timestamp, clear-text description, and a 'Help on event' button explaining the probable root cause and recommended corrective action. Crucially, the diagnostic buffer records the exact Organization Block, Function, and Network number where a runtime software exception occurred, allowing engineers to jump directly to the faulty line of code.",
      "figure": {
        "src": "/images/slides/12-fault-diagnostics/PLC___Slide__004.png",
        "caption": "Figure 12.2: CPU Diagnostic Buffer: Timestamped Event Log & Error Organization Blocks (OB82, OB86)"
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

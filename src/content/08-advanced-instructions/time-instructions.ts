import { TopicContent } from '@/types/content';

export default {
  "slug": "time-instructions",
  "sourceRef": "3.1",
  "title": "Time-Handling Instructions",
  "durationMinutes": 14,
  "summary": "Precision time tracking and calendar-based automation are fundamental requirements across food & beverage, pharmaceutical, and batch processing industries.",
  "body": [
    {
      "heading": "3.1 Time-Handling Instructions",
      "text": "Precision time tracking and calendar-based automation are fundamental requirements across food & beverage, pharmaceutical, and batch processing industries. The S7-1200 provides dedicated instructions for measuring high-speed operational durations and computing calendar differences. The TIME_TCK (Time Tick) instruction reads the internal CPU system timer: an unsigned 32-bit millisecond counter that increments continuously from 0 to 2,147,483,647 ms, allowing microsecond-accurate benchmark timing of machine cycles by evaluating: Elapsed_Time = End_Tick - Start_Tick. For calendar dates and times, TIA Portal provides temporal arithmetic functions operating on the DTL (Date and Time Long) and TIME data types: T_ADD adds a duration (TIME) to a timestamp (DTL); T_SUB subtracts a duration from a timestamp or computes the difference between two timestamps; and T_DIFF calculates the exact time difference (in TIME format) between two DTL dates. Furthermore, Time-of-Day Interrupts (OB10) can be configured in CPU properties to trigger cyclic or one-shot program execution at exact calendar dates and times (e.g. running an automated clean-in-place CIP sequence every Sunday at 02:00:00).",
      "keyPoints": [
        "TIME_TCK Instruction: Reads the continuous internal millisecond clock; wraps around after ~24.8 days; ideal for calculating machine cycle execution time",
        "T_ADD Block: Adds a time interval (TIME) to a calendar date/time (DTL) yielding a future DTL timestamp",
        "T_SUB Block: Subtracts a time interval from a DTL timestamp, or subtracts two DTL timestamps yielding the elapsed interval as a TIME value",
        "T_DIFF Block: Computes the precise temporal duration between two DTL calendar dates; output is formatted in TIME (milliseconds)",
        "Time-of-Day Organization Block (OB10): Operating system interrupt invoked automatically at a configured calendar time; supports Daily, Weekly, or Monthly repetition",
        "SET_TINT and ACT_TINT Instructions: Dynamically configure and activate time-of-day interrupt parameters directly from runtime PLC ladder code",
        "Equipment Runtime Tracking: Measure pump and compressor operating hours by accumulating running seconds into retentive double-word registers"
      ],
      "note": "When using TIME_TCK to benchmark execution durations, always account for counter rollover! Because the 32-bit counter rolls over from +2,147,483,647 to 0, compute elapsed time using unsigned modular subtraction to avoid negative duration errors."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/08-advanced-instructions/PLC___Slide__009.jpg",
      "caption": "Figure 8.1: High-Resolution Timestamp Calculations (TIME_TCK) & Time-of-Day Interrupts (OB10)"
    }
  ],
  "quiz": [
    {
      "q": "Which organization block executes automatically at a specific scheduled time of day (e.g. daily at 02:00)?",
      "options": [
        "OB1 (Main Cycle)",
        "OB10 (Time-of-Day Interrupt)",
        "OB82 (Diagnostic Interrupt)",
        "OB100 (Startup)"
      ],
      "answer": 1,
      "explain": "OB10 is a Time-of-Day interrupt configured to execute periodically at exact calendar dates or daily scheduled timestamps."
    }
  ],
  "narration": {
    "vi": "Trong mục này, chúng ta học các lệnh xử lý thời gian nâng cao. RD_SYS_T đọc thời gian hệ thống hiện tại kiểu DTL. T_ADD cộng thêm một khoảng thời gian TIME vào giá trị DTL, hữu ích khi cần tính thời điểm hết hạn. T_DIFF tính khoảng cách giữa hai mốc thời gian DTL và trả về kiểu TIME. Kết hợp ba lệnh này, bạn có thể xây dựng lịch vận hành tự động theo ngày giờ thực mà không cần thêm module đồng hồ ngoài.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Time-Handling Instructions",
      "points": [
        "TIME_TCK Instruction: Reads the continuous internal millisecond clock; wraps around after ~24.8 days; ideal for calculating machine cycle execution time",
        "T_ADD Block: Adds a time interval (TIME) to a calendar date/time (DTL) yielding a future DTL timestamp",
        "T_SUB Block: Subtracts a time interval from a DTL timestamp, or subtracts two DTL timestamps yielding the elapsed interval as a TIME value",
        "T_DIFF Block: Computes the precise temporal duration between two DTL calendar dates; output is formatted in TIME (milliseconds)",
        "Time-of-Day Organization Block (OB10): Operating system interrupt invoked automatically at a configured calendar time; supports Daily, Weekly, or Monthly repetition",
        "SET_TINT and ACT_TINT Instructions: Dynamically configure and activate time-of-day interrupt parameters directly from runtime PLC ladder code",
        "Equipment Runtime Tracking: Measure pump and compressor operating hours by accumulating running seconds into retentive double-word registers"
      ],
      "explain": "Precision time tracking and calendar-based automation are fundamental requirements across food & beverage, pharmaceutical, and batch processing industries. The S7-1200 provides dedicated instructions for measuring high-speed operational durations and computing calendar differences. The TIME_TCK (Time Tick) instruction reads the internal CPU system timer: an unsigned 32-bit millisecond counter that increments continuously from 0 to 2,147,483,647 ms, allowing microsecond-accurate benchmark timing of machine cycles by evaluating: Elapsed_Time = End_Tick - Start_Tick. For calendar dates and times, TIA Portal provides temporal arithmetic functions operating on the DTL (Date and Time Long) and TIME data types: T_ADD adds a duration (TIME) to a timestamp (DTL); T_SUB subtracts a duration from a timestamp or computes the difference between two timestamps; and T_DIFF calculates the exact time difference (in TIME format) between two DTL dates. Furthermore, Time-of-Day Interrupts (OB10) can be configured in CPU properties to trigger cyclic or one-shot program execution at exact calendar dates and times (e.g. running an automated clean-in-place CIP sequence every Sunday at 02:00:00).",
      "figure": {
        "src": "/images/slides/08-advanced-instructions/PLC___Slide__009.jpg",
        "caption": "Figure 8.1: High-Resolution Timestamp Calculations (TIME_TCK) & Time-of-Day Interrupts (OB10)"
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

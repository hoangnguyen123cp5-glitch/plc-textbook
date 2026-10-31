import { TopicContent } from '@/types/content';

export default {
  "slug": "real-time-clock",
  "sourceRef": "3.5",
  "title": "Real-Time Clock",
  "durationMinutes": 6,
  "summary": "The S7-1200 CPU incorporates an on-board hardware Real-Time Clock (RTC) backed by a high-capacity supercapacitor that maintains current date and time for up to 20 days during complete electrical po...",
  "body": [
    {
      "heading": "3.5 Real-Time Clock",
      "text": "The S7-1200 CPU incorporates an on-board hardware Real-Time Clock (RTC) backed by a high-capacity supercapacitor that maintains current date and time for up to 20 days during complete electrical power failure. In TIA Portal, calendar and time data is represented by the DTL (Date and Time Long) structured data type, a 12-byte structure containing: Year (UInt), Month (USInt), Day (USInt), Weekday (USInt, 1=Sunday to 7=Saturday), Hour (USInt), Minute (USInt), Second (USInt), and Nanosecond (UDInt). Siemens provides system functions for clock interaction: RD_SYS_T reads Coordinated Universal Time (UTC) directly from the hardware clock; RD_LOC_T reads local time accounting for time zone offsets and daylight saving time (DST) rules; and WR_SYS_T writes a new time stamp to the hardware clock. Industrial applications utilize the RTC for automated time-of-day shift scheduling, logging production hourly totals to non-volatile memory, calculating equipment runtime hours for preventive maintenance schedules, and time-stamping fault events in diagnostic alarm logs.",
      "keyPoints": [
        "Hardware RTC Supercapacitor: Retains clock operation and calendar advancement for typically 20 days at 25°C without external 24VDC power",
        "DTL Structure Components: 12-byte composite tag comprising Year, Month, Day, Weekday, Hour, Minute, Second, and Nanoseconds",
        "RD_SYS_T (Read System Time): Retrieves current UTC time from hardware RTC into a DTL tag; executed with minimal CPU overhead",
        "RD_LOC_T (Read Local Time): Retrieves local time adjusted for configured regional time zone and daylight saving daylight shifts",
        "WR_SYS_T (Write System Time): Updates the CPU hardware clock from an HMI input or an automated network NTP time server",
        "Time-of-Day Interrupts (OB10): Can be scheduled to execute at exact calendar dates/times (e.g. daily at 06:00:00 for morning shift reset)",
        "Operational Hour Logging: Measuring pump runtime hours by accumulating running seconds from the RTC into retentive double-word registers"
      ],
      "note": "For facilities with multiple PLCs and HMIs, always configure Network Time Protocol (NTP) synchronization in the CPU PROFINET properties. NTP ensures that all controllers across the plant floor share millisecond-synchronized clocks, making cross-machine event logging and fault root-cause analysis accurate."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/04-numeric-operations/04-num_carved_001.jpg",
      "caption": "Figure 4.5: Hardware Real-Time Clock (RTC) Architecture, DTL Structure, and System Functions (RD_SYS_T)"
    }
  ],
  "quiz": [
    {
      "q": "What Siemens system data type structure holds complete Date and Time (Year, Month, Day, Hour, Minute, Second, Nanosecond)?",
      "options": [
        "TIME",
        "DTL (Date and Time Long)",
        "SINT",
        "LWORD"
      ],
      "answer": 1,
      "explain": "DTL is a 12-byte structured data type holding year (UINT), month (USINT), day, weekday, hour, minute, second, and nanoseconds."
    }
  ],
  "narration": {
    "vi": "CPU S7-1200 có đồng hồ thời gian thực tích hợp, cho phép đọc ngày giờ hiện tại từ chương trình. Lệnh RD_SYS_T đọc thời gian hệ thống và trả về giá trị kiểu DTL gồm năm, tháng, ngày, giờ, phút và giây. Bạn có thể dùng thông tin này để tạo lịch vận hành tự động — chẳng hạn bật đèn lúc sáu giờ sáng và tắt lúc mười giờ đêm mà không cần timer vật lý bên ngoài.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Real-Time Clock",
      "points": [
        "Hardware RTC Supercapacitor: Retains clock operation and calendar advancement for typically 20 days at 25°C without external 24VDC power",
        "DTL Structure Components: 12-byte composite tag comprising Year, Month, Day, Weekday, Hour, Minute, Second, and Nanoseconds",
        "RD_SYS_T (Read System Time): Retrieves current UTC time from hardware RTC into a DTL tag; executed with minimal CPU overhead",
        "RD_LOC_T (Read Local Time): Retrieves local time adjusted for configured regional time zone and daylight saving daylight shifts",
        "WR_SYS_T (Write System Time): Updates the CPU hardware clock from an HMI input or an automated network NTP time server",
        "Time-of-Day Interrupts (OB10): Can be scheduled to execute at exact calendar dates/times (e.g. daily at 06:00:00 for morning shift reset)",
        "Operational Hour Logging: Measuring pump runtime hours by accumulating running seconds from the RTC into retentive double-word registers"
      ],
      "explain": "The S7-1200 CPU incorporates an on-board hardware Real-Time Clock (RTC) backed by a high-capacity supercapacitor that maintains current date and time for up to 20 days during complete electrical power failure. In TIA Portal, calendar and time data is represented by the DTL (Date and Time Long) structured data type, a 12-byte structure containing: Year (UInt), Month (USInt), Day (USInt), Weekday (USInt, 1=Sunday to 7=Saturday), Hour (USInt), Minute (USInt), Second (USInt), and Nanosecond (UDInt). Siemens provides system functions for clock interaction: RD_SYS_T reads Coordinated Universal Time (UTC) directly from the hardware clock; RD_LOC_T reads local time accounting for time zone offsets and daylight saving time (DST) rules; and WR_SYS_T writes a new time stamp to the hardware clock. Industrial applications utilize the RTC for automated time-of-day shift scheduling, logging production hourly totals to non-volatile memory, calculating equipment runtime hours for preventive maintenance schedules, and time-stamping fault events in diagnostic alarm logs.",
      "figure": {
        "src": "/images/slides/04-numeric-operations/04-num_carved_001.jpg",
        "caption": "Figure 4.5: Hardware Real-Time Clock (RTC) Architecture, DTL Structure, and System Functions (RD_SYS_T)"
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

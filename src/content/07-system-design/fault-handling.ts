import { TopicContent } from '@/types/content';

export default {
  "slug": "fault-handling",
  "sourceRef": "6.5",
  "title": "Troubleshooting a PLC Control System",
  "durationMinutes": 10,
  "summary": "When an automated machine fails to operate during commissioning or live plant production, the automation engineer must execute a disciplined, systematic troubleshooting protocol rather than guessing.",
  "body": [
    {
      "heading": "6.5 Troubleshooting a PLC Control System",
      "text": "When an automated machine fails to operate during commissioning or live plant production, the automation engineer must execute a disciplined, systematic troubleshooting protocol rather than guessing. The troubleshooting methodology follows a 5-step hierarchy: Step 1: Physical Power and Safety Inspection. Verify line voltage and 24VDC power supply output with a calibrated multimeter; verify that all hardwired emergency stops and safety gates are closed. Step 2: CPU Front-Panel Status LED Analysis. Inspect RUN/STOP (green=running, amber=stopped), ERROR (flashing red indicates hardware/software fault), and MAINT LEDs. Step 3: Diagnostic Buffer Interrogation. Go online with TIA Portal (Ctrl+M) and open the CPU Diagnostic Buffer; read the timestamped event log to pinpoint the exact failure (e.g. missing expansion card, wire break on channel %IW68, or cycle time exceeded). Step 4: Watch Table and Signal Tracing. Open Watch Tables to monitor live states of inputs and internal state registers; compare physical LED status on the module with software bit values to isolate field wiring breaks from software logic blocks. Step 5: Peripheral Point Testing. Use Force Tables with caution or temporary test rungs to verify physical actuator actuation.",
      "keyPoints": [
        "Systematic 5-Step Diagnostic Protocol: Power Rails -> Front-Panel LEDs -> CPU Diagnostic Buffer -> Watch Tables -> Multimeter Signal Tracing",
        "Multimeter Voltage Verification: Measure 24VDC power supply under load (allowable range 20.4V to 28.8V); measure voltage directly across input terminal and 1M",
        "Diagnostic Buffer Log: The primary diagnostic authority; non-volatile event stack recording exact failure descriptions, timestamps, and OB call references",
        "Hardware vs Software Fault Isolation: If an input LED illuminates on the CPU faceplate but the tag in TIA Portal remains FALSE, the issue is software configuration or operating mode",
        "Watch Table Signal Tracing: Real-time monitoring of machine state registers, interlock conditions, and timer elapsed values to pinpoint stalled transitions",
        "Multimeter Resistance Testing: Always de-energize and isolate circuits before measuring loop resistance or testing for contact closure",
        "Preventive Maintenance Protocols: Periodically check terminal screw torque (0.5 Nm), clean enclosure air filters, inspect DC voltage ripple, and maintain backups"
      ],
      "note": "Never clear a fault in the CPU Diagnostic Buffer without identifying and resolving its physical root cause! Repeatedly restarting a tripped PLC without fixing an underlying sensor short or motor overload will inevitably lead to hardware component destruction or plant accidents."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/07-system-design/PLC__Slide_7_022.png",
      "caption": "Figure 7.5: 5-Step Systematic Control Panel Troubleshooting & Multimeter Signal Tracing Protocol"
    }
  ],
  "quiz": [
    {
      "q": "What is the first step in systematic troubleshooting when an automated machine stops unexpectedly?",
      "options": [
        "Immediately rewrite the PLC program",
        "Observe CPU status LEDs (RUN, ERROR, MAINT) and consult the TIA Portal Diagnostic Buffer",
        "Replace all proximity sensors",
        "Power cycle the factory substation"
      ],
      "answer": 1,
      "explain": "The diagnostic buffer logs exact hardware events, timestamped wire breaks, and fault OB calls, pinpointing the root cause in seconds."
    }
  ],
  "narration": {
    "vi": "Xử lý sự cố PLC theo quy trình sáu bước giúp tiết kiệm thời gian. Bước một, quan sát đèn LED trên CPU và module để xác định vùng lỗi. Bước hai, kết nối TIA Portal và đọc diagnostic buffer để xem thông báo lỗi chi tiết. Bước ba, kiểm tra nguồn cấp cho CPU và các module. Bước bốn, kiểm tra tín hiệu vào ra bằng Watch Table. Bước năm, xem xét lại logic chương trình tại vùng nghi ngờ. Bước sáu, ghi lại nguyên nhân và biện pháp khắc phục để phòng ngừa tái diễn.",
    "durationSec": 34,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

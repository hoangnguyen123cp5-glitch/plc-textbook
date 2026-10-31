import { TopicContent } from '@/types/content';

export default {
  "slug": "verify-wiring",
  "sourceRef": "1.6",
  "title": "Verifying Wiring in Software",
  "durationMinutes": 8,
  "summary": "Once physical wiring is terminated, the automation engineer must systematically verify every field channel before commissioning software logic.",
  "body": [
    {
      "heading": "1.6 Verifying Wiring in Software",
      "text": "Once physical wiring is terminated, the automation engineer must systematically verify every field channel before commissioning software logic. The S7-1200 front panel provides discrete green status LEDs for every physical input (%I0.0–%I1.5) and output (%Q0.0–%Q1.1) terminal. A green input LED indicates that the electrical threshold (typically >15VDC for logic '1') is present across the terminal and its 1M common. In TIA Portal, the engineer navigates online and utilizes Watch Tables (monitoring live bit values in real time) and Force Tables (manually asserting physical states) to validate loop integrity. By actuating field pushbuttons, limit switches, and photoelectric sensors, the live boolean state can be witnessed simultaneously on the physical LED and in the TIA Portal Watch Table. Similarly, digital outputs can be individually toggled via Watch Table modify commands to verify that the corresponding interposing relay clicks, the solenoid valve fires, and the motor contactor pulls in cleanly.",
      "keyPoints": [
        "Hardware LED Telemetry: The green LED indicates electrical potential at the screw terminal, confirming field loop continuity before software execution",
        "Watch Tables: Allow non-invasive live monitoring and one-shot modifying of bit markers (%M), process inputs (%I), process outputs (%Q), and DB tags",
        "Force Table Safety: Forcing overrides both user program logic and process images by writing directly to peripheral hardware; indicated by flashing yellow FORCE LED",
        "Point-to-Point Loop Check: Rigorous commissioning protocol where two technicians (one in field, one in TIA Portal) verify 100% of physical sensor channels",
        "Cross-Reference List: TIA Portal tool (Shift+F11) revealing every occurrence where a specific tag is read or written, detecting destructive dual-coil conflicts",
        "Peripheral Addressing (:P): Using %I0.0:P or %Q0.0:P reads or writes directly to physical hardware, bypassing image tables for immediate signal validation"
      ],
      "note": "Never leave a machine in 'Force' mode after testing! The Force function locks physical outputs regardless of emergency stops or safety rungs in your program, presenting severe hazard to personnel and machinery."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__031.png",
      "caption": "Figure 2.4: Online Wiring Verification: Hardware Status LEDs, Watch Tables, and Signal Diagnostics"
    }
  ],
  "caseStudy": {
    "title": "I/O Checkout Before First Run: Watch Table, Not Force",
    "context": "Before the first test run of a pick-and-place station, a two-person team checks every channel. One person operates the field device (pushbuttons, reed switches, light curtain) while the other watches the CPU front LEDs and the online watch table, ticking each address off the I/O list. For outputs, the program is not yet loaded, so a Modify command in the watch table sets each %Q bit while the field person confirms the relay clicks and the valve moves. One technician then forces %Q0.4 to test a cylinder, finishes the shift, and forgets to remove the force: the next day the cylinder extends regardless of the program logic, and the yellow MAINT LED on the CPU is lit.",
    "hardware": [
      "Watch table: monitor %I bits live and use Modify to set %Q bits for output checks",
      "Front-panel LEDs: green channel LED = voltage present on the terminal (logic 1 ≥ about 15 VDC)",
      "Force table: forces the peripheral address (e.g. %Q0.4:P) and overrides the program",
      "MAINT LED (yellow) on the CPU indicates that a force is active",
      "Signed I/O checklist: address, tag name, device, input OK / output OK, tester initials"
    ],
    "pitfall": "Leaving forces active after commissioning. On the S7-1200 a force stays in effect until it is explicitly stopped (Stop forcing), even across a power cycle, and it overrides interlocks in the user program. Always check that the MAINT LED is off before handing the machine over."
  },
  "quiz": [
    {
      "q": "Which tool in TIA Portal allows real-time monitoring and safe forcing of individual I/O bits during field commissioning?",
      "options": [
        "Watch Table",
        "Project Archiver",
        "License Manager",
        "Compiler Options"
      ],
      "answer": 0,
      "explain": "Watch Tables enable engineers to view live boolean/integer values of %I, %Q, and %M tags directly during electrical checkout."
    },
    {
      "q": "On an S7-1200, which front-panel indication tells you that a force is still active?",
      "options": [
        "The yellow MAINT LED is lit",
        "The RUN/STOP LED flashes red",
        "All input LEDs flash together",
        "The ERROR LED is permanently green"
      ],
      "answer": 0,
      "explain": "The MAINT LED signals a maintenance condition, including active forces. It must be off before the machine is handed over to production."
    },
    {
      "q": "A program is running and writes %Q0.0 every scan. What happens if you use Modify in a watch table to set %Q0.0 = 1 while the program logic says 0?",
      "options": [
        "The output stays at 1 permanently",
        "The CPU goes to STOP",
        "The program overwrites the value in the next scan, so the output does not stay on",
        "The output is forced and the MAINT LED lights"
      ],
      "answer": 2,
      "explain": "Modify writes the value once. Because the program writes %Q0.0 in every cycle, its result replaces the modified value at the next scan. Only a Force overrides the program, which is why forcing is so hazardous."
    }
  ],
  "narration": {
    "vi": "Sau khi đấu dây xong, bạn không cần chạy chương trình để kiểm tra. TIA Portal có chế độ Monitor cho phép xem trực tiếp trạng thái các đầu vào và đầu ra ngay trên màn hình. Vào mục Device Configuration, chọn PLC Tags rồi bật Watch Table. Kích hoạt nút bấm hoặc cảm biến ngoài và quan sát bit tương ứng thay đổi. Cách này giúp phát hiện sai sót đấu dây rất nhanh trước khi vận hành chính thức.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Verifying Wiring in Software",
      "points": [
        "Hardware LED Telemetry: The green LED indicates electrical potential at the screw terminal, confirming field loop continuity before software execution",
        "Watch Tables: Allow non-invasive live monitoring and one-shot modifying of bit markers (%M), process inputs (%I), process outputs (%Q), and DB tags",
        "Force Table Safety: Forcing overrides both user program logic and process images by writing directly to peripheral hardware; indicated by flashing yellow FORCE LED",
        "Point-to-Point Loop Check: Rigorous commissioning protocol where two technicians (one in field, one in TIA Portal) verify 100% of physical sensor channels",
        "Cross-Reference List: TIA Portal tool (Shift+F11) revealing every occurrence where a specific tag is read or written, detecting destructive dual-coil conflicts",
        "Peripheral Addressing (:P): Using %I0.0:P or %Q0.0:P reads or writes directly to physical hardware, bypassing image tables for immediate signal validation"
      ],
      "explain": "Once physical wiring is terminated, the automation engineer must systematically verify every field channel before commissioning software logic. The S7-1200 front panel provides discrete green status LEDs for every physical input (%I0.0–%I1.5) and output (%Q0.0–%Q1.1) terminal. A green input LED indicates that the electrical threshold (typically >15VDC for logic '1') is present across the terminal and its 1M common. In TIA Portal, the engineer navigates online and utilizes Watch Tables (monitoring live bit values in real time) and Force Tables (manually asserting physical states) to validate loop integrity. By actuating field pushbuttons, limit switches, and photoelectric sensors, the live boolean state can be witnessed simultaneously on the physical LED and in the TIA Portal Watch Table. Similarly, digital outputs can be individually toggled via Watch Table modify commands to verify that the corresponding interposing relay clicks, the solenoid valve fires, and the motor contactor pulls in cleanly.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__031.png",
        "caption": "Figure 2.4: Online Wiring Verification: Hardware Status LEDs, Watch Tables, and Signal Diagnostics"
      }
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 1
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 2
    }
  ],
  "status": "review"
} satisfies TopicContent;

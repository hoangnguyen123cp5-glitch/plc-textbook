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
      "title": "Hardware Status LEDs & Going Online",
      "points": [
        "Channel LEDs show live terminal voltage before any user program runs",
        "CPU faults turn off the green RUN indicator and light the red ERROR LED",
        "Yellow MAINT LED warns that an I/O Force or maintenance state is active",
        "Connect PC to PLC, click Go Online, and open Online & Diagnostics"
      ],
      "explain": "Before testing logic, verify wiring using both the S7-1200 front-panel LEDs and TIA Portal's online tools. Every digital channel has a green LED that lights as soon as signal voltage reaches the screw terminal, while the status LEDs (RUN/STOP, ERROR, MAINT) immediately reveal hardware faults or active forces. When the red ERROR LED flashes, go online and open the Diagnostics buffer to read the exact timestamped cause.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__020.png",
        "caption": "S7-1200 front-panel status LEDs indicating a hardware fault condition"
      }
    },
    {
      "kind": "concept",
      "title": "Reading the Diagnostics Buffer: Module Mismatches",
      "points": [
        "Open Online & Diagnostics -> Diagnostics buffer to inspect red fault events",
        "Extra module fault: a module is declared in TIA Portal but missing on the rail",
        "Wrong module code fault: installed module article number differs from project",
        "Verify the exact MLFB part number printed on the module housing"
      ],
      "explain": "Once inside the Diagnostics buffer, clicking any red fault entry shows the affected rack slot and corrective action in the lower pane. Two of the most common lab errors are declaring an expansion module in the project that is not physically plugged into the DIN rail, or picking the wrong catalog variant (for example, relay instead of transistor) for an installed Signal Module.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__021.png",
        "caption": "Going online and opening the Diagnostics buffer in the Project Tree"
      }
    },
    {
      "kind": "concept",
      "title": "Diagnosing Analog Range, Missing Power & Short Circuits",
      "points": [
        "High limit exceeded: analog input exceeds 10 V / 20 mA or raw count ±27648",
        "Supply voltage missing: an expansion module lacks its 24 VDC L+/M power",
        "Short-circuit fault: field signal wires are shorted together or to ground",
        "Watch Tables monitor live %I/%Q bits safely; never leave Force mode active"
      ],
      "explain": "The Diagnostics buffer also pinpoints field wiring mistakes on expansion cards. 'High limit exceeded' means an analog signal has gone above 10 V or 20 mA (outside -27648 to +27648). 'Supply voltage missing' tells you an expansion module was snapped onto the bus without wiring 24 VDC to its L+ and M terminals. If a short circuit is reported, power down immediately and clear the faulted field loop before using a Watch Table to verify each channel.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__025.png",
        "caption": "Diagnostics buffer showing 'High limit exceeded' on an analog input channel"
      }
    },
    {
      "kind": "concept",
      "title": "Resolving CPU Model & Firmware Mismatches",
      "points": [
        "Download fails if the configured CPU model or firmware differs from hardware",
        "Close the download error dialog and check the physical CPU's MLFB label",
        "Right-click the CPU in Device View and select Change device",
        "Pick the exact CPU article number and firmware version installed on the bench"
      ],
      "explain": "If TIA Portal aborts a download because the target PLC does not match the offline project, you do not need to rewrite your program. Simply right-click the CPU in Device configuration, choose 'Change device', and select the exact article number and firmware version printed on the physical S7-1200.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__030.png",
        "caption": "Using 'Change device' in TIA Portal to match the physical CPU model and firmware"
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

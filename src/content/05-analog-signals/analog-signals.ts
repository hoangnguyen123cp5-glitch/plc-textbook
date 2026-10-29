import { TopicContent } from '@/types/content';

export default {
  "slug": "analog-signals",
  "sourceRef": "4.1",
  "title": "Analog Signals (4–20 mA, 0–10 V)",
  "durationMinutes": 9,
  "summary": "Unlike discrete binary signals which exist strictly as ON or OFF, analog signals represent continuous physical phenomena such as temperature, pressure, flow rate, and mechanical displacement.",
  "body": [
    {
      "heading": "4.1 Analog Signals (4–20 mA, 0–10 V)",
      "text": "Unlike discrete binary signals which exist strictly as ON or OFF, analog signals represent continuous physical phenomena such as temperature, pressure, flow rate, and mechanical displacement. In industrial instrumentation, two standardized electrical signal formats dominate: 0–10V (or ±10V) voltage signals and 4–20mA (or 0–20mA) current loops complying with ANSI/ISA-50.00.01. Voltage loops are inexpensive and simple to troubleshoot with a standard voltmeter; however, they suffer from significant signal degradation over long wire runs because lead wire resistance causes voltage drops (V = I * R), and high-impedance voltage inputs are highly susceptible to electromagnetic interference (EMI) from adjacent motor cables. Conversely, 4–20mA current loops provide superior industrial noise immunity: the transmitter dynamically modulates the current in the loop, meaning the signal remains constant regardless of wire length and resistance. Furthermore, 4–20mA incorporates a 'Live Zero': 4mA represents 0% of the process range, whereas a complete wire break or power failure drops loop current to 0mA, allowing the PLC to instantly distinguish between a true zero measurement and a broken field cable.",
      "keyPoints": [
        "Voltage Signals (0–10V, ±10V): Inexpensive; straightforward testing; high susceptibility to capacitive noise coupling and IR lead resistance drop over runs >15m",
        "Current Signals (4–20mA): High noise immunity; loop current is unaffected by cable resistance up to the transmitter voltage compliance limit",
        "Live Zero Principle (4mA): 4mA represents 0% measurement; 0mA indicates a broken cable, open circuit, or transmitter power loss",
        "Current Loop Shunt Resistor: S7-1200 voltage inputs can measure 4–20mA by wiring an external precision 500-ohm (0.1%) shunt resistor across input terminals (producing 2–10V)",
        "2-Wire Loop-Powered Transmitters: The sensor derives its operating power directly from the 4–20mA loop conductors, requiring only two wires",
        "4-Wire Self-Powered Transmitters: The sensor receives external AC/DC mains power via two dedicated wires and outputs an active 4–20mA loop on two signal wires",
        "Digital Communication on 4–20mA: HART (Highway Addressable Remote Transducer) protocol superimposes digital FSK frequency data onto the 4–20mA analog carrier"
      ],
      "note": "Never use 0–10V voltage signals for long-distance field runs or near variable frequency drives (VFDs). Always specify 4–20mA current loops for industrial field sensors to guarantee measurement integrity and automated cable break diagnostics."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/05-analog-signals/05-ana_carved_037.png",
      "caption": "Figure 5.1: 0–10V vs 4–20mA Current Loops: Live Zero (4mA) and Industrial Noise Immunity"
    }
  ],
  "quiz": [
    {
      "q": "Why is a 4–20mA current loop preferred over 0–10V signals in noisy factory environments?",
      "options": [
        "Current loops are immune to lead-wire resistance voltage drop and permit \"live zero\" wire-break detection at 0mA",
        "0–10V cannot be sampled by PLCs",
        "4–20mA requires no power supply",
        "Current loops have higher bandwidth than Ethernet"
      ],
      "answer": 0,
      "explain": "In 4–20mA loops, current is identical everywhere regardless of cable length, and any signal below 4mA (0mA) immediately flags a broken cable."
    }
  ],
  "narration": {
    "vi": "Tín hiệu analog biểu diễn đại lượng vật lý liên tục như nhiệt độ, áp suất hay lưu lượng. Hai chuẩn phổ biến nhất là bốn đến hai mươi mili-ampe và không đến mười vôn. Chuẩn dòng bốn đến hai mươi mili-ampe được ưa dùng hơn vì dòng điện không bị suy giảm theo chiều dài dây. Ngoài ra, dòng bốn mili-ampe ở trạng thái tối thiểu giúp phát hiện đứt dây — vì khi đứt dây tín hiệu về không chứ không phải bốn.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

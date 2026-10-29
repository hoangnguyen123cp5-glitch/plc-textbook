import { TopicContent } from '@/types/content';

export default {
  "slug": "point-to-point",
  "sourceRef": "6.1",
  "title": "Point-to-Point Communication",
  "durationMinutes": 14,
  "summary": "Point-to-Point (PtP) serial communication remains a vital industrial networking standard for connecting micro-PLCs to peripheral field instrumentation: digital power meters, weigh-scale indicators,...",
  "body": [
    {
      "heading": "6.1 Point-to-Point Communication",
      "text": "Point-to-Point (PtP) serial communication remains a vital industrial networking standard for connecting micro-PLCs to peripheral field instrumentation: digital power meters, weigh-scale indicators, barcode readers, temperature controllers, and variable frequency drives. The S7-1200 supports serial communication via Communication Modules (CM 1241) mounted to the left of the CPU, or compact Communication Boards (CB 1241) inserted into the CPU front bezel. Two physical electrical standards are supported: RS232 (unbalanced single-ended signaling, point-to-point only, maximum distance 15 meters, sensitive to ground noise) and RS485 (balanced differential signaling across a twisted wire pair (terminals TA/TB or A/B), multi-drop bus supporting up to 32 transceivers, cable lengths up to 1200 meters at 187.5 kbps). The dominant protocol on serial lines is Modbus RTU: an open master-slave protocol where a single Master polls multiple Slaves (addressed 1 to 247). In TIA Portal, serial networks are programmed using standardized function blocks: MB_COMM_LOAD initializes the serial port hardware (baud rate, parity, stop bits), while MB_MASTER executes cyclic read/write requests (Function Code 03 for Read Holding Registers, Function Code 06/16 for Write Holding Registers) mapped to Data Block arrays.",
      "keyPoints": [
        "RS232 Physical Standard: Single-ended voltage signals (±12V); maximum 15m distance; restricted strictly to 1-to-1 device connections",
        "RS485 Differential Standard: Differential voltage signaling across twisted pair (A/B); high common-mode noise rejection; up to 1200m distance; multi-drop bus for 32 nodes",
        "120-Ohm Termination Resistors: High-speed RS485 lines require 120-ohm termination resistors switched ON at both physical ends of the cable to prevent signal reflections",
        "Modbus RTU Protocol Architecture: Strict Master/Slave polling; Master initiates all queries; Slaves never transmit spontaneously; binary frame format with 16-bit CRC error checking",
        "Modbus Register Addressing: Discrete Inputs (10001+), Coils (00001+), Input Registers (30001+), and Holding Registers (40001+)",
        "MB_COMM_LOAD Instruction: Configures hardware baud rate (9600, 19200, 38400, 115200 bps), parity (Even/Odd/None), and assigns communication buffers",
        "MB_MASTER Function Block: Executes read/write commands: MODE (0=Read, 1=Write), DATA_ADDR (40001), DATA_LEN (register count), and DATA_PTR (pointer to DB array)"
      ],
      "note": "On an RS485 Modbus RTU network, ensure that the two bus-end devices have their 120-ohm termination resistors switched ON, and all intermediate devices have termination switched OFF! Missing or extra termination resistors cause severe signal reflections, leading to intermittent CRC communication timeout faults."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/11-communication/PLC___Slide__022.png",
      "caption": "Figure 11.1: Point-to-Point (PtP) RS485 Modbus RTU Network Architecture & MB_MASTER Function Block"
    }
  ],
  "quiz": [
    {
      "q": "What value of terminating resistor must be installed at both physical ends of an RS485 Modbus RTU daisy-chain cable?",
      "options": [
        "10 ohms",
        "120 ohms",
        "10,000 ohms",
        "No resistor is required"
      ],
      "answer": 1,
      "explain": "A 120-ohm terminating resistor matches the characteristic impedance of standard shielded twisted-pair cables to eliminate signal reflections."
    }
  ],
  "narration": {
    "vi": "Truyền thông điểm-điểm là kết nối trực tiếp giữa hai thiết bị qua cáp serial. RS232 dùng trong khoảng cách ngắn, RS485 đi được vài trăm mét và hỗ trợ nhiều thiết bị trên cùng một đường dây. Modbus RTU và giao thức USS của Siemens đều chạy trên nền RS485. Trong TIA Portal, bạn dùng instruction Send_P2P và Receive_P2P để trao đổi dữ liệu với biến tần hoặc thiết bị đo lường.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Point-to-Point Communication",
      "points": [
        "RS232 Physical Standard: Single-ended voltage signals (±12V); maximum 15m distance; restricted strictly to 1-to-1 device connections",
        "RS485 Differential Standard: Differential voltage signaling across twisted pair (A/B); high common-mode noise rejection; up to 1200m distance; multi-drop bus for 32 nodes",
        "120-Ohm Termination Resistors: High-speed RS485 lines require 120-ohm termination resistors switched ON at both physical ends of the cable to prevent signal reflections",
        "Modbus RTU Protocol Architecture: Strict Master/Slave polling; Master initiates all queries; Slaves never transmit spontaneously; binary frame format with 16-bit CRC error checking",
        "Modbus Register Addressing: Discrete Inputs (10001+), Coils (00001+), Input Registers (30001+), and Holding Registers (40001+)",
        "MB_COMM_LOAD Instruction: Configures hardware baud rate (9600, 19200, 38400, 115200 bps), parity (Even/Odd/None), and assigns communication buffers",
        "MB_MASTER Function Block: Executes read/write commands: MODE (0=Read, 1=Write), DATA_ADDR (40001), DATA_LEN (register count), and DATA_PTR (pointer to DB array)"
      ],
      "explain": "Point-to-Point (PtP) serial communication remains a vital industrial networking standard for connecting micro-PLCs to peripheral field instrumentation: digital power meters, weigh-scale indicators, barcode readers, temperature controllers, and variable frequency drives. The S7-1200 supports serial communication via Communication Modules (CM 1241) mounted to the left of the CPU, or compact Communication Boards (CB 1241) inserted into the CPU front bezel. Two physical electrical standards are supported: RS232 (unbalanced single-ended signaling, point-to-point only, maximum distance 15 meters, sensitive to ground noise) and RS485 (balanced differential signaling across a twisted wire pair (terminals TA/TB or A/B), multi-drop bus supporting up to 32 transceivers, cable lengths up to 1200 meters at 187.5 kbps). The dominant protocol on serial lines is Modbus RTU: an open master-slave protocol where a single Master polls multiple Slaves (addressed 1 to 247). In TIA Portal, serial networks are programmed using standardized function blocks: MB_COMM_LOAD initializes the serial port hardware (baud rate, parity, stop bits), while MB_MASTER executes cyclic read/write requests (Function Code 03 for Read Holding Registers, Function Code 06/16 for Write Holding Registers) mapped to Data Block arrays.",
      "figure": {
        "src": "/images/slides/11-communication/PLC___Slide__022.png",
        "caption": "Figure 11.1: Point-to-Point (PtP) RS485 Modbus RTU Network Architecture & MB_MASTER Function Block"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

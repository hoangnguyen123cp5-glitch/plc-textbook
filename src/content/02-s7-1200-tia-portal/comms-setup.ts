import { TopicContent } from '@/types/content';

export default {
  "slug": "comms-setup",
  "sourceRef": "1.9",
  "title": "Communication Setup (PC/PPI Cable)",
  "durationMinutes": 8,
  "summary": "Establishing communication between the engineering workstation and the PLC is the prerequisite for all online diagnostics, program downloads, and live monitoring.",
  "body": [
    {
      "heading": "1.9 Communication Setup (PC/PPI Cable)",
      "text": "Establishing communication between the engineering workstation and the PLC is the prerequisite for all online diagnostics, program downloads, and live monitoring. Modern SIMATIC S7-1200 CPUs utilize standard PROFINET Industrial Ethernet (10/100 Mbps RJ45) eliminating the requirement for proprietary programming adapters. The engineering workstation's Network Interface Card (NIC) must be assigned a static IP address residing in the identical subnet as the PLC (e.g. PC: 192.168.0.241 / 255.255.255.0; PLC factory default: 192.168.0.1 / 255.255.255.0). Standard Cat5e shielded twisted-pair (STP) Ethernet cables are utilized; integrated Auto-MDI/X automatically resolves straight-through or cross-over cable pinouts. In legacy installations (such as S7-200 micro-PLCs), communication required a specialized PC/PPI (Point-to-Point Interface) cable: an RS232-to-RS485 or USB-to-RS485 optoisolated converter operating at 9.6 or 187.5 kbps. In TIA Portal, the 'Accessible Devices' scan tool queries all active nodes on the physical Ethernet segment via MAC broadcast, allowing engineers to flash CPU LEDs to verify identity and assign new IP addresses.",
      "keyPoints": [
        "PROFINET Physical Layer: Standard Cat5e STP shielded industrial Ethernet with RJ45 connectors; supports up to 100 meters per cable segment",
        "Auto-MDI/X Feature: Automatically senses and configures cable pinout orientation, eliminating the need for specialized Ethernet crossover cables",
        "IP Address Subnetting: The engineering laptop NIC and S7-1200 must share an identical subnet mask (255.255.255.0) and distinct IP addresses in the same range",
        "Accessible Devices Tool: Broadcasts Layer 2 DCP (Discovery and Configuration Protocol) frames to detect all connected Siemens nodes regardless of IP configuration",
        "Flash LED Verification: Online diagnostic command that commands the CPU RUN/STOP, ERROR, and MAINT LEDs to flash simultaneously for positive panel identification",
        "Legacy PC/PPI Cable: Optically isolated USB-to-RS485 converter utilized exclusively for programming vintage SIMATIC S7-200 micro-controllers",
        "Direct PG/PC Connection: Enables direct peer-to-peer programming without requiring an intermediate Ethernet network switch"
      ],
      "note": "If TIA Portal fails to discover an online S7-1200 CPU during the 'Accessible Devices' scan, verify in Windows Network Connections that the active physical Ethernet card is selected as the PG/PC interface, and disable secondary active Wi-Fi adapters to prevent multi-homed routing conflicts."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/profinet-network-diagram.jpg",
      "caption": "Figure 2.7: PROFINET IP Subnetting, PG/PC Interface, and Accessible Devices Discovery Scan"
    }
  ],
  "quiz": [
    {
      "q": "What industrial Ethernet protocol is the default standard for Siemens S7-1200/1500 inter-device networking?",
      "options": [
        "Modbus ASCII",
        "PROFINET (Deterministic Industrial Ethernet)",
        "DeviceNet",
        "DH+"
      ],
      "answer": 1,
      "explain": "PROFINET is Siemens flagship open industrial Ethernet standard for real-time cyclic I/O data and engineering access."
    }
  ],
  "narration": {
    "vi": "Để kết nối máy tính với PLC S7-1200, bạn cần cáp Ethernet tiêu chuẩn hoặc qua switch mạng. Đặt địa chỉ IP của card mạng máy tính cùng dải với PLC, ví dụ PLC là 192.168.0.1 thì máy tính đặt 192.168.0.10. Trong TIA Portal, vào mục Online Access, chọn đúng card mạng rồi bấm Start Search để tìm thiết bị. Khi thấy PLC xuất hiện trong danh sách, bấm Connect để bắt đầu làm việc trực tuyến.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Communication Setup (PC/PPI Cable)",
      "points": [
        "PROFINET Physical Layer: Standard Cat5e STP shielded industrial Ethernet with RJ45 connectors; supports up to 100 meters per cable segment",
        "Auto-MDI/X Feature: Automatically senses and configures cable pinout orientation, eliminating the need for specialized Ethernet crossover cables",
        "IP Address Subnetting: The engineering laptop NIC and S7-1200 must share an identical subnet mask (255.255.255.0) and distinct IP addresses in the same range",
        "Accessible Devices Tool: Broadcasts Layer 2 DCP (Discovery and Configuration Protocol) frames to detect all connected Siemens nodes regardless of IP configuration",
        "Flash LED Verification: Online diagnostic command that commands the CPU RUN/STOP, ERROR, and MAINT LEDs to flash simultaneously for positive panel identification",
        "Legacy PC/PPI Cable: Optically isolated USB-to-RS485 converter utilized exclusively for programming vintage SIMATIC S7-200 micro-controllers",
        "Direct PG/PC Connection: Enables direct peer-to-peer programming without requiring an intermediate Ethernet network switch"
      ],
      "explain": "Establishing communication between the engineering workstation and the PLC is the prerequisite for all online diagnostics, program downloads, and live monitoring. Modern SIMATIC S7-1200 CPUs utilize standard PROFINET Industrial Ethernet (10/100 Mbps RJ45) eliminating the requirement for proprietary programming adapters. The engineering workstation's Network Interface Card (NIC) must be assigned a static IP address residing in the identical subnet as the PLC (e.g. PC: 192.168.0.241 / 255.255.255.0; PLC factory default: 192.168.0.1 / 255.255.255.0). Standard Cat5e shielded twisted-pair (STP) Ethernet cables are utilized; integrated Auto-MDI/X automatically resolves straight-through or cross-over cable pinouts. In legacy installations (such as S7-200 micro-PLCs), communication required a specialized PC/PPI (Point-to-Point Interface) cable: an RS232-to-RS485 or USB-to-RS485 optoisolated converter operating at 9.6 or 187.5 kbps. In TIA Portal, the 'Accessible Devices' scan tool queries all active nodes on the physical Ethernet segment via MAC broadcast, allowing engineers to flash CPU LEDs to verify identity and assign new IP addresses.",
      "figure": {
        "src": "/images/diagrams/profinet-network-diagram.jpg",
        "caption": "Figure 2.7: PROFINET IP Subnetting, PG/PC Interface, and Accessible Devices Discovery Scan"
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

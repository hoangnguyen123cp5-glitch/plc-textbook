import { TopicContent } from '@/types/content';

export default {
  "slug": "comms-setup",
  "sourceRef": "1.9",
  "title": "Communication Setup (PROFINET & PUT/GET)",
  "durationMinutes": 8,
  "summary": "Establishing communication between the engineering workstation and the PLC is the prerequisite for all online diagnostics, program downloads, and live monitoring.",
  "body": [
    {
      "heading": "1.9 Communication Setup (PROFINET & PUT/GET)",
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
  "caseStudy": {
    "title": "Twenty CPUs, One Switch, One IP Address",
    "context": "In a lab, every bench connects its CPU 1214C to one shared Ethernet switch so the instructor can reach all stations. Each student's project uses the TIA Portal default address 192.168.0.1, so after downloads every CPU on the network has the same IP. Students start downloading to a neighbour's PLC and online connections drop randomly. The fix is an address plan: each bench gets its own CPU and PC address in the same 255.255.255.0 subnet, written on a label at the bench. Students use Accessible devices and the Flash LED function to confirm the physical CPU before every download.",
    "hardware": [
      "Address plan: Bench n → CPU 192.168.0.(10+n), PC 192.168.0.(100+n), mask 255.255.255.0",
      "PG/PC interface: select the wired Ethernet adapter, not Wi-Fi or a virtual adapter",
      "Accessible devices: lists CPUs found on the selected adapter, including MAC and IP address",
      "Flash LED: makes the chosen CPU's LEDs flash to confirm it is the one on your bench",
      "Online & diagnostics → Assign IP address: sets the IP of a CPU that has none yet"
    ],
    "pitfall": "Assuming every new S7-1200 already has 192.168.0.1. A CPU from the factory or after a reset to factory settings may have no IP address; 192.168.0.1 is only TIA Portal's default in the project. Use Accessible devices (by MAC address) and assign the IP explicitly."
  },
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
    },
    {
      "q": "Several lab CPUs on one switch all have IP 192.168.0.1. What is the expected symptom?",
      "options": [
        "The switch automatically gives each CPU a new address",
        "All CPUs work normally because MAC addresses are different",
        "IP address conflicts: connections drop and downloads may reach the wrong CPU",
        "The CPUs merge into one virtual PLC"
      ],
      "answer": 2,
      "explain": "IP addresses must be unique on a subnet. With duplicates, the PC cannot reliably reach the intended CPU, so each station needs its own address from a plan."
    },
    {
      "q": "Before downloading in a shared lab, which function confirms you are connected to the CPU on your own bench?",
      "options": [
        "Compile",
        "Go offline",
        "Force table",
        "Flash LED in Accessible devices"
      ],
      "answer": 3,
      "explain": "Flash LED makes the selected CPU's status LEDs flash, giving physical confirmation that the online connection targets the right controller."
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
      "title": "S7-1200 Communication Interfaces & Modules",
      "points": [
        "Integrated PROFINET RJ45 port for programming, HMI, and PLC-to-PLC links",
        "PROFIBUS DP master/slave modules and AS-i / IO-Link (SM 1278) expansion",
        "Industrial wireless/remote modules: GPRS, LTE, and TeleControl CP",
        "Point-to-Point (PtP) serial modules and RF120C for SIMATIC Ident systems"
      ],
      "explain": "Every SIMATIC S7-1200 CPU includes a built-in PROFINET Ethernet port, and up to three Communication Modules (CM) or Communication Processors (CP) can be added on the left side of the CPU for PROFIBUS DP, GPRS/LTE cellular telemetry, RF120C RFID identification, IO-Link sensor masters, or serial Point-to-Point links.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__064.jpeg",
        "caption": "Expansion layout comparison: S7-1200 mounts up to 3 Communication Modules (CM) on the left of the CPU and up to 8 Signal Modules (SM) on the right"
      }
    },
    {
      "kind": "concept",
      "title": "PROFINET Topologies & Point-to-Point (PtP) Serial Links",
      "points": [
        "Direct Cat5e Ethernet connection between PG/PC, S7-1200 CPU, and Basic HMI",
        "Multi-node star network using the CSM 1277 4-port unmanaged switch",
        "CM 1241 RS232 / RS422 / RS485 modules enable Point-to-Point Freeport comms",
        "Supports ASCII, USS drive control, and Modbus RTU for printers, scanners, and drives"
      ],
      "explain": "For single-station setups, a standard Cat5e cable connects the S7-1200 directly to a PC or a SIMATIC Basic Panel HMI. When networking multiple S7-1200 controllers and HMIs, a compact CSM 1277 switch links all RJ45 ports on the same subnet. For serial field devices such as barcode scanners, printers, modems, or variable-speed drives, CM 1241 RS232/RS485 modules run Freeport, ASCII, USS, or Modbus protocols.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__041.png",
        "caption": "Point-to-Point serial connections via CM 1241 modules on the left of the S7-1200 to a printer, modem, and drive"
      }
    },
    {
      "kind": "concept",
      "title": "High-Speed Functions & Industrial Certifications",
      "points": [
        "Hardware interrupts, high-speed counters (HSC), and pulse train outputs (PTO)",
        "Engineered for time-critical discrete and motion control processes",
        "Certified to UL 508, CSA C22.2 No. 142, VDE 0160, and EN 61131-2 standards",
        "Meets FM Class I Div 2 hazardous location and EN 50081 / 50082 EMC directives"
      ],
      "explain": "Beyond communication, the S7-1200 integrates dedicated hardware interrupts, high-speed counters, and pulse outputs for time-critical machine tasks while complying with international industrial safety and electromagnetic compatibility (EMC) standards including EN 61131-2 and UL 508."
    },
    {
      "kind": "concept",
      "title": "Configuring S7 Ethernet Communication (PUT/GET)",
      "points": [
        "Step 1: Add the partner CPUs in one TIA Portal project or separate projects",
        "Step 2: Assign unique IP addresses on the same subnet (e.g. 192.168.0.1 and .2)",
        "Enable 'Permit access with PUT/GET communication' under Protection & Security",
        "In Devices & Networks, select S7 connection and right-click the port to Add subnet"
      ],
      "explain": "To exchange data between two S7-1200 CPUs over Ethernet using PUT and GET instructions, first assign each CPU a unique IP in the same subnet (such as 192.168.0.1 and 192.168.0.2). Next, open Device configuration -> Protection & Security -> Connection mechanisms and check 'Permit access with PUT/GET communication from remote partner', then link the subnet under Devices & Networks.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__042.png",
        "caption": "Enabling 'Permit access with PUT/GET communication from remote partner' under Protection & Security in TIA Portal"
      }
    },
    {
      "kind": "diagram",
      "title": "Structuring Transmit & Receive Data Blocks (DB10)",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__044.png",
        "caption": "Global Data Block CPU1_Data [DB10] containing PLC1_Transmit_Data and PLC1_Receive_Data structures"
      },
      "explain": "When configuring the data exchange buffer for PUT/GET communication, create a dedicated Global Data Block (such as CPU1_Data [DB10]) containing two Structs—one for transmit data and one for receive data—and disable 'Optimized block access' in the DB properties so PUT and GET can reference exact absolute byte offsets."
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

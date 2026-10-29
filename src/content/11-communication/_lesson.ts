import { LessonContentFile } from '@/types/content';

export default {
  "slug": "11-communication",
  "id": 11,
  "title": "Communication Protocols",
  "description": "Point-to-point communication, PROFINET and PROFIBUS",
  "course": "AUT207",
  "session": 1,
  "lab": "Lab 6",
  "clo": "G2",
  "module": 4,
  "topicOrder": [
    "point-to-point",
    "profinet-profibus"
  ],
  "overview": "Modern automated factories are distributed networks where controllers, remote I/O islands, motor drives, operator panels, and smart sensors exchange critical data in real time. This lesson examines industrial communication technologies on the Siemens S7-1200 platform. Students will explore Point-to-Point (PtP) serial communications over RS232 and RS485 using the Modbus RTU protocol (master/slave architecture, holding registers, MB_COMM_LOAD, MB_MASTER, MB_SLAVE function blocks), fieldbus architectures (PROFIBUS DP token-ring master/slave networks), and high-speed deterministic PROFINET IO Industrial Ethernet (Real-Time RT and Isochronous Real-Time IRT, IO Controllers, IO Devices, and GSDML device integration).",
  "objectives": [
    "Compare physical layer electrical characteristics, topology limits, and baud rates of RS232, RS485, and PROFINET Industrial Ethernet",
    "Configure Communication Modules (CM 1241) and Communication Boards (CB 1241) for Point-to-Point (PtP) serial communication in TIA Portal",
    "Implement Modbus RTU communication networks, parameterizing MB_COMM_LOAD, MB_MASTER, and MB_SLAVE blocks to read/write holding registers",
    "Describe the token-passing and master-slave polling architecture of PROFIBUS-DP using CM 1243-5 (master) and CM 1242-5 (slave)",
    "Configure PROFINET IO topologies in TIA Portal Network View, assigning PROFINET device names, IP addresses, and update times",
    "Import GSDML device description files to integrate third-party remote I/O and variable frequency drives onto PROFINET networks",
    "Diagnose industrial communication faults using Wireshark, online network topologies, and communication status words"
  ],
  "review": [
    "Compare the electrical signaling, maximum cable distance, noise immunity, and multi-drop capabilities of RS232 versus RS485.",
    "Describe the master-slave operating architecture of the Modbus RTU protocol. Can a slave device initiate data transmission without a master query?",
    "Explain how the MB_COMM_LOAD and MB_MASTER instruction blocks work together in TIA Portal to read holding registers from an external power meter.",
    "Why must 120-ohm termination resistors be installed at both physical ends of an RS485 communication cable segment?",
    "Explain how PROFINET Real-Time (RT) communication achieves deterministic update times (< 1 ms) over standard IEEE 802.3 Ethernet cables.",
    "Describe the role of the Discovery and Configuration Protocol (DCP) and explain why PROFINET devices require unique symbolic Device Names.",
    "What is a GSDML file, who provides it, and how is it used by an automation engineer in TIA Portal to integrate a third-party variable frequency drive?"
  ]
} satisfies LessonContentFile;

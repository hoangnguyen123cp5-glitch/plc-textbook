import { TopicContent } from '@/types/content';

export default {
  "slug": "s7-300-overview",
  "title": "S7-300 Platform Overview",
  "durationMinutes": 10,
  "summary": "The SIMATIC S7-300 is a modular automation system engineered for medium-to-high performance factory applications.",
  "body": [
    {
      "heading": "S7-300 Platform Overview",
      "text": "The SIMATIC S7-300 is a modular automation system engineered for medium-to-high performance factory applications. Unlike the S7-1200 which snaps modules together via side sliding connectors, the S7-300 mounts onto a dedicated aluminum S7 rail and interconnects modules using active U-shaped backplane bus connectors (bus connectors) plugged between adjacent cards. Hardware rack slots follow strict architectural rules: Slot 1 is reserved exclusively for the Power Supply (PS 307: 2A, 5A, or 10A 24VDC); Slot 2 hosts the Central Processing Unit (CPU: ranging from the economical CPU 312 to high-performance CPU 315-2 PN/DP, CPU 317, and CPU 319-3 PN/DP); Slot 3 is reserved strictly for an Interface Module (IM 360/361 or IM 365) used to expand to up to 4 interconnected multi-tier racks; Slots 4 through 11 host up to 8 Signal Modules (SM), Function Modules (FM), or Communication Processors (CP). Legacy CPUs relied on internal lithium backup batteries (for retaining RAM data), whereas modern S7-300 CPUs utilize a non-volatile Micro Memory Card (MMC). Field communications operate primarily over Multi-Point Interface (MPI: 187.5 kbps proprietary token-passing bus) and PROFIBUS-DP (up to 12 Mbps), with modern variants integrating PROFINET.",
      "keyPoints": [
        "Modular Backplane Architecture: Modules bolt onto an aluminum mounting rail and interconnect via rear multi-pin U-shaped bus connectors",
        "Strict Slot Assignment Rules: Slot 1 = Power Supply (PS), Slot 2 = CPU Module, Slot 3 = Interface Module (IM for multi-tier expansion), Slots 4–11 = I/O and CP Modules",
        "Multi-Tier Expansion Racks: Up to 4 physical racks (32 total modules) linked via IM 360 (send) and IM 361 (receive) interface modules",
        "SIMATIC Micro Memory Card (MMC): Non-volatile Flash storage retaining the compiled project, DB values, and symbols without battery backup",
        "Multi-Point Interface (MPI): Integrated RS485 programming and HMI interface running at 187.5 kbps (or 12 Mbps on high-end CPUs) supporting up to 32 nodes",
        "Integrated PROFIBUS-DP Port: Integrated DB9 female connector supporting master/slave decentralized peripheral I/O at speeds up to 12 Mbps",
        "End-of-Life Lifecycle: Spare parts and repair services are guaranteed by Siemens through approximately 2030, after which components transition to legacy status"
      ],
      "note": "Never remove or insert an S7-300 Micro Memory Card (MMC) while power is applied to the CPU! Unseating the MMC while the CPU is powered will corrupt the card's non-volatile flash partition, requiring a low-level format using a specialized Siemens prommer or resulting in permanent card failure."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/13-s7-300/PLC___Slide__015.png",
      "caption": "Figure 13.1: SIMATIC S7-300 Modular Rack Hardware: PS, CPU, IM 360/361, and Backplane U-Connectors"
    }
  ],
  "quiz": [
    {
      "q": "How are I/O modules mechanically connected to the backplane bus on a SIMATIC S7-300 rack?",
      "options": [
        "Using flexible ribbon cables",
        "Via small black U-shaped backplane bus connectors plugged into the rear of adjacent modules on the aluminum DIN rail",
        "Through wireless RF tags",
        "Using standard RJ45 patch cords"
      ],
      "answer": 1,
      "explain": "S7-300 modules click together via U-shaped bus connectors that slide into rear sockets, linking the internal address and data buses across the rail."
    }
  ],
  "narration": {
    "vi": "S7-300 là dòng PLC tầm trung của Siemens ra đời từ những năm 1990 và vẫn còn rất phổ biến trong nhà máy hiện nay. Phần cứng gồm rack gắn các module theo hàng ngang — CPU ở giữa, module I/O hai bên. Giao tiếp mặc định là MPI, phiên bản cao hơn có PROFIBUS tích hợp. Mỗi rack chứa tối đa tám module mở rộng, và bạn có thể nối nhiều rack qua cáp mở rộng.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "S7-300 Platform Overview",
      "points": [
        "Modular Backplane Architecture: Modules bolt onto an aluminum mounting rail and interconnect via rear multi-pin U-shaped bus connectors",
        "Strict Slot Assignment Rules: Slot 1 = Power Supply (PS), Slot 2 = CPU Module, Slot 3 = Interface Module (IM for multi-tier expansion), Slots 4–11 = I/O and CP Modules",
        "Multi-Tier Expansion Racks: Up to 4 physical racks (32 total modules) linked via IM 360 (send) and IM 361 (receive) interface modules",
        "SIMATIC Micro Memory Card (MMC): Non-volatile Flash storage retaining the compiled project, DB values, and symbols without battery backup",
        "Multi-Point Interface (MPI): Integrated RS485 programming and HMI interface running at 187.5 kbps (or 12 Mbps on high-end CPUs) supporting up to 32 nodes",
        "Integrated PROFIBUS-DP Port: Integrated DB9 female connector supporting master/slave decentralized peripheral I/O at speeds up to 12 Mbps",
        "End-of-Life Lifecycle: Spare parts and repair services are guaranteed by Siemens through approximately 2030, after which components transition to legacy status"
      ],
      "explain": "The SIMATIC S7-300 is a modular automation system engineered for medium-to-high performance factory applications. Unlike the S7-1200 which snaps modules together via side sliding connectors, the S7-300 mounts onto a dedicated aluminum S7 rail and interconnects modules using active U-shaped backplane bus connectors (bus connectors) plugged between adjacent cards. Hardware rack slots follow strict architectural rules: Slot 1 is reserved exclusively for the Power Supply (PS 307: 2A, 5A, or 10A 24VDC); Slot 2 hosts the Central Processing Unit (CPU: ranging from the economical CPU 312 to high-performance CPU 315-2 PN/DP, CPU 317, and CPU 319-3 PN/DP); Slot 3 is reserved strictly for an Interface Module (IM 360/361 or IM 365) used to expand to up to 4 interconnected multi-tier racks; Slots 4 through 11 host up to 8 Signal Modules (SM), Function Modules (FM), or Communication Processors (CP). Legacy CPUs relied on internal lithium backup batteries (for retaining RAM data), whereas modern S7-300 CPUs utilize a non-volatile Micro Memory Card (MMC). Field communications operate primarily over Multi-Point Interface (MPI: 187.5 kbps proprietary token-passing bus) and PROFIBUS-DP (up to 12 Mbps), with modern variants integrating PROFINET.",
      "figure": {
        "src": "/images/slides/13-s7-300/PLC___Slide__015.png",
        "caption": "Figure 13.1: SIMATIC S7-300 Modular Rack Hardware: PS, CPU, IM 360/361, and Backplane U-Connectors"
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

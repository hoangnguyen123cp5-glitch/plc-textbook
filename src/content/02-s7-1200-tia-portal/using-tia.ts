import { TopicContent } from '@/types/content';

export default {
  "slug": "using-tia",
  "sourceRef": "1.8",
  "title": "Working with TIA Portal",
  "durationMinutes": 14,
  "summary": "TIA Portal presents two complementary graphical environments: Portal View and Project View.",
  "body": [
    {
      "heading": "1.8 Working with TIA Portal",
      "text": "TIA Portal presents two complementary graphical environments: Portal View and Project View. Portal View is a task-oriented interface tailored for quick operational tasks (creating projects, hardware discovery, diagnostic inspections, and firmware updates). Project View is the comprehensive hierarchical engineering workbench, organized into three primary functional areas: the Project Tree on the left (containing PLC folders, Program Blocks, PLC Tags, and Device Configuration), the central Work Area (where ladder rungs, hardware racks, and network topologies are visually designed), and the Inspector / Task Card Area on the bottom and right (providing contextual hardware properties, diagnostics, instruction catalogs, and cross-references). To configure hardware, the engineer drags the specific CPU model from the hardware catalog into the Device View, verifying that the order code (MLFB) and firmware revision (e.g. V4.6) exactly match the physical device. The project is compiled (Ctrl+B for hardware, Ctrl+Shift+B for software) and downloaded to the CPU via PROFINET.",
      "keyPoints": [
        "Portal View vs Project View: Switch seamlessly between task-oriented portal navigation and deep hierarchical project editing via the bottom-left toggle",
        "Project Tree Organization: Structured root hierarchy containing Devices, Program Blocks (OB/FC/FB/DB), PLC Tag Tables, Watch Tables, and Common Data",
        "MLFB Part Number Precision: Verify the complete Siemens article number (e.g. 6ES7 214-1AG40-0XB0); mismatched catalog models will reject program downloads",
        "Firmware Matching: Ensure the project hardware firmware revision matches or is backward-compatible with the physical CPU firmware (e.g. V4.2 vs V4.6)",
        "Hardware Catalog Navigation: Search and insert CPUs, Signal Boards, Signal Modules, ET 200 distributed stations, and drive nodes into the graphical rack",
        "Compilation and Download: Full compilation validates memory allocations, addressing conflicts, and syntax errors prior to transferring runtime blocks to Flash"
      ],
      "note": "Use the 'Detect unspecific S7-1200 CPU' feature in TIA Portal if the physical CPU's exact firmware revision or expansion card configuration is unknown. TIA Portal will query the online PLC over Ethernet and automatically configure the exact hardware rack."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__062.png",
      "caption": "Figure 2.6: TIA Portal Project View: Device Configuration, Hardware Catalog, and Network Topology"
    }
  ],
  "caseStudy": {
    "title": "Download Fails: Configured Firmware Does Not Match the CPU",
    "context": "A student creates a project, inserts a CPU 1214C DC/DC/DC with firmware V4.6 from the hardware catalog, writes the program and tries to download. TIA Portal refuses because the CPU on the bench has older firmware (V4.4). The order number (MLFB) printed on the CPU front matches the configuration, but the firmware version does not. The fix is to open Device configuration, select the CPU and use Change device to set the firmware to V4.4 (or to update the CPU firmware). Alternatively, the student could have inserted an unspecified CPU 1214C and used the detect function to read the exact module and firmware from the connected PLC.",
    "hardware": [
      "Order number (MLFB) on the CPU front, e.g. 6ES7 214-1AG40-0XB0 for CPU 1214C DC/DC/DC",
      "Firmware version shown in Online & diagnostics and on the CPU label",
      "Configured firmware must be equal to or lower than the firmware of the real CPU",
      "Device view → Change device: switches CPU model or firmware without losing the program",
      "Unspecified CPU + detect: reads the real hardware configuration over PROFINET"
    ],
    "pitfall": "Selecting the newest firmware in the catalog by habit. A configuration with newer firmware than the physical CPU cannot be downloaded. Read the firmware from the CPU first, or use detect, before writing any code."
  },
  "quiz": [
    {
      "q": "What is the purpose of \"Accessible Devices\" scan in TIA Portal?",
      "options": [
        "To detect and display any active Siemens hardware on the PROFINET subnet via MAC broadcast, even if its IP is on a different subnet",
        "To compile the PLC code",
        "To download safety passwords",
        "To calculate electrical power draw"
      ],
      "answer": 0,
      "explain": "Accessible Devices sends Layer-2 DCP discovery broadcasts to find connected CPUs and HMIs regardless of current IP configuration."
    },
    {
      "q": "The project is configured with CPU firmware V4.6 but the real CPU has V4.4. What is the correct fix in TIA Portal?",
      "options": [
        "Use Change device to set the configured firmware to V4.4 (or update the CPU firmware)",
        "Delete the CPU and write the program again",
        "Force all outputs and retry the download",
        "Change the IP address of the PC"
      ],
      "answer": 0,
      "explain": "The configured firmware must not be newer than the real CPU. Change device keeps the program and only changes the configured model or firmware."
    },
    {
      "q": "Which TIA Portal view gives the full engineering workbench with the Project tree, Work area and Inspector window?",
      "options": [
        "Portal view",
        "Project view",
        "Online & diagnostics view",
        "Topology view"
      ],
      "answer": 1,
      "explain": "Portal view is task-oriented for quick actions; Project view contains the Project tree, the central Work area and the Inspector window used for detailed engineering."
    }
  ],
  "narration": {
    "vi": "Khi mở TIA Portal, bạn tạo Project mới rồi thêm thiết bị PLC vào Device Configuration. Tại đây bạn cài đặt địa chỉ IP, chọn đúng phiên bản firmware của CPU. Chương trình được viết trong mục Program Blocks, mặc định có sẵn OB1. Bạn có thể thêm các FC và FB để tổ chức chương trình theo chức năng. Giao diện TIA Portal tích hợp cả lập trình, cấu hình phần cứng và giám sát trong một môi trường thống nhất.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Working with TIA Portal",
      "points": [
        "Portal View vs Project View: Switch seamlessly between task-oriented portal navigation and deep hierarchical project editing via the bottom-left toggle",
        "Project Tree Organization: Structured root hierarchy containing Devices, Program Blocks (OB/FC/FB/DB), PLC Tag Tables, Watch Tables, and Common Data",
        "MLFB Part Number Precision: Verify the complete Siemens article number (e.g. 6ES7 214-1AG40-0XB0); mismatched catalog models will reject program downloads",
        "Firmware Matching: Ensure the project hardware firmware revision matches or is backward-compatible with the physical CPU firmware (e.g. V4.2 vs V4.6)",
        "Hardware Catalog Navigation: Search and insert CPUs, Signal Boards, Signal Modules, ET 200 distributed stations, and drive nodes into the graphical rack",
        "Compilation and Download: Full compilation validates memory allocations, addressing conflicts, and syntax errors prior to transferring runtime blocks to Flash"
      ],
      "explain": "TIA Portal presents two complementary graphical environments: Portal View and Project View. Portal View is a task-oriented interface tailored for quick operational tasks (creating projects, hardware discovery, diagnostic inspections, and firmware updates). Project View is the comprehensive hierarchical engineering workbench, organized into three primary functional areas: the Project Tree on the left (containing PLC folders, Program Blocks, PLC Tags, and Device Configuration), the central Work Area (where ladder rungs, hardware racks, and network topologies are visually designed), and the Inspector / Task Card Area on the bottom and right (providing contextual hardware properties, diagnostics, instruction catalogs, and cross-references). To configure hardware, the engineer drags the specific CPU model from the hardware catalog into the Device View, verifying that the order code (MLFB) and firmware revision (e.g. V4.6) exactly match the physical device. The project is compiled (Ctrl+B for hardware, Ctrl+Shift+B for software) and downloaded to the CPU via PROFINET.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__062.png",
        "caption": "Figure 2.6: TIA Portal Project View: Device Configuration, Hardware Catalog, and Network Topology"
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

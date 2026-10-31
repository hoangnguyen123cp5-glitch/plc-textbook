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
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__053.jpeg",
      "caption": "Figure 2.6: TIA Portal Project View Workbench: Numbered Layout of Toolbar, Project Tree, Work Area, Task Cards, and Inspector"
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
      "title": "Portal View vs Project View",
      "points": [
        "Portal View (1–4) provides task-oriented startup actions and project creation",
        "Switch between Portal View and Project View at the bottom-left corner",
        "Project View displays the left Project Tree for Devices, Blocks, and Tags",
        "Central Work Area, bottom Inspector Window, and right Task Cards complete the IDE"
      ],
      "explain": "When you launch TIA Portal, you start in Portal View, which groups high-level tasks: creating or opening a project, configuring devices, or going online. Clicking 'Project view' in the bottom-left corner opens the full engineering workbench—giving you the hierarchical Project Tree on the left, the main editor in the center, the Properties/Diagnostics Inspector at the bottom, and the Instructions/Libraries Task Cards on the right.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__057.jpeg",
        "caption": "TIA Portal Portal View showing numbered regions: (1) Start tasks, (2) Create/Open actions, (3) New project details, and (4) Project view toggle"
      }
    },
    {
      "kind": "concept",
      "title": "Inserting Instructions & Expanding LAD/FBD Inputs",
      "points": [
        "Drag instructions from the Basic Instructions task card directly onto a rung",
        "LAD models current flow through input conditions; FBD uses logic gate boxes",
        "Add extra inputs via the 'Insert input' icon, right-click menu, or Ctrl+Shift+3",
        "Click the small expand/collapse arrow on complex blocks to reveal all parameters"
      ],
      "explain": "To build logic in OB1, open the 'Basic instructions' task card on the right and drag contacts, coils, timers, or math boxes into the network editor. On multi-input instructions in LAD or FBD, you can add another input pin by clicking the star icon, right-clicking and choosing 'Insert input' (Ctrl+Shift+3), or clicking the bottom arrow to expand hidden block parameters.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__061.jpeg",
        "caption": "Right-clicking a MAX instruction in the program editor to select 'Insert input' (Ctrl+Shift+3)"
      }
    },
    {
      "kind": "concept",
      "title": "Online CPU Operator Panel & Project Libraries",
      "points": [
        "S7-1200 CPUs have no physical RUN/STOP toggle switch on the housing",
        "Control CPU mode from the toolbar or the Online Tools CPU operator panel",
        "Use RUN, STOP, and MRES (Memory Reset) buttons when connected online",
        "Save reusable blocks and hardware setups in Project and Global Libraries"
      ],
      "explain": "Because S7-1200 controllers do not have a physical RUN/STOP switch on the front bezel, operating mode changes are commanded from TIA Portal. Once online, open the 'Online tools' task card to access the virtual CPU operator panel—where you can switch between RUN and STOP or trigger an MRES (Memory Reset). To speed up future projects, store tested Function Blocks and standard configurations in Project or Global Libraries.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__067.png",
        "caption": "Online CPU operator panel in TIA Portal showing RUN/STOP/MAINT status indicators and RUN, STOP, and MRES buttons"
      }
    },
    {
      "kind": "concept",
      "title": "Editor Productivity: Split Editor, Unplugged Modules & Versions",
      "points": [
        "Press Shift+F3 (Window -> Split Editor) to view two blocks or tag tables side by side",
        "Drag an expansion module to 'Module not plugged in' to park it without losing data",
        "Select instruction firmware versions (e.g. V4.0) from the version dropdown column",
        "Compile hardware (Ctrl+B) and software (Ctrl+Shift+B) before downloading"
      ],
      "explain": "Three built-in TIA Portal features save hours during commissioning: First, splitting the editor (Shift+F3) lets you drag tags directly from the PLC Tag Table into your ladder rung. Second, if a physical Signal Module is temporarily removed, dragging it to the 'Module not plugged in' area preserves all its configured addresses. Third, you can switch an instruction's version directly in the Instructions pane to maintain compatibility with older CPU firmware.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__076.jpeg",
        "caption": "Selecting the instruction version (V2.5, V3.1, V4.0) from the dropdown menu in the Instructions task card"
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

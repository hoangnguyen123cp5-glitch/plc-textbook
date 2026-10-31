import { TopicContent } from '@/types/content';

export default {
  "slug": "install-tia",
  "sourceRef": "1.7",
  "title": "Installing TIA Portal",
  "durationMinutes": 8,
  "summary": "Siemens Totally Integrated Automation Portal (TIA Portal) is an industrial engineering software package integrating STEP 7 (PLC programming), WinCC (HMI and SCADA design), Startdrive (frequency con...",
  "body": [
    {
      "heading": "1.7 Installing TIA Portal",
      "text": "Siemens Totally Integrated Automation Portal (TIA Portal) is an industrial engineering software package integrating STEP 7 (PLC programming), WinCC (HMI and SCADA design), Startdrive (frequency converter parameterization), and S7-PLCSIM (virtual PLC emulation). A robust workstation configuration is critical for efficient engineering workflows: 64-bit Windows 10/11 Professional or Enterprise, multi-core Intel Core i7/i9 or AMD Ryzen processor (>=3.4 GHz), minimum 16 GB of high-speed DDR4/DDR5 RAM (32 GB recommended for large multi-device topologies), and solid-state storage (NVMe SSD) with at least 50 GB of unallocated disk space. The installation media is distributed as self-extracting ISO archives available via Siemens Industry Online Support (SIOS). Licensing is governed centrally by the Automation License Manager (ALM), which manages node-locked, USB dongle, or network floating licenses. Siemens provides a fully functional 21-day trial license enabling complete evaluation and academic laboratory instruction.",
      "keyPoints": [
        "Software Components: STEP 7 Professional (S7-1200, S7-1500, S7-300, S7-400), WinCC Advanced/Unified, Safety Advanced, and S7-PLCSIM",
        "Operating System Support: Windows 10 Pro/Enterprise 64-bit, Windows 11 Pro, Windows Server 2019/2022; Home editions are unsupported",
        "Hardware Prerequisites: 16 GB to 32 GB RAM, high-speed NVMe SSD, minimum 1920x1080 display resolution with 100% DPI scaling",
        "Automation License Manager (ALM): Dedicated system service that installs, transfers, validates, and recovers Siemens engineering license keys",
        "21-Day Trial License: Authorizes all professional software features without functional restriction for 21 days from initial activation",
        "Installation Best Practices: Temporarily disable aggressive third-party antivirus suites, execute installer with administrative privileges, and reboot upon completion"
      ],
      "note": "Always verify that your Windows network adapter is not blocked by aggressive corporate firewalls or VPN tunnels during TIA Portal installation, as the Siemens background communication service (s7oiehsx64) requires local port binding."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__065.png",
      "caption": "Figure 2.5: TIA Portal Installed Software View Showing STEP 7 Professional and WinCC Professional"
    }
  ],
  "caseStudy": {
    "title": "Preparing 20 Lab PCs for TIA Portal",
    "context": "A department installs TIA Portal (STEP 7 Professional, WinCC Advanced and S7-PLCSIM) on 20 lab computers before the semester. Two machines get stuck in a loop: the installer reports that a restart is required, and after rebooting asks again. Siemens' documented cause is a pending Windows file-rename entry (PendingFileRenameOperations in the registry) left by another program's update; once it is cleared and the PC restarted, setup continues. Another group of PCs installs successfully but cannot open the instructor's project, because it was saved with a newer TIA Portal version than the one installed.",
    "hardware": [
      "Workstation: 64-bit Windows 10/11 Pro or Enterprise, 16 GB RAM or more, SSD with ample free space",
      "Install as a Windows administrator; pause antivirus scanning of the setup folder if the vendor allows it",
      "Use the same TIA Portal version and update level on all lab PCs and the instructor PC",
      "Automation License Manager: trial license for evaluation, or floating licenses from a license server for the lab",
      "S7-PLCSIM installed so students can test without hardware"
    ],
    "pitfall": "Mixing TIA Portal versions in one lab. A project upgraded to a newer version cannot be opened in an older version, so students' work becomes unreadable on some PCs. Fix the version (and update) for the whole course before installing."
  },
  "quiz": [
    {
      "q": "Which Siemens utility manages license keys for STEP 7 and WinCC?",
      "options": [
        "Automation License Manager (ALM)",
        "SIMATIC S7-PLCSIM",
        "Proneta Professional",
        "TIA Portal Updater"
      ],
      "answer": 0,
      "explain": "Siemens Automation License Manager (ALM) handles activation, transfer, and verification of software licenses."
    },
    {
      "q": "The instructor saves a project in a newer TIA Portal version. What happens on a lab PC with an older TIA Portal version?",
      "options": [
        "The project opens normally with all features",
        "The project cannot be opened; upgrading a project to a newer version is one-way",
        "The project opens read-only with full download capability",
        "TIA Portal converts it automatically to the older format"
      ],
      "answer": 1,
      "explain": "TIA Portal projects can be upgraded to newer versions but not opened in older ones, so all PCs in a course should run the same version."
    },
    {
      "q": "Which TIA Portal component lets students test PLC programs on a virtual CPU without real hardware?",
      "options": [
        "WinCC Runtime",
        "Startdrive",
        "Automation License Manager",
        "S7-PLCSIM"
      ],
      "answer": 3,
      "explain": "S7-PLCSIM simulates an S7 CPU on the PC so programs can be downloaded and tested without a physical controller."
    }
  ],
  "narration": {
    "vi": "TIA Portal là phần mềm lập trình chính thức của Siemens cho dòng S7. Để cài đặt, máy tính cần chạy Windows 10 hoặc 11 64-bit, tối thiểu 8 GB RAM và ổ cứng còn trống khoảng 20 GB. Quá trình cài gồm nhiều gói con như STEP 7, WinCC và Startdrive nên mất khá nhiều thời gian. Nên tắt phần mềm diệt virus trong lúc cài để tránh lỗi. Sau cài đặt cần khởi động lại máy trước khi sử dụng.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "What Is Totally Integrated Automation Portal?",
      "points": [
        "Unified Siemens engineering environment for all automation tasks",
        "Drag-and-drop hardware configuration and multi-language PLC coding",
        "Centralized user administration, access control, and project management",
        "Integrated online diagnostics across all networked devices plus simulation"
      ],
      "explain": "Section 1.7 introduces TIA Portal (Totally Integrated Automation Portal) as Siemens' single-platform engineering framework. Rather than switching between separate tools for PLCs, HMIs, and drives, engineers use one shared database for hardware configuration, network linking, user permissions, live diagnostics, and simulation.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__049.png",
        "caption": "SIMATIC S7-1200 hardware rack paired with the TIA Portal engineering interface"
      }
    },
    {
      "kind": "concept",
      "title": "Core Software Packages Inside TIA Portal",
      "points": [
        "SIMATIC STEP 7: programs S7-1200, S7-1500, S7-300/400, and networks",
        "SIMATIC WinCC: designs operator HMI panels and SCADA runtime screens",
        "SINAMICS Startdrive & SCOUT TIA: configures drives and multi-axis motion",
        "SIRIUS / SIMOCODE & power distribution: parameterizes motor protection"
      ],
      "explain": "Within TIA Portal, six core software pillars cover the entire plant floor: STEP 7 for controller logic, WinCC for HMI/SCADA visualization, Startdrive and SCOUT TIA for variable-frequency drives and motion control, plus SIRIUS/SIMOCODE and power distribution tools for low-voltage switchgear diagnostics.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__033.jpeg",
        "caption": "Six software pillars in TIA Portal: STEP 7, WinCC, Startdrive, Motion Control, SIRIUS/SIMOCODE, and Power Distribution"
      }
    },
    {
      "kind": "concept",
      "title": "Factory & Process Automation Hardware Ecosystem",
      "points": [
        "Spans Field, Control, Operations, Management, and Cloud layers",
        "Factory Automation: controllers, HMIs, industrial PCs, drives, and CNC",
        "Process Automation: process instrumentation, weighing, and remote I/O",
        "Use TIA Selection Tool to specify exact module options and accessories"
      ],
      "explain": "TIA Portal sits at the center of the automation pyramid, linking field sensors, power supplies, and distributed I/O up through controllers and SCADA systems to cloud analytics. Because each Siemens device has many sub-options and accessory part numbers, engineers use the TIA Selection Tool first to validate the bill of materials and export the hardware list directly into ECAD and TIA Portal.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__034.jpeg",
        "caption": "Siemens Factory Automation hierarchy across Field, Control, Operations, Management, and Cloud layers"
      }
    },
    {
      "kind": "concept",
      "title": "Installing TIA Portal, ALM Licensing & S7-PLCSIM",
      "points": [
        "Install TIA Portal (e.g. V15.1 / V16+) on 64-bit Windows 10/11 Pro with ≥16 GB RAM",
        "Standard lab bundle includes STEP 7 Professional and WinCC Advanced/Professional",
        "Automation License Manager (ALM) activates floating, dongle, or 21-day trial keys",
        "Install S7-PLCSIM to emulate an S7 CPU and test code without physical hardware"
      ],
      "explain": "For laboratory and industrial workstations, install matching versions of STEP 7 Professional, WinCC, and S7-PLCSIM as a Windows Administrator, with license keys managed by the Automation License Manager (ALM). Once S7-PLCSIM is installed, students can download and debug their S7-1200 programs on a virtual PLC before connecting to a physical bench.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__065.png",
        "caption": "TIA Portal 'Installed software' screen listing Totally Integrated Automation Portal, STEP 7 Professional, and WinCC Professional V15.1"
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

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
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__050.png",
      "caption": "Figure 2.5: TIA Portal Engineering Suite: STEP 7 Professional, WinCC, and ALM Licensing"
    }
  ],
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
    }
  ],
  "narration": {
    "vi": "TIA Portal là phần mềm lập trình chính thức của Siemens cho dòng S7. Để cài đặt, máy tính cần chạy Windows 10 hoặc 11 64-bit, tối thiểu 8 GB RAM và ổ cứng còn trống khoảng 20 GB. Quá trình cài gồm nhiều gói con như STEP 7, WinCC và Startdrive nên mất khá nhiều thời gian. Nên tắt phần mềm diệt virus trong lúc cài để tránh lỗi. Sau cài đặt cần khởi động lại máy trước khi sử dụng.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

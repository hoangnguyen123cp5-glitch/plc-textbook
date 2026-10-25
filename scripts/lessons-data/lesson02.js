module.exports = {
  overview: "This lesson provides an exhaustive engineering walkthrough of the Siemens SIMATIC S7-1200 compact automation platform and the TIA Portal (Totally Integrated Automation Portal) engineering suite. Students will master the mechanical assembly and thermal clearance guidelines for TS35 DIN-rail mounting, 24VDC control power distribution, electrical topologies for sinking vs sourcing digital inputs (DI), solid-state transistor vs electromechanical relay digital outputs (DO), PROFINET industrial Ethernet network commissioning, and software workflows in STEP 7 V19 for hardware configuration, code compilation, and online diagnostics.",
  objectives: [
    "Identify and specify CPU variants (1211C, 1212C, 1214C, 1215C, 1217C), Signal Modules (SM), Communication Modules (CM), and Signal Boards (SB) in the S7-1200 family",
    "Mount and anchor S7-1200 controllers onto standard 35mm DIN rail with proper thermal ventilation clearances",
    "Wire 24VDC system power, digital input sinking/sourcing circuits (1M common), and relay/transistor digital outputs with flyback diode protection",
    "Verify field wiring using TIA Portal Watch Tables, Force Tables, and physical front-panel diagnostic LEDs",
    "Install and license TIA Portal V19, STEP 7 Professional, WinCC Advanced, and S7-PLCSIM using Automation License Manager",
    "Navigate Project View and Portal View, configure exact CPU hardware catalog numbers (MLFB), and assign static PROFINET IP addresses",
    "Configure PG/PC communication interfaces, establish online connectivity, and execute program downloads to real and virtual CPUs"
  ],
  sections: [
    {
      title: "1.3 The S7-1200 Programmable Controller",
      content: "The Siemens SIMATIC S7-1200 is a modular micro-PLC designed for open-loop and closed-loop process control across discrete manufacturing and process industries. The central processing unit (CPU) integrates a 32-bit RISC microprocessor, non-volatile Flash load memory, volatile execution work memory, high-speed digital and analog I/O channels, and an on-board PROFINET Industrial Ethernet port. The hardware family spans five performance tiers: CPU 1211C, 1212C, 1214C, 1215C, and 1217C, differing in work memory capacity (50 KB up to 250 KB), I/O count, and expansion capability. The CPU can be expanded using three modular form factors: Signal Boards (SB) or Communication Boards (CB) that snap directly into the front housing without altering the panel footprint; Signal Modules (SM) providing dense digital/analog expansion attached via high-speed backplane sliding bus connectors to the right; and Communication Modules (CM) providing serial RS232/RS485 or PROFIBUS interfaces attached to the left.",
      keyPoints: [
        "CPU Form Factor Variants: Available in DC/DC/DC (24VDC supply, 24VDC inputs, 24VDC transistor outputs), AC/DC/Relay (120/230VAC supply, 24VDC inputs, relay outputs), and DC/DC/Relay",
        "Performance Hierarchy: CPU 1211C (50 KB RAM, no SM expansion) to CPU 1214C/1215C/1217C (up to 8 SM expansion modules and 3 CM modules)",
        "Signal Board (SB) Slot: Dedicated front-bezel receptacle supporting 1 SB (e.g. 2 DI/2 DO, 1 AI 12-bit, or 1 AQ 12-bit) without consuming DIN-rail horizontal length",
        "High-Speed Backplane Bus: Proprietary multi-pin slide bus interconnects modules on the right; transfers cyclic process images with hardware synchronization",
        "Communication Modules (CM): Mount to the left of the CPU, supporting up to 3 modules for Point-to-Point (PtP) RS485 Modbus RTU, PROFIBUS-DP, or TeleControl",
        "Mechanical Mounting: Mounts horizontally or vertically on standard 35mm DIN rail (EN 50022) with pull-down locking spring tabs"
      ],
      note: "For reliable convection cooling, maintain a minimum thermal clearance of 25 mm (1.0 inch) above and below all S7-1200 modules. Maximum ambient operating temperature is 55°C for horizontal DIN-rail mounting and 45°C for vertical mounting."
    },
    {
      title: "1.4 Program Processing in TIA Portal",
      content: "Program processing in the S7-1200 controller is deterministic and governed by the cyclic operating system architecture. The top-level execution thread resides in Organization Block 1 (OB1), which is invoked cyclically by the CPU operating system immediately upon completion of each scan cycle. User application logic is organized hierarchically into modular code blocks: Functions (FC) represent stateless subroutines suitable for standard mathematical transformations or reusable Boolean algorithms; Function Blocks (FB) maintain internal state memory stored in dedicated Instance Data Blocks (Instance DB); and Global Data Blocks (Global DB) hold plant-wide operational parameters, recipe setpoints, and HMI telemetry accessible by all blocks. In addition to cyclic execution, the CPU supports event-driven execution via specialized Organization Blocks: Cyclic Interrupts (OB30–OB38) triggered by precise hardware timers for discrete-time PID loops, Hardware Interrupts (OB40–OB47) triggered within microseconds by digital input edges, and Time-Error Interrupts (OB80).",
      keyPoints: [
        "Main Cyclic Organization Block (OB1): Default entry point executed cyclically by the runtime firmware; evaluates networks sequentially from top to bottom",
        "Functions (FC): Stateless modular blocks; all internal variables (TEMP) lose their values upon block exit; ideal for pure algorithmic calculations",
        "Function Blocks (FB): Stateful modular blocks; internal static variables (STAT) persist between cycles within a dedicated Instance Data Block (DB)",
        "Global Data Blocks (DB): Centralized memory tables accessible across the entire project; supports both standard (offset-based) and optimized (symbolic) access",
        "Cyclic Interrupts (OB30): Deterministic execution triggered at precise user-defined intervals (e.g. every 10 ms), essential for accurate PID closed-loop control",
        "Process Image Synchronization: Code blocks read from the Process Image Input (PII) table rather than querying physical pins directly, ensuring data consistency across rungs"
      ],
      note: "Never use standard timers (TON/TOF) or software counters inside interrupt OBs (OB30/OB40). Always keep interrupt block execution times well below the interrupt interval to avoid triggering OB80 cycle time faults."
    },
    {
      title: "1.5 Wiring the PLC to Field Devices",
      content: "Wiring field devices to the S7-1200 requires rigorous adherence to industrial electrical standards (IEC 60204-1 and NFPA 79). Control power is supplied via terminals L+ (+24VDC) and M (0VDC return), with protective earth grounded at the PE screw. The discrete digital inputs of the S7-1200 feature optical isolation and can be configured as Sinking or Sourcing circuits by wiring the common terminal '1M'. In a Sinking DI configuration (standard European PNP sensor compatibility), 1M is connected to 0VDC (M), and external sensors switch +24VDC into the input terminals (%I0.0 to %I1.5). For digital outputs, DC/DC/DC CPUs provide high-speed power MOSFET transistor outputs (24VDC sourcing, rated 0.5A per channel) capable of switching up to 100 kHz for pulse train motion control. AC/DC/Relay CPUs feature dry electromechanical relay contacts rated for 2.0A switching of either 24VDC or 120/230VAC external loads. Freewheeling flyback diodes must be wired across all DC inductive loads (solenoids, contactor coils) to suppress destructive high-voltage inductive kickback.",
      keyPoints: [
        "System Power Supply: 24VDC nominal (allowable range 20.4VDC to 28.8VDC) at L+ and M; provide upstream miniature circuit breaker (MCB) or fuse protection",
        "Digital Input Sinking Circuit (PNP): Connect common terminal 1M to 0VDC (M); input activates when switched high (+24VDC relative to 1M)",
        "Digital Input Sourcing Circuit (NPN): Connect common terminal 1M to +24VDC (L+); input activates when pulled low (0VDC relative to 1M)",
        "Transistor DO Specifications: Sourcing MOSFET outputs (switches +24VDC from 1L+ to output pin); 0.5A max continuous load; 100 kHz maximum switching speed",
        "Relay DO Specifications: Form-A dry contact; 2.0A resistive / inductive load; maximum 1 Hz switching rate; galvanic isolation between relay groups (1L, 2L)",
        "Inductive Suppression: Reverse-biased 1N4007 diodes across DC coils, or RC snubber circuits across AC coils, prevent contact arcing and optical isolator damage",
        "Wiring Practices: Always terminate stranded conductors with insulated ferrule crimp pins (bootlace pins) sized 0.5 mm² to 1.5 mm² (AWG 20 to 16)"
      ],
      note: "Failure to install freewheeling flyback diodes across DC inductive solenoid valves can generate inductive voltage spikes exceeding 400V, causing immediate breakdown of the S7-1200 transistor output stages or intermittent CPU hardware crashes."
    },
    {
      title: "1.6 Verifying Wiring in Software",
      content: "Once physical wiring is terminated, the automation engineer must systematically verify every field channel before commissioning software logic. The S7-1200 front panel provides discrete green status LEDs for every physical input (%I0.0–%I1.5) and output (%Q0.0–%Q1.1) terminal. A green input LED indicates that the electrical threshold (typically >15VDC for logic '1') is present across the terminal and its 1M common. In TIA Portal, the engineer navigates online and utilizes Watch Tables (monitoring live bit values in real time) and Force Tables (manually asserting physical states) to validate loop integrity. By actuating field pushbuttons, limit switches, and photoelectric sensors, the live boolean state can be witnessed simultaneously on the physical LED and in the TIA Portal Watch Table. Similarly, digital outputs can be individually toggled via Watch Table modify commands to verify that the corresponding interposing relay clicks, the solenoid valve fires, and the motor contactor pulls in cleanly.",
      keyPoints: [
        "Hardware LED Telemetry: The green LED indicates electrical potential at the screw terminal, confirming field loop continuity before software execution",
        "Watch Tables: Allow non-invasive live monitoring and one-shot modifying of bit markers (%M), process inputs (%I), process outputs (%Q), and DB tags",
        "Force Table Safety: Forcing overrides both user program logic and process images by writing directly to peripheral hardware; indicated by flashing yellow FORCE LED",
        "Point-to-Point Loop Check: Rigorous commissioning protocol where two technicians (one in field, one in TIA Portal) verify 100% of physical sensor channels",
        "Cross-Reference List: TIA Portal tool (Shift+F11) revealing every occurrence where a specific tag is read or written, detecting destructive dual-coil conflicts",
        "Peripheral Addressing (:P): Using %I0.0:P or %Q0.0:P reads or writes directly to physical hardware, bypassing image tables for immediate signal validation"
      ],
      note: "Never leave a machine in 'Force' mode after testing! The Force function locks physical outputs regardless of emergency stops or safety rungs in your program, presenting severe hazard to personnel and machinery."
    },
    {
      title: "1.7 Installing TIA Portal",
      content: "Siemens Totally Integrated Automation Portal (TIA Portal) is an industrial engineering software package integrating STEP 7 (PLC programming), WinCC (HMI and SCADA design), Startdrive (frequency converter parameterization), and S7-PLCSIM (virtual PLC emulation). A robust workstation configuration is critical for efficient engineering workflows: 64-bit Windows 10/11 Professional or Enterprise, multi-core Intel Core i7/i9 or AMD Ryzen processor (>=3.4 GHz), minimum 16 GB of high-speed DDR4/DDR5 RAM (32 GB recommended for large multi-device topologies), and solid-state storage (NVMe SSD) with at least 50 GB of unallocated disk space. The installation media is distributed as self-extracting ISO archives available via Siemens Industry Online Support (SIOS). Licensing is governed centrally by the Automation License Manager (ALM), which manages node-locked, USB dongle, or network floating licenses. Siemens provides a fully functional 21-day trial license enabling complete evaluation and academic laboratory instruction.",
      keyPoints: [
        "Software Components: STEP 7 Professional (S7-1200, S7-1500, S7-300, S7-400), WinCC Advanced/Unified, Safety Advanced, and S7-PLCSIM",
        "Operating System Support: Windows 10 Pro/Enterprise 64-bit, Windows 11 Pro, Windows Server 2019/2022; Home editions are unsupported",
        "Hardware Prerequisites: 16 GB to 32 GB RAM, high-speed NVMe SSD, minimum 1920x1080 display resolution with 100% DPI scaling",
        "Automation License Manager (ALM): Dedicated system service that installs, transfers, validates, and recovers Siemens engineering license keys",
        "21-Day Trial License: Authorizes all professional software features without functional restriction for 21 days from initial activation",
        "Installation Best Practices: Temporarily disable aggressive third-party antivirus suites, execute installer with administrative privileges, and reboot upon completion"
      ],
      note: "Always verify that your Windows network adapter is not blocked by aggressive corporate firewalls or VPN tunnels during TIA Portal installation, as the Siemens background communication service (s7oiehsx64) requires local port binding."
    },
    {
      title: "1.8 Working with TIA Portal",
      content: "TIA Portal presents two complementary graphical environments: Portal View and Project View. Portal View is a task-oriented interface tailored for quick operational tasks (creating projects, hardware discovery, diagnostic inspections, and firmware updates). Project View is the comprehensive hierarchical engineering workbench, organized into three primary functional areas: the Project Tree on the left (containing PLC folders, Program Blocks, PLC Tags, and Device Configuration), the central Work Area (where ladder rungs, hardware racks, and network topologies are visually designed), and the Inspector / Task Card Area on the bottom and right (providing contextual hardware properties, diagnostics, instruction catalogs, and cross-references). To configure hardware, the engineer drags the specific CPU model from the hardware catalog into the Device View, verifying that the order code (MLFB) and firmware revision (e.g. V4.6) exactly match the physical device. The project is compiled (Ctrl+B for hardware, Ctrl+Shift+B for software) and downloaded to the CPU via PROFINET.",
      keyPoints: [
        "Portal View vs Project View: Switch seamlessly between task-oriented portal navigation and deep hierarchical project editing via the bottom-left toggle",
        "Project Tree Organization: Structured root hierarchy containing Devices, Program Blocks (OB/FC/FB/DB), PLC Tag Tables, Watch Tables, and Common Data",
        "MLFB Part Number Precision: Verify the complete Siemens article number (e.g. 6ES7 214-1AG40-0XB0); mismatched catalog models will reject program downloads",
        "Firmware Matching: Ensure the project hardware firmware revision matches or is backward-compatible with the physical CPU firmware (e.g. V4.2 vs V4.6)",
        "Hardware Catalog Navigation: Search and insert CPUs, Signal Boards, Signal Modules, ET 200 distributed stations, and drive nodes into the graphical rack",
        "Compilation and Download: Full compilation validates memory allocations, addressing conflicts, and syntax errors prior to transferring runtime blocks to Flash"
      ],
      note: "Use the 'Detect unspecific S7-1200 CPU' feature in TIA Portal if the physical CPU's exact firmware revision or expansion card configuration is unknown. TIA Portal will query the online PLC over Ethernet and automatically configure the exact hardware rack."
    },
    {
      title: "1.9 Communication Setup (PC/PPI Cable)",
      content: "Establishing communication between the engineering workstation and the PLC is the prerequisite for all online diagnostics, program downloads, and live monitoring. Modern SIMATIC S7-1200 CPUs utilize standard PROFINET Industrial Ethernet (10/100 Mbps RJ45) eliminating the requirement for proprietary programming adapters. The engineering workstation's Network Interface Card (NIC) must be assigned a static IP address residing in the identical subnet as the PLC (e.g. PC: 192.168.0.241 / 255.255.255.0; PLC factory default: 192.168.0.1 / 255.255.255.0). Standard Cat5e shielded twisted-pair (STP) Ethernet cables are utilized; integrated Auto-MDI/X automatically resolves straight-through or cross-over cable pinouts. In legacy installations (such as S7-200 micro-PLCs), communication required a specialized PC/PPI (Point-to-Point Interface) cable: an RS232-to-RS485 or USB-to-RS485 optoisolated converter operating at 9.6 or 187.5 kbps. In TIA Portal, the 'Accessible Devices' scan tool queries all active nodes on the physical Ethernet segment via MAC broadcast, allowing engineers to flash CPU LEDs to verify identity and assign new IP addresses.",
      keyPoints: [
        "PROFINET Physical Layer: Standard Cat5e STP shielded industrial Ethernet with RJ45 connectors; supports up to 100 meters per cable segment",
        "Auto-MDI/X Feature: Automatically senses and configures cable pinout orientation, eliminating the need for specialized Ethernet crossover cables",
        "IP Address Subnetting: The engineering laptop NIC and S7-1200 must share an identical subnet mask (255.255.255.0) and distinct IP addresses in the same range",
        "Accessible Devices Tool: Broadcasts Layer 2 DCP (Discovery and Configuration Protocol) frames to detect all connected Siemens nodes regardless of IP configuration",
        "Flash LED Verification: Online diagnostic command that commands the CPU RUN/STOP, ERROR, and MAINT LEDs to flash simultaneously for positive panel identification",
        "Legacy PC/PPI Cable: Optically isolated USB-to-RS485 converter utilized exclusively for programming vintage SIMATIC S7-200 micro-controllers",
        "Direct PG/PC Connection: Enables direct peer-to-peer programming without requiring an intermediate Ethernet network switch"
      ],
      note: "If TIA Portal fails to discover an online S7-1200 CPU during the 'Accessible Devices' scan, verify in Windows Network Connections that the active physical Ethernet card is selected as the PG/PC interface, and disable secondary active Wi-Fi adapters to prevent multi-homed routing conflicts."
    }
  ],
  review: [
    "List the five CPU performance tiers in the SIMATIC S7-1200 family and explain the functional differences between Signal Boards (SB) and Signal Modules (SM).",
    "Describe the mechanical mounting and thermal clearance rules for mounting S7-1200 hardware onto a TS35 DIN rail in high-temperature industrial control panels.",
    "Explain the electrical distinction between Sinking and Sourcing digital input configurations on the S7-1200. What terminal connection determines this operating mode?",
    "Why must reverse-biased freewheeling flyback diodes be installed across DC inductive solenoid coils driven by S7-1200 transistor digital outputs?",
    "Compare the operational safety characteristics and runtime effects of using a Watch Table versus a Force Table in TIA Portal.",
    "Detail the step-by-step engineering workflow required to configure, compile, and download a new S7-1200 hardware project in TIA Portal V19.",
    "A technician cannot connect an engineering laptop to a newly unboxed S7-1200 CPU. Explain how to configure the laptop IP settings and use the Accessible Devices tool to establish communication."
  ]
};

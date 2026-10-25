module.exports = {
  overview: "Modern automated factories are distributed networks where controllers, remote I/O islands, motor drives, operator panels, and smart sensors exchange critical data in real time. This lesson examines industrial communication technologies on the Siemens S7-1200 platform. Students will explore Point-to-Point (PtP) serial communications over RS232 and RS485 using the Modbus RTU protocol (master/slave architecture, holding registers, MB_COMM_LOAD, MB_MASTER, MB_SLAVE function blocks), fieldbus architectures (PROFIBUS DP token-ring master/slave networks), and high-speed deterministic PROFINET IO Industrial Ethernet (Real-Time RT and Isochronous Real-Time IRT, IO Controllers, IO Devices, and GSDML device integration).",
  objectives: [
    "Compare physical layer electrical characteristics, topology limits, and baud rates of RS232, RS485, and PROFINET Industrial Ethernet",
    "Configure Communication Modules (CM 1241) and Communication Boards (CB 1241) for Point-to-Point (PtP) serial communication in TIA Portal",
    "Implement Modbus RTU communication networks, parameterizing MB_COMM_LOAD, MB_MASTER, and MB_SLAVE blocks to read/write holding registers",
    "Describe the token-passing and master-slave polling architecture of PROFIBUS-DP using CM 1243-5 (master) and CM 1242-5 (slave)",
    "Configure PROFINET IO topologies in TIA Portal Network View, assigning PROFINET device names, IP addresses, and update times",
    "Import GSDML device description files to integrate third-party remote I/O and variable frequency drives onto PROFINET networks",
    "Diagnose industrial communication faults using Wireshark, online network topologies, and communication status words"
  ],
  sections: [
    {
      title: "6.1 Point-to-Point Communication",
      content: "Point-to-Point (PtP) serial communication remains a vital industrial networking standard for connecting micro-PLCs to peripheral field instrumentation: digital power meters, weigh-scale indicators, barcode readers, temperature controllers, and variable frequency drives. The S7-1200 supports serial communication via Communication Modules (CM 1241) mounted to the left of the CPU, or compact Communication Boards (CB 1241) inserted into the CPU front bezel. Two physical electrical standards are supported: RS232 (unbalanced single-ended signaling, point-to-point only, maximum distance 15 meters, sensitive to ground noise) and RS485 (balanced differential signaling across a twisted wire pair (terminals TA/TB or A/B), multi-drop bus supporting up to 32 transceivers, cable lengths up to 1200 meters at 187.5 kbps). The dominant protocol on serial lines is Modbus RTU: an open master-slave protocol where a single Master polls multiple Slaves (addressed 1 to 247). In TIA Portal, serial networks are programmed using standardized function blocks: MB_COMM_LOAD initializes the serial port hardware (baud rate, parity, stop bits), while MB_MASTER executes cyclic read/write requests (Function Code 03 for Read Holding Registers, Function Code 06/16 for Write Holding Registers) mapped to Data Block arrays.",
      keyPoints: [
        "RS232 Physical Standard: Single-ended voltage signals (±12V); maximum 15m distance; restricted strictly to 1-to-1 device connections",
        "RS485 Differential Standard: Differential voltage signaling across twisted pair (A/B); high common-mode noise rejection; up to 1200m distance; multi-drop bus for 32 nodes",
        "120-Ohm Termination Resistors: High-speed RS485 lines require 120-ohm termination resistors switched ON at both physical ends of the cable to prevent signal reflections",
        "Modbus RTU Protocol Architecture: Strict Master/Slave polling; Master initiates all queries; Slaves never transmit spontaneously; binary frame format with 16-bit CRC error checking",
        "Modbus Register Addressing: Discrete Inputs (10001+), Coils (00001+), Input Registers (30001+), and Holding Registers (40001+)",
        "MB_COMM_LOAD Instruction: Configures hardware baud rate (9600, 19200, 38400, 115200 bps), parity (Even/Odd/None), and assigns communication buffers",
        "MB_MASTER Function Block: Executes read/write commands: MODE (0=Read, 1=Write), DATA_ADDR (40001), DATA_LEN (register count), and DATA_PTR (pointer to DB array)"
      ],
      note: "On an RS485 Modbus RTU network, ensure that the two bus-end devices have their 120-ohm termination resistors switched ON, and all intermediate devices have termination switched OFF! Missing or extra termination resistors cause severe signal reflections, leading to intermittent CRC communication timeout faults."
    },
    {
      title: "6.2 PROFINET and PROFIBUS",
      content: "For high-performance plant-wide coordination, modern automated manufacturing relies on standardized fieldbus and Industrial Ethernet protocols: PROFIBUS and PROFINET. PROFIBUS-DP (Decentralized Periphery) is an RS485-based token-ring master-slave fieldbus operating at speeds up to 12 Mbps over purple shielded cables. The S7-1200 interfaces to PROFIBUS via the CM 1243-5 (DP Master) or CM 1242-5 (DP Slave) modules. Today, PROFINET IO (Industrial Ethernet based on IEEE 802.3 standard at 100 Mbps full duplex) is the global standard for industrial networking, integrated natively onto every S7-1200 CPU. PROFINET replaces cyclic token-passing with deterministic Ethernet frames: Real-Time (RT) communication bypasses the standard TCP/IP protocol stack directly at Layer 2 (MAC level), delivering deterministic cycle update times under 1 ms with microsecond jitter. A PROFINET IO network comprises three device roles: the IO Controller (the PLC CPU executing logic), IO Devices (distributed remote I/O racks like ET 200SP, valve manifolds, and SINAMICS drives), and IO Supervisors (engineering workstations running TIA Portal). Devices are identified globally by unique symbolic PROFINET Device Names assigned in TIA Portal and resolved to IP addresses via the Discovery and Configuration Protocol (DCP). Third-party devices are integrated into TIA Portal by importing standardized XML-based GSDML (General Station Description Markup Language) device profile files.",
      keyPoints: [
        "PROFINET Industrial Ethernet: Standard 100 Mbps full duplex; Cat5e shielded twisted pair with green industrial jacket; standard RJ45 or M12 connectors",
        "Real-Time (RT) Communication: Layer 2 priority tagging (IEEE 802.1Q) bypasses TCP/IP stack overhead, delivering deterministic cyclic data exchange (< 1 ms)",
        "Isochronous Real-Time (IRT): Hardware-synchronized Ethernet utilizing dedicated ASIC switches for jitter < 1 µs; essential for multi-axis coordinated motion",
        "PROFINET Device Naming: Devices are addressed by symbolic names (e.g. 'et200sp-conveyor1') rather than static IPs; DCP protocol resolves names to IP addresses automatically",
        "GSDML Device Description Files: Standardized XML device description files downloaded from manufacturers to integrate third-party drives and sensors into TIA Portal",
        "Media Redundancy Protocol (MRP): Ring network topology providing bumpless recovery (< 200 ms) in the event of a severed Ethernet cable",
        "PROFIBUS-DP Comparison: Legacy 12 Mbps token-ring fieldbus; requires specialized 9-pin Sub-D connectors with built-in terminating resistors and diagnostic LEDs"
      ],
      note: "Always assign unique PROFINET Device Names to all distributed stations using TIA Portal before connecting them to the plant network! Unlike commercial office networks where IP addresses are primary, a PROFINET IO Controller will refuse to communicate with a remote I/O rack if its internal device name does not match the project configuration."
    }
  ],
  review: [
    "Compare the electrical signaling, maximum cable distance, noise immunity, and multi-drop capabilities of RS232 versus RS485.",
    "Describe the master-slave operating architecture of the Modbus RTU protocol. Can a slave device initiate data transmission without a master query?",
    "Explain how the MB_COMM_LOAD and MB_MASTER instruction blocks work together in TIA Portal to read holding registers from an external power meter.",
    "Why must 120-ohm termination resistors be installed at both physical ends of an RS485 communication cable segment?",
    "Explain how PROFINET Real-Time (RT) communication achieves deterministic update times (< 1 ms) over standard IEEE 802.3 Ethernet cables.",
    "Describe the role of the Discovery and Configuration Protocol (DCP) and explain why PROFINET devices require unique symbolic Device Names.",
    "What is a GSDML file, who provides it, and how is it used by an automation engineer in TIA Portal to integrate a third-party variable frequency drive?"
  ]
};

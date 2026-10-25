module.exports = {
  overview: "For over two decades, the Siemens SIMATIC S7-300 was the undisputed workhorse of global industrial automation, installed in hundreds of thousands of manufacturing facilities, chemical plants, and automotive assembly lines worldwide. While superseded by the modern S7-1500 family, the S7-300 will remain operational in factories for decades to come due to high replacement costs and validated process certifications. This lesson provides students with the practical engineering foundation required to service legacy S7-300 installations: understanding the active backplane rack hardware architecture (PS, CPU, IM, SM, CP modules), programming in Statement List (STL / AWL) accumulator-based logic and classic STEP 7 V5.x, communicating over MPI and PROFIBUS-DP, and evaluating modernization strategies.",
  objectives: [
    "Identify physical hardware components and slot allocation rules across S7-300 racks (PS, CPU, IM 360/361, SM, CP)",
    "Connect to legacy S7-300 PLCs using MPI (Multi-Point Interface) and PROFIBUS-DP programming adapters",
    "Navigate and maintain legacy projects using SIMATIC STEP 7 Classic (V5.6/V5.7) and TIA Portal migration bridges",
    "Read, analyze, and troubleshoot register-based Statement List (STL / AWL) instructions (L, T, A, AN, O, =, +I, -I, JC, JU)",
    "Analyze the internal CPU architecture: Accumulators (ACCU1, ACCU2), Address Registers (AR1, AR2), and the Status Word (RLO, STA, OR, OS, OV)",
    "Assess existing S7-300 factory installations to determine when to maintain versus when to schedule migration to S7-1500"
  ],
  sections: [
    {
      title: "S7-300 Platform Overview",
      content: "The SIMATIC S7-300 is a modular automation system engineered for medium-to-high performance factory applications. Unlike the S7-1200 which snaps modules together via side sliding connectors, the S7-300 mounts onto a dedicated aluminum S7 rail and interconnects modules using active U-shaped backplane bus connectors (bus connectors) plugged between adjacent cards. Hardware rack slots follow strict architectural rules: Slot 1 is reserved exclusively for the Power Supply (PS 307: 2A, 5A, or 10A 24VDC); Slot 2 hosts the Central Processing Unit (CPU: ranging from the economical CPU 312 to high-performance CPU 315-2 PN/DP, CPU 317, and CPU 319-3 PN/DP); Slot 3 is reserved strictly for an Interface Module (IM 360/361 or IM 365) used to expand to up to 4 interconnected multi-tier racks; Slots 4 through 11 host up to 8 Signal Modules (SM), Function Modules (FM), or Communication Processors (CP). Legacy CPUs relied on internal lithium backup batteries (for retaining RAM data), whereas modern S7-300 CPUs utilize a non-volatile Micro Memory Card (MMC). Field communications operate primarily over Multi-Point Interface (MPI: 187.5 kbps proprietary token-passing bus) and PROFIBUS-DP (up to 12 Mbps), with modern variants integrating PROFINET.",
      keyPoints: [
        "Modular Backplane Architecture: Modules bolt onto an aluminum mounting rail and interconnect via rear multi-pin U-shaped bus connectors",
        "Strict Slot Assignment Rules: Slot 1 = Power Supply (PS), Slot 2 = CPU Module, Slot 3 = Interface Module (IM for multi-tier expansion), Slots 4–11 = I/O and CP Modules",
        "Multi-Tier Expansion Racks: Up to 4 physical racks (32 total modules) linked via IM 360 (send) and IM 361 (receive) interface modules",
        "SIMATIC Micro Memory Card (MMC): Non-volatile Flash storage retaining the compiled project, DB values, and symbols without battery backup",
        "Multi-Point Interface (MPI): Integrated RS485 programming and HMI interface running at 187.5 kbps (or 12 Mbps on high-end CPUs) supporting up to 32 nodes",
        "Integrated PROFIBUS-DP Port: Integrated DB9 female connector supporting master/slave decentralized peripheral I/O at speeds up to 12 Mbps",
        "End-of-Life Lifecycle: Spare parts and repair services are guaranteed by Siemens through approximately 2030, after which components transition to legacy status"
      ],
      note: "Never remove or insert an S7-300 Micro Memory Card (MMC) while power is applied to the CPU! Unseating the MMC while the CPU is powered will corrupt the card's non-volatile flash partition, requiring a low-level format using a specialized Siemens prommer or resulting in permanent card failure."
    },
    {
      title: "8.2 S7-300 Instruction Set",
      content: "While the S7-300 supports Ladder Diagram (LAD) and Function Block Diagram (FBD), a vast proportion of legacy European machinery was programmed in Statement List (STL / AWL in German). STL is a low-level, machine-oriented language that operates on two 32-bit hardware data registers known as Accumulator 1 (ACCU1) and Accumulator 2 (ACCU2), coordinated by a 9-bit Status Word register. The fundamental data transfer sequence is Load and Transfer: 'L MW10' pushes the old content of ACCU1 into ACCU2 and loads the value of MW10 into ACCU1; 'T MW12' copies the content of ACCU1 into memory word MW12 without disturbing ACCU1. Binary logic operations evaluate into the Result of Logic Operation (RLO) bit of the Status Word: 'A I0.0' evaluates Boolean AND; 'AN I0.1' evaluates AND-NOT; 'O I0.2' evaluates Boolean OR; and '= Q0.0' assigns the evaluated RLO to the output. Mathematical instructions operate directly between accumulators: '+I' adds the 16-bit integer in ACCU2 to ACCU1 and stores the result in ACCU1. Program flow is controlled via unconditional jumps ('JU Target') or conditional jumps ('JC Target', executed only if RLO=1).",
      keyPoints: [
        "Accumulator Architecture: ACCU1 (primary working register) and ACCU2 (secondary operand register) execute 16-bit and 32-bit arithmetic",
        "Load and Transfer Syntax: 'L [address]' loads value into ACCU1 (shifts old ACCU1 into ACCU2); 'T [address]' transfers ACCU1 to destination memory",
        "Status Word Bits: RLO (Result of Logic Operation), STA (Status of evaluated bit), OR (Or logic memory), OS (Overflow Stored), OV (Overflow)",
        "Boolean Mnemonics: A (AND), AN (AND-NOT), O (OR), ON (OR-NOT), X (XOR), = (Assign), S (Set), R (Reset)",
        "Arithmetic Mnemonics: +I (Add Int), -I (Subtract Int), *I (Multiply Int), /I (Divide Int); for floating point: +R, -R, *R, /R",
        "Conditional Flow Control: JC (Jump if RLO=1), JCN (Jump if RLO=0), JU (Jump Unconditional); jumps skip intermediate STL instructions",
        "Pointer Indirect Addressing: Address Registers (AR1, AR2) and pointer constants (e.g. P#DBX10.0) allow dynamic runtime memory indexing"
      ],
      note: "When troubleshooting STL logic online, always monitor the RLO column! A rung in STL does not display colored power flow lines; instead, STEP 7 displays the instantaneous binary state of the evaluated contact (STA column) and the resulting running logic state (RLO column)."
    },
    {
      title: "8.3 S7-300 in Factory Applications",
      content: "The S7-300 remains deeply entrenched in global manufacturing infrastructure: automotive stamping and body-in-white welding lines, chemical pharmaceutical batch reactors, municipal water treatment plants, and airport baggage handling networks commissioned between 1995 and 2018. The classic architecture typically comprises an S7-300 CPU (such as the workhorse CPU 315-2 PN/DP or CPU 317-2 DP) connected to multiple ET 200M distributed I/O stations over a redundant PROFIBUS-DP network. Automation engineers managing these legacy assets face critical lifecycle decisions: maintaining the system with refurbished spare parts, or migrating to modern S7-1500 controllers. Key technical triggers that dictate replacement include: scarcity of obsolete replacement cards, lack of cybersecurity features (the S7-300 has no built-in encryption or TLS security), lack of modern IIoT connectivity (OPC-UA, MQTT, cloud telemetry), and production capacity expansion limits. However, where processes are validated and spare parts remain in stock, maintaining the existing S7-300 line is frequently the most economically sound operational strategy.",
      keyPoints: [
        "Ubiquitous Factory Deployments: Primary controller in millions of automotive assembly fixtures, packaging machines, and utility plants worldwide",
        "ET 200M Distributed I/O: High-density modular remote I/O utilizing standard S7-300 SM modules connected via IM 153 interface modules over PROFIBUS",
        "Fail-Safe Variants (S7-300F): Yellow-bezel fail-safe CPUs (e.g. CPU 315F) executing functional safety logic up to SIL 3 / PL e via PROFIsafe",
        "Cybersecurity and Connectivity Gaps: Legacy S7-300 CPUs lack modern TLS encryption, user management, and native OPC-UA server capabilities",
        "Maintenance Strategies: Procuring certified refurbished spare modules; maintaining battery replacements for older RAM CPUs; regular backup of MMC cards",
        "Engineering Software Requirements: Supported in classic SIMATIC STEP 7 V5.6/V5.7, and can be configured in TIA Portal V11 through V19",
        "Migration Evaluation Criteria: Upgrade when downtime costs exceed migration budget, or when required spare parts are discontinued by Siemens"
      ],
      note: "Before modifying any code on a legacy factory S7-300, always perform an 'Upload Station to PG' in STEP 7 to pull the exact running binary blocks from the online CPU into a fresh backup archive! Legacy machines often have undocumented field patches that do not exist in the plant's old binder documentation."
    }
  ],
  review: [
    "Detail the strict slot allocation rules across an S7-300 hardware rack. What modules must be placed in Slots 1, 2, and 3?",
    "Explain the mechanical and electrical role of the U-shaped active bus connector in an S7-300 backplane rack.",
    "Translate the following S7-300 STL instruction sequence into an equivalent Ladder Diagram rung: L MW10 / L 100 / >=I / = Q0.0.",
    "Explain the functional roles of Accumulator 1 (ACCU1), Accumulator 2 (ACCU2), and the RLO bit in Statement List execution.",
    "What is an MMC (Micro Memory Card) in the S7-300 platform, and why must it never be extracted while the CPU is powered?",
    "Why are hundreds of thousands of S7-300 PLCs still running in active production lines despite being superseded by the S7-1500?",
    "List three technical or operational factors that would compel a plant manager to migrate a legacy S7-300 control system to a modern S7-1500."
  ]
};

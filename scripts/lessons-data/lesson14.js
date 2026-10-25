module.exports = {
  overview: "Industrial automation systems inevitably reach the end of their technological and economic lifecycles. Replacing legacy programmable controllers (such as the SIMATIC S7-200, S7-300, and S7-400) is a high-stakes capital engineering project requiring meticulous risk management, automated code conversion, physical field wiring adaptations, and commissioning protocols. A botched migration can halt factory production for days, costing millions of dollars. This lesson provides a structured engineering roadmap for executing seamless PLC migrations: defining business and technical justifications, identifying official Siemens hardware and software upgrade paths, utilizing the TIA Portal Migration Tool, converting legacy register-based logic (STL) into modern symbolic structured text (SCL), and developing comprehensive risk registers and rollback plans.",
  objectives: [
    "Evaluate technical obsolescence, spare part costs, safety directives, and IIoT business drivers to justify a PLC modernization project",
    "Identify official Siemens hardware replacement matrices (S7-200 to S7-1200; S7-300/400 to S7-1500; ET 200M to ET 200MP/SP)",
    "Prepare legacy STEP 7 Classic projects (V5.5/V5.6) for migration, resolving library conflicts and code protections",
    "Execute automated project conversion using the TIA Portal Migration Tool and resolve unmigrated instruction warnings",
    "Translate legacy Statement List (STL) accumulator instructions and indirect pointer memory access into optimized SCL code",
    "Deploy physical front-connector wiring adapters to execute zero-rewiring hardware swaps on factory panels",
    "Draft a formal Commissioning Risk Register, Site Acceptance Test (SAT) protocol, and a 15-minute emergency rollback procedure"
  ],
  sections: [
    {
      title: "Why and When to Upgrade",
      content: "Upgrading an industrial control system is a major capital investment that requires clear technical and business justifications. A modernization project is rarely initiated merely because newer hardware exists; rather, it is driven by four primary operational risk factors: (1) Hardware Obsolescence: When manufacturers declare a PLC family 'Discontinued' (as Siemens did with S7-200 and S7-300), original spare parts become scarce, lead times lengthen to months, and emergency replacement modules on secondary markets surge to 500% of original price. (2) Production Reliability and Unplanned Downtime: Aging power supplies, failing memory capacitors, and oxidised backplane connectors cause intermittent, catastrophic line stoppages. (3) Regulatory and Functional Safety Standards: Modern machinery directives (ISO 13849-1, IEC 62061) mandate Performance Level d/e (PL d/e) and SIL 2/3 safety integration that legacy discrete relay panels or vintage PLCs cannot support. (4) Digital Transformation and IIoT: Modern manufacturing execution systems (MES) and enterprise resource planning (ERP) platforms require native OPC-UA, MQTT, and secure Industrial Ethernet connectivity to track Overall Equipment Effectiveness (OEE) and energy metrics.",
      keyPoints: [
        "Obsolescence Lifecycle Stages: Active Phase -> Discontinuation Announcement -> Spare Parts Phase (10 years) -> Legacy / End-of-Life",
        "Total Cost of Ownership (TCO): When the annual cost of emergency spare parts and downtime exceeds the one-time modernization cost, migration is economically mandatory",
        "Functional Safety Mandates: Legacy systems require separate hardwired safety circuits; modern S7-1200F/1500F CPUs integrate safety over PROFINET via PROFIsafe",
        "Industry 4.0 Integration: Modern controllers feature native OPC-UA servers, web APIs, and encrypted TLS communication for cloud telemetry",
        "Production Capacity Limits: Aging CPUs with exhausted work memory and slow scan times restrict throughput and process optimization",
        "Scheduled Plant Shutdown Windows: Major migrations must be synchronized with scheduled annual maintenance turnarounds to minimize revenue loss"
      ],
      note: "Always evaluate the complete system scope before proposing an upgrade! Upgrading a legacy PLC CPU frequently necessitates upgrading the connected HMI panel (e.g. migrating ProTool or WinCC Flexible to WinCC Comfort/Unified) and obsolete serial variable frequency drives."
    },
    {
      title: "Migration Paths and Tooling",
      content: "Siemens establishes formal, well-defined hardware replacement paths and software migration tools to assist engineers during modernization. The official hardware migration matrix dictates: (1) SIMATIC S7-200 micro-controllers migrate to SIMATIC S7-1200. Because S7-200 used the proprietary STEP 7 Micro/WIN software with a unique memory architecture, there is no direct automatic project converter; applications require a structured manual rewrite using the legacy program printout and I/O list as a functional specification. (2) SIMATIC S7-300 and S7-400 systems migrate to SIMATIC S7-1500. For this path, Siemens provides the automated TIA Portal Migration Tool (or the integrated 'Migrate Project' function in TIA Portal V13 through V19). The tool parses original STEP 7 Classic projects (*.s7p), automatically converting hardware racks, symbolic tag tables, standard Data Blocks, and most Ladder/FBD logic blocks into equivalent TIA Portal objects. (3) Decentralized Periphery: Legacy ET 200M remote racks migrate to modern ET 200MP or high-density ET 200SP stations, cutting physical panel footprint by up to 50% while upgrading communication from PROFIBUS-DP to PROFINET.",
      keyPoints: [
        "S7-200 to S7-1200 Migration Path: No automated code converter; requires manual code re-engineering utilizing standardized IEC logic blocks",
        "S7-300/400 to S7-1500 Migration Path: Supported by the automated TIA Migration Tool; converts hardware, tags, DBs, and standard OB/FC/FB rungs",
        "TIA Migration Tool Software: Standalone utility executed on the computer hosting STEP 7 Classic; exports project into an intermediate '*.am19' migration file",
        "Automated Conversion Scope: Converts standard LAD/FBD blocks, DB structures, and symbol tables; leaves complex indirect addressing for manual review",
        "Non-Convertible Technologies: Siemens GRAPH (SFC), HiGraph, legacy communication FBs, and non-standard vendor libraries require manual recoding",
        "ET 200M to ET 200SP / MP: High-density modular distributed I/O modules provide push-in terminal blocks and integrated PROFINET switches"
      ],
      note: "Before executing project migration in TIA Portal, all proprietary add-on software packages (such as S7-GRAPH, S7-SCL, or Distributed Safety) that were installed in the original STEP 7 Classic environment must be installed or cleanly removed, or the migration tool will reject the source file."
    },
    {
      title: "Converting an Existing Project",
      content: "Converting a legacy project using the TIA Migration Tool requires a systematic 6-step engineering methodology: Step 1: Project Cleanup in STEP 7 V5.5. Open the legacy project in SIMATIC Manager, execute 'Check Block Consistency' (Ctrl+Alt+K) to recompile all dependent blocks, remove obsolete temporary blocks, and verify that symbolic tables contain no duplicate identifiers. Step 2: Intermediate File Generation. Run the TIA Migration Tool to generate an intermediate migration file (.am19 / .sea). Step 3: Import into TIA Portal. In TIA Portal, select 'Migrate project', choose the source file, and map the hardware target (e.g. mapping CPU 315-2 PN/DP to CPU 1515-2 PN). Step 4: Compiling and Resolving Red Errors. Execute full compilation (Ctrl+Shift+B). The compiler will generate error and warning messages flagging unconverted instructions. Step 5: Recoding Complex Logic. Legacy Statement List (STL) code utilizing accumulator tricks and indirect memory addressing (such as Address Registers AR1/AR2 and pointer constants P#DBX) cannot run efficiently on S7-1500; rewrite these sections in modern Structured Control Language (SCL). Step 6: Virtual Verification. Download the migrated project into PLCSIM Advanced to validate 100% of logic prior to physical panel installation.",
      keyPoints: [
        "Step 1 (Cleanup): Check block consistency in STEP 7 V5.5, eliminate duplicate symbols, and verify all hardware modules exist in the catalog",
        "Step 2 (Export): Generate intermediate migration archive (.am19) using the standalone Migration Tool",
        "Step 3 (Import & Map): Import archive into TIA Portal; select target S7-1500 CPU and ET 200SP hardware equivalents",
        "Step 4 (Compile & Debug): Compile software; inspect the compiler message log; resolve all red error markers systematically",
        "Step 5 (STL to SCL Conversion): Replace cryptic accumulator-based STL indirect pointer code with structured, symbolic SCL statements (e.g. arrays and loops)",
        "Step 6 (DB Optimization): Convert legacy standard DBs (byte-offset addressing) to Optimized Block Access for 5x execution speed improvements",
        "Step 7 (Virtual Emulation): Simulate full machine operation in S7-PLCSIM Advanced with virtual HMI screens to verify sequence logic"
      ],
      note: "Do not leave converted Data Blocks in 'Standard' (non-optimized) mode on the S7-1500 unless strictly required for legacy communication! Standard DBs force the 64-bit S7-1500 CPU to emulate legacy 16-bit byte alignment, significantly degrading execution speed and disabling individual variable retain settings."
    },
    {
      title: "Planning and Risk Management",
      content: "A live-line PLC migration is an operation with zero tolerance for failure. If an automated production line cannot restart at the end of a scheduled weekend shutdown, production losses can exceed the total cost of the upgrade. Professional automation engineers mitigate this through a comprehensive Risk Management and Commissioning Plan. The plan centers on three critical pillars: (1) Hardware Wiring Adapters: Rather than manually unscrewing hundreds of field wires—which introduces wire landing errors—engineers utilize pre-fabricated front-connector wiring adapters. These adapters plug directly onto the existing S7-300 terminal front-connectors, routing signals through factory-tested cable harnesses into the new S7-1500 or ET 200MP modules in seconds without disturbing field cables. (2) Formal Risk Register: A living document identifying potential risks (e.g. hidden sensor faults, uncalibrated analog loops, operator unfamiliarity with new HMI screens), scoring their Likelihood and Severity, and defining explicit mitigations. (3) The 15-Minute Rollback Plan: A mandatory contingency protocol where the old PLC hardware is kept mounted on a spare bracket; if severe commissioning roadblocks occur, the team can swap field connectors back to the old CPU within 15 minutes, ensuring the factory restarts production on schedule.",
      keyPoints: [
        "Pre-Fabricated Wiring Adapters: Dedicated migration front-connectors snap onto existing S7-300 terminal strips, eliminating manual field rewiring errors",
        "Formal Risk Register: Tabular risk matrix evaluating Technical, Operational, and Safety risks with explicit mitigation actions and assigned owners",
        "Dry-Run Virtual Commissioning: Complete simulation using PLCSIM Advanced and digital-twin emulation reduces on-site debugging time by up to 70%",
        "Point-to-Point I/O Verification: Mandatory pre-start protocol verifying 100% of field sensor contacts and actuator movements before running automatic cycles",
        "The 15-Minute Rollback Procedure: Defined step-by-step protocol to reinstall the legacy CPU and reconnect field plugs if go-live abort criteria are met",
        "Go-Live Acceptance Criteria: Explicit checklist (zero active safety faults, 100% I/O verified, 4-hour continuous defect-free test run) required for plant handover",
        "Operator and Maintenance Training: Conducting minimum 4 hours of hands-on HMI alarm navigation and diagnostic training before production launch"
      ],
      note: "Never discard the old PLC CPU or dismantle the old control panel on Day 1 of commissioning! Keep the legacy CPU mounted on the panel door or on a temporary bracket with its original program intact until the new system has operated continuously and fault-free for at least two full production weeks."
    }
  ],
  review: [
    "List three critical business or technical reasons that justify migrating an aging S7-300 PLC system to an S7-1500.",
    "Describe the official Siemens migration paths for the SIMATIC S7-200 and SIMATIC S7-300/400 controller families.",
    "Why can the TIA Portal Migration Tool NOT convert S7-200 projects automatically, and what engineering workflow must be followed instead?",
    "Detail the 6-step engineering methodology for converting a STEP 7 Classic V5.5 project into TIA Portal.",
    "Explain why legacy S7-300 Statement List (STL) code utilizing indirect pointer registers (AR1/AR2) should be rewritten in Structured Control Language (SCL) for S7-1500.",
    "How do pre-fabricated front-connector wiring adapters eliminate the risk of field wiring mistakes during a hardware upgrade?",
    "Define what an 'Emergency Rollback Plan' is in the context of a factory PLC migration, and state what technical preparations are required to execute it in under 15 minutes."
  ]
};

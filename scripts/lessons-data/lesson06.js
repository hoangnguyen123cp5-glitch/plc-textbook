module.exports = {
  overview: "While Siemens holds a dominant share of European industrial automation, automation engineers operating across Asia, North America, and global manufacturing plants regularly encounter other major PLC brands. In Vietnamese and Southeast Asian manufacturing facilities, Japanese manufacturers Omron and Mitsubishi account for over 35% of all installed machinery. This lesson broadens the student's professional competency by examining Omron (CP-series, Sysmac) and Mitsubishi (FX-series, MELSEC iQ-F) hardware architectures, I/O circuit topologies (shared COM vs S/S terminals), handheld programming consoles, memory addressing conventions, and Ladder Diagram dialects, mapping each directly to familiar Siemens concepts.",
  objectives: [
    "Identify and compare hardware architectures of Omron CP1E/CP1H/CP2E and Mitsubishi FX3U/FX5U PLCs against Siemens S7-1200",
    "Wire sinking and sourcing digital I/O circuits according to Japanese engineering standards (shared COM and S/S terminal jumpers)",
    "Operate handheld programming consoles (HPP) to inspect, force, and edit ladder rungs in field emergency situations",
    "Map bit and word addressing conventions across Siemens (%I, %Q, %M, DB), Omron (CIO, W, D), and Mitsubishi (X, Y, M, D)",
    "Translate timer and counter programming logic across TIA Portal, Omron CX-Programmer, and Mitsubishi GX Works",
    "Identify vendor-specific instructions including Master Control Relays (MC/MCR), jumps, and mandatory END delimiters"
  ],
  sections: [
    {
      title: "5.1 Omron and Mitsubishi PLCs",
      content: "In Vietnamese, Japanese, and Asian automotive, semiconductor, and consumer electronics manufacturing plants, Omron Corporation and Mitsubishi Electric represent the dominant control platforms alongside Siemens. Omron's micro-PLC portfolio is spearheaded by the CP series (CP1E economical, CP1H high-speed, and CP2E modern IoT-ready), programmed via CX-Programmer within the CX-One engineering suite or modern Sysmac Studio. Mitsubishi Electric dominates with the MELSEC FX series: the legendary FX3U (the world's most widely cloned compact PLC) and the modern FX5U (MELSEC iQ-F series) featuring integrated Ethernet and high-speed motion control, programmed via GX Works2 or GX Works3. Both Japanese brands adopt a compact brick-chassis form factor with expandable right-side bus extensions. While core CPU execution loops (input scan -> logic execution -> output scan) and IEC 61131-3 compliance are universal, each manufacturer utilizes proprietary tag syntax, register boundaries, and engineering software paradigms that require systematic cross-referencing.",
      keyPoints: [
        "Omron CP Series Architecture: Compact DIN-rail form factor; USB/Ethernet programming ports; expandable with CPM1A-style expansion I/O blocks",
        "Mitsubishi MELSEC FX Series: FX3U (RS422 mini-DIN programming port, modular expansion) and FX5U (embedded Ethernet, 4-axis 200kHz motion control)",
        "Power Supply Engineering: Both brands offer 100–240VAC line supply or 24VDC control supply models with integrated 24VDC auxiliary sensor supplies",
        "Engineering Software Suites: Omron CX-One (CX-Programmer) and Sysmac Studio; Mitsubishi GX Works2 (legacy FX) and GX Works3 (iQ-F and iQ-R)",
        "IEC 61131-3 Compliance: All three platforms support Ladder Diagram (LAD) and Structured Text (ST), but proprietary dialects persist",
        "Global Market Coexistence: A single factory floor frequently runs Siemens on packaging machines, Mitsubishi on CNC tooling, and Omron on robotics"
      ],
      note: "When inspecting an unfamiliar Japanese machine, check the CPU model label carefully. Omron CP1H CPUs use standard USB Type-B cables, whereas older Mitsubishi FX3U controllers require an RS422-to-USB programming cable with specialized drivers."
    },
    {
      title: "5.2 Input and Output Circuits",
      content: "The semiconductor physics of sinking and sourcing digital I/O applies identically across all PLC vendors; however, terminal labeling and common-bus topologies differ significantly between European and Japanese designs. In Europe (Siemens), 24VDC Sinking DI (PNP compatible) is standard. In Japan (Mitsubishi and Omron), NPN sinking transistor logic was historically dominant due to early bipolar semiconductor availability. On the Mitsubishi FX3U, digital input circuits feature a dedicated 'S/S' (Sink/Source) terminal: connecting S/S to +24VDC configures the inputs as NPN sinking (switched to 0VDC); connecting S/S to 0VDC configures the inputs as PNP sourcing (switched to +24VDC). Omron CP1H controllers feature grouped inputs with independent 'COM' terminals (e.g. COM0, COM1) allowing mixed sinking and sourcing configurations across different input banks. For digital outputs, both brands provide either 2.0A electromechanical relay contacts (capable of switching up to 250VAC or 30VDC) or 0.5A solid-state transistor outputs. Japanese transistor outputs are typically NPN open-collector (sinking outputs that switch the load to ground), requiring external loads to connect to +24VDC.",
      keyPoints: [
        "Mitsubishi S/S Configuration Jumper: Connecting S/S to +24V sets NPN Sink input mode; connecting S/S to 0V sets PNP Source input mode",
        "Omron COM Grouping: Independent COM terminals allow isolation between distinct sensor banks, but internal bridge shorts occur if cross-wired",
        "NPN vs PNP Transistor DO: European S7-1200 DO is PNP sourcing (switches +24V to load); Japanese FX/CP DO is typically NPN sinking (switches load to 0V)",
        "Relay Output Equivalence: 2.0A resistive / inductive load rating across all brands; mechanical contact lifetime ~100,000 operations under full load",
        "Analog Module Terminals: Omron and Mitsubishi analog cards support selectable 0–10V or 4–20mA via DIP switches or software buffer memories",
        "Terminal Block Screw Formats: Japanese PLCs traditionally feature M3 phillips/slotted screw terminal barriers; modern variants offer push-in spring clamps"
      ],
      note: "Never connect a 24VDC PNP sensor directly to an input configured for NPN mode! In NPN mode, the PLC terminal sits at +24V potential waiting to be pulled down to 0V; applying external +24V from a PNP sensor will fail to register or cause reverse current flow."
    },
    {
      title: "5.3 Programming Console",
      content: "In industrial environments where portable laptops are prohibited or unavailable during emergency breakdowns, handheld programming consoles (HPP) provide direct, ruggedized access to PLC memory. Devices like the Omron CQM1-PRO01 or Mitsubishi FX-20P connect directly to the CPU's serial communication port without requiring operating system booting or license activations. The programming console features a liquid crystal display (LCD) and a tactile keypad labeled with direct machine mnemonics: LD (Load), AND, OR, OUT, SET, RST, TIM, CNT, and numeric keys. The console operates across three primary functional modes: PROGRAM mode (for entering or modifying mnemonic ladder statements while the CPU scan is halted), MONITOR mode (which allows live online monitoring of contact states, modifying bit registers, forcing outputs, and reading current timer/counter values while the machine executes), and RUN mode (for dedicated execution with edit operations locked out). Technicians frequently use consoles to clear CPU memory faults or force an output coil to test a suspect contactor.",
      keyPoints: [
        "Handheld Programmer Purpose: Portable, battery-free field diagnostic unit powered directly from the PLC backplane serial communication bus",
        "Mode Selector Switch: PROGRAM (CPU stopped, full memory editing), MONITOR (CPU executing, live data monitoring & bit forcing), RUN (read-only execution)",
        "Direct Mnemonic Entry: Programs entered in Statement List format (e.g. LD X000 -> AND X001 -> OUT Y000) directly into internal RAM",
        "Live Diagnostic Monitoring: Displays real-time boolean states, accumulated timer ticks, and error fault codes on multi-line LCD screens",
        "Emergency Forcing: Allows immediate software overriding of physical inputs and outputs to diagnose suspected field contact failures",
        "Modern Transition: Modern facilities replace dedicated consoles with ruggedized industrial tablets running Web-based diagnostic servers"
      ],
      note: "Always return the programming console mode switch to RUN before disconnecting the cable! Leaving a PLC in MONITOR mode permits accidental keystrokes from unauthorized operators to modify active registers or force machine actuators."
    },
    {
      title: "5.4 Ladder Diagram Programming",
      content: "While all three manufacturers comply with the overarching IEC 61131-3 standard for Ladder Diagram, each brand retains distinct syntactic conventions, address notations, and timer/counter mechanisms. In address notation: Siemens uses IEC absolute syntax (%I0.0, %Q0.0, %MW10); Mitsubishi uses single-letter octal/decimal identifiers (Inputs: X0, X1... X7, X10; Outputs: Y0, Y1... Y7, Y10; Bit Memory: M0–M1023; Data Registers: D0–D8000); Omron uses channel-and-bit decimal numbers (Inputs: 0.00 to 0.15; Outputs: 100.00 to 100.15; Work Bits: W0.00; Data Memories: D0). Timer execution differs fundamentally: Siemens utilizes IEC function blocks with millisecond TIME literals (T#5s); Mitsubishi uses timer coils (e.g. T0 K50, where K50 represents 50 x 100ms = 5.0 seconds); Omron uses BCD/binary timer blocks (TIM 000 #0050, representing 5.0 seconds). Counter directions also vary: Siemens CTU counts up; Mitsubishi C0 counts up toward preset K-values; Omron CNT is historically a down-counter that decrements toward zero from a preset value.",
      keyPoints: [
        "Digital Input Address Syntax: Siemens %I0.0 ≡ Mitsubishi X0 (octal numbering) ≡ Omron 0.00 (channel.bit)",
        "Digital Output Address Syntax: Siemens %Q0.0 ≡ Mitsubishi Y0 (octal numbering) ≡ Omron 100.00 (channel.bit)",
        "Internal Register Syntax: Siemens %MW10 / DB1.DBD0 ≡ Mitsubishi D0 (16-bit) ≡ Omron D0 / DM0",
        "Mitsubishi Timer Notation: T0 K50 (T0 = timer identifier, K50 = constant decimal 50 ticks of 100ms = 5.0 seconds)",
        "Omron Timer Notation: TIM 000 #0050 (TIM 000 = timer 0, #0050 = 5.0 seconds in BCD format)",
        "Counter Logic Divergence: Siemens CTU counts up; Mitsubishi C counts up; vintage Omron CNT decrements downward to zero",
        "Latching Coils: Siemens (S)/(R) ≡ Mitsubishi [SET Y0] / [RST Y0] ≡ Omron [SET 100.00] / [RSET 100.00]"
      ],
      note: "Pay close attention to Mitsubishi FX octal addressing! Inputs and outputs are numbered in base-8: X0, X1, X2, X3, X4, X5, X6, X7, followed immediately by X10! Addresses X8, X9, Y8, and Y9 do not exist; entering 'X8' will produce an immediate syntax error in GX Works."
    },
    {
      title: "5.5 Other Common Instructions",
      content: "Beyond elementary contacts, coils, timers, and counters, every PLC manufacturer provides functional instruction blocks for data transfer, arithmetic, comparison, program jumps, and scan termination. In Mitsubishi GX Works, instructions are enclosed in horizontal bracketed boxes: [MOV D10 D20] transfers the 16-bit contents of register D10 to D20; arithmetic operations appear as [+ D0 D2 D4] (adds D0 + D2 and writes the sum to D4); comparisons appear as inline contact blocks: [= D0 K100] conducts power flow when D0 equals 100. In Omron CX-Programmer, instructions use three-letter mnemonics with operands: MOV(021) 10 D100 copies channel 10 to data memory D100; CMP(020) compares two values and sets dedicated internal comparison flags (P_GT, P_EQ, P_LT). Both Japanese platforms implement Master Control Relay zones (Mitsubishi [MC N0 M100] / [MCR N0]; Omron MILH / MILR) to conditionally de-energize entire sections of ladder code. Crucially, both Mitsubishi and Omron require a mandatory END instruction at the termination of the ladder logic; without an END instruction, the CPU scan cannot return, triggering an immediate execution watchdog fault.",
      keyPoints: [
        "Data Transfer (MOVE): Siemens MOVE ≡ Mitsubishi [MOV D0 D10] ≡ Omron MOV(021) D0 D10",
        "Inline Mathematical Blocks: Mitsubishi [+ D0 D2 D4] adds operands; Omron utilizes ADD(030) with carry flag management",
        "Master Control Relay (MC/MCR): De-energizes an entire block of ladder rungs without evaluating individual contact conditions",
        "Conditional Program Jumps: Mitsubishi [CJ P1] skips rungs directly to label P1; Omron JMP(004) / JME(005) skips networks to minimize scan time",
        "Subroutine Execution: Mitsubishi [CALL P10] -> [SRET] ≡ Omron SBS(091) -> SBN(092) -> RET(093); modularizes repetitive routines",
        "Mandatory END Instruction: Mitsubishi [FEND] / [END] and Omron END(001) must terminate the ladder program; missing END trips watchdog error",
        "Pulse Execution Prefix: In Mitsubishi, prefixing an instruction with 'P' (e.g. [MOVP D0 D10]) causes it to execute strictly on a rising edge"
      ],
      note: "Never omit the END instruction when writing ladder logic for Mitsubishi or Omron controllers! Unlike Siemens TIA Portal where the cyclic scan boundary is managed transparently by the operating system, a missing END statement in GX Works will trigger an immediate CPU execution fault (error code 6400)."
    }
  ],
  review: [
    "Identify two compact CPU models from Omron and two from Mitsubishi, stating their respective engineering software programming suites.",
    "Explain how the 'S/S' terminal on a Mitsubishi FX3U PLC determines whether digital inputs operate in NPN Sinking or PNP Sourcing mode.",
    "Why are Japanese PLC digital transistor outputs predominantly NPN open-collector, and how must external loads be wired relative to the +24VDC rail?",
    "Explain the three operational modes (PROGRAM, MONITOR, RUN) found on handheld programming consoles such as the Omron CQM1-PRO01.",
    "Translate the following Siemens LAD addresses into their Mitsubishi FX equivalents: input %I0.0, output %Q0.0, internal marker %M10, data word %MW100.",
    "Explain why the address 'X8' is invalid on a Mitsubishi FX PLC controller.",
    "What is the operational function of the mandatory END instruction in Omron and Mitsubishi ladder programs, and what occurs if it is omitted?"
  ]
};

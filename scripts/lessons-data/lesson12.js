module.exports = {
  overview: "Minimizing production downtime is the central metric of industrial plant engineering. When automated machinery trips, every minute of halted production represents thousands of dollars in lost revenue. This lesson teaches students how to utilize the comprehensive online diagnostic suite built into Siemens TIA Portal and the S7-1200 CPU. Students will explore online hardware topology views, front-panel LED decoding, reading and interpreting the non-volatile CPU Diagnostic Buffer, utilizing Error Organization Blocks (OB80, OB82, OB86, OB122) to prevent nuisance CPU stops, and utilizing Watch Tables and Force Tables for safe online signal intervention during commissioning and breakdown recovery.",
  objectives: [
    "Navigate and interpret TIA Portal Online Diagnostics, Device View health indicators, and network topology status icons",
    "Decode front-panel CPU status LEDs (RUN/STOP, ERROR, MAINT, I/O indicators) into actionable troubleshooting priorities",
    "Open, read, filter, and interpret timestamped event entries in the internal CPU Diagnostic Buffer",
    "Identify root causes of hardware diagnostic interrupts (wire breaks, module unseated, auxiliary 24V missing) and software execution faults",
    "Deploy Error Organization Blocks (OB82 diagnostic alarm, OB86 rack fault, OB122 I/O access) to maintain CPU runtime during non-critical field faults",
    "Construct and utilize Watch Tables for non-invasive live monitoring and dynamic tag value modification",
    "Execute safe hardware overriding using the Force Table complying with industrial safety protocols (FORCE LED warning)"
  ],
  sections: [
    {
      title: "Diagnostic Tools Overview",
      content: "Siemens TIA Portal integrates an exhaustive suite of diagnostic utilities that provide real-time visibility into the health of the automation system. Navigating 'Go Online' (Ctrl+M) connects the engineering workstation to all networked controllers, immediately populating the Project Tree and Network View with intuitive color-coded diagnostic icons: a green checkmark denotes healthy execution; a blue/orange circle indicates a difference between online CPU code and offline project files; a red wrench icon flags a severe hardware fault; and a flashing red icon highlights a communication loss. In Device View, clicking on any specific module reveals channel-level diagnostic telemetry: identifying blown fuses, disconnected sensor loops, or supply voltage dropouts. Furthermore, TIA Portal provides the Cross-Reference List (Shift+F11) to instantly trace all occurrences of a variable across the entire logic program, and the Call Structure view to visualize block nesting and execution hierarchy. These integrated software tools eliminate guesswork, enabling maintenance engineers to isolate faulty field components within seconds.",
      keyPoints: [
        "Color-Coded Status Icons: Green (Healthy/OK), Blue/Orange (Online/Offline mismatch), Red Wrench (Hardware diagnostic fault), Red Cross (Device offline)",
        "Go Online Mode (Ctrl+M): Establishes live telemetry session between TIA Portal and CPU; enables ladder rung power flow visualization in real time",
        "Channel-Level Hardware Diagnostics: Clicking a module in Device View exposes individual channel faults (e.g. Channel 2 wire break on SM 1231)",
        "Cross-Reference List (Shift+F11): Comprehensive matrix showing every block, network, and contact where a specific tag or memory address is referenced",
        "Assignment List View: Visual bit-map showing which memory bytes (%I, %Q, %M, timers, counters) are allocated or free in the project",
        "Call Structure Hierarchy: Graphical tree diagram showing the sequential execution call order of all OBs, FCs, and FBs in the program",
        "Web Server Diagnostics: S7-1200 integrated HTTP/HTTPS web server allows plant maintenance staff to view diagnostics via standard web browsers without TIA Portal"
      ],
      note: "Before downloading new code to a running production PLC, always perform an 'Online/Offline Comparison' (Ctrl+Alt+C)! This comparison highlights exact network differences between your laptop project and the running CPU, preventing accidental overwriting of recent field modifications made by night-shift technicians."
    },
    {
      title: "Reading the Diagnostic Buffer",
      content: "The Diagnostic Buffer is the definitive forensic authority inside every SIMATIC CPU. It is a non-volatile, circular event memory buffer that continuously logs significant operating system and hardware events in chronological order with microsecond timestamps synchronized to the CPU real-time clock. Events recorded include: CPU operating mode transitions (STOP to RUN, RUN to STOP), hardware component failures (broken sensor wire, missing expansion module, power supply dropout), PROFINET network node disconnections, and software programming errors (division by zero, array index out of bounds, memory address area length errors, cycle execution time exceeded). To access it in TIA Portal, select the CPU in the Project Tree and click 'Online & Diagnostics' -> 'Diagnostic Buffer'. Each entry displays an event number, precise timestamp, clear-text description, and a 'Help on event' button explaining the probable root cause and recommended corrective action. Crucially, the diagnostic buffer records the exact Organization Block, Function, and Network number where a runtime software exception occurred, allowing engineers to jump directly to the faulty line of code.",
      keyPoints: [
        "Non-Volatile Event Memory: Retains the last 50 to 500 system events (depending on CPU model) across complete power interruptions",
        "Detailed Event Anatomy: Event ID, Date & Timestamp (synchronized via RTC/NTP), Operating Mode, Clear-Text Event Description, and Block Call Stack",
        "One-Click Fault Navigation: Clicking 'Open in editor' jumps directly to the exact ladder network or SCL line that triggered the runtime exception",
        "Error Organization Blocks: If a programming or hardware fault occurs, the CPU attempts to call a specific error OB (e.g. OB82, OB86, OB122)",
        "Preventing CPU STOP Trips: If the corresponding error OB is present in the CPU, the controller executes the error handler and remains in RUN mode",
        "Fatal Watchdog Trips (OB80): Triggered when cyclic program execution time exceeds the configured cycle monitoring time (default 150 ms)",
        "Exporting Diagnostic Logs: Diagnostic buffer records can be exported directly to text or CSV files for vendor warranty claims and incident reports"
      ],
      note: "When an S7-1200 CPU trips unexpectedly into STOP mode, do NOT immediately cycle the power supply or press the RUN button! Cycling power can erase secondary temporary fault markers. Always connect with TIA Portal first and inspect the Diagnostic Buffer to read the exact timestamped cause of the trip."
    },
    {
      title: "Watch Table and Force Table",
      content: "Online commissioning and breakdown troubleshooting frequently require viewing internal calculation tags and overriding physical I/O states. TIA Portal provides two distinct environments for variable manipulation: Watch Tables and Force Tables. A Watch Table is a non-invasive monitoring and testing tool: it allows the engineer to assemble a custom list of tags (%I, %Q, %M, DB variables, timers, counters) and monitor their live values cyclically. Furthermore, a Watch Table permits 'Modifying' a tag: writing a new value to an internal memory bit or register at the start of the scan cycle. However, if the user program writes to that same tag later in the scan, the program overwrites the modified value immediately. Conversely, the Force Table is a high-level hardware overriding mechanism: forcing writes a fixed value directly to the physical peripheral inputs or outputs, completely overriding user program logic, process image tables, and safety rungs. Forcing remains active until explicitly deleted by an engineer. When forcing is active, the physical CPU illuminates a continuous flashing yellow 'FORCE' LED, warning operating personnel of bypassed logic.",
      keyPoints: [
        "Watch Table Capabilities: Real-time non-invasive monitoring of tags; one-shot or continuous modification of internal memory bits (%M) and DB tags",
        "Modify Limitation: A modified output coil (%Q0.0) will be overwritten on the next scan cycle if the active ladder logic rung evaluates to the opposite state",
        "Force Table Mechanism: Locks physical peripheral I/O points to fixed values (0 or 1), bypassing user program logic and process images completely",
        "FORCE Status LED: Front-panel yellow LED flashes continuously whenever any variable is forced in the CPU, providing high-visibility plant floor warning",
        "Strict Safety Protocols: In live industrial facilities, applying a Force requires a formal engineering permit and peer review to prevent catastrophic machinery motion",
        "Trigger Conditions: Watch Tables allow configuring exact trigger points: 'Beginning of scan cycle', 'End of scan cycle', or 'Transition to STOP'",
        "Deleting Forces: Forcing persists across CPU power cycles and program downloads; forces must be explicitly deleted using 'Stop Forcing' in TIA Portal"
      ],
      note: "Never use the Force Table as a temporary bypass to keep a machine running while waiting for a replacement sensor! Forcing overrides all software safety interlocks and emergency conditions. If an operator enters a machine zone while an optical safety light curtain is forced TRUE, the machine will not stop, creating severe risk of injury."
    }
  ],
  review: [
    "Explain what each front-panel status LED (RUN/STOP, ERROR, MAINT) indicates on a Siemens S7-1200 CPU.",
    "What specific information does the CPU Diagnostic Buffer record, and how does it assist an engineer in finding the root cause of a sudden machine shutdown?",
    "Describe what happens to an S7-1200 CPU in RUN mode when a field wire on an analog input module breaks, both with and without OB82 present in the program.",
    "Explain the functional difference between using 'Modify' in a Watch Table versus using 'Force' in a Force Table.",
    "Why does the S7-1200 CPU illuminate a flashing yellow FORCE LED whenever any variable in the Force Table is active?",
    "How does the Cross-Reference List tool in TIA Portal prevent catastrophic double-coil allocation errors in ladder programs?",
    "Describe the recommended step-by-step procedure for performing an Online/Offline Program Comparison before downloading modifications to a running plant PLC."
  ]
};

module.exports = {
  overview: "This lesson covers the advanced instruction set of the Siemens S7-1200/1500 controller required for sophisticated industrial applications. Moving beyond elementary binary and math operations, students will master high-resolution time-handling functions, date arithmetic, character string manipulation (for barcode scanners, RFID readers, and serial communication telegrams), and asynchronous interrupt processing (hardware interrupts, cyclic interrupts, and diagnostic error organization blocks). These instructions enable microsecond-level event capture, automated shift scheduling, and deterministic execution of complex process algorithms.",
  objectives: [
    "Execute high-resolution temporal calculations using TIME_TCK, T_DIFF, T_ADD, T_SUB, and the DTL structure",
    "Configure Time-of-Day Interrupts (OB10) for automated calendar-based machine sequencing and daily shift data archiving",
    "Manipulate ASCII character and string data structures (CHAR, STRING, WSTRING) using CONCAT, LEFT, RIGHT, MID, FIND, and LEN blocks",
    "Convert between numeric values and formatted ASCII strings using VAL_STRG and STRG_VAL for serial telegram processing",
    "Configure and program Hardware Interrupts (OB40–OB47) triggered within microseconds by rising or falling edges on digital inputs",
    "Program Cyclic Interrupts (OB30–OB38) for deterministic, fixed-interval execution of closed-loop PID control loops",
    "Implement Diagnostic and Error Organization Blocks (OB80, OB82, OB86, OB122) to prevent catastrophic CPU STOP faults upon field anomalies"
  ],
  sections: [
    {
      title: "3.1 Time-Handling Instructions",
      content: "Precision time tracking and calendar-based automation are fundamental requirements across food & beverage, pharmaceutical, and batch processing industries. The S7-1200 provides dedicated instructions for measuring high-speed operational durations and computing calendar differences. The TIME_TCK (Time Tick) instruction reads the internal CPU system timer: an unsigned 32-bit millisecond counter that increments continuously from 0 to 2,147,483,647 ms, allowing microsecond-accurate benchmark timing of machine cycles by evaluating: Elapsed_Time = End_Tick - Start_Tick. For calendar dates and times, TIA Portal provides temporal arithmetic functions operating on the DTL (Date and Time Long) and TIME data types: T_ADD adds a duration (TIME) to a timestamp (DTL); T_SUB subtracts a duration from a timestamp or computes the difference between two timestamps; and T_DIFF calculates the exact time difference (in TIME format) between two DTL dates. Furthermore, Time-of-Day Interrupts (OB10) can be configured in CPU properties to trigger cyclic or one-shot program execution at exact calendar dates and times (e.g. running an automated clean-in-place CIP sequence every Sunday at 02:00:00).",
      keyPoints: [
        "TIME_TCK Instruction: Reads the continuous internal millisecond clock; wraps around after ~24.8 days; ideal for calculating machine cycle execution time",
        "T_ADD Block: Adds a time interval (TIME) to a calendar date/time (DTL) yielding a future DTL timestamp",
        "T_SUB Block: Subtracts a time interval from a DTL timestamp, or subtracts two DTL timestamps yielding the elapsed interval as a TIME value",
        "T_DIFF Block: Computes the precise temporal duration between two DTL calendar dates; output is formatted in TIME (milliseconds)",
        "Time-of-Day Organization Block (OB10): Operating system interrupt invoked automatically at a configured calendar time; supports Daily, Weekly, or Monthly repetition",
        "SET_TINT and ACT_TINT Instructions: Dynamically configure and activate time-of-day interrupt parameters directly from runtime PLC ladder code",
        "Equipment Runtime Tracking: Measure pump and compressor operating hours by accumulating running seconds into retentive double-word registers"
      ],
      note: "When using TIME_TCK to benchmark execution durations, always account for counter rollover! Because the 32-bit counter rolls over from +2,147,483,647 to 0, compute elapsed time using unsigned modular subtraction to avoid negative duration errors."
    },
    {
      title: "3.2 String and Character Instructions",
      content: "Modern automated manufacturing requires interfacing with peripheral devices that transmit textual information: handheld barcode scanners, optical vision inspection cameras, RFID tag transponders, laser marking printers, and weigh-scale indicators. TIA Portal handles text data via the CHAR (8-bit ASCII), WCHAR (16-bit Unicode), STRING, and WSTRING data types. A standard STRING variable in S7-1200 occupies n+2 bytes of memory: Byte 0 defines the maximum declared string capacity (up to 254 characters); Byte 1 defines the current actual length of valid text; Bytes 2 through n+1 store the ASCII character bytes. TIA Portal provides a rich suite of string processing instructions: CONCAT combines two strings into one; LEFT extracts n characters from the beginning of a string; RIGHT extracts n characters from the end; MID extracts a substring from any specified character offset; LEN returns the actual character count; and FIND searches for the first occurrence of a substring within a text string. To convert between numeric values and text strings, the VAL_STRG instruction converts an INT or REAL into an ASCII string (e.g. for printing on a packaging label), while STRG_VAL parses an incoming barcode string into a numeric part number.",
      keyPoints: [
        "STRING Memory Architecture: Allocated as max_length (Byte 0) + current_length (Byte 1) + ASCII character bytes; default capacity is 254 characters",
        "CONCAT Block: Concatenates two source strings (IN1 + IN2) into a single destination string; truncates if destination capacity is exceeded",
        "Substring Extraction: LEFT (extracts leftmost n characters), RIGHT (extracts rightmost n characters), MID (extracts n characters starting at offset p)",
        "Search and Inspection: LEN (returns current string length), FIND (searches for sub-string; returns 1-based character position, or 0 if not found)",
        "VAL_STRG (Value to String): Converts numeric INT/REAL variables into formatted ASCII strings with configurable decimal places and sign characters",
        "STRG_VAL (String to Value): Parses incoming ASCII text strings into numeric integer or floating-point variables for PLC logic evaluation",
        "DELETE and INSERT Blocks: Dynamically delete character spans or insert prefixes/suffixes into serialized production tracking strings"
      ],
      note: "Remember that STRING manipulation instructions consume significant CPU processing time and memory bandwidth! Never execute string search and concatenation blocks cyclically on every single scan. Always trigger string instructions on the rising edge of a communication receive flag (e.g. when a barcode scanner successfully finishes scanning)."
    },
    {
      title: "3.3 Interrupt-Handling Instructions",
      content: "Standard cyclic execution in OB1 is governed by the scan cycle time (typically 2 ms to 15 ms). However, high-speed industrial events—such as optical print-mark registration, emergency crash detection, and high-precision closed-loop PID control—cannot tolerate cyclic scan jitter. Siemens S7-1200 controllers solve this through an asynchronous interrupt architecture that preempts OB1 to execute specialized Organization Blocks immediately. Three major classes of interrupts exist: (1) Hardware Interrupts (OB40–OB47): Configured in digital input properties to trigger within microseconds upon a rising edge, falling edge, or both edges on high-speed input pins (%I0.0–%I0.3). (2) Cyclic Interrupts (OB30–OB38): Scheduled by high-precision internal hardware timers to execute at deterministic periodic intervals (e.g. every 10.0 ms), providing the jitter-free timebase required for PID control. (3) Diagnostic and Error Interrupts: OB82 (Diagnostic Interrupt, triggered by wire breaks or short circuits on analog/digital modules), OB86 (Rack/Station Failure, triggered by loss of a PROFINET node), and OB80 (Time Error, triggered if OB1 scan exceeds the watchdog timeout). Without error OBs in the project, field faults force the CPU into STOP mode.",
      keyPoints: [
        "Preemptive Execution Architecture: An interrupt immediately pauses OB1 user code execution, executes the interrupt OB to completion, and resumes OB1 seamlessly",
        "Hardware Interrupts (OB40–OB47): Triggered by digital input signal transitions; response latency is typically < 50 microseconds; ideal for print mark sensors",
        "Cyclic Interrupts (OB30–OB38): Deterministic execution at microsecond/millisecond intervals (e.g. 10 ms for PID_Compact); unaffected by variations in OB1 cycle time",
        "Diagnostic Interrupt (OB82): Invoked when an expansion module detects an internal hardware fault, wire break, or power supply failure",
        "Module/Station Failure (OB86): Invoked when a remote PROFINET IO device or PROFIBUS slave drops offline, allowing the system to execute safe shutdown routines",
        "Time Error Interrupt (OB80): Invoked when cycle time exceeds configured watchdog limit (default 150 ms) or when cyclic interrupts overlap",
        "ATTACH and DETACH Instructions: Programmatically bind or unbind hardware interrupt events to specific OBs during machine mode transitions"
      ],
      note: "To prevent minor field sensor wire breaks from shutting down an entire multi-million dollar plant, always insert empty or diagnostic OB82 and OB86 blocks into your TIA Portal project! If these error OBs are present in the CPU, the controller logs the fault and stays in RUN mode instead of immediately tripping into catastrophic STOP."
    }
  ],
  review: [
    "Explain how the TIME_TCK instruction functions and describe how to accurately benchmark the execution time of an industrial machine sequence.",
    "Detail the byte-level memory architecture of an IEC STRING variable in the Siemens S7-1200 controller.",
    "Describe an industrial application where VAL_STRG and STRG_VAL instructions are required to communicate with a barcode scanner and an inkjet printer.",
    "Explain the preemptive operating system mechanism of a Hardware Interrupt (OB40) versus standard cyclic execution in OB1.",
    "Why must digital closed-loop PID control algorithms always be executed inside a Cyclic Interrupt (OB30) rather than inside OB1?",
    "What occurs to an S7-1200 CPU in RUN mode when a remote PROFINET I/O rack is powered down if OB86 is NOT present in the user program?",
    "Describe how the ATTACH instruction can be used in ladder logic to dynamically enable a hardware interrupt only during a specific packaging machine state."
  ]
};

module.exports = {
  overview: "This lesson covers the numeric data processing architecture of modern programmable controllers. Industrial applications require continuous measurement, mathematical calculations, recipes, comparisons, and time stamping. Students will study elementary IEC 61131-3 data types (Bool, Byte, Word, DWord, Int, DInt, Real, Time), memory organization and bit alignment in S7-1200 data blocks, magnitude comparisons, bit-shift and rotate operations for tracking FIFO buffers, arithmetic functions with overflow and division-by-zero protection, and the on-board Real-Time Clock (RTC) for shift-based scheduling.",
  objectives: [
    "Identify, classify, and size all elementary and complex IEC 61131-3 data types in TIA Portal",
    "Analyze memory allocation, byte addressing, and word boundaries across Bit Memory (%M) and Data Blocks (DB)",
    "Implement relational comparison operations (==, <>, >, >=, <, <=) and window comparators for numeric limits",
    "Apply bit-shift (SHL, SHR) and rotate (ROL, ROR) instructions to implement FIFO shift registers on material conveyors",
    "Perform arithmetic calculations (ADD, SUB, MUL, DIV, MOD) and construct compound equations using the CALCULATE block",
    "Read, write, and manipulate the hardware Real-Time Clock using system functions (RD_SYS_T, WR_SYS_T, RD_LOC_T) and the DTL structure"
  ],
  sections: [
    {
      title: "3.1 Data Space and Data Types",
      content: "Microprocessors in industrial PLCs manipulate data represented in standardized bit lengths defined by IEC 61131-3. Bit strings include BYTE (8 bits, 0 to 255 hex 16#FF), WORD (16 bits, 0 to 65,535 hex 16#FFFF), and DWORD (32 bits, hex 16#FFFF_FFFF), used primarily for raw hardware bitmasks and communication telegrams. Signed integers represent numeric quantities using two's complement notation: SINT (8-bit, -128 to +127), INT (16-bit, -32,768 to +32,767), and DINT (32-bit, -2,147,483,648 to +2,147,483,647). Continuous process variables (temperature, flow, pressure) utilize REAL (32-bit floating point complying with IEEE 754), which allocates 1 sign bit, an 8-bit exponent, and a 23-bit mantissa to represent values from ±1.175495e-38 to ±3.402823e+38. Memory in the S7-1200 is addressed by area prefix and byte offset: %MB10 (Memory Byte 10), %MW10 (Memory Word occupying bytes 10 and 11, where %MB10 is the high byte and %MB11 is the low byte in Big-Endian format), and %MD10 (Memory Double-word occupying bytes 10 through 13). Overlapping memory addresses will cause silent data corruption.",
      keyPoints: [
        "Bit String Types: BYTE (8-bit), WORD (16-bit), DWORD (32-bit), LWORD (64-bit); interpreted as raw hexadecimal bit patterns",
        "Signed Integer Types: SINT (8-bit), INT (16-bit), DINT (32-bit), LINT (64-bit); use two's complement for negative values",
        "Floating-Point REAL (32-bit): IEEE 754 standard representing fractional numbers with ~7 decimal digits of precision; format: 1.2345e+2",
        "Temporal Data Type (TIME): Stored internally as a signed 32-bit integer expressing time duration in milliseconds (e.g. T#2h45m)",
        "Big-Endian Memory Alignment: In S7-1200 standard memory, the most significant byte (MSB) is stored at the lowest byte memory address",
        "Address Overlap Hazard: Writing a 32-bit value to %MD10 overwrites bytes %MB10, %MB11, %MB12, and %MB13; %MW10 and %MW12 share this memory space",
        "Optimized vs Standard DBs: Modern S7-1200 Data Blocks default to 'Optimized block access', eliminating physical byte offsets and preventing address overlap"
      ],
      note: "Always use 'Optimized block access' for new Data Blocks in TIA Portal. Optimized blocks allow the CPU compiler to arrange variables by memory alignment for maximum execution speed, prevent address overlapping errors, and support retain settings on individual variables."
    },
    {
      title: "3.2 Comparison Functions",
      content: "Comparison instructions evaluate numerical relationships between two values of identical data type and pass virtual ladder power flow if the mathematical condition is satisfied. TIA Portal provides six standard comparison contact blocks in LAD: Equal (==), Not Equal (<>), Greater Than (>), Greater Than or Equal (>=), Less Than (<), and Less Than or Equal (<=). During evaluation, input IN1 is compared against input IN2 (IN1 == IN2). In process automation, comparisons are used to trigger high-level alarms, interlock heating circuits when temperatures exceed thresholds, and synchronize multi-stage machines. When comparing floating-point REAL numbers, direct equality (==) should be avoided because rounding errors inherent in IEEE 754 floating-point arithmetic can cause numbers that are mathematically equal to differ by fractional bits in the lowest mantissa position. Instead, engineers implement an epsilon tolerance band: ABS(IN1 - IN2) < 0.001. Window comparators combine two comparisons in series (e.g. Value >= Min AND Value <= Max) to confirm that a process parameter is within safe operating limits.",
      keyPoints: [
        "In-Line LAD Contact Blocks: Comparison instructions appear as contact boxes placed directly in the ladder rung power flow path",
        "Strict Type Consistency: Both comparison operands (IN1 and IN2) must share the identical data type (e.g. comparing an INT directly to a REAL causes a compiler syntax error)",
        "Equality Hazard with REALs: Due to binary floating-point representation, 1.0 / 3.0 * 3.0 may evaluate to 0.9999999 rather than 1.0000000; never use '==' on REAL variables",
        "Floating-Point Tolerance Band: Evaluate equality using absolute difference: ABS(RealA - RealB) <= Epsilon",
        "Window Comparator: Placing a '>=' contact in series with a '<=' contact validates that a process variable remains inside a defined deadband",
        "Multi-Condition Branching: Multiple comparison contacts placed in parallel branches execute conditional branching based on operating modes"
      ],
      note: "When comparing analog sensor signals (e.g. tank level or temperature), always implement a software hysteresis deadband (e.g. 2%) between the alarm trip point and the clear point to prevent rapid chattering of alarm relays when the signal hovers near the threshold."
    },
    {
      title: "3.3 Rotate and Shift Functions",
      content: "Shift and rotate instructions manipulate the individual bit positions within BYTE, WORD, or DWORD registers. Shift Left (SHL) shifts bits toward the most significant bit (MSB) by n positions, filling evacuated low-order bit positions with binary zeros; each 1-bit left shift effectively multiplies an unsigned integer by 2. Shift Right (SHR) shifts bits toward the least significant bit (LSB) by n positions, filling evacuated high-order bits with zeros; each 1-bit right shift divides an unsigned integer by 2. Rotate Left (ROL) and Rotate Right (ROR) operate as closed circular registers: bits pushed out of one end are looped back into the opposite end without bit loss. In manufacturing, shift registers are widely used for parts tracking along indexed conveyor lines: a binary shift register represents consecutive conveyor pockets. When an inspection camera detects a defective part at Station 1, it shifts a logic '1' into bit 0. As the conveyor advances, an encoder proximity pulse triggers an SHL instruction, moving the defect bit down the register until it reaches the reject pusher station, which fires automatically.",
      keyPoints: [
        "Shift Left (SHL): Shifts bit pattern left by n positions; vacated low-order bits filled with 0; equivalent to multiplying unsigned values by 2^n",
        "Shift Right (SHR): Shifts bit pattern right by n positions; vacated high-order bits filled with 0; equivalent to integer division by 2^n",
        "Rotate Left (ROL): Circular shift left; bit shifted out of MSB re-enters at LSB position; no bits are destroyed",
        "Rotate Right (ROR): Circular shift right; bit shifted out of LSB re-enters at MSB position",
        "Parts Tracking Shift Register: Each bit represents a mechanical station along a transfer line; clock pulses advance the register synchronously with conveyor motion",
        "Bit Masking Operations: Combining bit shifts with logical AND/OR operations allows engineers to pack and unpack multiple binary flags into single communication words",
        "Byte Swapping (SWAP): Reverses the byte order within a WORD or DWORD to convert between Big-Endian and Little-Endian network telegrams"
      ],
      note: "Always trigger SHL and SHR instructions using a one-shot rising edge pulse (P_TRIG)! If a shift instruction is energized with a continuous TRUE signal, it will execute on every single PLC scan cycle, shifting all bits to zero within a few milliseconds."
    },
    {
      title: "3.4 Arithmetic Functions",
      content: "The S7-1200 instruction set includes full mathematical capabilities for integer and floating-point computations: ADD (Addition), SUB (Subtraction), MUL (Multiplication), DIV (Division), and MOD (Modulo / Integer Division Remainder). Arithmetic blocks execute when enabled (EN = TRUE) and pass power to the output (ENO = TRUE) if the calculation completes successfully without numeric exceptions. In addition to basic two-operand blocks, TIA Portal provides the compound CALCULATE instruction, which allows engineers to write complete algebraic expressions (e.g. ((IN1 * 1.8) + 32.0) for Celsius-to-Fahrenheit conversion) within a single ladder box. Arithmetic operations are susceptible to two major industrial runtime errors: Numeric Overflow (when a calculation exceeds the maximum representable limit of the target data type) and Division by Zero (attempting to divide by a variable that equals zero). If an integer divides by zero, the CPU asserts the overflow status flag and, depending on configuration, can fault the controller into STOP mode unless protected by upstream logic.",
      keyPoints: [
        "Elementary Math Blocks: ADD (IN1 + IN2), SUB (IN1 - IN2), MUL (IN1 * IN2), DIV (IN1 / IN2), MOD (remainder of integer division)",
        "CALCULATE Block: Evaluates multi-term mathematical formulas directly in LAD without chaining dozens of individual math boxes",
        "Data Type Promotion: When multiplying two 16-bit INTs, the product can exceed 32,767; convert operands to 32-bit DINT prior to multiplication to prevent overflow",
        "Division by Zero Protection: Always precede a DIV instruction with a comparison contact verifying that the divisor is not equal to zero (Divisor <> 0)",
        "ENO Enable Output Behavior: ENO evaluates FALSE if a mathematical fault occurs (overflow, underflow, NaN, division by zero), allowing safe fault handling",
        "Rounding Functions: ROUND (rounds floating point to nearest integer), TRUNC (truncates fractional digits toward zero), CEIL (rounds up), FLOOR (rounds down)",
        "Advanced Math Blocks: SQR (square), SQRT (square root), LN (natural logarithm), EXP (exponential), and trigonometric functions (SIN, COS, TAN)"
      ],
      note: "Never perform division without a safety interlock! In LAD, place a contact [ Divisor <> 0.0 ] immediately before the DIV block. If a field sensor fails and outputs zero, an unprotected DIV block will trigger a CPU math exception and drop the line offline."
    },
    {
      title: "3.5 Real-Time Clock",
      content: "The S7-1200 CPU incorporates an on-board hardware Real-Time Clock (RTC) backed by a high-capacity supercapacitor that maintains current date and time for up to 20 days during complete electrical power failure. In TIA Portal, calendar and time data is represented by the DTL (Date and Time Long) structured data type, a 12-byte structure containing: Year (UInt), Month (USInt), Day (USInt), Weekday (USInt, 1=Sunday to 7=Saturday), Hour (USInt), Minute (USInt), Second (USInt), and Nanosecond (UDInt). Siemens provides system functions for clock interaction: RD_SYS_T reads Coordinated Universal Time (UTC) directly from the hardware clock; RD_LOC_T reads local time accounting for time zone offsets and daylight saving time (DST) rules; and WR_SYS_T writes a new time stamp to the hardware clock. Industrial applications utilize the RTC for automated time-of-day shift scheduling, logging production hourly totals to non-volatile memory, calculating equipment runtime hours for preventive maintenance schedules, and time-stamping fault events in diagnostic alarm logs.",
      keyPoints: [
        "Hardware RTC Supercapacitor: Retains clock operation and calendar advancement for typically 20 days at 25°C without external 24VDC power",
        "DTL Structure Components: 12-byte composite tag comprising Year, Month, Day, Weekday, Hour, Minute, Second, and Nanoseconds",
        "RD_SYS_T (Read System Time): Retrieves current UTC time from hardware RTC into a DTL tag; executed with minimal CPU overhead",
        "RD_LOC_T (Read Local Time): Retrieves local time adjusted for configured regional time zone and daylight saving daylight shifts",
        "WR_SYS_T (Write System Time): Updates the CPU hardware clock from an HMI input or an automated network NTP time server",
        "Time-of-Day Interrupts (OB10): Can be scheduled to execute at exact calendar dates/times (e.g. daily at 06:00:00 for morning shift reset)",
        "Operational Hour Logging: Measuring pump runtime hours by accumulating running seconds from the RTC into retentive double-word registers"
      ],
      note: "For facilities with multiple PLCs and HMIs, always configure Network Time Protocol (NTP) synchronization in the CPU PROFINET properties. NTP ensures that all controllers across the plant floor share millisecond-synchronized clocks, making cross-machine event logging and fault root-cause analysis accurate."
    }
  ],
  review: [
    "List the bit lengths, numeric ranges, and memory representation for BYTE, INT, DINT, and REAL data types in Siemens S7-1200.",
    "Explain what occurs in PLC memory when an engineer assigns %MD10 to a REAL flow value and simultaneously assigns %MW10 to a motor speed reference.",
    "Why is it hazardous to evaluate floating-point equality using a simple '==' comparison block in Ladder Diagram? Provide the recommended solution.",
    "Describe how a Shift Left (SHL) instruction and an optical part sensor can be combined to track defective items along an automated conveyor line.",
    "What specific runtime error occurs if a DIV instruction attempts to divide by zero, and how do you protect against this in your ladder logic?",
    "Explain the internal structure of the DTL data type and contrast the system functions RD_SYS_T and RD_LOC_T.",
    "A plant manager requires a daily production totalizer to automatically reset at exactly 06:00:00 every morning. How would you implement this using the RTC?"
  ]
};

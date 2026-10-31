import { TopicContent } from '@/types/content';

export default {
  "slug": "program-processing",
  "sourceRef": "1.4",
  "title": "Program Processing in TIA Portal",
  "durationMinutes": 10,
  "summary": "Program processing in the S7-1200 controller is deterministic and governed by the cyclic operating system architecture.",
  "body": [
    {
      "heading": "1.4 Program Processing in TIA Portal",
      "text": "Program processing in the S7-1200 controller is deterministic and governed by the cyclic operating system architecture. The top-level execution thread resides in Organization Block 1 (OB1), which is invoked cyclically by the CPU operating system immediately upon completion of each scan cycle. User application logic is organized hierarchically into modular code blocks: Functions (FC) represent stateless subroutines suitable for standard mathematical transformations or reusable Boolean algorithms; Function Blocks (FB) maintain internal state memory stored in dedicated Instance Data Blocks (Instance DB); and Global Data Blocks (Global DB) hold plant-wide operational parameters, recipe setpoints, and HMI telemetry accessible by all blocks. In addition to cyclic execution, the CPU supports event-driven execution via specialized Organization Blocks: Cyclic Interrupts (OB30–OB38) triggered by precise hardware timers for discrete-time PID loops, Hardware Interrupts (OB40–OB47) triggered within microseconds by digital input edges, and Time-Error Interrupts (OB80).",
      "keyPoints": [
        "Main Cyclic Organization Block (OB1): Default entry point executed cyclically by the runtime firmware; evaluates networks sequentially from top to bottom",
        "Functions (FC): Stateless modular blocks; all internal variables (TEMP) lose their values upon block exit; ideal for pure algorithmic calculations",
        "Function Blocks (FB): Stateful modular blocks; internal static variables (STAT) persist between cycles within a dedicated Instance Data Block (DB)",
        "Global Data Blocks (DB): Centralized memory tables accessible across the entire project; supports both standard (offset-based) and optimized (symbolic) access",
        "Cyclic Interrupts (OB30): Deterministic execution triggered at precise user-defined intervals (e.g. every 10 ms), essential for accurate PID closed-loop control",
        "Process Image Synchronization: Code blocks read from the Process Image Input (PII) table rather than querying physical pins directly, ensuring data consistency across rungs"
      ],
      "note": "Never use standard timers (TON/TOF) or software counters inside interrupt OBs (OB30/OB40). Always keep interrupt block execution times well below the interrupt interval to avoid triggering OB80 cycle time faults."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__006.png",
      "caption": "Figure 2.2: Program Processing in TIA Portal: OB1 Main Cycle, FCs, FBs, and Instance Data Blocks"
    }
  ],
  "caseStudy": {
    "title": "Three Conveyors, One Function Block",
    "context": "A sorting line has three identical belt conveyors, each with a start/stop latch, a jam timer and a run-hours counter. The first draft copies the same ladder logic three times in OB1 with different addresses, and a later fix to the jam logic is applied to only two of the copies. The refactored program writes the logic once as FB \"Conveyor\" with Static variables for the latch, timer (TON as a multi-instance) and hour counter, then calls it three times in OB1, each call with its own instance DB. Plant-wide setpoints such as jam time and belt speed live in a Global DB \"LineParams\" that the HMI can also read.",
    "hardware": [
      "OB1 (Program cycle): calls FB \"Conveyor\" three times — instance DBs \"Conv1_DB\", \"Conv2_DB\", \"Conv3_DB\"",
      "FB \"Conveyor\": Input = start/stop/jam sensor, Output = motor, Static = latch bit, TON jam timer, hour counter",
      "FC \"ScaleSpeed\": stateless conversion of speed setpoint to drive reference — no instance DB needed",
      "Global DB \"LineParams\": jam time, belt speed setpoints shared with the HMI",
      "OB100 (Startup): initialises counters and forces all motors OFF after power-up"
    ],
    "pitfall": "Putting the jam timer inside an FC: an FC has only Temp memory, which is not kept between scans, so the timer state is lost every cycle and the jam alarm never fires. Anything that must remember a value from one scan to the next belongs in an FB (Static) or a DB."
  },
  "quiz": [
    {
      "q": "What is the fundamental difference between an FC (Function) and an FB (Function Block) in TIA Portal?",
      "options": [
        "An FC has its own instance Data Block (DB); an FB does not",
        "An FB requires an Instance Data Block to store static internal tags across scans; an FC has no persistent memory",
        "FCs can only be written in STL",
        "FBs cannot accept input parameters"
      ],
      "answer": 1,
      "explain": "FBs retain static variable memory between scan cycles via their dedicated Instance DB; FCs are stateless and discard temporary tags after execution."
    },
    {
      "q": "Logic for three identical conveyors is written once as an FB. How is each conveyor's state kept separate?",
      "options": [
        "Each FB call uses its own instance data block",
        "The FB is copied three times under different names",
        "All three share one Global DB with no separation",
        "The CPU creates separate Temp memory that persists between scans"
      ],
      "answer": 0,
      "explain": "Every call of an FB is linked to its own instance DB (or a multi-instance), so latches, timers and counters for each conveyor are stored independently."
    },
    {
      "q": "Which Organization Block runs once when the S7-1200 switches from STOP to RUN, before the cyclic program starts?",
      "options": [
        "OB1",
        "OB30",
        "OB80",
        "OB100"
      ],
      "answer": 3,
      "explain": "OB100 is the Startup OB. It executes once on the STOP→RUN transition and is used to initialise data before OB1 begins cycling."
    }
  ],
  "narration": {
    "vi": "CPU S7-1200 xử lý chương trình theo vòng quét tuần hoàn. Mỗi vòng quét bắt đầu bằng việc đọc trạng thái đầu vào vào bộ nhớ ảo Process Image. Sau đó CPU thực thi toàn bộ chương trình trong OB1 từ trên xuống dưới. Cuối vòng quét, kết quả được ghi ra đầu ra vật lý. Thời gian một vòng quét thường dưới mười mili giây với chương trình cỡ vừa.",
    "durationSec": 28,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "TIA Portal Engineering Workflow",
      "points": [
        "Centralized project management for hardware, networks, and code",
        "Configure the physical device rack and assign module I/O addresses",
        "Program cyclic logic in OB1 with modular FCs, FBs, and Data Blocks",
        "Commission with WinCC HMI simulation, Startdrive, and online diagnostics"
      ],
      "explain": "In the lecture flow for Section 1.4, processing a PLC program starts with how TIA Portal organizes an automation project. From a single project file, you configure the hardware rack, set I/O address ranges in the Device View, and structure your runtime program into Organization Block 1 (OB1), stateless Functions (FC), and stateful Function Blocks (FB) backed by Data Blocks.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__006.png",
        "caption": "Signal Module SM 1223 DC/DC expanding the CPU process image"
      }
    },
    {
      "kind": "concept",
      "title": "Programming Languages & Instruction Sets",
      "points": [
        "LAD (Ladder Diagram) models relay power flow from left rail to output coil",
        "FBD (Function Block Diagram) connects AND/OR logic boxes like digital circuits",
        "SCL (Structured Control Language) uses high-level text statements for math",
        "Instruction catalog groups bit logic, timers, counters, math, and comparators"
      ],
      "explain": "S7-1200 code blocks can be written in three IEC 61131-3 languages depending on the task. Ladder Diagram (LAD) and Function Block Diagram (FBD) are ideal for discrete interlocks and boolean sequences, whereas Structured Control Language (SCL) simplifies loops, arrays, and formulas. All three languages share the same instruction library of bit operations, timers, counters, data conversion, and motion/communication blocks.",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__002.jpeg",
        "caption": "Function Block Diagram (FBD) and instruction tree inside TIA Portal"
      }
    },
    {
      "kind": "concept",
      "title": "Elementary Data Types & Memory Sizing",
      "points": [
        "Bit and byte types: Bool (1 bit), Byte (8 bits), Word (16 bits), DWord (32 bits)",
        "Signed integers: SInt (8-bit), Int (16-bit, -32768..32767), DInt (32-bit)",
        "Floating-point Real (32-bit) for analog scaling and engineering units",
        "Time (32-bit, e.g. T#5m_30s) and String (up to 254 characters) for text"
      ],
      "explain": "Every tag in an S7-1200 program has a strict data type that defines its bit width and valid range. Discrete sensors use 1-bit Bool tags, raw analog channels arrive as 16-bit signed Int values, and scaled physical quantities (such as temperature or bar pressure) are stored as 32-bit Real numbers. Choosing matching data types prevents truncation and conversion errors across FB and FC interfaces."
    },
    {
      "kind": "concept",
      "title": "Process Image Addressing: Absolute vs Symbolic",
      "points": [
        "Process inputs (%I) and outputs (%Q) can be accessed as bits, bytes, or words",
        "Bit address syntax: %I0.4 targets input byte 0, bit 4 in the process image",
        "Byte and word access: %IB0 reads 8 input bits; %QW0 writes 16 output bits",
        "Symbolic tags (e.g. \"Sensor1\" mapped to %I0.4) make logic self-documenting"
      ],
      "explain": "During each scan cycle, the CPU copies physical inputs into the Process Image Input (%I) table, executes OB1, and writes the Process Image Output (%Q) table to the terminals. You can address memory either by its physical offset—such as %I0.4 or %QW0—or by a symbolic variable name in quotes like \"Sensor1\". Always define symbolic PLC tags so that if a wire moves to another terminal, you only update the tag table once."
    },
    {
      "kind": "concept",
      "title": "TCP/IP Addressing for Program Download",
      "points": [
        "Every PROFINET node (PC, PLC, HMI) needs a unique IPv4 host address",
        "Host octets range from 1 to 254 (0 is network ID; 255 is broadcast)",
        "Private Class C subnet 192.168.x.x (/24) hosts up to 253 automation devices",
        "Unmanaged switches (e.g. CSM 1277) forward frames without needing an IP"
      ],
      "explain": "Before TIA Portal can download your compiled program blocks to the S7-1200, the programming PC, CPU, and HMI must share the same IPv4 subnet—typically a private Class C range such as 192.168.1.1, 192.168.1.2, and 192.168.1.3. An industrial switch like the CSM 1277 operates at Layer 2 and requires no IP address of its own.",
      "figure": {
        "src": "/images/diagrams/profinet-network-diagram.jpg",
        "caption": "PROFINET subnet connecting the engineering PC, S7-1200 CPU, and HMI"
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

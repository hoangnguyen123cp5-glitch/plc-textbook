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
      "title": "Program Processing in TIA Portal",
      "points": [
        "Main Cyclic Organization Block (OB1): Default entry point executed cyclically by the runtime firmware; evaluates networks sequentially from top to bottom",
        "Functions (FC): Stateless modular blocks; all internal variables (TEMP) lose their values upon block exit; ideal for pure algorithmic calculations",
        "Function Blocks (FB): Stateful modular blocks; internal static variables (STAT) persist between cycles within a dedicated Instance Data Block (DB)",
        "Global Data Blocks (DB): Centralized memory tables accessible across the entire project; supports both standard (offset-based) and optimized (symbolic) access",
        "Cyclic Interrupts (OB30): Deterministic execution triggered at precise user-defined intervals (e.g. every 10 ms), essential for accurate PID closed-loop control",
        "Process Image Synchronization: Code blocks read from the Process Image Input (PII) table rather than querying physical pins directly, ensuring data consistency across rungs"
      ],
      "explain": "Program processing in the S7-1200 controller is deterministic and governed by the cyclic operating system architecture. The top-level execution thread resides in Organization Block 1 (OB1), which is invoked cyclically by the CPU operating system immediately upon completion of each scan cycle. User application logic is organized hierarchically into modular code blocks: Functions (FC) represent stateless subroutines suitable for standard mathematical transformations or reusable Boolean algorithms; Function Blocks (FB) maintain internal state memory stored in dedicated Instance Data Blocks (Instance DB); and Global Data Blocks (Global DB) hold plant-wide operational parameters, recipe setpoints, and HMI telemetry accessible by all blocks. In addition to cyclic execution, the CPU supports event-driven execution via specialized Organization Blocks: Cyclic Interrupts (OB30–OB38) triggered by precise hardware timers for discrete-time PID loops, Hardware Interrupts (OB40–OB47) triggered within microseconds by digital input edges, and Time-Error Interrupts (OB80).",
      "figure": {
        "src": "/images/slides/02-s7-1200-tia-portal/PLC___Slide__006.png",
        "caption": "Figure 2.2: Program Processing in TIA Portal: OB1 Main Cycle, FCs, FBs, and Instance Data Blocks"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 1
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 2
    }
  ],
  "status": "review"
} satisfies TopicContent;

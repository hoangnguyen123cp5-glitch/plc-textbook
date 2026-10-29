import { TopicContent } from '@/types/content';

export default {
  "slug": "project-conversion",
  "title": "Converting an Existing Project",
  "durationMinutes": 12,
  "summary": "Converting a legacy project using the TIA Migration Tool requires a systematic 6-step engineering methodology: Step 1: Project Cleanup in STEP 7 V5.5.",
  "body": [
    {
      "heading": "Converting an Existing Project",
      "text": "Converting a legacy project using the TIA Migration Tool requires a systematic 6-step engineering methodology: Step 1: Project Cleanup in STEP 7 V5.5. Open the legacy project in SIMATIC Manager, execute 'Check Block Consistency' (Ctrl+Alt+K) to recompile all dependent blocks, remove obsolete temporary blocks, and verify that symbolic tables contain no duplicate identifiers. Step 2: Intermediate File Generation. Run the TIA Migration Tool to generate an intermediate migration file (.am19 / .sea). Step 3: Import into TIA Portal. In TIA Portal, select 'Migrate project', choose the source file, and map the hardware target (e.g. mapping CPU 315-2 PN/DP to CPU 1515-2 PN). Step 4: Compiling and Resolving Red Errors. Execute full compilation (Ctrl+Shift+B). The compiler will generate error and warning messages flagging unconverted instructions. Step 5: Recoding Complex Logic. Legacy Statement List (STL) code utilizing accumulator tricks and indirect memory addressing (such as Address Registers AR1/AR2 and pointer constants P#DBX) cannot run efficiently on S7-1500; rewrite these sections in modern Structured Control Language (SCL). Step 6: Virtual Verification. Download the migrated project into PLCSIM Advanced to validate 100% of logic prior to physical panel installation.",
      "keyPoints": [
        "Step 1 (Cleanup): Check block consistency in STEP 7 V5.5, eliminate duplicate symbols, and verify all hardware modules exist in the catalog",
        "Step 2 (Export): Generate intermediate migration archive (.am19) using the standalone Migration Tool",
        "Step 3 (Import & Map): Import archive into TIA Portal; select target S7-1500 CPU and ET 200SP hardware equivalents",
        "Step 4 (Compile & Debug): Compile software; inspect the compiler message log; resolve all red error markers systematically",
        "Step 5 (STL to SCL Conversion): Replace cryptic accumulator-based STL indirect pointer code with structured, symbolic SCL statements (e.g. arrays and loops)",
        "Step 6 (DB Optimization): Convert legacy standard DBs (byte-offset addressing) to Optimized Block Access for 5x execution speed improvements",
        "Step 7 (Virtual Emulation): Simulate full machine operation in S7-PLCSIM Advanced with virtual HMI screens to verify sequence logic"
      ],
      "note": "Do not leave converted Data Blocks in 'Standard' (non-optimized) mode on the S7-1500 unless strictly required for legacy communication! Standard DBs force the 64-bit S7-1500 CPU to emulate legacy 16-bit byte alignment, significantly degrading execution speed and disabling individual variable retain settings."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/14-system-upgrade/PLC___Slide__014.png",
      "caption": "Figure 14.3: TIA Portal Migration Tool Workflow: Converting Legacy STEP 7 Projects (*.s7p)"
    }
  ],
  "quiz": [
    {
      "q": "What tool does Siemens provide to migrate classic STEP 7 V5.x projects into TIA Portal?",
      "options": [
        "TIA Portal Project Migration Tool (*.s7p conversion)",
        "Windows Media Player",
        "AutoCAD Electrical",
        "Notepad++"
      ],
      "answer": 0,
      "explain": "The Migration Tool parses legacy STEP 7 V5.x project files (*.s7p), converting hardware configurations and user blocks into TIA Portal format."
    }
  ],
  "narration": {
    "vi": "Quy trình chuyển đổi project gồm nhiều bước. Đầu tiên xuất project từ phần mềm cũ sang định dạng mà Migration Tool nhận được. Tiếp theo chạy tool và xem log để biết phần nào chuyển thành công, phần nào cần làm tay. Sau đó biên dịch lại toàn bộ trong TIA Portal và xử lý lỗi từng cái một. Lỗi thường gặp là kiểu dữ liệu không khớp, hàm không còn tồn tại, hoặc địa chỉ tuyệt đối không hợp lệ.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

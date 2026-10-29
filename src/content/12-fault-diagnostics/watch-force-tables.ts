import { TopicContent } from '@/types/content';

export default {
  "slug": "watch-force-tables",
  "title": "Watch Table and Force Table",
  "durationMinutes": 8,
  "summary": "Online commissioning and breakdown troubleshooting frequently require viewing internal calculation tags and overriding physical I/O states.",
  "body": [
    {
      "heading": "Watch Table and Force Table",
      "text": "Online commissioning and breakdown troubleshooting frequently require viewing internal calculation tags and overriding physical I/O states. TIA Portal provides two distinct environments for variable manipulation: Watch Tables and Force Tables. A Watch Table is a non-invasive monitoring and testing tool: it allows the engineer to assemble a custom list of tags (%I, %Q, %M, DB variables, timers, counters) and monitor their live values cyclically. Furthermore, a Watch Table permits 'Modifying' a tag: writing a new value to an internal memory bit or register at the start of the scan cycle. However, if the user program writes to that same tag later in the scan, the program overwrites the modified value immediately. Conversely, the Force Table is a high-level hardware overriding mechanism: forcing writes a fixed value directly to the physical peripheral inputs or outputs, completely overriding user program logic, process image tables, and safety rungs. Forcing remains active until explicitly deleted by an engineer. When forcing is active, the physical CPU illuminates a continuous flashing yellow 'FORCE' LED, warning operating personnel of bypassed logic.",
      "keyPoints": [
        "Watch Table Capabilities: Real-time non-invasive monitoring of tags; one-shot or continuous modification of internal memory bits (%M) and DB tags",
        "Modify Limitation: A modified output coil (%Q0.0) will be overwritten on the next scan cycle if the active ladder logic rung evaluates to the opposite state",
        "Force Table Mechanism: Locks physical peripheral I/O points to fixed values (0 or 1), bypassing user program logic and process images completely",
        "FORCE Status LED: Front-panel yellow LED flashes continuously whenever any variable is forced in the CPU, providing high-visibility plant floor warning",
        "Strict Safety Protocols: In live industrial facilities, applying a Force requires a formal engineering permit and peer review to prevent catastrophic machinery motion",
        "Trigger Conditions: Watch Tables allow configuring exact trigger points: 'Beginning of scan cycle', 'End of scan cycle', or 'Transition to STOP'",
        "Deleting Forces: Forcing persists across CPU power cycles and program downloads; forces must be explicitly deleted using 'Stop Forcing' in TIA Portal"
      ],
      "note": "Never use the Force Table as a temporary bypass to keep a machine running while waiting for a replacement sensor! Forcing overrides all software safety interlocks and emergency conditions. If an operator enters a machine zone while an optical safety light curtain is forced TRUE, the machine will not stop, creating severe risk of injury."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/12-fault-diagnostics/PLC___Slide__003.png",
      "caption": "Figure 12.3: Watch Tables vs Force Tables: Non-Invasive Monitoring vs Hardware Signal Override"
    }
  ],
  "quiz": [
    {
      "q": "What makes the Force Table significantly more hazardous than the Watch Table during plant operations?",
      "options": [
        "The Force Table overrides physical I/O at the hardware peripheral layer, bypassing user program safety interlocks and remaining active across CPU restarts",
        "The Force Table deletes the program",
        "The Force Table disconnects the power supply",
        "The Force Table only runs on Tuesdays"
      ],
      "answer": 0,
      "explain": "Forcing locks peripheral addresses at the hardware boundary; mechanical safety limits can be bypassed, requiring extreme caution and physical panel supervision."
    }
  ],
  "narration": {
    "vi": "Watch Table cho phép bạn giám sát nhiều biến cùng lúc trong khi PLC đang chạy — rất hữu ích để theo dõi chuỗi sự kiện hoặc kiểm tra logic. Force Table mạnh hơn một bước: bạn ép buộc một giá trị vào biến, bất kể chương trình đang ghi gì. Dùng Force để kiểm tra đầu ra hoặc giả lập trạng thái cảm biến mà không cần thay đổi phần cứng thực tế.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

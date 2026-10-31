import { TopicContent } from '@/types/content';

export default {
  "slug": "diagnostic-overview",
  "title": "Diagnostic Tools Overview",
  "durationMinutes": 7,
  "summary": "Siemens TIA Portal integrates an exhaustive suite of diagnostic utilities that provide real-time visibility into the health of the automation system.",
  "body": [
    {
      "heading": "Diagnostic Tools Overview",
      "text": "Siemens TIA Portal integrates an exhaustive suite of diagnostic utilities that provide real-time visibility into the health of the automation system. Navigating 'Go Online' (Ctrl+M) connects the engineering workstation to all networked controllers, immediately populating the Project Tree and Network View with intuitive color-coded diagnostic icons: a green checkmark denotes healthy execution; a blue/orange circle indicates a difference between online CPU code and offline project files; a red wrench icon flags a severe hardware fault; and a flashing red icon highlights a communication loss. In Device View, clicking on any specific module reveals channel-level diagnostic telemetry: identifying blown fuses, disconnected sensor loops, or supply voltage dropouts. Furthermore, TIA Portal provides the Cross-Reference List (Shift+F11) to instantly trace all occurrences of a variable across the entire logic program, and the Call Structure view to visualize block nesting and execution hierarchy. These integrated software tools eliminate guesswork, enabling maintenance engineers to isolate faulty field components within seconds.",
      "keyPoints": [
        "Color-Coded Status Icons: Green (Healthy/OK), Blue/Orange (Online/Offline mismatch), Red Wrench (Hardware diagnostic fault), Red Cross (Device offline)",
        "Go Online Mode (Ctrl+M): Establishes live telemetry session between TIA Portal and CPU; enables ladder rung power flow visualization in real time",
        "Channel-Level Hardware Diagnostics: Clicking a module in Device View exposes individual channel faults (e.g. Channel 2 wire break on SM 1231)",
        "Cross-Reference List (Shift+F11): Comprehensive matrix showing every block, network, and contact where a specific tag or memory address is referenced",
        "Assignment List View: Visual bit-map showing which memory bytes (%I, %Q, %M, timers, counters) are allocated or free in the project",
        "Call Structure Hierarchy: Graphical tree diagram showing the sequential execution call order of all OBs, FCs, and FBs in the program",
        "Web Server Diagnostics: S7-1200 integrated HTTP/HTTPS web server allows plant maintenance staff to view diagnostics via standard web browsers without TIA Portal"
      ],
      "note": "Before downloading new code to a running production PLC, always perform an 'Online/Offline Comparison' (Ctrl+Alt+C)! This comparison highlights exact network differences between your laptop project and the running CPU, preventing accidental overwriting of recent field modifications made by night-shift technicians."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/12-fault-diagnostics/PLC___Slide__015.png",
      "caption": "Figure 12.1: TIA Portal Online Diagnostics Suite, Network Status Icons, and Cross-Reference Tool"
    }
  ],
  "quiz": [
    {
      "q": "What does a red exclamation mark badge on an S7-1200 module icon in the TIA Portal hardware tree signify?",
      "options": [
        "The module is operating normally",
        "A hardware or communication fault has occurred on that specific module (e.g. wire break, missing 24V supply)",
        "A software update is recommended",
        "The module is in simulation mode"
      ],
      "answer": 1,
      "explain": "TIA Portal overlays diagnostic status icons directly on hardware topologies, allowing instant identification of faulted channels."
    }
  ],
  "narration": {
    "vi": "TIA Portal tích hợp bộ công cụ chẩn đoán rất mạnh giúp bạn tìm lỗi nhanh mà không cần thiết bị đo ngoài. Bạn có thể xem trạng thái online của CPU, kiểm tra lỗi module, đọc buffer sự kiện, và giám sát tín hiệu I/O ngay trong phần mềm. Các công cụ này hoạt động kể cả khi chương trình đang chạy, nên rất phù hợp để xử lý sự cố trong sản xuất mà không cần dừng máy.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Diagnostic Tools Overview",
      "points": [
        "Color-Coded Status Icons: Green (Healthy/OK), Blue/Orange (Online/Offline mismatch), Red Wrench (Hardware diagnostic fault), Red Cross (Device offline)",
        "Go Online Mode (Ctrl+M): Establishes live telemetry session between TIA Portal and CPU; enables ladder rung power flow visualization in real time",
        "Channel-Level Hardware Diagnostics: Clicking a module in Device View exposes individual channel faults (e.g. Channel 2 wire break on SM 1231)",
        "Cross-Reference List (Shift+F11): Comprehensive matrix showing every block, network, and contact where a specific tag or memory address is referenced",
        "Assignment List View: Visual bit-map showing which memory bytes (%I, %Q, %M, timers, counters) are allocated or free in the project",
        "Call Structure Hierarchy: Graphical tree diagram showing the sequential execution call order of all OBs, FCs, and FBs in the program",
        "Web Server Diagnostics: S7-1200 integrated HTTP/HTTPS web server allows plant maintenance staff to view diagnostics via standard web browsers without TIA Portal"
      ],
      "explain": "Siemens TIA Portal integrates an exhaustive suite of diagnostic utilities that provide real-time visibility into the health of the automation system. Navigating 'Go Online' (Ctrl+M) connects the engineering workstation to all networked controllers, immediately populating the Project Tree and Network View with intuitive color-coded diagnostic icons: a green checkmark denotes healthy execution; a blue/orange circle indicates a difference between online CPU code and offline project files; a red wrench icon flags a severe hardware fault; and a flashing red icon highlights a communication loss. In Device View, clicking on any specific module reveals channel-level diagnostic telemetry: identifying blown fuses, disconnected sensor loops, or supply voltage dropouts. Furthermore, TIA Portal provides the Cross-Reference List (Shift+F11) to instantly trace all occurrences of a variable across the entire logic program, and the Call Structure view to visualize block nesting and execution hierarchy. These integrated software tools eliminate guesswork, enabling maintenance engineers to isolate faulty field components within seconds.",
      "figure": {
        "src": "/images/slides/12-fault-diagnostics/PLC___Slide__015.png",
        "caption": "Figure 12.1: TIA Portal Online Diagnostics Suite, Network Status Icons, and Cross-Reference Tool"
      }
    },
    {
      "kind": "quiz",
      "title": "Quick Check",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

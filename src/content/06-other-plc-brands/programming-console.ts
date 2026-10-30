import { TopicContent } from '@/types/content';

export default {
  "slug": "programming-console",
  "sourceRef": "5.3",
  "title": "Programming Console",
  "durationMinutes": 8,
  "summary": "In industrial environments where portable laptops are prohibited or unavailable during emergency breakdowns, handheld programming consoles (HPP) provide direct, ruggedized access to PLC memory.",
  "body": [
    {
      "heading": "5.3 Programming Console",
      "text": "In industrial environments where portable laptops are prohibited or unavailable during emergency breakdowns, handheld programming consoles (HPP) provide direct, ruggedized access to PLC memory. Devices like the Omron CQM1-PRO01 or Mitsubishi FX-20P connect directly to the CPU's serial communication port without requiring operating system booting or license activations. The programming console features a liquid crystal display (LCD) and a tactile keypad labeled with direct machine mnemonics: LD (Load), AND, OR, OUT, SET, RST, TIM, CNT, and numeric keys. The console operates across three primary functional modes: PROGRAM mode (for entering or modifying mnemonic ladder statements while the CPU scan is halted), MONITOR mode (which allows live online monitoring of contact states, modifying bit registers, forcing outputs, and reading current timer/counter values while the machine executes), and RUN mode (for dedicated execution with edit operations locked out). Technicians frequently use consoles to clear CPU memory faults or force an output coil to test a suspect contactor.",
      "keyPoints": [
        "Handheld Programmer Purpose: Portable, battery-free field diagnostic unit powered directly from the PLC backplane serial communication bus",
        "Mode Selector Switch: PROGRAM (CPU stopped, full memory editing), MONITOR (CPU executing, live data monitoring & bit forcing), RUN (read-only execution)",
        "Direct Mnemonic Entry: Programs entered in Statement List format (e.g. LD X000 -> AND X001 -> OUT Y000) directly into internal RAM",
        "Live Diagnostic Monitoring: Displays real-time boolean states, accumulated timer ticks, and error fault codes on multi-line LCD screens",
        "Emergency Forcing: Allows immediate software overriding of physical inputs and outputs to diagnose suspected field contact failures",
        "Modern Transition: Modern facilities replace dedicated consoles with ruggedized industrial tablets running Web-based diagnostic servers"
      ],
      "note": "Always return the programming console mode switch to RUN before disconnecting the cable! Leaving a PLC in MONITOR mode permits accidental keystrokes from unauthorized operators to modify active registers or force machine actuators."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/06-other-plc-brands/06-oth_carved_032.png",
      "caption": "Figure 6.3: Handheld Programming Consoles (HPP): Keypad Mnemonics (LD, AND, OR) & Mode Selector"
    }
  ],
  "quiz": [
    {
      "q": "What instruction mnemonic is used on legacy handheld consoles to start a new ladder rung from the power rail?",
      "options": [
        "LOAD (LD)",
        "OUT",
        "AND",
        "OR"
      ],
      "answer": 0,
      "explain": "The LD (Load) mnemonic loads a contact directly connected to the left power rail."
    }
  ],
  "narration": {
    "vi": "Console lập trình cầm tay cho phép lập trình PLC trực tiếp mà không cần máy tính, rất hữu ích khi bảo trì tại hiện trường. Với Omron, bạn nhập lệnh bằng cách gõ mã lệnh và địa chỉ toán hạng qua bàn phím nhỏ trên console. Màn hình hiển thị từng dòng lệnh theo dạng mnemonic. Thứ tự thao tác thường là chọn chế độ Program, nhập địa chỉ ô nhớ, gõ lệnh rồi bấm Enter để xác nhận từng bước.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Programming Console",
      "points": [
        "Handheld Programmer Purpose: Portable, battery-free field diagnostic unit powered directly from the PLC backplane serial communication bus",
        "Mode Selector Switch: PROGRAM (CPU stopped, full memory editing), MONITOR (CPU executing, live data monitoring & bit forcing), RUN (read-only execution)",
        "Direct Mnemonic Entry: Programs entered in Statement List format (e.g. LD X000 -> AND X001 -> OUT Y000) directly into internal RAM",
        "Live Diagnostic Monitoring: Displays real-time boolean states, accumulated timer ticks, and error fault codes on multi-line LCD screens",
        "Emergency Forcing: Allows immediate software overriding of physical inputs and outputs to diagnose suspected field contact failures",
        "Modern Transition: Modern facilities replace dedicated consoles with ruggedized industrial tablets running Web-based diagnostic servers"
      ],
      "explain": "In industrial environments where portable laptops are prohibited or unavailable during emergency breakdowns, handheld programming consoles (HPP) provide direct, ruggedized access to PLC memory. Devices like the Omron CQM1-PRO01 or Mitsubishi FX-20P connect directly to the CPU's serial communication port without requiring operating system booting or license activations. The programming console features a liquid crystal display (LCD) and a tactile keypad labeled with direct machine mnemonics: LD (Load), AND, OR, OUT, SET, RST, TIM, CNT, and numeric keys. The console operates across three primary functional modes: PROGRAM mode (for entering or modifying mnemonic ladder statements while the CPU scan is halted), MONITOR mode (which allows live online monitoring of contact states, modifying bit registers, forcing outputs, and reading current timer/counter values while the machine executes), and RUN mode (for dedicated execution with edit operations locked out). Technicians frequently use consoles to clear CPU memory faults or force an output coil to test a suspect contactor.",
      "figure": {
        "src": "/images/slides/06-other-plc-brands/06-oth_carved_032.png",
        "caption": "Figure 6.3: Handheld Programming Consoles (HPP): Keypad Mnemonics (LD, AND, OR) & Mode Selector"
      }
    },
    {
      "kind": "quiz",
      "title": "Kiểm tra nhanh",
      "questionIndex": 0
    }
  ],
  "status": "review"
} satisfies TopicContent;

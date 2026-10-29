import { TopicContent } from '@/types/content';

export default {
  "slug": "defining-plc",
  "sourceRef": "1.5",
  "title": "Defining the PLC",
  "durationMinutes": 5,
  "summary": "The National Electrical Manufacturers Association (NEMA) defines a PLC as: \"A digitally operating electronic apparatus which uses a programmable memory for the internal storage of instructions for...",
  "body": [
    {
      "heading": "1.5 Defining the PLC: NEMA Standards and Historical Origins",
      "text": "The National Electrical Manufacturers Association (NEMA) defines a PLC as: \"A digitally operating electronic apparatus which uses a programmable memory for the internal storage of instructions for implementing specific functions such as logic, sequencing, timing, counting, and arithmetic, to control, through digital or analog input/output modules, various types of machines or processes.\" The concept originated in 1968, when manufacturing engineers at General Motors' Hydramatic Division issued a 10-point technical specification seeking a replacement for hardwired relay panels: easy programming without electrician retraining, logic revisions without panel rewiring, compact footprint, lower cost, and high reliability in harsh plant floor conditions. The resulting breakthrough—the Modicon 084 designed by Dick Morley—inaugurated the modern industrial automation era.",
      "keyPoints": [
        "NEMA Standard Definition: Digital apparatus, programmable internal memory, logic/timer/counter/math functions, modular digital/analog I/O interface",
        "1968 GM Hydramatic Specification: 10 design criteria intended to eradicate relay panel downtime in automotive stamping and assembly plants",
        "The First Commercial PLC: The Modicon 084 developed in 1969",
        "Terminology: PLC (Programmable Logic Controller) and PC (Programmable Controller in North American literature) represent the identical apparatus",
        "Technical Writing Standard: \"PLC\" is preferred globally to avoid confusion with \"Personal Computer\""
      ]
    }
  ],
  "figures": [
    {
      "src": "/images/slides/01-programmable-control/PLC_Slide_1__027.jpeg",
      "caption": "Figure 1.5: NEMA Microprocessor Standards & Optoisolated Industrial Field Interfaces"
    }
  ],
  "caseStudy": {
    "title": "The 1968 GM Hydramatic Specification: Birth of the Industrial PLC Standard",
    "context": "In 1968, General Motors' Hydramatic Division published a 10-point technical tender seeking a solid-state electronic replacement for relay panels: easy programming without computer specialist retraining; program changes without wiring alterations; compact footprint; lower cost; and robust operation in oily, dusty, electrically noisy plant floor environments. Dick Morley's breakthrough design—the Modicon 084—fulfilled all criteria and established the modern PLC standard governed today by NEMA ICS 3 and IEC 61131.",
    "hardware": [
      "International Standards: NEMA ICS 3-1978 & IEC 61131-1",
      "Operating Environment: 0°C to +60°C ambient, 95% non-condensing relative humidity",
      "Galvanic Isolation: Optocouplers rated for 500V–1500V dielectric isolation",
      "Enclosure Rating: Heavy-duty flame-retardant ABS/polycarbonate housing meeting UL 94 V-0"
    ],
    "pitfall": "Confusing a PLC with a commercial PC or hobbyist micro-controller: Office PCs and micro-controllers fail quickly in industrial environments due to lack of optical isolation, noise suppression, and environmental sealing."
  },
  "quiz": [
    {
      "q": "What was the breakthrough commercial PLC developed in 1969 to satisfy General Motors Hydramatic specifications?",
      "options": [
        "Siemens S7-1500",
        "Modicon 084 (designed by Dick Morley)",
        "Intel 8086",
        "Raspberry Pi Industrial"
      ],
      "answer": 1,
      "explain": "The Modicon 084, engineered by Dick Morley in 1969, met GM Hydramatic specifications and launched the modern commercial PLC industry."
    }
  ],
  "narration": {
    "vi": "IEC 61131-1 định nghĩa PLC là thiết bị điện tử kỹ thuật số lập trình được, dùng để điều khiển máy móc và quy trình. Ba từ quan trọng: lập trình được — hành vi thay đổi bằng phần mềm; kỹ thuật số — xử lý bit 0 và 1; điều khiển — nhận tín hiệu, quyết định, ra lệnh. Khác với máy tính thông thường ở chỗ PLC được thiết kế chịu nhiệt độ, rung động, và bụi trong môi trường nhà máy.",
    "durationSec": 33,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

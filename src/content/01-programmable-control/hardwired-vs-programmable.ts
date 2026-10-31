import { TopicContent } from '@/types/content';

export default {
  "slug": "hardwired-vs-programmable",
  "sourceRef": "1.3",
  "title": "Hardwired versus Programmable Control",
  "durationMinutes": 7,
  "summary": "Historically, industrial automation evolved across two distinct paradigms.",
  "body": [
    {
      "heading": "1.3 Hardwired Relay Logic versus Programmable Control",
      "text": "Historically, industrial automation evolved across two distinct paradigms. Hardwired control comprises electromechanical contact logic (interposing relays, contactors, pneumatic timers) and static solid-state logic (discrete logic gates, transistor arrays, SCR/TRIAC trigger modules). In both implementations, the control sequence is physically locked into copper wiring topologies. By contrast, programmable control encapsulates the decision logic entirely within microprocessor memory addresses. This distinction fundamentally transforms engineering workflows: re-sequencing a hardwired panel requires scheduled line shutdowns, mechanical panel re-drilling, contactor additions, and labor-intensive rewiring; a PLC system retains 100% of existing field terminal wiring, requiring only software logic modification and a 10-second program download.",
      "keyPoints": [
        "Electromechanical Relay Systems: Utilize moving mechanical contacts subject to contact pitting, mechanical wear, and arc erosion after hundreds of thousands of duty cycles",
        "Solid-State Discrete Systems: Utilize discrete transistor and IC logic gates; offers faster switching speeds but remains topologically rigid to wiring layout",
        "Programmable Logic Controllers: Physical copper wiring terminates once at screw terminals (DI/DO); all interlocking rules reside in software code",
        "Hardwired Engineering Workflow: Requirement → Schematic Drafting → Component Procurement → Panel Wiring → Commissioning",
        "PLC Engineering Workflow: Requirement → Algorithm Modeling → Software Coding → CPU Download → Online Debugging"
      ]
    }
  ],
  "figures": [
    {
      "src": "/images/slides/01-programmable-control/PLC_Slide_1__007.jpg",
      "caption": "Figure 1.3: Hardwired Relay Panel vs Programmable Logic Controller Hardware Architecture"
    }
  ],
  "caseStudy": {
    "title": "Automotive Stamping Line Retrofit: Hardwired Relay Panel to S7-1200 PLC",
    "context": "A legacy body stamping press line originally incorporated over 2,000 electromechanical control relays and mechanical timers spanning 3 massive steel enclosures. When plant retooling required a new stamping sequence for a redesigned car chassis, electricians endured 3 weeks of plant downtime to unmount relays, drill backplates, and trace thousands of copper jumpers. Following retrofit to an S7-1200 system, field wiring connects permanently to terminal strips once, and sequence re-tooling requires only a 5-minute software download via TIA Portal.",
    "hardware": [
      "Legacy System: 2,000 Omron MY4N Control Relays (requiring 3 large 1200×800mm cabinets)",
      "Modern System: 1 DIN-rail rack with S7-1200 CPU 1215C + 6 × SM 1223 I/O Modules",
      "Physical Footprint: 85% reduction in panel enclosure space; 70% power savings",
      "Component Lifespan: Extended from 10^6 duty cycles (relay contact wear) to 15+ years solid-state MTBF"
    ],
    "pitfall": "Mechanical relay contacts suffer from contact bounce, contact pitting, and arc erosion over time, leading to intermittent, hard-to-diagnose field faults that multimeter continuity tests often miss."
  },
  "quiz": [
    {
      "q": "What is the primary operational drawback of hardwired electromechanical relay logic panels?",
      "options": [
        "They are immune to electrical noise",
        "Any sequence change requires physical rewiring, scheduled plant shutdowns, and labor-intensive panel modifications",
        "They cannot operate on 24VDC",
        "They require ethernet switches"
      ],
      "answer": 1,
      "explain": "In hardwired relay panels, the control logic is physically locked in copper wiring; re-sequencing requires costly manual rewiring and downtime."
    }
  ],
  "narration": {
    "vi": "Điều khiển cứng dùng dây nối vật lý để tạo logic — muốn thay đổi phải đấu lại dây, tốn thời gian và dễ sai. Điều khiển lập trình như PLC cho phép thay đổi hoàn toàn hành vi bằng phần mềm mà không cần chạm vào phần cứng. Đây là lý do PLC thay thế hoàn toàn tủ rơ-le cổ điển trong nhà máy hiện đại.",
    "durationSec": 25,
    "by": "ai",
    "updatedAt": "2026-10-10"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Hardwired Relay Logic versus Programmable Control",
      "points": [
        "Electromechanical Relay Systems: Utilize moving mechanical contacts subject to contact pitting, mechanical wear, and arc erosion after hundreds of thousands of duty cycles",
        "Solid-State Discrete Systems: Utilize discrete transistor and IC logic gates; offers faster switching speeds but remains topologically rigid to wiring layout",
        "Programmable Logic Controllers: Physical copper wiring terminates once at screw terminals (DI/DO); all interlocking rules reside in software code",
        "Hardwired Engineering Workflow: Requirement → Schematic Drafting → Component Procurement → Panel Wiring → Commissioning",
        "PLC Engineering Workflow: Requirement → Algorithm Modeling → Software Coding → CPU Download → Online Debugging"
      ],
      "explain": "Historically, industrial automation evolved across two distinct paradigms. Hardwired control comprises electromechanical contact logic (interposing relays, contactors, pneumatic timers) and static solid-state logic (discrete logic gates, transistor arrays, SCR/TRIAC trigger modules). In both implementations, the control sequence is physically locked into copper wiring topologies. By contrast, programmable control encapsulates the decision logic entirely within microprocessor memory addresses. This distinction fundamentally transforms engineering workflows: re-sequencing a hardwired panel requires scheduled line shutdowns, mechanical panel re-drilling, contactor additions, and labor-intensive rewiring; a PLC system retains 100% of existing field terminal wiring, requiring only software logic modification and a 10-second program download.",
      "figure": {
        "src": "/images/slides/01-programmable-control/PLC_Slide_1__007.jpg",
        "caption": "Figure 1.3: Hardwired Relay Panel vs Programmable Logic Controller Hardware Architecture"
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

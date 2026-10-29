import { TopicContent } from '@/types/content';

export default {
  "slug": "upgrade-risks",
  "title": "Planning and Risk Management",
  "durationMinutes": 9,
  "summary": "A live-line PLC migration is an operation with zero tolerance for failure.",
  "body": [
    {
      "heading": "Planning and Risk Management",
      "text": "A live-line PLC migration is an operation with zero tolerance for failure. If an automated production line cannot restart at the end of a scheduled weekend shutdown, production losses can exceed the total cost of the upgrade. Professional automation engineers mitigate this through a comprehensive Risk Management and Commissioning Plan. The plan centers on three critical pillars: (1) Hardware Wiring Adapters: Rather than manually unscrewing hundreds of field wires—which introduces wire landing errors—engineers utilize pre-fabricated front-connector wiring adapters. These adapters plug directly onto the existing S7-300 terminal front-connectors, routing signals through factory-tested cable harnesses into the new S7-1500 or ET 200MP modules in seconds without disturbing field cables. (2) Formal Risk Register: A living document identifying potential risks (e.g. hidden sensor faults, uncalibrated analog loops, operator unfamiliarity with new HMI screens), scoring their Likelihood and Severity, and defining explicit mitigations. (3) The 15-Minute Rollback Plan: A mandatory contingency protocol where the old PLC hardware is kept mounted on a spare bracket; if severe commissioning roadblocks occur, the team can swap field connectors back to the old CPU within 15 minutes, ensuring the factory restarts production on schedule.",
      "keyPoints": [
        "Pre-Fabricated Wiring Adapters: Dedicated migration front-connectors snap onto existing S7-300 terminal strips, eliminating manual field rewiring errors",
        "Formal Risk Register: Tabular risk matrix evaluating Technical, Operational, and Safety risks with explicit mitigation actions and assigned owners",
        "Dry-Run Virtual Commissioning: Complete simulation using PLCSIM Advanced and digital-twin emulation reduces on-site debugging time by up to 70%",
        "Point-to-Point I/O Verification: Mandatory pre-start protocol verifying 100% of field sensor contacts and actuator movements before running automatic cycles",
        "The 15-Minute Rollback Procedure: Defined step-by-step protocol to reinstall the legacy CPU and reconnect field plugs if go-live abort criteria are met",
        "Go-Live Acceptance Criteria: Explicit checklist (zero active safety faults, 100% I/O verified, 4-hour continuous defect-free test run) required for plant handover",
        "Operator and Maintenance Training: Conducting minimum 4 hours of hands-on HMI alarm navigation and diagnostic training before production launch"
      ],
      "note": "Never discard the old PLC CPU or dismantle the old control panel on Day 1 of commissioning! Keep the legacy CPU mounted on the panel door or on a temporary bracket with its original program intact until the new system has operated continuously and fault-free for at least two full production weeks."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/14-system-upgrade/PLC___Slide__001.png",
      "caption": "Figure 14.4: Front-Connector Wiring Adapters & 15-Minute Emergency Rollback Protocol"
    }
  ],
  "quiz": [
    {
      "q": "Why do automation engineers mandate a pre-planned \"15-minute rollback protocol\" during plant upgrade shutdowns?",
      "options": [
        "To ensure the original working legacy system can be safely reconnected and restored before production start if unexpected commissioning hurdles occur",
        "To avoid paying overtime to electricians",
        "Because batteries expire after 15 minutes",
        "To reset the fire alarm"
      ],
      "answer": 0,
      "explain": "A rigorous rollback procedure guarantees that if a newly installed PLC encounters insurmountable commissioning bugs, the factory can resume production on time."
    }
  ],
  "narration": {
    "vi": "Quản lý rủi ro khi nâng cấp bắt đầu từ kế hoạch rollback rõ ràng. Trước khi cắt sang PLC mới, bạn phải backup toàn bộ chương trình cũ và giữ phần cứng cũ ở trạng thái sẵn sàng phục hồi. Acceptance criteria cần được thống nhất trước với khách hàng — chạy bao nhiêu giờ liên tục không lỗi thì mới nghiệm thu. Điều đó tránh tranh chấp và giúp cả hai bên có mục tiêu rõ ràng.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

import { TopicContent } from '@/types/content';

export default {
  "slug": "why-upgrade",
  "title": "Why and When to Upgrade",
  "durationMinutes": 9,
  "summary": "Upgrading an industrial control system is a major capital investment that requires clear technical and business justifications.",
  "body": [
    {
      "heading": "Why and When to Upgrade",
      "text": "Upgrading an industrial control system is a major capital investment that requires clear technical and business justifications. A modernization project is rarely initiated merely because newer hardware exists; rather, it is driven by four primary operational risk factors: (1) Hardware Obsolescence: When manufacturers declare a PLC family 'Discontinued' (as Siemens did with S7-200 and S7-300), original spare parts become scarce, lead times lengthen to months, and emergency replacement modules on secondary markets surge to 500% of original price. (2) Production Reliability and Unplanned Downtime: Aging power supplies, failing memory capacitors, and oxidised backplane connectors cause intermittent, catastrophic line stoppages. (3) Regulatory and Functional Safety Standards: Modern machinery directives (ISO 13849-1, IEC 62061) mandate Performance Level d/e (PL d/e) and SIL 2/3 safety integration that legacy discrete relay panels or vintage PLCs cannot support. (4) Digital Transformation and IIoT: Modern manufacturing execution systems (MES) and enterprise resource planning (ERP) platforms require native OPC-UA, MQTT, and secure Industrial Ethernet connectivity to track Overall Equipment Effectiveness (OEE) and energy metrics.",
      "keyPoints": [
        "Obsolescence Lifecycle Stages: Active Phase -> Discontinuation Announcement -> Spare Parts Phase (10 years) -> Legacy / End-of-Life",
        "Total Cost of Ownership (TCO): When the annual cost of emergency spare parts and downtime exceeds the one-time modernization cost, migration is economically mandatory",
        "Functional Safety Mandates: Legacy systems require separate hardwired safety circuits; modern S7-1200F/1500F CPUs integrate safety over PROFINET via PROFIsafe",
        "Industry 4.0 Integration: Modern controllers feature native OPC-UA servers, web APIs, and encrypted TLS communication for cloud telemetry",
        "Production Capacity Limits: Aging CPUs with exhausted work memory and slow scan times restrict throughput and process optimization",
        "Scheduled Plant Shutdown Windows: Major migrations must be synchronized with scheduled annual maintenance turnarounds to minimize revenue loss"
      ],
      "note": "Always evaluate the complete system scope before proposing an upgrade! Upgrading a legacy PLC CPU frequently necessitates upgrading the connected HMI panel (e.g. migrating ProTool or WinCC Flexible to WinCC Comfort/Unified) and obsolete serial variable frequency drives."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/14-system-upgrade/PLC___Slide__018.png",
      "caption": "Figure 14.1: Automation Hardware Obsolescence Curve & Economic Total Cost of Ownership (TCO)"
    }
  ],
  "quiz": [
    {
      "q": "What is the primary business risk of maintaining obsolete legacy PLCs (e.g. S7-200 or S7-300) in 24/7 manufacturing plants?",
      "options": [
        "Spare modules are no longer manufactured, leading to exorbitant secondary-market prices and catastrophic prolonged downtime in the event of a failure",
        "Modern programming software will not run on Windows 11",
        "The CPUs run out of serial numbers",
        "Ethernet switches refuse to connect to them"
      ],
      "answer": 0,
      "explain": "When manufacturers declare hardware mature/discontinued, replacement modules become scarce, risking weeks of catastrophic production line stoppage."
    }
  ],
  "narration": {
    "vi": "Nâng cấp PLC không chỉ vì phần cứng hỏng. Có nhiều lý do chiến lược hơn: thiết bị cũ hết linh kiện thay thế, nhà cung cấp ngừng hỗ trợ phần mềm, hoặc dây chuyền cần tích hợp thêm công nghệ mới như IIoT hay cloud. Giữ PLC cũ quá lâu đồng nghĩa với rủi ro dừng máy đột ngột mà không có phụ tùng thay thế — chi phí đó thường lớn hơn nhiều so với đầu tư nâng cấp chủ động.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Why and When to Upgrade",
      "points": [
        "Obsolescence Lifecycle Stages: Active Phase -> Discontinuation Announcement -> Spare Parts Phase (10 years) -> Legacy / End-of-Life",
        "Total Cost of Ownership (TCO): When the annual cost of emergency spare parts and downtime exceeds the one-time modernization cost, migration is economically mandatory",
        "Functional Safety Mandates: Legacy systems require separate hardwired safety circuits; modern S7-1200F/1500F CPUs integrate safety over PROFINET via PROFIsafe",
        "Industry 4.0 Integration: Modern controllers feature native OPC-UA servers, web APIs, and encrypted TLS communication for cloud telemetry",
        "Production Capacity Limits: Aging CPUs with exhausted work memory and slow scan times restrict throughput and process optimization",
        "Scheduled Plant Shutdown Windows: Major migrations must be synchronized with scheduled annual maintenance turnarounds to minimize revenue loss"
      ],
      "explain": "Upgrading an industrial control system is a major capital investment that requires clear technical and business justifications. A modernization project is rarely initiated merely because newer hardware exists; rather, it is driven by four primary operational risk factors: (1) Hardware Obsolescence: When manufacturers declare a PLC family 'Discontinued' (as Siemens did with S7-200 and S7-300), original spare parts become scarce, lead times lengthen to months, and emergency replacement modules on secondary markets surge to 500% of original price. (2) Production Reliability and Unplanned Downtime: Aging power supplies, failing memory capacitors, and oxidised backplane connectors cause intermittent, catastrophic line stoppages. (3) Regulatory and Functional Safety Standards: Modern machinery directives (ISO 13849-1, IEC 62061) mandate Performance Level d/e (PL d/e) and SIL 2/3 safety integration that legacy discrete relay panels or vintage PLCs cannot support. (4) Digital Transformation and IIoT: Modern manufacturing execution systems (MES) and enterprise resource planning (ERP) platforms require native OPC-UA, MQTT, and secure Industrial Ethernet connectivity to track Overall Equipment Effectiveness (OEE) and energy metrics.",
      "figure": {
        "src": "/images/slides/14-system-upgrade/PLC___Slide__018.png",
        "caption": "Figure 14.1: Automation Hardware Obsolescence Curve & Economic Total Cost of Ownership (TCO)"
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

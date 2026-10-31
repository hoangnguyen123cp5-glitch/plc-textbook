import { TopicContent } from '@/types/content';

export default {
  "slug": "s7-300-applications",
  "sourceRef": "8.3",
  "title": "S7-300 in Factory Applications",
  "durationMinutes": 10,
  "summary": "The S7-300 remains deeply entrenched in global manufacturing infrastructure: automotive stamping and body-in-white welding lines, chemical pharmaceutical batch reactors, municipal water treatment p...",
  "body": [
    {
      "heading": "8.3 S7-300 in Factory Applications",
      "text": "The S7-300 remains deeply entrenched in global manufacturing infrastructure: automotive stamping and body-in-white welding lines, chemical pharmaceutical batch reactors, municipal water treatment plants, and airport baggage handling networks commissioned between 1995 and 2018. The classic architecture typically comprises an S7-300 CPU (such as the workhorse CPU 315-2 PN/DP or CPU 317-2 DP) connected to multiple ET 200M distributed I/O stations over a redundant PROFIBUS-DP network. Automation engineers managing these legacy assets face critical lifecycle decisions: maintaining the system with refurbished spare parts, or migrating to modern S7-1500 controllers. Key technical triggers that dictate replacement include: scarcity of obsolete replacement cards, lack of cybersecurity features (the S7-300 has no built-in encryption or TLS security), lack of modern IIoT connectivity (OPC-UA, MQTT, cloud telemetry), and production capacity expansion limits. However, where processes are validated and spare parts remain in stock, maintaining the existing S7-300 line is frequently the most economically sound operational strategy.",
      "keyPoints": [
        "Ubiquitous Factory Deployments: Primary controller in millions of automotive assembly fixtures, packaging machines, and utility plants worldwide",
        "ET 200M Distributed I/O: High-density modular remote I/O utilizing standard S7-300 SM modules connected via IM 153 interface modules over PROFIBUS",
        "Fail-Safe Variants (S7-300F): Yellow-bezel fail-safe CPUs (e.g. CPU 315F) executing functional safety logic up to SIL 3 / PL e via PROFIsafe",
        "Cybersecurity and Connectivity Gaps: Legacy S7-300 CPUs lack modern TLS encryption, user management, and native OPC-UA server capabilities",
        "Maintenance Strategies: Procuring certified refurbished spare modules; maintaining battery replacements for older RAM CPUs; regular backup of MMC cards",
        "Engineering Software Requirements: Supported in classic SIMATIC STEP 7 V5.6/V5.7, and can be configured in TIA Portal V11 through V19",
        "Migration Evaluation Criteria: Upgrade when downtime costs exceed migration budget, or when required spare parts are discontinued by Siemens"
      ],
      "note": "Before modifying any code on a legacy factory S7-300, always perform an 'Upload Station to PG' in STEP 7 to pull the exact running binary blocks from the online CPU into a fresh backup archive! Legacy machines often have undocumented field patches that do not exist in the plant's old binder documentation."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/13-s7-300/PLC___Slide__033.jpg",
      "caption": "Figure 13.3: Distributed S7-300 & ET 200M Field Architecture over Purple Shielded PROFIBUS-DP"
    }
  ],
  "quiz": [
    {
      "q": "What distinctive purple shielded cable is universally associated with S7-300 distributed I/O (ET 200M)?",
      "options": [
        "PROFIBUS-DP RS485 shielded twisted pair",
        "Flat ribbon telephone wire",
        "Yellow AS-Interface ribbon",
        "Coaxial television cable"
      ],
      "answer": 0,
      "explain": "Standard PROFIBUS-DP cables feature an unmistakable violet/purple outer jacket with special high-frequency shielding and 9-pin Sub-D connectors."
    }
  ],
  "narration": {
    "vi": "S7-300 vẫn đang chạy trong rất nhiều nhà máy sản xuất, xử lý nước, và điện lực ở Việt Nam. Nó mạnh mẽ, đáng tin cậy, và có hệ sinh thái module phong phú. Tuy nhiên Siemens đã ngừng nhận đơn đặt hàng mới cho dòng này từ năm 2023. Nếu nhà máy bạn đang dùng S7-300 và cần mở rộng hoặc bảo trì lâu dài, đây là lúc cân nhắc lộ trình chuyển sang S7-1500.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "S7-300 in Factory Applications",
      "points": [
        "Ubiquitous Factory Deployments: Primary controller in millions of automotive assembly fixtures, packaging machines, and utility plants worldwide",
        "ET 200M Distributed I/O: High-density modular remote I/O utilizing standard S7-300 SM modules connected via IM 153 interface modules over PROFIBUS",
        "Fail-Safe Variants (S7-300F): Yellow-bezel fail-safe CPUs (e.g. CPU 315F) executing functional safety logic up to SIL 3 / PL e via PROFIsafe",
        "Cybersecurity and Connectivity Gaps: Legacy S7-300 CPUs lack modern TLS encryption, user management, and native OPC-UA server capabilities",
        "Maintenance Strategies: Procuring certified refurbished spare modules; maintaining battery replacements for older RAM CPUs; regular backup of MMC cards",
        "Engineering Software Requirements: Supported in classic SIMATIC STEP 7 V5.6/V5.7, and can be configured in TIA Portal V11 through V19",
        "Migration Evaluation Criteria: Upgrade when downtime costs exceed migration budget, or when required spare parts are discontinued by Siemens"
      ],
      "explain": "The S7-300 remains deeply entrenched in global manufacturing infrastructure: automotive stamping and body-in-white welding lines, chemical pharmaceutical batch reactors, municipal water treatment plants, and airport baggage handling networks commissioned between 1995 and 2018. The classic architecture typically comprises an S7-300 CPU (such as the workhorse CPU 315-2 PN/DP or CPU 317-2 DP) connected to multiple ET 200M distributed I/O stations over a redundant PROFIBUS-DP network. Automation engineers managing these legacy assets face critical lifecycle decisions: maintaining the system with refurbished spare parts, or migrating to modern S7-1500 controllers. Key technical triggers that dictate replacement include: scarcity of obsolete replacement cards, lack of cybersecurity features (the S7-300 has no built-in encryption or TLS security), lack of modern IIoT connectivity (OPC-UA, MQTT, cloud telemetry), and production capacity expansion limits. However, where processes are validated and spare parts remain in stock, maintaining the existing S7-300 line is frequently the most economically sound operational strategy.",
      "figure": {
        "src": "/images/slides/13-s7-300/PLC___Slide__033.jpg",
        "caption": "Figure 13.3: Distributed S7-300 & ET 200M Field Architecture over Purple Shielded PROFIBUS-DP"
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

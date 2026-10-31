import { TopicContent } from '@/types/content';

export default {
  "slug": "profinet-profibus",
  "sourceRef": "6.2",
  "title": "PROFINET and PROFIBUS",
  "durationMinutes": 15,
  "summary": "For high-performance plant-wide coordination, modern automated manufacturing relies on standardized fieldbus and Industrial Ethernet protocols: PROFIBUS and PROFINET.",
  "body": [
    {
      "heading": "6.2 PROFINET and PROFIBUS",
      "text": "For high-performance plant-wide coordination, modern automated manufacturing relies on standardized fieldbus and Industrial Ethernet protocols: PROFIBUS and PROFINET. PROFIBUS-DP (Decentralized Periphery) is an RS485-based token-ring master-slave fieldbus operating at speeds up to 12 Mbps over purple shielded cables. The S7-1200 interfaces to PROFIBUS via the CM 1243-5 (DP Master) or CM 1242-5 (DP Slave) modules. Today, PROFINET IO (Industrial Ethernet based on IEEE 802.3 standard at 100 Mbps full duplex) is the global standard for industrial networking, integrated natively onto every S7-1200 CPU. PROFINET replaces cyclic token-passing with deterministic Ethernet frames: Real-Time (RT) communication bypasses the standard TCP/IP protocol stack directly at Layer 2 (MAC level), delivering deterministic cycle update times under 1 ms with microsecond jitter. A PROFINET IO network comprises three device roles: the IO Controller (the PLC CPU executing logic), IO Devices (distributed remote I/O racks like ET 200SP, valve manifolds, and SINAMICS drives), and IO Supervisors (engineering workstations running TIA Portal). Devices are identified globally by unique symbolic PROFINET Device Names assigned in TIA Portal and resolved to IP addresses via the Discovery and Configuration Protocol (DCP). Third-party devices are integrated into TIA Portal by importing standardized XML-based GSDML (General Station Description Markup Language) device profile files.",
      "keyPoints": [
        "PROFINET Industrial Ethernet: Standard 100 Mbps full duplex; Cat5e shielded twisted pair with green industrial jacket; standard RJ45 or M12 connectors",
        "Real-Time (RT) Communication: Layer 2 priority tagging (IEEE 802.1Q) bypasses TCP/IP stack overhead, delivering deterministic cyclic data exchange (< 1 ms)",
        "Isochronous Real-Time (IRT): Hardware-synchronized Ethernet utilizing dedicated ASIC switches for jitter < 1 µs; essential for multi-axis coordinated motion",
        "PROFINET Device Naming: Devices are addressed by symbolic names (e.g. 'et200sp-conveyor1') rather than static IPs; DCP protocol resolves names to IP addresses automatically",
        "GSDML Device Description Files: Standardized XML device description files downloaded from manufacturers to integrate third-party drives and sensors into TIA Portal",
        "Media Redundancy Protocol (MRP): Ring network topology providing bumpless recovery (< 200 ms) in the event of a severed Ethernet cable",
        "PROFIBUS-DP Comparison: Legacy 12 Mbps token-ring fieldbus; requires specialized 9-pin Sub-D connectors with built-in terminating resistors and diagnostic LEDs"
      ],
      "note": "Always assign unique PROFINET Device Names to all distributed stations using TIA Portal before connecting them to the plant network! Unlike commercial office networks where IP addresses are primary, a PROFINET IO Controller will refuse to communicate with a remote I/O rack if its internal device name does not match the project configuration."
    }
  ],
  "figures": [
    {
      "src": "/images/diagrams/profinet-network-diagram.jpg",
      "caption": "Figure 11.2: PROFINET Real-Time (RT/IRT) Industrial Ethernet Topology with S7-1200 & ET 200SP I/O"
    }
  ],
  "quiz": [
    {
      "q": "What is the primary architectural advantage of PROFINET Industrial Ethernet over legacy PROFIBUS-DP?",
      "options": [
        "100 Mbps to 1 Gbps full-duplex bandwidth, standard CAT5e/CAT6 RJ45 cabling, integrated IT web services, and ring redundancy (MRP)",
        "PROFINET does not use IP addresses",
        "PROFINET requires purple serial cables",
        "PROFINET runs on 9V batteries"
      ],
      "answer": 0,
      "explain": "PROFINET combines high-speed real-time determinism with ubiquitous Ethernet hardware, fiber optic media, and enterprise network integration."
    }
  ],
  "narration": {
    "vi": "PROFIBUS-DP là chuẩn trường truyền thống của Siemens, dùng cáp hai dây xoắn, tốc độ tối đa 12 Mbps. PROFINET là thế hệ kế tiếp chạy trên Ethernet công nghiệp, nhanh hơn và hỗ trợ đến mức độ thời gian thực IRT. Trong TIA Portal, bạn kéo thả thiết bị vào Network View, gán địa chỉ, rồi TIA tự sinh cấu hình truyền thông. Không cần lập trình thêm cho dữ liệu I/O chu kỳ.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "PROFINET and PROFIBUS",
      "points": [
        "PROFINET Industrial Ethernet: Standard 100 Mbps full duplex; Cat5e shielded twisted pair with green industrial jacket; standard RJ45 or M12 connectors",
        "Real-Time (RT) Communication: Layer 2 priority tagging (IEEE 802.1Q) bypasses TCP/IP stack overhead, delivering deterministic cyclic data exchange (< 1 ms)",
        "Isochronous Real-Time (IRT): Hardware-synchronized Ethernet utilizing dedicated ASIC switches for jitter < 1 µs; essential for multi-axis coordinated motion",
        "PROFINET Device Naming: Devices are addressed by symbolic names (e.g. 'et200sp-conveyor1') rather than static IPs; DCP protocol resolves names to IP addresses automatically",
        "GSDML Device Description Files: Standardized XML device description files downloaded from manufacturers to integrate third-party drives and sensors into TIA Portal",
        "Media Redundancy Protocol (MRP): Ring network topology providing bumpless recovery (< 200 ms) in the event of a severed Ethernet cable",
        "PROFIBUS-DP Comparison: Legacy 12 Mbps token-ring fieldbus; requires specialized 9-pin Sub-D connectors with built-in terminating resistors and diagnostic LEDs"
      ],
      "explain": "For high-performance plant-wide coordination, modern automated manufacturing relies on standardized fieldbus and Industrial Ethernet protocols: PROFIBUS and PROFINET. PROFIBUS-DP (Decentralized Periphery) is an RS485-based token-ring master-slave fieldbus operating at speeds up to 12 Mbps over purple shielded cables. The S7-1200 interfaces to PROFIBUS via the CM 1243-5 (DP Master) or CM 1242-5 (DP Slave) modules. Today, PROFINET IO (Industrial Ethernet based on IEEE 802.3 standard at 100 Mbps full duplex) is the global standard for industrial networking, integrated natively onto every S7-1200 CPU. PROFINET replaces cyclic token-passing with deterministic Ethernet frames: Real-Time (RT) communication bypasses the standard TCP/IP protocol stack directly at Layer 2 (MAC level), delivering deterministic cycle update times under 1 ms with microsecond jitter. A PROFINET IO network comprises three device roles: the IO Controller (the PLC CPU executing logic), IO Devices (distributed remote I/O racks like ET 200SP, valve manifolds, and SINAMICS drives), and IO Supervisors (engineering workstations running TIA Portal). Devices are identified globally by unique symbolic PROFINET Device Names assigned in TIA Portal and resolved to IP addresses via the Discovery and Configuration Protocol (DCP). Third-party devices are integrated into TIA Portal by importing standardized XML-based GSDML (General Station Description Markup Language) device profile files.",
      "figure": {
        "src": "/images/diagrams/profinet-network-diagram.jpg",
        "caption": "Figure 11.2: PROFINET Real-Time (RT/IRT) Industrial Ethernet Topology with S7-1200 & ET 200SP I/O"
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

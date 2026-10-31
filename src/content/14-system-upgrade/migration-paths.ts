import { TopicContent } from '@/types/content';

export default {
  "slug": "migration-paths",
  "title": "Migration Paths and Tooling",
  "durationMinutes": 12,
  "summary": "Siemens establishes formal, well-defined hardware replacement paths and software migration tools to assist engineers during modernization.",
  "body": [
    {
      "heading": "Migration Paths and Tooling",
      "text": "Siemens establishes formal, well-defined hardware replacement paths and software migration tools to assist engineers during modernization. The official hardware migration matrix dictates: (1) SIMATIC S7-200 micro-controllers migrate to SIMATIC S7-1200. Because S7-200 used the proprietary STEP 7 Micro/WIN software with a unique memory architecture, there is no direct automatic project converter; applications require a structured manual rewrite using the legacy program printout and I/O list as a functional specification. (2) SIMATIC S7-300 and S7-400 systems migrate to SIMATIC S7-1500. For this path, Siemens provides the automated TIA Portal Migration Tool (or the integrated 'Migrate Project' function in TIA Portal V13 through V19). The tool parses original STEP 7 Classic projects (*.s7p), automatically converting hardware racks, symbolic tag tables, standard Data Blocks, and most Ladder/FBD logic blocks into equivalent TIA Portal objects. (3) Decentralized Periphery: Legacy ET 200M remote racks migrate to modern ET 200MP or high-density ET 200SP stations, cutting physical panel footprint by up to 50% while upgrading communication from PROFIBUS-DP to PROFINET.",
      "keyPoints": [
        "S7-200 to S7-1200 Migration Path: No automated code converter; requires manual code re-engineering utilizing standardized IEC logic blocks",
        "S7-300/400 to S7-1500 Migration Path: Supported by the automated TIA Migration Tool; converts hardware, tags, DBs, and standard OB/FC/FB rungs",
        "TIA Migration Tool Software: Standalone utility executed on the computer hosting STEP 7 Classic; exports project into an intermediate '*.am19' migration file",
        "Automated Conversion Scope: Converts standard LAD/FBD blocks, DB structures, and symbol tables; leaves complex indirect addressing for manual review",
        "Non-Convertible Technologies: Siemens GRAPH (SFC), HiGraph, legacy communication FBs, and non-standard vendor libraries require manual recoding",
        "ET 200M to ET 200SP / MP: High-density modular distributed I/O modules provide push-in terminal blocks and integrated PROFINET switches"
      ],
      "note": "Before executing project migration in TIA Portal, all proprietary add-on software packages (such as S7-GRAPH, S7-SCL, or Distributed Safety) that were installed in the original STEP 7 Classic environment must be installed or cleanly removed, or the migration tool will reject the source file."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/14-system-upgrade/PLC___Slide__002.png",
      "caption": "Figure 14.2: Official Siemens Migration Paths: S7-200 -> S7-1200 and S7-300 -> S7-1500"
    }
  ],
  "quiz": [
    {
      "q": "What is the direct, officially recommended Siemens migration path for legacy S7-300 automation systems?",
      "options": [
        "Upgrade to SIMATIC S7-1500 and TIA Portal",
        "Downgrade to S7-200",
        "Replace with relays",
        "Switch to standard Arduino boards"
      ],
      "answer": 0,
      "explain": "The SIMATIC S7-1500 family is the direct technological successor to the S7-300, delivering high-speed backplane communication and seamless TIA integration."
    }
  ],
  "narration": {
    "vi": "Siemens hỗ trợ hai lộ trình chuyển đổi phổ biến: S7-200 lên S7-1200, và S7-300 lên S7-1500. TIA Migration Tool giúp tự động chuyển đổi một phần cấu hình phần cứng và chương trình. Tuy nhiên không phải tất cả đều chuyển được tự động — một số block đặc thù, địa chỉ ký hiệu và cấu trúc dữ liệu cần người kỹ sư xem xét và điều chỉnh thủ công sau khi tool chạy xong.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Migration Paths and Tooling",
      "points": [
        "S7-200 to S7-1200 Migration Path: No automated code converter; requires manual code re-engineering utilizing standardized IEC logic blocks",
        "S7-300/400 to S7-1500 Migration Path: Supported by the automated TIA Migration Tool; converts hardware, tags, DBs, and standard OB/FC/FB rungs",
        "TIA Migration Tool Software: Standalone utility executed on the computer hosting STEP 7 Classic; exports project into an intermediate '*.am19' migration file",
        "Automated Conversion Scope: Converts standard LAD/FBD blocks, DB structures, and symbol tables; leaves complex indirect addressing for manual review",
        "Non-Convertible Technologies: Siemens GRAPH (SFC), HiGraph, legacy communication FBs, and non-standard vendor libraries require manual recoding",
        "ET 200M to ET 200SP / MP: High-density modular distributed I/O modules provide push-in terminal blocks and integrated PROFINET switches"
      ],
      "explain": "Siemens establishes formal, well-defined hardware replacement paths and software migration tools to assist engineers during modernization. The official hardware migration matrix dictates: (1) SIMATIC S7-200 micro-controllers migrate to SIMATIC S7-1200. Because S7-200 used the proprietary STEP 7 Micro/WIN software with a unique memory architecture, there is no direct automatic project converter; applications require a structured manual rewrite using the legacy program printout and I/O list as a functional specification. (2) SIMATIC S7-300 and S7-400 systems migrate to SIMATIC S7-1500. For this path, Siemens provides the automated TIA Portal Migration Tool (or the integrated 'Migrate Project' function in TIA Portal V13 through V19). The tool parses original STEP 7 Classic projects (*.s7p), automatically converting hardware racks, symbolic tag tables, standard Data Blocks, and most Ladder/FBD logic blocks into equivalent TIA Portal objects. (3) Decentralized Periphery: Legacy ET 200M remote racks migrate to modern ET 200MP or high-density ET 200SP stations, cutting physical panel footprint by up to 50% while upgrading communication from PROFIBUS-DP to PROFINET.",
      "figure": {
        "src": "/images/slides/14-system-upgrade/PLC___Slide__002.png",
        "caption": "Figure 14.2: Official Siemens Migration Paths: S7-200 -> S7-1200 and S7-300 -> S7-1500"
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

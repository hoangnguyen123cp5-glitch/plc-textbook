import { TopicContent } from '@/types/content';

export default {
  "slug": "io-circuits",
  "sourceRef": "5.2",
  "title": "Input and Output Circuits",
  "durationMinutes": 9,
  "summary": "The semiconductor physics of sinking and sourcing digital I/O applies identically across all PLC vendors; however, terminal labeling and common-bus topologies differ significantly between European...",
  "body": [
    {
      "heading": "5.2 Input and Output Circuits",
      "text": "The semiconductor physics of sinking and sourcing digital I/O applies identically across all PLC vendors; however, terminal labeling and common-bus topologies differ significantly between European and Japanese designs. In Europe (Siemens), 24VDC Sinking DI (PNP compatible) is standard. In Japan (Mitsubishi and Omron), NPN sinking transistor logic was historically dominant due to early bipolar semiconductor availability. On the Mitsubishi FX3U, digital input circuits feature a dedicated 'S/S' (Sink/Source) terminal: connecting S/S to +24VDC configures the inputs as NPN sinking (switched to 0VDC); connecting S/S to 0VDC configures the inputs as PNP sourcing (switched to +24VDC). Omron CP1H controllers feature grouped inputs with independent 'COM' terminals (e.g. COM0, COM1) allowing mixed sinking and sourcing configurations across different input banks. For digital outputs, both brands provide either 2.0A electromechanical relay contacts (capable of switching up to 250VAC or 30VDC) or 0.5A solid-state transistor outputs. Japanese transistor outputs are typically NPN open-collector (sinking outputs that switch the load to ground), requiring external loads to connect to +24VDC.",
      "keyPoints": [
        "Mitsubishi S/S Configuration Jumper: Connecting S/S to +24V sets NPN Sink input mode; connecting S/S to 0V sets PNP Source input mode",
        "Omron COM Grouping: Independent COM terminals allow isolation between distinct sensor banks, but internal bridge shorts occur if cross-wired",
        "NPN vs PNP Transistor DO: European S7-1200 DO is PNP sourcing (switches +24V to load); Japanese FX/CP DO is typically NPN sinking (switches load to 0V)",
        "Relay Output Equivalence: 2.0A resistive / inductive load rating across all brands; mechanical contact lifetime ~100,000 operations under full load",
        "Analog Module Terminals: Omron and Mitsubishi analog cards support selectable 0–10V or 4–20mA via DIP switches or software buffer memories",
        "Terminal Block Screw Formats: Japanese PLCs traditionally feature M3 phillips/slotted screw terminal barriers; modern variants offer push-in spring clamps"
      ],
      "note": "Never connect a 24VDC PNP sensor directly to an input configured for NPN mode! In NPN mode, the PLC terminal sits at +24V potential waiting to be pulled down to 0V; applying external +24V from a PNP sensor will fail to register or cause reverse current flow."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/06-other-plc-brands/06-oth_carved_043.png",
      "caption": "Figure 6.2: S/S Terminal Jumper Wiring & NPN Sinking vs PNP Sourcing Field Connections"
    }
  ],
  "quiz": [
    {
      "q": "When wiring an NPN (sinking output) proximity sensor to a PLC input, how must the PLC common terminal be biased?",
      "options": [
        "Common terminal must be connected to +24VDC (sourcing input circuit)",
        "Common terminal must be connected to 0VDC",
        "Common terminal must be connected to Earth",
        "Common terminal is left floating"
      ],
      "answer": 0,
      "explain": "An NPN sensor pulls the signal pin to 0VDC; therefore, the PLC input circuit must source current from +24VDC through its common terminal."
    }
  ],
  "narration": {
    "vi": "Mạch DI và DO của Omron và Mitsubishi về nguyên lý giống Siemens nhưng có một số khác biệt về sơ đồ chân. Omron CP1H có các cổng đầu vào sinking mặc định, cần nguồn ngoài 24VDC. Đầu ra có hai loại: transistor NPN cho tải DC và relay cho tải AC. Mitsubishi FX3U tương tự nhưng cũng cung cấp loại đầu ra transistor PNP. Khi thay thế PLC của hãng này bằng hãng khác, phải kiểm tra lại toàn bộ sơ đồ đấu dây.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Input and Output Circuits",
      "points": [
        "Mitsubishi S/S Configuration Jumper: Connecting S/S to +24V sets NPN Sink input mode; connecting S/S to 0V sets PNP Source input mode",
        "Omron COM Grouping: Independent COM terminals allow isolation between distinct sensor banks, but internal bridge shorts occur if cross-wired",
        "NPN vs PNP Transistor DO: European S7-1200 DO is PNP sourcing (switches +24V to load); Japanese FX/CP DO is typically NPN sinking (switches load to 0V)",
        "Relay Output Equivalence: 2.0A resistive / inductive load rating across all brands; mechanical contact lifetime ~100,000 operations under full load",
        "Analog Module Terminals: Omron and Mitsubishi analog cards support selectable 0–10V or 4–20mA via DIP switches or software buffer memories",
        "Terminal Block Screw Formats: Japanese PLCs traditionally feature M3 phillips/slotted screw terminal barriers; modern variants offer push-in spring clamps"
      ],
      "explain": "The semiconductor physics of sinking and sourcing digital I/O applies identically across all PLC vendors; however, terminal labeling and common-bus topologies differ significantly between European and Japanese designs. In Europe (Siemens), 24VDC Sinking DI (PNP compatible) is standard. In Japan (Mitsubishi and Omron), NPN sinking transistor logic was historically dominant due to early bipolar semiconductor availability. On the Mitsubishi FX3U, digital input circuits feature a dedicated 'S/S' (Sink/Source) terminal: connecting S/S to +24VDC configures the inputs as NPN sinking (switched to 0VDC); connecting S/S to 0VDC configures the inputs as PNP sourcing (switched to +24VDC). Omron CP1H controllers feature grouped inputs with independent 'COM' terminals (e.g. COM0, COM1) allowing mixed sinking and sourcing configurations across different input banks. For digital outputs, both brands provide either 2.0A electromechanical relay contacts (capable of switching up to 250VAC or 30VDC) or 0.5A solid-state transistor outputs. Japanese transistor outputs are typically NPN open-collector (sinking outputs that switch the load to ground), requiring external loads to connect to +24VDC.",
      "figure": {
        "src": "/images/slides/06-other-plc-brands/06-oth_carved_043.png",
        "caption": "Figure 6.2: S/S Terminal Jumper Wiring & NPN Sinking vs PNP Sourcing Field Connections"
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

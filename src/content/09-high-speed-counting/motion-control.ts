import { TopicContent } from '@/types/content';

export default {
  "slug": "motion-control",
  "sourceRef": "4.4",
  "title": "Position Control with Motion Control",
  "durationMinutes": 13,
  "summary": "For high-precision positioning applications—such as pick-and-place linear gantries, indexing rotary tables, and ball-screw packaging feeds—the S7-1200 incorporates Pulse Train Output (PTO) motion c...",
  "body": [
    {
      "heading": "4.4 Position Control with Motion Control",
      "text": "For high-precision positioning applications—such as pick-and-place linear gantries, indexing rotary tables, and ball-screw packaging feeds—the S7-1200 incorporates Pulse Train Output (PTO) motion control conforming to standardized PLCopen specifications. In PTO mode, the hardware pulse generator outputs a train of discrete square-wave pulses where each pulse commands the motor drive to step by an exact mechanical increment (e.g. 0.01 mm). The pulse frequency governs rotational speed, while the total pulse count commands absolute travel distance. In TIA Portal, motion control is engineered using Axis Technology Objects (TO_Axis). The engineer parameterizes the mechanical kinematics (screw lead, gear ratios), velocity limits, S-curve jerk-limiting acceleration/deceleration ramps, and software/hardware end-of-travel limit switches. Control logic is executed using standardized PLCopen function blocks: MC_Power (energizes the servo drive), MC_Reset (clears drive alarm faults), MC_Home (executes active or passive zero-datum calibration using the encoder Z pulse), MC_MoveJog (manual velocity jog for maintenance), MC_MoveAbsolute (travels to an exact coordinate coordinate), and MC_MoveRelative (advances by a relative distance delta).",
      "keyPoints": [
        "Pulse Train Output (PTO) Topology: Outputs pulse train on %Q0.0 (frequency represents velocity; pulse count represents displacement) and direction signal on %Q0.1",
        "Axis Technology Object (TO_Axis): Graphical configuration tool parameterizing mechanical pitch, acceleration ramps, jerk filtering, and limits",
        "PLCopen Motion Standard: Vendor-independent motion blocks ensuring portable, standardized programming across diverse drive platforms",
        "MC_Power: Authorizes and enables the drive power stage; must remain active throughout all axis positioning commands",
        "MC_Home: Synchronizes the logical software coordinate system with physical mechanical datum using limit switches and encoder zero markers",
        "MC_MoveAbsolute vs MC_MoveRelative: Absolute moves travel to an exact position relative to origin (X = 250.0 mm); Relative moves advance by a distance increment (+50.0 mm)",
        "S-Curve Jerk Limiting: Smooths acceleration transitions to eliminate mechanical vibration, belt slipping, and structural stress on mechanical carriages"
      ],
      "note": "Always wire physical, hardwired Normally Closed (NC) limit switches to positive and negative overtravel inputs! Do not rely solely on software positioning limits in your PLC code. If an encoder coupling slips, software limits are blinded, and physical limit switches are the only barrier preventing mechanical gantry crashes."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/09-high-speed-counting/PL___Slide_4_014.jpeg",
      "caption": "Figure 9.4: Pulse Train Output (PTO) & PLCopen Motion Technology Objects (MC_Power, MC_MoveAbsolute)"
    }
  ],
  "quiz": [
    {
      "q": "Which PLCopen standard motion control block is executed to power and enable a servo axis before motion commands can run?",
      "options": [
        "MC_Power",
        "MC_MoveAbsolute",
        "MC_Halt",
        "MC_Reset"
      ],
      "answer": 0,
      "explain": "MC_Power energizes the drive power stage, closes the internal position loop, and sets the axis status to Enabled."
    }
  ],
  "narration": {
    "vi": "Motion Control trong TIA Portal dùng đối tượng Axis để đại diện cho một trục chuyển động. Đầu tiên bạn tạo Axis object và liên kết với xung PTO hoặc drive. Lệnh MC_Power bật trục, MC_MoveAbsolute điều khiển vị trí tuyệt đối. Tất cả lệnh motion đều là Function Block, hoạt động bất đồng bộ — bạn theo dõi trạng thái qua các bit Done, Busy, Error.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

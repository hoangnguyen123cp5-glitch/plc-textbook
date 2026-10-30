import { TopicContent } from '@/types/content';

export default {
  "slug": "pid-compact",
  "title": "PID_Compact on the S7-1200",
  "durationMinutes": 12,
  "summary": "The Siemens S7-1200 provides the PID_Compact Technology Object: an industrial-grade, fully encapsulated closed-loop controller block implemented in firmware.",
  "body": [
    {
      "heading": "PID_Compact on the S7-1200",
      "text": "The Siemens S7-1200 provides the PID_Compact Technology Object: an industrial-grade, fully encapsulated closed-loop controller block implemented in firmware. PID_Compact executes inside a dedicated Cyclic Interrupt Organization Block (OB30), guaranteeing that algorithm iterations execute at exact, jitter-free temporal intervals (e.g. Ts = 100 ms). The block provides flexible signal interfacing: Setpoint can be supplied as a floating-point REAL value (e.g. 65.0°C from an HMI); Process Variable can be connected either as an already-scaled engineering REAL value via the 'Input' pin, or directly as a raw 16-bit analog integer via the 'Input_PER' pin (e.g. %IW64 directly from an RTD or 4–20mA transmitter). When using Input_PER, the Technology Object automatically handles analog quantization and scaling using parameters defined in its graphical configuration wizard. For manipulated outputs, PID_Compact supports three simultaneous formats: 'Output' (continuous 0.0% to 100.0% REAL for internal logic), 'Output_PER' (raw integer 0 to 27648 for analog output modules %QW64 driving control valves), and 'Output_PWM' (time-proportioned duty cycle for solid-state relays controlling industrial heaters).",
      "keyPoints": [
        "Technology Object Architecture: Instantiated as an integrated block backed by an internal system Data Block (e.g. 'PID_Compact_1')",
        "Execution in Cyclic Interrupt (OB30): Guarantees strict deterministic execution at fixed sampling intervals (Ts); never call PID_Compact in OB1",
        "Input vs Input_PER: 'Input' accepts floating-point engineering units (e.g. 50.0 bar); 'Input_PER' accepts raw analog integer counts (%IW64) with integrated scaling",
        "Output vs Output_PER vs Output_PWM: Output (0.0–100.0% REAL), Output_PER (0–27648 integer for AQ), Output_PWM (digital pulse train for heaters)",
        "Integral Anti-Windup Protection: Automatically clamps the integral accumulator when actuator limits (0% or 100%) are reached, eliminating saturation recovery delays",
        "Deadband Support: Configurable error deadband suppresses minor actuator adjustments when the error is within acceptable plant tolerances (e.g. ±0.5°C)",
        "Direct/Reverse Acting Direction: Direct-acting (cooling loop: output increases as PV rises above SP); Reverse-acting (heating loop: output increases as PV falls below SP)"
      ],
      "note": "Always verify the control direction (Direct vs Reverse) in PID_Compact properties! In heating processes, the loop is Reverse Acting (cooling requires less heat). If configured as Direct Acting, a drop in temperature will cause the PLC to turn OFF the heater, leading to thermal runaway in the wrong direction."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/10-closed-loop-pid/PLC___Slide__036.png",
      "caption": "Figure 10.2: Siemens PID_Compact Technology Object Architecture, Input_PER & Anti-Windup Clamping"
    }
  ],
  "quiz": [
    {
      "q": "Why must the PID_Compact Technology Object be called inside a Cyclic Interrupt (OB30) rather than OB1?",
      "options": [
        "Because OB1 cannot process floating-point REAL numbers",
        "To ensure a strictly deterministic, jitter-free sampling time (Ts) required for mathematical integration and derivation",
        "To prevent the CPU from running out of load memory",
        "Because OB30 executes with lower priority than communications"
      ],
      "answer": 1,
      "explain": "Discrete PID algorithms assume a constant sampling interval (Ts). Variations in OB1 cycle scan time would introduce calculation jitter and loop instability."
    }
  ],
  "narration": {
    "vi": "PID_Compact là Function Block tích hợp sẵn trong TIA Portal, hỗ trợ ba chế độ hoạt động. Chế độ Inactive là tắt hoàn toàn. Chế độ Manual cho phép người vận hành đặt trực tiếp giá trị đầu ra. Chế độ Auto là PLC tự tính toán theo thuật toán PID. Bạn chuyển chế độ qua biến Mode trong khi hệ thống đang chạy mà không cần dừng chương trình.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "PID_Compact on the S7-1200",
      "points": [
        "Technology Object Architecture: Instantiated as an integrated block backed by an internal system Data Block (e.g. 'PID_Compact_1')",
        "Execution in Cyclic Interrupt (OB30): Guarantees strict deterministic execution at fixed sampling intervals (Ts); never call PID_Compact in OB1",
        "Input vs Input_PER: 'Input' accepts floating-point engineering units (e.g. 50.0 bar); 'Input_PER' accepts raw analog integer counts (%IW64) with integrated scaling",
        "Output vs Output_PER vs Output_PWM: Output (0.0–100.0% REAL), Output_PER (0–27648 integer for AQ), Output_PWM (digital pulse train for heaters)",
        "Integral Anti-Windup Protection: Automatically clamps the integral accumulator when actuator limits (0% or 100%) are reached, eliminating saturation recovery delays",
        "Deadband Support: Configurable error deadband suppresses minor actuator adjustments when the error is within acceptable plant tolerances (e.g. ±0.5°C)",
        "Direct/Reverse Acting Direction: Direct-acting (cooling loop: output increases as PV rises above SP); Reverse-acting (heating loop: output increases as PV falls below SP)"
      ],
      "explain": "The Siemens S7-1200 provides the PID_Compact Technology Object: an industrial-grade, fully encapsulated closed-loop controller block implemented in firmware. PID_Compact executes inside a dedicated Cyclic Interrupt Organization Block (OB30), guaranteeing that algorithm iterations execute at exact, jitter-free temporal intervals (e.g. Ts = 100 ms). The block provides flexible signal interfacing: Setpoint can be supplied as a floating-point REAL value (e.g. 65.0°C from an HMI); Process Variable can be connected either as an already-scaled engineering REAL value via the 'Input' pin, or directly as a raw 16-bit analog integer via the 'Input_PER' pin (e.g. %IW64 directly from an RTD or 4–20mA transmitter). When using Input_PER, the Technology Object automatically handles analog quantization and scaling using parameters defined in its graphical configuration wizard. For manipulated outputs, PID_Compact supports three simultaneous formats: 'Output' (continuous 0.0% to 100.0% REAL for internal logic), 'Output_PER' (raw integer 0 to 27648 for analog output modules %QW64 driving control valves), and 'Output_PWM' (time-proportioned duty cycle for solid-state relays controlling industrial heaters).",
      "figure": {
        "src": "/images/slides/10-closed-loop-pid/PLC___Slide__036.png",
        "caption": "Figure 10.2: Siemens PID_Compact Technology Object Architecture, Input_PER & Anti-Windup Clamping"
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

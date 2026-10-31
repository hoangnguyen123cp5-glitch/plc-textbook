import { TopicContent } from '@/types/content';

export default {
  "slug": "comparison",
  "sourceRef": "3.2",
  "title": "Comparison Functions",
  "durationMinutes": 7,
  "summary": "Comparison instructions evaluate numerical relationships between two values of identical data type and pass virtual ladder power flow if the mathematical condition is satisfied.",
  "body": [
    {
      "heading": "3.2 Comparison Functions",
      "text": "Comparison instructions evaluate numerical relationships between two values of identical data type and pass virtual ladder power flow if the mathematical condition is satisfied. TIA Portal provides six standard comparison contact blocks in LAD: Equal (==), Not Equal (<>), Greater Than (>), Greater Than or Equal (>=), Less Than (<), and Less Than or Equal (<=). During evaluation, input IN1 is compared against input IN2 (IN1 == IN2). In process automation, comparisons are used to trigger high-level alarms, interlock heating circuits when temperatures exceed thresholds, and synchronize multi-stage machines. When comparing floating-point REAL numbers, direct equality (==) should be avoided because rounding errors inherent in IEEE 754 floating-point arithmetic can cause numbers that are mathematically equal to differ by fractional bits in the lowest mantissa position. Instead, engineers implement an epsilon tolerance band: ABS(IN1 - IN2) < 0.001. Window comparators combine two comparisons in series (e.g. Value >= Min AND Value <= Max) to confirm that a process parameter is within safe operating limits.",
      "keyPoints": [
        "In-Line LAD Contact Blocks: Comparison instructions appear as contact boxes placed directly in the ladder rung power flow path",
        "Strict Type Consistency: Both comparison operands (IN1 and IN2) must share the identical data type (e.g. comparing an INT directly to a REAL causes a compiler syntax error)",
        "Equality Hazard with REALs: Due to binary floating-point representation, 1.0 / 3.0 * 3.0 may evaluate to 0.9999999 rather than 1.0000000; never use '==' on REAL variables",
        "Floating-Point Tolerance Band: Evaluate equality using absolute difference: ABS(RealA - RealB) <= Epsilon",
        "Window Comparator: Placing a '>=' contact in series with a '<=' contact validates that a process variable remains inside a defined deadband",
        "Multi-Condition Branching: Multiple comparison contacts placed in parallel branches execute conditional branching based on operating modes"
      ],
      "note": "When comparing analog sensor signals (e.g. tank level or temperature), always implement a software hysteresis deadband (e.g. 2%) between the alarm trip point and the clear point to prevent rapid chattering of alarm relays when the signal hovers near the threshold."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/04-numeric-operations/04-num_carved_029.png",
      "caption": "Figure 4.2: Relational Comparison Contact Blocks (==, <>, >=, <=) and Window Comparators in LAD"
    }
  ],
  "quiz": [
    {
      "q": "How is a range/window comparison (e.g. 10.0 <= Temperature <= 50.0) implemented in Ladder logic?",
      "options": [
        "By placing two comparison contacts (>= 10.0 and <= 50.0) in series",
        "By placing two comparison contacts in parallel",
        "By using a Math ADD block",
        "By using a SHL instruction"
      ],
      "answer": 0,
      "explain": "Series contacts represent Boolean AND: power flows only when the value is both greater than/equal to MIN AND less than/equal to MAX."
    }
  ],
  "narration": {
    "vi": "Lệnh so sánh CMP cho phép so sánh hai giá trị số và trả về kết quả BOOL. Các phép so sánh gồm bằng, khác, lớn hơn, nhỏ hơn, lớn hơn hoặc bằng, và nhỏ hơn hoặc bằng. Trong LAD, khối CMP đặt trên nhánh như một tiếp điểm — nếu điều kiện đúng thì cho dòng điện đi qua. Ví dụ dùng CMP để kiểm tra nhiệt độ có vượt ngưỡng 80 độ chưa và tự động bật quạt làm mát.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Comparison Functions",
      "points": [
        "In-Line LAD Contact Blocks: Comparison instructions appear as contact boxes placed directly in the ladder rung power flow path",
        "Strict Type Consistency: Both comparison operands (IN1 and IN2) must share the identical data type (e.g. comparing an INT directly to a REAL causes a compiler syntax error)",
        "Equality Hazard with REALs: Due to binary floating-point representation, 1.0 / 3.0 * 3.0 may evaluate to 0.9999999 rather than 1.0000000; never use '==' on REAL variables",
        "Floating-Point Tolerance Band: Evaluate equality using absolute difference: ABS(RealA - RealB) <= Epsilon",
        "Window Comparator: Placing a '>=' contact in series with a '<=' contact validates that a process variable remains inside a defined deadband",
        "Multi-Condition Branching: Multiple comparison contacts placed in parallel branches execute conditional branching based on operating modes"
      ],
      "explain": "Comparison instructions evaluate numerical relationships between two values of identical data type and pass virtual ladder power flow if the mathematical condition is satisfied. TIA Portal provides six standard comparison contact blocks in LAD: Equal (==), Not Equal (<>), Greater Than (>), Greater Than or Equal (>=), Less Than (<), and Less Than or Equal (<=). During evaluation, input IN1 is compared against input IN2 (IN1 == IN2). In process automation, comparisons are used to trigger high-level alarms, interlock heating circuits when temperatures exceed thresholds, and synchronize multi-stage machines. When comparing floating-point REAL numbers, direct equality (==) should be avoided because rounding errors inherent in IEEE 754 floating-point arithmetic can cause numbers that are mathematically equal to differ by fractional bits in the lowest mantissa position. Instead, engineers implement an epsilon tolerance band: ABS(IN1 - IN2) < 0.001. Window comparators combine two comparisons in series (e.g. Value >= Min AND Value <= Max) to confirm that a process parameter is within safe operating limits.",
      "figure": {
        "src": "/images/slides/04-numeric-operations/04-num_carved_029.png",
        "caption": "Figure 4.2: Relational Comparison Contact Blocks (==, <>, >=, <=) and Window Comparators in LAD"
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

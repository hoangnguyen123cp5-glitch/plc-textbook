import { TopicContent } from '@/types/content';

export default {
  "slug": "math-functions",
  "sourceRef": "3.4",
  "title": "Arithmetic Functions",
  "durationMinutes": 9,
  "summary": "The S7-1200 instruction set includes full mathematical capabilities for integer and floating-point computations: ADD (Addition), SUB (Subtraction), MUL (Multiplication), DIV (Division), and MOD (Mo...",
  "body": [
    {
      "heading": "3.4 Arithmetic Functions",
      "text": "The S7-1200 instruction set includes full mathematical capabilities for integer and floating-point computations: ADD (Addition), SUB (Subtraction), MUL (Multiplication), DIV (Division), and MOD (Modulo / Integer Division Remainder). Arithmetic blocks execute when enabled (EN = TRUE) and pass power to the output (ENO = TRUE) if the calculation completes successfully without numeric exceptions. In addition to basic two-operand blocks, TIA Portal provides the compound CALCULATE instruction, which allows engineers to write complete algebraic expressions (e.g. ((IN1 * 1.8) + 32.0) for Celsius-to-Fahrenheit conversion) within a single ladder box. Arithmetic operations are susceptible to two major industrial runtime errors: Numeric Overflow (when a calculation exceeds the maximum representable limit of the target data type) and Division by Zero (attempting to divide by a variable that equals zero). If an integer divides by zero, the CPU asserts the overflow status flag and, depending on configuration, can fault the controller into STOP mode unless protected by upstream logic.",
      "keyPoints": [
        "Elementary Math Blocks: ADD (IN1 + IN2), SUB (IN1 - IN2), MUL (IN1 * IN2), DIV (IN1 / IN2), MOD (remainder of integer division)",
        "CALCULATE Block: Evaluates multi-term mathematical formulas directly in LAD without chaining dozens of individual math boxes",
        "Data Type Promotion: When multiplying two 16-bit INTs, the product can exceed 32,767; convert operands to 32-bit DINT prior to multiplication to prevent overflow",
        "Division by Zero Protection: Always precede a DIV instruction with a comparison contact verifying that the divisor is not equal to zero (Divisor <> 0)",
        "ENO Enable Output Behavior: ENO evaluates FALSE if a mathematical fault occurs (overflow, underflow, NaN, division by zero), allowing safe fault handling",
        "Rounding Functions: ROUND (rounds floating point to nearest integer), TRUNC (truncates fractional digits toward zero), CEIL (rounds up), FLOOR (rounds down)",
        "Advanced Math Blocks: SQR (square), SQRT (square root), LN (natural logarithm), EXP (exponential), and trigonometric functions (SIN, COS, TAN)"
      ],
      "note": "Never perform division without a safety interlock! In LAD, place a contact [ Divisor <> 0.0 ] immediately before the DIV block. If a field sensor fails and outputs zero, an unprotected DIV block will trigger a CPU math exception and drop the line offline."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/04-numeric-operations/04-num_carved_022.png",
      "caption": "Figure 4.4: Mathematical Execution Blocks (ADD, SUB, MUL, DIV, MOD) and CALCULATE Formula Evaluator"
    }
  ],
  "quiz": [
    {
      "q": "What occurs if an integer division (DIV) instruction executes with an input value of 0 in the divisor?",
      "options": [
        "The result is safely set to 9999",
        "A division-by-zero math fault triggers; without an error handler, the CPU may enter STOP mode",
        "The CPU ignores the instruction",
        "The divisor is automatically incremented to 1"
      ],
      "answer": 1,
      "explain": "Division by zero is an illegal arithmetic condition that sets system error flags and can halt CPU execution."
    }
  ],
  "narration": {
    "vi": "S7-1200 hỗ trợ đầy đủ các phép tính số học trong LAD. ADD cộng, SUB trừ, MUL nhân, DIV chia và MOD lấy phần dư. Các khối này hoạt động với nhiều kiểu dữ liệu khác nhau gồm INT, DINT và REAL. Lưu ý khi chia số nguyên, kết quả bị cắt cụt phần thập phân. Nếu cần độ chính xác, hãy chuyển sang REAL trước khi tính. Overflow khi tính toán sẽ kích bit lỗi trong thanh ghi trạng thái.",
    "durationSec": 30,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Arithmetic Functions",
      "points": [
        "Elementary Math Blocks: ADD (IN1 + IN2), SUB (IN1 - IN2), MUL (IN1 * IN2), DIV (IN1 / IN2), MOD (remainder of integer division)",
        "CALCULATE Block: Evaluates multi-term mathematical formulas directly in LAD without chaining dozens of individual math boxes",
        "Data Type Promotion: When multiplying two 16-bit INTs, the product can exceed 32,767; convert operands to 32-bit DINT prior to multiplication to prevent overflow",
        "Division by Zero Protection: Always precede a DIV instruction with a comparison contact verifying that the divisor is not equal to zero (Divisor <> 0)",
        "ENO Enable Output Behavior: ENO evaluates FALSE if a mathematical fault occurs (overflow, underflow, NaN, division by zero), allowing safe fault handling",
        "Rounding Functions: ROUND (rounds floating point to nearest integer), TRUNC (truncates fractional digits toward zero), CEIL (rounds up), FLOOR (rounds down)",
        "Advanced Math Blocks: SQR (square), SQRT (square root), LN (natural logarithm), EXP (exponential), and trigonometric functions (SIN, COS, TAN)"
      ],
      "explain": "The S7-1200 instruction set includes full mathematical capabilities for integer and floating-point computations: ADD (Addition), SUB (Subtraction), MUL (Multiplication), DIV (Division), and MOD (Modulo / Integer Division Remainder). Arithmetic blocks execute when enabled (EN = TRUE) and pass power to the output (ENO = TRUE) if the calculation completes successfully without numeric exceptions. In addition to basic two-operand blocks, TIA Portal provides the compound CALCULATE instruction, which allows engineers to write complete algebraic expressions (e.g. ((IN1 * 1.8) + 32.0) for Celsius-to-Fahrenheit conversion) within a single ladder box. Arithmetic operations are susceptible to two major industrial runtime errors: Numeric Overflow (when a calculation exceeds the maximum representable limit of the target data type) and Division by Zero (attempting to divide by a variable that equals zero). If an integer divides by zero, the CPU asserts the overflow status flag and, depending on configuration, can fault the controller into STOP mode unless protected by upstream logic.",
      "figure": {
        "src": "/images/slides/04-numeric-operations/04-num_carved_022.png",
        "caption": "Figure 4.4: Mathematical Execution Blocks (ADD, SUB, MUL, DIV, MOD) and CALCULATE Formula Evaluator"
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

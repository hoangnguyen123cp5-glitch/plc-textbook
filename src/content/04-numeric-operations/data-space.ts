import { TopicContent } from '@/types/content';

export default {
  "slug": "data-space",
  "sourceRef": "3.1",
  "title": "Data Space and Data Types",
  "durationMinutes": 9,
  "summary": "Microprocessors in industrial PLCs manipulate data represented in standardized bit lengths defined by IEC 61131-3.",
  "body": [
    {
      "heading": "3.1 Data Space and Data Types",
      "text": "Microprocessors in industrial PLCs manipulate data represented in standardized bit lengths defined by IEC 61131-3. Bit strings include BYTE (8 bits, 0 to 255 hex 16#FF), WORD (16 bits, 0 to 65,535 hex 16#FFFF), and DWORD (32 bits, hex 16#FFFF_FFFF), used primarily for raw hardware bitmasks and communication telegrams. Signed integers represent numeric quantities using two's complement notation: SINT (8-bit, -128 to +127), INT (16-bit, -32,768 to +32,767), and DINT (32-bit, -2,147,483,648 to +2,147,483,647). Continuous process variables (temperature, flow, pressure) utilize REAL (32-bit floating point complying with IEEE 754), which allocates 1 sign bit, an 8-bit exponent, and a 23-bit mantissa to represent values from ±1.175495e-38 to ±3.402823e+38. Memory in the S7-1200 is addressed by area prefix and byte offset: %MB10 (Memory Byte 10), %MW10 (Memory Word occupying bytes 10 and 11, where %MB10 is the high byte and %MB11 is the low byte in Big-Endian format), and %MD10 (Memory Double-word occupying bytes 10 through 13). Overlapping memory addresses will cause silent data corruption.",
      "keyPoints": [
        "Bit String Types: BYTE (8-bit), WORD (16-bit), DWORD (32-bit), LWORD (64-bit); interpreted as raw hexadecimal bit patterns",
        "Signed Integer Types: SINT (8-bit), INT (16-bit), DINT (32-bit), LINT (64-bit); use two's complement for negative values",
        "Floating-Point REAL (32-bit): IEEE 754 standard representing fractional numbers with ~7 decimal digits of precision; format: 1.2345e+2",
        "Temporal Data Type (TIME): Stored internally as a signed 32-bit integer expressing time duration in milliseconds (e.g. T#2h45m)",
        "Big-Endian Memory Alignment: In S7-1200 standard memory, the most significant byte (MSB) is stored at the lowest byte memory address",
        "Address Overlap Hazard: Writing a 32-bit value to %MD10 overwrites bytes %MB10, %MB11, %MB12, and %MB13; %MW10 and %MW12 share this memory space",
        "Optimized vs Standard DBs: Modern S7-1200 Data Blocks default to 'Optimized block access', eliminating physical byte offsets and preventing address overlap"
      ],
      "note": "Always use 'Optimized block access' for new Data Blocks in TIA Portal. Optimized blocks allow the CPU compiler to arrange variables by memory alignment for maximum execution speed, prevent address overlapping errors, and support retain settings on individual variables."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/04-numeric-operations/04-num_carved_025.png",
      "caption": "Figure 4.1: IEC Elementary Data Types (Byte, Word, Int, Real) & S7-1200 Big-Endian Memory Alignment"
    }
  ],
  "quiz": [
    {
      "q": "How many bits and what numerical range is represented by an S7-1200 signed INT data type?",
      "options": [
        "8 bits (−128 to +127)",
        "16 bits (−32,768 to +32,767)",
        "32 bits (0 to 4,294,967,295)",
        "64 bits (IEEE Double)"
      ],
      "answer": 1,
      "explain": "A 16-bit signed INT uses two-complement representation spanning −32,768 to +32,767."
    }
  ],
  "narration": {
    "vi": "Trong mục này, chúng ta tìm hiểu vùng nhớ của PLC S7-1200. INT là số nguyên 16-bit, DINT là 32-bit, REAL là số thực dấu phẩy động 32-bit. WORD và DWORD là kiểu không dấu thường dùng để xử lý bit. Ngoài ra còn có BOOL cho từng bit, BYTE cho tám bit, và TIME cho khoảng thời gian. Chọn đúng kiểu dữ liệu ngay từ đầu giúp tránh lỗi tràn số và tiết kiệm bộ nhớ PLC.",
    "durationSec": 29,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "slides": [
    {
      "kind": "concept",
      "title": "Data Space and Data Types",
      "points": [
        "Bit String Types: BYTE (8-bit), WORD (16-bit), DWORD (32-bit), LWORD (64-bit); interpreted as raw hexadecimal bit patterns",
        "Signed Integer Types: SINT (8-bit), INT (16-bit), DINT (32-bit), LINT (64-bit); use two's complement for negative values",
        "Floating-Point REAL (32-bit): IEEE 754 standard representing fractional numbers with ~7 decimal digits of precision; format: 1.2345e+2",
        "Temporal Data Type (TIME): Stored internally as a signed 32-bit integer expressing time duration in milliseconds (e.g. T#2h45m)",
        "Big-Endian Memory Alignment: In S7-1200 standard memory, the most significant byte (MSB) is stored at the lowest byte memory address",
        "Address Overlap Hazard: Writing a 32-bit value to %MD10 overwrites bytes %MB10, %MB11, %MB12, and %MB13; %MW10 and %MW12 share this memory space",
        "Optimized vs Standard DBs: Modern S7-1200 Data Blocks default to 'Optimized block access', eliminating physical byte offsets and preventing address overlap"
      ],
      "explain": "Microprocessors in industrial PLCs manipulate data represented in standardized bit lengths defined by IEC 61131-3. Bit strings include BYTE (8 bits, 0 to 255 hex 16#FF), WORD (16 bits, 0 to 65,535 hex 16#FFFF), and DWORD (32 bits, hex 16#FFFF_FFFF), used primarily for raw hardware bitmasks and communication telegrams. Signed integers represent numeric quantities using two's complement notation: SINT (8-bit, -128 to +127), INT (16-bit, -32,768 to +32,767), and DINT (32-bit, -2,147,483,648 to +2,147,483,647). Continuous process variables (temperature, flow, pressure) utilize REAL (32-bit floating point complying with IEEE 754), which allocates 1 sign bit, an 8-bit exponent, and a 23-bit mantissa to represent values from ±1.175495e-38 to ±3.402823e+38. Memory in the S7-1200 is addressed by area prefix and byte offset: %MB10 (Memory Byte 10), %MW10 (Memory Word occupying bytes 10 and 11, where %MB10 is the high byte and %MB11 is the low byte in Big-Endian format), and %MD10 (Memory Double-word occupying bytes 10 through 13). Overlapping memory addresses will cause silent data corruption.",
      "figure": {
        "src": "/images/slides/04-numeric-operations/04-num_carved_025.png",
        "caption": "Figure 4.1: IEC Elementary Data Types (Byte, Word, Int, Real) & S7-1200 Big-Endian Memory Alignment"
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

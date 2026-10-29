import { TopicContent } from '@/types/content';

export default {
  "slug": "rotate-shift",
  "sourceRef": "3.3",
  "title": "Rotate and Shift Functions",
  "durationMinutes": 8,
  "summary": "Shift and rotate instructions manipulate the individual bit positions within BYTE, WORD, or DWORD registers.",
  "body": [
    {
      "heading": "3.3 Rotate and Shift Functions",
      "text": "Shift and rotate instructions manipulate the individual bit positions within BYTE, WORD, or DWORD registers. Shift Left (SHL) shifts bits toward the most significant bit (MSB) by n positions, filling evacuated low-order bit positions with binary zeros; each 1-bit left shift effectively multiplies an unsigned integer by 2. Shift Right (SHR) shifts bits toward the least significant bit (LSB) by n positions, filling evacuated high-order bits with zeros; each 1-bit right shift divides an unsigned integer by 2. Rotate Left (ROL) and Rotate Right (ROR) operate as closed circular registers: bits pushed out of one end are looped back into the opposite end without bit loss. In manufacturing, shift registers are widely used for parts tracking along indexed conveyor lines: a binary shift register represents consecutive conveyor pockets. When an inspection camera detects a defective part at Station 1, it shifts a logic '1' into bit 0. As the conveyor advances, an encoder proximity pulse triggers an SHL instruction, moving the defect bit down the register until it reaches the reject pusher station, which fires automatically.",
      "keyPoints": [
        "Shift Left (SHL): Shifts bit pattern left by n positions; vacated low-order bits filled with 0; equivalent to multiplying unsigned values by 2^n",
        "Shift Right (SHR): Shifts bit pattern right by n positions; vacated high-order bits filled with 0; equivalent to integer division by 2^n",
        "Rotate Left (ROL): Circular shift left; bit shifted out of MSB re-enters at LSB position; no bits are destroyed",
        "Rotate Right (ROR): Circular shift right; bit shifted out of LSB re-enters at MSB position",
        "Parts Tracking Shift Register: Each bit represents a mechanical station along a transfer line; clock pulses advance the register synchronously with conveyor motion",
        "Bit Masking Operations: Combining bit shifts with logical AND/OR operations allows engineers to pack and unpack multiple binary flags into single communication words",
        "Byte Swapping (SWAP): Reverses the byte order within a WORD or DWORD to convert between Big-Endian and Little-Endian network telegrams"
      ],
      "note": "Always trigger SHL and SHR instructions using a one-shot rising edge pulse (P_TRIG)! If a shift instruction is energized with a continuous TRUE signal, it will execute on every single PLC scan cycle, shifting all bits to zero within a few milliseconds."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/04-numeric-operations/04-num_carved_026.png",
      "caption": "Figure 4.3: Bit-Shift (SHL/SHR) and Rotate (ROL/ROR) Registers for Conveyor Item Tracking"
    }
  ],
  "quiz": [
    {
      "q": "What bit instruction is typically used to track parts moving along a multi-station index table or conveyor belt?",
      "options": [
        "SHL / SHR (Shift Left / Right) register bit tracking",
        "DTL real-time clock",
        "SQRT math block",
        "TOF timer"
      ],
      "answer": 0,
      "explain": "Shift registers (SHL/SHR) shift bits synchronously with conveyor index pulses, tracking part inspection results across workstations."
    }
  ],
  "narration": {
    "vi": "Trong mục này ta học lệnh dịch và quay bit. SHL dịch trái, SHR dịch phải — bit tràn ra ngoài sẽ mất và được bù bằng bit không. ROL quay trái, ROR quay phải — bit tràn được đưa vào đầu bên kia thay vì mất đi. Các lệnh này thường dùng để điều khiển đèn LED dạng quét tuần tự hoặc trích xuất các trường bit trong một từ dữ liệu nhận từ thiết bị ngoại vi.",
    "durationSec": 28,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

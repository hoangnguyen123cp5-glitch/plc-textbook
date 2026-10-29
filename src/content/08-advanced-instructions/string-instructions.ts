import { TopicContent } from '@/types/content';

export default {
  "slug": "string-instructions",
  "sourceRef": "3.2",
  "title": "String and Character Instructions",
  "durationMinutes": 12,
  "summary": "Modern automated manufacturing requires interfacing with peripheral devices that transmit textual information: handheld barcode scanners, optical vision inspection cameras, RFID tag transponders, l...",
  "body": [
    {
      "heading": "3.2 String and Character Instructions",
      "text": "Modern automated manufacturing requires interfacing with peripheral devices that transmit textual information: handheld barcode scanners, optical vision inspection cameras, RFID tag transponders, laser marking printers, and weigh-scale indicators. TIA Portal handles text data via the CHAR (8-bit ASCII), WCHAR (16-bit Unicode), STRING, and WSTRING data types. A standard STRING variable in S7-1200 occupies n+2 bytes of memory: Byte 0 defines the maximum declared string capacity (up to 254 characters); Byte 1 defines the current actual length of valid text; Bytes 2 through n+1 store the ASCII character bytes. TIA Portal provides a rich suite of string processing instructions: CONCAT combines two strings into one; LEFT extracts n characters from the beginning of a string; RIGHT extracts n characters from the end; MID extracts a substring from any specified character offset; LEN returns the actual character count; and FIND searches for the first occurrence of a substring within a text string. To convert between numeric values and text strings, the VAL_STRG instruction converts an INT or REAL into an ASCII string (e.g. for printing on a packaging label), while STRG_VAL parses an incoming barcode string into a numeric part number.",
      "keyPoints": [
        "STRING Memory Architecture: Allocated as max_length (Byte 0) + current_length (Byte 1) + ASCII character bytes; default capacity is 254 characters",
        "CONCAT Block: Concatenates two source strings (IN1 + IN2) into a single destination string; truncates if destination capacity is exceeded",
        "Substring Extraction: LEFT (extracts leftmost n characters), RIGHT (extracts rightmost n characters), MID (extracts n characters starting at offset p)",
        "Search and Inspection: LEN (returns current string length), FIND (searches for sub-string; returns 1-based character position, or 0 if not found)",
        "VAL_STRG (Value to String): Converts numeric INT/REAL variables into formatted ASCII strings with configurable decimal places and sign characters",
        "STRG_VAL (String to Value): Parses incoming ASCII text strings into numeric integer or floating-point variables for PLC logic evaluation",
        "DELETE and INSERT Blocks: Dynamically delete character spans or insert prefixes/suffixes into serialized production tracking strings"
      ],
      "note": "Remember that STRING manipulation instructions consume significant CPU processing time and memory bandwidth! Never execute string search and concatenation blocks cyclically on every single scan. Always trigger string instructions on the rising edge of a communication receive flag (e.g. when a barcode scanner successfully finishes scanning)."
    }
  ],
  "figures": [
    {
      "src": "/images/slides/08-advanced-instructions/PLC___Slide__016.jpg",
      "caption": "Figure 8.2: ASCII String Data Architecture and Substring Manipulation (CONCAT, MID, VAL_STRG)"
    }
  ],
  "quiz": [
    {
      "q": "In Siemens S7 string architecture, what is stored in Byte 0 and Byte 1 of a STRING variable?",
      "options": [
        "The first two ASCII characters",
        "Byte 0: Maximum declared length; Byte 1: Current actual string length",
        "A checksum and parity bit",
        "The CPU serial number"
      ],
      "answer": 1,
      "explain": "Siemens strings use a 2-byte header: the first byte defines allocated capacity, and the second byte holds the actual character count."
    }
  ],
  "narration": {
    "vi": "S7-1200 hỗ trợ kiểu dữ liệu STRING để lưu chuỗi ký tự tối đa hai trăm năm mươi tư ký tự. Lệnh LEN trả về độ dài thực của chuỗi. CONCAT nối hai chuỗi lại với nhau. S_CONV chuyển đổi giữa STRING và các kiểu số. Các lệnh này thường dùng khi PLC cần giao tiếp với màn hình HMI, máy in nhãn hoặc thiết bị đọc mã vạch. Xử lý chuỗi tốn nhiều thời gian hơn xử lý số nên tránh dùng trong vòng lặp tốc độ cao.",
    "durationSec": 31,
    "by": "ai",
    "updatedAt": "2026-10-19"
  },
  "status": "review"
} satisfies TopicContent;

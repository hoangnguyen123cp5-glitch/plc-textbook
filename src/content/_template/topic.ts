/**
 * FILE MẪU CHUYÊN ĐỀ (TOPIC TEMPLATE)
 *
 * Cách dùng nhanh:
 *   npm run new:topic -- <lesson-slug> <topic-slug> "<Tiêu đề chuyên đề>"
 *
 * Hoặc sao chép file này sang: src/content/<lesson-slug>/<topic-slug>.ts
 * rồi thêm '<topic-slug>' vào mảng topicOrder trong src/content/<lesson-slug>/_lesson.ts
 * và chạy: npm run build:content-index && npm run check:content
 */

import { TopicContent } from '@/types/content';

export default {
  // [BẮT BUỘC] Định danh URL của topic — PHẢI trùng chính xác với tên file (không có .ts)
  slug: 'topic-template',

  // [TUỲ CHỌN] Số mục trên tập slide gốc nếu khác số thứ tự hiển thị trên web (vd: '1.3')
  sourceRef: '1.1',

  // [BẮT BUỘC] Tiêu đề chuyên đề (KHÔNG ghi số thứ tự đầu dòng vì web tự đánh số x.y)
  title: 'Tiêu đề chuyên đề mẫu',

  // [BẮT BUỘC] Thời lượng học dự kiến (tính bằng phút)
  durationMinutes: 10,

  // [BẮT BUỘC khi published] Tóm tắt ngắn 1–2 câu (≤ 200 ký tự), hiển thị ở mục lục bài học
  summary: 'Tóm tắt ngắn gọn 1–2 câu nêu trọng tâm kỹ thuật của chuyên đề này.',

  // [TUỲ CHỌN] Chuẩn đầu ra riêng của chuyên đề (nếu không có thì slide mục tiêu tự ẩn)
  objectives: [
    'Phân tích được nguyên lý hoạt động và sơ đồ đấu nối thực tế trên PLC S7-1200',
    'Viết và kiểm thử được đoạn chương trình điều khiển với địa chỉ vùng nhớ thật (%I0.0, %Q0.0)',
  ],

  // [BẮT BUỘC khi published] Nội dung lý thuyết chính, chia thành 3–5 đoạn ngắn giọng giảng viên
  body: [
    {
      // Tiêu đề phụ của đoạn (tuỳ chọn)
      heading: 'Nguyên lý hoạt động cơ bản',
      // Nội dung giải thích chi tiết, câu ngắn gọn, có ví dụ địa chỉ thật (%I0.0, %Q0.0, DB1...)
      text: 'Nội dung giải thích trực diện nguyên lý kỹ thuật. Tránh dùng từ ngữ phô trương. Luôn gắn với địa chỉ phần cứng cụ thể trên S7-1200 như ngõ vào số %I0.0 hoặc ngõ ra %Q0.0.',
      // Các ý chính tóm tắt dạng gạch đầu dòng (tuỳ chọn)
      keyPoints: [
        'Ngõ vào số (%I0.0): Nhận tín hiệu 24VDC từ nút nhấn hoặc cảm biến hiện trường',
        'Chu kỳ quét (scan cycle): Đọc PII → Thực thi OB1 → Cập nhật PIQ',
        'Ngõ ra số (%Q0.0): Cấp nguồn điều khiển cuộn hút khởi động từ hoặc van điện từ',
      ],
      // Lưu ý thực tế tại xưởng / cảnh báo an toàn điện (tuỳ chọn)
      note: 'Khi đấu nối tải cảm (cuộn hút rơ-le, van solenoid) vào ngõ ra transistor của CPU DC/DC/DC, bắt buộc lắp diode dập xung ngược để bảo vệ mạch bán dẫn.',
    },
  ],

  // [TUỲ CHỌN] Hình ảnh / sơ đồ kỹ thuật (đường dẫn tính từ thư mục public/, KHÔNG gồm basePath)
  // Chỉ khai báo những file ảnh ĐÃ TỒN TẠI thật trong public/images/...
  figures: [
    {
      src: '/images/diagrams/plc-scan-cycle.jpg',
      caption: 'Hình minh hoạ: Chu kỳ quét 4 bước của PLC và vùng nhớ ảnh quá trình (PII / PIQ)',
      alt: 'Sơ đồ chu kỳ quét PLC',
    },
  ],

  // [TUỲ CHỌN] Công thức tính toán kỹ thuật (hiển thị bằng KaTeX)
  formula: [
    {
      latex: 'e(t) = SP(t) - PV(t)',
      explain: 'Sai lệch điều khiển e(t) bằng hiệu số giữa giá trị đặt SP(t) và giá trị đo thực tế PV(t).',
    },
  ],

  // [TUỲ CHỌN] Tình huống thực tế tại nhà máy (Case Study)
  caseStudy: {
    title: 'Bài toán điều khiển thực tế tại dây chuyền sản xuất',
    context: 'Mô tả ngắn gọn bài toán công nghiệp, thông số vận hành và vai trò của PLC S7-1200 trong hệ thống.',
    hardware: [
      'Bộ điều khiển: Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC',
      'Cảm biến hiện trường: Cảm biến quang PNP 24VDC đấu vào %I0.0',
      'Cơ cấu chấp hành: Van điện từ 24VDC điều khiển qua %Q0.0',
    ],
    pitfall: 'Lỗi thường gặp khi lắp đặt, đấu dây hoặc lập trình ngoài thực tế và cách phòng tránh.',
  },

  // [TUỲ CHỌN — khuyến nghị ≥ 3 câu, đáp án đúng rải đều A/B/C/D] Câu hỏi trắc nghiệm kiểm tra nhanh
  quiz: [
    {
      q: 'Trong chu kỳ quét của PLC S7-1200, CPU đọc trạng thái ngõ vào vật lý vào vùng nhớ nào trước khi thực thi khối OB1?',
      options: [
        'Vùng nhớ ảnh ngõ vào PII (Process Image Input)',
        'Vùng nhớ ảnh ngõ ra PIQ (Process Image Output)',
        'Vùng nhớ Load Memory trên thẻ nhớ Flash',
        'Thanh ghi trạng thái đèn LED mặt trước CPU',
      ],
      answer: 0, // 0 = A, 1 = B, 2 = C, 3 = D
      explain: 'Đầu mỗi chu kỳ quét, CPU chụp trạng thái tức thời của các chân ngõ vào vật lý và lưu vào bảng PII để đảm bảo tính nhất quán dữ liệu trong suốt vòng quét.',
    },
    {
      q: 'Địa chỉ nào sau đây biểu diễn ngõ ra số thứ nhất trên mô-đun tích hợp của CPU S7-1200?',
      options: [
        '%I0.0',
        '%Q0.0',
        '%M0.0',
        '%IW64',
      ],
      answer: 1,
      explain: 'Ký hiệu %Q biểu diễn vùng nhớ ngõ ra (Output), byte 0, bit 0 tương ứng với chân ngõ ra số đầu tiên %Q0.0.',
    },
    {
      q: 'Vì sao không nên nối trực tiếp cuộn hút khởi động từ công suất lớn vào ngõ ra transistor 24VDC của PLC mà phải qua rơ-le trung gian?',
      options: [
        'Vì ngõ ra transistor chỉ xuất được tín hiệu truyền thông PROFINET',
        'Vì ngõ ra transistor không hoạt động được trong khối OB1',
        'Vì dòng tải định mức của mỗi chân transistor chỉ khoảng 0.5A và cần cách ly bảo vệ',
        'Vì rơ-le trung gian giúp tăng tốc độ xung PWM lên 100 kHz',
      ],
      answer: 2,
      explain: 'Ngõ ra transistor trên S7-1200 có dòng chịu tải tối đa 0.5A/kênh; dùng rơ-le trung gian giúp cách ly mạch điều khiển và đóng cắt tải công suất lớn an toàn.',
    },
  ],

  // [TUỲ CHỌN] Lời giảng thuyết minh cho chuyên đề
  narration: {
    vi: 'Trong mục này, chúng ta tìm hiểu nguyên lý hoạt động cốt lõi và cách đấu nối, lập trình trên PLC S7-1200.',
    durationSec: 25,
    by: 'human',
    updatedAt: '2026-10-30',
  },

  // [TUỲ CHỌN] Mốc thời gian bắt đầu (giây) trong video bài giảng của cả bài học
  // video: { startSec: 120 },

  // [TUỲ CHỌN] Mã component mô phỏng tương tác (nếu có)
  // simulator: 'S7RackExplorer',

  // [TUỲ CHỌN] Thứ tự các slide trình chiếu ('concept' | 'diagram' | 'practice' | 'quiz').
  // Nếu không khai báo, trang web sẽ tự động dựng slide từ body + figures + quiz.
  // slides: [
  //   { kind: 'concept', title: 'Nguyên lý hoạt động cơ bản', points: ['Ý 1', 'Ý 2'], explain: '...' },
  //   { kind: 'quiz', title: 'Kiểm tra nhanh', questionIndex: 0 },
  // ],

  // [BẮT BUỘC] Trạng thái chuyên đề:
  //   'draft'     — Đang soạn nháp (chỉ hiện khi chạy npm run dev, tự ẩn khi build production)
  //   'review'    — Đã có nội dung, đang chờ rà soát / bổ sung đủ câu hỏi quiz
  //   'published' — Đã nghiệm thu hoàn chỉnh (bắt buộc có summary, body và ≥ 3 câu quiz)
  status: 'draft',
} satisfies TopicContent;

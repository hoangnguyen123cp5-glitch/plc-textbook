// File mẫu cho 1 chuyên đề (topic) — mỗi chuyên đề là 1 file độc lập trong src/content/<lesson-slug>/<topic-slug>.ts
// Dùng lệnh: npm run new:topic -- <lesson-slug> <topic-slug> "<Topic Title>" để tạo nhanh từ mẫu này.
import type { TopicContent } from '@/types/content';

export default {
  // 1. Định danh bắt buộc: slug phải TRÙNG KHỚP với tên file (không tính đuôi .ts)
  slug: 'topic',

  // 2. Số mục gốc trên slide bài giảng (tuỳ chọn, ví dụ '1.3' nếu khác số thứ tự tự động)
  // sourceRef: '1.1',

  // 3. Tiêu đề chuyên đề hiển thị trên web (bằng tiếng Anh, KHÔNG ghi số thứ tự "1.1" ở đầu)
  title: 'Sample Topic Title',

  // 4. Thời lượng học dự kiến (phút)
  durationMinutes: 10,

  // 5. Tóm tắt ngắn (1–2 câu, ≤ 200 ký tự) hiển thị ở mục lục chương
  summary: 'Concise 1–2 sentence technical summary highlighting the core engineering concept of this topic.',

  // 6. Chuẩn đầu ra / mục tiêu riêng của chuyên đề (tuỳ chọn)
  objectives: [
    'Analyze the operating principle and hardware wiring topology on a Siemens S7-1200 PLC',
    'Implement and verify the control program using real S7-1200 memory addresses (%I0.0, %Q0.0, DB1)',
  ],

  // 7. Nội dung chính (body): chia thành các đoạn ngắn giọng giảng viên, có địa chỉ thật S7-1200
  body: [
    {
      // Tiêu đề phụ của đoạn (tuỳ chọn)
      heading: 'Core Operating Principle',
      // Nội dung đoạn văn (3–5 câu ngắn, giọng giảng viên, có ví dụ địa chỉ thật %I0.0, %Q0.0, DB1...)
      text: 'Explain the engineering principle directly and concisely. Always anchor explanations to real S7-1200 hardware addresses such as digital input %I0.0, digital output %Q0.0, memory bit %M0.0, or data block DB1.',
      // Các ý chính tóm tắt dạng gạch đầu dòng (tuỳ chọn)
      keyPoints: [
        'Digital Input (%I0.0): Receives 24VDC signal from field pushbuttons or proximity sensors',
        'Scan Cycle: Read PII -> Execute OB1 user program -> Update PIQ outputs',
        'Digital Output (%Q0.0): Drives 24VDC interposing relay or indicator lamp',
      ],
      // Ghi chú kỹ thuật hoặc lưu ý an toàn đóng khung (tuỳ chọn)
      note: 'Always verify the 24VDC power supply and common terminal (1M) wiring before switching the CPU to RUN.',
    },
  ],

  // 8. Hình ảnh minh hoạ / sơ đồ từ slide (tuỳ chọn)
  // Lưu ý: src là đường dẫn tính từ thư mục public/, KHÔNG bao gồm '/plc-textbook'
  // figures: [
  //   {
  //     src: '/images/slides/01-programmable-control/PLC_Slide_1__018.png',
  //     caption: 'Figure 1.1: Block diagram of an S7-1200 PLC control loop.',
  //     alt: 'S7-1200 PLC control loop block diagram',
  //   },
  // ],

  // 9. Công thức toán học / kỹ thuật hiển thị bằng KaTeX (tuỳ chọn)
  // formula: [
  //   {
  //     latex: 'I_{out} = \\frac{I_{max} - I_{min}}{27648} \\times N_{raw} + I_{min}',
  //     explain: 'Linear scaling formula converting raw ADC integer (0..27648) to a 4–20 mA analog signal.',
  //   },
  // ],

  // 10. Tình huống thực tế tại nhà máy / trạm thực hành (tuỳ chọn)
  // caseStudy: {
  //   title: 'Conveyor Interlock Control using S7-1200',
  //   context: 'A packaging line requires starting conveyor motor %Q0.0 when start button %I0.0 is pressed and stopping immediately when overload relay %I0.1 (NC) trips.',
  //   hardware: ['CPU 1214C DC/DC/DC', '24VDC Contactor with Flyback Diode', 'Omron E3Z Photoelectric Sensor'],
  //   pitfall: 'Wiring the E-Stop or overload contact as NO instead of NC fails to stop the motor if a control wire breaks.',
  // },

  // 11. Câu hỏi trắc nghiệm kiểm tra nhanh (khuyến nghị ≥ 3–4 câu, rải đều đáp án A–D)
  quiz: [
    {
      q: 'On a Siemens S7-1200 PLC, which address represents the first onboard digital input bit?',
      options: [
        '%I0.0',
        '%Q0.0',
        '%M0.0',
        '%IW64',
      ],
      answer: 0, // Chỉ số đáp án đúng (0 = A, 1 = B, 2 = C, 3 = D)
      explain: '%I0.0 is the first bit of byte 0 in the Process Image Input (PII) area.',
    },
    {
      q: 'During which step of the S7-1200 scan cycle are physical output terminals updated from the Process Image Output (PIQ)?',
      options: [
        'Before reading physical inputs into PII',
        'After OB1 program execution completes',
        'Only when an hardware interrupt OB40 triggers',
        'Only during CPU transition from STOP to RUN',
      ],
      answer: 1,
      explain: 'At the end of each scan cycle, after OB1 finishes executing, the CPU writes the PIQ table to the physical output channels.',
    },
    {
      q: 'Which organization block serves as the main cyclic user program in a Siemens S7-1200 project?',
      options: [
        'OB100 (Startup)',
        'OB30 (Cyclic Interrupt)',
        'OB1 (Main Program Sweep)',
        'OB82 (Diagnostic Interrupt)',
      ],
      answer: 2,
      explain: 'OB1 is executed cyclically by the S7-1200 operating system as the main program loop.',
    },
  ],

  // 12. Lời giảng thuyết minh cho chế độ trình chiếu (tuỳ chọn)
  // narration: {
  //   vi: 'Trong mục này, chúng ta cùng phân tích nguyên lý hoạt động và cách đấu nối thực tế trên PLC S7-1200.',
  //   durationSec: 25,
  //   by: 'human',
  //   updatedAt: '2026-10-31',
  // },

  // 13. Mốc thời gian bắt đầu trong video bài giảng của chương (tuỳ chọn, tính bằng giây)
  // video: { startSec: 120 },

  // 14. Khoá định danh component mô phỏng tương tác nếu có (tuỳ chọn)
  // simulator: 'scan-cycle',

  // 15. Danh sách slide trình chiếu (tuỳ chọn; nếu bỏ trống trang sẽ tự dựng từ body + quiz)
  // slides: [
  //   {
  //     kind: 'concept',
  //     title: 'Core Operating Principle',
  //     points: [
  //       'Read inputs into PII (%I0.0)',
  //       'Execute user logic in OB1',
  //       'Write PIQ to physical outputs (%Q0.0)',
  //     ],
  //     explain: 'The CPU repeats the scan cycle continuously in RUN mode.',
  //   },
  //   {
  //     kind: 'quiz',
  //     title: 'Quick Check',
  //     questionIndex: 0,
  //   },
  // ],

  // 16. Trạng thái xuất bản:
  // - 'draft': đang soạn, ẩn khi build production
  // - 'review': hiện trên web để duyệt
  // - 'published': đã nghiệm thu đầy đủ (bắt buộc có summary, body, quiz ≥ 3 câu, không còn TODO)
  status: 'draft',
} satisfies TopicContent;

/**
 * Narration — Bài 9: High-Speed Counting & Motion Control
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 09-high-speed-counting
 *    → In ra danh sách topicSlug chưa có narration
 * 2. Giao cho AI ĐÚNG những slug đó (copy-paste output)
 * 3. AI trả về → paste vào đây → commit
 *
 * ── Quy tắc viết lời nói ──────────────────────────────────────────────
 * - Câu ngắn, rõ ràng, phù hợp nói chuyện (không phải văn viết)
 * - Không dùng dấu gạch đầu dòng trong text (đây là lời NÓI)
 * - Thời lượng tham khảo: ~130 từ/phút tiếng Việt
 * - Bắt đầu bằng "Trong mục này..." hoặc tên chủ đề
 */

import type { LessonNarration } from './index';

const narration: LessonNarration = {
  lessonSlug: '09-high-speed-counting',
  topics: {

    'encoder-basics': {
      vi: 'Encoder tăng dần là cảm biến vị trí phổ biến nhất trong tự động hóa. Nó tạo ra hai kênh xung lệch pha 90 độ, gọi là A và B, để PLC biết chiều quay. Kênh Z là xung zero — xuất hiện đúng một lần mỗi vòng, dùng để căn chỉnh điểm gốc. Độ phân giải thường tính bằng xung mỗi vòng, ví dụ 1000 PPR nghĩa là mỗi vòng có 1000 xung.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'high-speed-counter': {
      vi: 'Trong mục này, chúng ta cấu hình bộ đếm tốc độ cao — HSC — trong TIA Portal. CPU S7-1200 tích hợp sẵn sáu HSC, đếm được tới 100 kHz. Bạn khai báo HSC trong Device Configuration, chọn chế độ đếm và gán chân vào. Instruction CTRL_HSC trong chương trình cho phép reset giá trị đếm, thay giá trị so sánh, hoặc bật tắt HSC ngay khi đang chạy.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'pwm-output': {
      vi: 'PWM là tín hiệu xung vuông với tần số cố định nhưng độ rộng xung thay đổi được. Duty cycle càng cao thì thiết bị nhận càng nhiều năng lượng. S7-1200 hỗ trợ PWM trực tiếp trên ngõ ra transistor. Bạn kích hoạt trong Device Configuration, rồi dùng instruction CTRL_PWM để thay đổi duty cycle từ chương trình PLC mà không cần dừng xung.',
      duration: 28,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'motion-control': {
      vi: 'Motion Control trong TIA Portal dùng đối tượng Axis để đại diện cho một trục chuyển động. Đầu tiên bạn tạo Axis object và liên kết với xung PTO hoặc drive. Lệnh MC_Power bật trục, MC_MoveAbsolute điều khiển vị trí tuyệt đối. Tất cả lệnh motion đều là Function Block, hoạt động bất đồng bộ — bạn theo dõi trạng thái qua các bit Done, Busy, Error.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'analog-in-motion': {
      vi: 'Trong ứng dụng motion control, tín hiệu analog thường dùng để đặt tốc độ hoặc lực. Ví dụ, joystick 0–10V có thể ánh xạ sang tốc độ 0–3000 vòng mỗi phút. PLC đọc giá trị analog qua module AI, chuẩn hóa về đơn vị kỹ thuật, rồi truyền xuống drive. Điều quan trọng là lọc nhiễu và giới hạn tốc độ thay đổi để tránh giật cơ học.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

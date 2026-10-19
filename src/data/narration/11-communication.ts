/**
 * Narration — Bài 11: PLC Communication
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 11-communication
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
  lessonSlug: '11-communication',
  topics: {

    'point-to-point': {
      vi: 'Truyền thông điểm-điểm là kết nối trực tiếp giữa hai thiết bị qua cáp serial. RS232 dùng trong khoảng cách ngắn, RS485 đi được vài trăm mét và hỗ trợ nhiều thiết bị trên cùng một đường dây. Modbus RTU và giao thức USS của Siemens đều chạy trên nền RS485. Trong TIA Portal, bạn dùng instruction Send_P2P và Receive_P2P để trao đổi dữ liệu với biến tần hoặc thiết bị đo lường.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'profinet-profibus': {
      vi: 'PROFIBUS-DP là chuẩn trường truyền thống của Siemens, dùng cáp hai dây xoắn, tốc độ tối đa 12 Mbps. PROFINET là thế hệ kế tiếp chạy trên Ethernet công nghiệp, nhanh hơn và hỗ trợ đến mức độ thời gian thực IRT. Trong TIA Portal, bạn kéo thả thiết bị vào Network View, gán địa chỉ, rồi TIA tự sinh cấu hình truyền thông. Không cần lập trình thêm cho dữ liệu I/O chu kỳ.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

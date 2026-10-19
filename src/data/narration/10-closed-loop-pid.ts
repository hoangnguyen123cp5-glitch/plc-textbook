/**
 * Narration — Bài 10: Closed-Loop PID Control
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 10-closed-loop-pid
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
  lessonSlug: '10-closed-loop-pid',
  topics: {

    'closed-loop-design': {
      vi: 'Vòng kín nghĩa là hệ thống tự đo kết quả của chính mình và điều chỉnh liên tục. Cảm biến đo giá trị thực, bộ điều khiển tính sai lệch so với giá trị đặt, rồi ra lệnh điều chỉnh thiết bị chấp hành. Để thiết kế tốt, bạn cần hiểu đặc tính hệ thống — độ trễ, thời gian đáp ứng, độ khuếch đại — vì những thông số đó quyết định bộ PID cần chỉnh như thế nào.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'pid-compact': {
      vi: 'PID_Compact là Function Block tích hợp sẵn trong TIA Portal, hỗ trợ ba chế độ hoạt động. Chế độ Inactive là tắt hoàn toàn. Chế độ Manual cho phép người vận hành đặt trực tiếp giá trị đầu ra. Chế độ Auto là PLC tự tính toán theo thuật toán PID. Bạn chuyển chế độ qua biến Mode trong khi hệ thống đang chạy mà không cần dừng chương trình.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'pid-tuning': {
      vi: 'TIA Portal có công cụ tự động chỉnh định PID gồm hai bước. Pre-tuning chạy trước — PLC tự kích thích hệ thống rồi ước lượng tham số thô. Fine-tuning chạy sau khi hệ thống đang ở trạng thái ổn định, tinh chỉnh lại để giảm vọt lố và dao động. Sau khi tuning xong, bạn vào tab Commissioning để xem đồ thị đáp ứng và xác nhận kết quả trước khi lưu tham số.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

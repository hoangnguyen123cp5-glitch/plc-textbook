/**
 * Narration — Bài 12: Fault Diagnostics
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 12-fault-diagnostics
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
  lessonSlug: '12-fault-diagnostics',
  topics: {

    'diagnostic-overview': {
      vi: 'TIA Portal tích hợp bộ công cụ chẩn đoán rất mạnh giúp bạn tìm lỗi nhanh mà không cần thiết bị đo ngoài. Bạn có thể xem trạng thái online của CPU, kiểm tra lỗi module, đọc buffer sự kiện, và giám sát tín hiệu I/O ngay trong phần mềm. Các công cụ này hoạt động kể cả khi chương trình đang chạy, nên rất phù hợp để xử lý sự cố trong sản xuất mà không cần dừng máy.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'diagnostic-buffer': {
      vi: 'Diagnostic Buffer là nhật ký sự kiện lưu trong CPU, ghi lại tất cả lỗi và cảnh báo theo thứ tự thời gian. Khi có sự cố, đây là nơi đầu tiên bạn nên xem. Mỗi mục gồm nhãn thời gian, loại sự kiện và mô tả nguyên nhân. Nhờ buffer này bạn biết lỗi xảy ra lúc mấy giờ, lỗi gì, và module nào gây ra — rất quan trọng khi cần phân tích sau sự cố.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'watch-force-tables': {
      vi: 'Watch Table cho phép bạn giám sát nhiều biến cùng lúc trong khi PLC đang chạy — rất hữu ích để theo dõi chuỗi sự kiện hoặc kiểm tra logic. Force Table mạnh hơn một bước: bạn ép buộc một giá trị vào biến, bất kể chương trình đang ghi gì. Dùng Force để kiểm tra đầu ra hoặc giả lập trạng thái cảm biến mà không cần thay đổi phần cứng thực tế.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

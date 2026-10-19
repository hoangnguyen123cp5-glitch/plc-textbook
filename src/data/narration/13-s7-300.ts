/**
 * Narration — Bài 13: S7-300 PLC
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 13-s7-300
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
  lessonSlug: '13-s7-300',
  topics: {

    's7-300-overview': {
      vi: 'S7-300 là dòng PLC tầm trung của Siemens ra đời từ những năm 1990 và vẫn còn rất phổ biến trong nhà máy hiện nay. Phần cứng gồm rack gắn các module theo hàng ngang — CPU ở giữa, module I/O hai bên. Giao tiếp mặc định là MPI, phiên bản cao hơn có PROFIBUS tích hợp. Mỗi rack chứa tối đa tám module mở rộng, và bạn có thể nối nhiều rack qua cáp mở rộng.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    's7-300-instructions': {
      vi: 'S7-300 dùng ngôn ngữ STL — còn gọi là AWL trong tiếng Đức — gần giống ngôn ngữ assembly. Thanh ghi trung tâm là ACCU, dùng để chứa kết quả tính toán tạm thời. Lệnh L nạp giá trị vào ACCU, lệnh T chuyển ACCU ra vùng nhớ đích. Cú pháp tường minh, hiệu quả cao, nhưng đòi hỏi người lập trình hiểu rõ kiến trúc CPU hơn so với Ladder hay FBD.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    's7-300-applications': {
      vi: 'S7-300 vẫn đang chạy trong rất nhiều nhà máy sản xuất, xử lý nước, và điện lực ở Việt Nam. Nó mạnh mẽ, đáng tin cậy, và có hệ sinh thái module phong phú. Tuy nhiên Siemens đã ngừng nhận đơn đặt hàng mới cho dòng này từ năm 2023. Nếu nhà máy bạn đang dùng S7-300 và cần mở rộng hoặc bảo trì lâu dài, đây là lúc cân nhắc lộ trình chuyển sang S7-1500.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

/**
 * Narration — Bài 14: System Upgrade
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 14-system-upgrade
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
  lessonSlug: '14-system-upgrade',
  topics: {

    'why-upgrade': {
      vi: 'Nâng cấp PLC không chỉ vì phần cứng hỏng. Có nhiều lý do chiến lược hơn: thiết bị cũ hết linh kiện thay thế, nhà cung cấp ngừng hỗ trợ phần mềm, hoặc dây chuyền cần tích hợp thêm công nghệ mới như IIoT hay cloud. Giữ PLC cũ quá lâu đồng nghĩa với rủi ro dừng máy đột ngột mà không có phụ tùng thay thế — chi phí đó thường lớn hơn nhiều so với đầu tư nâng cấp chủ động.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'migration-paths': {
      vi: 'Siemens hỗ trợ hai lộ trình chuyển đổi phổ biến: S7-200 lên S7-1200, và S7-300 lên S7-1500. TIA Migration Tool giúp tự động chuyển đổi một phần cấu hình phần cứng và chương trình. Tuy nhiên không phải tất cả đều chuyển được tự động — một số block đặc thù, địa chỉ ký hiệu và cấu trúc dữ liệu cần người kỹ sư xem xét và điều chỉnh thủ công sau khi tool chạy xong.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'project-conversion': {
      vi: 'Quy trình chuyển đổi project gồm nhiều bước. Đầu tiên xuất project từ phần mềm cũ sang định dạng mà Migration Tool nhận được. Tiếp theo chạy tool và xem log để biết phần nào chuyển thành công, phần nào cần làm tay. Sau đó biên dịch lại toàn bộ trong TIA Portal và xử lý lỗi từng cái một. Lỗi thường gặp là kiểu dữ liệu không khớp, hàm không còn tồn tại, hoặc địa chỉ tuyệt đối không hợp lệ.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'upgrade-risks': {
      vi: 'Quản lý rủi ro khi nâng cấp bắt đầu từ kế hoạch rollback rõ ràng. Trước khi cắt sang PLC mới, bạn phải backup toàn bộ chương trình cũ và giữ phần cứng cũ ở trạng thái sẵn sàng phục hồi. Acceptance criteria cần được thống nhất trước với khách hàng — chạy bao nhiêu giờ liên tục không lỗi thì mới nghiệm thu. Điều đó tránh tranh chấp và giúp cả hai bên có mục tiêu rõ ràng.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

/**
 * Narration — Bài 1: Programmable Control Fundamentals
 * Cập nhật: 2026-10-10
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 01-programmable-control
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
  lessonSlug: '01-programmable-control',
  topics: {

    'control-system-basics': {
      vi: 'Trong mục này, chúng ta tìm hiểu hệ thống điều khiển là gì. Một hệ thống điều khiển nhận tín hiệu đầu vào từ cảm biến, xử lý theo logic đã lập trình, rồi đưa ra lệnh điều khiển thiết bị chấp hành. Ví dụ đơn giản nhất là bộ điều nhiệt ở nhà bạn — nó đo nhiệt độ, so sánh với giá trị đặt, và bật hoặc tắt máy điều hòa.',
      duration: 28,
      by: 'ai',
      updatedAt: '2026-10-10',
    },

    'hardwired-vs-programmable': {
      vi: 'Điều khiển cứng dùng dây nối vật lý để tạo logic — muốn thay đổi phải đấu lại dây, tốn thời gian và dễ sai. Điều khiển lập trình như PLC cho phép thay đổi hoàn toàn hành vi bằng phần mềm mà không cần chạm vào phần cứng. Đây là lý do PLC thay thế hoàn toàn tủ rơ-le cổ điển trong nhà máy hiện đại.',
      duration: 25,
      by: 'ai',
      updatedAt: '2026-10-10',
    },

    'scan-cycle': {
      vi: 'PLC không chạy chương trình một lần rồi dừng. Nó lặp liên tục theo chu kỳ quét. Mỗi chu kỳ gồm bốn bước: đọc trạng thái đầu vào vào vùng nhớ ảo, thực thi chương trình từ đầu đến cuối, xử lý truyền thông và tự chẩn đoán, cuối cùng ghi kết quả ra đầu ra vật lý. Chu kỳ này lặp lại hàng nghìn lần mỗi giây.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-10',
    },

    // ── Các topic chưa có narration — để trống để AI điền ──
    // 'loop-types':          { ... }   ← MISSING
    // 'why-plc':             { ... }   ← MISSING
    // 'defining-plc':        { ... }   ← MISSING
    // 'plc-structure':       { ... }   ← MISSING
    // 'memory-and-leds':     { ... }   ← MISSING
    // 'languages-structure': { ... }   ← MISSING

  },
};

export default narration;

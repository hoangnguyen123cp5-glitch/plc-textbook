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

    'loop-types': {
      vi: 'Có ba kiểu điều khiển cơ bản. Vòng hở không có phản hồi — máy giặt đơn giản chạy đúng thời gian rồi dừng dù quần áo chưa sạch. Vòng kín dùng cảm biến đo kết quả thực tế và điều chỉnh liên tục — lò nhiệt đo nhiệt độ rồi bật tắt cho đến khi đạt giá trị đặt. Điều khiển vi tính kết hợp cả hai, thêm khả năng lập trình phức tạp và giao tiếp mạng.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'why-plc': {
      vi: 'Trước khi có PLC, mỗi thay đổi logic điều khiển đòi hỏi thợ điện tháo dây và đấu lại tủ rơ-le. Một dây chuyền ô tô có thể chứa hàng nghìn rơ-le, tiêu thụ điện liên tục dù tiếp điểm đóng hay mở, và mỗi rơ-le sẽ hỏng sau vài triệu lần đóng cắt. PLC giải quyết ba vấn đề này cùng lúc — thay đổi bằng phần mềm, tiêu thụ điện ít hơn nhiều, và tuổi thọ cao hơn gấp nhiều lần.',
      duration: 32,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'defining-plc': {
      vi: 'IEC 61131-1 định nghĩa PLC là thiết bị điện tử kỹ thuật số lập trình được, dùng để điều khiển máy móc và quy trình. Ba từ quan trọng: lập trình được — hành vi thay đổi bằng phần mềm; kỹ thuật số — xử lý bit 0 và 1; điều khiển — nhận tín hiệu, quyết định, ra lệnh. Khác với máy tính thông thường ở chỗ PLC được thiết kế chịu nhiệt độ, rung động, và bụi trong môi trường nhà máy.',
      duration: 33,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'plc-structure': {
      vi: 'Bên trong một PLC S7-1200 có năm khối chức năng. CPU xử lý chương trình và điều phối toàn bộ hoạt động. Bộ nhớ lưu chương trình, dữ liệu và vùng ảnh I/O. Khối đầu vào đọc trạng thái từ cảm biến và nút nhấn. Khối đầu ra điều khiển contactor, đèn và van. Nguồn điện cung cấp 24VDC ổn định cho tất cả khối còn lại. Các khối này giao tiếp qua bus nội bộ tốc độ cao.',
      duration: 34,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'memory-and-leds': {
      vi: 'S7-1200 có ba vùng nhớ chính. Load Memory lưu toàn bộ project kể cả comment — thường là thẻ nhớ Micro SD. Work Memory là RAM tốc độ cao, CPU chỉ nạp phần cần thực thi vào đây. Retain Memory giữ dữ liệu quan trọng khi mất điện, dùng tụ điện hoặc pin dự phòng. Về đèn LED: RUN xanh là bình thường, STOP vàng là dừng, ERROR đỏ nhấp nháy là có lỗi cần kiểm tra diagnostic buffer.',
      duration: 35,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'languages-structure': {
      vi: 'IEC 61131-3 chuẩn hóa năm ngôn ngữ lập trình PLC. Ladder Diagram giống sơ đồ rơ-le, phổ biến nhất ở châu Âu và Việt Nam. Function Block Diagram dùng khối kết nối, quen thuộc với kỹ sư điều khiển tự động. Structured Text giống Pascal, mạnh cho tính toán phức tạp. Instruction List là mã hợp ngữ, ít dùng trên S7-1200. Sequential Function Chart dùng cho quy trình tuần tự nhiều bước. Trong khóa học này chúng ta chủ yếu dùng Ladder và một ít SCL.',
      duration: 38,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

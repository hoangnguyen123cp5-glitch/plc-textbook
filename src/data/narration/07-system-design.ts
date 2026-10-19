/**
 * Narration — Bài 7: System Design
 * Cập nhật: 2026-10-19
 *
 * ── Quy tắc viết lời nói ──────────────────────────────────────────────
 * - Câu ngắn, rõ ràng, phù hợp nói chuyện (không phải văn viết)
 * - Không dùng dấu gạch đầu dòng trong text (đây là lời NÓI)
 * - Thời lượng tham khảo: ~130 từ/phút tiếng Việt
 * - Bắt đầu bằng "Trong mục này..." hoặc tên chủ đề
 */

import type { LessonNarration } from './index';

const narration: LessonNarration = {
  lessonSlug: '07-system-design',
  topics: {

    'device-selection': {
      vi: 'Bước đầu tiên thiết kế hệ thống PLC là phân tích yêu cầu kỹ thuật. Đếm tổng số đầu vào và đầu ra số, số kênh analog cần dùng, và xác định giao thức truyền thông nếu có. Từ đó chọn CPU phù hợp — CPU 1211C cho hệ nhỏ dưới mười sáu I/O, CPU 1214C hoặc 1215C cho hệ vừa và lớn hơn. Nên thêm dự phòng khoảng hai mươi phần trăm số I/O để dễ mở rộng sau này mà không phải thay CPU.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'design-program': {
      vi: 'Chương trình PLC tốt nên được tổ chức theo cấu trúc rõ ràng. OB1 là khối chính được gọi mỗi vòng quét, chứa các lời gọi đến FC và FB theo chức năng. FC là hàm không có bộ nhớ nội, phù hợp cho các tính toán thuần túy. FB có Instance Data Block riêng để lưu trạng thái giữa các lần gọi, dùng cho điều khiển thiết bị cần nhớ trạng thái. Cách phân chia này giúp code dễ đọc, dễ kiểm thử và tái sử dụng được.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'digital-expansion': {
      vi: 'Khi CPU S7-1200 không đủ I/O số, bạn gắn thêm Signal Module bên phải. SM 1221 là module input số tám hoặc mười sáu kênh. SM 1222 là module output số. SM 1223 kết hợp cả DI và DQ trên một module. Trong TIA Portal, kéo thả module vào vị trí slot mong muốn trong Device Configuration. Địa chỉ I/O tự động được gán theo thứ tự slot. Số module mở rộng tối đa phụ thuộc vào dòng CPU bạn chọn.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'analog-expansion': {
      vi: 'Mở rộng analog dùng SM 1231 cho đầu vào và SM 1232 cho đầu ra. Ngoài ra có module chuyên dụng cho cảm biến nhiệt điện trở RTD như SM 1231 AI 4xRTD và module cặp nhiệt ngẫu thermocouple. Các module này có độ phân giải cao và tích hợp sẵn bộ lọc nhiễu. Khi cấu hình trong TIA Portal, chọn đúng loại cảm biến và bù nhiệt đầu lạnh nếu dùng thermocouple. Địa chỉ vùng nhớ analog được hiển thị ngay sau khi kéo module vào rack.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'fault-handling': {
      vi: 'Xử lý sự cố PLC theo quy trình sáu bước giúp tiết kiệm thời gian. Bước một, quan sát đèn LED trên CPU và module để xác định vùng lỗi. Bước hai, kết nối TIA Portal và đọc diagnostic buffer để xem thông báo lỗi chi tiết. Bước ba, kiểm tra nguồn cấp cho CPU và các module. Bước bốn, kiểm tra tín hiệu vào ra bằng Watch Table. Bước năm, xem xét lại logic chương trình tại vùng nghi ngờ. Bước sáu, ghi lại nguyên nhân và biện pháp khắc phục để phòng ngừa tái diễn.',
      duration: 34,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

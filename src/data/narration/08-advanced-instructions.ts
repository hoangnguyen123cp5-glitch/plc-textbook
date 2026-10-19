/**
 * Narration — Bài 8: Advanced Instructions
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
  lessonSlug: '08-advanced-instructions',
  topics: {

    'time-instructions': {
      vi: 'Trong mục này, chúng ta học các lệnh xử lý thời gian nâng cao. RD_SYS_T đọc thời gian hệ thống hiện tại kiểu DTL. T_ADD cộng thêm một khoảng thời gian TIME vào giá trị DTL, hữu ích khi cần tính thời điểm hết hạn. T_DIFF tính khoảng cách giữa hai mốc thời gian DTL và trả về kiểu TIME. Kết hợp ba lệnh này, bạn có thể xây dựng lịch vận hành tự động theo ngày giờ thực mà không cần thêm module đồng hồ ngoài.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'string-instructions': {
      vi: 'S7-1200 hỗ trợ kiểu dữ liệu STRING để lưu chuỗi ký tự tối đa hai trăm năm mươi tư ký tự. Lệnh LEN trả về độ dài thực của chuỗi. CONCAT nối hai chuỗi lại với nhau. S_CONV chuyển đổi giữa STRING và các kiểu số. Các lệnh này thường dùng khi PLC cần giao tiếp với màn hình HMI, máy in nhãn hoặc thiết bị đọc mã vạch. Xử lý chuỗi tốn nhiều thời gian hơn xử lý số nên tránh dùng trong vòng lặp tốc độ cao.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'interrupt-instructions': {
      vi: 'Ngắt cho phép CPU tạm dừng OB1 để xử lý sự kiện khẩn cấp ngay lập tức. Ngắt thời gian dùng OB30 đến OB38, mỗi OB được gọi theo chu kỳ cố định bất kể vòng quét chính. Ví dụ OB35 mặc định gọi mỗi một trăm mili giây, dùng cho điều khiển PID. Ngắt phần cứng OB40 được kích khi có cạnh tín hiệu tại đầu vào ngắt chỉ định. Dùng ngắt khi cần phản hồi tức thời mà vòng quét thông thường không đáp ứng được yêu cầu thời gian.',
      duration: 32,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

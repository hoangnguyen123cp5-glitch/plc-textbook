/**
 * Narration — Bài 4: Numeric Operations
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
  lessonSlug: '04-numeric-operations',
  topics: {

    'data-space': {
      vi: 'Trong mục này, chúng ta tìm hiểu vùng nhớ của PLC S7-1200. INT là số nguyên 16-bit, DINT là 32-bit, REAL là số thực dấu phẩy động 32-bit. WORD và DWORD là kiểu không dấu thường dùng để xử lý bit. Ngoài ra còn có BOOL cho từng bit, BYTE cho tám bit, và TIME cho khoảng thời gian. Chọn đúng kiểu dữ liệu ngay từ đầu giúp tránh lỗi tràn số và tiết kiệm bộ nhớ PLC.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'comparison': {
      vi: 'Lệnh so sánh CMP cho phép so sánh hai giá trị số và trả về kết quả BOOL. Các phép so sánh gồm bằng, khác, lớn hơn, nhỏ hơn, lớn hơn hoặc bằng, và nhỏ hơn hoặc bằng. Trong LAD, khối CMP đặt trên nhánh như một tiếp điểm — nếu điều kiện đúng thì cho dòng điện đi qua. Ví dụ dùng CMP để kiểm tra nhiệt độ có vượt ngưỡng 80 độ chưa và tự động bật quạt làm mát.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'rotate-shift': {
      vi: 'Trong mục này ta học lệnh dịch và quay bit. SHL dịch trái, SHR dịch phải — bit tràn ra ngoài sẽ mất và được bù bằng bit không. ROL quay trái, ROR quay phải — bit tràn được đưa vào đầu bên kia thay vì mất đi. Các lệnh này thường dùng để điều khiển đèn LED dạng quét tuần tự hoặc trích xuất các trường bit trong một từ dữ liệu nhận từ thiết bị ngoại vi.',
      duration: 28,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'math-functions': {
      vi: 'S7-1200 hỗ trợ đầy đủ các phép tính số học trong LAD. ADD cộng, SUB trừ, MUL nhân, DIV chia và MOD lấy phần dư. Các khối này hoạt động với nhiều kiểu dữ liệu khác nhau gồm INT, DINT và REAL. Lưu ý khi chia số nguyên, kết quả bị cắt cụt phần thập phân. Nếu cần độ chính xác, hãy chuyển sang REAL trước khi tính. Overflow khi tính toán sẽ kích bit lỗi trong thanh ghi trạng thái.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'real-time-clock': {
      vi: 'CPU S7-1200 có đồng hồ thời gian thực tích hợp, cho phép đọc ngày giờ hiện tại từ chương trình. Lệnh RD_SYS_T đọc thời gian hệ thống và trả về giá trị kiểu DTL gồm năm, tháng, ngày, giờ, phút và giây. Bạn có thể dùng thông tin này để tạo lịch vận hành tự động — chẳng hạn bật đèn lúc sáu giờ sáng và tắt lúc mười giờ đêm mà không cần timer vật lý bên ngoài.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

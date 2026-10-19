/**
 * Narration — Bài 15: System Integration
 * Cập nhật: 2026-10-19
 *
 * ── Cách thêm lời nói mới ──────────────────────────────────────────────
 * 1. Chạy: npm run narration:missing 15-system-integration
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
  lessonSlug: '15-system-integration',
  topics: {

    'automation-pyramid': {
      vi: 'Tháp tự động hóa mô tả cách thông tin chảy từ tầng thấp nhất lên cao nhất trong nhà máy. Tầng Field là cảm biến và cơ cấu chấp hành. Tầng Control là PLC và DCS. Tầng Supervisory là SCADA và HMI. Tầng trên cùng là MES và ERP — nơi quản lý kế hoạch sản xuất và kinh doanh. Hiểu tháp này giúp bạn xác định đúng thiết bị và giao thức cho từng tầng.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'integration-walkthrough': {
      vi: 'Trong mục này, chúng ta đi qua một ví dụ tích hợp thực tế. PLC S7-1500 giao tiếp với biến tần qua PROFINET, đọc tốc độ động cơ và trạng thái lỗi. HMI WinCC kết nối với PLC qua Ethernet, hiển thị thông số và cho phép vận hành viên đặt tốc độ. SCADA thu thập dữ liệu lịch sử từ nhiều PLC, vẽ xu hướng và gửi cảnh báo qua email khi có bất thường.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'real-world-case': {
      vi: 'Hãy xét một dây chuyền đóng gói trong nhà máy thực phẩm. PLC điều khiển băng tải, cân định lượng, và máy hàn miệng túi. HMI cho phép thay đổi trọng lượng đặt và tốc độ dây chuyền mà không cần kỹ sư. SCADA theo dõi năng suất theo giờ và ghi nhận lỗi để báo cáo cuối ca. Toàn bộ hệ thống liên thông giúp quản lý nhà máy ra quyết định dựa trên dữ liệu thực, không phải ước tính.',
      duration: 32,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

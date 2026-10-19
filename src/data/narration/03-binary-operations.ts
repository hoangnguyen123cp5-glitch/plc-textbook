/**
 * Narration — Bài 3: Binary Operations
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
  lessonSlug: '03-binary-operations',
  topics: {

    'logic-links': {
      vi: 'Trong mục này, chúng ta học ba phép logic cơ bản trong LAD. AND là nối tiếp — tất cả tiếp điểm phải đóng thì cuộn dây mới có điện. OR là song song — chỉ cần một trong các tiếp điểm đóng là đủ. NOT đảo trạng thái — tiếp điểm thường đóng trong LAD chính là biểu diễn của NOT. Bảng chân lý giúp bạn kiểm tra logic trước khi nạp chương trình vào PLC thực.',
      duration: 28,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'set-reset': {
      vi: 'Lệnh SET và RESET hoạt động như một flip-flop nhớ trạng thái. Khi tín hiệu SET kích lên một lần, bit đầu ra sẽ giữ ở mức một dù tín hiệu SET đã tắt. Chỉ khi RESET được kích thì bit mới về không. Đây là cách điều khiển mô-tơ chuẩn trong nhà máy: nút Start SET cuộn dây khởi động, nút Stop hoặc bảo vệ quá tải RESET lại. Tránh SET và RESET cùng cuộn dây ở hai nhánh song song vì dễ xung đột.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'timers': {
      vi: 'S7-1200 có ba loại timer chính. TON là timer đóng trễ — đầu vào lên thì bắt đầu đếm, sau khoảng thời gian PT thì đầu ra Q lên. TOF là timer mở trễ — đầu vào xuống thì mới đếm rồi mới tắt Q. TP tạo xung đơn có độ rộng cố định PT. Trong TIA Portal, kéo khối IEC Timer vào chương trình, nối đầu vào IN và đặt giá trị PT kiểu TIME, ví dụ T#5s là năm giây.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'counters': {
      vi: 'Bộ đếm trong S7-1200 gồm CTU đếm lên, CTD đếm xuống và CTUD đếm cả hai chiều. Mỗi xung cạnh lên ở đầu vào CU làm giá trị CV tăng thêm một. Khi CV đạt đến PV, đầu ra Q lên mức một. Đầu vào R dùng để reset về không. Counters thường dùng để đếm sản phẩm trên băng tải, đếm số chai đã đóng nắp hoặc kiểm soát số vòng quay của trục máy.',
      duration: 28,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'binary-application': {
      vi: 'Trong mục ứng dụng thực tế, chúng ta kết hợp logic, timer và counter để xây dựng mạch điều khiển hoàn chỉnh. Ví dụ điển hình là băng tải hai tốc độ: nhấn Start thì chạy chậm trong năm giây nhờ TON, sau đó tự động chuyển sang chạy nhanh. Counter đếm sản phẩm và tự dừng khi đủ số lượng. Bài tập này giúp bạn thấy rõ cách các lệnh cơ bản phối hợp với nhau trong thực tế.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

/**
 * Narration — Bài 2: S7-1200 & TIA Portal
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
  lessonSlug: '02-s7-1200-tia-portal',
  topics: {

    's7-1200-device': {
      vi: 'CPU S7-1200 là trái tim của hệ thống. Trên mặt CPU có sẵn các cổng DI và DQ tích hợp, cổng Ethernet để kết nối máy tính, và các đèn LED trạng thái. Bên cạnh CPU, bạn có thể gắn thêm Signal Board ngay trên thân CPU để tăng thêm vài cổng I/O. Ngoài ra còn có các Signal Module gắn bên phải để mở rộng DI, DQ hoặc analog tuỳ nhu cầu hệ thống.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'program-processing': {
      vi: 'CPU S7-1200 xử lý chương trình theo vòng quét tuần hoàn. Mỗi vòng quét bắt đầu bằng việc đọc trạng thái đầu vào vào bộ nhớ ảo Process Image. Sau đó CPU thực thi toàn bộ chương trình trong OB1 từ trên xuống dưới. Cuối vòng quét, kết quả được ghi ra đầu ra vật lý. Thời gian một vòng quét thường dưới mười mili giây với chương trình cỡ vừa.',
      duration: 28,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'field-wiring': {
      vi: 'Khi đấu dây thực tế, bạn cần phân biệt sinking và sourcing. Đầu vào sinking nghĩa là dòng chạy vào chân DI từ thiết bị bên ngoài. Đầu vào sourcing thì ngược lại. Cảm biến NPN thường dùng với đầu vào sinking, cảm biến PNP dùng với sourcing. Đầu ra transistor của S7-1200 là sourcing, nên tải phải nối từ đầu ra về mass. Luôn kiểm tra cực tính và điện áp nguồn trước khi cấp điện.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'verify-wiring': {
      vi: 'Sau khi đấu dây xong, bạn không cần chạy chương trình để kiểm tra. TIA Portal có chế độ Monitor cho phép xem trực tiếp trạng thái các đầu vào và đầu ra ngay trên màn hình. Vào mục Device Configuration, chọn PLC Tags rồi bật Watch Table. Kích hoạt nút bấm hoặc cảm biến ngoài và quan sát bit tương ứng thay đổi. Cách này giúp phát hiện sai sót đấu dây rất nhanh trước khi vận hành chính thức.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'install-tia': {
      vi: 'TIA Portal là phần mềm lập trình chính thức của Siemens cho dòng S7. Để cài đặt, máy tính cần chạy Windows 10 hoặc 11 64-bit, tối thiểu 8 GB RAM và ổ cứng còn trống khoảng 20 GB. Quá trình cài gồm nhiều gói con như STEP 7, WinCC và Startdrive nên mất khá nhiều thời gian. Nên tắt phần mềm diệt virus trong lúc cài để tránh lỗi. Sau cài đặt cần khởi động lại máy trước khi sử dụng.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'using-tia': {
      vi: 'Khi mở TIA Portal, bạn tạo Project mới rồi thêm thiết bị PLC vào Device Configuration. Tại đây bạn cài đặt địa chỉ IP, chọn đúng phiên bản firmware của CPU. Chương trình được viết trong mục Program Blocks, mặc định có sẵn OB1. Bạn có thể thêm các FC và FB để tổ chức chương trình theo chức năng. Giao diện TIA Portal tích hợp cả lập trình, cấu hình phần cứng và giám sát trong một môi trường thống nhất.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'comms-setup': {
      vi: 'Để kết nối máy tính với PLC S7-1200, bạn cần cáp Ethernet tiêu chuẩn hoặc qua switch mạng. Đặt địa chỉ IP của card mạng máy tính cùng dải với PLC, ví dụ PLC là 192.168.0.1 thì máy tính đặt 192.168.0.10. Trong TIA Portal, vào mục Online Access, chọn đúng card mạng rồi bấm Start Search để tìm thiết bị. Khi thấy PLC xuất hiện trong danh sách, bấm Connect để bắt đầu làm việc trực tuyến.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

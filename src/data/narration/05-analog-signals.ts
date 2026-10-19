/**
 * Narration — Bài 5: Analog Signals
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
  lessonSlug: '05-analog-signals',
  topics: {

    'analog-signals': {
      vi: 'Tín hiệu analog biểu diễn đại lượng vật lý liên tục như nhiệt độ, áp suất hay lưu lượng. Hai chuẩn phổ biến nhất là bốn đến hai mươi mili-ampe và không đến mười vôn. Chuẩn dòng bốn đến hai mươi mili-ampe được ưa dùng hơn vì dòng điện không bị suy giảm theo chiều dài dây. Ngoài ra, dòng bốn mili-ampe ở trạng thái tối thiểu giúp phát hiện đứt dây — vì khi đứt dây tín hiệu về không chứ không phải bốn.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'analog-wiring': {
      vi: 'Đấu dây analog cần cẩn thận hơn tín hiệu số vì nhiễu rất dễ ảnh hưởng đến giá trị đo. Dùng cáp xoắn đôi có vỏ bọc chống nhiễu và nối đất vỏ bọc tại một đầu duy nhất để tránh vòng đất. Với cảm biến hai dây loại dòng, nối nguồn qua cảm biến rồi về đầu vào analog của module. Với cảm biến ba hoặc bốn dây, nguồn cảm biến và tín hiệu được tách riêng. Kiểm tra cực tính cộng và trừ trước khi cấp nguồn.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'analog-modules': {
      vi: 'Module SM 1231 là analog input của S7-1200, có bốn hoặc tám kênh, hỗ trợ cả tín hiệu dòng và điện áp. SM 1232 là analog output dùng để điều khiển van tỷ lệ hay biến tần. Trong TIA Portal, sau khi thêm module vào Device Configuration, bạn cấu hình từng kênh riêng biệt — chọn loại tín hiệu, dải đo và bộ lọc nhiễu. Địa chỉ vùng nhớ analog tự động được gán và hiển thị ngay trong giao diện cấu hình.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'norm-scale': {
      vi: 'Giá trị raw từ module analog là số nguyên trong khoảng không đến hai mươi bảy nghìn sáu trăm bốn mươi tám. Để chuyển về đơn vị thực như độ C hay bar, dùng hai lệnh. NORM_X chuẩn hóa giá trị raw về dải không đến một kiểu REAL. SCALE_X nhân kết quả đó với dải thực tế của cảm biến. Ví dụ cảm biến nhiệt độ không đến một trăm độ C, ta chỉ cần đặt MIN bằng không và MAX bằng một trăm là ra ngay giá trị độ C thực tế.',
      duration: 31,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

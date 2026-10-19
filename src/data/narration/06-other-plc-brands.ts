/**
 * Narration — Bài 6: Other PLC Brands
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
  lessonSlug: '06-other-plc-brands',
  topics: {

    'omron-mitsubishi': {
      vi: 'Ngoài Siemens, hai hãng PLC phổ biến tại Việt Nam là Omron và Mitsubishi. Omron dòng CP1H và CP1L rất thông dụng trong máy móc vừa và nhỏ, phần mềm lập trình là CX-Programmer. Mitsubishi dòng FX3U và FX5U mạnh về tốc độ xử lý và tích hợp nhiều lệnh chuyên dụng, dùng phần mềm GX Works. Cả hai đều hỗ trợ LAD và có thể lập trình bằng console cầm tay mà không cần máy tính.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'io-circuits': {
      vi: 'Mạch DI và DO của Omron và Mitsubishi về nguyên lý giống Siemens nhưng có một số khác biệt về sơ đồ chân. Omron CP1H có các cổng đầu vào sinking mặc định, cần nguồn ngoài 24VDC. Đầu ra có hai loại: transistor NPN cho tải DC và relay cho tải AC. Mitsubishi FX3U tương tự nhưng cũng cung cấp loại đầu ra transistor PNP. Khi thay thế PLC của hãng này bằng hãng khác, phải kiểm tra lại toàn bộ sơ đồ đấu dây.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'programming-console': {
      vi: 'Console lập trình cầm tay cho phép lập trình PLC trực tiếp mà không cần máy tính, rất hữu ích khi bảo trì tại hiện trường. Với Omron, bạn nhập lệnh bằng cách gõ mã lệnh và địa chỉ toán hạng qua bàn phím nhỏ trên console. Màn hình hiển thị từng dòng lệnh theo dạng mnemonic. Thứ tự thao tác thường là chọn chế độ Program, nhập địa chỉ ô nhớ, gõ lệnh rồi bấm Enter để xác nhận từng bước.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'ladder-diagram': {
      vi: 'LAD của Omron và Mitsubishi về cơ bản giống Siemens — vẫn là các tiếp điểm và cuộn dây trên nhánh ngang. Tuy nhiên có một số điểm khác biệt. Omron đặt cuộn dây OUT ở cuối mỗi nhánh tương tự Siemens, nhưng địa chỉ dùng ký hiệu riêng như 0.00 hay W0.00. Mitsubishi dùng ký hiệu X cho input, Y cho output và M cho bit nội. Hiểu được cú pháp địa chỉ của từng hãng là bước đầu tiên khi làm việc với PLC mới.',
      duration: 30,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

    'common-instructions': {
      vi: 'Dù mỗi hãng có ngôn ngữ riêng, các lệnh cốt lõi đều tương đương nhau. MOV chuyển dữ liệu từ nguồn sang đích. ADD và SUB thực hiện cộng và trừ số nguyên. CMP so sánh hai giá trị và đặt cờ trạng thái. JUMP nhảy đến một nhãn trong chương trình, thường dùng để bỏ qua khối lệnh khi điều kiện không thỏa. Khi chuyển từ hãng này sang hãng khác, hãy lập bảng đối chiếu lệnh để tránh nhầm lẫn.',
      duration: 29,
      by: 'ai',
      updatedAt: '2026-10-19',
    },

  },
};

export default narration;

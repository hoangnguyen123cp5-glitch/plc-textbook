/**
 * Slide nguồn của từng bài — truy vết từ giáo trình web về tập slide gốc.
 *
 * File .ppt/.pptx nằm trong thư mục Slide/ (đã loại khỏi git vì dung lượng và
 * vì là tài liệu giảng dạy của nhà trường). Bảng này chỉ ghi TÊN FILE để đối
 * chiếu, không nhúng nội dung.
 */

export interface SlideSource {
  /** Mã môn gốc trên slide */
  course: 'AUT206' | 'AUT207';
  /** Số bài trong giáo trình GỐC (khác số bài trên web sau khi gộp hai môn) */
  originalLesson: number;
  files: string[];
  /** Tổng số slide của các file nguồn */
  slideCount: number;
}

export const slideIndex: Record<string, SlideSource> = {
  '01-programmable-control': {
    course: 'AUT206', originalLesson: 1, slideCount: 98,
    files: [
      'PLC _ Slide 1 - Bài 1 Đại cương về điều khiển lập trình.ppt',
      'PLC Slide 1 -  Đại cương về điều khiển lập trình.pptx (EN)',
    ],
  },
  '02-s7-1200-tia-portal': {
    course: 'AUT206', originalLesson: 1, slideCount: 81,
    files: [
      'PLC _ Slide 2 - Bài 1 – Đại cương về điều khiển lập trình (TT).pptx',
    ],
  },
  '03-binary-operations': {
    course: 'AUT206', originalLesson: 2, slideCount: 38,
    files: [
      'PLC _ Slide 3 - Bài 2 PLC Các phép toán nhị phân của PLC.ppt',
    ],
  },
  '04-numeric-operations': {
    course: 'AUT206', originalLesson: 3, slideCount: 30,
    files: [
      'PLC _ Slide 4 - Bài 3 Các phép toán số của PLC.ppt',
    ],
  },
  '05-analog-signals': {
    course: 'AUT206', originalLesson: 4, slideCount: 28,
    files: [
      'PLC _ Slide 5 - Bài 4 Xử lý tín hiệu Analog.ppt',
    ],
  },
  '06-other-plc-brands': {
    course: 'AUT206', originalLesson: 5, slideCount: 46,
    files: [
      'PLC _ Slide 6 - Bài 5 PLC của các hãng.ppt',
    ],
  },
  '07-system-design': {
    course: 'AUT206', originalLesson: 6, slideCount: 42,
    files: [
      'PLC_ Slide 7 - Bài 6 Thiết kế ứng dụng mô hình điều khiển bằng PLC.pptx',
    ],
  },
  '08-advanced-instructions': {
    course: 'AUT207', originalLesson: 3, slideCount: 63,
    files: [
      'PLC _ Slide 3-1 - Bài 3 - Một số tập lệnh lập trình nâng cao.pptx',
      'PLC _ Slide 3-2 - Bài 3 - Một số tập lệnh lập trình nâng cao.pptx',
    ],
  },
  '09-high-speed-counting': {
    course: 'AUT207', originalLesson: 4, slideCount: 73,
    files: [
      'PL _ Slide 4-1 - Bài 4 - Lập trình đếm và phát xung tốc độ cao.pptx',
      'PLC _ Slide 4-2 - Bài 4 - Lập trình đếm và phát xung tốc độ cao.pptx',
    ],
  },
  '10-closed-loop-pid': {
    course: 'AUT207', originalLesson: 5, slideCount: 33,
    files: [
      'PLC _ Slide 5-2 - Bài 5 - Thiết kế hệ thống điều khiển vòng kín với thuật toán PID.pptx',
    ],
  },
  '11-communication': {
    course: 'AUT207', originalLesson: 6, slideCount: 57,
    files: [
      'PLC _ Slide 6-1 - Bài 6 - Giao thức truyền thông.pptx',
      'PLC _ Slide 6-2 - Bài 6 - Giao thức truyền thông.pptx',
    ],
  },
  '12-fault-diagnostics': {
    course: 'AUT207', originalLesson: 7, slideCount: 19,
    files: [
      'PLC _ Slide 7 - Bài 7 - Các công cụ chẩn đoán lỗi.pptx',
    ],
  },
  '13-s7-300': {
    course: 'AUT207', originalLesson: 8, slideCount: 30,
    files: [
      'PLC _ Slide 8 - Bài 8 - Tổng quan về PLC S7-300 và ứng dụng R01.pptx',
    ],
  },
  '14-system-upgrade': {
    course: 'AUT207', originalLesson: 9, slideCount: 52,
    files: [
      'PLC _ Slide 9-1 - Bài 9 - Giải pháp nâng cấp hệ thống PLC.pptx',
      'PLC _ Slide 9-2 - Bài 9 - Giải pháp nâng cấp hệ thống PLC.pptx',
    ],
  },
  '15-system-integration': {
    course: 'AUT207', originalLesson: 10, slideCount: 24,
    files: [
      'PLC _ Slide 9-3 - Bài 10 - Kết nối tổng thể hệ thống tự động hóa và ứng dụng thực tế.pptx',
    ],
  },
};

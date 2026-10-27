/**
 * Deep-dive Engineering Case Studies & Field Parameters
 * Specially crafted for LMS Lecture Recording (Video Bài Giảng Chuẩn Quốc Tế)
 * 100% relevant to each topic, providing rich, non-empty, broadcast-quality content.
 */

export interface TopicCaseStudy {
  caseTitle: string;
  industryApplication: string;
  fieldHardware: string[];
  keyFormulaOrMetric: string;
  commonPitfall: string;
  speakingCue: string;
}

export const TOPIC_CASE_STUDIES: Record<string, TopicCaseStudy> = {
  // ── LESSON 01: PROGRAMMABLE CONTROL FUNDAMENTALS ──
  'control-system-basics': {
    caseTitle: 'Ứng Dụng 5 Khối Cốt Lõi Trong Dây Chuyền Chiết Rót Nước Giải Khát Tự Động',
    industryApplication: 'Dây chuyền chiết rót 120 chai/phút yêu cầu định lượng chính xác 500ml ± 2ml. Hệ thống phân chia rõ ràng 5 khối: Setpoint (500ml từ màn hình HMI), Cảm biến (Encoder đo góc trục quay + loadcell cân định lượng), Khâu so sánh (Tính sai số thể tích tức thời), Bộ điều khiển (PLC S7-1200 tính toán thời điểm ngắt van), Cơ cấu chấp hành (Van điện từ khí nén điều khiển piston hành trình).',
    fieldHardware: [
      'Bộ điều khiển: Siemens S7-1200 CPU 1214C DC/DC/DC',
      'Cảm biến: Cảm biến quang thu phát Sick W16 + Loadcell HBM',
      'Cơ cấu chấp hành: Van khí nén Festo VTUG + Xylanh định lượng',
      'Tín hiệu giao tiếp: 24VDC PNP, 4–20 mA Analog, PROFINET',
    ],
    keyFormulaOrMetric: 'Sai số điều khiển: e(t) = SP(t) − PV(t) | Thời gian đáp ứng ngắt < 2 ms',
    commonPitfall: 'Nhầm lẫn giữa Cơ cấu chấp hành (Actuator) và Bộ điều khiển (PLC): PLC chỉ xử lý tín hiệu điều khiển công suất nhỏ (24VDC/0.5A), bắt buộc phải qua Rơ le trung gian/Khởi động từ/Biến tần để kéo tải công suất lớn.',
    speakingCue: 'Giảng viên nhấn mạnh: Mọi hệ thống tự động hoá từ chiếc điều hoà gia đình đến nhà máy hoá chất đều quy về 5 khối này. PLC đóng vai trò là "Bộ điều khiển" thông minh ở giữa.',
  },

  'loop-types': {
    caseTitle: 'Kiểm Soát Nhiệt Độ Lò Nung Thép Hợp Kim: Vòng Hở vs Vòng Kín PID',
    industryApplication: 'Lò nung nhiệt luyện thép yêu cầu duy trì 850°C ± 2°C. Nếu dùng vòng hở (bật công suất 70% cố định), khi công nhân mở cửa lò đưa phôi lạnh vào sẽ làm nhiệt sụt 150°C mà hệ thống không hề biết ➔ Hỏng toàn bộ mẻ thép. Với vòng kín: Cặp nhiệt điện Type K đo PV thực tế đưa về PLC, khối PID_Compact tự động kích mở góc van khí đốt lên 95% để bù nhiệt tức thời.',
    fieldHardware: [
      'Cảm biến nhiệt độ: Can nhiệt Thermocouple K bọc Inconel (0–1200°C)',
      'Module đọc tín hiệu: SM 1231 AI 4 × 16 bit cặp nhiệt',
      'Cơ cấu chấp hành: Bộ điều áp Thyristor SCR / Van tỉ lệ Siemens VGD',
      'Khối thuật toán: PID_Compact FB trong thư viện TIA Portal',
    ],
    keyFormulaOrMetric: 'u(t) = K_p · e(t) + K_i ∫ e(t)dt + K_d · [de(t)/dt]',
    commonPitfall: 'Không phải hệ thống nào cũng cần vòng kín: với quạt thông gió nhà xưởng hoặc băng tải chạy tốc độ cố định, vòng hở theo lịch thời gian là lựa chọn kinh tế nhất, không lo dao động mất ổn định.',
    speakingCue: 'Chỉ cho sinh viên thấy trên đồ thị: Vòng kín tự động khử nhiễu khi cửa lò mở, trong khi vòng hở bị sụt nhiệt nghiêm trọng không thể phục hồi.',
  },

  'hardwired-vs-programmable': {
    caseTitle: 'Cải Tạo Tủ Rơ Le Dây Chuyền Ép Thân Xe Hơi GM Hydramatic Sang PLC',
    industryApplication: 'Dây chuyền ép dập nguyên bản chứa hơn 2.000 rơ le cơ khí và công tắc hành trình. Mỗi khi nhà máy thay đổi thiết kế khung xe mới, đội ngũ thợ điện phải mất 3 tuần ngừng máy để tháo dỡ và đi lại hàng ngàn mét dây đồng. Khi chuyển sang PLC, toàn bộ dây đấu nối giữa rơ le biến thành dòng lệnh phần mềm trong bộ nhớ CPU; việc đổi khuôn chỉ cần 5 phút nạp chương trình mới qua mạng.',
    fieldHardware: [
      'Tủ rơ le cũ: 2.000 Rơ le trung gian Omron MY4N, chiếm 3 tủ điện lớn',
      'Hệ thống mới: 1 Rack PLC Siemens S7-1200 CPU 1215C + 6 Module SM 1223',
      'Tiết kiệm không gian: Giảm 85% diện tích tủ điện và 70% điện năng tiêu thụ',
      'Tuổi thọ MTBF: Tăng từ 2 năm (mòn tiếp điểm) lên 15 năm (linh kiện bán dẫn)',
    ],
    keyFormulaOrMetric: 'Thời gian ngừng máy (Downtime): Giảm từ 3 tuần (504 giờ) xuống còn 5 phút (0.08 giờ)',
    commonPitfall: 'Tiếp điểm cơ khí của rơ le bị hồ quang điện làm rỗ tiếp điểm sau khoảng 100.000 đến 1 triệu lần đóng cắt, gây ra lỗi chập chờn rất khó dò bằng đồng hồ đo.',
    speakingCue: 'Giảng viên phân tích bài toán kinh tế: Chi phí mua PLC đắt hơn vài rơ le, nhưng chi phí dừng máy 1 ngày trong nhà máy ô tô có thể lên đến hàng trăm ngàn USD.',
  },

  'why-plc': {
    caseTitle: 'Điều Khiển Luân Phiên & Dự Phòng Bơm Tuần Hoàn Nhà Máy Xử Lý Nước Thải',
    industryApplication: 'Trạm bơm gồm 3 máy bơm 45kW luân phiên chạy theo giờ tích luỹ (để các bơm mòn đều nhau) và tự động gọi bơm dự phòng khi bơm chính báo lỗi quá tải. Làm mạch này bằng rơ le và bộ đếm thời gian cơ học cực kỳ phức tạp và dễ nhầm lẫn. Với PLC S7-1200, kỹ sư sử dụng hàm đếm thời gian chạy máy (Runtime Counter) và so sánh tự động trong vài dòng lệnh LAD/SCL.',
    fieldHardware: [
      'Bơm ly tâm công nghiệp 45kW + Khởi động mềm / Biến tần V20',
      'Rơ le nhiệt bảo vệ quá tải đưa tiếp điểm cảnh báo vào ngõ vào DI',
      'Cảm biến áp suất đường ống Danfoss MBS 3000 (4–20 mA đưa vào AI)',
      'Màn hình cảm ứng HMI KTP700 Basic hiển thị số giờ chạy từng bơm',
    ],
    keyFormulaOrMetric: 'Giờ vận hành: Runtime_Pump = Σ(T_on) | Bơm có Runtime nhỏ nhất được ưu tiên chạy',
    commonPitfall: 'Đấu rơ le cơ khí truyền thống không thể tính được giờ chạy tích luỹ khi mất điện, trong khi PLC lưu giá trị giờ chạy vào vùng nhớ Retentive Memory an toàn.',
    speakingCue: 'Giải thích cho người học thấy tính linh hoạt của phần mềm: Thay vì tháo tủ điện để đổi luật luân phiên từ 8 tiếng sang 12 tiếng, ta chỉ cần chỉnh thông số trên màn hình HMI.',
  },

  'defining-plc': {
    caseTitle: '10 Tiêu Chuẩn Thiết Kế GM Hydramatic 1968 Khai Sinh Ra PLC Đầu Tiên',
    industryApplication: 'Năm 1968, hãng xe General Motors đưa ra bản đặc tả gồm 10 yêu cầu kỹ thuật: Dễ lập trình bởi kỹ thuật viên không rành máy tính; Lập trình dạng tiếp điểm rơ le quen thuộc; Không chứa linh kiện mòn cơ học; Làm việc tin cậy trong môi trường công nghiệp đầy bụi bẩn và xung điện; Kích thước nhỏ gọn; Giá thành cạnh tranh. Kỹ sư Dick Morley đã sáng chế ra Modicon 084 đáp ứng toàn bộ các tiêu chí này.',
    fieldHardware: [
      'Chuẩn quốc tế: NEMA ICS 3-1978 & IEC 61131-1',
      'Môi trường hoạt động: Nhiệt độ 0–60°C, độ ẩm 95% không ngưng tụ',
      'Cách ly điện áp: Optocoupler cách ly quang ngõ vào/ngõ ra lên tới 500V–1500V',
      'Khung vỏ: Nhựa ABS/Polycarbonate chống cháy chuẩn UL 94 V-0',
    ],
    keyFormulaOrMetric: 'Định nghĩa NEMA: Digital Apparatus + Programmable Memory + Industrial I/O Modules',
    commonPitfall: 'Nhầm lẫn PLC với máy tính vi tính thông thường (PC/Arduino): PC văn phòng sẽ treo máy hoặc cháy chip chỉ sau vài ngày trong nhà máy do sốc điện cảm kháng từ contactor và bụi kim loại.',
    speakingCue: 'Nhấn mạnh 3 từ khoá vàng trong định nghĩa: "Thiết bị số", "Khả trình (đổi bằng phần mềm)", "Môi trường công nghiệp".',
  },

  'plc-structure': {
    caseTitle: 'Cơ Chế Lọc Nhiễu & Cách Ly Quang 500V Trong Khối Ngõ Vào Số (DI)',
    industryApplication: 'Khi dây tín hiệu từ nút nhấn dài 100m chạy qua máng cáp song song với dây động lực 380VAC của động cơ, hiện tượng cảm ứng điện từ tạo ra các gai điện áp lên tới hàng trăm Volt. Khối DI của S7-1200 bảo vệ CPU nhờ 3 tầng: 1. Mạch cầu diode chống ngược cực tính; 2. Tầng lọc RC triệt tiêu xung gai tần số cao và chống rung tiếp điểm cơ học (Filter time 3.2ms); 3. Cặp cách ly quang (Optocoupler) truyền tín hiệu bằng tia hồng ngoại.',
    fieldHardware: [
      'Nguồn nuôi nội bộ: Bộ nguồn xung SMPS tạo điện áp 5VDC và 3.3VDC cho CPU',
      'Cách ly quang: Optocoupler Vishay/Toshiba cách ly an toàn 500VAC',
      'Đệm ngõ ra: Relay Omron 2A hoặc Transistor MOSFET Infineon tốc độ cao',
      'Bus nội bộ: Đường truyền song song Address Bus, Data Bus, Control Bus',
    ],
    keyFormulaOrMetric: 'Thời gian trễ lọc ngõ vào T_filter: Cài đặt từ 0.1 μs đến 20.0 ms trong Hardware Config',
    commonPitfall: 'Nếu chọn bộ lọc DI quá nhanh (0.1μs) cho nút nhấn cơ khí, hiện tượng nảy tiếp điểm (contact bounce) sẽ khiến PLC đếm nhầm 1 lần nhấn thành 10 lần!',
    speakingCue: 'Chỉ rõ trên slide các khối cấu trúc bên trong CPU 1214C: Nguồn điện ➔ Cách ly quang ➔ Vi xử lý ➔ Transistor/Relay đệm.',
  },

  'memory-and-leds': {
    caseTitle: 'Phân Vùng Bộ Nhớ S7-1200 & Cơ Chế Giữ Dữ Liệu Retentive Bằng Siêu Tụ',
    industryApplication: 'Một hệ thống cân pha trộn sơn tự động đang trộn giữa chừng thì nhà máy mất điện lưới đột ngột. Nếu không cấu hình Retentive Memory, khi có điện lại biến đếm khối lượng sẽ bị reset về 0, gây tràn bể sơn hoặc sai công thức hàng tỉ đồng. S7-1200 sử dụng siêu tụ điện (Supercapacitor) duy trì nguồn cho chip nhớ NVRAM lưu giữ toàn bộ dữ liệu quan trọng tối thiểu 20 ngày mà không cần thay pin bảo dưỡng.',
    fieldHardware: [
      'Load Memory: Bộ nhớ Flash ROM không mất dữ liệu (1MB tích hợp, mở rộng thẻ SMC 24MB)',
      'Work Memory: RAM tốc độ cao (50KB–150KB) để CPU thực thi logic thời gian thực',
      'Retentive Memory: Bộ nhớ lưu trữ an toàn (10KB) backed-up bằng tụ điện',
      'Diagnostic LEDs: RUN/STOP (Xanh/Vàng), ERROR (Đỏ nhấp nháy), MAINT (Vàng bảo trì)',
    ],
    keyFormulaOrMetric: 'Thời gian giữ dữ liệu Retentive: > 20 ngày ở 40°C không cần pin phụ trợ',
    commonPitfall: 'Chỉ các biến được tích chọn cờ "Retain" trong Data Block (DB) hoặc Memory Marker (M) mới được giữ lại sau khi tắt nguồn. Mặc định các biến khác sẽ tự reset về 0!',
    speakingCue: 'Hướng dẫn sinh viên cách nhìn đèn LED trên mặt trước CPU để bắt bệnh nhanh: Đèn ERROR đỏ nháy nghĩa là CPU vẫn sống nhưng có lỗi chương trình hoặc đứt dây I/O.',
  },

  'scan-cycle': {
    caseTitle: 'Hiện Tượng Bất Đồng Bộ Dữ Liệu Nếu Không Có Vùng Đệm Process Image (PII/PIQ)',
    industryApplication: 'Giả sử trong một chu kỳ quét dài 5ms, chương trình đọc tiếp điểm nút nhấn khẩn cấp ở Network 1 (thấy đang đóng - OK), nhưng đến Network 50 thì nút nhấn bị ngắt. Nếu CPU đọc trực tiếp chân vật lý, các lệnh phía sau sẽ nhận trạng thái mâu thuẫn với các lệnh phía trước. Chu kỳ quét của PLC giải quyết triệt để vấn đề này: Đầu chu kỳ, CPU "chụp ảnh" tức thời toàn bộ ngõ vào vào bảng PII; trong suốt chu kỳ quét, tất cả network chỉ đọc ảnh chụp PII cố định.',
    fieldHardware: [
      'Giai đoạn 1: Đọc ngõ vào DI vật lý ➔ Nạp vào Vùng đệm Process Image Input (PII)',
      'Giai đoạn 2: Thực thi tuần tự các khối lệnh người dùng (OB1, FB, FC) từ trên xuống dưới',
      'Giai đoạn 3: Xử lý truyền thông mạng PROFINET, giao tiếp màn hình HMI, tự chẩn đoán',
      'Giai đoạn 4: Đồng loạt xuất Vùng đệm Process Image Output (PIQ) ra ngõ ra DO vật lý',
    ],
    keyFormulaOrMetric: 'Chu kỳ quét tổng: T_scan = T_read + T_exec + T_comm + T_write (Thường từ 1 đến 5 ms)',
    commonPitfall: 'Lỗi ghi đè ngõ ra: Nếu dùng cuộn coil %Q0.0 ở 2 Network khác nhau, trạng thái ngõ ra vật lý sẽ luôn tuân theo Network cuối cùng vì PIQ chỉ cập nhật ra ngoài ở cuối chu kỳ!',
    speakingCue: 'Nhấn mạnh với sinh viên: 90% lỗi của người mới học PLC bắt nguồn từ việc không hiểu nguyên lý chu kỳ quét và hiểu lầm PLC chạy giống mã C/Python trên máy tính.',
  },

  'languages-structure': {
    caseTitle: 'Ma Trận Quyết Định Lựa Chọn 5 Ngôn Ngữ IEC 61131-3 Trong Dự Án Nhà Máy',
    industryApplication: 'Một hệ thống tự động hoá hoàn chỉnh không bao giờ chỉ dùng 1 ngôn ngữ: Mạch khởi động động cơ và liên động an toàn cửa bảo vệ được viết bằng LAD (Ladder Diagram) để thợ điện dễ đọc; Thuật toán điều khiển nhiệt độ PID và lọc nhiễu tín hiệu được viết bằng FBD; Thuật toán tính toán toạ độ robot, công thức hoá học và xử lý chuỗi mã vạch barcode bắt buộc viết bằng SCL (Structured Text); Trình tự chiết rót 8 bước viết bằng SFC.',
    fieldHardware: [
      'LAD (Ladder Diagram): Trực quan, dựa trên sơ đồ rơ le tiếp điểm công nghiệp',
      'FBD (Function Block Diagram): Dạng khối hộp logic toán học và điều khiển quá trình',
      'SCL (Structured Control Language): Ngôn ngữ bậc cao cú pháp tựa Pascal / C',
      'STL (Statement List): Hợp ngữ thanh ghi (chỉ còn dùng trên S7-300/400 cũ)',
      'SFC (Sequential Function Chart): Lưu đồ trạng thái tuần tự cho hệ thống mẻ Batch',
    ],
    keyFormulaOrMetric: 'Quy tắc vàng: Logic đóng cắt tiếp điểm ➔ Dùng LAD | Tính toán số học & mảng ➔ Dùng SCL',
    commonPitfall: 'Cố gắng viết thuật toán tính ma trận hoặc vòng lặp For phức tạp bằng ngôn ngữ Ladder (LAD) sẽ dẫn đến hàng trăm Network rối rắm, cực kỳ khó bảo trì so với vài dòng mã SCL.',
    speakingCue: 'Chỉ cho người học thấy xu hướng công nghiệp 4.0: S7-1200 và TIA Portal cho phép trộn lẫn các khối LAD và SCL trong cùng một project để tối ưu hoá thế mạnh của từng ngôn ngữ.',
  },
};

/**
 * Fallback generator for other lessons to ensure rich, non-empty content
 */
export function getTopicCaseStudy(lessonSlug: string, topicSlug: string, topicTitle: string): TopicCaseStudy {
  const specific = TOPIC_CASE_STUDIES[topicSlug];
  if (specific) return specific;

  return {
    caseTitle: `Nghiên Cứu Kỹ Thuật Công Nghiệp: ${topicTitle}`,
    industryApplication: `Ứng dụng chuyên đề "${topicTitle}" trong hệ thống điều khiển tự động hoá công nghiệp thực tế. Quy chuẩn vận hành đòi hỏi đồng bộ tín hiệu thời gian thực, khử nhiễu điện từ và đảm bảo an toàn vận hành liên tục 24/7 theo tiêu chuẩn IEC 61131.`,
    fieldHardware: [
      'Thiết bị điều khiển: Siemens SIMATIC S7-1200 / S7-300 PLC',
      'Chuẩn tín hiệu: 24VDC Digital, 4–20 mA Analog, PROFINET Industrial Ethernet',
      'Môi trường công nghiệp: Chống rung động, cách ly quang chống xung sét cảm ứng',
      'Môi trường lập trình: TIA Portal V18/V19 (Totally Integrated Automation)',
    ],
    keyFormulaOrMetric: 'Chu kỳ quét vòng lặp điều khiển: 1–10 ms | Độ tin cậy MTBF > 100.000 giờ',
    commonPitfall: 'Luôn kiểm tra sơ đồ đấu nối và tính tương thích mức điện áp logic trước khi đấu dây thực tế vào các chân terminal của module PLC.',
    speakingCue: `Giảng viên hướng dẫn sinh viên phân tích nguyên lý hoạt động cốt lõi của chuyên đề "${topicTitle}", chỉ dẫn cách cấu hình trong TIA Portal và các lưu ý an toàn thực địa.`,
  };
}

# Khoảng trống nội dung sau khi tổ chức lại theo đề cương slide

Cấu trúc giáo trình đã được dựng lại từ **đề cương thật** trong thư mục `Slide/`
thay vì cấu trúc 15 bài do AI sinh trước đó.

## Phát hiện quan trọng

Thư mục `Slide/` không chứa một môn mà **hai môn riêng biệt**:

| Mã môn | Tên | Số bài có slide | Slide |
|---|---|---|---|
| **AUT206** | PLC CƠ BẢN | Bài 1–6 | ~290 |
| **AUT207** | PLC NÂNG CAO | Bài 3–10 | ~430 |

Hai môn đã được **gộp thành một lộ trình liền mạch 15 bài** đi từ cơ bản lên nâng cao.
Mã môn gốc giữ trong trường `course` của mỗi bài; file slide nguồn tra ở
`src/data/slide-index.ts`.

Chuẩn đầu ra chính thức của AUT206 (lấy từ slide SYLLABUS) — nên đưa lên trang giới thiệu:

- **G1** Giải thích, phân tích được ứng dụng của PLC trong dây chuyền thực tế
- **G2** Giải thích, phân tích được hoạt động và ứng dụng của trạm/hệ thống có PLC
- **G3** Đo lường, kiểm tra thông số và lắp đặt hệ thống điện với PLC
- **G4** Lắp ráp, vận hành thiết bị điện và hệ thống PLC cơ bản; đánh giá tình trạng, xử lý sự cố, hiệu chỉnh với thiết bị ngoại vi
- **G5** Rèn tính cẩn thận, tỉ mỉ, chủ động, biết tổ chức và quản lý công việc

## Hai bộ slide TIẾNG ANH chưa dùng

Rất đáng chú ý vì giáo trình phải làm bằng tiếng Anh:

| File | Slide | Nội dung |
|---|---|---|
| `PLC Slide 1 - Đại cương về điều khiển lập trình.pptx` | 47 | Bản tiếng Anh của Bài 1 — *1.1 Overview of Programmable Controls*, *1.2 Structure a PLC* |
| `phy PLC PROGRAMMING.pptx` | 65 | *An Introduction to Programmable Logic Controllers* — open/closed loop control, computerised control, PLC hardware design, processor architecture |

Đây là **112 slide tiếng Anh sẵn có**. Dùng chúng làm nguồn cho bài 01 thay vì dịch
lại từ tiếng Việt sẽ tiết kiệm đáng kể công sức.

## Bốn bài có slide nhưng CHƯA có nội dung web

Cần viết mới, nguồn đã có sẵn:

| Bài | Slide nguồn | Slide |
|---|---|---|
| `06-other-plc-brands` | Slide 6 — Bài 5 PLC của các hãng | 46 |
| `07-system-design` | Slide 7 — Bài 6 Thiết kế ứng dụng mô hình điều khiển | 42 |
| `13-s7-300` | Slide 8 — Bài 8 Tổng quan PLC S7-300 | 30 |
| `14-system-upgrade` | Slide 9-1, 9-2 — Bài 9 Giải pháp nâng cấp hệ thống PLC | 52 |

## Hai bài cũ KHÔNG có slide nguồn — nội dung được giữ ở đây

`12-hmi-design` và `13-scada` trong cấu trúc cũ không ứng với bất kỳ file slide nào.
Chúng đã bị loại khỏi chương trình. Nội dung tiếng Việt được bảo lưu nguyên văn bên
dưới — nếu sau này bạn có slide cho hai chủ đề này thì dán lại vào `lesson-content.ts`.


### `12-hmi-design`

**Overview:** HMI (Human Machine Interface) là giao diện giữa người vận hành và hệ thống máy móc. TIA Portal tích hợp WinCC để thiết kế màn hình vận hành cho các panel HMI như KTP700, TP900 của Siemens.

**Objectives:**

- Tạo project HMI trong TIA Portal và kết nối với PLC
- Thiết kế màn hình vận hành với buttons, I/O fields, đèn báo
- Cấu hình alarm management và trend display
- Sử dụng recipe và user administration
- Mô phỏng và transfer project xuống panel HMI thật

**Sections:**

#### 12.1 Tổng quan HMI và lựa chọn panel

Siemens có hai dòng HMI chính: Basic Panel (KTP) và Comfort Panel (TP). Basic Panel phù hợp ứng dụng đơn giản, Comfort Panel hỗ trợ trend, recipe, scripting.

- KTP400 Basic: 4" màn hình cảm ứng, PROFINET/PROFIBUS
- KTP700 Basic: 7" màn hình cảm ứng, phổ biến nhất
- KTP900 Basic: 9" màn hình cảm ứng + phím cứng
- TP700 Comfort: 7" cảm ứng, hỗ trợ trend, recipe, JavaScript
- TP1500 Comfort: 15" large panel cho control room
- WinCC Runtime Advanced/Professional: SCADA chạy trên PC

#### 12.2 Tạo HMI project và kết nối PLC

Thêm HMI device vào TIA Portal project, cấu hình kết nối với CPU S7-1200 qua PROFINET. HMI Tags sẽ ánh xạ trực tiếp với PLC Tags.

- Add new device → HMI → chọn đúng Order Number của panel
- Connections: chọn PLC, kết nối qua PROFINET (cùng subnet)
- HMI Tag Table: tạo tag kết nối với PLC tag hoặc địa chỉ tuyệt đối
- Acquisition cycle: tần suất cập nhật dữ liệu (100ms, 500ms, 1s)
- Symbolic access: dùng tên tag PLC trực tiếp (khuyến nghị)
- Absolute address: dùng địa chỉ %MW, %Q... (cũ hơn)

#### 12.3 Thiết kế màn hình — Các đối tượng cơ bản

WinCC cung cấp thư viện đối tượng phong phú. Nguyên tắc thiết kế HMI tốt: rõ ràng, nhất quán, dễ vận hành trong điều kiện áp lực cao.

- Button: nhấn đặt bit PLC Tag = 1 (Toggle hoặc Momentary)
- I/O Field: hiển thị và nhập giá trị — kết nối với PLC Tag
- Text Field: nhãn tĩnh, chú thích
- Indicator Light: đèn báo trạng thái, đổi màu theo giá trị tag
- Bar Chart: thanh chỉ báo mức (nhiệt độ, áp suất, mức nước)
- Gauge: đồng hồ tròn chỉ thị giá trị analog
- Image: chèn hình ảnh thiết bị, nhà máy
- Animations: thay đổi màu sắc, hiển thị/ẩn theo điều kiện

> Thiết kế theo nguyên tắc ISA-101 HMI: màu nền xám trung tính, màu đỏ chỉ dành cho alarm, không dùng màu sắc như trang trí.

#### 12.4 Alarm Management

Alarm Management trong HMI hiển thị và quản lý cảnh báo từ PLC. Mỗi alarm có class (Error, Warning, System), cần được acknowledge bởi người vận hành.

- Discrete alarm: gắn với 1 bit PLC — khi bit = 1 thì alarm kích hoạt
- Analog alarm: kích hoạt khi giá trị vượt ngưỡng Hi/Lo
- Alarm class: Error (đỏ), Warning (vàng), System (xanh dương)
- Acknowledge: người vận hành xác nhận đã thấy alarm
- Alarm view: hiển thị danh sách alarm hiện tại và lịch sử
- Alarm log: lưu lịch sử alarm vào file (CSV hoặc database)

#### 12.5 Giới thiệu Trend Display và Recipe

Trend hiển thị lịch sử giá trị theo thời gian. Recipe lưu trữ tập hợp setpoint để chuyển đổi nhanh giữa các chế độ sản xuất.

- Trend view: vẽ đồ thị giá trị tag theo thời gian thực
- Online trend: dữ liệu hiện tại (buffer trong HMI)
- Historical trend: dữ liệu từ file log trước đó
- Recipe: bảng setpoint (ví dụ: nhiệt độ, thời gian, tốc độ) theo sản phẩm
- Recipe view: giao diện chọn recipe và transfer xuống PLC
- User administration: phân quyền vận hành theo cấp bậc (Operator, Supervisor, Admin)

#### 12.6 Tag kết nối HMI-PLC

Cấu hình kết nối dữ liệu giữa HMI và PLC thông qua hệ thống thẻ (tags) để đảm bảo đồng bộ hóa thông tin theo thời gian thực.

- Tạo HMI tag trực tiếp từ PLC tag thông qua giao diện kéo thả trong TIA Portal
- Chu kỳ cập nhật (Acquisition cycle): thời gian HMI quét và cập nhật giá trị (thường 100ms - 1s)
- Cập nhật theo chu kỳ liên tục (Cyclic continuous) hoặc khi có yêu cầu (On demand)
- Tối ưu hóa số lượng tag để đảm bảo hiệu suất truyền thông PROFINET
- Sử dụng các mảng (Arrays) hoặc cấu trúc (Structs) để truyền lượng lớn dữ liệu

#### 12.7 Quy trình vận hành khi có báo động

Hệ thống quản lý báo động toàn diện giúp người vận hành nhận biết và xử lý các sự cố kịp thời.

- Cấu hình Discrete Alarm: kích hoạt dựa trên sự thay đổi trạng thái của bit (0/1)
- Cấu hình Analog Alarm: kích hoạt khi giá trị vượt qua ngưỡng cài đặt (Limit)
- Nhóm báo động (Alarm groups): phân loại báo động theo mức độ ưu tiên hoặc khu vực
- Alarm Window và Alarm Indicator: các đối tượng hiển thị báo động trên màn hình
- Acknowledgement (ACK): yêu cầu người vận hành xác nhận đã nhận được báo động

#### 12.8 Trend control

Vẽ và hiển thị đồ thị dữ liệu quá trình, giúp giám sát trực quan sự thay đổi của các thông số theo thời gian.

- Vẽ đồ thị giá trị biến đổi theo thời gian thực (Real-time trend)
- Hiển thị lịch sử dữ liệu quá khứ từ bộ nhớ (Historical trend)
- Cấu hình trục thời gian (X-axis) và trục giá trị (Y-axis) linh hoạt
- Tính năng Zoom và Pan để phân tích chi tiết dữ liệu đồ thị
- Hữu ích trong việc chẩn đoán dao động nhiệt độ, áp suất hoặc lỗi hệ thống

#### 12.9 Recipe management

Quản lý công thức sản xuất, cho phép lưu trữ và chuyển đổi linh hoạt các thông số cài đặt cho nhiều loại sản phẩm khác nhau.

- Lưu trữ công thức sản xuất (Recipes) vào bộ nhớ non-volatile của HMI
- Nạp dữ liệu công thức từ HMI xuống PLC khi bắt đầu sản xuất sản phẩm mới
- Xuất/lưu giá trị hiện tại từ PLC lên HMI thành một công thức mới
- Quản lý Recipe Elements (thông số) và Recipe Data Records (bản ghi số liệu)
- Giao diện Recipe View: cho phép thao tác tạo, xóa, chỉnh sửa công thức trực tiếp trên màn hình

#### 12.10 Scripting trong WinCC

Sử dụng kịch bản (Scripting) để thực hiện các logic tính toán và xử lý dữ liệu phức tạp mà các đối tượng tiêu chuẩn không hỗ trợ.

- Hỗ trợ VBScript (Visual Basic Script) trên Comfort Panels và WinCC Advanced
- Hỗ trợ JavaScript (C-Script) trên một số hệ thống cao cấp
- Tự động hóa các tác vụ HMI: xuất file, thao tác chuỗi, vòng lặp phức tạp
- Kích hoạt Script dựa trên sự kiện: nhấn nút, thay đổi giá trị Tag, hoặc theo thời gian
- Lưu ý: Không nên lạm dụng Script để thay thế logic điều khiển PLC

#### 12.11 Xuất báo cáo PDF/Excel

Tự động trích xuất và lưu trữ dữ liệu vận hành để phục vụ cho công tác báo cáo và quản lý chất lượng.

- DataLogs: ghi lại dữ liệu quá trình và báo động vào thẻ nhớ SD hoặc USB
- Định dạng file xuất ra thường là CSV, dễ dàng xử lý trên Excel
- Thiết kế báo cáo sản xuất tự động với tính năng Print Reports
- Xuất báo cáo dưới định dạng PDF hoặc gửi trực tiếp đến máy in qua mạng
- Ứng dụng: Báo cáo số lượng sản phẩm theo ca, nhật ký nhiệt độ kho lạnh

**Review:**

- Sự khác nhau giữa KTP Basic Panel và TP Comfort Panel là gì?
- HMI Tag và PLC Tag kết nối với nhau như thế nào?
- Tại sao nên dùng màu xám làm nền HMI thay vì màu trắng hay đen?
- Cấu hình alarm cho cảm biến nhiệt độ: Warning khi > 80°C, Error khi > 95°C.
- Recipe dùng để làm gì? Cho ví dụ ứng dụng thực tế trong sản xuất.
- Sự khác biệt giữa Discrete Alarm và Analog Alarm là gì?
- Khi cấu hình Tag trên HMI, chu kỳ cập nhật (Acquisition cycle) ảnh hưởng như thế nào đến hệ thống?
- Scripting trong WinCC nên được sử dụng trong những trường hợp nào thay vì lập trình PLC?

### `13-scada`

**Overview:** SCADA (Supervisory Control And Data Acquisition) là hệ thống giám sát và thu thập dữ liệu cấp cao nhất trong tự động hóa. WinCC SCADA/Runtime Advanced của Siemens cho phép giám sát toàn nhà máy, lưu trữ lịch sử và phân tích dữ liệu.

**Objectives:**

- Hiểu kiến trúc hệ thống SCADA và vị trí trong tháp tự động hóa
- Tạo project WinCC SCADA kết nối với PLC qua OPC UA
- Cấu hình data logging, historical trends và alarm logging
- Thiết kế màn hình giám sát tổng quan nhà máy
- Cấu hình user administration và báo cáo tự động

**Sections:**

#### 13.1 Kiến trúc tháp tự động hóa

Hệ thống tự động hóa được tổ chức theo 5 cấp: Field Level (cảm biến, thiết bị chấp hành) → Control Level (PLC, DCS) → Supervisory Level (SCADA, HMI) → MES (Manufacturing Execution System) → ERP (Enterprise Resource Planning).

- Field Level: cảm biến, encoder, van, motor, PB...
- Control Level: PLC/DCS xử lý điều khiển thời gian thực
- Supervisory Level: SCADA giám sát, lưu trữ, báo cáo
- MES Level: lập lịch sản xuất, quản lý chất lượng, OEE
- ERP Level: SAP, Oracle — quản lý doanh nghiệp
- SCADA kết nối Control Level (OPC UA, Modbus, PROFINET)

#### 13.2 Tạo project WinCC SCADA

WinCC Runtime Advanced chạy trên PC Windows, kết nối với PLC qua OPC UA hoặc S7 Protocol. Project bao gồm: Tag Management, Graphics, Alarms, Trends, Users, Scripts.

- WinCC Runtime Advanced: single-server SCADA trên PC
- WinCC Runtime Professional: multi-server, client-server, lớn hơn
- Kết nối: SIMATIC S7-1500 OPC UA Server → WinCC OPC UA Client
- Tag Management: ánh xạ PLC tag sang WinCC internal tag
- Acquisition: đặt chu kỳ cập nhật (100ms đến 10 phút tùy tag)
- Archiving: lưu giá trị tag vào database SQL tự động

#### 13.3 Data Logging và Historical Trends

Data Logging tự động ghi lại giá trị tag theo chu kỳ hoặc theo sự kiện. Historical Trend hiển thị dữ liệu lịch sử để phân tích quá trình.

- Process Tag Archive: lưu giá trị analog (nhiệt độ, áp suất...) theo chu kỳ
- Compressed archive: nén dữ liệu lâu dài (giờ, ngày, tháng)
- Alarm archive: lưu lịch sử alarm với timestamp
- User archive: lưu thao tác của người vận hành (audit trail)
- Historical trend control: hiển thị đồ thị từ database
- Lưu trữ: SQL Server hoặc file-based (CSV)

#### 13.4 Báo cáo và xuất dữ liệu

SCADA tự động tạo báo cáo và xuất dữ liệu theo lịch hoặc theo yêu cầu. Tích hợp với Excel, PDF, email.

- Report designer: thiết kế mẫu báo cáo (template)
- Scheduled report: tự động tạo báo cáo theo giờ/ngày/tháng
- Excel export: xuất dữ liệu lịch sử sang Excel để phân tích
- PDF export: tạo báo cáo PDF gửi qua email
- OEE report: tính toán Overall Equipment Effectiveness
- Energy report: theo dõi tiêu thụ điện, hơi, nước

#### 13.5 IIoT và kết nối Cloud

Xu hướng hiện đại: kết nối SCADA lên cloud để phân tích dữ liệu lớn, AI/ML và remote monitoring. Siemens MindSphere là nền tảng IoT công nghiệp của Siemens.

- OPC UA: giao thức chuẩn mở để kết nối lên cloud
- MQTT: giao thức nhẹ, phổ biến trong IoT (AWS IoT, Azure IoT Hub)
- MindSphere: nền tảng IoT của Siemens, phân tích trên cloud
- Edge computing: xử lý dữ liệu tại chỗ trước khi gửi lên cloud
- Siemens Industrial Edge: thiết bị edge tích hợp với TIA Portal
- Ứng dụng AI: dự đoán bảo trì (predictive maintenance)

> SCADA truyền thống cần bảo mật nghiêm ngặt: không kết nối trực tiếp internet, tách mạng OT khỏi IT, cập nhật security patch thường xuyên.

**Review:**

- SCADA và HMI khác nhau ở điểm gì? Cần cả hai không?
- Vẽ sơ đồ kiến trúc hệ thống: Cảm biến → PLC → HMI → SCADA → MES.
- Data Logging lưu dữ liệu ở đâu? Chu kỳ lưu thông thường là bao nhiêu?
- Tại sao mạng OT (Operation Technology) phải tách biệt với mạng IT?
- OPC UA ưu điểm gì so với OPC DA (classic OPC)?

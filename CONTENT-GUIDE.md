# Hướng Dẫn Biên Soạn Nội Dung — Giáo Trình Điện Tử PLC S7-1200

Tài liệu này hướng dẫn cách thêm bài học, thêm chuyên đề (topic), biên tập nội dung, thêm hình ảnh, câu hỏi trắc nghiệm và kiểm tra chất lượng trước khi xuất bản.

---

## 1. Kiến trúc thư mục nội dung (`src/content/`)

Nguyên tắc cốt lõi: **Mỗi chuyên đề (topic) = 1 file độc lập.** Giao diện web chỉ hiển thị những trường có dữ liệu thật — tuyệt đối không sinh chữ mẫu hay hộp trống.

```text
src/content/
├── index.ts                      ← Tự động sinh (KHÔNG sửa tay)
├── _template/
│   └── topic.ts                  ← File mẫu có chú thích đầy đủ các trường
├── 01-programmable-control/
│   ├── _lesson.ts                ← Thông tin bài học + thứ tự topic (topicOrder)
│   ├── control-system-basics.ts  ← Nội dung chuyên đề 1.1
│   ├── loop-types.ts             ← Nội dung chuyên đề 1.2
│   └── ...
└── ... (15 bài học từ 01 đến 15)
```

---

## 2. Các thao tác thường dùng

### 2.1. Thêm một chuyên đề (topic) mới vào bài đã có

Chạy lệnh:

```bash
npm run new:topic -- <lesson-slug> <topic-slug> "<Tiêu đề chuyên đề>"
```

**Ví dụ:**

```bash
npm run new:topic -- 03-binary-operations edge-detection "Phát hiện sườn xung P_TRIG và N_TRIG"
```

Lệnh này tự động:
1. Sao chép mẫu từ `src/content/_template/topic.ts` sang `src/content/<lesson-slug>/<topic-slug>.ts` với `status: 'draft'`.
2. Thêm `<topic-slug>` vào cuối mảng `topicOrder` trong `src/content/<lesson-slug>/_lesson.ts`.
3. Chạy lại bộ lập chỉ mục để cập nhật `src/content/index.ts`.

> **Lưu ý về số thứ tự mục (`1.1`, `1.2`...):** Bạn **không** cần điền số thứ tự vào tiêu đề. Hệ thống tự động đánh số dựa trên `lesson.id` và vị trí của topic trong mảng `topicOrder`. Để đổi thứ tự hiển thị, chỉ cần sắp xếp lại mảng `topicOrder` trong `_lesson.ts`.

---

### 2.2. Thêm một bài học (chương) mới

Chạy lệnh:

```bash
npm run new:lesson -- <số-thứ-tự> <lesson-slug> "<Tiêu đề bài học>"
```

**Ví dụ:**

```bash
npm run new:lesson -- 16 16-industrial-iiot "Kết nối PLC với hệ thống IIoT và MQTT"
```

Lệnh này tự động tạo thư mục `src/content/<lesson-slug>/`, khởi tạo file `_lesson.ts` và cập nhật `src/content/index.ts`.

---

### 2.3. Sửa nội dung, thêm hình ảnh và câu hỏi Quiz

Mở trực tiếp file `src/content/<lesson-slug>/<topic-slug>.ts`:

- **Sửa chữ (`summary`, `body`, `slides`):**
  - `summary`: Tóm tắt ngắn 1–2 câu (≤ 200 ký tự), hiện ở mục lục chương.
  - `body`: Mảng các mục kiến thức (`heading`, `text`, `keyPoints`, `note`).
  - `slides`: Nếu topic có mảng `slides`, chế độ trình chiếu (Slide Deck) sẽ ưu tiên hiển thị theo `slides`. Nếu không khai báo `slides`, hệ thống tự động dựng slide từ `body` và `quiz`.
- **Thêm hình ảnh (`figures`):**
  1. Đặt file ảnh vào thư mục `public/images/...` (ví dụ: `public/images/slides/03-binary-operations/ton-timing.png`).
  2. Khai báo trong `figures` với đường dẫn **bắt đầu bằng `/images/...` (KHÔNG ghi `/plc-textbook` hay `public/`)**:
     ```ts
     figures: [
       {
         src: '/images/slides/03-binary-operations/ton-timing.png',
         caption: 'Hình 3.3: Giản đồ thời gian của bộ định thời TON khi ngõ vào IN duy trì đủ PT.',
         alt: 'Giản đồ xung TON S7-1200',
       },
     ],
     ```
- **Thêm câu hỏi trắc nghiệm (`quiz`):**
  - Mỗi chuyên đề cần tối thiểu **3–4 câu hỏi** (`q`, `options`, `answer`, `explain`).
  - `answer` là chỉ số bắt đầu từ `0` (`0` = A, `1` = B, `2` = C, `3` = D).
  - Rải đều vị trí đáp án đúng (A, B, C, D) — **không để quá 60% câu hỏi rơi vào cùng một đáp án**.
- **Thêm tình huống thực tế (`caseStudy`):**
  - Chỉ điền khi có bài toán thực tế tại nhà máy/trạm hiện trường (`title`, `context`, `hardware`, `pitfall`).

---

## 3. Quy ước hành văn và thuật ngữ kỹ thuật

1. **Giọng giảng viên kỹ thuật:**
   - Viết rõ ràng, súc tích, đi thẳng vào bản chất kỹ thuật và thao tác đấu nối / lập trình thực tế tại xưởng.
   - Mỗi đoạn văn (`body[].text`) chỉ nên dài 3–5 câu ngắn.
2. **Luôn gắn với địa chỉ và phần cứng thật của Siemens S7-1200 / TIA Portal:**
   - Dùng đúng cú pháp vùng nhớ: ngõ vào số `%I0.0`, `%I0.1`; ngõ ra số `%Q0.0`, `%Q0.1`; vùng nhớ cờ `%M0.0`, `%MW10`; ngõ vào/ra tương tự `%IW64`, `%QW80`; khối dữ liệu `DB1`, `OB1`, `OB30`, `FB`, `FC`.
   - Khi nhắc tới phần cứng, nêu mã hoặc thông số thực tế (ví dụ: `CPU 1214C DC/DC/DC`, `SM 1231 AI 4x13 bit`, nguồn `24VDC`, dòng `4–20mA`, kháng trở đầu cuối `120 Ω`).
3. **Tuyệt đối tránh từ ngữ quảng cáo / phô trương hoặc chữ giả:**
   - **CẤM dùng:** `Master`, `Comprehensive`, `Ultimate`, `Cutting-edge`, `"Bàn mô phỏng tương tác"`, `"Hệ thống học tập toàn diện"`, hoặc các đoạn văn mẫu chung chung không có hàm lượng kỹ thuật.
   - Mục nào chưa có nội dung (ví dụ chưa có `formula`, `caseStudy`, `narration` hay `simulator`) thì **bỏ trống trường đó** (không khai báo hoặc comment lại) để giao diện tự ẩn.

---

## 4. Quy trình trạng thái: `draft` → `review` → `published`

Mỗi topic có trường `status` điều khiển việc xuất bản:

| Trạng thái | Ý nghĩa | Hiển thị ở `npm run dev` | Hiển thị trên bản Build Production |
|---|---|---|---|
| `'draft'` | Mới tạo khung, đang soạn dở | Có | **Ẩn hoàn toàn** |
| `'review'` | Đã có nội dung để rà soát trên web, đang bổ sung đủ chuẩn | Có | Có |
| `'published'` | Đã nghiệm thu hoàn chỉnh (đủ `summary`, `body`, `quiz ≥ 3`, không lệch đáp án, không còn `TODO(migrate)`) | Có | Có |

Trước khi đẩy code hoặc chuyển một topic sang `'published'`, bắt buộc chạy:

```bash
npm run check:content
npx tsc --noEmit
```

Nếu một topic đặt `status: 'published'` nhưng thiếu `body`, thiếu `summary`, còn `TODO(migrate)`, có `< 3` câu quiz hoặc lệch đáp án `> 60%`, lệnh `npm run check:content` sẽ **báo lỗi đỏ và chặn CI/CD**.

---

## 5. Prompt mẫu giao AI soạn 1 chuyên đề (Topic)

Khi giao AI (Claude / Antigravity / GPT) biên soạn một chuyên đề từ slide bài giảng, hãy sử dụng mẫu prompt chuẩn sau:

```text
Soạn topic <slug> của bài <lesson-slug>, file src/content/<lesson-slug>/<slug>.ts,
đúng schema TopicContent (export default { ... } satisfies TopicContent).
Nguồn: slide <tên file/trang> (dán bên dưới).
Yêu cầu: body 3–5 đoạn ngắn giọng giảng viên, có ví dụ địa chỉ thật trên S7-1200;
quiz 4 câu, đáp án đúng rải đều A–D, đáp án nhiễu hợp lý;
figures chỉ dùng ảnh đã có trong public/images/slides/<lesson-slug>/. status: 'review'.
Chỉ sửa đúng file này. Chạy npm run check:content, push nhánh content/<slug>, mở PR.
```

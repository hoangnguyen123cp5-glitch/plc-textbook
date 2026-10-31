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
npm run new:topic -- 03-binary-operations edge-detection "Edge Detection with P_TRIG and N_TRIG"
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
npm run new:lesson -- 16 16-industrial-iiot "Connecting PLCs to IIoT Systems with MQTT"
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
         caption: 'Figure 3.3: TON timing diagram when input IN stays TRUE for the full preset time PT',
         alt: 'S7-1200 TON timing diagram',
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

---

## 6. Quy chuẩn slide bài giảng (Slide Standard)

Áp dụng mỗi khi soạn hoặc sửa mảng `slides` của một topic. **Bài mẫu: `02-s7-1200-tia-portal`** — khi phân vân, mở bài 02 ra làm theo.

### 6.1. Nguyên tắc: slide gốc là chuẩn nội dung, web là cách trình bày

Bộ slide tiếng Việt của giảng viên trong thư mục `Slide/` là **chuẩn về nội dung**. Mảng `slides` trên web là **cách trình bày bằng tiếng Anh** của đúng nội dung đó.

| Lấy từ slide gốc (bắt buộc bám) | KHÔNG lấy từ slide gốc |
|---|---|
| Phạm vi: dạy những gì, không thêm/bớt ý chính | Câu chữ tiếng Việt — viết lại bằng tiếng Anh, không dịch từng câu |
| Thứ tự ý giảng trong mỗi mục | Bố cục PowerPoint — web có khuôn `concept` / `diagram` / `quiz` riêng |
| Số liệu, mã thiết bị, phím tắt, thao tác TIA Portal | Lỗi chính tả, thông tin đã lỗi thời (ghi chú lại trong PR nếu bỏ) |
| Hình ảnh trích từ chính bộ slide | |

Tra file nguồn của từng bài trong `src/data/slide-index.ts`.

### 6.2. Chuẩn bị nguồn

1. File `.ppt` (đời cũ) **không đọc được** — đổi sang `.pptx` trước:
   ```bash
   soffice --headless --convert-to pptx --outdir Slide/ "Slide/<tên file>.ppt"
   ```
2. Trích chữ và đọc file JSON tương ứng (không commit `dev/extracts/`):
   ```bash
   python scripts/ingest/extract.py
   ```
3. Lập bảng ánh xạ **slide gốc số mấy → topic nào** trước khi viết. Không có nguồn đọc được thì **dừng lại báo**, không tự soạn theo trí nhớ.

### 6.3. Khuôn một topic

Thứ tự trong mảng `slides`:

```text
concept × 3–5   (theo đúng thứ tự ý trong slide gốc)
diagram × 0–1   (chỉ khi slide gốc có sơ đồ/ảnh chụp màn hình then chốt)
quiz    × đúng bằng quiz.length (questionIndex 0, 1, 2, …)
```

- Trình chiếu **tự thêm** slide `caseStudy` và `simulator` từ các trường riêng → **không** khai báo chúng trong `slides`.
- **Không** dùng `practice` nếu chưa có video YouTube thật (id hợp lệ).
- Bài 02 tham khảo: 7–8 slide/topic (3–5 concept, 0–1 diagram, 3 quiz).

### 6.4. Định lượng từng loại slide

| Trường | Quy chuẩn | Bài 02 thực tế |
|---|---|---|
| `title` | Tiếng Anh, ≤ 65 ký tự, không đánh số "1.3" ở đầu, nêu đúng ý của slide | 27–63 ký tự |
| `points` (concept) | 3–5 ý, mỗi ý 1 dòng ≤ 90 ký tự, mỗi ý chứa một dữ kiện cụ thể (số liệu, mã, thao tác) | 4 ý, 54–87 ký tự |
| `explain` (concept) | 250–450 ký tự, 2–4 câu, giọng giảng viên, giải thích *vì sao/khi nào*, không lặp lại `points` | 239–460 ký tự |
| `explain` (diagram) | ≤ 300 ký tự: nhìn vào đâu trên hình, rút ra điều gì | ~240–280 ký tự |
| `quiz` slide | `title: "Quick Check"`, chỉ trỏ `questionIndex`, không viết lại câu hỏi | — |

Không viết các câu nhắc tới nguồn kiểu *"Following the lecture sequence for Section 1.5…"*, *"as shown in the original slide…"* — sinh viên không thấy slide gốc.

### 6.5. Hình ảnh

1. Chỉ dùng ảnh **đã có** trong `public/images/slides/<lesson-slug>/` hoặc `public/images/diagrams/`. Không bịa đường dẫn.
2. Tên file `PLC___Slide__NNN` là **số thứ tự ảnh trích ra, KHÔNG phải số trang slide** → bắt buộc **mở ảnh ra xem** trước khi gắn.
3. `caption` (tiếng Anh, ≤ 100 ký tự) mô tả **đúng cái ảnh thể hiện**, không mô tả điều slide muốn nói.
4. **Không dùng một ảnh hai lần** trong cùng một bài.
5. Không có ảnh phù hợp → **bỏ `figure`**. Thà không có hình còn hơn hình sai.
6. Hạn chế ảnh có chữ tiếng Việt bên trong; nếu buộc phải dùng, caption tiếng Anh giải thích đủ.

### 6.6. Ngôn ngữ và độ chính xác

- Toàn bộ chữ hiển thị bằng **tiếng Anh**. Tiếng Việt chỉ được phép trong chú thích code và trong `narration.vi`.
- Thuật ngữ giữ đúng như giao diện TIA Portal tiếng Anh (Project view, Device configuration, Diagnostics buffer, PLC tags…).
- Mọi số liệu, mã module, phím tắt phải có trong slide gốc hoặc tài liệu Siemens. Không chắc → bỏ, không đoán.

### 6.7. Phạm vi một lần slide hóa

- Chỉ sửa mảng `slides` (và `title` topic nếu tiêu đề cũ sai nội dung — **không đổi `slug`**).
- **Không** đụng `body`, `quiz`, `caseStudy`, `narration`, `figures`, `summary`, `src/types/content.ts`, `next.config.mjs`; không thêm dependency.
- Một bài = một nhánh `content/lesson-NN-slides` = một PR.

### 6.8. Checklist nghiệm thu (tự kiểm trước khi mở PR)

- [ ] Có bảng ánh xạ slide gốc → topic, phủ hết các trang có nội dung
- [ ] Mỗi topic: 3–5 concept, 0–1 diagram, đủ slide quiz cho mọi `questionIndex`
- [ ] Đã mở xem từng ảnh; caption đúng ảnh; không ảnh nào lặp trong bài
- [ ] Số liệu/mã/phím tắt đều tra được trong slide gốc
- [ ] Không còn chữ tiếng Việt hiển thị; không câu nào nhắc "slide gốc/lecture sequence"
- [ ] `git diff --stat` chỉ gồm file `src/content/<lesson-slug>/*.ts`
- [ ] `npx tsc --noEmit` và `npm run check:content` đạt

**Mô tả PR** gồm: (1) bảng `Slide gốc | Mục | Topic | Các slide mới`, (2) danh sách ảnh đã gắn cho từng slide, (3) những gì trong slide gốc bị bỏ và lý do, (4) kết quả hai lệnh kiểm tra.

### 6.9. Prompt mẫu giao AI slide hóa một bài

```text
Slide hóa bài <lesson-slug> theo CONTENT-GUIDE.md mục 6 (Slide Standard), bài mẫu 02-s7-1200-tia-portal.
Nguồn: file trong src/data/slide-index.ts của bài này (.ppt thì đổi sang .pptx trước, theo 6.2).
Làm trên nhánh content/lesson-<NN>-slides, tách từ nhánh chính đang dùng.
Chỉ sửa mảng slides (6.7). Tự chạy checklist 6.8, mở PR với mô tả đúng mẫu 6.8.
```

# AI Rules — PLC Textbook Project

> **Đọc file này TRƯỚC khi làm bất cứ thứ gì trong project.**
> Mọi AI agent (Antigravity, Claude, GPT...) phải tuân theo.
> Xem thêm hướng dẫn biên soạn chi tiết tại [`CONTENT-GUIDE.md`](./CONTENT-GUIDE.md).

---

## 🔴 KHÔNG BAO GIỜ được làm

| Cấm | Lý do |
|-----|-------|
| Đổi slug của bài học (`_lesson.ts`) hoặc chuyên đề (`<topic>.ts`) đã xuất bản | Slug là URL — đổi là 404 toàn bộ |
| Sửa nhiều file topic cùng lúc khi chỉ được giao 1 topic | Mỗi phiên AI chỉ được phép sửa đúng file topic được giao |
| Bịa chữ mẫu / placeholder / hộp trống hoặc từ ngữ phô trương (`Master`, `Comprehensive`, `"Bàn mô phỏng tương tác"`) | Giao diện chỉ hiện cái gì có dữ liệu thật |
| Xóa/rename file đang dùng hoặc sửa trực tiếp `src/content/index.ts` bằng tay | `src/content/index.ts` được sinh tự động qua script |
| Thêm dependency mới vào `package.json` | Hỏi chủ project trước |
| Sửa `next.config.mjs` | Ảnh hưởng build/deploy |
| Tự ý tạo route mới trong `app/` | Phải có approval |
| Sửa `globals.css` phần CSS variable | Ảnh hưởng toàn bộ theme |
| Push thẳng lên nhánh `main` / `master` | Phải làm trên nhánh riêng và mở PR qua kiểm tra CI |

## 🟡 Phải xin phép trước

- Thay đổi cấu trúc dữ liệu (`src/types/content.ts`, `src/types/lesson.ts`)
- Refactor component giao diện hoặc file lớn (>200 dòng)
- Thêm trang mới (`/simulator`, `/quiz`...)
- Thay đổi logic trong `src/lib/lessons.ts` hoặc `scripts/`

## 🟢 Được phép làm (trong phạm vi được giao)

- Biên soạn / cập nhật nội dung bài học và chuyên đề trong `src/content/<lesson-slug>/<topic-slug>.ts`
- Tạo chuyên đề mới bằng `npm run new:topic -- <lesson-slug> <topic-slug> "<tiêu đề>"` (khi được yêu cầu)
- Tạo bài học mới bằng `npm run new:lesson -- <số> <slug> "<tiêu đề>"` (khi được yêu cầu)
- Sửa animation trong `src/components/animations/` (khi được giao)
- Fix lỗi TypeScript hoặc lỗi `npm run check:content` rõ ràng

---

## 📁 Cấu trúc file — Nguồn sự thật (`src/content/`)

```text
src/
├── content/                        ← NGUỒN DỮ LIỆU DUY NHẤT (AI được sửa nội dung tại đây)
│   ├── index.ts                    ← Map tổng hợp & helper (TỰ SINH bằng npm run build:content-index)
│   ├── _template/
│   │   └── topic.ts                ← Mẫu chuyên đề kèm chú thích tiếng Việt
│   └── <lesson-slug>/              ← 1 thư mục cho mỗi bài học
│       ├── _lesson.ts              ← Metadata bài học + mảng topicOrder (satisfies LessonContentFile)
│       └── <topic-slug>.ts         ← Nội dung 1 chuyên đề độc lập (satisfies TopicContent)
├── types/
│   ├── content.ts                  ← Schema chuẩn TopicContent, LessonContentFile, Slide (hỏi trước khi sửa)
│   └── lesson.ts                   ← Type tương thích giao diện
├── lib/
│   └── lessons.ts                  ← Adapter đọc từ src/content/ cấp cho UI
└── components/animations/          ← Animation / Simulator components
```

> **Lưu ý:** Các file cũ trong `src/data/` (`lesson-content.ts`, `topic-case-studies.ts`, `narration/`, `video-index.ts`) chỉ giữ lại để đối chiếu lịch sử — web KHÔNG còn đọc từ `src/data/`. Mọi cập nhật nội dung phải thực hiện trong `src/content/`.

---

## 🔑 Danh sách 15 Slug bài học thật (KHÔNG ĐƯỢC THAY ĐỔI)

```text
01-programmable-control     02-s7-1200-tia-portal       03-binary-operations
04-numeric-operations       05-analog-signals           06-other-plc-brands
07-system-design            08-advanced-instructions    09-high-speed-counting
10-closed-loop-pid          11-communication            12-fault-diagnostics
13-s7-300                   14-system-upgrade           15-system-integration
```

---

## ✅ Quy tắc bắt buộc cho mỗi phiên AI soạn bài

1. **Đúng phạm vi 1 file:** Mỗi phiên AI chỉ sửa **đúng file topic được giao** (`src/content/<lesson-slug>/<topic-slug>.ts`). Không tự ý đụng sang bài khác.
2. **Đúng chuẩn kỹ thuật S7-1200:** Giọng giảng viên, câu ngắn gọn, có ví dụ địa chỉ thật (`%I0.0`, `%Q0.0`, `%M0.0`, `%IW64`, `DB1`...), quiz ≥ 3–4 câu rải đều đáp án A–D, chỉ dùng ảnh có thật trong `public/`.
3. **Luôn chạy kiểm tra trước khi báo hoàn thành:**
   ```bash
   npm run check:content
   npx tsc --noEmit
   ```
   Chỉ khi cả 2 lệnh trên không có lỗi mới được commit và báo cáo hoàn thành.

---

## 🔄 Quy trình làm việc với AI

```text
1. Làm việc trên nhánh tính năng / nội dung (ví dụ: content-refactor hoặc content/<slug>)
2. Giao việc rõ phạm vi: "Chỉ sửa file src/content/<lesson-slug>/<topic-slug>.ts"
3. AI làm xong → chạy npm run check:content & npx tsc --noEmit → commit & push nhánh
4. GitHub Actions tự động gác cổng (tsc + check:content + build)
```

---

*Cập nhật lần cuối: 2026-10-31 (GĐ4 — Công cụ soạn bài & gác cổng tự động)*

# AI Rules — PLC Textbook Project

> **Đọc file này TRƯỚC khi làm bất cứ thứ gì trong project.**
> Mọi AI agent (Antigravity, Claude, GPT...) phải tuân theo.

---

## 🔴 KHÔNG BAO GIỜ được làm

| Cấm | Lý do |
|-----|-------|
| Đổi slug của lesson trong `lib/lessons.ts` | Slug là URL — đổi là 404 toàn bộ |
| Xóa/rename file đang dùng | Kiểm tra import trước |
| Thêm dependency mới vào `package.json` | Hỏi chủ project trước |
| Sửa `next.config.mjs` | Ảnh hưởng build/deploy |
| Tự ý tạo route mới trong `app/` | Phải có approval |
| Sửa `globals.css` phần CSS variable | Ảnh hưởng toàn bộ theme |

## 🟡 Phải xin phép trước

- Thay đổi cấu trúc dữ liệu (`types/`, interfaces)
- Refactor file lớn (>200 dòng)
- Thêm trang mới (`/simulator`, `/quiz`...)
- Thay đổi logic trong `lib/lessons.ts`

## 🟢 Được phép tự làm

- Thêm/sửa nội dung trong `data/lesson-content.ts`
- Thêm/sửa narration trong `data/narration/`
- Sửa animation trong `components/animations/`
- Sửa styling inline (không phải CSS biến)
- Thêm section mới vào lesson đã có
- Fix lỗi TypeScript rõ ràng

---

## 📁 Cấu trúc file — Nguồn sự thật

```
src/
├── lib/lessons.ts          ← SLUG SOURCE OF TRUTH — không được đổi slug
├── data/lesson-content.ts  ← Nội dung bài học (được sửa)
├── data/narration/         ← Script lời nói từng slide (được sửa)
│   ├── index.ts            ← Map tổng hợp (tự sinh)
│   └── [lesson-slug].ts    ← 1 file per lesson
├── types/lesson.ts         ← Type definitions (hỏi trước khi sửa)
└── components/animations/  ← Animation components (được sửa)
```

## 🔑 Slug hiện tại (KHÔNG ĐƯỢC THAY ĐỔI)

```
01-programmable-control     02-s7-1200-tia-portal
03-binary-operations        04-word-operations
05-data-handling            06-program-organization
07-hmi-scada                08-analog-signals
09-closed-loop-control      10-communication-networks
11-advanced-programming     12-motion-control
13-diagnostics              14-safety-systems
15-capstone-project
```

---

## 🔄 Quy trình làm việc với AI

```
1. git commit trước khi giao việc cho AI
2. Mô tả RÕ RÀNG phạm vi: "Chỉ sửa file X, không đụng file Y"
3. AI làm xong → review diff → git commit nếu OK
4. Nếu AI làm sai: git checkout . để revert
```

## 💬 Lệnh git nhanh

```bash
# Trước mỗi phiên AI
git add . && git commit -m "checkpoint: [mô tả]"

# Xem AI thay đổi gì
git diff

# Revert nếu AI làm hỏng
git checkout .

# Xem lịch sử
git log --oneline
```

---

*Cập nhật lần cuối: 2026-10-10*

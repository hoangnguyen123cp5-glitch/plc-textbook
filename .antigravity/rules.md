# Workspace Rules — PLC Textbook
# Antigravity sẽ tự động đọc file này mỗi phiên làm việc

## Project context
Đây là web textbook PLC Programming cho VNU-IS, dùng Next.js 16 + Turbopack.
Chủ project: Hoàng Nguyễn (giảng viên).

## Quy tắc BẮT BUỘC

1. **KHÔNG BAO GIỜ đổi slug** trong `src/lib/lessons.ts`. Slug là URL, đổi = 404.
2. **KHÔNG sửa** `next.config.mjs`, `package.json`, `globals.css` (CSS variables) trừ khi được yêu cầu rõ ràng.
3. **Trước khi sửa** file lớn → đọc nội dung hiện tại trước.
4. **Dynamic import** với `ssr: false` chỉ dùng trong `'use client'` component.
5. **Khi thêm section** vào `lesson-content.ts` → KHÔNG xóa section cũ, chỉ append.

## Slug hiện tại (NGUỒN SỰ THẬT)
- 01-programmable-control, 02-s7-1200-tia-portal, 03-binary-operations
- 04-word-operations, 05-data-handling, 06-program-organization  
- 07-hmi-scada, 08-analog-signals, 09-closed-loop-control
- 10-communication-networks, 11-advanced-programming, 12-motion-control
- 13-diagnostics, 14-safety-systems, 15-capstone-project

## Narration system
Script lời nói nằm trong `src/data/narration/[lesson-slug].ts`.
Format: `{ [topicSlug]: { vi: string, en?: string, duration?: number } }`.
Khi viết narration: CHỈ viết cho các topic chưa có (check `status: 'missing'`).

## Git workflow
- Commit tồn tại tại: `master` branch
- Trước mỗi thay đổi lớn: nhắc người dùng `git commit` trước

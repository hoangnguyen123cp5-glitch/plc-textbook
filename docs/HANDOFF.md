# HANDOFF — plc-textbook (cập nhật 31/10/2026)

Tài liệu bàn giao để AI khác (Claude / Antigravity / Gemini) làm tiếp. Đọc hết trước khi làm.

## 1. Dự án

- Repo: `hoangnguyen123cp5-glitch/plc-textbook` — giáo trình điện tử PLC Siemens S7-1200 (Next.js, xuất tĩnh lên GitHub Pages, basePath `/plc-textbook`).
- Nội dung: `src/content/<lesson-slug>/<topic>.ts` (15 bài, 66 topic). Quy chuẩn soạn: `CONTENT-GUIDE.md` (mục 6 = Slide Standard, đang ở nhánh `docs/slide-standard`).
- Slide bài giảng gốc (tiếng Việt): thư mục `Slide/`, tra file nguồn của từng bài ở `src/data/slide-index.ts`.
- Ảnh: `public/images/slides/<lesson-slug>/` (560 ảnh, 55 MB) + `public/images/diagrams/` (6). Tên `PLC___Slide__NNN` = **thứ tự ảnh trích ra, KHÔNG phải số trang slide**.
- Next.js bản mới, khác dữ liệu huấn luyện: đọc `node_modules/next/dist/docs/` trước khi sửa code (AGENTS.md).

## 2. Quyết định đã chốt (không hỏi lại)

1. **Giao diện và nội dung hiển thị: CHỈ TIẾNG ANH.** Tiếng Việt chỉ còn trong chú thích code và `narration.vi`.
2. **Slide gốc tiếng Việt là chuẩn nội dung** (phạm vi, thứ tự ý, số liệu, hình). Web viết lại bằng tiếng Anh, không dịch nguyên văn, không bịa số liệu.
3. **Bài mẫu slide hóa: `02-s7-1200-tia-portal`** (đã ĐẠT).
4. **Lời giảng (narration) là kho ĐỘC LẬP** với `src/content`: thư mục `narration/<lesson>/<NN>-<slug>.md` (YAML front matter + lời đọc tiếng Anh), quản lý bằng công cụ **Narration Studio** (Python + Streamlit). Xuất WAV + MP3 + SRT để chèn video.
5. Bỏ bộ 19 slide riêng của bài 10 (`LessonPaginatedPresentation`) nhưng **giữ file** làm nguồn cho bài 10.
6. Ghi chú phím N hiện `summary` (không dùng `narration.vi`), nhãn "Instructor Notes".
7. Luật chung: 1 ticket = 1 nhánh = 1 PR = 1 phạm vi; tách nhánh từ `main` mới nhất; không đụng `next.config.mjs`, dependency, `src/types/content.ts` nếu chưa được duyệt; không đổi slug; mở ảnh ra xem trước khi gắn; caption tả đúng ảnh; không dùng 1 ảnh 2 lần trong 1 bài.

## 3. Trạng thái nhánh

| Nhánh | Commit | Trạng thái |
|---|---|---|
| `main` | `928fccf` | Đang deploy. Còn giao diện tiếng Việt. Chưa có GĐ4. |
| `content-refactor` | `ed60516` | GĐ4 (`cb552b1`: CLI new:topic/new:lesson, `check:content`, CI gác cổng) + chuyển UI sang tiếng Anh (`ed60516`). **ĐẠT, CI xanh (run #46, #47). CHƯA merge vào main** (PR #1, #3 đã đóng; cần PR mới). |
| `docs/slide-standard` | `6ec22df` | Thêm mục 6 Slide Standard vào CONTENT-GUIDE. Chưa PR. |
| `content/lesson-02-slides` | `b2ddbf0` | Bài 02 slide hóa từ .pptx gốc. **ĐẠT** (đã sửa 3 hình sai, bỏ câu nhắc nguồn). Tách từ `content-refactor`. Chưa PR. |
| `content/lesson-03-slides` | `ed7542f` | Bài 03 slide hóa. Bám nguồn tốt, 13 hình đúng. **CẦN SỬA** (mục 5). Tách từ `main` → phải rebase lên `content-refactor`. Chưa PR. |
| `master` | `7ac9ec6` | Nhánh cũ, deploy từng lỗi. Bỏ qua. |
| `content/lesson-02-cases` | `42df996` | Đã merge (PR #2). |

**Thứ tự merge:** (1) `content-refactor → main` → (2) `docs/slide-standard` → (3) `content/lesson-02-slides` → (4) `fix/slide-layout` (khi có) → (5) các bài tiếp.

## 4. Số liệu chuẩn để kiểm (tại `content-refactor` + bài 02)

15 bài · 66 topic · 86 quiz · 66 narration.vi · 16 case study · 66 figure · 82 URL `/lessons/...` · build 89 trang · eslint 30 lỗi (không được tăng). Slug và URL không được đổi.

Cách kiểm đã dùng: `npx tsc --noEmit`; `npm run check:content`; `NODE_ENV=production NEXT_PUBLIC_BASE_PATH=/plc-textbook npm run build`; so từng trường topic (ngoài `slides`) với commit gốc; ghép ảnh + tiêu đề slide thành 1 tấm để soát hình; đổi `.ppt` sang `.pptx` (`soffice --headless --convert-to pptx`) rồi đọc text bằng python-pptx để đối chiếu nguồn.

## 5. Việc đang chờ (đã có lệnh, dán cho Antigravity)

**5.1 Bài 03 (`content/lesson-03-slides`)**
- Rebase lên `origin/content-refactor`.
- `set-reset.ts` quiz câu 0 SAI: gọi RS là reset-dominant. Đúng: **RS = Set-dominant (S1), SR = Reset-dominant (R1)**. Sửa câu hỏi, đáp án nhiễu hợp lý.
- `binary-application.ts`: E-Stop phải ngắt phần cứng, PLC chỉ chốt trạng thái lỗi; các ví dụ ứng dụng ghi "Example solution:" (slide gốc 35–37 chỉ là đề bài).
- Bổ sung quiz ≥ 3 câu/topic, rải đáp án A–D (nếu chủ dự án đồng ý gộp quiz — xem mục 7).
- Mở PR, mô tả theo CONTENT-GUIDE 6.8: bảng slide gốc 1–38 → topic; ghi trang 32 (RTC) bỏ vì thuộc bài 04, trang 16 (T_Delay S7-200) bỏ vì không áp dụng S7-1200.

**5.2 Sửa nhỏ trên `content-refactor`:** thêm lại tiêu đề "⚡ Featured Interactive Simulation" phía trên `LessonAnimationWrapper` trong `src/app/lessons/[slug]/page.tsx`; nhãn ghi chú N chỉ "Instructor Notes" (bỏ "(30s)"); KHÔNG xoá `LessonPaginatedPresentation.tsx`.

**5.3 `fix/slide-layout` (tách từ content-refactor, chỉ sửa `TopicSlideDeck.tsx`)**
- Điều hướng: slide mục lục đầu bài (mục x.y + trang bắt đầu); slide mở mục tự sinh đầu mỗi topic; dòng đầu "Lesson N › x.y Title"; chân slide "x.y · i/n" + "Slide k / K" (cả fullscreen F để quay OBS); thanh tiến độ chia đoạn theo topic; phím ←/→, Home/End.
- Bố cục: slide concept không hình đang **hiện points 2 lần** (trái + phải) và để trống nửa khung → bỏ trùng; ảnh < 600px phóng 2x, explain cạnh ảnh; quiz căn từ trên; caseStudy bỏ khung phải trống; đổi "Full Chapter (N slides)" → "Chapter Overview (N topics)".
- Chụp ảnh trước/sau.

**5.4 `fix/ladder-sim` (`src/components/animations/TIALadderAnimation.tsx`)**
- Lỗi kiến thức: bảng giám sát hiện `%I0.1 = 1` khi chưa bấm (nút NC vật lý) nhưng chương trình dùng tiếp điểm NC → động cơ không thể chạy. Sửa: nút STOP vật lý NC, chương trình dùng tiếp điểm **NO**, thêm chú thích fail-safe và nút giả lập đứt dây.
- Vẽ nhánh song song nối lại dây chính, thanh nguồn phải, cuộn dây sát phải; bỏ setState trong render; chữ ≥ 11px.
- Nên rà tương tự ~15 mô phỏng còn lại.

**5.5 Narration Studio (`tools/narration-studio`, tách từ main)**
Kho `narration/` + app Streamlit 4 trang (Library: số từ, thời lượng, trạng thái audio missing/ok/stale theo hash; Editor: sửa, nghe thử, duyệt; Batch: tạo audio cả bài; Export: zip WAV+SRT). Engine mặc định Gemini TTS `gemini-3.8-flash-tts` (key từ biến môi trường `GEMINI_API_KEY`, trả WAV 24 kHz → ffmpeg sang MP3 64 kbps), dự phòng `edge-tts` giọng en-US. Chuẩn hoá loudnorm -16 LUFS. `narration/manifest.json` commit; `exports/` vào .gitignore; MP3 vào `public/audio/<lesson>/<id>.mp3`. Có CLI song song (status/generate/export). Không đụng `src/`, không thêm npm dependency.

**5.6 Chuẩn bị nguồn**
- Đổi 5 file `.ppt` cũ sang `.pptx` (nguồn bài 01, 03, 04, 05, 06).
- Sửa bước trích (`scripts/ingest/extract.py` / `extract_ppt_images.py`) để mỗi trang slide ghi danh sách ảnh của nó (`"n": 57, "images": [...]`) → hết đoán ảnh.
- `scripts/ingest/map_to_lessons.py` còn ghi ra định dạng cũ `src/data/` → cần cập nhật hoặc bỏ.
- ~10 ảnh đang dùng có nhiều chữ tiếng Việt (sơ đồ bài 04, 05, 08, 11, 14; ví dụ `04-num_carved_029.png`, `05-ana_carved_031/032.png`, `11-communication/PLC___Slide__022.png`, `08-advanced-instructions/PLC___Slide__021.png`, `14-system-upgrade/PLC___Slide__001/002/014.png`) → thay hoặc vẽ lại.

## 6. Lộ trình còn lại (~27 ticket)

| Nhóm | Ticket |
|---|---|
| A. Dọn + merge | 5.2 sửa nhỏ (1) · merge 3 nhánh (1) |
| B. Nguồn | 5.6 đổi .ppt + map ảnh–trang (1) |
| C. Nội dung | Slide hóa (+ quiz ≥3) bài 01, 03–15: 14 ticket · rải lại đáp án bài 02 (1) |
| D. Giao diện | `fix/slide-layout` (1) · GĐ5 5a→5d tiếng Anh (4) — prompt gốc `quantriAI/plc-textbook/prompts/05-giao-dien.md`, dịch nhãn sang tiếng Anh, font Be Vietnam Pro + JetBrains Mono |
| E. Narration | Narration Studio (1) · trình phát audio trên web (1) |
| F. Hoàn thiện | `review → published` (1) · kiểm tổng + deploy (1) |

Ưu tiên slide hóa các bài đã có .pptx trước (07→15), rồi 01, 03–06 sau khi đổi .ppt. Bài 01 hiện có hình sai (Figure 1.1 là ảnh CPU; slide open/closed-loop gắn sơ đồ PID) và câu chữ màu mè → làm lại khi slide hóa.

## 7. Câu hỏi còn mở cho chủ dự án

1. Gộp bổ sung quiz vào ticket slide hóa? (cần sửa CONTENT-GUIDE 6.7 — hiện cấm đụng `quiz` khi slide hóa). Khuyến nghị: gộp.
2. Mở PR theo thứ tự ở mục 3?
3. Viết `WORKFLOW.md` (4 vai: chủ dự án / thợ AI / người kiểm Claude / CI; vòng đời ticket 7 bước; tối đa 2 vòng sửa) + mẫu issue/PR + tạo ~27 GitHub Issues?
4. Có dựng video tự động theo từng slide không (nếu có, lời giảng nên chia theo slide)?

## 8. Kiểm tra tự động định kỳ

Có scheduled task kiểm `content-refactor` và comment kết quả vào PR #1 (REST, tiếng Việt). PR #1 đã đóng → nên chuyển sang PR mới `content-refactor → main` khi mở. Comment kiểm `cb552b1` trên PR #1 đã được đính chính (cb552b1 chưa vào main).

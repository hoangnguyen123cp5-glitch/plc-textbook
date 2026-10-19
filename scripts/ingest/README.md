# Ingest — giáo trình → tài liệu phát triển

Pipeline nằm **ngoài** app Next.js. Không ghi vào `src/data/`. Không thêm npm dependency.

```
sources/  và  Slide/*.pptx|pdf
        →  extract.py  →  dev/extracts/*.json
        →  map_to_lessons.py
        →  dev/briefs/<slug>.md
        →  dev/drafts/<slug>.content.ts
        →  dev/drafts/<slug>.narration.ts
```

Sau khi review, **viết lại** tiếng Anh/lời nói, rồi mới copy thủ công vào:

- `src/data/lesson-content.ts`
- `src/data/narration/<slug>.ts`

Không merge draft tự động. Không đổi slug trong `src/lib/lessons.ts`.

## Cài Python deps (một lần)

Từ root repo:

```bash
python -m pip install -r scripts/ingest/requirements.txt
```

## Chạy

Mặc định đọc cả `sources/` và `Slide/` (thư mục slide gốc trên máy, gitignored).

```bash
python scripts/ingest/extract.py
python scripts/ingest/map_to_lessons.py --all
```

Ép một bài khi tên file không khớp `slide-index.ts`:

```bash
python scripts/ingest/map_to_lessons.py --file "Slide/phy PLC PROGRAMMING.pptx" --lesson 01-programmable-control
```

File `.ppt` cũ không đọc được — convert sang `.pptx` rồi chạy lại.

## Ưu tiên khoảng trống nội dung

Bài web chưa có `lesson-content.ts`: `06-other-plc-brands`, `07-system-design`, `13-s7-300`, `14-system-upgrade`.

## Giới hạn lần này

- Không OCR PDF scan
- Không đọc `.ppt` / `.docx`
- Không trích hình thành animation

# Source textbooks

Drop extra PPTX/PDF here. The ingest scripts also read the local `Slide/` folder (gitignored) so you do not have to copy the whole course set.

Accepted formats:

- `.pptx` — PowerPoint (preferred)
- `.pdf` — text-layer PDFs (no OCR in the first version)
- `.ppt` — old binary PowerPoint is **not** parsed; convert to `.pptx` first

```bash
python scripts/ingest/extract.py
python scripts/ingest/map_to_lessons.py --all
```

Force a lesson when the filename does not match `src/data/slide-index.ts`:

```bash
python scripts/ingest/map_to_lessons.py --file Slide/your-file.pptx --lesson 06-other-plc-brands
```

Do not paste extracted text into `src/data/`. Use `dev/briefs/` and `dev/drafts/` as working notes, then rewrite in English before merging.

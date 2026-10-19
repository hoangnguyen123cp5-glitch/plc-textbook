#!/usr/bin/env python3
"""Map extracted textbooks onto lesson slugs and write briefs + TypeScript drafts."""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from collections import defaultdict
from pathlib import Path

from common import (
    BRIEFS_DIR,
    DRAFTS_DIR,
    EXTRACTS_DIR,
    FILE_ALIASES,
    HEADING_RE,
    bulletish_lines,
    ensure_dirs,
    extract_json_path,
    find_source_file,
    iter_source_files,
    lesson_content_slugs,
    load_extract,
    normalize_name,
    parse_lessons,
    parse_slide_index,
    summarise,
    ts_string,
)
from extract import extract_one


REWRITE_NOTE = (
    "REWRITE from the source extract. Do not paste textbook wording into src/data/. "
    "Write original English for the web lesson."
)


def match_lesson_from_filename(filename: str, slide_index: dict[str, dict]) -> str | None:
    lower_name = Path(filename).name.lower()
    if lower_name in FILE_ALIASES:
        return FILE_ALIASES[lower_name]
    n_file = normalize_name(filename)
    stem = Path(filename).stem
    n_stem = normalize_name(stem)

    for slug, meta in slide_index.items():
        for listed in meta["files"]:
            n_listed = normalize_name(listed)
            n_listed_stem = normalize_name(Path(listed).stem)
            if n_file == n_listed or n_stem == n_listed_stem:
                return slug
            if n_listed_stem and (n_listed_stem in n_stem or n_stem in n_listed_stem):
                return slug

    slide_m = re.search(r"slide\s*(\d+(?:-\d+)?)", n_file)
    if slide_m:
        token = slide_m.group(1)
        hits = []
        for slug, meta in slide_index.items():
            for listed in meta["files"]:
                if re.search(rf"slide\s*{re.escape(token)}\b", normalize_name(listed)):
                    hits.append(slug)
                    break
        unique = list(dict.fromkeys(hits))
        if len(unique) == 1:
            return unique[0]
    return None


def heading_from_page(page: dict) -> str | None:
    blob = f"{page.get('title') or ''}\n{page.get('text') or ''}"
    for line in blob.splitlines():
        stripped = line.strip()
        m = re.match(r"^(\d+\.\d+)\b", stripped)
        if m:
            return m.group(1)
    m = HEADING_RE.search(blob)
    return m.group(1) if m else None


def assign_pages(pages: list[dict], topics: list[dict]) -> dict[str, list[dict]]:
    assigned: dict[str, list[dict]] = {t["slug"]: [] for t in topics}
    heading_to_slug = {t["heading"]: t["slug"] for t in topics if t.get("heading")}

    if heading_to_slug:
        current = topics[0]["slug"]
        for page in pages:
            found = heading_from_page(page)
            if found and found in heading_to_slug:
                current = heading_to_slug[found]
            assigned[current].append(page)
        return assigned

    if not topics:
        return assigned
    n = max(len(pages), 1)
    chunk = max(n // len(topics), 1)
    for i, topic in enumerate(topics):
        start = i * chunk
        end = n if i == len(topics) - 1 else min(n, (i + 1) * chunk)
        assigned[topic["slug"]] = pages[start:end]
    return assigned


def pages_text(pages: list[dict]) -> str:
    parts = []
    for page in pages:
        title = page.get("title") or ""
        body = page.get("text") or ""
        notes = page.get("notes") or ""
        block = "\n".join(p for p in (title, body, notes) if p)
        if block.strip():
            parts.append(block)
    return "\n".join(parts)


def content_exists(slug: str) -> bool:
    return slug in lesson_content_slugs()


def write_brief(
    lesson: dict,
    slide_meta: dict | None,
    sources: list[dict],
    assigned: dict[str, list[dict]],
    unmatched_files: list[str],
) -> Path:
    ensure_dirs()
    slug = lesson["slug"]
    path = BRIEFS_DIR / f"{slug}.md"
    total_pages = sum(src.get("pageCount", len(src.get("pages", []))) for src in sources)
    lines = [
        f"# Development brief — {lesson['title']}",
        "",
        f"- Web slug: `{slug}`",
        f"- Course: {lesson.get('course') or (slide_meta or {}).get('course') or '—'}",
        f"- Original lesson (slide index): {(slide_meta or {}).get('originalLesson', '—')}",
        f"- Source files: {', '.join(src['file'] for src in sources) or '—'}",
        f"- Extracted pages/slides: {total_pages}",
        f"- Web content already in `lesson-content.ts`: {'yes' if content_exists(slug) else 'NO — write this lesson'}",
        "",
        "Do not copy the extract into the live site. Rewrite original English, then paste into `src/data/`.",
        "",
        "## Topic map",
        "",
        "| Topic slug | Title | Pages | Heading on source |",
        "|---|---|---|---|",
    ]
    for topic in lesson["topics"]:
        pages = assigned.get(topic["slug"], [])
        nums = ", ".join(str(p["n"]) for p in pages[:12])
        if len(pages) > 12:
            nums += f" +{len(pages) - 12}"
        lines.append(
            f"| `{topic['slug']}` | {topic['title']} | {len(pages)} ({nums or '—'}) | {topic.get('heading') or '—'} |"
        )

    lines += ["", "## Key points from extract (trimmed)", ""]
    for topic in lesson["topics"]:
        text = pages_text(assigned.get(topic["slug"], []))
        points = bulletish_lines(text, limit=6)
        lines.append(f"### {topic['title']} (`{topic['slug']}`)")
        if points:
            for point in points:
                lines.append(f"- {point}")
        else:
            lines.append("- *(no extractable bullets — open the original file)*")
        lines.append("")

    if unmatched_files:
        lines += ["## Unmatched source files", ""]
        for name in unmatched_files:
            lines.append(f"- {name}")
        lines.append("")

    missing_headings = [t["slug"] for t in lesson["topics"] if not assigned.get(t["slug"])]
    lines += [
        "## Gaps",
        "",
        f"- Topics with no assigned pages: {', '.join(f'`{s}`' for s in missing_headings) or 'none'}",
        f"- Live `lesson-content.ts` entry: {'present' if content_exists(slug) else 'missing'}",
        "",
        "## Rewrite prompt",
        "",
        "Write original English teaching copy for this PLC web lesson.",
        f"Lesson: {lesson['title']} (`{slug}`).",
        "Fill: overview (1–2 paragraphs), 4–6 objectives, one section per topic below, and 5 review questions.",
        "Each section needs `content`, `keyPoints` (4–6), optional `note`.",
        "Also write spoken Vietnamese narration (50–80 words) per topic, starting with the topic name.",
        "Do not quote the source textbook at length. Teach the same ideas in new wording.",
        "",
        "Topics:",
    ]
    for topic in lesson["topics"]:
        lines.append(f"- `{topic['slug']}` — {topic['title']}")
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def write_content_draft(lesson: dict, assigned: dict[str, list[dict]], sources: list[dict]) -> Path:
    ensure_dirs()
    slug = lesson["slug"]
    path = DRAFTS_DIR / f"{slug}.content.ts"
    today = dt.date.today().isoformat()
    src_note = ", ".join(src["file"] for src in sources)
    objectives = [
        f"Explain {topic['title']}"
        for topic in lesson["topics"][:6]
    ]
    sections = []
    for topic in lesson["topics"]:
        text = pages_text(assigned.get(topic["slug"], []))
        points = bulletish_lines(text, limit=5) or [
            "Rewrite this section from the source slides in original English."
        ]
        pages = assigned.get(topic["slug"], [])
        page_ref = ", ".join(str(p["n"]) for p in pages[:8]) or "none"
        content = (
            f"{REWRITE_NOTE} Source pages: {page_ref}. "
            f"{summarise(text)}"
        )
        sections.append((topic, content, points))

    review = [
        f"What is the main idea of {topic['title']}?"
        for topic in lesson["topics"][:5]
    ]
    while len(review) < 5 and lesson["topics"]:
        review.append("Give a practical PLC example for this lesson.")

    out = []
    out.append("/**")
    out.append(f" * DRAFT — generated {today} from: {src_note or '(no files)'}")
    out.append(" * Review and rewrite, then copy into src/data/lesson-content.ts.")
    out.append(" * Do not merge this file automatically.")
    out.append(" */")
    out.append("")
    out.append("import type { LessonContent } from '@/data/lesson-content';")
    out.append("")
    out.append(f"export const draft: LessonContent = {{")
    out.append(f"  overview: {ts_string(REWRITE_NOTE + ' ' + summarise(pages_text([p for ps in assigned.values() for p in ps]), 360))},")
    out.append("  objectives: [")
    for obj in objectives:
        out.append(f"    {ts_string(obj)},")
    out.append("  ],")
    out.append("  sections: [")
    for topic, content, points in sections:
        out.append("    {")
        out.append(f"      title: {ts_string(topic['title'])},")
        out.append(f"      content: {ts_string(content)},")
        out.append("      keyPoints: [")
        for point in points:
            out.append(f"        {ts_string(point)},")
        out.append("      ],")
        out.append(f"      note: {ts_string(REWRITE_NOTE)},")
        out.append("    },")
    out.append("  ],")
    out.append("  review: [")
    for q in review:
        out.append(f"    {ts_string(q)},")
    out.append("  ],")
    out.append("};")
    out.append("")
    path.write_text("\n".join(out), encoding="utf-8")
    return path


def write_narration_draft(lesson: dict, assigned: dict[str, list[dict]]) -> Path:
    ensure_dirs()
    slug = lesson["slug"]
    path = DRAFTS_DIR / f"{slug}.narration.ts"
    today = dt.date.today().isoformat()
    out = [
        "/**",
        f" * DRAFT narration — generated {today}",
        " * Rewrite spoken Vietnamese, then copy into src/data/narration/<slug>.ts.",
        " */",
        "",
        "import type { LessonNarration } from '@/data/narration';",
        "",
        "const narration: LessonNarration = {",
        f"  lessonSlug: {ts_string(slug)},",
        "  topics: {",
    ]
    for topic in lesson["topics"]:
        text = summarise(pages_text(assigned.get(topic["slug"], [])), 280)
        stub = (
            f"Trong mục này, {topic['title']}. "
            "Viết lại lời nói ngắn, rõ, không chép nguyên giáo trình. "
            f"Gợi ý từ extract: {text}"
        )
        out.append(f"    {ts_string(topic['slug'])}: {{")
        out.append(f"      vi: {ts_string(stub)},")
        out.append("      by: 'ai',")
        out.append(f"      updatedAt: {ts_string(today)},")
        out.append("    },")
    out.append("  },")
    out.append("};")
    out.append("")
    out.append("export default narration;")
    out.append("")
    path.write_text("\n".join(out), encoding="utf-8")
    return path


def resolve_extract(source: Path, do_extract: bool) -> dict:
    json_path = extract_json_path(source)
    if do_extract or not json_path.exists():
        if source.exists():
            json_path = extract_one(source)
        elif json_path.exists():
            pass
        else:
            raise FileNotFoundError(f"No source or extract for {source}")
    return load_extract(json_path)


def generate_for_lesson(
    lesson: dict,
    extracts: list[dict],
    slide_index: dict[str, dict],
    unmatched: list[str],
) -> tuple[Path, Path, Path]:
    pages: list[dict] = []
    for extract in extracts:
        file_label = extract.get("file", "")
        for page in extract.get("pages", []):
            tagged = dict(page)
            tagged["source"] = file_label
            pages.append(tagged)
    assigned = assign_pages(pages, lesson["topics"])
    slide_meta = slide_index.get(lesson["slug"])
    brief = write_brief(lesson, slide_meta, extracts, assigned, unmatched)
    content = write_content_draft(lesson, assigned, extracts)
    narration = write_narration_draft(lesson, assigned)
    return brief, content, narration


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Map extracts to lesson briefs and TypeScript drafts")
    parser.add_argument("--file", help="Source PPTX/PDF (extracts if needed)")
    parser.add_argument("--lesson", help="Force web lesson slug, e.g. 06-other-plc-brands")
    parser.add_argument("--all", action="store_true", help="Map every extract / sources file that matches slide-index")
    parser.add_argument("--no-extract", action="store_true", help="Only use existing JSON in dev/extracts/")
    args = parser.parse_args(argv)

    lessons = {l["slug"]: l for l in parse_lessons()}
    slide_index = parse_slide_index()
    ensure_dirs()

    if args.file:
        source = find_source_file(args.file)
        if source is None and not extract_json_path(Path(args.file)).exists():
            print(f"File not found: {args.file}", file=sys.stderr)
            return 1
        source = source or Path(args.file)
        extract = resolve_extract(source, do_extract=not args.no_extract)
        slug = args.lesson or match_lesson_from_filename(extract.get("file") or source.name, slide_index)
        if not slug:
            print(
                "Could not map file to a lesson. Pass --lesson <slug>.",
                file=sys.stderr,
            )
            return 1
        if slug not in lessons:
            print(f"Unknown lesson slug: {slug}", file=sys.stderr)
            return 1
        brief, content, narration = generate_for_lesson(
            lessons[slug], [extract], slide_index, []
        )
        print(f"Brief     {brief}")
        print(f"Content   {content}")
        print(f"Narration {narration}")
        return 0

    if args.lesson and not args.all:
        print("Use --file with --lesson, or --all.", file=sys.stderr)
        return 1

    if not args.all:
        parser.print_help()
        return 1

    grouped: dict[str, list[dict]] = defaultdict(list)
    unmatched: list[str] = []

    source_files: list[Path] = [] if args.no_extract else iter_source_files()

    if source_files:
        for path in source_files:
            try:
                extract = resolve_extract(path, do_extract=True)
            except Exception as err:
                print(f"ERR {path.name}: {err}", file=sys.stderr)
                unmatched.append(path.name)
                continue
            slug = args.lesson or match_lesson_from_filename(extract.get("file") or path.name, slide_index)
            if not slug:
                unmatched.append(path.name)
                continue
            grouped[slug].append(extract)
    else:
        for json_path in sorted(EXTRACTS_DIR.glob("*.json")):
            extract = load_extract(json_path)
            slug = args.lesson or match_lesson_from_filename(extract.get("file") or json_path.stem, slide_index)
            if not slug:
                unmatched.append(extract.get("file") or json_path.name)
                continue
            grouped[slug].append(extract)

    if args.lesson:
        grouped = {args.lesson: grouped.get(args.lesson, [])}

    if not grouped:
        print("Nothing mapped. Put files in sources/ or Slide/, or pass --file --lesson.")
        if unmatched:
            print("Unmatched:", ", ".join(unmatched))
        return 0

    for slug, extracts in grouped.items():
        if slug not in lessons:
            print(f"Skip unknown slug {slug}", file=sys.stderr)
            continue
        brief, content, narration = generate_for_lesson(
            lessons[slug], extracts, slide_index, unmatched
        )
        print(f"{slug}: {brief.name}, {content.name}, {narration.name}")

    if unmatched:
        print("Unmatched files (use --lesson):", ", ".join(unmatched))
    return 0


if __name__ == "__main__":
    sys.exit(main())

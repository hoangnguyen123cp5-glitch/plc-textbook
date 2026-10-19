"""Shared paths and parsers for the ingest pipeline."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCES_DIR = ROOT / "sources"
SLIDE_DIR = ROOT / "Slide"
EXTRACTS_DIR = ROOT / "dev" / "extracts"
BRIEFS_DIR = ROOT / "dev" / "briefs"
DRAFTS_DIR = ROOT / "dev" / "drafts"
LESSONS_TS = ROOT / "src" / "lib" / "lessons.ts"
SLIDE_INDEX_TS = ROOT / "src" / "data" / "slide-index.ts"
LESSON_CONTENT_TS = ROOT / "src" / "data" / "lesson-content.ts"

EXTRACT_SUFFIXES = {".pptx", ".pdf"}
UNSUPPORTED_SUFFIXES = {".ppt", ".docx", ".doc"}
SOURCE_SUFFIXES = EXTRACT_SUFFIXES | UNSUPPORTED_SUFFIXES

# Extra local files not listed (or listed with a slightly different name) in slide-index.ts
FILE_ALIASES = {
    "phy plc programming.pptx": "01-programmable-control",
    "lesson-01-programmable-control-fundamentals.pptx": "01-programmable-control",
}

HEADING_RE = re.compile(r"(?:^|[\s])(\d+\.\d+)\b")
TOPIC_HEADING_RE = re.compile(r"^(\d+\.\d+)\s+")


def ensure_dirs() -> None:
    EXTRACTS_DIR.mkdir(parents=True, exist_ok=True)
    BRIEFS_DIR.mkdir(parents=True, exist_ok=True)
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)


def extract_stem(path: Path) -> str:
    """Stable extract filename: stem plus a short parent hint if needed."""
    stem = re.sub(r"[^\w.-]+", "_", path.stem, flags=re.UNICODE).strip("._")
    return stem or "untitled"


def extract_json_path(source: Path) -> Path:
    suffix = source.suffix.lower().lstrip(".") or "bin"
    return EXTRACTS_DIR / f"{extract_stem(source)}.{suffix}.json"


def source_search_dirs() -> list[Path]:
    dirs = []
    for path in (SOURCES_DIR, SLIDE_DIR):
        if path.is_dir():
            dirs.append(path)
    return dirs


def iter_source_files(*roots: Path) -> list[Path]:
    search = list(roots) if roots else source_search_dirs()
    files: list[Path] = []
    seen: set[str] = set()
    for root in search:
        if root.is_file():
            candidates = [root]
        elif root.is_dir():
            candidates = sorted(p for p in root.rglob("*") if p.is_file())
        else:
            continue
        for path in candidates:
            if path.suffix.lower() not in SOURCE_SUFFIXES:
                continue
            key = str(path.resolve()).lower()
            if key in seen:
                continue
            seen.add(key)
            files.append(path)
    return files


def find_source_file(name: str) -> Path | None:
    direct = Path(name)
    if direct.exists():
        return direct
    repo_rel = ROOT / name
    if repo_rel.exists():
        return repo_rel
    target = normalize_name(Path(name).name)
    for path in iter_source_files():
        if normalize_name(path.name) == target:
            return path
    return None


def normalize_name(name: str) -> str:
    name = Path(name).name
    name = re.sub(r"\s*\(EN\)\s*", " ", name, flags=re.IGNORECASE)
    name = name.lower()
    name = name.replace("–", "-").replace("—", "-")
    name = re.sub(r"[\s_]+", " ", name)
    name = re.sub(r"[^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ. -]+", "", name)
    return re.sub(r"\s+", " ", name).strip()


def parse_lessons(src: str | None = None) -> list[dict]:
    text = src if src is not None else LESSONS_TS.read_text(encoding="utf-8")
    lessons: list[dict] = []
    blocks = re.findall(
        r"\{\s*id:\s*(\d+),\s*slug:\s*'([^']+)'[\s\S]*?topics:\s*\[([\s\S]*?)\],?\s*\},",
        text,
    )
    for lesson_id, slug, topics_block in blocks:
        title_m = re.search(
            rf"slug:\s*'{re.escape(slug)}',\s*title:\s*'([^']+)'",
            text,
        )
        course_m = re.search(
            rf"slug:\s*'{re.escape(slug)}'[\s\S]*?course:\s*'(AUT206|AUT207)'",
            text,
        )
        topics = []
        for tm in re.finditer(
            r"\{\s*id:\s*(\d+),\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)'",
            topics_block,
        ):
            title = tm.group(3)
            heading_m = TOPIC_HEADING_RE.match(title)
            topics.append(
                {
                    "id": int(tm.group(1)),
                    "slug": tm.group(2),
                    "title": title,
                    "heading": heading_m.group(1) if heading_m else None,
                }
            )
        lessons.append(
            {
                "id": int(lesson_id),
                "slug": slug,
                "title": title_m.group(1) if title_m else slug,
                "course": course_m.group(1) if course_m else None,
                "topics": topics,
            }
        )
    return lessons


def parse_slide_index(src: str | None = None) -> dict[str, dict]:
    text = src if src is not None else SLIDE_INDEX_TS.read_text(encoding="utf-8")
    index: dict[str, dict] = {}
    for m in re.finditer(
        r"'([^']+)':\s*\{\s*course:\s*'(AUT206|AUT207)',\s*originalLesson:\s*(\d+),\s*slideCount:\s*(\d+),\s*files:\s*\[([\s\S]*?)\],",
        text,
    ):
        files = re.findall(r"'([^']+)'", m.group(5))
        index[m.group(1)] = {
            "course": m.group(2),
            "originalLesson": int(m.group(3)),
            "slideCount": int(m.group(4)),
            "files": files,
        }
    return index


def lesson_content_slugs(src: str | None = None) -> set[str]:
    text = src if src is not None else LESSON_CONTENT_TS.read_text(encoding="utf-8")
    return set(re.findall(r"^  '([0-9]{2}-[^']+)': \{", text, flags=re.MULTILINE))


def load_extract(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def first_line(text: str) -> str:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped:
            return stripped[:200]
    return ""


def bulletish_lines(text: str, limit: int = 8) -> list[str]:
    lines: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        line = re.sub(r"^[\-•*●○◦]\s*", "", line)
        if len(line) < 8:
            continue
        if line.lower() in {"click to edit master title style", "click to add text"}:
            continue
        if line not in lines:
            lines.append(line[:220])
        if len(lines) >= limit:
            break
    return lines


def summarise(text: str, max_chars: int = 400) -> str:
    compact = re.sub(r"\s+", " ", text).strip()
    if not compact:
        return "(no extractable text — rewrite from the original file)"
    if len(compact) <= max_chars:
        return compact
    return compact[: max_chars - 1].rsplit(" ", 1)[0] + "…"

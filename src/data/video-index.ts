/**
 * Kho dữ liệu video của khoá học.
 *
 * ── Vì sao tách khỏi lessons.ts ──────────────────────────────────────────
 * lessons.ts là CẤU TRÚC CHƯƠNG TRÌNH — ổn định, hiếm khi đổi.
 * File này là DỮ LIỆU SẢN XUẤT — thay đổi mỗi tuần khi quay xong một bài.
 * Tách ra để mỗi lần xuất bản video chỉ sửa một khối gọn ở đây, thay vì
 * len lỏi sửa 242 dòng rải rác trong file cấu trúc chương trình.
 *
 * ── Mô hình: một video mỗi bài, một mốc thời gian mỗi topic ──────────────
 * Không quay 242 clip. Quay 1 video cho cả bài, rồi ghi lại giây bắt đầu
 * của từng topic. Trang topic nhúng đúng video đó nhưng tự tua tới đoạn
 * của mình, nên người học vẫn thấy "mỗi topic một video".
 *
 * Cùng bộ mốc thời gian này xuất thẳng ra chapter cho mô tả YouTube —
 * xem hàm buildYouTubeChapters() ở cuối file.
 *
 * ── Cách thêm một video sau khi quay xong ────────────────────────────────
 * Chép khối mẫu bên dưới, đổi slug bài, ID video và các mốc thời gian.
 * Khoá của `chapters` phải trùng CHÍNH XÁC `topic.slug` trong lessons.ts —
 * gõ sai thì topic đó lặng lẽ không có video. Chạy validateVideoIndex()
 * để bắt lỗi này (đã tự chạy ở chế độ dev).
 */

import { lessons } from '@/lib/lessons';

export type VideoProvider = 'youtube';

export interface LessonVideo {
  provider: VideoProvider;
  /** ID video, KHÔNG phải URL đầy đủ. Ví dụ 'aBc123XyZ_0' */
  id: string;
  /** Tiêu đề trên YouTube — dùng cho aria-label và thẻ meta */
  title: string;
  /** Tổng thời lượng thật (giây). Dùng để tính độ dài chương cuối */
  durationSec: number;
  /** Ngày xuất bản, dạng ISO 'YYYY-MM-DD' */
  publishedAt?: string;
  /** Các ngôn ngữ đã có phụ đề tự làm (đừng tính phụ đề tự động của YouTube) */
  captions?: ('en' | 'vi')[];
  /** topicSlug → giây bắt đầu trong video */
  chapters: Record<string, number>;
}

/* ─────────────────────────────────────────────────────────────────────────
   KHỐI MẪU — chép, bỏ dấu comment, điền số thật

  '01-introduction': {
    provider: 'youtube',
    id: 'PASTE_VIDEO_ID_HERE',
    title: 'Introduction to PLC — PLC Programming, VNU-IS',
    durationSec: 2_640,           // 44:00
    publishedAt: '2026-09-15',
    captions: ['en'],
    chapters: {
      'what-is-plc':    0,
      'plc-history':    412,
      'plc-vs-relay':   735,
      'plc-brands':     1_090,
      'plc-types':      1_402,
      'applications':   1_760,
      'course-roadmap': 2_180,
    },
  },

───────────────────────────────────────────────────────────────────────── */

export const videoIndex: Record<string, LessonVideo> = {
  // Chưa có video nào. Thêm vào đây sau mỗi lần quay xong.
};

/* ═══════════════════════════════════════════════════════════════════════
   Hàm tra cứu
═══════════════════════════════════════════════════════════════════════ */

/** Video của một bài, hoặc null nếu chưa quay. */
export function getLessonVideo(lessonSlug: string): LessonVideo | null {
  return videoIndex[lessonSlug] ?? null;
}

export interface TopicVideoRef {
  video: LessonVideo;
  startSec: number;
  /** Giây kết thúc = mốc bắt đầu của topic kế tiếp, hoặc hết video */
  endSec: number;
  /** Độ dài thật của đoạn này (giây) — khác durationMinutes dự kiến */
  lengthSec: number;
}

/**
 * Đoạn video ứng với một topic, hoặc null nếu bài chưa quay HOẶC
 * topic này chưa được đánh mốc.
 */
export function getTopicVideo(lessonSlug: string, topicSlug: string): TopicVideoRef | null {
  const video = videoIndex[lessonSlug];
  if (!video) return null;

  const startSec = video.chapters[topicSlug];
  if (startSec === undefined) return null;

  // Mốc kết thúc = mốc bắt đầu nhỏ nhất lớn hơn mốc này
  const later = Object.values(video.chapters).filter((s) => s > startSec);
  const endSec = later.length ? Math.min(...later) : video.durationSec;

  return { video, startSec, endSec, lengthSec: Math.max(0, endSec - startSec) };
}

/**
 * Danh sách chương của một bài, đã sắp theo thời gian và ghép với tiêu đề
 * topic lấy từ lessons.ts.
 */
export function getChapters(lessonSlug: string) {
  const video = videoIndex[lessonSlug];
  const lesson = lessons.find((l) => l.slug === lessonSlug);
  if (!video || !lesson) return [];

  return lesson.topics
    .filter((t) => video.chapters[t.slug] !== undefined)
    .map((t) => ({
      topicSlug: t.slug,
      title: t.title,
      startSec: video.chapters[t.slug],
    }))
    .sort((a, b) => a.startSec - b.startSec);
}

/* ═══════════════════════════════════════════════════════════════════════
   Định dạng & URL
═══════════════════════════════════════════════════════════════════════ */

/** 0 → '0:00' · 412 → '6:52' · 3_725 → '1:02:05' */
export function formatTimestamp(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return h > 0
    ? `${h}:${mm}:${String(sec).padStart(2, '0')}`
    : `${mm}:${String(sec).padStart(2, '0')}`;
}

/**
 * URL nhúng.
 * · youtube-nocookie.com — không đặt cookie theo dõi cho tới khi người xem bấm play
 * · rel=0            — gợi ý video liên quan chỉ trong cùng kênh
 * · cc_load_policy=1 — bật sẵn phụ đề, cần thiết cho bài giảng tiếng Anh có accent
 * · modestbranding=1 — bớt logo YouTube
 */
export function buildEmbedUrl(video: LessonVideo, startSec = 0): string {
  const p = new URLSearchParams({
    rel: '0',
    cc_load_policy: '1',
    modestbranding: '1',
  });
  if (startSec > 0) p.set('start', String(Math.floor(startSec)));
  return `https://www.youtube-nocookie.com/embed/${video.id}?${p.toString()}`;
}

/** Link mở thẳng trên YouTube, có mốc thời gian. */
export function buildWatchUrl(video: LessonVideo, startSec = 0): string {
  const t = startSec > 0 ? `&t=${Math.floor(startSec)}s` : '';
  return `https://www.youtube.com/watch?v=${video.id}${t}`;
}

/** Ảnh thumbnail — dùng cho facade, tránh tải JS của YouTube khi chưa bấm play. */
export function buildThumbnailUrl(video: LessonVideo): string {
  return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
}

/* ═══════════════════════════════════════════════════════════════════════
   Xuất chapter cho mô tả YouTube

   YouTube chỉ nhận chapter khi: mốc đầu tiên là 0:00, có ít nhất 3 mốc,
   mỗi đoạn dài tối thiểu 10 giây, và thứ tự tăng dần.
═══════════════════════════════════════════════════════════════════════ */

export function buildYouTubeChapters(lessonSlug: string): string {
  return getChapters(lessonSlug)
    .map((c) => `${formatTimestamp(c.startSec)} ${c.title}`)
    .join('\n');
}

/* ═══════════════════════════════════════════════════════════════════════
   Kiểm tra tính toàn vẹn

   Gõ sai một slug là topic đó lặng lẽ mất video — không có lỗi, không có
   cảnh báo, chỉ là trang trống. Hàm này bắt đúng loại lỗi đó.
═══════════════════════════════════════════════════════════════════════ */

export interface VideoIndexIssue {
  lessonSlug: string;
  kind: 'unknown-lesson' | 'unknown-topic' | 'missing-zero' | 'too-few-chapters' | 'beyond-duration';
  detail: string;
}

export function validateVideoIndex(): VideoIndexIssue[] {
  const issues: VideoIndexIssue[] = [];

  for (const [lessonSlug, video] of Object.entries(videoIndex)) {
    const lesson = lessons.find((l) => l.slug === lessonSlug);
    if (!lesson) {
      issues.push({
        lessonSlug,
        kind: 'unknown-lesson',
        detail: `No lesson with slug '${lessonSlug}' found in lessons.ts`,
      });
      continue;
    }

    const known = new Set(lesson.topics.map((t) => t.slug));
    for (const topicSlug of Object.keys(video.chapters)) {
      if (!known.has(topicSlug)) {
        issues.push({
          lessonSlug,
          kind: 'unknown-topic',
          detail: `Topic '${topicSlug}' does not exist in lesson '${lessonSlug}'`,
        });
      }
    }

    const marks = Object.values(video.chapters).sort((a, b) => a - b);
    if (marks.length && marks[0] !== 0) {
      issues.push({
        lessonSlug,
        kind: 'missing-zero',
        detail: `YouTube requires first timestamp to be 0:00, currently ${formatTimestamp(marks[0])}`,
      });
    }
    if (marks.length > 0 && marks.length < 3) {
      issues.push({
        lessonSlug,
        kind: 'too-few-chapters',
        detail: `YouTube requires at least 3 chapters, currently ${marks.length}`,
      });
    }
    const over = marks.filter((m) => m > video.durationSec);
    if (over.length) {
      issues.push({
        lessonSlug,
        kind: 'beyond-duration',
        detail: `${over.length} timestamp(s) exceed video duration (${formatTimestamp(video.durationSec)})`,
      });
    }
  }

  return issues;
}

// Development warning, does not affect production build
if (process.env.NODE_ENV === 'development') {
  const issues = validateVideoIndex();
  if (issues.length) {
    console.warn(
      `[video-index] ${issues.length} issue(s):\n` +
        issues.map((i) => `  · [${i.lessonSlug}] ${i.detail}`).join('\n')
    );
  }
}

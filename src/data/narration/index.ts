/**
 * NARRATION SYSTEM — Hệ thống quản lý lời nói cho từng slide/topic
 *
 * ── Tại sao có file này ──────────────────────────────────────────────────
 * Mỗi lần cần lời nói cho slide, ta không hỏi AI từ đầu (tốn token).
 * Thay vào đó:
 *   1. Đọc file narration của lesson cụ thể
 *   2. Lấy những topic có status: 'missing'
 *   3. Chỉ gửi những topic đó cho AI → tiết kiệm 80–90% token
 *   4. AI trả về → merge vào file → commit
 *
 * ── Cấu trúc ────────────────────────────────────────────────────────────
 *   src/data/narration/
 *     index.ts                ← file này — type + helper
 *     01-programmable-control.ts
 *     02-s7-1200-tia-portal.ts
 *     ...
 *
 * ── Sử dụng ─────────────────────────────────────────────────────────────
 *   import { getNarration, getMissingNarrations } from '@/data/narration';
 *   const text = getNarration('01-programmable-control', 'scan-cycle');
 *   const missing = getMissingNarrations('01-programmable-control');
 */

export interface NarrationEntry {
  /** Lời nói tiếng Việt — bắt buộc */
  vi: string;
  /** Bản tiếng Anh — tùy chọn, dùng nếu có video song ngữ */
  en?: string;
  /** Thời lượng ước tính (giây) — để sync với slide animation */
  duration?: number;
  /** Người tạo: 'ai' | 'human' — track ai viết để biết cần review không */
  by: 'ai' | 'human';
  /** Ngày tạo/cập nhật cuối ISO string */
  updatedAt: string;
}

export type NarrationStatus = 'done' | 'missing' | 'draft';

export interface LessonNarration {
  lessonSlug: string;
  /** Map: topicSlug → NarrationEntry */
  topics: Record<string, NarrationEntry>;
}

// ── Dynamic imports cho từng lesson (lazy load, không load tất cả) ──────

const narrationLoaders: Record<string, () => Promise<{ default: LessonNarration }>> = {
  '01-programmable-control':  () => import('./01-programmable-control'),
  '02-s7-1200-tia-portal':    () => import('./02-s7-1200-tia-portal'),
  '03-binary-operations':     () => import('./03-binary-operations'),
  '04-numeric-operations':    () => import('./04-numeric-operations'),
  '05-analog-signals':        () => import('./05-analog-signals'),
  '06-other-plc-brands':      () => import('./06-other-plc-brands'),
  '07-system-design':         () => import('./07-system-design'),
  '08-advanced-instructions': () => import('./08-advanced-instructions'),
  '09-high-speed-counting':   () => import('./09-high-speed-counting'),
  '10-closed-loop-pid':       () => import('./10-closed-loop-pid'),
  '11-communication':         () => import('./11-communication'),
  '12-fault-diagnostics':     () => import('./12-fault-diagnostics'),
  '13-s7-300':                () => import('./13-s7-300'),
  '14-system-upgrade':        () => import('./14-system-upgrade'),
  '15-system-integration':    () => import('./15-system-integration'),
};

// ── Helper functions ─────────────────────────────────────────────────────

/** Load narration data cho một bài học */
export async function loadLessonNarration(lessonSlug: string): Promise<LessonNarration | null> {
  const loader = narrationLoaders[lessonSlug];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}

/** Lấy text lời nói cho một topic cụ thể */
export async function getNarration(
  lessonSlug: string,
  topicSlug: string,
  lang: 'vi' | 'en' = 'vi'
): Promise<string | null> {
  const data = await loadLessonNarration(lessonSlug);
  if (!data) return null;
  const entry = data.topics[topicSlug];
  if (!entry) return null;
  return lang === 'en' ? (entry.en ?? entry.vi) : entry.vi;
}

/** Lấy danh sách topicSlug chưa có narration (để giao cho AI viết) */
export async function getMissingNarrations(
  lessonSlug: string,
  allTopicSlugs: string[]
): Promise<string[]> {
  const data = await loadLessonNarration(lessonSlug);
  if (!data) return allTopicSlugs; // Chưa có file = tất cả đều missing
  return allTopicSlugs.filter(slug => !data.topics[slug]);
}

/** Thống kê coverage narration cho một bài */
export async function getNarrationStats(
  lessonSlug: string,
  allTopicSlugs: string[]
): Promise<{ total: number; done: number; missing: number; byAI: number; byHuman: number }> {
  const data = await loadLessonNarration(lessonSlug);
  const total = allTopicSlugs.length;
  if (!data) return { total, done: 0, missing: total, byAI: 0, byHuman: 0 };
  const done = allTopicSlugs.filter(s => !!data.topics[s]).length;
  const byAI = Object.values(data.topics).filter(e => e.by === 'ai').length;
  const byHuman = Object.values(data.topics).filter(e => e.by === 'human').length;
  return { total, done, missing: total - done, byAI, byHuman };
}

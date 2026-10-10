#!/usr/bin/env node
/**
 * narration-check.mjs — Công cụ quản lý narration
 *
 * Dùng:
 *   node scripts/narration-check.mjs              # Thống kê tổng
 *   node scripts/narration-check.mjs 01-programmable-control  # Chi tiết 1 bài
 *   node scripts/narration-check.mjs --missing    # Chỉ bài chưa đủ
 *   node scripts/narration-check.mjs --prompt 01  # Tạo AI prompt cho bài 1
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');

// ── Đọc danh sách lessons từ lessons.ts (parse thô, không import TS) ──
function getLessonsFromFile() {
  const src = readFileSync(join(ROOT, 'src/lib/lessons.ts'), 'utf8');
  const lessons = [];
  const lessonBlocks = src.match(/\{\s*id:\s*(\d+),\s*slug:\s*'([^']+)'[^}]+topics:\s*\[([\s\S]*?)\],?\s*\}/g) || [];

  for (const block of lessonBlocks) {
    const idMatch    = block.match(/id:\s*(\d+)/);
    const slugMatch  = block.match(/slug:\s*'([^']+)'/);
    const titleMatch = block.match(/title:\s*'([^']+)'/);
    if (!idMatch || !slugMatch) continue;

    const topicSlugs = [...block.matchAll(/slug:\s*'([^']+)'/g)]
      .map(m => m[1])
      .filter(s => s !== slugMatch[1]); // loại slug bài học, giữ slug topic

    lessons.push({
      id: parseInt(idMatch[1]),
      slug: slugMatch[1],
      title: titleMatch ? titleMatch[1] : slugMatch[1],
      topics: topicSlugs,
    });
  }
  return lessons;
}

// ── Đọc narration file của một bài ──
function getNarrationDone(lessonSlug) {
  const file = join(ROOT, `src/data/narration/${lessonSlug}.ts`);
  if (!existsSync(file)) return new Set();
  const src = readFileSync(file, 'utf8');
  // Lấy key của các entry có nội dung thực (không phải comment)
  const matches = src.matchAll(/^\s+'([a-z][a-z0-9-]*)'\s*:/gm);
  return new Set([...matches].map(m => m[1]));
}

// ── Màu terminal ──
const G = s => `\x1b[32m${s}\x1b[0m`;
const R = s => `\x1b[31m${s}\x1b[0m`;
const Y = s => `\x1b[33m${s}\x1b[0m`;
const B = s => `\x1b[34m${s}\x1b[0m`;
const DIM = s => `\x1b[2m${s}\x1b[0m`;

// ── Commands ──

function cmdSummary(onlyMissing = false) {
  const lessons = getLessonsFromFile();
  let totalTopics = 0, totalDone = 0;

  console.log('\n📊  Narration Coverage Report\n' + '─'.repeat(60));

  for (const l of lessons) {
    const done = getNarrationDone(l.slug);
    const missing = l.topics.filter(t => !done.has(t));
    const pct = l.topics.length ? Math.round(done.size / l.topics.length * 100) : 0;
    totalTopics += l.topics.length;
    totalDone   += done.size;

    if (onlyMissing && missing.length === 0) continue;

    const bar = '█'.repeat(Math.round(pct/5)) + '░'.repeat(20 - Math.round(pct/5));
    const status = pct === 100 ? G('✓ DONE') : pct > 0 ? Y(`${pct}%`) : R('✗ EMPTY');
    console.log(`${B(`L${String(l.id).padStart(2,'0')}`)} ${l.slug.padEnd(30)} ${bar} ${status}  (${done.size}/${l.topics.length})`);

    if (missing.length && !onlyMissing) {
      console.log(DIM(`     Missing: ${missing.slice(0,4).join(', ')}${missing.length > 4 ? ` +${missing.length-4} more` : ''}`));
    }
  }

  const totalPct = Math.round(totalDone / totalTopics * 100);
  console.log('─'.repeat(60));
  console.log(`Total: ${totalDone}/${totalTopics} topics narrated (${totalPct}%)\n`);
}

function cmdDetail(slug) {
  const lessons = getLessonsFromFile();
  const lesson = lessons.find(l => l.slug === slug || l.slug.startsWith(slug));
  if (!lesson) { console.log(R(`Không tìm thấy lesson: ${slug}`)); return; }

  const done    = getNarrationDone(lesson.slug);
  const missing = lesson.topics.filter(t => !done.has(t));

  console.log(`\n📖  ${lesson.title} (${lesson.slug})`);
  console.log(`    ${G(done.size + ' done')} / ${R(missing.length + ' missing')} / ${lesson.topics.length} total\n`);

  for (const t of lesson.topics) {
    const status = done.has(t) ? G('✓') : R('✗');
    console.log(`  ${status} ${t}`);
  }
  console.log('');
}

function cmdPrompt(slug) {
  const lessons = getLessonsFromFile();
  const lesson = lessons.find(l => l.slug === slug || l.slug.startsWith(slug));
  if (!lesson) { console.log(R(`Không tìm thấy: ${slug}`)); return; }

  const done    = getNarrationDone(lesson.slug);
  const missing = lesson.topics.filter(t => !done.has(t));

  if (missing.length === 0) {
    console.log(G(`✓ Bài ${lesson.slug} đã có đủ narration!`));
    return;
  }

  console.log(`\n🤖  AI Prompt — Viết narration cho ${missing.length} topic còn thiếu\n`);
  console.log('─'.repeat(60));
  console.log(`Viết lời nói (narration) tiếng Việt cho từng topic PLC sau đây.`);
  console.log(`Bài học: "${lesson.title}"`);
  console.log(`\nYêu cầu:`);
  console.log(`- Câu ngắn, rõ ràng, phù hợp nói (không phải văn viết)`);
  console.log(`- 50-80 từ mỗi topic`);
  console.log(`- Bắt đầu bằng "Trong mục này..." hoặc tên chủ đề`);
  console.log(`- Trả về JSON format như bên dưới\n`);
  console.log(`Topics cần viết: ${missing.join(', ')}\n`);
  console.log(`Output format:`);
  console.log('{');
  for (const t of missing) {
    console.log(`  "${t}": "lời nói tại đây",`);
  }
  console.log('}');
  console.log('─'.repeat(60));
  console.log(Y(`\n→ Token ước tính: ~${missing.length * 80} tokens output (vs ~${lesson.topics.length * 80} nếu viết lại hết)\n`));
}

// ── Main ──
const args = process.argv.slice(2);

if (args.includes('--missing'))        cmdSummary(true);
else if (args.includes('--prompt'))    cmdPrompt(args[args.indexOf('--prompt') + 1] || '');
else if (args.length === 0)            cmdSummary(false);
else if (args[0] === '--prompt')       cmdPrompt(args[1] || '');
else if (args[0] && !args[0].startsWith('--')) {
  if (args.includes('--prompt')) cmdPrompt(args[0]);
  else cmdDetail(args[0]);
}
else cmdSummary(false);

#!/usr/bin/env node
/**
 * scripts/new-topic.mjs
 * Tạo nhanh 1 chuyên đề (topic) mới từ file mẫu _template/topic.ts,
 * tự động thêm vào topicOrder của _lesson.ts và cập nhật src/content/index.ts.
 *
 * Cú pháp:
 *   npm run new:topic -- <lesson-slug> <topic-slug> "<tiêu đề>"
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Lỗi: Thiếu tham số.');
  console.error('Cách dùng: npm run new:topic -- <lesson-slug> <topic-slug> "<tiêu đề>"');
  console.error('Ví dụ:     npm run new:topic -- 01-programmable-control io-addressing "Địa chỉ vùng nhớ I/O"');
  process.exit(1);
}

const [lessonSlug, topicSlug, ...titleParts] = args;
const title = titleParts.join(' ').trim();

if (!/^[a-z0-9-]+$/.test(topicSlug)) {
  console.error(`Lỗi: topic-slug "${topicSlug}" chỉ được chứa chữ thường, số và dấu gạch ngang (-).`);
  process.exit(1);
}

const lessonDir = path.resolve(ROOT, 'src/content', lessonSlug);
const lessonFilePath = path.resolve(lessonDir, '_lesson.ts');
const templatePath = path.resolve(ROOT, 'src/content/_template/topic.ts');
const targetTopicPath = path.resolve(lessonDir, `${topicSlug}.ts`);

if (!fs.existsSync(lessonFilePath)) {
  console.error(`Lỗi: Không tìm thấy bài học "${lessonSlug}" tại src/content/${lessonSlug}/_lesson.ts`);
  process.exit(1);
}

if (fs.existsSync(targetTopicPath)) {
  console.error(`Lỗi: File chuyên đề đã tồn tại: src/content/${lessonSlug}/${topicSlug}.ts`);
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error('Lỗi: Không tìm thấy file mẫu tại src/content/_template/topic.ts');
  process.exit(1);
}

// 1. Copy template và điền slug, title, status: 'draft'
const today = new Date().toISOString().slice(0, 10);
let content = fs.readFileSync(templatePath, 'utf8');
content = content
  .replace(/slug:\s*'topic-template'/, `slug: ${JSON.stringify(topicSlug)}`)
  .replace(/title:\s*'Tiêu đề chuyên đề mẫu'/, `title: ${JSON.stringify(title)}`)
  .replace(/updatedAt:\s*'[^']*'/, `updatedAt: '${today}'`)
  .replace(/status:\s*'(?:draft|review|published)'/, `status: 'draft'`);

fs.writeFileSync(targetTopicPath, content, 'utf8');
console.log(`✓ Đã tạo file chuyên đề: src/content/${lessonSlug}/${topicSlug}.ts (status: 'draft')`);

// 2. Thêm topicSlug vào topicOrder trong _lesson.ts
let lessonCode = fs.readFileSync(lessonFilePath, 'utf8');
const topicOrderRegex = /("topicOrder"|topicOrder)\s*:\s*\[([\s\S]*?)\]/;
const match = lessonCode.match(topicOrderRegex);

if (!match) {
  console.error(`Lỗi: Không tìm thấy mảng topicOrder trong src/content/${lessonSlug}/_lesson.ts`);
  process.exit(1);
}

const existingListRaw = match[2];
const existingSlugs = [...existingListRaw.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);

if (!existingSlugs.includes(topicSlug)) {
  existingSlugs.push(topicSlug);
  const formattedArray = existingSlugs.length > 0
    ? '\n' + existingSlugs.map(s => `    ${JSON.stringify(s)}`).join(',\n') + '\n  '
    : '';
  lessonCode = lessonCode.replace(topicOrderRegex, `$1: [${formattedArray}]`);
  fs.writeFileSync(lessonFilePath, lessonCode, 'utf8');
  console.log(`✓ Đã thêm "${topicSlug}" vào topicOrder của src/content/${lessonSlug}/_lesson.ts`);
}

// 3. Tái tạo src/content/index.ts
execSync(`node "${path.resolve(__dirname, 'build-content-index.mjs')}"`, { stdio: 'inherit' });

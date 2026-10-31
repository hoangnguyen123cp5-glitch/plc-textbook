#!/usr/bin/env node
/**
 * scripts/new-lesson.mjs
 * Tạo thư mục bài học mới + file _lesson.ts đúng chuẩn LessonContentFile.
 *
 * Cú pháp:
 *   npm run new:lesson -- <số> <slug> "<tiêu đề>"
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
  console.error('Cách dùng: npm run new:lesson -- <số> <slug> "<Lesson Title>"');
  console.error('Ví dụ:     npm run new:lesson -- 16 16-industrial-safety "Functional Safety and Fail-Safe PLC Systems"');
  process.exit(1);
}

const [numStr, slug, ...titleParts] = args;
const id = parseInt(numStr, 10);
const title = titleParts.join(' ').trim();

if (!Number.isInteger(id) || id <= 0) {
  console.error(`Lỗi: Số thứ tự bài "${numStr}" phải là số nguyên dương.`);
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`Lỗi: slug "${slug}" chỉ được chứa chữ thường, số và dấu gạch ngang (-).`);
  process.exit(1);
}

const lessonDir = path.resolve(ROOT, 'src/content', slug);
const lessonFilePath = path.resolve(lessonDir, '_lesson.ts');

if (fs.existsSync(lessonFilePath)) {
  console.error(`Lỗi: Bài học đã tồn tại tại src/content/${slug}/_lesson.ts`);
  process.exit(1);
}

function getModule(lessonId) {
  if (lessonId <= 3) return 1;
  if (lessonId <= 7) return 2;
  if (lessonId <= 10) return 3;
  if (lessonId <= 14) return 4;
  return 5;
}

fs.mkdirSync(lessonDir, { recursive: true });

const lessonObj = {
  slug,
  id,
  title,
  description: `Lesson ${id}: ${title}`,
  course: id <= 7 ? 'AUT206' : 'AUT207',
  session: 1,
  lab: '—',
  clo: 'G1',
  module: getModule(id),
  topicOrder: [],
  overview: `Engineering overview and core concepts for Lesson ${id}: ${title}.`,
  objectives: [
    `Understand the operating principles and industrial implementation of ${title}`,
  ],
};

const fileContent = `import { LessonContentFile } from '@/types/content';

export default ${JSON.stringify(lessonObj, null, 2)} satisfies LessonContentFile;
`;

fs.writeFileSync(lessonFilePath, fileContent, 'utf8');
console.log(`✓ Đã tạo bài học mới: src/content/${slug}/_lesson.ts`);

// Cập nhật src/content/index.ts
execSync(`node "${path.resolve(__dirname, 'build-content-index.mjs')}"`, { stdio: 'inherit' });

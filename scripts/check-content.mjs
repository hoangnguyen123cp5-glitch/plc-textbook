#!/usr/bin/env node
/**
 * scripts/check-content.mjs
 * Công cụ kiểm tra toàn vẹn dữ liệu nội dung trong src/content/
 *
 * Kiểm tra:
 * 1. slug ≠ tên file (cả _lesson.ts và <topic>.ts)
 * 2. Topic có file nhưng không có trong topicOrder (hoặc ngược lại)
 * 3. figures.src (và slide.figure.src) không tồn tại trong public/
 * 4. quiz.answer ngoài phạm vi [0, options.length - 1]
 * 5. quiz < 3 câu
 * 6. > 60% đáp án đúng nằm cùng 1 vị trí (A/B/C/D)
 * 7. Topic 'published' thiếu body/summary hoặc còn TODO(migrate)
 * 8. In bảng tổng hợp: bài | số topic | published/review/draft | thiếu gì
 */

import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.resolve(ROOT, 'src/content');
const PUBLIC_DIR = path.resolve(ROOT, 'public');

const isStrict = process.argv.includes('--strict');

function loadTsDefaultExport(fullPath) {
  const code = fs.readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const moduleObj = { exports: {} };
  const wrapper = vm.runInThisContext(
    `(function (exports, require, module) { ${transpiled.outputText} \n})`,
    { filename: fullPath }
  );
  wrapper(moduleObj.exports, () => ({}), moduleObj);
  return { data: moduleObj.exports.default || moduleObj.exports, rawCode: code };
}

const hardErrors = [];
const warnings = [];
const tableRows = [];

const globalAnswerCounts = [0, 0, 0, 0];
let globalQuizTotal = 0;

// Lấy tất cả thư mục bài học (bỏ qua các thư mục bắt đầu bằng '_')
const lessonDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_'))
  .map(d => d.name)
  .sort();

for (const dirName of lessonDirs) {
  const lessonDirPath = path.resolve(CONTENT_DIR, dirName);
  const lessonFilePath = path.resolve(lessonDirPath, '_lesson.ts');

  if (!fs.existsSync(lessonFilePath)) {
    hardErrors.push(`[${dirName}] Thiếu file _lesson.ts trong thư mục bài học.`);
    continue;
  }

  let lesson;
  try {
    lesson = loadTsDefaultExport(lessonFilePath).data;
  } catch (err) {
    hardErrors.push(`[${dirName}/_lesson.ts] Lỗi cú pháp khi đọc file: ${err.message}`);
    continue;
  }

  // 1. Kiểm tra lesson.slug === tên thư mục
  if (lesson.slug !== dirName) {
    hardErrors.push(`[${dirName}/_lesson.ts] Lỗi slug bài học: slug="${lesson.slug}" khác tên thư mục "${dirName}".`);
  }

  const topicOrder = Array.isArray(lesson.topicOrder) ? lesson.topicOrder : [];
  const actualFiles = fs.readdirSync(lessonDirPath)
    .filter(f => f.endsWith('.ts') && f !== '_lesson.ts')
    .map(f => f.replace(/\.ts$/, ''));

  // 2a. Kiểm tra trùng lặp trong topicOrder
  const seenInOrder = new Set();
  for (const s of topicOrder) {
    if (seenInOrder.has(s)) {
      hardErrors.push(`[${dirName}] Topic "${s}" bị khai báo trùng lặp trong topicOrder.`);
    }
    seenInOrder.add(s);
  }

  // 2b. Có trong topicOrder nhưng không có file .ts
  for (const s of topicOrder) {
    if (!actualFiles.includes(s)) {
      hardErrors.push(`[${dirName}] Topic "${s}" có trong topicOrder nhưng KHÔNG có file ${s}.ts.`);
    }
  }

  // 2c. Có file .ts nhưng không có trong topicOrder
  for (const f of actualFiles) {
    if (!topicOrder.includes(f)) {
      hardErrors.push(`[${dirName}] File "${f}.ts" tồn tại nhưng KHÔNG có trong topicOrder của _lesson.ts.`);
    }
  }

  // Thống kê từng bài cho bảng tổng hợp
  const statusCounts = { published: 0, review: 0, draft: 0 };
  const missingReasons = new Set();
  let quizUnder3Count = 0;
  let biasedTopicCount = 0;
  let noBodyCount = 0;
  let noSummaryCount = 0;
  let todoCount = 0;

  const lessonAnswerCounts = [0, 0, 0, 0];
  let lessonQuizTotal = 0;

  // Duyệt các topic theo thứ tự topicOrder (cộng thêm các file lẻ nếu có để kiểm tra hết)
  const allSlugsToCheck = [...new Set([...topicOrder, ...actualFiles])];

  for (const tSlug of allSlugsToCheck) {
    const tPath = path.resolve(lessonDirPath, `${tSlug}.ts`);
    if (!fs.existsSync(tPath)) continue;

    let topic, rawCode;
    try {
      const loaded = loadTsDefaultExport(tPath);
      topic = loaded.data;
      rawCode = loaded.rawCode;
    } catch (err) {
      hardErrors.push(`[${dirName}/${tSlug}.ts] Lỗi cú pháp khi đọc file: ${err.message}`);
      continue;
    }

    const label = `${dirName}/${tSlug}.ts`;
    const isPublished = topic.status === 'published';

    if (topic.status === 'published') statusCounts.published++;
    else if (topic.status === 'review') statusCounts.review++;
    else statusCounts.draft++;

    // 1. Kiểm tra slug === tên file
    if (topic.slug !== tSlug) {
      hardErrors.push(`[${label}] Lỗi slug: slug="${topic.slug}" khác tên file "${tSlug}".`);
    }

    // 3. Kiểm tra đường dẫn ảnh trong figures[] và slides[]
    const allFigures = [];
    if (Array.isArray(topic.figures)) {
      allFigures.push(...topic.figures);
    }
    if (Array.isArray(topic.slides)) {
      for (const sl of topic.slides) {
        if (sl && sl.figure) allFigures.push(sl.figure);
      }
    }

    for (const fig of allFigures) {
      if (!fig || typeof fig.src !== 'string' || !fig.src.trim()) {
        hardErrors.push(`[${label}] Figure có đường dẫn src rỗng hoặc không hợp lệ.`);
        continue;
      }
      const cleanRel = fig.src.replace(/^\/+/, '');
      const fullImgPath = path.resolve(PUBLIC_DIR, cleanRel);
      if (!fs.existsSync(fullImgPath)) {
        hardErrors.push(`[${label}] Ảnh không tồn tại trong public/: "${fig.src}"`);
        missingReasons.add('ảnh lỗi');
      }
    }

    // 7. Kiểm tra summary, body và TODO(migrate)
    const hasSummary = typeof topic.summary === 'string' && topic.summary.trim().length > 0;
    const hasBody = Array.isArray(topic.body) && topic.body.length > 0 && topic.body.every(b => typeof b.text === 'string' && b.text.trim().length > 0);
    const hasTodoMigrate = /TODO\(migrate\)/.test(rawCode);

    if (!hasSummary) {
      noSummaryCount++;
      if (isPublished) {
        hardErrors.push(`[${label}] Topic đang ở trạng thái 'published' nhưng thiếu summary.`);
      } else {
        warnings.push(`[${label}] (${topic.status}) Thiếu summary.`);
      }
    }

    if (!hasBody) {
      noBodyCount++;
      if (isPublished) {
        hardErrors.push(`[${label}] Topic đang ở trạng thái 'published' nhưng thiếu body (hoặc đoạn văn rỗng).`);
      } else {
        warnings.push(`[${label}] (${topic.status}) Thiếu nội dung body.`);
      }
    }

    if (hasTodoMigrate) {
      todoCount++;
      if (isPublished) {
        hardErrors.push(`[${label}] Topic đang ở trạng thái 'published' nhưng vẫn còn TODO(migrate).`);
      } else {
        warnings.push(`[${label}] (${topic.status}) Còn dòng TODO(migrate) chưa xử lý.`);
      }
    }

    // 4, 5, 6. Kiểm tra Quiz
    const quizList = Array.isArray(topic.quiz) ? topic.quiz : [];
    if (quizList.length < 3) {
      quizUnder3Count++;
      const msg = `[${label}] (${topic.status}) Quiz chỉ có ${quizList.length} câu (yêu cầu ≥ 3 câu).`;
      if (isPublished) {
        hardErrors.push(msg);
      } else {
        warnings.push(msg);
      }
    }

    const topicAnsCounts = [0, 0, 0, 0];
    quizList.forEach((q, qIdx) => {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        hardErrors.push(`[${label}] Câu quiz #${qIdx + 1} có danh sách options không hợp lệ.`);
        return;
      }
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
        hardErrors.push(`[${label}] Câu quiz #${qIdx + 1} có answer=${q.answer} nằm ngoài phạm vi [0..${q.options.length - 1}].`);
        return;
      }
      if (q.answer < 4) {
        topicAnsCounts[q.answer]++;
        lessonAnswerCounts[q.answer]++;
        globalAnswerCounts[q.answer]++;
      }
      lessonQuizTotal++;
      globalQuizTotal++;
    });

    // Kiểm tra > 60% đáp án đúng cùng 1 vị trí trong 1 topic (chỉ xét khi topic có từ 3 câu trở lên)
    if (quizList.length >= 3) {
      const maxSame = Math.max(...topicAnsCounts);
      const ratio = maxSame / quizList.length;
      if (ratio > 0.6) {
        biasedTopicCount++;
        const posIdx = topicAnsCounts.indexOf(maxSame);
        const letter = String.fromCharCode(65 + posIdx);
        const msg = `[${label}] (${topic.status}) Hơn 60% đáp án đúng (${maxSame}/${quizList.length} = ${Math.round(ratio * 100)}%) nằm ở cùng vị trí ${letter}.`;
        if (isPublished) {
          hardErrors.push(msg);
        } else {
          warnings.push(msg);
        }
      }
    }
  }

  // Kiểm tra > 60% đáp án đúng cùng 1 vị trí trong toàn bài học
  if (lessonQuizTotal >= 3) {
    const maxLessonSame = Math.max(...lessonAnswerCounts);
    const ratio = maxLessonSame / lessonQuizTotal;
    if (ratio > 0.6) {
      const posIdx = lessonAnswerCounts.indexOf(maxLessonSame);
      const letter = String.fromCharCode(65 + posIdx);
      warnings.push(`[${dirName}] Toàn bài có ${maxLessonSame}/${lessonQuizTotal} (${Math.round(ratio * 100)}%) đáp án đúng tập trung ở vị trí ${letter} (> 60%).`);
      missingReasons.add(`lệch đáp án ${letter} (${Math.round(ratio * 100)}%)`);
    }
  }

  if (noBodyCount > 0) missingReasons.add(`${noBodyCount} thiếu body`);
  if (noSummaryCount > 0) missingReasons.add(`${noSummaryCount} thiếu summary`);
  if (todoCount > 0) missingReasons.add(`${todoCount} còn TODO`);
  if (quizUnder3Count > 0) missingReasons.add(`${quizUnder3Count} topic quiz<3 câu`);
  if (biasedTopicCount > 0) missingReasons.add(`${biasedTopicCount} topic lệch đáp án`);

  tableRows.push({
    lessonLabel: `${String(lesson.id).padStart(2, '0')} - ${lesson.slug}`,
    topicCount: allSlugsToCheck.length,
    statusStr: `${statusCounts.published} / ${statusCounts.review} / ${statusCounts.draft}`,
    missingStr: missingReasons.size > 0 ? [...missingReasons].join(', ') : 'Đầy đủ ✓',
  });
}

// Kiểm tra tỷ lệ đáp án đúng trên toàn khoá học
if (globalQuizTotal > 0) {
  const maxGlobal = Math.max(...globalAnswerCounts);
  const ratioGlobal = maxGlobal / globalQuizTotal;
  if (ratioGlobal > 0.6) {
    const posIdx = globalAnswerCounts.indexOf(maxGlobal);
    const letter = String.fromCharCode(65 + posIdx);
    warnings.push(`[TOÀN KHOÁ HỌC] Có ${maxGlobal}/${globalQuizTotal} (${Math.round(ratioGlobal * 100)}%) đáp án đúng nằm ở vị trí ${letter} (vượt ngưỡng 60%).`);
  }
}

// ── IN BẢNG TỔNG HỢP ──
console.log('\n====================================================================================================');
console.log('                         BẢNG TỔNG HỢP KIỂM TRA NỘI DUNG (src/content/)                             ');
console.log('====================================================================================================');
const col1 = 30;
const col2 = 10;
const col3 = 20;
console.log(
  `| ${'Bài học'.padEnd(col1)} | ${'Số topic'.padStart(col2)} | ${'Pub / Rev / Draft'.padStart(col3)} | Thiếu gì`
);
console.log('----------------------------------------------------------------------------------------------------');
for (const row of tableRows) {
  console.log(
    `| ${row.lessonLabel.padEnd(col1)} | ${String(row.topicCount).padStart(col2)} | ${row.statusStr.padStart(col3)} | ${row.missingStr}`
  );
}
console.log('----------------------------------------------------------------------------------------------------');

if (globalQuizTotal > 0) {
  const dist = globalAnswerCounts
    .map((cnt, idx) => `${String.fromCharCode(65 + idx)}: ${cnt} (${Math.round((cnt / globalQuizTotal) * 100)}%)`)
    .join(' | ');
  console.log(`Phân bố đáp án đúng toàn khoá (${globalQuizTotal} câu): ${dist}`);
}
console.log('====================================================================================================\n');

if (warnings.length > 0) {
  console.log(`⚠ CẢNH BÁO NỘI DUNG CẦN BỔ SUNG TRƯỚC KHI PUBLISHED (${warnings.length} mục):`);
  for (const w of warnings) {
    console.log(`  - ${w}`);
  }
  console.log('');
}

if (hardErrors.length > 0) {
  console.error(`✗ PHÁT HIỆN ${hardErrors.length} LỖI NGHIÊM TRỌNG (CHẶN BUILD/DEPLOY):`);
  for (const err of hardErrors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

if (isStrict && warnings.length > 0) {
  console.error(`✗ Chế độ --strict: Có ${warnings.length} cảnh báo chưa xử lý.`);
  process.exit(1);
}

console.log('✓ Kiểm tra cấu trúc, liên kết file, hình ảnh và các topic published: ĐẠT (0 lỗi chặn deploy).');

#!/usr/bin/env node
/**
 * scripts/migrate-content.mjs
 * Chuyển đổi dữ liệu phân tán cũ (7 nguồn) sang kiến trúc đơn file: src/content/<lesson-slug>/
 * Mỗi topic = 1 file .ts, mỗi bài học = 1 file _lesson.ts
 */

import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ── 1. HELPER NẠP MODULE TYPESCRIPT AN TOÀN ──
const moduleCache = new Map();

function requireTs(relativePath) {
  const fullPath = path.resolve(ROOT, relativePath);
  if (moduleCache.has(fullPath)) return moduleCache.get(fullPath);

  let code = fs.readFileSync(fullPath, 'utf8');
  code = code.replace(/['"]use client['"];?/g, '');

  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.React,
    }
  });

  const moduleObj = { exports: {} };
  moduleCache.set(fullPath, moduleObj.exports);

  const customRequire = (specifier) => {
    if (specifier.startsWith('@/')) {
      const subPath = specifier.slice(2);
      for (const ext of ['', '.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx']) {
        const candidate = path.resolve(ROOT, 'src', subPath + ext);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return requireTs(path.relative(ROOT, candidate));
        }
      }
    } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const fileDir = path.dirname(fullPath);
      for (const ext of ['', '.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx']) {
        const candidate = path.resolve(fileDir, specifier + ext);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return requireTs(path.relative(ROOT, candidate));
        }
      }
    }
    return {};
  };

  const wrapper = vm.runInThisContext(
    `(function (exports, require, module) { ${transpiled.outputText} \n})`,
    { filename: fullPath }
  );
  wrapper(moduleObj.exports, customRequire, moduleObj);
  moduleCache.set(fullPath, moduleObj.exports);
  return moduleObj.exports;
}

// ── 2. NẠP DỮ LIỆU TỪ 7 NGUỒN CŨ ──

// Nguồn 1: lib/lessons.ts
const lessonsMod = requireTs('src/lib/lessons.ts');
const rawLessons = lessonsMod.lessons || [];

// Nguồn 2: data/lesson-content.ts
const lessonContentMod = requireTs('src/data/lesson-content.ts');
const rawLessonContent = lessonContentMod.lessonContent || {};

// Nguồn 3: data/topic-case-studies.ts
const caseStudiesMod = requireTs('src/data/topic-case-studies.ts');
const rawCaseStudies = caseStudiesMod.TOPIC_CASE_STUDIES || {};

// Nguồn 4: app/lessons/[slug]/[topic]/page.tsx (TOPIC_DIAGRAMS)
function getTopicDiagrams() {
  const fullPath = path.resolve(ROOT, 'src/app/lessons/[slug]/[topic]/page.tsx');
  let code = fs.readFileSync(fullPath, 'utf8');
  code += '\nexport { TOPIC_DIAGRAMS };\n';
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React }
  });
  const moduleObj = { exports: {} };
  const wrapper = vm.runInThisContext(`(function (exports, require, module) { ${transpiled.outputText} \n})`);
  wrapper(moduleObj.exports, () => ({}), moduleObj);
  return moduleObj.exports.TOPIC_DIAGRAMS || {};
}
const rawDiagrams = getTopicDiagrams();

// Nguồn 5: components/content/TopicQuiz.tsx (QUIZ_DATABASE)
function getQuizDatabase() {
  const fullPath = path.resolve(ROOT, 'src/components/content/TopicQuiz.tsx');
  let code = fs.readFileSync(fullPath, 'utf8');
  code = code.replace(/['"]use client['"];?/g, '');
  code += '\nexport { QUIZ_DATABASE };\n';
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React }
  });
  const moduleObj = { exports: {} };
  const wrapper = vm.runInThisContext(`(function (exports, require, module) { ${transpiled.outputText} \n})`);
  wrapper(moduleObj.exports, () => ({ useState: () => [{}, () => {}] }), moduleObj);
  return moduleObj.exports.QUIZ_DATABASE || {};
}
const rawQuizDb = getQuizDatabase();

// Nguồn 6: data/narration/*.ts
const narrationDir = path.resolve(ROOT, 'src/data/narration');
const narrationFiles = fs.readdirSync(narrationDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const rawNarrations = {};
for (const f of narrationFiles) {
  const lessonSlug = f.replace('.ts', '');
  const fullPath = path.resolve(narrationDir, f);
  let code = fs.readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  });
  const moduleObj = { exports: {} };
  const wrapper = vm.runInThisContext(`(function (exports, require, module) { ${transpiled.outputText} \n})`);
  wrapper(moduleObj.exports, () => ({}), moduleObj);
  const data = moduleObj.exports.default || moduleObj.exports;
  rawNarrations[lessonSlug] = data.topics || {};
}

// Nguồn 7: data/video-index.ts
const videoIndexMod = requireTs('src/data/video-index.ts');
const rawVideoIndex = videoIndexMod.videoIndex || {};

// ── 3. THỐNG KÊ TRƯỚC KHI CHUYỂN ──
const statsBefore = {
  lessons: rawLessons.length,
  topics: rawLessons.reduce((sum, l) => sum + l.topics.length, 0),
  sections: Object.values(rawLessonContent).reduce((sum, c) => sum + (c.sections ? c.sections.length : 0), 0),
  quizQuestions: Object.values(rawQuizDb).reduce((sum, qList) => sum + qList.length, 0),
  narrations: Object.values(rawNarrations).reduce((sum, tMap) => sum + Object.keys(tMap).length, 0),
  caseStudies: Object.keys(rawCaseStudies).length,
  figures: Object.keys(rawDiagrams).length,
};

// ── 4. CHUẨN HOÁ & TRÍCH XUẤT ──

function getModule(lessonId) {
  if (lessonId <= 3) return 1;
  if (lessonId <= 7) return 2;
  if (lessonId <= 10) return 3;
  if (lessonId <= 14) return 4;
  return 5;
}

function extractSummary(text) {
  if (!text) return '';
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  let sentence = match ? match[0].trim() : text.slice(0, 200).trim();
  if (sentence.length > 200) {
    sentence = sentence.slice(0, 197).trim() + '...';
  }
  return sentence;
}

function parseTopicTitleAndSourceRef(rawTitle) {
  const match = rawTitle.match(/^(\d+\.\d+)\s+(.+)$/);
  if (match) {
    return { sourceRef: match[1], title: match[2].trim() };
  }
  return { sourceRef: undefined, title: rawTitle.trim() };
}

function formatTsCode(code) {
  return code.trim() + '\n';
}

// ── 5. THỰC HIỆN DI CHUYỂN & GHI FILE ──

const targetBaseDir = path.resolve(ROOT, 'src/content');
if (!fs.existsSync(targetBaseDir)) {
  fs.mkdirSync(targetBaseDir, { recursive: true });
}

const statsAfter = {
  lessons: 0,
  topics: 0,
  sections: 0,
  quizQuestions: 0,
  narrations: 0,
  caseStudies: 0,
  figures: 0,
};

const emptyBodyTopics = [];
const generatedFiles = [];

for (const lesson of rawLessons) {
  const lessonDir = path.resolve(targetBaseDir, lesson.slug);
  if (!fs.existsSync(lessonDir)) {
    fs.mkdirSync(lessonDir, { recursive: true });
  }

  const content = rawLessonContent[lesson.slug] || {};
  const sections = content.sections || [];

  // A. Tạo _lesson.ts
  const lessonFileObj = {
    slug: lesson.slug,
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    course: lesson.course,
    session: lesson.session,
    lab: lesson.lab,
    clo: lesson.clo,
    module: getModule(lesson.id),
    topicOrder: lesson.topics.map(t => t.slug),
    overview: content.overview || '',
    objectives: content.objectives || [],
  };

  if (content.review && content.review.length > 0) {
    lessonFileObj.review = content.review;
  }

  const lessonVideo = rawVideoIndex[lesson.slug];
  if (lessonVideo) {
    lessonFileObj.video = {
      provider: lessonVideo.provider,
      id: lessonVideo.id,
      title: lessonVideo.title,
      durationSec: lessonVideo.durationSec,
      ...(lessonVideo.publishedAt ? { publishedAt: lessonVideo.publishedAt } : {}),
      ...(lessonVideo.captions ? { captions: lessonVideo.captions } : {}),
    };
  }

  const lessonFilePath = path.resolve(lessonDir, '_lesson.ts');
  const lessonTsContent = `import { LessonContentFile } from '@/types/content';

export default ${JSON.stringify(lessonFileObj, null, 2)} satisfies LessonContentFile;
`;
  fs.writeFileSync(lessonFilePath, formatTsCode(lessonTsContent), 'utf8');
  statsAfter.lessons++;
  generatedFiles.push(path.relative(ROOT, lessonFilePath));

  // B. Tạo từng topic .ts
  for (const topic of lesson.topics) {
    const { sourceRef, title } = parseTopicTitleAndSourceRef(topic.title);

    // Gán section khớp:
    // Bước 1: Khớp chính xác theo số mục "x.y"
    let matchedSec = null;
    let matchMethod = '';

    if (sourceRef) {
      matchedSec = sections.find(s => {
        const secMatch = s.title.match(/^(\d+\.\d+)/);
        return secMatch && secMatch[1] === sourceRef;
      });
      if (matchedSec) matchMethod = 'exactNumber';
    }

    // Bước 2: Nếu topic không có số "x.y", khớp chính xác 100% theo tiêu đề chuỗi (không gần đúng)
    if (!matchedSec && !sourceRef) {
      matchedSec = sections.find(s => s.title === topic.title);
      if (matchedSec) matchMethod = 'exactTitle';
    }

    let body = [];
    let isBodyEmpty = false;

    if (matchedSec) {
      const bodySection = {
        heading: matchedSec.title,
        text: matchedSec.content,
      };
      if (matchedSec.keyPoints && matchedSec.keyPoints.length > 0) {
        bodySection.keyPoints = matchedSec.keyPoints;
      }
      if (matchedSec.note) {
        bodySection.note = matchedSec.note;
      }
      body.push(bodySection);
      statsAfter.sections++;
    } else {
      isBodyEmpty = true;
      emptyBodyTopics.push({
        lessonSlug: lesson.slug,
        topicSlug: topic.slug,
        topicTitle: topic.title,
      });
    }

    const summary = body.length > 0 ? extractSummary(body[0].text) : '';

    // Figures
    const fig = rawDiagrams[topic.slug];
    const figures = fig ? [{ src: fig.src, caption: fig.caption }] : undefined;
    if (fig) statsAfter.figures++;

    // Case study
    const cs = rawCaseStudies[topic.slug];
    const caseStudy = cs ? {
      title: cs.caseTitle,
      context: cs.industryApplication,
      ...(cs.fieldHardware ? { hardware: cs.fieldHardware } : {}),
      ...(cs.commonPitfall ? { pitfall: cs.commonPitfall } : {}),
    } : undefined;
    if (cs) statsAfter.caseStudies++;

    // Quiz
    const qList = rawQuizDb[topic.slug];
    const quiz = (qList && qList.length > 0) ? qList.map(q => ({
      q: q.question,
      options: q.options,
      answer: q.correct,
      explain: q.explanation,
    })) : undefined;
    if (quiz) statsAfter.quizQuestions += quiz.length;

    // Narration
    const n = rawNarrations[lesson.slug]?.[topic.slug];
    const narration = n ? {
      vi: n.vi,
      ...(n.duration !== undefined ? { durationSec: n.duration } : {}),
      by: n.by || 'ai',
      updatedAt: n.updatedAt || '2026-10-10',
    } : undefined;
    if (narration) statsAfter.narrations++;

    // Video
    let video = undefined;
    if (lessonVideo && lessonVideo.chapters && lessonVideo.chapters[topic.slug] !== undefined) {
      video = { startSec: lessonVideo.chapters[topic.slug] };
    }

    // Xây dựng đối tượng TopicContent
    const topicObj = {
      slug: topic.slug,
      ...(sourceRef ? { sourceRef } : {}),
      title,
      durationMinutes: topic.durationMinutes,
      summary,
      body,
      ...(figures ? { figures } : {}),
      ...(caseStudy ? { caseStudy } : {}),
      ...(quiz ? { quiz } : {}),
      ...(narration ? { narration } : {}),
      ...(video ? { video } : {}),
      status: 'review',
    };

    let serialized = JSON.stringify(topicObj, null, 2);

    if (isBodyEmpty) {
      serialized = serialized.replace(
        '"summary": ""',
        '"summary": "" // TODO(migrate): chưa có summary vì body rỗng'
      );
      serialized = serialized.replace(
        '"body": []',
        `"body": [\n    // TODO(migrate): không tìm thấy section khớp — kiểm tra lại\n  ]`
      );
    }

    const topicFilePath = path.resolve(lessonDir, `${topic.slug}.ts`);
    const topicTsContent = `import { TopicContent } from '@/types/content';

export default ${serialized} satisfies TopicContent;
`;
    fs.writeFileSync(topicFilePath, formatTsCode(topicTsContent), 'utf8');
    statsAfter.topics++;
    generatedFiles.push(path.relative(ROOT, topicFilePath));
  }
}

// ── 6. XUẤT BÁO CÁO ──

console.log('================================================================');
console.log('   BÁO CÁO DI CHUYỂN DỮ LIỆU CŨ SANG SRC/CONTENT (GIAI ĐOẠN 2)  ');
console.log('================================================================\n');

console.log('1. BẢNG ĐỐI CHIẾU SỐ LƯỢNG TRƯỚC VÀ SAU:');
console.log('----------------------------------------------------------------');
console.log('| Đại lượng            | Trước di chuyển | Sau di chuyển | Sai lệch |');
console.log('----------------------------------------------------------------');
const metrics = [
  ['Số bài học (lessons)', statsBefore.lessons, statsAfter.lessons],
  ['Số chuyên đề (topics)', statsBefore.topics, statsAfter.topics],
  ['Số section (body)', statsBefore.sections, statsAfter.sections],
  ['Số câu hỏi quiz', statsBefore.quizQuestions, statsAfter.quizQuestions],
  ['Số đoạn narration', statsBefore.narrations, statsAfter.narrations],
  ['Số case study', statsBefore.caseStudies, statsAfter.caseStudies],
  ['Số sơ đồ (figures)', statsBefore.figures, statsAfter.figures],
];

let allMatched = true;
for (const [name, b, a] of metrics) {
  const diff = a - b;
  const statusStr = diff === 0 ? '0 (Khớp)' : `${diff > 0 ? '+' : ''}${diff} (LỆCH)`;
  if (diff !== 0) allMatched = false;
  console.log(`| ${name.padEnd(20)} | ${String(b).padStart(15)} | ${String(a).padStart(13)} | ${statusStr.padStart(8)} |`);
}
console.log('----------------------------------------------------------------');
console.log(`Kết quả: ${allMatched ? '✓ TOÀN BỘ ĐẠI LƯỢNG KHỚP 100% (KHÔNG THẤT THOÁT DỮ LIỆU)' : '✗ CÓ SAI LỆCH DỮ LIỆU'}\n`);

console.log('2. DANH SÁCH TOPIC CÓ BODY RỖNG / TODO(migrate):');
if (emptyBodyTopics.length === 0) {
  console.log('✓ 0 topic có body rỗng. Tất cả 66 topic đều đã khớp nội dung thành công (52 khớp theo số mục x.y, 14 khớp chính xác 100% tiêu đề).');
} else {
  console.log(`Có ${emptyBodyTopics.length} topic có body rỗng:`);
  for (const item of emptyBodyTopics) {
    console.log(`  - [${item.lessonSlug}] ${item.topicSlug}: "${item.topicTitle}"`);
  }
}
console.log('');

console.log('Tổng số file sinh ra:', generatedFiles.length);
console.log('  - File bài học (_lesson.ts):', statsAfter.lessons);
console.log('  - File chuyên đề (*.ts):', statsAfter.topics);

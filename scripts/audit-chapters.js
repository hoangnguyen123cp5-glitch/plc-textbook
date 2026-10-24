const fs = require('fs');

// Load lessonContent
const content = fs.readFileSync('src/data/lesson-content.ts', 'utf8');
const start = content.indexOf('export const lessonContent');
const code = 'const ' + content.slice(start).replace('export const lessonContent: Record<string, LessonContent> =', 'lessonContent =') + '; module.exports = lessonContent;';
const path = require('path');
const tempFile = path.join(__dirname, 'temp-audit.cjs');
fs.writeFileSync(tempFile, code);
const lessonContent = require(tempFile);
fs.unlinkSync(tempFile);

// Load lessons
const lessonsLib = fs.readFileSync('src/lib/lessons.ts', 'utf8');
const lessonRegex = /id:\s*(\d+),\s*slug:\s*'([0-9]{2}-[a-z0-9-]+)',\s*title:\s*'([^']+)'/g;
const lessons = [];
let m;
while ((m = lessonRegex.exec(lessonsLib)) !== null) {
  lessons.push({ id: Number(m[1]), slug: m[2], title: m[3] });
}

console.log('AUDIT OF ALL 15 CHAPTERS:');
console.log('========================================================================');

let totalTopicsAll = 0;
let fullyMappedTopics = 0;

lessons.forEach(l => {
  const lc = lessonContent[l.slug];
  const sectionCount = lc && lc.sections ? lc.sections.length : 0;
  
  // Extract topics for this lesson
  const needle = "slug: '" + l.slug + "'";
  const blockStart = lessonsLib.indexOf(needle);
  const nextLessonIdx = lessonsLib.indexOf('topics: [', blockStart);
  const endTopicsIdx = lessonsLib.indexOf('],', nextLessonIdx);
  const topicsBlock = lessonsLib.slice(nextLessonIdx, endTopicsIdx);
  const topicTitles = [...topicsBlock.matchAll(/title:\s*'([^']+)'/g)].map(t => t[1]);
  
  console.log(`[L${String(l.id).padStart(2,'0')}] ${l.slug} (${l.title})`);
  console.log(`     • Topics in syllabus: ${topicTitles.length} | Sections in content: ${sectionCount}`);
  
  topicTitles.forEach((tTitle, idx) => {
    totalTopicsAll++;
    let matched = null;
    if (lc && lc.sections) {
      const numMatch = tTitle.match(/^(\d+\.\d+)/);
      if (numMatch) {
        matched = lc.sections.find(s => s.title.includes(numMatch[1]));
      }
      if (!matched && idx < lc.sections.length) {
        matched = lc.sections[idx];
      }
    }
    if (matched) {
      fullyMappedTopics++;
    } else {
      console.log(`       ❌ UNMAPPED: "${tTitle}"`);
    }
  });
});

console.log('========================================================================');
console.log(`TOTAL: ${fullyMappedTopics} / ${totalTopicsAll} topics mapped to content.`);

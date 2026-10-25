const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'lesson-content.ts'), 'utf8');
const start = content.indexOf('export const lessonContent');
const code = 'const ' + content.slice(start).replace('export const lessonContent: Record<string, LessonContent> =', 'lessonContent =') + '; module.exports = lessonContent;';
const tempFile = path.join(__dirname, 'temp-inspect.cjs');
fs.writeFileSync(tempFile, code);
const lessonContent = require(tempFile);
fs.unlinkSync(tempFile);

Object.keys(lessonContent).forEach(slug => {
  const lc = lessonContent[slug];
  const secCount = lc.sections ? lc.sections.length : 0;
  let totalWords = 0;
  let secDetails = [];
  if (lc.sections) {
    lc.sections.forEach(s => {
      const words = s.content ? s.content.split(/\s+/).length : 0;
      totalWords += words;
      secDetails.push({ title: s.title, words, keyPoints: s.keyPoints ? s.keyPoints.length : 0, hasNote: !!s.note });
    });
  }
  console.log(`[${slug}] Sections: ${secCount} | Total Words: ${totalWords}`);
  secDetails.forEach(s => {
    console.log(`   • ${s.title.padEnd(55)}: ${s.words} words | ${s.keyPoints} pts | note: ${s.hasNote}`);
  });
  console.log('------------------------------------------------------------------------');
});

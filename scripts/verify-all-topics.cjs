const fs = require('fs');
const path = require('path');

const lessonsTs = fs.readFileSync(path.join(__dirname, '../src/lib/lessons.ts'), 'utf8');
const { lessonContent } = require('../src/data/lesson-content.ts');

// We can extract lessons list using regex
const lessonMatches = [...lessonsTs.matchAll(/slug:\s*'([^']+)',\s*title:\s*'([^']+)'[\s\S]*?topics:\s*\[([\s\S]*?)\]/g)];

let totalTopics = 0;
let matchedCount = 0;

for (const match of lessonMatches) {
  const lessonSlug = match[1];
  const lessonTitle = match[2];
  const topicsBlock = match[3];
  const topicList = [...topicsBlock.matchAll(/slug:\s*'([^']+)',\s*title:\s*'([^']+)'/g)].map(m => ({ slug: m[1], title: m[2] }));
  
  const contentData = lessonContent[lessonSlug];
  if (!contentData) {
    console.error(`ERROR: No contentData for lesson ${lessonSlug}!`);
    continue;
  }
  
  console.log(`\n=== [${lessonSlug}] (${topicList.length} topics) ===`);
  
  topicList.forEach((topic, idx) => {
    totalTopics++;
    const numMatch = topic.title.match(/^(\d+\.\d+)/);
    const section = contentData.sections.find((s) => {
      if (s.title === topic.title) return true;
      if (numMatch && s.title.includes(numMatch[1])) return true;
      const cleanTopicTitle = topic.title.replace(/^\d+\.\d+\s*/, '').toLowerCase();
      const cleanSecTitle = s.title.replace(/^\d+\.\d+\s*/, '').toLowerCase();
      return cleanSecTitle.includes(cleanTopicTitle) || cleanTopicTitle.includes(cleanSecTitle);
    }) ?? contentData.sections[idx];
    
    if (section && section.content && section.content.length > 50) {
      matchedCount++;
      const wordCount = section.content.split(/\s+/).length;
      console.log(`  ✓ Topic "${topic.title}" -> Section "${section.title}" (${wordCount} words, ${section.keyPoints ? section.keyPoints.length : 0} pts, note: ${!!section.note})`);
    } else {
      console.error(`  ✗ MISMATCH on topic: "${topic.title}" in ${lessonSlug}`);
    }
  });
}

console.log(`\nRESULTS: ${matchedCount} / ${totalTopics} topics successfully matched to rich sections!`);

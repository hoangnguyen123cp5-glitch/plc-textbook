const fs = require('fs');
const path = require('path');

const lessonsTs = fs.readFileSync(path.join(__dirname, '../src/lib/lessons.ts'), 'utf8');
const contentTs = fs.readFileSync(path.join(__dirname, '../src/data/lesson-content.ts'), 'utf8');

// Parse lessonsTs roughly
const lessonMatches = [...lessonsTs.matchAll(/slug:\s*'([^']+)',\s*title:\s*'([^']+)'[\s\S]*?topics:\s*\[([\s\S]*?)\]/g)];

for (const match of lessonMatches) {
  const slug = match[1];
  const title = match[2];
  const topicsBlock = match[3];
  const topicTitles = [...topicsBlock.matchAll(/title:\s*'([^']+)'/g)].map(m => m[1]);
  
  // Find sections in contentTs
  const contentIdx = contentTs.indexOf(`'${slug}':`);
  if (contentIdx === -1) {
    console.log(`\n=== [${slug}] (${title}) ===\nTopics (${topicTitles.length}):\n  ` + topicTitles.join('\n  '));
    console.log(`NO CONTENT FOUND!`);
    continue;
  }
  
  const nextContentIdx = contentTs.indexOf(`\n  '`, contentIdx + 10);
  const block = contentTs.slice(contentIdx, nextContentIdx !== -1 ? nextContentIdx : contentIdx + 20000);
  const sectionTitles = [...block.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
  
  console.log(`\n=== [${slug}] (${title}) ===`);
  console.log(`Topics (${topicTitles.length}):\n  ` + topicTitles.map((t, i) => `[T${i+1}] ${t}`).join('\n  '));
  console.log(`Sections (${sectionTitles.length}):\n  ` + sectionTitles.map((s, i) => `[S${i+1}] ${s}`).join('\n  '));
}

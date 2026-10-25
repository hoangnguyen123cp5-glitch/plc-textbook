const fs = require('fs');
const content = fs.readFileSync('src/lib/lessons.ts', 'utf8');
const regex = /slug:\s*'([^']+)',\s*title:\s*'([^']+)'[\s\S]*?topics:\s*\[([\s\S]*?)\]/g;
let m;
let total = 0;
while ((m = regex.exec(content)) !== null) {
  const lessonSlug = m[1];
  const lessonTitle = m[2];
  const topicsBlock = m[3];
  const tMatches = [...topicsBlock.matchAll(/slug:\s*'([^']+)',\s*title:\s*'([^']+)'/g)];
  console.log(`\n### ${lessonSlug} (${lessonTitle}) - ${tMatches.length} topics`);
  tMatches.forEach((tm, i) => {
    total++;
    console.log(`  ${i+1}. [${tm[1]}] ${tm[2]}`);
  });
}
console.log('\nTOTAL TOPICS: ' + total);

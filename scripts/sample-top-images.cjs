const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../public/images/slides');
const lessons = fs.readdirSync(base);

for (const lesson of lessons) {
  const p = path.join(base, lesson);
  if (!fs.statSync(p).isDirectory()) continue;
  const files = fs.readdirSync(p).map(f => {
    const stat = fs.statSync(path.join(p, f));
    return { name: f, size: stat.size };
  }).sort((a, b) => b.size - a.size); // largest files usually have the highest resolution diagrams
  
  console.log(`\n=== ${lesson} (${files.length} images) ===`);
  files.slice(0, 5).forEach(f => {
    console.log(`   ${f.name} (${Math.round(f.size / 1024)} KB)`);
  });
}

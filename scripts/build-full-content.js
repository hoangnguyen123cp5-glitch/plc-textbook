const fs = require('fs');
const path = require('path');

const originalFile = path.join(__dirname, '../src/data/lesson-content.ts');
const originalContent = fs.readFileSync(originalFile, 'utf8');

// Extract Lesson 01 exactly as it is
const l01Start = originalContent.indexOf("'01-programmable-control':");
const l01End = originalContent.indexOf("'02-s7-1200-tia-portal':");

if (l01Start === -1 || l01End === -1) {
  console.error("Could not find Lesson 01 boundaries in lesson-content.ts!");
  process.exit(1);
}

const l01Block = originalContent.slice(l01Start, l01End).trim().replace(/,$/, '');

// Load lessons 02 to 15 from scripts/lessons-data/
const lessonModules = [
  { slug: '02-s7-1200-tia-portal', mod: require('./lessons-data/lesson02.js') },
  { slug: '03-binary-operations', mod: require('./lessons-data/lesson03.js') },
  { slug: '04-numeric-operations', mod: require('./lessons-data/lesson04.js') },
  { slug: '05-analog-signals', mod: require('./lessons-data/lesson05.js') },
  { slug: '06-other-plc-brands', mod: require('./lessons-data/lesson06.js') },
  { slug: '07-system-design', mod: require('./lessons-data/lesson07.js') },
  { slug: '08-advanced-instructions', mod: require('./lessons-data/lesson08.js') },
  { slug: '09-high-speed-counting', mod: require('./lessons-data/lesson09.js') },
  { slug: '10-closed-loop-pid', mod: require('./lessons-data/lesson10.js') },
  { slug: '11-communication', mod: require('./lessons-data/lesson11.js') },
  { slug: '12-fault-diagnostics', mod: require('./lessons-data/lesson12.js') },
  { slug: '13-s7-300', mod: require('./lessons-data/lesson13.js') },
  { slug: '14-system-upgrade', mod: require('./lessons-data/lesson14.js') },
  { slug: '15-system-integration', mod: require('./lessons-data/lesson15.js') },
];

let output = `// Comprehensive PLC Textbook Lesson Content
// Systematically structured across all 15 lessons and 66 curriculum topics.
// Rigorous university-level industrial automation engineering content.

export interface LessonContent {
  overview: string;
  objectives: string[];
  sections: {
    title: string;
    content: string;
    keyPoints?: string[];
    note?: string;
  }[];
  review?: string[];
}

export const lessonContent: Record<string, LessonContent> = {

  ${l01Block},

`;

for (const { slug, mod } of lessonModules) {
  output += `  '${slug}': ${JSON.stringify(mod, null, 2)},\n\n`;
}

output += `};\n`;

fs.writeFileSync(originalFile, output, 'utf8');
console.log("Successfully rebuilt src/data/lesson-content.ts with comprehensive technical content!");

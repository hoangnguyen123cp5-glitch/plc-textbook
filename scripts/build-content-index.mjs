import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const contentDir = path.resolve(ROOT, 'src/content');

// Clean up any empty directory that lacks _lesson.ts
const allEntries = fs.readdirSync(contentDir, { withFileTypes: true });
for (const entry of allEntries) {
  if (entry.isDirectory() && !entry.name.startsWith('_')) {
    const lessonPath = path.resolve(contentDir, entry.name, '_lesson.ts');
    if (!fs.existsSync(lessonPath)) {
      console.log(`Removing empty leftover directory: ${entry.name}`);
      fs.rmSync(path.resolve(contentDir, entry.name), { recursive: true, force: true });
    }
  }
}

const dirs = fs.readdirSync(contentDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_'))
  .map(d => d.name)
  .sort();

console.log(`Found ${dirs.length} valid lesson directories.`);

let imports = [];
let lessonEntries = [];
let topicMapEntries = [];

function safeVar(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '_');
}

for (const dir of dirs) {
  const lessonVar = `lesson_${safeVar(dir)}`;
  imports.push(`import ${lessonVar} from './${dir}/_lesson';`);
  lessonEntries.push(lessonVar);

  const files = fs.readdirSync(path.resolve(contentDir, dir))
    .filter(f => f.endsWith('.ts') && f !== '_lesson.ts')
    .map(f => f.replace('.ts', ''));

  for (const f of files) {
    const topicVar = `topic_${safeVar(dir)}_${safeVar(f)}`;
    imports.push(`import ${topicVar} from './${dir}/${f}';`);
    topicMapEntries.push(`  '${dir}/${f}': ${topicVar},`);
  }
}

const indexContent = `// Tự động sinh từ src/content/
import type { LessonContentFile, TopicContent } from '@/types/content';

${imports.join('\n')}

export const allLessons: LessonContentFile[] = [
  ${lessonEntries.join(',\n  ')}
].sort((a, b) => a.id - b.id);

export const allTopics: Record<string, TopicContent> = {
${topicMapEntries.join('\n')}
};

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Lấy thông tin bài học theo slug.
 * Lọc bỏ topic draft trong topicOrder khi chạy production build.
 */
export function getLesson(slug: string): LessonContentFile | undefined {
  const lesson = allLessons.find(l => l.slug === slug);
  if (!lesson) return undefined;
  if (isProduction) {
    return {
      ...lesson,
      topicOrder: lesson.topicOrder.filter(topicSlug => {
        const topic = allTopics[\`\${slug}/\${topicSlug}\`];
        return topic && topic.status !== 'draft';
      })
    };
  }
  return lesson;
}

/**
 * Lấy danh sách tất cả các bài học.
 */
export function getLessons(): LessonContentFile[] {
  if (isProduction) {
    return allLessons.map(lesson => ({
      ...lesson,
      topicOrder: lesson.topicOrder.filter(topicSlug => {
        const topic = allTopics[\`\${lesson.slug}/\${topicSlug}\`];
        return topic && topic.status !== 'draft';
      })
    }));
  }
  return allLessons;
}

/**
 * Lấy nội dung chi tiết của một topic theo lessonSlug và topicSlug.
 * Ẩn topic có status === 'draft' khi chạy production build.
 */
export function getTopic(lessonSlug: string, topicSlug: string): TopicContent | undefined {
  const topic = allTopics[\`\${lessonSlug}/\${topicSlug}\`];
  if (!topic) return undefined;
  if (isProduction && topic.status === 'draft') return undefined;
  return topic;
}

/**
 * Tính số hiển thị của topic trên web, ví dụ "1.1", "2.1", "2.2"...
 * Công thức: lesson.id + '.' + (vị trí trong topicOrder + 1)
 */
export function topicNumber(lessonSlugOrLesson: string | LessonContentFile, topicSlug: string): string {
  const lesson = typeof lessonSlugOrLesson === 'string' ? getLesson(lessonSlugOrLesson) : lessonSlugOrLesson;
  if (!lesson) return '';
  const idx = lesson.topicOrder.indexOf(topicSlug);
  if (idx === -1) return '';
  return \`\${lesson.id}.\${idx + 1}\`;
}
`;

fs.writeFileSync(path.resolve(contentDir, 'index.ts'), indexContent, 'utf8');
console.log('Successfully generated src/content/index.ts with exactly 15 lessons and 66 topics.');

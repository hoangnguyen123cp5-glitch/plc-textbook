import { MetadataRoute } from 'next';
import { lessons } from '@/lib/lessons';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Cùng nguồn với basePath trong next.config.mjs → sitemap không bao giờ lệch
  // khỏi URL thật khi đổi tên repo hoặc gắn custom domain sau này.
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoangnguyen123cp5-glitch.github.io';
  const base = `${site}${process.env.NEXT_PUBLIC_BASE_PATH || '/plc-textbook'}`;

  const lessonPages = lessons.map((l) => ({
    url: `${base}/lessons/${l.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const topicPages = lessons.flatMap((l) =>
    l.topics.map((t) => ({
      url: `${base}/lessons/${l.slug}/${t.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/lessons/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/simulator/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...lessonPages,
    ...topicPages,
  ];
}

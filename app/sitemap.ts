import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kainara.id';

  return [
    {
      url: siteUrl,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/kuis`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

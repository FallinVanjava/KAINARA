import type { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kainara.id';

  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/motif`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/kuis`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    const supabase = createStaticClient();
    const { data: motifs } = await supabase
      .from('motifs')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (motifs) {
      const motifRoutes: MetadataRoute.Sitemap = motifs.map((motif) => ({
        url: `${siteUrl}/motif/${motif.slug}`,
        lastModified: new Date(motif.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      return [...baseRoutes, ...motifRoutes];
    }
  } catch {
    // Fallback bila database belum siap saat sitemap di-generate
  }

  return baseRoutes;
}

import { createClient } from '@/lib/supabase/server';

export interface HomeMotif {
  id: string;
  nama: string;
  slug: string;
  daerah_asal: string | null;
  deskripsi: string | null;
  warna_dominan: string[];
  gambar_url: string | null;
}

export interface HomeData {
  stats: {
    totalMotif: number;
    totalOutfit: number;
    totalSkintone: number;
  };
  featuredMotifs: HomeMotif[];
}

export async function getHomeData(): Promise<HomeData> {
  const supabase = await createClient();

  const [motifsCountRes, outfitsCountRes, skintonesCountRes, featuredMotifsRes] = await Promise.all([
    supabase.from('motifs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('outfits').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('skintones').select('*', { count: 'exact', head: true }),
    supabase
      .from('motifs')
      .select('id, nama, slug, daerah_asal, deskripsi, warna_dominan, gambar_url')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(4),
  ]);

  for (const res of [motifsCountRes, outfitsCountRes, skintonesCountRes, featuredMotifsRes]) {
    if (res.error) console.error('getHomeData:', res.error.message);
  }

  return {
    stats: {
      totalMotif: motifsCountRes.count ?? 0,
      totalOutfit: outfitsCountRes.count ?? 0,
      totalSkintone: skintonesCountRes.count ?? 0,
    },
    featuredMotifs: featuredMotifsRes.data ?? [],
  };
}

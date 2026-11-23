import { createClient, createStaticClient } from '@/lib/supabase/server';
import type { Motif, Skintone, Outfit } from '@/types/database';

export interface SkintoneMatchItem {
  skor_kecocokan: number;
  catatan: string | null;
  skintone: Skintone | null;
}

export interface MotifDetailData {
  motif: Motif;
  skintoneMatches: SkintoneMatchItem[];
  relatedOutfits: Outfit[];
}

export interface GetMotifsParams {
  q?: string;
  warna?: string;
  daerah?: string;
  page?: number;
  limit?: number;
}

export interface GetMotifsResult {
  items: Motif[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getMotifs({
  q,
  warna,
  daerah,
  page = 1,
  limit = 12,
}: GetMotifsParams = {}): Promise<GetMotifsResult> {
  const supabase = await createClient();

  let query = supabase
    .from('motifs')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('nama', { ascending: true });

  if (q?.trim()) {
    const term = q.trim();
    query = query.or(`nama.ilike.%${term}%,daerah_asal.ilike.%${term}%`);
  }

  if (warna && warna.toLowerCase() !== 'semua') {
    query = query.contains('warna_dominan', [warna.toLowerCase()]);
  }

  if (daerah && daerah.trim().toLowerCase() !== 'semua') {
    query = query.ilike('daerah_asal', `%${daerah.trim()}%`);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching motifs:', error);
    return { items: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items: data ?? [],
    total,
    page,
    totalPages,
  };
}

export async function getDistinctColors(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('motifs')
    .select('warna_dominan')
    .eq('is_published', true);

  if (error || !data) return [];

  const colorSet = new Set<string>();
  data.forEach((row) => {
    if (Array.isArray(row.warna_dominan)) {
      row.warna_dominan.forEach((c) => {
        if (c && typeof c === 'string') colorSet.add(c.toLowerCase().trim());
      });
    }
  });

  return Array.from(colorSet).sort();
}

export async function getDistinctRegions(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('motifs')
    .select('daerah_asal')
    .eq('is_published', true);

  if (error || !data) return [];

  const regions = new Set<string>();
  data.forEach((row) => {
    if (row.daerah_asal && typeof row.daerah_asal === 'string') {
      row.daerah_asal.split(/[,/]/).forEach((part) => {
        const value = part.trim();
        if (value) regions.add(value);
      });
    }
  });
  const preferred = ['Menggala', 'Way Kanan', 'Pesisir', 'Pubian'];
  return Array.from(regions).sort((a, b) => {
    const ai = preferred.indexOf(a);
    const bi = preferred.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.localeCompare(b);
  });
}

export async function getMotifBySlug(slug: string): Promise<MotifDetailData | null> {
  const supabase = await createClient();

  const { data: motif, error: motifError } = await supabase
    .from('motifs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (motifError || !motif) {
    return null;
  }

  const [matchesRes, outfitsRes] = await Promise.all([
    supabase
      .from('motif_skintone_match')
      .select('skor_kecocokan, catatan, skintone:skintones(*)')
      .eq('motif_id', motif.id)
      .order('skor_kecocokan', { ascending: false }),
    supabase
      .from('outfit_motif')
      .select('outfit:outfits(*)')
      .eq('motif_id', motif.id),
  ]);

  const skintoneMatches: SkintoneMatchItem[] = (matchesRes.data ?? []).map((item) => ({
    skor_kecocokan: item.skor_kecocokan,
    catatan: item.catatan,
    skintone: item.skintone as unknown as Skintone | null,
  }));

  const relatedOutfits: Outfit[] = (outfitsRes.data ?? [])
    .map((item) => item.outfit as unknown as Outfit | null)
    .filter((o): o is Outfit => Boolean(o && o.is_published));

  return {
    motif,
    skintoneMatches,
    relatedOutfits,
  };
}

export async function getAllPublishedMotifSlugs(): Promise<string[]> {
  try {
    const supabase = createStaticClient();

    const { data, error } = await supabase
      .from('motifs')
      .select('slug')
      .eq('is_published', true);

    if (error || !data) return [];

    return data.map((m) => m.slug);
  } catch {
    // Build tanpa env Supabase tetap jalan; halaman detail dirender saat runtime.
    return [];
  }
}

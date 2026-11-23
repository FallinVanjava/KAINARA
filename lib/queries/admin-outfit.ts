import { createClient } from '@/lib/supabase/server';
import type { Outfit } from '@/types/database';

export interface OutfitWithMotifs extends Outfit {
  outfit_motif?: Array<{
    motif?: {
      id: string;
      nama: string;
      slug: string;
    } | null;
  }>;
}

export interface GetAdminOutfitsParams {
  q?: string;
  kategori?: string;
  sortBy?: 'nama' | 'kategori' | 'created_at' | 'is_published';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetAdminOutfitsResult {
  items: OutfitWithMotifs[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getAdminOutfits({
  q,
  kategori,
  sortBy = 'created_at',
  order = 'desc',
  page = 1,
  limit = 10,
}: GetAdminOutfitsParams = {}): Promise<GetAdminOutfitsResult> {
  const supabase = await createClient();

  let query = supabase
    .from('outfits')
    .select('*, outfit_motif(motif:motifs(id, nama, slug))', { count: 'exact' });

  if (q?.trim()) {
    query = query.ilike('nama', `%${q.trim()}%`);
  }

  if (kategori && kategori !== 'semua') {
    query = query.eq('kategori', kategori);
  }

  query = query.order(sortBy, { ascending: order === 'asc' });

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error getAdminOutfits:', error);
    return { items: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items: (data as unknown as OutfitWithMotifs[]) ?? [],
    total,
    page,
    totalPages,
  };
}

export async function getAllMotifsShort(): Promise<Array<{ id: string; nama: string; slug: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('motifs')
    .select('id, nama, slug')
    .order('nama', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getOutfitForEdit(id: string) {
  const supabase = await createClient();

  const [outfitRes, motifPairsRes] = await Promise.all([
    supabase.from('outfits').select('*').eq('id', id).single(),
    supabase.from('outfit_motif').select('motif_id').eq('outfit_id', id),
  ]);

  if (outfitRes.error || !outfitRes.data) {
    return null;
  }

  return {
    outfit: outfitRes.data,
    selectedMotifIds: (motifPairsRes.data || []).map((p) => p.motif_id),
  };
}

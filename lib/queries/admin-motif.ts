import { createClient } from '@/lib/supabase/server';
import type { Motif, Skintone } from '@/types/database';

export interface GetAdminMotifsParams {
  q?: string;
  sortBy?: 'nama' | 'daerah_asal' | 'created_at' | 'is_published';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetAdminMotifsResult {
  items: Motif[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getAdminMotifs({
  q,
  sortBy = 'created_at',
  order = 'desc',
  page = 1,
  limit = 10,
}: GetAdminMotifsParams = {}): Promise<GetAdminMotifsResult> {
  const supabase = await createClient();

  let query = supabase
    .from('motifs')
    .select('*', { count: 'exact' });

  if (q?.trim()) {
    const term = q.trim();
    query = query.or(`nama.ilike.%${term}%,daerah_asal.ilike.%${term}%`);
  }

  query = query.order(sortBy, { ascending: order === 'asc' });

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error getAdminMotifs:', error);
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

export async function getAllSkintones(): Promise<Skintone[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skintones')
    .select('*')
    .order('nama', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getMotifForEdit(id: string) {
  const supabase = await createClient();

  const [motifRes, matchesRes] = await Promise.all([
    supabase.from('motifs').select('*').eq('id', id).single(),
    supabase.from('motif_skintone_match').select('skintone_id, skor_kecocokan, catatan').eq('motif_id', id),
  ]);

  if (motifRes.error || !motifRes.data) {
    return null;
  }

  return {
    motif: motifRes.data,
    matches: matchesRes.data ?? [],
  };
}

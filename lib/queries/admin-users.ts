import { createClient } from '@/lib/supabase/server';
import type { Profile, Skintone } from '@/types/database';

export interface ProfileWithSkintone extends Profile {
  skintone?: Skintone | null;
}

export interface GetAdminUsersParams {
  q?: string;
  role?: string;
  status?: string;
  sortBy?: 'nama' | 'email' | 'role' | 'created_at';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetAdminUsersResult {
  items: ProfileWithSkintone[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserScanLog {
  id: string;
  tipe: 'motif' | 'skintone';
  hasil: Record<string, unknown>;
  created_at: string;
  motif?: {
    nama: string;
    slug: string;
  } | null;
  skintone?: {
    nama: string;
    hex_color: string;
    undertone: string;
  } | null;
}

export interface UserDetailResult {
  profile: ProfileWithSkintone;
  scanLogs: UserScanLog[];
}

export async function getAdminUsers({
  q,
  role,
  status,
  sortBy = 'created_at',
  order = 'desc',
  page = 1,
  limit = 10,
}: GetAdminUsersParams = {}): Promise<GetAdminUsersResult> {
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('*, skintone:skintones!profiles_skintone_terakhir_fkey(*)', { count: 'exact' });

  if (q?.trim()) {
    const term = q.trim();
    query = query.or(`nama.ilike.%${term}%,email.ilike.%${term}%`);
  }

  if (role === 'admin' || role === 'user') {
    query = query.eq('role', role);
  }

  if (status && status !== 'semua') {
    if (status === 'aktif') {
      query = query.eq('is_active', true);
    } else if (status === 'nonaktif') {
      query = query.eq('is_active', false);
    }
  }

  query = query.order(sortBy, { ascending: order === 'asc' });

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error getAdminUsers:', error);
    return { items: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items: (data as unknown as ProfileWithSkintone[]) ?? [],
    total,
    page,
    totalPages,
  };
}

export async function getUserDetail(id: string): Promise<UserDetailResult | null> {
  const supabase = await createClient();

  const [profileRes, scanRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, skintone:skintones!profiles_skintone_terakhir_fkey(*)')
      .eq('id', id)
      .single(),
    supabase
      .from('scan_logs')
      .select('id, tipe, hasil, created_at, motif:motifs(nama, slug), skintone:skintones(nama, hex_color, undertone)')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  if (profileRes.error || !profileRes.data) {
    return null;
  }

  return {
    profile: profileRes.data as unknown as ProfileWithSkintone,
    scanLogs: (scanRes.data as unknown as UserScanLog[]) || [],
  };
}

import { createClient } from '@/lib/supabase/server';
import { getJakartaDate, getJakartaDateDaysAgo } from '@/lib/utils/date';

export { getJakartaDate, getJakartaDateDaysAgo };

export interface DashboardSummary {
  total_pengguna: number;
  pengguna_baru_7hari: number;
  total_scan_motif: number;
  total_scan_skintone: number;
  total_percobaan_kuis: number;
  rata_rata_skor_kuis: number;
  total_motif: number;
  total_outfit: number;
}

export interface ScanPerDayItem {
  tanggal: string;
  scan_motif: number;
  scan_skintone: number;
}

export interface TopMotifItem {
  motif_id: string;
  nama: string;
  total: number;
}

export interface SkintoneDistItem {
  skintone_id: string;
  nama: string;
  hex_color: string;
  total: number;
}

export interface LoginStatsItem {
  total_login: number;
  login_7hari: number;
}

export interface DashboardStatsResult {
  summary: DashboardSummary | null;
  scanPerDay: ScanPerDayItem[];
  topMotifs: TopMotifItem[];
  skintoneDistribution: SkintoneDistItem[];
  loginStats: LoginStatsItem;
  error?: string | null;
}

export async function getAdminDashboardStats(
  startDate?: string,
  endDate?: string
): Promise<DashboardStatsResult> {
  const supabase = await createClient();

  const p_end = endDate || getJakartaDate();
  const p_start = startDate || getJakartaDateDaysAgo(29);
  const loginStart = startDate || getJakartaDateDaysAgo(6);

  try {
    const [summaryRes, scanRes, topMotifsRes, skintoneRes] =
      await Promise.all([
        supabase.rpc('admin_dashboard_summary'),
        supabase.rpc('admin_scan_per_day', { p_start, p_end }),
        supabase.rpc('admin_top_motifs', { p_start, p_end, p_limit: 10 }),
        supabase.rpc('admin_skintone_distribution'),
      ]);

    if (summaryRes.error) {
      console.error('Error admin_dashboard_summary:', summaryRes.error);
    }
    if (scanRes.error) {
      console.error('Error admin_scan_per_day:', scanRes.error);
    }
    if (topMotifsRes.error) {
      console.error('Error admin_top_motifs:', topMotifsRes.error);
    }
    if (skintoneRes.error) {
      console.error('Error admin_skintone_distribution:', skintoneRes.error);
    }

    // === Login history stats (fallback 0 jika tabel belum dibuat) ===
    let loginTotal = 0;
    let login7Hari = 0;
    try {
      const totalRes = await supabase
        .from('login_history')
        .select('*', { count: 'exact', head: true });
      if (!totalRes.error && totalRes.count !== null) {
        loginTotal = totalRes.count;
      }
    } catch {}
    try {
      const sevenRes = await supabase
        .from('login_history')
        .select('*', { count: 'exact', head: true })
        .gte('logged_at', `${loginStart}T00:00:00+07:00`);
      if (!sevenRes.error && sevenRes.count !== null) {
        login7Hari = sevenRes.count;
      }
    } catch {}

    const hasAnyError =
      summaryRes.error ||
      scanRes.error ||
      topMotifsRes.error ||
      skintoneRes.error;

    return {
      summary: (summaryRes.data as unknown as DashboardSummary) || null,
      scanPerDay: (scanRes.data as unknown as ScanPerDayItem[]) || [],
      topMotifs: (topMotifsRes.data as unknown as TopMotifItem[]) || [],
      skintoneDistribution:
        (skintoneRes.data as unknown as SkintoneDistItem[]) || [],
      loginStats: {
        total_login: loginTotal,
        login_7hari: login7Hari,
      },
      error: hasAnyError ? 'Sebagian statistik gagal dimuat dari server.' : null,
    };
  } catch (err) {
    console.error('Error getAdminDashboardStats:', err);
    return {
      summary: null,
      scanPerDay: [],
      topMotifs: [],
      skintoneDistribution: [],
      loginStats: { total_login: 0, login_7hari: 0 },
      error: 'Terjadi kegagalan komunikasi saat memuat data statistik.',
    };
  }
}

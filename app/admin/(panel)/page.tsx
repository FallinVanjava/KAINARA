import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers,
  LogIn,
  Shirt,
  HelpCircle,
  Users,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminDashboardStats } from '@/lib/queries/admin-stats';
import { DateRangeFilter } from '@/components/admin/stats/date-range-filter';
import { KpiCards } from '@/components/admin/stats/kpi-cards';
import { ScanLineChart } from '@/components/admin/charts/scan-line-chart';
import { TopMotifsChart } from '@/components/admin/charts/top-motifs-chart';
import { SkintoneDonutChart } from '@/components/admin/charts/skintone-donut-chart';
import { QuizSummaryCard } from '@/components/admin/charts/quiz-summary-card';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Dashboard Statistik | Admin Kainara',
  description: 'Ringkasan analitik pengguna, scan motif, dan kuis Kainara.',
};

interface AdminDashboardPageProps {
  searchParams: Promise<{
    dari?: string;
    sampai?: string;
  }>;
}

async function DashboardContent({ searchParams }: AdminDashboardPageProps) {
  const { profile } = await requireAdmin();
  const params = await searchParams;

  const dari = typeof params.dari === 'string' ? params.dari : undefined;
  const sampai = typeof params.sampai === 'string' ? params.sampai : undefined;

  const stats = await getAdminDashboardStats(dari, sampai);
  const displayName = profile.nama || profile.email?.split('@')[0] || 'Administrator';

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Ucapan Selamat Datang */}
      <div className="rounded-[24px] border border-[#E8D8C8] bg-white p-6 sm:p-8 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
          Pusat Kontrol Budaya
        </span>
        <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Selamat Datang, {displayName}!
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed max-w-2xl">
          Pantau statistik aktivitas pemindaian motif tapis Lampung, tren warna kulit, serta performa edukasi kuis Kainara secara real-time.
        </p>
      </div>

      {/* Banner Peringatan Bila RPC Menghasilkan Error */}
      {stats.error && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{stats.error}</span>
        </div>
      )}

      {/* Filter Rentang Tanggal */}
      <DateRangeFilter currentDari={dari} currentSampai={sampai} />

      {/* Kartu KPI Summary */}
      <KpiCards summary={stats.summary} />
      <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5]">Riwayat Login</span>
          <LogIn className="size-4 text-[#96640F] dark:text-[#E8C36A]" />
        </div>
        <p className="mt-3 font-heading text-2xl font-extrabold text-[#5E0F11] dark:text-[#F6E9DC]">{stats.loginStats.total_login}</p>
        <p className="mt-1 text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">Total login tercatat · {stats.loginStats.login_7hari} dalam 7 hari terakhir</p>
      </div>

      {/* Grafik Aktivitas Harian (Line Chart) */}
      <ScanLineChart data={stats.scanPerDay} />

      {/* Grid 2 Kolom: Top Motif & Donut Skintone */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopMotifsChart data={stats.topMotifs} />
        <SkintoneDonutChart data={stats.skintoneDistribution} />
      </div>

      {/* Ringkasan Performa Kuis */}
      <QuizSummaryCard stats={stats.quizStats} />

      {/* Akses Cepat Modul Konten */}
      <div className="space-y-4 pt-4 border-t border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <h2 className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Kelola Data Konten
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/motif"
            className="group rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#7A1212] dark:text-[#E8C36A]">
                <Layers className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-[#7A3A3A] group-hover:text-[#96640F] transition-colors dark:text-[#D9C3B5]" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-[#5E0F11] group-hover:text-[#96640F] transition-colors dark:text-[#F6E9DC]">
              Motif Tapis
            </h3>
            <p className="mt-1 text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
              Koleksi motif, filosofi, dan skor skintone.
            </p>
          </Link>

          <Link
            href="/admin/outfit"
            className="group rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#7A1212] dark:text-[#E8C36A]">
                <Shirt className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-[#7A3A3A] group-hover:text-[#96640F] transition-colors dark:text-[#D9C3B5]" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-[#5E0F11] group-hover:text-[#96640F] transition-colors dark:text-[#F6E9DC]">
              Rekomendasi Outfit
            </h3>
            <p className="mt-1 text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
              Paduan busana adat, formal, kasual, dan modern.
            </p>
          </Link>

          <Link
            href="/admin/kuis"
            className="group rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#7A1212] dark:text-[#E8C36A]">
                <HelpCircle className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-[#7A3A3A] group-hover:text-[#96640F] transition-colors dark:text-[#D9C3B5]" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-[#5E0F11] group-hover:text-[#96640F] transition-colors dark:text-[#F6E9DC]">
              Soal Kuis
            </h3>
            <p className="mt-1 text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
              Bank soal kebudayaan dan pilihan jawaban.
            </p>
          </Link>

          <Link
            href="/admin/pengguna"
            className="group rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#7A1212] dark:text-[#E8C36A]">
                <Users className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-[#7A3A3A] group-hover:text-[#96640F] transition-colors dark:text-[#D9C3B5]" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-[#5E0F11] group-hover:text-[#96640F] transition-colors dark:text-[#F6E9DC]">
              Pengguna
            </h3>
            <p className="mt-1 text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
              Hak akses peran akun dan status keaktifan.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-6xl">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      }
    >
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

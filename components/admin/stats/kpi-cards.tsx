import {
  Users,
  Layers,
  Palette,
  HelpCircle,
  Percent,
  Shirt,
  UserPlus,
} from 'lucide-react';
import type { DashboardSummary } from '@/lib/queries/admin-stats';

interface KpiCardsProps {
  summary: DashboardSummary | null;
}

export function KpiCards({ summary }: KpiCardsProps) {
  if (!summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-[#E8D8C8] bg-white p-5 animate-pulse dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Pengguna',
      value: summary.total_pengguna,
      subtext: `+${summary.pengguna_baru_7hari} baru (7 hari)`,
      icon: Users,
      badgeIcon: UserPlus,
    },
    {
      title: 'Scan Motif Tapis',
      value: summary.total_scan_motif,
      subtext: 'Pemindaian motif dari kamera aplikasi',
      icon: Layers,
    },
    {
      title: 'Scan Skintone',
      value: summary.total_scan_skintone,
      subtext: 'Deteksi kecocokan warna kulit',
      icon: Palette,
    },
    {
      title: 'Percobaan Kuis',
      value: summary.total_percobaan_kuis,
      subtext: 'Total sesi kuis kebudayaan dimainkan',
      icon: HelpCircle,
    },
    {
      title: 'Rata-Rata Skor Kuis',
      value: `${summary.rata_rata_skor_kuis}%`,
      subtext: 'Tingkat akurasi pemahaman pengguna',
      icon: Percent,
    },
    {
      title: 'Koleksi Budaya',
      value: `${summary.total_motif} Motif`,
      subtext: `${summary.total_outfit} Rekomendasi Outfit`,
      icon: Shirt,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs transition-all hover:shadow-sm dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5]">
                {card.title}
              </span>
              <div className="size-9 rounded-xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#7A1212] dark:text-[#E8C36A]">
                <Icon className="size-4.5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#5E0F11] dark:text-[#F6E9DC]">
                {card.value}
              </div>
              <div className="mt-1 text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

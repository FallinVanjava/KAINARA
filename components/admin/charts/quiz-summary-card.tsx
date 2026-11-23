import { HelpCircle, Award, Target } from 'lucide-react';
import type { QuizStatsItem } from '@/lib/queries/admin-stats';

interface QuizSummaryCardProps {
  stats: QuizStatsItem | null;
}

export function QuizSummaryCard({ stats }: QuizSummaryCardProps) {
  const totalAttempts = stats?.total_percobaan ?? 0;
  const avgScore = stats?.rata_rata_skor_persen ?? 0;

  return (
    <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 sm:p-6 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-5">
      <div>
        <h3 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Statistik Kuis Periode Ini
        </h3>
        <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-0.5">
          Performa dan keterlibatan pengguna dalam kuis kebudayaan tapis Lampung.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Percobaan */}
        <div className="rounded-xl border border-[#E8D8C8] bg-[#FFF8F0] p-4 dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.12)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5]">
            <HelpCircle className="size-4 text-[#7A1212] dark:text-[#E8C36A]" />
            <span>Total Percobaan</span>
          </div>
          <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-[#5E0F11] dark:text-[#F6E9DC]">
            {totalAttempts}
          </div>
          <div className="mt-1 text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
            Sesi kuis dimainkan
          </div>
        </div>

        {/* Rata-Rata Skor */}
        <div className="rounded-xl border border-[#E8D8C8] bg-[#FFF8F0] p-4 dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.12)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5]">
            <Target className="size-4 text-[#96640F] dark:text-[#E8C36A]" />
            <span>Rata-Rata Skor</span>
          </div>
          <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-[#7A1212] dark:text-[#E8C36A]">
            {avgScore}%
          </div>
          <div className="mt-1 text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
            Akurasi jawaban kuis
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dotted border-[#E8D8C8] p-3 text-xs text-[#7A3A3A] dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5] flex items-center gap-2.5">
        <Award className="size-4 text-[#96640F] shrink-0 dark:text-[#E8C36A]" />
        <span>
          Skor kuis dihitung dari tabel <code>quiz_attempts</code> dalam rentang tanggal yang dipilih.
        </span>
      </div>
    </div>
  );
}

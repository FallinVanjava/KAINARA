'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { getJakartaDate, getJakartaDateDaysAgo } from '@/lib/utils/date';

interface DateRangeFilterProps {
  currentDari?: string;
  currentSampai?: string;
}

export function DateRangeFilter({ currentDari, currentSampai }: DateRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const today = getJakartaDate();
  const defaultDari30 = getJakartaDateDaysAgo(29);

  const activeDari = currentDari || defaultDari30;
  const activeSampai = currentSampai || today;

  // Cek preset yang cocok
  const is7Days =
    activeDari === getJakartaDateDaysAgo(6) && activeSampai === today;
  const is30Days =
    activeDari === defaultDari30 && activeSampai === today;
  const is90Days =
    activeDari === getJakartaDateDaysAgo(89) && activeSampai === today;
  const isCustom = !is7Days && !is30Days && !is90Days;

  const [customDari, setCustomDari] = useState(activeDari);
  const [customSampai, setCustomSampai] = useState(activeSampai);
  const [showCustomInput, setShowCustomInput] = useState(isCustom);

  const applyRange = (dari: string, sampai: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('dari', dari);
    params.set('sampai', sampai);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handlePreset = (days: number) => {
    setShowCustomInput(false);
    const dari = getJakartaDateDaysAgo(days - 1);
    const sampai = today;
    setCustomDari(dari);
    setCustomSampai(sampai);
    applyRange(dari, sampai);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDari && customSampai) {
      applyRange(customDari, customSampai);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-[#E8D8C8] bg-white p-3.5 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
      {/* Tombol Preset Cepat */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5] px-2 flex items-center gap-1.5">
          <Calendar className="size-3.5 text-[#96640F] dark:text-[#E8C36A]" />
          <span>Rentang:</span>
        </span>

        <button
          type="button"
          onClick={() => handlePreset(7)}
          className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
            is7Days && !showCustomInput
              ? 'bg-[#7A1212] text-[#FFF8F0] shadow-2xs dark:bg-[#8F1A1A]'
              : 'border border-[#E8D8C8] bg-white text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]'
          }`}
        >
          7 Hari
        </button>

        <button
          type="button"
          onClick={() => handlePreset(30)}
          className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
            is30Days && !showCustomInput
              ? 'bg-[#7A1212] text-[#FFF8F0] shadow-2xs dark:bg-[#8F1A1A]'
              : 'border border-[#E8D8C8] bg-white text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]'
          }`}
        >
          30 Hari
        </button>

        <button
          type="button"
          onClick={() => handlePreset(90)}
          className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
            is90Days && !showCustomInput
              ? 'bg-[#7A1212] text-[#FFF8F0] shadow-2xs dark:bg-[#8F1A1A]'
              : 'border border-[#E8D8C8] bg-white text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]'
          }`}
        >
          90 Hari
        </button>

        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
            showCustomInput
              ? 'bg-[#96640F] text-white shadow-2xs'
              : 'border border-[#E8D8C8] bg-white text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]'
          }`}
        >
          Kustom
        </button>
      </div>

      {/* Input Tanggal Kustom (Jika dipilih) */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <input
            type="date"
            value={customDari}
            onChange={(e) => setCustomDari(e.target.value)}
            className="h-8 rounded-lg border border-[#E8D8C8] bg-white px-2.5 text-xs text-[#5E0F11] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
          />
          <span className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">sampai</span>
          <input
            type="date"
            value={customSampai}
            onChange={(e) => setCustomSampai(e.target.value)}
            className="h-8 rounded-lg border border-[#E8D8C8] bg-white px-2.5 text-xs text-[#5E0F11] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
          />
          <button
            type="submit"
            className="h-8 rounded-lg bg-[#7A1212] px-3 text-xs font-bold text-white hover:bg-[#5E0F11]"
          >
            Terapkan
          </button>
        </form>
      )}
    </div>
  );
}

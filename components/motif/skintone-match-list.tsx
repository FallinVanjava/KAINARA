import type { SkintoneMatchItem } from '@/lib/queries/motifs';

interface SkintoneMatchListProps {
  matches: SkintoneMatchItem[];
}

const UNDERTONE_LABELS: Record<string, string> = {
  warm: 'Undertone Hangat',
  cool: 'Undertone Sejuk',
  neutral: 'Undertone Netral',
};

export function SkintoneMatchList({ matches }: SkintoneMatchListProps) {
  if (!matches || matches.length === 0) {
    return (
      <p className="text-sm text-[#7A3A3A] dark:text-[#D9C3B5] italic">
        Data kecocokan warna kulit belum tersedia untuk motif ini.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((item, idx) => {
        const skintone = item.skintone;
        if (!skintone) return null;

        const undertoneText = UNDERTONE_LABELS[skintone.undertone] || skintone.undertone;

        return (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E8D8C8] shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
          >
            {/* Swatch Lingkaran Warna */}
            <div
              className="size-11 shrink-0 rounded-full border-2 border-white shadow-xs ring-1 ring-[#E8D8C8] dark:ring-[rgba(246,233,220,0.2)]"
              style={{ backgroundColor: skintone.hex_color }}
              title={`${skintone.nama} (${skintone.hex_color})`}
            />

            {/* Konten Skintone & Skor */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-sans text-sm font-semibold text-[#5E0F11] dark:text-[#F6E9DC] truncate">
                    {skintone.nama}
                  </h4>
                  <span className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                    {undertoneText}
                  </span>
                </div>
                <span className="font-heading text-base font-bold text-[#7A1212] dark:text-[#E8C36A] shrink-0">
                  {item.skor_kecocokan}%
                </span>
              </div>

              {/* Batang Skor Tipis Marun */}
              <div className="h-1.5 w-full rounded-full bg-[#F5E9DC] dark:bg-[#3A1D1E] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7A1212] dark:bg-[#E8C36A] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, item.skor_kecocokan))}%` }}
                />
              </div>

              {item.catatan && (
                <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed pt-0.5">
                  {item.catatan}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

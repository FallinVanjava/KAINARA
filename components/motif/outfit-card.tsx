import Image from 'next/image';
import type { Outfit } from '@/types/database';

interface OutfitCardProps {
  outfit: Outfit;
}

const CATEGORY_LABELS: Record<string, string> = {
  adat: 'Busana Adat',
  formal: 'Busana Formal',
  kasual: 'Busana Kasual',
  modern: 'Gaya Modern',
};

export function OutfitCard({ outfit }: OutfitCardProps) {
  const categoryLabel = (outfit.kategori && CATEGORY_LABELS[outfit.kategori.toLowerCase()]) || outfit.kategori || 'Outfit';

  return (
    <div className="group flex flex-col rounded-[20px] border border-[#E8D8C8] bg-white overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
      {/* Gambar Outfit */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5E9DC] dark:bg-[#3A1D1E]">
        {outfit.gambar_url ? (
          <Image
            src={outfit.gambar_url}
            alt={outfit.nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F5E9DC] to-[#E8D8C8] dark:from-[#3A1D1E] dark:to-[#220E0F]">
            <div className="size-12 rounded-full bg-[#7A1212]/10 dark:bg-[#FFF8F0]/10 flex items-center justify-center mb-3">
              <span className="font-heading text-lg font-bold text-[#7A1212] dark:text-[#E8C36A]">
                {outfit.nama.charAt(0)}
              </span>
            </div>
            <span className="font-heading text-sm font-semibold text-[#5E0F11] dark:text-[#F6E9DC]">
              {outfit.nama}
            </span>
            {outfit.warna_utama && (
              <span className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5] mt-1">
                Warna: {outfit.warna_utama}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-block rounded-full bg-[#7A1212] px-2.5 py-0.5 text-[10px] font-semibold text-[#FFF8F0] capitalize dark:bg-[#8F1A1A]">
            {categoryLabel}
          </span>
          {outfit.warna_utama && (
            <span className="text-[11px] font-medium text-[#7A3A3A] dark:text-[#D9C3B5]">
              {outfit.warna_utama}
            </span>
          )}
        </div>

        <h4 className="font-sans text-base font-semibold text-[#5E0F11] dark:text-[#F6E9DC] line-clamp-1">
          {outfit.nama}
        </h4>

        {outfit.deskripsi && (
          <p className="mt-1.5 text-xs sm:text-sm text-[#7A3A3A] dark:text-[#D9C3B5] line-clamp-2 leading-relaxed">
            {outfit.deskripsi}
          </p>
        )}
      </div>
    </div>
  );
}

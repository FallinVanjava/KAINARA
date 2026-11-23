import Link from 'next/link';
import Image from 'next/image';
import type { HomeMotif } from '@/lib/queries/home';
import type { Motif } from '@/types/database';

interface MotifCardProps {
  motif: HomeMotif | Motif;
  priority?: boolean;
}

export function MotifCard({ motif, priority = false }: MotifCardProps) {
  return (
    <Link
      href={`/motif/${motif.slug}`}
      className="group flex flex-col rounded-3xl border border-[#E8DDD0] bg-[#FEFEFE] overflow-hidden shadow-[0_8px_24px_-12px_rgba(45,24,16,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(45,24,16,0.18)] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
    >
      {/* Gambar Rasio 4:5 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F7EFE5] dark:bg-[#3A1D1E]">
        {motif.gambar_url ? (
          <Image
            src={motif.gambar_url}
            alt={`Kain tapis motif ${motif.nama}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F7EFE5] to-[#E8DDD0] dark:from-[#3A1D1E] dark:to-[#220E0F]">
            <div className="size-12 rounded-full bg-[#6D0F0F]/10 dark:bg-[#FFF8F0]/10 flex items-center justify-center mb-3">
              <span className="font-heading text-lg font-bold text-[#6D0F0F] dark:text-[#E8C36A]">
                {motif.nama.charAt(0)}
              </span>
            </div>
            <span className="font-heading text-sm font-semibold text-[#2D1810] dark:text-[#F6E9DC]">
              Motif {motif.nama}
            </span>
            <span className="text-[11px] text-[#5C534E] dark:text-[#D9C3B5] mt-1">
              {motif.daerah_asal || 'Lampung'}
            </span>
          </div>
        )}
        {motif.daerah_asal && (
          <span className="absolute left-3 top-3 rounded-full border border-[#E8DDD0]/70 bg-[#FCF8F3]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6D0F0F] backdrop-blur-sm">
            {motif.daerah_asal}
          </span>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-sans text-base sm:text-lg font-semibold text-[#2D1810] transition-colors group-hover:text-[#6D0F0F] dark:text-[#F6E9DC] dark:group-hover:text-[#E3B958] line-clamp-1">
            {motif.nama}
          </h3>
          {motif.daerah_asal && (
            <span className="text-[11px] text-[#5C534E] dark:text-[#D9C3B5] shrink-0">
              {motif.daerah_asal}
            </span>
          )}
        </div>

        <p className="mt-1.5 text-xs sm:text-sm text-[#5C534E] dark:text-[#D9C3B5] line-clamp-2 leading-relaxed">
          {motif.deskripsi || 'Ragam motif sulaman benang emas khas kebudayaan tapis Lampung.'}
        </p>

        {/* Chip Warna Dominan */}
        {motif.warna_dominan && motif.warna_dominan.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-dotted border-[#E8DDD0] dark:border-[rgba(246,233,220,0.12)]">
            {motif.warna_dominan.slice(0, 3).map((warna, idx) => (
              <span
                key={idx}
                className="inline-block rounded-full bg-[#F7EFE5] px-2 py-0.5 text-[10px] font-medium text-[#6D0F0F] capitalize dark:bg-[#3A1D1E] dark:text-[#E8C36A]"
              >
                {warna}
              </span>
            ))}
          </div>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D0F0F] transition-colors group-hover:text-[#540B0B]">
          Lihat Filosofi
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

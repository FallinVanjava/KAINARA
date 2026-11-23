import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MotifCard } from '@/components/motif/motif-card';
import { MotifFilter } from '@/components/motif/motif-filter';
import { getMotifs, getDistinctRegions } from '@/lib/queries/motifs';

export const metadata: Metadata = {
  title: 'Katalog Motif Tapis Lampung | Kainara',
  description:
    'Eksplorasi ragam motif sulaman benang emas khas Lampung lengkap dengan makna filosofi, sejarah, dan keselarasan busana.',
  openGraph: {
    title: 'Katalog Motif Tapis Lampung | Kainara',
    description:
      'Eksplorasi ragam motif sulaman benang emas khas Lampung lengkap dengan makna filosofi, sejarah, dan keselarasan busana.',
  },
};

interface MotifPageProps {
  searchParams: Promise<{
    q?: string;
    warna?: string;
    daerah?: string;
    page?: string;
  }>;
}

export default async function MotifPage({ searchParams }: MotifPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const daerah = resolvedParams.daerah || 'semua';
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10) || 1);

  const [motifsResult, availableRegions] = await Promise.all([
    getMotifs({ q, daerah, page, limit: 12 }),
    getDistinctRegions(),
  ]);

  const { items: motifs, total, totalPages } = motifsResult;

  const buildPaginationLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (daerah && daerah !== 'semua') params.set('daerah', daerah);
    if (targetPage > 1) params.set('page', targetPage.toString());
    const qs = params.toString();
    return `/motif${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 sm:px-8">
      {/* Header Halaman */}
      <div className="max-w-2xl mb-8 sm:mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
          Koleksi Budaya Tapis
        </span>
        <h1 className="mt-1 font-heading text-3xl sm:text-4xl font-bold text-[#2D1810] dark:text-[#F6E9DC]">
          Katalog Motif Tapis Lampung
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#5C534E] dark:text-[#D9C3B5] leading-relaxed">
          Eksplorasi ragam motif sulaman benang emas khas Lampung lengkap dengan makna filosofi, sejarah, dan keselarasan busana.
        </p>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <Suspense fallback={<div className="h-20 animate-pulse bg-muted rounded-2xl mb-8" />}>
        <MotifFilter
          availableRegions={availableRegions}
          currentQuery={q}
          currentRegion={daerah}
        />
      </Suspense>

      {/* Info Jumlah Hasil */}
      <div className="flex items-center justify-between text-xs text-[#5C534E] dark:text-[#D9C3B5] mb-6 pb-3 border-b border-dotted border-[#E8DDD0] dark:border-[rgba(246,233,220,0.16)]">
        <span>
          Menampilkan <strong className="text-[#2D1810] dark:text-[#F6E9DC]">{motifs.length}</strong> dari{' '}
          <strong className="text-[#2D1810] dark:text-[#F6E9DC]">{total}</strong> motif
          {daerah !== 'semua' && ` dari daerah ${daerah}`}
          {q && ` untuk kata kunci "${q}"`}
        </span>
        {totalPages > 1 && (
          <span>
            Halaman {page} dari {totalPages}
          </span>
        )}
      </div>

      {/* Grid Motif atau Keadaan Kosong */}
      {motifs.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {motifs.map((motif, idx) => (
              <MotifCard key={motif.id} motif={motif} priority={idx < 4} />
            ))}
          </div>

          {/* Navigasi Paginasi */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={buildPaginationLink(page - 1)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-white px-4 text-xs font-semibold text-[#2D1810] transition-colors hover:bg-[#F7EFE5] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
                >
                  <ArrowLeft className="size-3.5" /> Sebelumnya
                </Link>
              ) : (
                <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E8DDD0]/50 bg-white/50 px-4 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed dark:bg-[#2A1415]/50">
                  <ArrowLeft className="size-3.5" /> Sebelumnya
                </span>
              )}

              <span className="text-xs font-medium text-[#5C534E] dark:text-[#D9C3B5] px-2">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={buildPaginationLink(page + 1)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-white px-4 text-xs font-semibold text-[#2D1810] transition-colors hover:bg-[#F7EFE5] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
                >
                  Berikutnya <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E8DDD0]/50 bg-white/50 px-4 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed dark:bg-[#2A1415]/50">
                  Berikutnya <ArrowRight className="size-3.5" />
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dotted border-[#E8DDD0] bg-white p-12 text-center dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <div className="size-12 rounded-full bg-[#F7EFE5] text-[#6D0F0F] mx-auto flex items-center justify-center font-heading text-xl mb-4 dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
            ?
          </div>
          <h3 className="font-sans text-base sm:text-lg font-semibold text-[#2D1810] dark:text-[#F6E9DC]">
            Belum ada motif yang cocok. Coba kata kunci lain.
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5C534E] dark:text-[#D9C3B5] max-w-md mx-auto">
            Periksa ejaan nama motif atau pilih chip warna &quot;Semua&quot; untuk melihat seluruh ragam tapis yang tersedia.
          </p>
          <div className="mt-6">
            <Link
              href="/motif"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#6D0F0F] px-5 text-xs font-semibold text-[#FFF8F0] transition-colors hover:bg-[#2D1810]"
            >
              Reset Filter & Pencarian
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

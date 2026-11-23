import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Download, Sparkles } from 'lucide-react';
import { getMotifBySlug } from '@/lib/queries/motifs';
import { SkintoneMatchList } from '@/components/motif/skintone-match-list';
import { OutfitCard } from '@/components/motif/outfit-card';
import { MotifGallery } from '@/components/motif/motif-gallery';

interface MotifDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MotifDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMotifBySlug(slug);

  if (!data) {
    return {
      title: 'Motif Tidak Ditemukan | Kainara',
    };
  }

  const { motif } = data;
  const title = `Motif ${motif.nama}: Tapis Lampung | Kainara`;
  const description =
    motif.deskripsi ||
    `Pelajari filosofi, makna adat, sejarah, dan keserasian motif tapis ${motif.nama} khas Lampung.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: motif.gambar_url ? [{ url: motif.gambar_url }] : undefined,
    },
  };
}

export default async function MotifDetailPage({ params }: MotifDetailPageProps) {
  const { slug } = await params;
  const data = await getMotifBySlug(slug);

  if (!data) {
    notFound();
  }

  const { motif, skintoneMatches, relatedOutfits } = data;
  const appDownloadUrl = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12 sm:px-8 space-y-10 sm:space-y-12">
      {/* 1. Breadcrumb: Motif › [Nama Motif] */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#5C534E] dark:text-[#D9C3B5]">
        <Link
          href="/motif"
          className="inline-flex items-center gap-1 hover:text-[#2D1810] dark:hover:text-[#F6E9DC] transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Katalog Motif
        </Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span className="font-medium text-[#2D1810] dark:text-[#F6E9DC] truncate">
          {motif.nama}
        </span>
      </nav>

      {/* 2. Header / Ringkasan Motif (Gambar Besar + Info Utama) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Gambar Besar Rasio 4:5 */}
        <div className="md:col-span-5">
          {motif.gambar_url ? (
            <MotifGallery src={motif.gambar_url} nama={motif.nama} />
          ) : (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#E8DDD0] bg-[#F7EFE5] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)]">
              <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <div className="size-20 rounded-full bg-[#6D0F0F]/10 dark:bg-[#FFF8F0]/10 flex items-center justify-center mb-4">
                  <span className="font-heading text-3xl font-bold text-[#6D0F0F] dark:text-[#E8C36A]">
                    {motif.nama.charAt(0)}
                  </span>
                </div>
                <span className="font-heading text-xl font-bold text-[#2D1810] dark:text-[#F6E9DC]">
                  Motif {motif.nama}
                </span>
                <span className="text-xs text-[#5C534E] dark:text-[#D9C3B5] mt-1">
                  {motif.daerah_asal || 'Lampung'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Informasi Motif */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
              Ragam Hias Tapis Tradisional
            </span>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl font-bold text-[#2D1810] dark:text-[#F6E9DC]">
              {motif.nama}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="inline-flex items-center rounded-full bg-[#FFF8F0] px-3 py-1 text-xs font-medium text-[#6D0F0F] border border-[#E8DDD0] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#E8C36A]">
              Asal: {motif.daerah_asal || 'Lampung'}
            </span>

            {motif.warna_dominan && motif.warna_dominan.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#5C534E] dark:text-[#D9C3B5]">Warna:</span>
                {motif.warna_dominan.map((warna, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-[#6D0F0F] px-2.5 py-0.5 text-[11px] font-medium text-[#FFF8F0] capitalize dark:bg-[#8F1A1A]"
                  >
                    {warna}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base text-[#5C534E] dark:text-[#D9C3B5] leading-relaxed pt-2">
            {motif.deskripsi ||
              'Motif sulaman tradisional khas Lampung yang memadukan keanggunan benang emas di atas kain dasar tenun lokal.'}
          </p>
        </div>
      </section>

      {/* Garis Pemisah Titik-titik */}
      <hr className="border-t-2 border-dotted border-[#E8DDD0] dark:border-[rgba(246,233,220,0.16)]" />

      {/* 3. Makna Filosofi dan Sejarah */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8DDD0] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] shadow-xs">
          <div className="flex items-center gap-2 text-[#96640F] dark:text-[#E8C36A]">
            <Sparkles className="size-4" />
            <h2 className="font-heading text-lg font-bold text-[#2D1810] dark:text-[#F6E9DC]">
              Makna dan Filosofi
            </h2>
          </div>
          <p className="text-sm text-[#5C534E] dark:text-[#D9C3B5] leading-relaxed">
            {motif.makna_filosofi ||
              'Motif ini memiliki nilai luhur yang mencerminkan kearifan lokal, kehormatan keluarga, dan keselarasan hidup masyarakat adat Lampung.'}
          </p>
        </div>

        <div className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8DDD0] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] shadow-xs">
          <h2 className="font-heading text-lg font-bold text-[#2D1810] dark:text-[#F6E9DC]">
            Sejarah dan Asal-Usul
          </h2>
          <p className="text-sm text-[#5C534E] dark:text-[#D9C3B5] leading-relaxed">
            {motif.sejarah ||
              'Diturunkan secara turun-temurun oleh para perajin tapis Lampung sejak berabad-abad lampau sebagai simbol status dan busana upacara sakral.'}
          </p>
        </div>
      </section>

      {/* Garis Pemisah Titik-titik */}
      <hr className="border-t-2 border-dotted border-[#E8DDD0] dark:border-[rgba(246,233,220,0.16)]" />

      {/* 4. Cocok untuk Skintone */}
      <section className="space-y-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
            Analisis Warna Kulit
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-[#2D1810] dark:text-[#F6E9DC]">
            Cocok untuk Skintone
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5C534E] dark:text-[#D9C3B5]">
            Kesesuaian palet motif {motif.nama} dengan spektrum warna kulit, diurutkan dari skor kecocokan tertinggi.
          </p>
        </div>

        <SkintoneMatchList matches={skintoneMatches} />
      </section>

      {/* Garis Pemisah Titik-titik */}
      <hr className="border-t-2 border-dotted border-[#E8DDD0] dark:border-[rgba(246,233,220,0.16)]" />

      {/* 5. Outfit Terkait */}
      <section className="space-y-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
            Inspirasi Busana
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-[#2D1810] dark:text-[#F6E9DC]">
            Rekomendasi Outfit Terkait
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5C534E] dark:text-[#D9C3B5]">
            Paduan busana adat dan modern yang dirancang serasi dengan kain tapis bermotif {motif.nama}.
          </p>
        </div>

        {relatedOutfits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedOutfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dotted border-[#E8DDD0] p-8 text-center text-xs text-[#5C534E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#D9C3B5]">
            Belum ada rekomendasi outfit khusus yang dikaitkan dengan motif ini.
          </div>
        )}
      </section>

      {/* 6. CTA Unduh Aplikasi Kainara */}
      <section className="rounded-2xl bg-[#6D0F0F] text-[#FFF8F0] p-8 sm:p-10 shadow-lg text-center space-y-4">
        <span className="inline-block rounded-full bg-[#2D1810] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8C36A]">
          Eksplorasi Langsung
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFF8F0]">
          Coba Scan di Aplikasi Kainara
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#F7EFE5] leading-relaxed">
          Arahkan kamera ponselmu ke kain tapis asli untuk mendeteksi motif {motif.nama} secara instan dan periksa keserasiannya dengan rona kulitmu.
        </p>
        <div className="pt-2">
          {appDownloadUrl ? (
            <a
              href={appDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#FFF8F0] px-7 text-xs sm:text-sm font-bold text-[#6D0F0F] transition-colors hover:bg-[#F7EFE5]"
            >
              <Download className="size-4" /> Unduh Aplikasi Kainara
            </a>
          ) : (
            <span className="inline-block rounded-full bg-[#2D1810] px-5 py-2 text-xs font-semibold text-[#E8C36A]">
              Fitur Scanner Segera Hadir di Aplikasi Mobile Kainara
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

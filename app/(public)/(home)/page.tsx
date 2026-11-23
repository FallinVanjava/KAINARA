import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ScanLine, Palette, Shirt, ArrowRight, Download, Sparkles } from 'lucide-react';
import KainaraHero from '@/components/kainara-hero';
import { MotifCard } from '@/components/motif/motif-card';
import { SiteFooter } from '@/components/site/site-footer';
import { MotionProvider } from '@/components/site/motion-provider';
import { getHomeData } from '@/lib/queries/home';

export const metadata: Metadata = {
  title: 'Kainara: Pindai Tapis Lampung, Skintone & Rekomendasi Outfit',
  description:
    'Aplikasi dan ensiklopedia interaktif kain tapis Lampung. Pindai motif dengan kamera, temukan kecocokan warna dengan rona kulitmu, dan dapatkan inspirasi outfit serasi.',
  openGraph: {
    title: 'Kainara: Pindai Tapis Lampung, Skintone & Rekomendasi Outfit',
    description:
      'Aplikasi dan ensiklopedia interaktif kain tapis Lampung. Pindai motif, temukan kecocokan skintone, dan inspirasi outfit.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Kainara',
  },
};

async function HomeContent() {
  const { stats, featuredMotifs } = await getHomeData();
  const appDownloadUrl = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL;

  return (
    <>
      <MotionProvider />
      {/* 1. Hero Beranda */}
      <KainaraHero
        totalMotif={stats.totalMotif}
        totalOutfit={stats.totalOutfit}
        totalSkintone={stats.totalSkintone}
      />

      {/* 2. Bagian Fitur Utama (Tiga kolom bergaris titik-titik vertikal) */}
      <section data-reveal className="border-t border-b border-dotted border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
              Fitur Aplikasi Kainara
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Tiga Langkah Menemukan Gaya Tapis Kamu
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Fitur 1: Scan Motif */}
            <div className="flex flex-col items-start p-6 sm:p-8">
              <div className="size-12 rounded-2xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#96640F] dark:text-[#E8C36A] mb-5 shadow-xs">
                <ScanLine className="size-6 stroke-[1.75]" />
              </div>
              <h3 className="font-sans text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Scan Motif Tapis
              </h3>
              <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
                Arahkan kamera ke kain tapis untuk mengenali nama ragam hias, asal daerah, dan filosofi maknanya seketika.
              </p>
            </div>

            {/* Fitur 2: Scan Skintone */}
            <div className="flex flex-col items-start p-6 sm:p-8 md:border-l md:border-dotted md:border-[#E8D8C8] dark:md:border-[rgba(246,233,220,0.16)]">
              <div className="size-12 rounded-2xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#96640F] dark:text-[#E8C36A] mb-5 shadow-xs">
                <Palette className="size-6 stroke-[1.75]" />
              </div>
              <h3 className="font-sans text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Scan Skintone
              </h3>
              <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
                Pindai rona kulit wajah atau lengan untuk memetakan kategori skintone dan undertone kamu secara akurat.
              </p>
            </div>

            {/* Fitur 3: Rekomendasi Outfit */}
            <div className="flex flex-col items-start p-6 sm:p-8 md:border-l md:border-dotted md:border-[#E8D8C8] dark:md:border-[rgba(246,233,220,0.16)]">
              <div className="size-12 rounded-2xl bg-[#FFF8F0] dark:bg-[#3A1D1E] flex items-center justify-center text-[#96640F] dark:text-[#E8C36A] mb-5 shadow-xs">
                <Shirt className="size-6 stroke-[1.75]" />
              </div>
              <h3 className="font-sans text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Rekomendasi Outfit
              </h3>
              <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
                Dapatkan inspirasi padu padan busana tapis yang selaras dengan warna kulit untuk acara formal maupun kasual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bagian Cara Kerja */}
      <section data-reveal className="bg-[#FFF8F0] dark:bg-[#1B0E0E] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
              Panduan Praktis
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Cara Kerja Aplikasi Kainara
            </h2>
            <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
              Tiga langkah mudah untuk mengetahui keselarasan kain tapis dengan gayamu.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Langkah 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-[#2A1415] border border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
              <div className="size-12 rounded-full border border-[#E8D8C8] bg-[#FFF8F0] text-[#96640F] flex items-center justify-center font-heading text-lg font-bold mb-4 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
                1
              </div>
              <h3 className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Pindai Kain Tapis
              </h3>
              <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
                Buka kamera aplikasi dan sorot motif kain tapis yang kamu temui untuk mendeteksi ragam hiasnya.
              </p>
            </div>

            {/* Langkah 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-[#2A1415] border border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
              <div className="size-12 rounded-full border border-[#E8D8C8] bg-[#FFF8F0] text-[#96640F] flex items-center justify-center font-heading text-lg font-bold mb-4 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
                2
              </div>
              <h3 className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Pindai Warna Kulitmu
              </h3>
              <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
                Lakukan pemindaian skintone mandiri untuk mengenali spektrum warna hangat atau sejuk pada kulitmu.
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-[#2A1415] border border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
              <div className="size-12 rounded-full border border-[#E8D8C8] bg-[#FFF8F0] text-[#96640F] flex items-center justify-center font-heading text-lg font-bold mb-4 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
                3
              </div>
              <h3 className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Lihat Outfit yang Serasi
              </h3>
              <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
                Aplikasi langsung memberikan skor kecocokan warna dan rekomendasi busana yang paling pas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bagian Cuplikan Motif (4 Kartu) */}
      <section data-reveal className="bg-white dark:bg-[#2A1415] py-16 sm:py-24 border-t border-dotted border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
                Warisan Budaya Nusantara
              </span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Ragam Motif Tapis Lampung
              </h2>
              <p className="mt-1 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
                Koleksi motif tradisional yang sarat makna filosofis dan sejarah budaya Lampung.
              </p>
            </div>
            <Link
              href="/motif"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A1212] hover:text-[#96640F] transition-colors dark:text-[#E8C36A] dark:hover:text-[#FFF8F0] shrink-0"
            >
              Lihat semua motif <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMotifs.map((motif, idx) => (
              <MotifCard key={motif.id} motif={motif} priority={idx === 0} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/motif"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#7A1212] px-6 text-sm font-semibold text-[#FFF8F0] transition-colors hover:bg-[#5E0F11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F] focus-visible:ring-offset-2"
            >
              Lihat semua motif
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Ajakan kuis, aksen marun dibatasi pada tombol */}
      <section data-reveal className="border-y border-dotted border-[#E8D8C8] bg-[#F5E9DC] py-16 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#1B0E0E] sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-[24px] border border-[#E8D8C8] bg-white p-7 sm:p-10 md:flex-row md:items-center dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415]">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#96640F] dark:text-[#E8C36A]">
                <Sparkles className="size-4" /> Uji Pengetahuan Budaya
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[#5E0F11] dark:text-[#F6E9DC] sm:text-4xl">
                Seberapa Kenal Kamu dengan Tapis Lampung?
              </h2>
              <p className="text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5] sm:text-base">
                Jawab 10 pertanyaan seputar sejarah, makna simbolis, dan teknik tenun tapis Lampung. Dapatkan skor dan tingkat kecakapan budaya kamu.
              </p>
            </div>
            <Link
              href="/kuis"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#7A1212] px-8 text-sm font-bold text-[#FFF8F0] transition-colors hover:bg-[#5E0F11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F] focus-visible:ring-offset-2 dark:focus-visible:ring-[#E8C36A]"
            >
              Mulai Kuis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Bagian Unduh Aplikasi */}
      <section data-reveal className="bg-white dark:bg-[#2A1415] py-16 sm:py-20 border-t border-dotted border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
            Aplikasi Seluler Kainara
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            Kainara Hadir di Genggamanmu
          </h2>
          <p className="text-sm sm:text-base text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
            Nikmati fitur pemindai kamera real-time dan katalog interaktif di mana pun kamu berada melalui aplikasi mobile Kainara.
          </p>
          <div className="pt-3">
            {appDownloadUrl ? (
              <a
                href={appDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7A1212] px-7 text-sm font-semibold text-[#FFF8F0] transition-colors hover:bg-[#5E0F11] focus-visible:ring-2 focus-visible:ring-[#96640F]"
              >
                <Download className="size-4" /> Unduh Aplikasi Sekarang
              </a>
            ) : (
              <span className="inline-block rounded-full bg-[#F5E9DC] px-5 py-2 text-xs font-semibold text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
                Segera Hadir di Google Play Store & App Store
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer Beranda */}
      <SiteFooter />
    </>
  );
}

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#FFF8F0] dark:bg-[#1B0E0E]">
      <Suspense fallback={<KainaraHero />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

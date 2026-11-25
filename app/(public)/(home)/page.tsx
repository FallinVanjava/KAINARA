import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <KainaraHero
        totalMotif={stats.totalMotif}
        totalOutfit={stats.totalOutfit}
        totalSkintone={stats.totalSkintone}
      />

      <section data-reveal aria-labelledby="promo-aplikasi" className="bg-[#FFF8F0] py-16 dark:bg-[#1B0E0E] sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 id="promo-aplikasi" className="sr-only">Aplikasi Kainara</h2>
          <div className="mx-auto max-w-5xl">
            <Image
              src="/images/mockup-mobile.png"
              alt="Tampilan aplikasi Kainara: rekomendasi motif tapis, pemindai skintone, dan rekomendasi outfit."
              width={2830}
              height={1390}
              sizes="(max-width: 1152px) 100vw, 1024px"
              className="h-auto w-full"
            />
          </div>
          <div className="mt-8 text-center">
            {appDownloadUrl ? (
              <a href={appDownloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#7A1212] px-8 text-sm font-semibold text-[#FFF8F0] hover:bg-[#5E0F11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F] focus-visible:ring-offset-2">
                <Download className="size-4" /> Unduh Aplikasi Sekarang
              </a>
            ) : (
              <span className="inline-block rounded-full bg-[#F5E9DC] px-5 py-2 text-xs font-semibold text-[#7A1212]">Segera hadir di Google Play Store &amp; App Store</span>
            )}
          </div>
        </div>
      </section>

      <section data-reveal className="border-y border-dotted border-[#E8D8C8] bg-white dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">Fitur Aplikasi Kainara</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC] sm:text-3xl">Tiga Langkah Menemukan Gaya Tapis Kamu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-start p-6 sm:p-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#FFF8F0] text-[#96640F] shadow-xs dark:bg-[#3A1D1E] dark:text-[#E8C36A]"><ScanLine className="size-6 stroke-[1.75]" /></div>
              <h3 className="font-sans text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">Scan Motif Tapis</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5]">Arahkan kamera ke kain tapis untuk mengenali nama ragam hias, asal daerah, dan filosofi maknanya.</p>
            </div>
            <div className="flex flex-col items-start p-6 sm:p-8 md:border-l md:border-dotted md:border-[#E8D8C8] dark:md:border-[rgba(246,233,220,0.16)]">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#FFF8F0] text-[#96640F] shadow-xs dark:bg-[#3A1D1E] dark:text-[#E8C36A]"><Palette className="size-6 stroke-[1.75]" /></div>
              <h3 className="font-sans text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">Scan Skintone</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5]">Pindai rona kulit untuk memetakan kategori skintone dan undertone kamu.</p>
            </div>
            <div className="flex flex-col items-start p-6 sm:p-8 md:border-l md:border-dotted md:border-[#E8D8C8] dark:md:border-[rgba(246,233,220,0.16)]">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#FFF8F0] text-[#96640F] shadow-xs dark:bg-[#3A1D1E] dark:text-[#E8C36A]"><Shirt className="size-6 stroke-[1.75]" /></div>
              <h3 className="font-sans text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">Rekomendasi Outfit</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5]">Temukan inspirasi padu padan busana tapis yang selaras dengan warna kulitmu.</p>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="bg-[#FFF8F0] py-16 dark:bg-[#1B0E0E] sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">Panduan Praktis</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC] sm:text-3xl">Cara Kerja Aplikasi Kainara</h2>
            <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">Tiga langkah mudah untuk menemukan tapis yang selaras dengan gayamu.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {[
              ['1', 'Pindai Kain Tapis', 'Sorot motif kain tapis dengan kamera aplikasi untuk mengenali ragam hiasnya.'],
              ['2', 'Pindai Warna Kulitmu', 'Kenali spektrum warna dan undertone kulitmu lewat pemindaian skintone.'],
              ['3', 'Lihat Outfit yang Serasi', 'Dapatkan inspirasi busana yang cocok dengan tapis dan warna kulitmu.'],
            ].map(([number, title, description]) => (
              <div key={number} className="flex flex-col items-center rounded-2xl border border-[#E8D8C8] bg-white p-6 text-center dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415]">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-[#E8D8C8] bg-[#FFF8F0] font-heading text-lg font-bold text-[#96640F] dark:border-[rgba(246,233,220,0.16)] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">{number}</div>
                <h3 className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="border-t border-dotted border-[#E8D8C8] bg-white py-16 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415] sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">Contoh Motif</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC] sm:text-3xl">Sekilas Ragam Tapis Lampung</h2>
            <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">Beberapa contoh motif yang bisa kamu kenali lewat aplikasi.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMotifs.map((motif, idx) => <MotifCard key={motif.id} motif={motif} priority={idx === 0} />)}
          </div>
          <div className="mt-10 text-center">
            <Link href="/motif" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A1212] transition-colors hover:text-[#96640F] dark:text-[#E8C36A] dark:hover:text-[#FFF8F0]">Lihat katalog motif <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section data-reveal className="border-y border-dotted border-[#E8D8C8] bg-[#F5E9DC] py-16 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#1B0E0E] sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-[24px] border border-[#E8D8C8] bg-white p-7 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415] sm:p-10 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#96640F] dark:text-[#E8C36A]"><Sparkles className="size-4" /> Uji Pengetahuan Budaya</span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[#5E0F11] dark:text-[#F6E9DC] sm:text-4xl">Seberapa Kenal Kamu dengan Tapis Lampung?</h2>
              <p className="text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5] sm:text-base">Jawab pertanyaan seputar sejarah, makna simbolis, dan teknik tenun tapis Lampung.</p>
            </div>
            <Link href="/kuis" className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#7A1212] px-8 text-sm font-bold text-[#FFF8F0] transition-colors hover:bg-[#5E0F11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F] focus-visible:ring-offset-2">Mulai Kuis Sekarang</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#FFF8F0] dark:bg-[#1B0E0E]">
      <Suspense fallback={<KainaraHero />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

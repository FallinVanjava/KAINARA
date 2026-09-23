import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OutfitCarousel } from "@/features/home/components/OutfitCarousel";
import { OUTFIT_DATA, MOTIF_DATA } from "@/lib/constants/mockData";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Beranda | KAINARA Digital Fashion Editorial",
  description:
    "Eksplorasi keagungan Batik & Tapis Lampung melalui kurasi editorial modern, AI Scanner motif, dan rekomendasi skin tone.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full overflow-hidden">
        {/* ── HERO SECTION (Editorial Fashion Aesthetic) ──────────────── */}
        <section
          className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center"
          aria-label="Hero KAINARA"
        >
          {/* Subtle Ambient Warm Glow */}
          <div
            aria-hidden="true"
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 sm:size-[520px] rounded-full bg-emas/10 blur-[100px] pointer-events-none"
          />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-sogan-900 tracking-tight leading-[1.12] mb-6">
              Menyelami <span className="italic font-normal text-sogan-700">Keanggunan Wastra</span>, Merawat Jiwa Nusantara.
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sogan-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
              Platform modern yang mempertemukan keagungan filosofi Batik Lampung
              dengan teknologi kecerdasan buatan untuk generasi masa kini.
            </p>

            {/* Pill CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center w-full max-w-md">
              <Link
                href="/scanner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-emas text-sogan-900 text-sm sm:text-base font-bold tracking-wide hover:bg-emas-400 transition-all duration-200 shadow-[var(--shadow-gold)] active:scale-98"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
                Scan Wastra Sekarang
              </Link>
              <Link
                href="/education"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-sogan-400/80 text-sogan-800 text-sm sm:text-base font-semibold hover:bg-sogan-100/70 transition-all duration-200"
              >
                Eksplorasi Motif
              </Link>
            </div>
          </div>
        </section>

        {/* ── BENTO GRID SECTION (design.md 5.1) ─────────────────────── */}
        <section
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
          aria-label="Fitur Utama KAINARA"
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emas-600 block mb-1">
              Arsitektur Pengalaman
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-sogan-900 font-bold">
              Fitur Eksklusif KAINARA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Box 1: Large Showcase Box (Span 2) */}
            <div className="md:col-span-2 bg-sogan-900 text-ivory rounded-3xl p-7 sm:p-10 shadow-[var(--shadow-ethereal)] border border-sogan-700/60 relative overflow-hidden flex flex-col justify-between group">
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-80 h-80 bg-emas/15 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emas/20 text-emas-300 text-xs font-bold tracking-wider uppercase border border-emas/40">
                    Fitur Utama
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-bold mb-3 text-ivory leading-snug">
                  AI Scanner Motif Wastra
                </h3>
                <p className="text-sogan-200 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
                  Pindai foto kain atau pakaian Anda. Algoritma visi komputer kami
                  menganalisis struktur geometris dan benang emas untuk mengidentifikasi
                  nama motif, asal daerah, serta filosofi sakralnya secara instan.
                </p>
              </div>

              {/* Interactive Visual Teaser */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-sogan-700/60">
                <div className="flex items-center gap-3 text-xs text-sogan-300">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>Model ResNet50 terlatih dengan akurasi tinggi</span>
                </div>
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emas text-sogan-900 text-xs sm:text-sm font-bold hover:bg-emas-400 transition-colors shadow-[0_2px_14px_rgba(212,175,55,0.3)]"
                >
                  Coba Scanner
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Bento Box 2: Small Box 1 (Skin Tone Analysis) */}
            <Link
              href="/skintone"
              className="group bg-white rounded-3xl p-7 sm:p-8 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="size-12 rounded-full bg-emas/15 flex items-center justify-center text-emas-600 mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm3.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-sogan-900 mb-2 group-hover:text-emas-600 transition-colors">
                  Skin Tone Analysis
                </h3>
                <p className="text-sogan-500 text-xs sm:text-sm leading-relaxed mb-6">
                  Ekstraksi rona warna kulit untuk rekomendasi palet warna busana batik yang paling harmonis.
                </p>
              </div>

              <span className="text-xs font-bold text-sogan-800 group-hover:text-emas-600 inline-flex items-center gap-1.5 pt-4 border-t border-sogan-100">
                Analisis Warna Kulit
              </span>
            </Link>

            {/* Bento Box 3: Small Box 2 (Edukasi Budaya & Filosofi) */}
            <Link
              href="/education"
              className="group bg-white rounded-3xl p-7 sm:p-8 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="size-12 rounded-full bg-batik-indigo/10 flex items-center justify-center text-batik-indigo mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-sogan-900 mb-2 group-hover:text-emas-600 transition-colors">
                  Katalog Filosofi
                </h3>
                <p className="text-sogan-500 text-xs sm:text-sm leading-relaxed mb-6">
                  Jelajahi ensiklopedia motif tradisional Lampung, makna simbolis, dan cerita leluhur.
                </p>
              </div>

              <span className="text-xs font-bold text-sogan-800 group-hover:text-emas-600 inline-flex items-center gap-1.5 pt-4 border-t border-sogan-100">
                Buka Katalog
              </span>
            </Link>

            {/* Bento Box 4: Lookbook Preview Box (Span 2) */}
            <div className="md:col-span-2 bg-sogan-100/70 rounded-3xl p-7 sm:p-8 border border-sogan-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emas-600 block mb-1">
                  Inspirasi Gaya
                </span>
                <h3 className="font-serif text-2xl font-bold text-sogan-900 mb-2">
                  Koleksi Busana Modern Berbalut Wastra
                </h3>
                <p className="text-sogan-600 text-xs sm:text-sm leading-relaxed">
                  Temukan inspirasi padu padan tenun tradisional untuk acara formal, kasual, hingga busana adat kontemporer.
                </p>
              </div>
              <Link
                href="/education"
                className="flex-shrink-0 px-6 py-3 rounded-full bg-sogan-800 text-ivory text-xs sm:text-sm font-semibold hover:bg-sogan-900 transition-colors shadow-xs"
              >
                Lihat Semua Koleksi
              </Link>
            </div>
          </div>
        </section>

        {/* ── CURATED MOTIFS HIGHLIGHTS ───────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emas-600 block mb-1">
                Kurasi Editorial
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-sogan-900">
                Motif Ikonik Lampung
              </h2>
              <p className="text-sogan-500 text-sm mt-1 max-w-lg">
                Koleksi mahakarya wastra Lampung dengan nilai filosofis dan keanggunan budaya luhur.
              </p>
            </div>
            <Link
              href="/education"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sogan-800 hover:text-emas-600 transition-colors self-start sm:self-auto"
            >
              Lihat Semua Motif
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOTIF_DATA.filter((m) =>
              ["motif_siger", "motif_gajah", "motif_kapal"].includes(m.id)
            ).map((motif) => (
              <Link
                key={motif.id}
                href={`/education/${motif.slug}`}
                className="group bg-white rounded-3xl p-4 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 transition-all duration-300 flex flex-col hover:-translate-y-1.5"
              >
                <div className="relative h-60 w-full rounded-[24px] overflow-hidden bg-sogan-100 mb-4">
                  <Image
                    src={motif.imageUrl}
                    alt={`Motif batik ${motif.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sogan-900/60 to-transparent" />
                  <span className="absolute bottom-3 left-3">
                    <Badge variant="gold">{motif.category}</Badge>
                  </span>
                </div>

                <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sogan-900 text-lg mb-2 group-hover:text-emas-600 transition-colors">
                      {motif.name}
                    </h3>
                    <p className="text-sogan-500 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                      {motif.philosophy}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sogan-100">
                    <span className="text-xs text-sogan-400 font-medium">Asal: {motif.origin}</span>
                    <div className="flex -space-x-1.5" aria-label="Palet warna motif">
                      {motif.colors.slice(0, 4).map((c, i) => (
                        <span
                          key={c + i}
                          className="size-5 rounded-full border-2 border-white ring-1 ring-black/5"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── LOOKBOOK CAROUSEL (design.md 5.4) ───────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
          <OutfitCarousel outfits={OUTFIT_DATA} />
        </section>

        {/* ── EDITORIAL CULTURAL BANNER ─────────────────────────────── */}
        <section className="bg-sogan-900 text-ivory relative overflow-hidden py-16 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 size-80 rounded-full bg-emas/10 blur-3xl pointer-events-none"
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-snug text-ivory mb-4">
              Setiap helai benang emas Tapis menyimpan filosofi kehormatan dan kearifan masyarakat Lampung.
            </h2>
            <p className="text-emas-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mt-4">
              Warisan Budaya Nusantara
            </p>
            <div className="batik-divider max-w-xs mx-auto mt-8 opacity-30" aria-hidden="true" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

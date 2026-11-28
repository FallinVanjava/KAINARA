import Image from "next/image"
import Link from "next/link"
import {
  Camera,
  Download,
  Heart,
  Layers,
  ScanLine,
} from "lucide-react"

import { MotifMatchingQuiz, type MatchingMotif } from "@/components/quiz/motif-matching-quiz"
import { LandingMotion } from "@/components/site/landing-motion"
import { LandingHeader } from "@/components/site/landing-header"

/* ============================================================================
   RAGAM MOTIF TAPIS LAMPUNG
   ============================================================================ */

interface ExampleMotif {
  id: string
  nama: string
  daerah: string
  warna: string
  filosofi: string
  gambar: string
  alt: string
}

const EXAMPLE_MOTIFS: ExampleMotif[] = [
  {
    id: "jung-sarat",
    nama: "Tapis Jung Sarat",
    daerah: "Menggala",
    warna: "Marun & Emas",
    filosofi:
      "Sulaman emas memenuhi permukaan kain dengan tepian segitiga merah, menegaskan keagungan perjalanan Pepadun serta kemakmuran dan persatuan keluarga.",
    gambar: "/images/jung sarat.jpg",
    alt: "Kain tapis Jung Sarat dengan sulaman emas dan tepian segitiga merah.",
  },
  {
    id: "raja-medal",
    nama: "Tapis Raja Medal",
    daerah: "Way Kanan",
    warna: "Merah Marun, Emas & Hitam",
    filosofi:
      "Barisan motif geometris berlapis menggambarkan kewibawaan pemimpin adat, keteguhan prinsip, dan integritas yang teratur.",
    gambar: "/images/raja medal.webp",
    alt: "Pola geometris Raja Medal dengan kombinasi marun, emas, dan hitam.",
  },
  {
    id: "pucuk-rebung",
    nama: "Tapis Pucuk Rebung",
    daerah: "Kalianda",
    warna: "Merah, Emas & Hitam",
    filosofi:
      "Deretan tunas bambu yang bertingkat menyimbolkan pertumbuhan tiada henti, kelenturan berpikir, dan kerendahan hati.",
    gambar: "/images/pucukk rebung.jpg",
    alt: "Deretan tunas bambu pucuk rebung berwarna emas di atas kain merah.",
  },
  {
    id: "inuh",
    nama: "Tapis Inuh",
    daerah: "Pesisir Barat",
    warna: "Navy, Marun & Emas",
    filosofi:
      "Pita bergaris dan figur bersulam membingkai perjalanan di atas ombak, menjadi doa keselamatan dan harmoni alam Samudra.",
    gambar: "/images/inuh.jpg",
    alt: "Tapis Inuh dengan pita navy, marun, emas, dan figur bersulam.",
  },
]

const QUIZ_MOTIFS: MatchingMotif[] = EXAMPLE_MOTIFS.map(({ id, nama, daerah, gambar }) => ({
  id,
  nama,
  gambar_url: gambar,
  daerah_asal: daerah,
}))

/* ============================================================================
   A. HERO SECTION (Fit 100vh di Desktop saat Pertama Dibuka, Tanpa Auth)
   ============================================================================ */

function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#FEFEFE] pt-16 lg:h-dvh lg:max-h-dvh"
    >
      {/* Background ilustrasi kain Tapis dan Rumah Adat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-12"
        style={{
          backgroundImage: "url('/images/rumah-tapis.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right bottom",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-20 size-[450px] rounded-full bg-[#F7E2C3]/60 blur-3xl"
      />

      {/* Header dengan navigasi responsif */}
      <LandingHeader />

      {/* Konten Hero (Fit Layar Desktop) */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-6 sm:px-8 lg:py-2">
        <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Kolom Kiri: Teks Editorial */}
          <div className="lg:col-span-6 space-y-4 lg:space-y-5">
            <span data-hero-badge className="inline-flex items-center rounded-full border border-[#C9A24D]/50 bg-[#FCF8F3] px-3.5 py-1 text-[11px] font-bold tracking-[0.08em] text-[#6D0F0F] uppercase">
              APLIKASI EDUKASI TAPIS LAMPUNG
            </span>

            <h1 data-hero-title className="font-heading text-3xl sm:text-4xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-tight text-[#262525]">
              Kenali Tapis, <br />
              <span className="text-[#6D0F0F]">dalam genggaman.</span>
            </h1>

            <p data-hero-desc className="max-w-lg text-sm sm:text-base leading-[1.65] text-[#57524E]">
              Pelajari filosofi, sejarah, dan asal daerah kain Tapis Lampung. Uji pemahamanmu lewat kuis pencocokan motif interaktif di halaman ini.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                data-hero-cta
                href="#download"
                className="inline-flex items-center gap-2 rounded-full bg-[#6D0F0F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-10px_rgba(109,15,15,0.65)] transition-all hover:bg-[#560B0B] active:scale-[0.98]"
              >
                <Download className="size-4" />
                Download Aplikasi
              </a>
              <a
                href="#kuesioner"
                className="rounded-full border border-[#C9A24D]/60 bg-white px-6 py-3 text-sm font-semibold text-[#262525] transition-all hover:bg-[#FCF8F3]"
              >
                Coba Kuis Motif
              </a>
            </div>

            <div data-hero-tags className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-[#6B6F77]">
              <span>Murni edukasi budaya</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-[#C9A24D]" />
              <span>Tanpa jual beli</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-[#C9A24D]" />
              <span>Kuis interaktif</span>
            </div>
          </div>

          {/* Kolom Kanan: Mockup HP Presisi */}
          <div data-hero-mockup className="flex justify-center lg:col-span-6 lg:justify-end">
            <Image
              src="/images/hp.png"
              alt="Tampilan aplikasi KAINARA pada ponsel"
              width={600}
              height={1210}
              priority
              className="h-auto max-h-[52vh] sm:max-h-[58vh] lg:max-h-[64vh] xl:max-h-[68vh] w-auto max-w-[260px] sm:max-w-[300px] lg:max-w-[320px] select-none object-contain drop-shadow-[0_20px_40px_rgba(38,37,37,0.25)]"
            />
          </div>
        </div>
      </div>

      {/* Petunjuk Gulir ke Kuis */}
      <div data-hero-scroll-hint className="relative z-10 w-full shrink-0 pb-3 text-center">
        <a
          href="#kuesioner"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6F77] transition-colors hover:text-[#6D0F0F]"
        >
          <span>Gulir ke Kuis Motif</span>
          <span aria-hidden="true">&darr;</span>
        </a>
      </div>
    </section>
  )
}

/* ============================================================================
   B. GALERI RAGAM MOTIF TAPIS
   ============================================================================ */

function MotifGallerySection() {
  return (
    <section id="galeri-motif" className="border-t border-[#262525]/8 bg-[#FCF8F3] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D0F0F]">
            Contoh Ragam Tapis
          </span>
          <h2 data-features-header className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#262525] sm:text-3xl">
            Empat Motif Lampung yang Bisa Kamu Kenali
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#57524E]">
            Kenali detail sulaman, warna, dan ragam motif Tapis dari Lampung.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {EXAMPLE_MOTIFS.map(({ id, nama, daerah, warna, filosofi, gambar, alt }) => (
            <article data-feature-card key={id} className="group overflow-hidden rounded-2xl border border-[#262525]/10 bg-white transition-shadow hover:shadow-[0_16px_32px_-24px_rgba(38,37,37,0.35)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#FCF8F3]">
                <Image src={gambar} alt={alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <div className="p-5">
                <p className="font-heading text-base font-semibold text-[#262525]">{nama}</p>
                <p className="text-xs font-medium text-[#96640F]">{daerah} &middot; {warna}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#57524E]">{filosofi}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#C9A24D]/35 bg-white px-5 py-4">
          <span className="size-1.5 shrink-0 rounded-full bg-[#C9A24D]" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-[#57524E] sm:text-sm">
            Semua contoh bersifat edukatif. Aplikasi mobile dapat memindai motif nyata langsung dari kainnya.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   C. FITUR APLIKASI MOBILE (Ringkas, Satu Fokus per Baris)
   ============================================================================ */

function AppFeaturesSection() {
  const features = [
    {
      icon: ScanLine,
      title: "Scan Motif Tapis",
      body: "Arahkan kamera ke kain Tapis. Aplikasi mengenali motif, daerah asal, dan makna simboliknya.",
    },
    {
      icon: Camera,
      title: "Scan Warna Kulit",
      body: "Pilih sampel rona kulit untuk menemukan warna Tapis dan busana yang paling selaras.",
    },
    {
      icon: Layers,
      title: "Katalog Motif & Padu Padan",
      body: "Telusuri ragam motif Tapis serta panduan atasan dan bawahan yang harmonis untuk acara adat.",
    },
    {
      icon: Heart,
      title: "Simpan Favorit",
      body: "Tandai motif dan inspirasi outfit yang disukai agar mudah ditemukan kembali nanti.",
    },
  ]

  return (
    <section id="fitur-aplikasi" className="border-t border-[#262525]/8 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D0F0F]">
            Fitur Aplikasi Mobile
          </span>
          <h2 data-features-header className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#262525] sm:text-3xl">
            Yang Bisa Kamu Lakukan di KAINARA
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#57524E]">
            Empat fungsi utama untuk memahami Tapis Lampung, tanpa fitur beli atau transaksi.
          </p>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <div data-feature-card key={title} className="flex gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FCF8F3] text-[#6D0F0F]">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-[#262525]">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#57524E]">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-[#C9A24D]/35 bg-[#FCF8F3] px-5 py-4">
          <span className="size-1.5 shrink-0 rounded-full bg-[#C9A24D]" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-[#57524E] sm:text-sm">
            Semua fitur mendukung edukasi dan pelestarian wastra Lampung. Kuis ini mengajakmu mengenali ragam motif Tapis.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   D. KUESIONER MOTIF SECTION (Latihan Pencocokan Motif)
   ============================================================================ */

function QuizSection({ motifs }: { motifs: MatchingMotif[] }) {
  return (
    <section data-quiz-section id="kuesioner" className="border-t border-[#262525]/10 bg-[#FCF8F3] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#C9A24D]/50 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#6D0F0F]">
            Uji Pemahaman Wastra Lampung
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#262525]">
            Kuis Pencocokan Motif Tapis
          </h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#57524E]">
            Hubungkan gambar motif tenun di sebelah kiri ke nama motif yang tepat di sebelah kanan. Cocokkan ciri khas tiap motif dengan seksama.
          </p>
        </div>

        {/* Komponen Kuis Interaktif */}
        <MotifMatchingQuiz motifs={motifs} />
      </div>
    </section>
  )
}

/* ============================================================================
   C. DOWNLOAD APP SECTION
   ============================================================================ */

function DownloadAppSection() {
  const downloadUrl = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL

  return (
    <section id="download" className="border-t border-[#262525]/8 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <span className="inline-flex items-center rounded-full border border-[#C9A24D]/50 bg-[#FCF8F3] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#6D0F0F]">
          Aplikasi Mobile KAINARA
        </span>
        <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-[#262525] sm:text-3xl">
          Eksplorasi Wastra Tapis Langsung dari Ponsel
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#57524E]">
          Pindai motif langsung menggunakan kamera, temukan rekomendasi warna busana yang serasi dengan skintone, dan pelajari warisan budaya Lampung di mana saja.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#6D0F0F] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-10px_rgba(109,15,15,0.65)] transition-all hover:bg-[#560B0B] active:scale-[0.98]"
            >
              <Download className="size-4" />
              Unduh APK Android
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24D]/60 bg-[#FCF8F3] px-6 py-3 text-xs font-semibold text-[#6D0F0F]">
              <Download className="size-3.5" />
              Tautan Unduh Aplikasi Segera Tersedia
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   C. FOOTER MINIMALIS
   ============================================================================ */

function SiteFooterMinimal() {
  return (
    <footer className="border-t border-[#262525]/8 bg-white py-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/icon-kainara.jpeg"
              alt="Logo KAINARA"
              width={36}
              height={36}
              className="size-9 rounded-lg object-cover"
            />
            <div>
              <p className="font-heading text-base font-bold text-[#6D0F0F]">
                KAINARA
              </p>
              <p className="text-xs text-[#57524E]">
                Platform Edukasi Wastra Tradisional Tapis Lampung
              </p>
            </div>
          </div>

          <nav
            aria-label="Tautan Cepat Footer"
            className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#57524E]"
          >
            <a href="#top" className="hover:text-[#6D0F0F]">
              Beranda
            </a>
            <a href="#fitur-aplikasi" className="hover:text-[#6D0F0F]">
              Fitur Aplikasi
            </a>
            <a href="#galeri-motif" className="hover:text-[#6D0F0F]">
              Contoh Motif
            </a>
            <a href="#kuesioner" className="hover:text-[#6D0F0F]">
              Kuis Motif
            </a>
            <Link href="/kuis" className="hover:text-[#6D0F0F]">
              Halaman Kuis Lengkap
            </Link>
          </nav>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#262525]/8 pt-6 text-[11px] text-[#6B6F77] sm:flex-row">
          <p>
            {/* shortcut: tahun agar prerender stabil; perbarui manual tiap tahun */}
            &copy; 2026 KAINARA. Murni edukasi budaya, tanpa jual beli maupun transaksi komersial.
          </p>
          <p>Pelestarian Wastra Tradisional Lampung</p>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================================
   HALAMAN UTAMA KAINARA (Server Component)
   ============================================================================ */

export default function KainaraLandingPage() {
  return (
    <main
      className="min-h-dvh bg-[#FEFEFE] text-[#262525]"
      style={{
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <LandingMotion />

      {/* 1. Hero Section: Pas 1 layar desktop saat pertama dibuka */}
      <HeroSection />

      {/* 2. Galeri Contoh Motif */}
      <MotifGallerySection />

      {/* 3. Fitur Aplikasi Mobile */}
      <AppFeaturesSection />

      {/* 4. Kuis Motif: Latihan pencocokan */}
      <QuizSection motifs={QUIZ_MOTIFS} />

      {/* 5. Unduh Aplikasi Mobile */}
      <DownloadAppSection />

      {/* 6. Footer Minimalis */}
      <SiteFooterMinimal />
    </main>
  )
}

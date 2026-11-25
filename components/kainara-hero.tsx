"use client"

import SketchCityHero from "@/components/ui/sketch-city-hero"

interface KainaraHeroProps {
  /** Isi dari Supabase (count tabel motifs, outfits, skintones). */
  totalMotif?: number
  totalOutfit?: number
  totalSkintone?: number
}

const MOTIF_MENU = ["Tapis Jung Sarat", "Tapis Raja Medal", "Tapis Inuh", "Tapis Cucuk Andak"]

export default function KainaraHero({
  totalMotif = 5,
  totalOutfit = 5,
  totalSkintone = 8,
}: KainaraHeroProps) {
  const appDownloadUrl = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/motif", label: "Galeri Tapis" },
    { href: "/kuis", label: "Kuis" },
    ...(appDownloadUrl ? [{ href: appDownloadUrl, label: "Unduh Aplikasi" }] : []),
  ]

  return (
    <SketchCityHero
      className="kainara-hero"
      brand="KAINARA"
      menuLabel="Jelajah Motif"
      menuItems={MOTIF_MENU}
      linkLabel="Kuesioner"
      linkHref="/kuis"
      headline={["Warna yang Pas", "untuk Gayamu."]}
      stats={[
        { value: totalMotif, label: "motif tapis" },
        { value: totalOutfit, label: "rekomendasi outfit" },
        { value: totalSkintone, label: "pilihan skintone" },
      ]}
      blurb="Temukan tapis yang sesuai dengan warna kulitmu. Pindai motif, cocokkan skintone, dan lihat outfit yang serasi lewat aplikasi Kainara."
      accent="#6D0F0F"
      height="100svh"
      mark={false}
      navLinks={navLinks}
      singleSketch
      singleSketchSrc="/images/tenun-tapis.jpg"
    />
  )
}

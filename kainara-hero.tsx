"use client"

import SketchCityHero from "@/components/ui/sketch-city-hero"

/**
 * Hero beranda Kainara. Memakai SketchCityHero apa adanya (tata letak tidak
 * diubah); warna diatur lewat kainara-hero.css (komposisi 60/30/10).
 *
 * Letakkan di components/kainara-hero.tsx, lalu pakai di app/(public)/page.tsx:
 *   <KainaraHero totalMotif={motifCount} totalOutfit={outfitCount} />
 */

interface KainaraHeroProps {
  /** Isi dari Supabase (count tabel motifs, outfits, skintones). */
  totalMotif?: number
  totalOutfit?: number
  totalSkintone?: number
}

const MOTIF_MENU = ["Pucuk Rebung", "Kapal", "Siger", "Gajah", "Mata Punai"]

export default function KainaraHero({
  totalMotif = 5,
  totalOutfit = 5,
  totalSkintone = 8,
}: KainaraHeroProps) {
  return (
    <SketchCityHero
      className="kainara-hero"
      brand="KAINARA"
      menuLabel="Motif Tapis"
      menuItems={MOTIF_MENU}
      linkLabel="Kuis Tapis"
      linkHref="/kuis"
      headline={["Warna yang Pas", "untuk Gayamu"]}
      stats={[
        { value: totalMotif, label: "motif tapis" },
        { value: totalOutfit, label: "rekomendasi outfit" },
        { value: totalSkintone, label: "pilihan skintone" },
      ]}
      blurb="Temukan tapis yang sesuai dengan warna kulitmu. Pindai motif, cocokkan skintone, dan lihat outfit yang serasi lewat aplikasi Kainara."
      accent="#96640F"
      height="100svh"
    />
  )
}
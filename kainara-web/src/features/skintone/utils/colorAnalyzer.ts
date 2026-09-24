import type { SkinToneResult } from "@/types";
import { OUTFIT_DATA, MOTIF_DATA } from "@/lib/constants/mockData";
import { scanSkintone } from "@/lib/api";

function generateRecommendation(tone: "warm" | "cool" | "neutral"): SkinToneResult {
  if (tone === "warm") {
    return {
      tone: "warm",
      palette: ["#8B5E3C", "#D4AF37", "#3A2617", "#B57A48"], // Earth Tone & Sogan
      recommendedMotifs: MOTIF_DATA.filter(
        (m) =>
          m.id === "motif_siger" ||
          m.id === "motif_pucuk_rebung" ||
          m.id === "motif_sembagi" ||
          m.id === "motif_gajah" ||
          m.id === "motif_gamolan"
      ).slice(0, 4),
      recommendations: OUTFIT_DATA.filter((o) =>
        o.tags.includes("earth-tone") || o.motifId === "motif_siger" || o.motifId === "motif_sembagi" || o.motifId === "motif_gajah" || o.motifId === "motif_gamolan"
      ).slice(0, 4),
    };
  }

  if (tone === "cool") {
    return {
      tone: "cool",
      palette: ["#1F3A93", "#4ECDC4", "#E4F1FE", "#2C3E50"], // Biru & Monokrom
      recommendedMotifs: MOTIF_DATA.filter(
        (m) =>
          m.id === "motif_kapal" ||
          m.id === "motif_belah_ketupat" ||
          m.id === "motif_bunga_ashar"
      ).slice(0, 4),
      recommendations: OUTFIT_DATA.filter((o) =>
        o.tags.includes("monokrom") || o.motifId === "motif_kapal" || o.motifId === "motif_belah_ketupat" || o.tags.includes("floral")
      ).slice(0, 4),
    };
  }

  // Neutral
  return {
    tone: "neutral",
    palette: ["#795548", "#607D8B", "#FFC107", "#E0E0E0"],
    recommendedMotifs: [...MOTIF_DATA].sort(() => 0.5 - Math.random()).slice(0, 4),
    recommendations: [...OUTFIT_DATA].sort(() => 0.5 - Math.random()).slice(0, 4),
  };
}

/**
 * Menganalisis skintone dengan memanggil backend AI.
 */
export async function processSkinImageBlob(blob: Blob): Promise<SkinToneResult> {
  const result = await scanSkintone(blob);
  const tone = result.data.tone as "warm" | "cool" | "neutral";
  return generateRecommendation(tone);
}

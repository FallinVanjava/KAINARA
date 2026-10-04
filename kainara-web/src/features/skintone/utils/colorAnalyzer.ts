import type { SkinToneResult } from "@/types";
import { OUTFIT_DATA, MOTIF_DATA } from "@/lib/constants/mockData";
import { scanSkintone } from "@/lib/api";

function generateRecommendation(tone: "warm" | "cool" | "neutral"): SkinToneResult {
  if (tone === "warm") {
    return {
      tone: "warm",
      palette: ["#6D0F0F", "#D2AA36", "#1C1B19", "#F7E2C3"],
      recommendedMotifs: MOTIF_DATA.filter(
        (m) =>
          m.id === "tapis_pucuk_rebung" ||
          m.id === "tapis_bintang_perak" ||
          m.id === "motif_siger" ||
          m.id === "motif_sembagi"
      ).slice(0, 4),
      recommendations: OUTFIT_DATA.filter((o) =>
        o.tags.includes("earth-tone") || o.motifId === "tapis_pucuk_rebung" || o.motifId === "motif_siger"
      ).slice(0, 4),
    };
  }

  if (tone === "cool") {
    return {
      tone: "cool",
      palette: ["#2C3E6B", "#D9D9D9", "#EDE3DA", "#1C1B19"],
      recommendedMotifs: MOTIF_DATA.filter(
        (m) =>
          m.id === "tapis_bintang_perak" ||
          m.id === "motif_kapal" ||
          m.id === "motif_belah_ketupat"
      ).slice(0, 4),
      recommendations: OUTFIT_DATA.filter((o) =>
        o.tags.includes("monokrom") || o.motifId === "tapis_bintang_perak" || o.tags.includes("bintang-perak")
      ).slice(0, 4),
    };
  }

  // Neutral
  return {
    tone: "neutral",
    palette: ["#1C1B19", "#D9D9D9", "#D2AA36", "#EDE3DA"],
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

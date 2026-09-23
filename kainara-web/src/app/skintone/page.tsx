"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SkinScannerUI } from "@/features/skintone/components/SkinScannerUI";
import { SkinToneResultCard } from "@/features/skintone/components/SkinToneResultCard";
import { processSkinImageBlob } from "@/features/skintone/utils/colorAnalyzer";
import type { SkinToneResult } from "@/types";

export default function SkinTonePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinToneResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (blob: Blob) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const analysisResult = await processSkinImageBlob(blob);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menganalisis foto.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
      <header className="mb-12 text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emas/20 text-sogan-900 text-xs font-bold tracking-widest uppercase mb-4 border border-emas/40"
        >
          <span className="size-1.5 rounded-full bg-emas" aria-hidden="true" />
          Ekstraksi Spektrum RGB Privat
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-sogan-900 leading-tight"
        >
          Skin Tone Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-sogan-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed"
        >
          Unggah foto wajah Anda. Sistem kami menganalisis pigmen rona kulit
          dan memberikan rekomendasi palet warna busana Batik Lampung yang paling selaras.
        </motion.p>
      </header>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <SkinScannerUI onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {error && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm text-center max-w-md mx-auto"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <SkinToneResultCard result={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

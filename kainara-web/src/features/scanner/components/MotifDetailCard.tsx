"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Toast } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { MOTIF_DATA } from "@/lib/constants/mockData";
import type { ScanResult } from "@/types";
import { submitFeedbackCorrection } from "@/lib/api";

interface MotifDetailCardProps {
  result: ScanResult;
  onScanAgain?: () => void;
  originalBlob?: Blob | null;
}

export function MotifDetailCard({
  result,
  onScanAgain,
  originalBlob,
}: MotifDetailCardProps) {
  const { motif, accuracy } = result;

  const isLiked = useFavoriteStore((s) => s.isMotifFavorited(motif.id));
  const toggleMotif = useFavoriteStore((s) => s.toggleFavoriteMotif);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setIsSubmitting(true);

    try {
      if (!originalBlob) throw new Error("Foto asli tidak tersedia");

      await submitFeedbackCorrection(originalBlob, selectedId);

      setIsModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Gagal mengirim koreksi motif.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast
        message="Terima kasih. Koreksi Anda membantu kecerdasan KAINARA berkembang."
        show={showToast}
      />

      {/* FEEDBACK & CORRECTION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-sogan-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-sogan-200/80"
            >
              <h3 className="font-serif font-bold text-2xl text-sogan-900 mb-2">
                Koreksi Hasil AI
              </h3>
              <p className="text-xs sm:text-sm text-sogan-600 leading-relaxed mb-6">
                Pilih motif yang sebenarnya ada pada kain Anda. Kontribusi ini
                membantu menyempurnakan model visi komputer kami.
              </p>

              <form onSubmit={handleSubmitFeedback} className="space-y-5">
                <div>
                  <label
                    htmlFor="motif-correction"
                    className="block text-xs font-bold text-sogan-500 uppercase tracking-wider mb-2"
                  >
                    Motif Sebenarnya
                  </label>
                  <select
                    id="motif-correction"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full bg-sogan-50 border border-sogan-200 text-sogan-900 text-sm rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-emas transition-all"
                  >
                    <option value="" disabled>
                      Pilih nama motif yang tepat...
                    </option>
                    {MOTIF_DATA.map((m) => (
                      <option
                        key={m.id}
                        value={m.id}
                        disabled={m.id === motif.id}
                      >
                        {m.name} {m.id === motif.id && "(Prediksi Saat Ini)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={isSubmitting}
                    disabled={!selectedId}
                  >
                    Kirim Koreksi
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOTIF DETAIL BOTTOM-SHEET / CARD (design.md 5.3) ──────── */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl mx-auto bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80"
      >
        {/* Banner Image with Pop-out Aesthetic */}
        <div className="relative h-64 sm:h-72 w-full bg-sogan-900 overflow-hidden">
          <Image
            src={motif.imageUrl}
            alt={motif.name}
            fill
            sizes="(max-width: 640px) 100vw, 576px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sogan-950 via-sogan-950/40 to-transparent" />

          {/* Floating Top Controls */}
          <div className="absolute top-4 right-4 z-10">
            <motion.button
              type="button"
              aria-label={
                isLiked
                  ? `Hapus ${motif.name} dari favorit`
                  : `Simpan ${motif.name} ke favorit`
              }
              aria-pressed={isLiked}
              whileTap={{ scale: 0.85 }}
              onClick={() => toggleMotif(motif.id)}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
                isLiked
                  ? "bg-emas text-sogan-900 shadow-[0_4px_16px_rgba(212,175,55,0.45)]"
                  : "bg-white/30 text-white hover:bg-white hover:text-emas-600"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </motion.button>
          </div>

          {/* Headline on Image */}
          <div className="absolute bottom-5 left-6 right-6">
            <Badge variant="gold" className="mb-2">
              {motif.category}
            </Badge>
            <h2 className="text-white font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">
              {motif.name}
            </h2>
            <p className="text-ivory/80 text-xs sm:text-sm mt-1">
              Asal Daerah: {motif.origin}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Giant Siger Gold Accuracy Score (design.md 5.3) */}
          <div className="p-5 rounded-[24px] bg-sogan-50 border border-sogan-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sogan-500 uppercase tracking-widest block">
                Skor Tingkat Keyakinan AI
              </span>
              <p className="text-xs text-sogan-400 mt-0.5">
                Klasifikasi fitur visual ResNet50
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-emas tracking-tight">
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Philosophy Section */}
          <div>
            <h3 className="text-xs font-bold text-sogan-400 uppercase tracking-widest mb-2">
              Filosofi &amp; Makna Simbolis
            </h3>
            <p className="font-serif text-sogan-800 text-base sm:text-lg leading-relaxed">
              {motif.philosophy}
            </p>
          </div>

          {/* Color Swatches */}
          <div>
            <h3 className="text-xs font-bold text-sogan-400 uppercase tracking-widest mb-3">
              Palet Warna Alami
            </h3>
            <div className="flex gap-2.5">
              {motif.colors.map((c) => (
                <div
                  key={c}
                  className="size-8 rounded-full border-2 border-white ring-1 ring-sogan-200 shadow-xs"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Action CTA */}
          {onScanAgain && (
            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full py-3.5 text-sm sm:text-base"
                onClick={onScanAgain}
              >
                Pindai Wastra Lainnya
              </Button>
            </div>
          )}

          {/* Correction Feedback Trigger */}
          <div className="text-center pt-3 border-t border-sogan-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-sogan-400 hover:text-emas transition-colors underline underline-offset-4 cursor-pointer"
            >
              Hasil tidak akurat? Laporkan koreksi di sini.
            </button>
          </div>
        </div>
      </motion.article>
    </>
  );
}

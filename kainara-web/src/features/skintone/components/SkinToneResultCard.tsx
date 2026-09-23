"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import type { SkinToneResult } from "@/types";

interface SkinToneResultCardProps {
  result: SkinToneResult;
  onReset: () => void;
}

const toneMap = {
  warm: {
    label: "Warm Undertone",
    desc: "Kulit Anda memancarkan rona hangat kekuningan dan keemasan. Paduan warna yang paling memikat untuk Anda adalah palet warna bumi (Earth Tones) seperti coklat sogan, terakota, dan kilau emas siger.",
    gradient: "from-amber-50 via-orange-50/60 to-ivory",
    badgeVariant: "gold" as const,
  },
  cool: {
    label: "Cool Undertone",
    desc: "Kulit Anda memiliki rona sejuk merona merah muda atau kebiruan. Warna yang membuat kulit Anda bercahaya adalah rona tegas seperti biru indigo, merah marun, dan monokrom kontras.",
    gradient: "from-blue-50 via-indigo-50/60 to-ivory",
    badgeVariant: "indigo" as const,
  },
  neutral: {
    label: "Neutral Undertone",
    desc: "Anda memiliki harmoni rona hangat dan sejuk yang seimbang. Anda sangat leluasa memadukan hampir semua palet kain Nusantara dan motif klasik Lampung.",
    gradient: "from-stone-50 via-sogan-50 to-ivory",
    badgeVariant: "sogan" as const,
  },
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );
}

export function SkinToneResultCard({ result, onReset }: SkinToneResultCardProps) {
  const info = toneMap[result.tone];

  const favoriteMotifIds = useFavoriteStore((s) => s.favoriteMotifIds);
  const toggleFavoriteMotif = useFavoriteStore((s) => s.toggleFavoriteMotif);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* ── KARTU PROFIL UTAMA ────────────────────────────────────── */}
      <div
        className={`rounded-3xl overflow-hidden shadow-[var(--shadow-ethereal)] border border-sogan-200/80 bg-gradient-to-br ${info.gradient} p-8 sm:p-10 mb-12`}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-emas-600 mb-2 block">
              Hasil Analisis Spektrum RGB
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-sogan-900 mb-4">
              {info.label}
            </h2>
            <p className="text-sogan-700 leading-relaxed text-sm sm:text-base mb-8">
              {info.desc}
            </p>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sogan-500 block mb-3">
                Rekomendasi Palet Warna Wastra
              </span>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {result.palette.map((hex, i) => (
                  <motion.div
                    key={hex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.08, type: "spring" }}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-sogan-200 shadow-xs"
                  >
                    <div
                      className="size-6 rounded-full shadow-inner border border-black/10"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                    <span className="text-xs font-mono font-semibold text-sogan-700">
                      {hex}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── REKOMENDASI MOTIF BATIK ─────────────────────────────────── */}
      <div className="mb-12">
        <div className="mb-6 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emas-600 block mb-1">
            Harmoni Budaya
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sogan-900">
            Motif Wastra yang Paling Selaras
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {result.recommendedMotifs.map((motif, i) => {
            const isLiked = favoriteMotifIds.includes(motif.id);
            return (
              <motion.article
                key={motif.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1 }}
                className="relative group bg-white rounded-[28px] p-4 overflow-hidden shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 flex flex-col transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-44 sm:h-48 w-full rounded-[20px] overflow-hidden bg-sogan-100 mb-4">
                  <Image
                    src={motif.imageUrl}
                    alt={motif.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sogan-950/60 to-transparent" />

                  {/* Floating favorite button */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleFavoriteMotif(motif.id)}
                    aria-label={
                      isLiked
                        ? `Hapus ${motif.name} dari favorit`
                        : `Simpan ${motif.name} ke favorit`
                    }
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                      isLiked
                        ? "bg-emas text-sogan-900 shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
                        : "bg-white/60 text-sogan-700 hover:bg-white hover:text-emas-600"
                    }`}
                  >
                    <HeartIcon filled={isLiked} />
                  </motion.button>
                </div>

                <div className="px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <Badge variant={info.badgeVariant} className="mb-2">
                      {motif.category}
                    </Badge>
                    <h4 className="font-serif font-bold text-sogan-900 text-lg leading-tight mb-2 group-hover:text-emas-600 transition-colors">
                      {motif.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-sogan-500 line-clamp-2 leading-relaxed mb-4">
                      {motif.philosophy}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sogan-100">
                    <Link
                      href={`/education/${motif.slug}`}
                      className="text-xs font-bold text-sogan-800 hover:text-emas transition-colors inline-flex items-center gap-1"
                    >
                      Pelajari Filosofi
                      <span>→</span>
                    </Link>
                    <div className="flex -space-x-1.5" aria-label="Warna motif">
                      {motif.colors.slice(0, 3).map((c, idx) => (
                        <span
                          key={c + idx}
                          className="size-4 rounded-full border border-white ring-1 ring-black/5"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* ── REKOMENDASI OUTFIT LOOKBOOK ─────────────────────────────── */}
      <div className="mb-12">
        <div className="mb-6 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emas-600 block mb-1">
            Padu Padan Busana
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sogan-900">
            Inspirasi Busana Sesuai Rona Kulit
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {result.recommendations.map((outfit, i) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="group bg-white rounded-[28px] p-3.5 overflow-hidden shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-60 w-full rounded-[20px] overflow-hidden bg-sogan-100 mb-3">
                <Image
                  src={outfit.imageUrl}
                  alt={outfit.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="px-1.5 pb-1">
                <Badge variant={info.badgeVariant} className="mb-1.5">
                  {outfit.category}
                </Badge>
                <p className="font-serif font-bold text-sogan-900 text-sm leading-snug line-clamp-1 group-hover:text-emas-600 transition-colors">
                  {outfit.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {outfit.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-sogan-500 uppercase tracking-wider bg-sogan-100/70 px-2 py-0.5 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-sogan-200/60">
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-3.5 rounded-full border border-sogan-300 text-sogan-800 font-semibold hover:bg-sogan-100 transition-colors cursor-pointer text-sm"
        >
          Analisis Ulang Foto
        </button>
        <Link
          href="/education"
          className="px-8 py-3.5 rounded-full bg-sogan-800 text-ivory font-bold hover:bg-sogan-900 transition-colors text-center shadow-xs text-sm"
        >
          Jelajahi Katalog Lengkap
        </Link>
      </div>
    </motion.div>
  );
}

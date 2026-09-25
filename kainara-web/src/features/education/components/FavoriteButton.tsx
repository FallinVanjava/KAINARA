"use client";

import { motion } from "framer-motion";
import { useFavoriteStore } from "@/store/useFavoriteStore";

interface FavoriteButtonProps {
  id: string;
  name: string;
  type?: "motif" | "outfit";
}

export function FavoriteButton({ id, name, type = "motif" }: FavoriteButtonProps) {
  const isLiked = useFavoriteStore((s) =>
    type === "motif" ? s.isMotifFavorited(id) : s.isOutfitFavorited(id)
  );
  const toggle = useFavoriteStore((s) =>
    type === "motif" ? s.toggleFavoriteMotif : s.toggleFavoriteOutfit
  );

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={() => toggle(id)}
      aria-label={isLiked ? `Hapus ${name} dari favorit` : `Simpan ${name} ke favorit`}
      aria-pressed={isLiked}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
        isLiked
          ? "bg-emas text-sogan-900 shadow-[0_2px_12px_rgba(212,175,55,0.4)]"
          : "bg-white/20 text-white hover:bg-white/30 border border-white/30 backdrop-blur-md"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
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
      {isLiked ? "Tersimpan di Favorit" : "Simpan Favorit"}
    </motion.button>
  );
}

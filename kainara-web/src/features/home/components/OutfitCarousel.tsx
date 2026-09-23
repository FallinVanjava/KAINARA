"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import type { Outfit } from "@/types";

interface OutfitCardProps {
  outfit: Outfit;
}

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

const categoryLabelMap: Record<Outfit["category"], string> = {
  formal: "Formal",
  casual: "Kasual",
  tradisional: "Tradisional",
  "semi-formal": "Semi-Formal",
};

function OutfitCard({ outfit }: OutfitCardProps) {
  const isLiked = useFavoriteStore((s) => s.isOutfitFavorited(outfit.id));
  const toggleOutfit = useFavoriteStore((s) => s.toggleFavoriteOutfit);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="relative flex-shrink-0 w-60 sm:w-68 bg-white rounded-3xl p-3 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/60 transition-shadow duration-300 group cursor-pointer"
    >
      <div className="relative h-72 sm:h-80 w-full rounded-[24px] overflow-hidden bg-sogan-100">
        <Image
          src={outfit.imageUrl}
          alt={outfit.title}
          fill
          sizes="(max-width: 640px) 240px, 272px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sogan-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Floating Heart Button on Top-Right of Image (design.md 5.4) */}
        <motion.button
          type="button"
          aria-label={
            isLiked
              ? `Hapus ${outfit.title} dari koleksi favorit`
              : `Simpan ${outfit.title} ke koleksi favorit`
          }
          aria-pressed={isLiked}
          whileTap={{ scale: 0.82 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleOutfit(outfit.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            isLiked
              ? "bg-emas text-sogan-900 shadow-[0_4px_16px_rgba(212,175,55,0.45)]"
              : "bg-white/70 text-sogan-700 hover:bg-white hover:text-emas-600"
          }`}
        >
          <HeartIcon filled={isLiked} />
        </motion.button>
      </div>

      <div className="pt-3.5 pb-1.5 px-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <Badge variant="gold">{categoryLabelMap[outfit.category]}</Badge>
          <span className="text-[11px] text-sogan-400 font-medium">Lampung Style</span>
        </div>
        <h3 className="font-serif font-bold text-sogan-900 text-base leading-snug line-clamp-1 group-hover:text-emas-600 transition-colors">
          {outfit.title}
        </h3>
      </div>
    </motion.article>
  );
}

interface OutfitCarouselProps {
  outfits: Outfit[];
  title?: string;
  subtitle?: string;
}

export function OutfitCarousel({
  outfits,
  title = "Inspirasi Padu Padan Outfit",
  subtitle = "Gaya busana modern berbalut kehangatan wastra dan warna bumi nusantara.",
}: OutfitCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section aria-label={title} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 px-1 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emas-600 block mb-1">
            Lookbook &amp; Moodboard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-sogan-900 font-bold">
            {title}
          </h2>
          <p className="text-sogan-500 text-sm mt-1 max-w-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <button
            type="button"
            aria-label="Gulir ke kiri"
            disabled={!canScrollLeft}
            onClick={() => scroll("left")}
            className="p-3 rounded-full border border-sogan-200/80 bg-white text-sogan-700 hover:bg-sogan-50 hover:border-emas disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Gulir ke kanan"
            disabled={!canScrollRight}
            onClick={() => scroll("right")}
            className="p-3 rounded-full border border-sogan-200/80 bg-white text-sogan-700 hover:bg-sogan-50 hover:border-emas disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-6 px-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Daftar inspirasi lookbook batik"
      >
        {outfits.map((outfit) => (
          <div key={outfit.id} role="listitem" className="snap-start">
            <OutfitCard outfit={outfit} />
          </div>
        ))}
      </div>
    </section>
  );
}

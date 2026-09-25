"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MOTIF_DATA, OUTFIT_DATA } from "@/lib/constants/mockData";
import { MotifGridCard } from "@/features/education/components/MotifGridCard";
import { Badge } from "@/components/ui/Badge";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import Link from "next/link";
import type { Outfit } from "@/types";

const CATEGORIES = ["Semua", ...Array.from(new Set(MOTIF_DATA.map((m) => m.category)))];

const categoryLabelMap: Record<Outfit["category"], string> = {
  formal: "Formal",
  casual: "Kasual",
  tradisional: "Tradisional",
  "semi-formal": "Semi-Formal",
};

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<"katalog" | "favorit">("katalog");
  const [favFilter, setFavFilter] = useState<"semua" | "motif" | "outfit">("semua");
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");

  const favoriteMotifIds = useFavoriteStore((s) => s.favoriteMotifIds);
  const favoriteOutfitIds = useFavoriteStore((s) => s.favoriteOutfitIds);
  const toggleOutfit = useFavoriteStore((s) => s.toggleFavoriteOutfit);
  const clearAllFavorites = useFavoriteStore((s) => s.clearAllFavorites);

  const totalFavorites = favoriteMotifIds.length + favoriteOutfitIds.length;

  const filteredMotifs = useMemo(() => {
    const baseData =
      activeTab === "katalog"
        ? MOTIF_DATA
        : MOTIF_DATA.filter((m) => favoriteMotifIds.includes(m.id));

    return baseData.filter((motif) => {
      const matchSearch =
        motif.name.toLowerCase().includes(search.toLowerCase()) ||
        motif.philosophy.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "Semua" || motif.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat, activeTab, favoriteMotifIds]);

  const filteredOutfits = useMemo(() => {
    if (activeTab !== "favorit") return [];
    return OUTFIT_DATA.filter((o) => favoriteOutfitIds.includes(o.id)).filter(
      (outfit) =>
        outfit.title.toLowerCase().includes(search.toLowerCase()) ||
        outfit.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );
  }, [activeTab, favoriteOutfitIds, search]);

  const showMotifs = activeTab === "katalog" || favFilter === "semua" || favFilter === "motif";
  const showOutfits = activeTab === "favorit" && (favFilter === "semua" || favFilter === "outfit");

  return (
    <main className="flex-1 w-full bg-[#FAF9F6] pt-28 sm:pt-36 pb-20 sm:pb-28">
      {/* ── HEADER EDUKASI & TAB SWITCHER ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emas/20 text-sogan-900 text-xs font-bold tracking-widest uppercase mb-4 border border-emas/40"
        >
          <span className="size-1.5 rounded-full bg-emas" aria-hidden="true" />
          Ensiklopedia Wastra Nusantara
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-sogan-900 mb-4 tracking-tight"
        >
          Katalog &amp; Koleksi Motif
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sogan-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8"
        >
          Telusuri makna sakral dan sejarah di balik sulaman benang emas serta
          ragam hias Batik Lampung yang legendaris.
        </motion.p>

        {/* Tab Switcher (Pill Style) */}
        <div className="inline-flex bg-white p-1.5 rounded-full border border-sogan-200/80 shadow-[var(--shadow-ethereal)]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("katalog");
              setSearch("");
              setSelectedCat("Semua");
            }}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === "katalog"
                ? "bg-sogan-800 text-ivory shadow-xs"
                : "text-sogan-600 hover:text-sogan-900"
            }`}
          >
            Katalog Lengkap
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("favorit");
              setSearch("");
            }}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "favorit"
                ? "bg-sogan-800 text-ivory shadow-xs"
                : "text-sogan-600 hover:text-sogan-900"
            }`}
          >
            Koleksi Favorit
            {totalFavorites > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === "favorit"
                    ? "bg-emas text-sogan-900"
                    : "bg-sogan-100 text-sogan-800"
                }`}
              >
                {totalFavorites}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── FILTER & SEARCH BAR ──────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-ethereal)] p-4 sm:p-5 border border-sogan-200/80 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-sogan-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder={
                activeTab === "katalog"
                  ? "Cari nama motif, teknik tenun, atau filosofi..."
                  : "Cari dalam koleksi favorit Anda..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-sogan-50/80 border-none rounded-full focus:ring-2 focus:ring-emas text-sogan-900 placeholder:text-sogan-400 text-xs sm:text-sm font-medium outline-none"
            />
          </div>

          {activeTab === "katalog" ? (
            <div className="flex overflow-x-auto gap-2 items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCat === cat
                      ? "bg-sogan-800 text-ivory shadow-xs"
                      : "bg-sogan-50 text-sogan-600 hover:bg-sogan-100 hover:text-sogan-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex overflow-x-auto gap-1.5 items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  type="button"
                  onClick={() => setFavFilter("semua")}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    favFilter === "semua"
                      ? "bg-sogan-800 text-ivory"
                      : "bg-sogan-50 text-sogan-600 hover:bg-sogan-100"
                  }`}
                >
                  Semua ({totalFavorites})
                </button>
                <button
                  type="button"
                  onClick={() => setFavFilter("motif")}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    favFilter === "motif"
                      ? "bg-sogan-800 text-ivory"
                      : "bg-sogan-50 text-sogan-600 hover:bg-sogan-100"
                  }`}
                >
                  Motif ({favoriteMotifIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFavFilter("outfit")}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    favFilter === "outfit"
                      ? "bg-sogan-800 text-ivory"
                      : "bg-sogan-50 text-sogan-600 hover:bg-sogan-100"
                  }`}
                >
                  Outfit ({favoriteOutfitIds.length})
                </button>
              </div>

              {totalFavorites > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Kosongkan semua daftar favorit yang tersimpan?")) {
                      clearAllFavorites();
                    }
                  }}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-200 cursor-pointer ml-auto"
                >
                  Kosongkan
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── GRID CONTENT ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
        <AnimatePresence mode="wait">
          {activeTab === "favorit" && totalFavorites === 0 ? (
            <motion.div
              key="empty-fav"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-6 bg-white rounded-3xl border border-sogan-200/80 shadow-[var(--shadow-ethereal)] max-w-xl mx-auto"
            >
              <div className="size-20 mx-auto bg-emas/15 text-emas-600 rounded-full flex items-center justify-center mb-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-sogan-900 mb-2">
                Belum Ada Koleksi Disimpan
              </h3>
              <p className="text-sogan-500 text-xs sm:text-sm mb-6 leading-relaxed">
                Anda dapat menambahkan motif atau padu padan outfit ke dalam koleksi favorit dengan menekan ikon hati
                pada katalog, lookbook, atau hasil pemindaian AI.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("katalog")}
                  className="px-6 py-2.5 rounded-full border border-sogan-300 text-sogan-800 text-xs font-bold hover:bg-sogan-100 transition-colors cursor-pointer"
                >
                  Buka Katalog
                </button>
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emas text-sogan-900 font-bold text-xs hover:bg-emas-400 transition-colors shadow-[var(--shadow-gold)]"
                >
                  Mulai Scan Wastra
                </Link>
              </div>
            </motion.div>
          ) : (filteredMotifs.length > 0 && showMotifs) || (filteredOutfits.length > 0 && showOutfits) ? (
            <motion.div
              key={`${activeTab}-${favFilter}-content`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Motifs Grid */}
              {showMotifs && filteredMotifs.length > 0 && (
                <div>
                  {activeTab === "favorit" && favFilter === "semua" && (
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-sogan-900 mb-6">
                      Motif Wastra Favorit ({filteredMotifs.length})
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMotifs.map((motif, idx) => (
                      <MotifGridCard key={motif.id} motif={motif} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* Outfits Grid */}
              {showOutfits && filteredOutfits.length > 0 && (
                <div>
                  {activeTab === "favorit" && favFilter === "semua" && (
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-sogan-900 mb-6">
                      Padu Padan Busana Favorit ({filteredOutfits.length})
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredOutfits.map((outfit) => (
                      <motion.article
                        key={outfit.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-white rounded-3xl p-3.5 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 transition-all duration-300"
                      >
                        <div className="relative h-64 w-full rounded-[20px] overflow-hidden bg-sogan-100 mb-3">
                          <Image
                            src={outfit.imageUrl}
                            alt={outfit.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 260px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            aria-label={`Hapus ${outfit.title} dari favorit`}
                            onClick={() => toggleOutfit(outfit.id)}
                            className="absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md bg-emas text-sogan-900 shadow-[0_4px_14px_rgba(212,175,55,0.45)] cursor-pointer"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="currentColor"
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
                          </button>
                        </div>
                        <div className="px-1.5 pb-1">
                          <Badge variant="gold" className="mb-1.5">
                            {categoryLabelMap[outfit.category]}
                          </Badge>
                          <h3 className="font-serif font-bold text-sogan-900 text-sm leading-snug line-clamp-1">
                            {outfit.title}
                          </h3>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty-search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-sogan-200/80 max-w-md mx-auto p-8"
            >
              <p className="text-sogan-600 text-base font-serif font-bold mb-1">
                Tidak Ditemukan
              </p>
              <p className="text-sogan-400 text-xs mb-5">
                Tidak ada data yang sesuai dengan kata kunci pencarian Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCat("Semua");
                  setFavFilter("semua");
                }}
                className="px-6 py-2 rounded-full border border-sogan-300 text-sogan-800 text-xs font-bold hover:bg-sogan-100 transition-colors cursor-pointer"
              >
                Reset Pencarian
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}


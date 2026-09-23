"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOTIF_DATA } from "@/lib/constants/mockData";
import { MotifGridCard } from "@/features/education/components/MotifGridCard";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import Link from "next/link";

const CATEGORIES = ["Semua", ...Array.from(new Set(MOTIF_DATA.map((m) => m.category)))];

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<"katalog" | "favorit">("katalog");
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua");

  const favoriteMotifIds = useFavoriteStore((s) => s.favoriteMotifIds);

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
            onClick={() => setActiveTab("katalog")}
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
            onClick={() => setActiveTab("favorit")}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "favorit"
                ? "bg-sogan-800 text-ivory shadow-xs"
                : "text-sogan-600 hover:text-sogan-900"
            }`}
          >
            Koleksi Favorit
            {favoriteMotifIds.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === "favorit"
                    ? "bg-emas text-sogan-900"
                    : "bg-sogan-100 text-sogan-800"
                }`}
              >
                {favoriteMotifIds.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── FILTER & SEARCH BAR (Pinterest Aesthetic) ──────────────── */}
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
              placeholder="Cari nama motif, teknik tenun, atau filosofi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-sogan-50/80 border-none rounded-full focus:ring-2 focus:ring-emas text-sogan-900 placeholder:text-sogan-400 text-xs sm:text-sm font-medium outline-none"
            />
          </div>

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
        </div>
      </section>

      {/* ── GRID MOTIF BENTO / MASONRY ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
        <AnimatePresence mode="wait">
          {filteredMotifs.length > 0 ? (
            <motion.div
              key={`${activeTab}-content`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMotifs.map((motif, idx) => (
                <MotifGridCard key={motif.id} motif={motif} index={idx} />
              ))}
            </motion.div>
          ) : activeTab === "favorit" && favoriteMotifIds.length === 0 ? (
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
                Belum Ada Motif Disimpan
              </h3>
              <p className="text-sogan-500 text-xs sm:text-sm mb-6 leading-relaxed">
                Anda dapat menambahkan motif ke dalam koleksi favorit dengan menekan ikon hati
                saat mengeksplorasi katalog atau setelah memindai wastra dengan AI Scanner.
              </p>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emas text-sogan-900 font-bold text-sm hover:bg-emas-400 transition-colors shadow-[var(--shadow-gold)]"
              >
                Mulai Scan Wastra
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="empty-search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-sogan-200/80 max-w-md mx-auto p-8"
            >
              <p className="text-sogan-600 text-base font-serif font-bold mb-1">
                Motif Tidak Ditemukan
              </p>
              <p className="text-sogan-400 text-xs mb-5">
                Tidak ada motif yang cocok dengan kata kunci atau kategori yang dipilih.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCat("Semua");
                }}
                className="px-6 py-2 rounded-full border border-sogan-300 text-sogan-800 text-xs font-bold hover:bg-sogan-100 transition-colors"
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

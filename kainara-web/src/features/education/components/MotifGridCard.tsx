"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import type { Motif } from "@/types";

interface MotifGridCardProps {
  motif: Motif;
  index: number;
}

export function MotifGridCard({ motif, index }: MotifGridCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/education/${motif.slug}`}
        className="group flex flex-col h-full bg-white rounded-3xl p-4 overflow-hidden shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80 transition-all duration-300 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-emas"
        aria-label={`Pelajari lebih lanjut tentang ${motif.name}`}
      >
        <div className="relative h-56 w-full rounded-[24px] overflow-hidden bg-sogan-100 mb-4">
          <Image
            src={motif.imageUrl}
            alt={`Ilustrasi motif ${motif.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading={index < 4 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sogan-950/70 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3">
            <Badge variant="gold">{motif.category}</Badge>
          </span>
        </div>

        <div className="px-2 pb-2 flex flex-col flex-1 justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-sogan-900 mb-2 group-hover:text-emas-600 transition-colors line-clamp-1">
              {motif.name}
            </h2>
            <p className="text-xs sm:text-sm text-sogan-500 line-clamp-3 mb-4 leading-relaxed">
              {motif.philosophy}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-sogan-100 mt-auto">
            <span className="text-xs font-semibold text-sogan-400">
              {motif.origin}
            </span>
            <div className="flex -space-x-1.5" aria-label="Warna utama motif">
              {motif.colors.slice(0, 3).map((hex, i) => (
                <div
                  key={hex + i}
                  className="size-4.5 rounded-full border-2 border-white ring-1 ring-black/5"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

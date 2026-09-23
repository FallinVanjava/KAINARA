"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "gold" | "sogan" | "indigo" | "merah";
  className?: string;
}

const variantMap: Record<string, string> = {
  gold: "bg-emas/20 text-sogan-900 border border-emas/40 font-semibold",
  sogan: "bg-sogan-100 text-sogan-800 border border-sogan-200/80 font-medium",
  indigo: "bg-batik-indigo/15 text-batik-indigo border border-batik-indigo/25 font-semibold",
  merah: "bg-batik-merah/15 text-batik-merah border border-batik-merah/25 font-semibold",
};

export function Badge({ children, variant = "sogan", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-xs tracking-wide",
        variantMap[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

interface ToastProps {
  message: string;
  show: boolean;
}

export function Toast({ message, show }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-sogan-900 text-ivory text-xs sm:text-sm px-6 py-3 rounded-full shadow-[var(--shadow-ethereal-hover)] border border-emas/30"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/education", label: "Edukasi Motif" },
  { href: "/skintone", label: "Skin Tone" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 max-w-5xl mx-auto px-3 sm:px-6">
      <nav
        className="glass-panel rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[var(--shadow-ethereal)] transition-all duration-300"
        aria-label="Navigasi Utama KAINARA"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-emas-500 rounded-full px-2 py-1"
          aria-label="KAINARA Beranda"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-sogan-800 group-hover:text-emas-600 transition-colors">
            KAINARA
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-1.5 bg-sogan-100/60 p-1 rounded-full border border-sogan-200/50">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-sogan-800 text-ivory shadow-xs"
                      : "text-sogan-600 hover:text-sogan-900 hover:bg-white/60"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/scanner"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emas text-sogan-900 text-xs font-bold tracking-wide hover:bg-emas-400 transition-colors shadow-[0_2px_14px_rgba(212,175,55,0.3)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
            Scan Wastra
          </Link>

          <button
            type="button"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-full text-sogan-700 hover:bg-sogan-100 transition-colors focus-visible:outline-2 focus-visible:outline-emas-500"
          >
            <span className="sr-only">{open ? "Tutup" : "Menu"}</span>
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 p-4 rounded-[24px] glass-panel shadow-[var(--shadow-ethereal)]"
          >
            <ul className="flex flex-col gap-1.5">
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-sogan-800 text-ivory font-semibold"
                          : "text-sogan-700 hover:bg-sogan-100"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  href="/scanner"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-emas text-sogan-900 text-sm font-bold shadow-xs hover:bg-emas-400 transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                  Scan Wastra Sekarang
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

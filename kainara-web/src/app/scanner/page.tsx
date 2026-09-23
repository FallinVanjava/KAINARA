"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WebScannerUI } from "@/features/scanner/components/WebScannerUI";
import { MotifDetailCard } from "@/features/scanner/components/MotifDetailCard";
import { useScanner } from "@/features/scanner/hooks/useScanner";

export default function ScannerPage() {
  const { status, result, error, scan, reset, isScanning, scannedBlob } = useScanner();

  const isUnrecognized = status === "unrecognized";
  const isError = status === "error" && !isScanning;

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
      <header className="mb-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emas/20 text-sogan-900 text-xs font-bold tracking-widest uppercase mb-3 border border-emas/40"
        >
          <span className="size-1.5 rounded-full bg-emas" aria-hidden="true" />
          Didukung Model CNN ResNet50
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-sogan-900 leading-tight"
        >
          Scanner Motif Wastra
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-sogan-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed"
        >
          Foto atau unggah kain batik Lampung Anda. Sistem AI kami akan mengidentifikasi
          nama motif, asal, dan filosofi sakralnya secara instan.
        </motion.p>
      </header>

      <WebScannerUI onCapture={scan} status={status} />

      <AnimatePresence mode="wait">
        {isError && (
          <motion.div
            key="error"
            role="alert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-8 p-6 rounded-3xl bg-red-50/90 border border-red-200 text-center shadow-xs"
          >
            <div className="size-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="font-serif font-bold text-red-900 text-lg mb-1">
              Pemindaian Belum Berhasil
            </p>
            <p className="text-red-700 text-sm max-w-sm mx-auto mb-4">{error}</p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {isUnrecognized && (
          <motion.div
            key="unrecognized"
            role="alert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-8 p-6 rounded-3xl bg-amber-50/90 border border-amber-200 text-center shadow-xs"
          >
            <div className="size-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="font-serif font-bold text-amber-900 text-lg mb-1">
              Motif Belum Dikenali
            </p>
            <p className="text-amber-800 text-sm max-w-md mx-auto leading-relaxed mb-5">
              {error}
            </p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2.5 rounded-full bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-xs"
            >
              Pindai Ulang Foto
            </button>
          </motion.div>
        )}

        {result && !isScanning && !isUnrecognized && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="mt-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="batik-divider flex-1 opacity-40" aria-hidden="true" />
              <span className="text-sogan-500 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Hasil Identifikasi Wastra
              </span>
              <div className="batik-divider flex-1 opacity-40" aria-hidden="true" />
            </div>

            <MotifDetailCard
              result={result}
              onScanAgain={reset}
              originalBlob={scannedBlob}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

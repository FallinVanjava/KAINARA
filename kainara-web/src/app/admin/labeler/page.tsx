"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOTIF_DATA } from "@/lib/constants/mockData";
import { Button } from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface UnlabeledTask {
  filename: string;
  image_base64: string;
  remaining: number;
  ai_guess?: {
    motif_id: string;
    confidence: number;
  };
}

export default function AdminLabelerPage() {
  const [task, setTask] = useState<UnlabeledTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchNextTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/v1/admin/unlabeled`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Gagal mengambil data.");

      if (!data.data) {
        setTask(null);
      } else {
        setTask(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const initFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/v1/admin/unlabeled`);
        const data = await res.json();

        if (!mounted) return;

        if (!res.ok) throw new Error(data.detail || "Gagal mengambil data.");

        if (!data.data) {
          setTask(null);
        } else {
          setTask(data.data);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Terjadi kesalahan server.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initFetch();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLabel = async (motif_id: string) => {
    if (!task) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/v1/admin/label`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: task.filename,
          motif_id: motif_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal memindahkan file.");

      setSuccessMsg(`Berhasil melabeli sebagai ${motif_id}`);
      setTimeout(() => setSuccessMsg(null), 2000);

      fetchNextTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan label.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="size-10 rounded-full border-3 border-sogan-200 border-t-emas animate-spin" />
        <p className="text-sogan-600 font-medium text-sm">Mencari antrean gambar...</p>
      </div>
    );
  }

  if (!task && !loading) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center bg-white p-10 rounded-3xl shadow-[var(--shadow-ethereal)] border border-sogan-200/80">
        <div className="size-20 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-sogan-900 mb-2">Semua Selesai</h2>
        <p className="text-sogan-500 text-sm mb-6">
          Tidak ada lagi foto di folder unlabeled. Dataset Anda sudah siap digunakan untuk pelatihan model AI.
        </p>
        <Button variant="outline" onClick={fetchNextTask}>Cek Lagi</Button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-8 items-start">
      {/* KIRI: Area Foto & AI Guess */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-ethereal)] border border-sogan-200/80">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-serif font-bold text-xl text-sogan-900">Tugas Labeling</h2>
            <span className="bg-emas/20 text-sogan-900 px-3.5 py-1 rounded-full text-xs font-bold border border-emas/40 font-mono">
              Sisa Antrean: {task?.remaining}
            </span>
          </div>

          <div className="relative w-full aspect-square bg-sogan-950 rounded-[24px] overflow-hidden shadow-inner flex items-center justify-center">
            {task && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={task.image_base64}
                alt="Unlabeled wastra"
                className="w-full h-full object-contain"
              />
            )}

            <AnimatePresence>
              {submitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="size-8 rounded-full border-3 border-sogan-200 border-t-emas animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 p-4 bg-sogan-50 rounded-[20px] border border-sogan-200/80">
            <p className="text-xs text-sogan-500 font-bold uppercase tracking-wider mb-1">
              Tebakan Awal AI (Model Saat Ini):
            </p>
            {task?.ai_guess ? (
              <p className="text-sogan-900 font-serif font-bold text-lg">
                {MOTIF_DATA.find((m) => m.id === task!.ai_guess!.motif_id)?.name || task.ai_guess.motif_id}
                <span className="text-emas-600 text-sm ml-2 font-mono">
                  ({(task.ai_guess.confidence * 100).toFixed(1)}%)
                </span>
              </p>
            ) : (
              <p className="text-sogan-400 italic text-sm">AI belum dilatih untuk gambar ini.</p>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 text-red-600 bg-red-50 p-3.5 rounded-full text-xs text-center"
              >
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 text-emerald-800 bg-emerald-50 border border-emerald-200 p-3.5 rounded-full text-xs text-center font-semibold"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* KANAN: Visual Dictionary & Action Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-ethereal)] border border-sogan-200/80">
          <h2 className="font-serif font-bold text-xl text-sogan-900 mb-2">Pilih Motif yang Tepat</h2>
          <p className="text-sogan-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Cocokkan foto di sebelah kiri dengan motif visual di bawah ini. File akan dipindahkan secara otomatis ke folder dataset pelatihan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {MOTIF_DATA.map((m) => (
              <button
                key={m.id}
                onClick={() => handleLabel(m.id)}
                disabled={submitting}
                className="group flex items-center gap-3 p-3 rounded-[20px] border border-sogan-200/80 hover:border-emas hover:bg-sogan-50 transition-all text-left disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <div className="size-12 rounded-[14px] bg-sogan-100 overflow-hidden flex-shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sogan-900 text-xs sm:text-sm truncate">{m.name}</p>
                  <p className="text-[11px] text-sogan-400 truncate">{m.category}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-sogan-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => fetchNextTask()}
            >
              Lewati Gambar Ini
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

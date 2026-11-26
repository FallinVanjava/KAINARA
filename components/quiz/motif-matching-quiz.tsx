'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, RotateCcw, X } from 'lucide-react';

export interface MatchingMotif {
  id: string;
  nama: string;
  gambar_url: string | null;
  daerah_asal: string | null;
}

interface MotifMatchingQuizProps {
  motifs: MatchingMotif[];
}

interface Point {
  x: number;
  y: number;
}

export function MotifMatchingQuiz({ motifs }: MotifMatchingQuizProps) {
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);
  const [result, setResult] = useState(false);
  const [points, setPoints] = useState<Record<string, { from: Point; to: Point }>>({});
  const canvasRef = useRef<HTMLDivElement>(null);

  // Urutan nama tetap (bukan acak) supaya tidak ada hydration mismatch.
  const shuffled = [...motifs].reverse();
  const connectedCount = Object.keys(connections).length;
  const score = motifs.reduce((total, motif) => total + (connections[motif.id] === motif.id ? 1 : 0), 0);

  const measure = useCallback(() => {
    const root = canvasRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const next: Record<string, { from: Point; to: Point }> = {};

    for (const motif of motifs) {
      const fromEl = root.querySelector<HTMLElement>(`[data-anchor-from="${motif.id}"]`);
      const nameId = connections[motif.id];
      const toEl = nameId ? root.querySelector<HTMLElement>(`[data-anchor-to="${nameId}"]`) : null;
      if (!fromEl || !toEl) continue;
      const a = fromEl.getBoundingClientRect();
      const b = toEl.getBoundingClientRect();
      next[motif.id] = {
        from: { x: a.left + a.width / 2 - rootRect.left, y: a.top + a.height / 2 - rootRect.top },
        to: { x: b.left + b.width / 2 - rootRect.left, y: b.top + b.height / 2 - rootRect.top },
      };
    }
    setPoints(next);
  }, [connections, motifs]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  const connect = (motifId: string, nameId: string) => {
    if (result) return;
    if (Object.values(connections).includes(nameId)) return;
    setConnections((previous) => ({ ...previous, [motifId]: nameId }));
    setSelectedMotif(null);
  };

  const handleMotifClick = (motifId: string) => {
    if (result) return;
    setSelectedMotif((previous) => (previous === motifId ? null : motifId));
  };

  const handleNameClick = (nameId: string) => {
    if (result) return;
    if (!selectedMotif) return;
    connect(selectedMotif, nameId);
  };

  const disconnect = (motifId: string) => {
    if (result) return;
    setConnections((previous) => {
      const next = { ...previous };
      delete next[motifId];
      return next;
    });
  };

  const finish = () => {
    setResult(true);
  };

  const reset = () => {
    setConnections({});
    setSelectedMotif(null);
    setResult(false);
  };

  const path = (from: Point, to: Point) => {
    const dx = Math.max(48, Math.abs(to.x - from.x) * 0.45);
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex min-h-10 items-center rounded-full border border-[#E8DDD0] bg-[#FEFEFE] px-4 text-sm font-semibold text-[#6D0F0F]">
          {connectedCount} dari {motifs.length} Motif Terhubung
        </span>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#E8DDD0] bg-[#FEFEFE] px-4 text-sm font-semibold text-[#5C534E] transition-colors hover:border-[#C8A84B] hover:text-[#6D0F0F]"
        >
          <RotateCcw className="size-4" /> Atur Ulang
        </button>
      </div>

      <p className="text-sm text-[#5C534E]">
        Pilih gambar motif, lalu pilih nama motif yang sesuai. Tekan garis untuk melepas sambungan.
      </p>

      <div ref={canvasRef} className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-16">
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" aria-hidden="true">
          {Object.entries(points).map(([motifId, { from, to }]) => {
            const correct = connections[motifId] === motifId;
            const color = result ? (correct ? '#2F6B3F' : '#B3261E') : '#6D0F0F';
            return (
              <g key={motifId}>
                <path d={path(from, to)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
                <circle cx={to.x} cy={to.y} r="4" fill={color} />
              </g>
            );
          })}
        </svg>

        <div className="space-y-3">
          {motifs.map((motif) => {
            const connected = Boolean(connections[motif.id]);
            const correct = connections[motif.id] === motif.id;
            return (
              <div
                key={motif.id}
                className={`flex min-h-[104px] items-center gap-4 rounded-2xl border bg-[#FEFEFE] p-3 transition-colors ${
                  selectedMotif === motif.id ? 'border-[#C8A84B] ring-2 ring-[#C8A84B]/30' : 'border-[#E8DDD0]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleMotifClick(motif.id)}
                  aria-pressed={selectedMotif === motif.id}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#F7EFE5]">
                    {motif.gambar_url ? (
                      <Image src={motif.gambar_url} alt={`Motif ${motif.nama}`} fill sizes="80px" className="object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center font-heading text-2xl text-[#6D0F0F]">
                        {motif.nama.slice(0, 1)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#5C534E]">{motif.daerah_asal || 'Lampung'}</span>
                </button>

                <button
                  type="button"
                  data-anchor-from={motif.id}
                  onClick={() => (connected ? disconnect(motif.id) : handleMotifClick(motif.id))}
                  aria-label={connected ? `Lepas sambungan motif ${motif.nama}` : `Pilih motif ${motif.nama}`}
                  aria-pressed={selectedMotif === motif.id}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    result && connected
                      ? correct
                        ? 'border-[#2F6B3F] bg-[#2F6B3F] text-white'
                        : 'border-[#B3261E] bg-[#B3261E] text-white'
                      : selectedMotif === motif.id
                        ? 'border-[#6D0F0F] bg-[#6D0F0F] text-white'
                        : 'border-[#C8A84B] bg-[#FCF8F3] text-[#6D0F0F]'
                  }`}
                >
                  {connected ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {shuffled.map((motif, idx) => {
            const used = Object.values(connections).includes(motif.id);
            return (
              <div
                key={motif.id}
                className={`flex min-h-[104px] items-center gap-4 rounded-2xl border bg-[#FEFEFE] p-4 transition-colors ${
                  selectedMotif && !used ? 'border-[#E8DDD0] hover:border-[#C8A84B]' : 'border-[#E8DDD0]'
                }`}
              >
                <button
                  type="button"
                  data-anchor-to={motif.id}
                  onClick={() => (used ? undefined : handleNameClick(motif.id))}
                  aria-label={`Hubungkan ke ${motif.nama}`}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    used ? 'border-[#C8A84B] bg-[#C8A84B] text-[#2D1810]' : 'border-[#C8A84B] bg-[#FCF8F3] text-[#6D0F0F]'
                  }`}
                >
                  <span className="size-2 rounded-full bg-current" />
                </button>
                <button
                  type="button"
                  onClick={() => (used ? undefined : handleNameClick(motif.id))}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#5C534E]">Motif {idx + 1}</span>
                  <span className="mt-1 block font-heading text-lg font-semibold text-[#2D1810]">{motif.nama}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={finish}
          disabled={connectedCount < motifs.length || result}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#6D0F0F] px-10 text-sm font-semibold text-white transition-colors hover:bg-[#540B0B] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Selesai
        </button>

        {result && (
          <div role="dialog" aria-modal="true" aria-label="Hasil kuis" className="w-full rounded-3xl border border-[#E8DDD0] bg-[#FEFEFE] p-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C534E]">Skor Anda</span>
            <p className="mt-1 font-heading text-4xl font-bold text-[#6D0F0F]">
              {Math.round((score / motifs.length) * 100)} / 100
            </p>

            <ul className="mx-auto mt-6 max-w-lg space-y-2 text-left">
              {motifs.map((motif) => {
                const correct = connections[motif.id] === motif.id;
                return (
                  <li key={motif.id} className="flex items-center gap-3 rounded-xl border border-[#E8DDD0] px-4 py-2 text-sm">
                    {correct ? (
                      <Check className="size-4 shrink-0 text-[#2F6B3F]" aria-label="Benar" />
                    ) : (
                      <X className="size-4 shrink-0 text-[#B3261E]" aria-label="Salah" />
                    )}
                    <span className="text-[#2D1810]">{motif.nama}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#5C534E]">
              {score === motifs.length
                ? 'Semua motif terhubung dengan tepat. Setiap ragam tapis membawa kisah dan makna budaya Lampung.'
                : 'Pelajari kembali nama motif dan daerah asalnya melalui katalog KAINARA.'}
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#6D0F0F] px-6 text-sm font-semibold text-white hover:bg-[#540B0B]"
            >
              Ulangi Kuis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

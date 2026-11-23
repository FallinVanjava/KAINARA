'use client';

import { useReducer, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Share2,
  BookOpen,
  Award,
} from 'lucide-react';
import type { QuizQuestionWithMotif } from '@/lib/queries/quiz';
import { submitQuizAttempt } from '@/app/actions/quiz';

interface QuizInteractiveProps {
  questions: QuizQuestionWithMotif[];
}

type QuizStatus = 'start' | 'question' | 'result';

interface WrongMotif {
  id: string;
  nama: string;
  slug: string;
}

interface QuizState {
  status: QuizStatus;
  currentIndex: number;
  selectedAnswer: number | null;
  isAnswerSubmitted: boolean;
  score: number;
  wrongMotifs: WrongMotif[];
  hasSavedAttempt: boolean;
}

type QuizAction =
  | { type: 'START' }
  | { type: 'SELECT_OPTION'; optionIndex: number; correctAnswerIndex: number; motif: WrongMotif | null }
  | { type: 'NEXT_QUESTION'; totalQuestions: number }
  | { type: 'RESET' }
  | { type: 'MARK_SAVED' };

const initialState: QuizState = {
  status: 'start',
  currentIndex: 0,
  selectedAnswer: null,
  isAnswerSubmitted: false,
  score: 0,
  wrongMotifs: [],
  hasSavedAttempt: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return {
        ...initialState,
        status: 'question',
      };

    case 'SELECT_OPTION': {
      if (state.isAnswerSubmitted) return state;

      const isCorrect = action.optionIndex === action.correctAnswerIndex;
      const nextWrongMotifs = [...state.wrongMotifs];

      if (!isCorrect && action.motif) {
        const alreadyExists = nextWrongMotifs.some((m) => m.id === action.motif?.id);
        if (!alreadyExists) {
          nextWrongMotifs.push(action.motif);
        }
      }

      return {
        ...state,
        selectedAnswer: action.optionIndex,
        isAnswerSubmitted: true,
        score: isCorrect ? state.score + 1 : state.score,
        wrongMotifs: nextWrongMotifs,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= action.totalQuestions) {
        return {
          ...state,
          status: 'result',
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selectedAnswer: null,
        isAnswerSubmitted: false,
      };
    }

    case 'RESET':
      return {
        ...initialState,
        status: 'start',
      };

    case 'MARK_SAVED':
      return {
        ...state,
        hasSavedAttempt: true,
      };

    default:
      return state;
  }
}

export function QuizInteractive({ questions }: QuizInteractiveProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [, startTransition] = useTransition();

  const totalQuestions = questions.length;
  const currentQuestion = questions[state.currentIndex];

  // Pastikan opsi berupa array string
  const rawOptions = currentQuestion?.opsi;
  const options: string[] = Array.isArray(rawOptions)
    ? (rawOptions as string[])
    : typeof rawOptions === 'string'
      ? JSON.parse(rawOptions)
      : [];

  const correctAnswer = currentQuestion?.jawaban_benar ?? 0;

  // Evaluasi level kecakapan
  const scorePercent = totalQuestions > 0 ? Math.round((state.score / totalQuestions) * 100) : 0;
  let levelBadge = 'Pemula Tapis';
  let levelColor = 'bg-[#F5E9DC] text-[#7A1212] border-[#E8D8C8] dark:bg-[#3A1D1E] dark:text-[#E8C36A]';
  let levelBlurb = 'Kamu baru memulai langkah mengenal budaya tapis Lampung. Terus pelajari kekayaan motifnya!';

  if (scorePercent >= 90) {
    levelBadge = 'Pakar Tapis';
    levelColor = 'bg-[#7A1212] text-[#E8C36A] border-[#96640F]';
    levelBlurb = 'Luar biasa! Pengetahuanmu tentang kain tapis, sejarah, dan filosofinya setingkat pegiat budaya!';
  } else if (scorePercent >= 70) {
    levelBadge = 'Pegiat Tapis';
    levelColor = 'bg-[#96640F] text-[#FFF8F0] border-[#E8C36A]';
    levelBlurb = 'Hebat! Kamu menguasai sebagian besar filosofi dan ragam hias kain tapis khas Lampung.';
  } else if (scorePercent >= 40) {
    levelBadge = 'Penikmat Tapis';
    levelColor = 'bg-[#F5E9DC] text-[#5E0F11] border-[#E8D8C8] dark:bg-[#3A1D1E] dark:text-[#F6E9DC]';
    levelBlurb = 'Cukup baik! Kamu sudah mengenali dasar-dasar tapis, masih banyak keunikan motif yang bisa kamu temukan.';
  }

  // Rekam percobaan kuis ke database saat masuk layar hasil
  useEffect(() => {
    if (state.status === 'result' && !state.hasSavedAttempt && totalQuestions > 0) {
      dispatch({ type: 'MARK_SAVED' });
      startTransition(async () => {
        const res = await submitQuizAttempt(state.score, totalQuestions);
        if (res.success) {
          toast.success('Hasil kuis tersimpan.');
        } else {
          toast.error('Hasil kuis tampil, tetapi tidak tersimpan ke riwayat.');
          console.warn('Percobaan kuis tidak tersimpan ke riwayat:', res.error);
        }
      });
    }
  }, [state.status, state.hasSavedAttempt, state.score, totalQuestions]);

  // Handler memilih jawaban
  const handleSelect = useCallback(
    (idx: number) => {
      if (state.isAnswerSubmitted || !currentQuestion) return;

      const motifInfo: WrongMotif | null = currentQuestion.motif
        ? {
            id: currentQuestion.motif.id,
            nama: currentQuestion.motif.nama,
            slug: currentQuestion.motif.slug,
          }
        : null;

      dispatch({
        type: 'SELECT_OPTION',
        optionIndex: idx,
        correctAnswerIndex: correctAnswer,
        motif: motifInfo,
      });
    },
    [state.isAnswerSubmitted, currentQuestion, correctAnswer]
  );

  // Keyboard navigation (angka 1-4 memilih opsi, Enter untuk lanjut)
  useEffect(() => {
    if (state.status !== 'question') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isAnswerSubmitted) {
        const keyNumber = parseInt(e.key, 10);
        if (keyNumber >= 1 && keyNumber <= options.length) {
          handleSelect(keyNumber - 1);
        }
      } else {
        if (e.key === 'Enter') {
          dispatch({ type: 'NEXT_QUESTION', totalQuestions });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, state.isAnswerSubmitted, options.length, totalQuestions, handleSelect]);

  // Handler berbagi skor
  const handleShare = async () => {
    const text = `Saya baru saja menyelesaikan Kuis Tapis Lampung di Kainara dengan skor ${state.score}/${totalQuestions} (Tingkat ${levelBadge})! Coba uji pengetahuanmu di:`;
    const url = typeof window !== 'undefined' ? window.location.href : 'https://kainara.id/kuis';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hasil Kuis Tapis Lampung - Kainara',
          text,
          url,
        });
      } catch {
        // dibatalkan pengguna
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success('Tautan dan skor berhasil disalin ke clipboard!');
      } catch {
        toast.error('Gagal menyalin tautan');
      }
    }
  };

  // Keadaan bila soal kosong di database
  if (totalQuestions === 0) {
    return (
      <div className="rounded-2xl border border-dotted border-[#E8D8C8] bg-white p-12 text-center dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <h3 className="font-heading text-xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Soal Kuis Sedang Dipersiapkan
        </h3>
        <p className="mt-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
          Belum ada pertanyaan kuis yang diterbitkan. Silakan periksa kembali nanti.
        </p>
        <div className="mt-6">
          <Link
            href="/motif"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#7A1212] px-6 text-sm font-semibold text-[#FFF8F0] transition-colors hover:bg-[#5E0F11]"
          >
            Jelajahi Katalog Motif
          </Link>
        </div>
      </div>
    );
  }

  // 1. LAYAR MULAI
  if (state.status === 'start') {
    return (
      <div className="rounded-[24px] border border-[#E8D8C8] bg-white p-8 sm:p-14 shadow-md text-center max-w-2xl mx-auto dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <div className="size-16 rounded-full bg-[#FFF8F0] text-[#7A1212] mx-auto flex items-center justify-center shadow-xs mb-6 dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
          <Sparkles className="size-8 stroke-[1.75]" />
        </div>

        <span className="inline-block rounded-full bg-[#F5E9DC] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A] mb-3">
          {totalQuestions} Pertanyaan Acak
        </span>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Kuis Tapis Lampung
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed max-w-lg mx-auto">
          Uji wawasanmu seputar makna simbolik, teknik sulaman emas, dan sejarah adat kain tapis tradisional Lampung.
        </p>

        <div className="mt-8 pt-4 border-t border-dotted border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
          <button
            type="button"
            onClick={() => dispatch({ type: 'START' })}
            className="inline-flex h-13 w-full sm:w-auto min-w-[220px] items-center justify-center rounded-full bg-[#7A1212] px-8 text-base font-bold text-[#FFF8F0] shadow-sm transition-all hover:bg-[#5E0F11] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F] focus-visible:ring-offset-2 active:scale-95"
          >
            Mulai Kuis Sekarang
          </button>
          <p className="mt-3 text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
            Tip: Kamu dapat menggunakan angka keyboard 1–4 untuk memilih jawaban secara cepat.
          </p>
        </div>
      </div>
    );
  }

  // 2. LAYAR SOAL
  if (state.status === 'question') {
    const progressPercent = ((state.currentIndex + 1) / totalQuestions) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Bar & Indikator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5]">
            <span>
              Soal <strong className="text-[#5E0F11] dark:text-[#F6E9DC]">{state.currentIndex + 1}</strong> dari{' '}
              {totalQuestions}
            </span>
            <span>Skor Sementara: {state.score}</span>
          </div>

          <div className="h-2 w-full rounded-full bg-[#F5E9DC] dark:bg-[#3A1D1E] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#7A1212] transition-all duration-300 dark:bg-[#E8C36A]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Kartu Pertanyaan */}
        <div className="rounded-[24px] border border-[#E8D8C8] bg-white p-6 sm:p-8 shadow-sm space-y-6 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
              Pertanyaan Kebudayaan
            </span>
            <h2 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC] leading-snug">
              {currentQuestion.pertanyaan}
            </h2>
          </div>

          {/* Deretan Tombol Pilihan Opsi */}
          <div className="space-y-3 pt-2">
            {options.map((optionText, idx) => {
              const isSelected = state.selectedAnswer === idx;
              const isCorrectOption = idx === correctAnswer;

              let buttonStyle =
                'border-[#E8D8C8] bg-[#FFF8F0] text-[#5E0F11] hover:bg-[#F5E9DC] hover:border-[#96640F] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC] dark:hover:bg-[#4A2426]';

              if (state.isAnswerSubmitted) {
                if (isCorrectOption) {
                  buttonStyle =
                    'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold dark:bg-emerald-950/60 dark:border-emerald-500 dark:text-emerald-100 ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle =
                    'border-rose-600 bg-rose-50 text-rose-950 font-semibold dark:bg-rose-950/60 dark:border-rose-500 dark:text-rose-100 ring-2 ring-rose-500/30';
                } else {
                  buttonStyle =
                    'border-[#E8D8C8]/60 bg-gray-50 text-[#7A3A3A] opacity-50 dark:bg-[#220E0F] dark:text-[#D9C3B5] dark:border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={state.isAnswerSubmitted}
                  onClick={() => handleSelect(idx)}
                  className={`flex min-h-[56px] w-full items-center justify-between gap-4 rounded-2xl border px-5 py-3.5 text-left text-sm sm:text-base transition-all ${buttonStyle} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F]`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-bold dark:bg-white/10">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{optionText}</span>
                  </div>

                  {state.isAnswerSubmitted && (
                    <div className="shrink-0">
                      {isCorrectOption ? (
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="size-5 text-rose-600 dark:text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kotak Umpan Balik & Penjelasan */}
          {state.isAnswerSubmitted && (
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                state.selectedAnswer === correctAnswer
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {state.selectedAnswer === correctAnswer ? (
                  <>
                    <CheckCircle2 className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Jawaban Benar!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4.5 text-rose-600 dark:text-rose-400" />
                    <span>Jawaban Belum Tepat</span>
                  </>
                )}
              </div>

              {currentQuestion.penjelasan && (
                <p className="mt-2 text-xs sm:text-sm leading-relaxed opacity-90">
                  {currentQuestion.penjelasan}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
                <button
                  type="button"
                  autoFocus
                  onClick={() => dispatch({ type: 'NEXT_QUESTION', totalQuestions })}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7A1212] px-6 text-xs sm:text-sm font-bold text-[#FFF8F0] shadow-sm transition-all hover:bg-[#5E0F11] dark:bg-[#8F1A1A] dark:hover:bg-[#7A1212]"
                >
                  <span>
                    {state.currentIndex + 1 < totalQuestions
                      ? 'Soal Berikutnya'
                      : 'Lihat Hasil Kuis'}
                  </span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. LAYAR HASIL
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="rounded-[24px] border border-[#E8D8C8] bg-white p-8 sm:p-12 text-center shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-6">
        <div className="size-16 rounded-full bg-[#FFF8F0] text-[#96640F] mx-auto flex items-center justify-center shadow-xs dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
          <Award className="size-8 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A3A3A] dark:text-[#D9C3B5]">
            Hasil Akhir Kuis
          </span>
          <div className="font-heading text-5xl sm:text-6xl font-extrabold text-[#7A1212] dark:text-[#E8C36A]">
            {state.score}{' '}
            <span className="text-2xl sm:text-3xl font-medium text-[#7A3A3A] dark:text-[#D9C3B5]">
              / {totalQuestions}
            </span>
          </div>
          <div className="pt-2">
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold border shadow-xs ${levelColor}`}
            >
              Tingkat: {levelBadge}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed max-w-md mx-auto">
          {levelBlurb}
        </p>

        {/* Tombol Aksi */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET' })}
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#7A1212] px-7 text-sm font-bold text-[#FFF8F0] transition-colors hover:bg-[#5E0F11]"
          >
            <RotateCcw className="size-4" /> Ulangi Kuis
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#E8D8C8] bg-white px-7 text-sm font-semibold text-[#5E0F11] transition-colors hover:bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
          >
            <Share2 className="size-4" /> Bagikan Hasil
          </button>
        </div>
      </div>

      {/* Rekomendasi Motif Terkait dari Soal yang Salah */}
      {state.wrongMotifs.length > 0 && (
        <div className="rounded-[24px] border border-dotted border-[#E8D8C8] bg-[#FFF8F0] p-6 sm:p-8 dark:bg-[#1B0E0E] dark:border-[rgba(246,233,220,0.16)] space-y-4">
          <div className="flex items-center gap-2 text-[#7A1212] dark:text-[#E8C36A]">
            <BookOpen className="size-5" />
            <h3 className="font-heading text-lg font-bold">
              Pelajari Motif yang Belum Kamu Kuasai
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
            Kamu belum menjawab tepat beberapa soal terkait motif di bawah ini. Pelajari makna dan filosofinya untuk memperkaya wawasan:
          </p>

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            {state.wrongMotifs.map((motif) => (
              <Link
                key={motif.id}
                href={`/motif/${motif.slug}`}
                className="group flex items-center justify-between rounded-xl border border-[#E8D8C8] bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]"
              >
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#5E0F11] group-hover:text-[#96640F] transition-colors dark:text-[#F6E9DC] dark:group-hover:text-[#E8C36A]">
                    Motif {motif.nama}
                  </h4>
                  <span className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                    Buka ensiklopedia motif →
                  </span>
                </div>
                <ArrowRight className="size-4 text-[#7A3A3A] group-hover:text-[#96640F] group-hover:translate-x-1 transition-all dark:text-[#D9C3B5]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

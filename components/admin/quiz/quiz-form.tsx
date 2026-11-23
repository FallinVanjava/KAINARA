'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { quizAdminSchema, type QuizAdminInput } from '@/lib/validators/quiz-admin';
import { saveQuizQuestion } from '@/app/actions/quiz-admin';
import type { QuizQuestion } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface QuizFormProps {
  initialData?: QuizQuestion | null;
  availableMotifs: Array<{ id: string; nama: string; slug: string }>;
}

export function QuizForm({ initialData, availableMotifs }: QuizFormProps) {
  const router = useRouter();
  const [isSaving, startSave] = useTransition();

  // Parse raw options jika berupa string JSON
  const rawOpsi = initialData?.opsi;
  const parsedOpsi: string[] = Array.isArray(rawOpsi)
    ? (rawOpsi as string[])
    : typeof rawOpsi === 'string'
      ? JSON.parse(rawOpsi)
      : ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'];

  const defaultValues: QuizAdminInput = {
    id: initialData?.id,
    pertanyaan: initialData?.pertanyaan || '',
    opsi: parsedOpsi.length >= 2 ? parsedOpsi : ['', ''],
    jawaban_benar: initialData?.jawaban_benar ?? 0,
    penjelasan: initialData?.penjelasan || '',
    motif_id: initialData?.motif_id || null,
    is_published: initialData?.is_published ?? true,
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuizAdminInput>({
    resolver: zodResolver(quizAdminSchema),
    defaultValues,
  });

  const currentPertanyaan = useWatch({ control, name: 'pertanyaan' }) || '';
  const currentOpsi = useWatch({ control, name: 'opsi' }) || [];
  const currentJawabanBenar = useWatch({ control, name: 'jawaban_benar' }) ?? 0;
  const currentPenjelasan = useWatch({ control, name: 'penjelasan' });
  const currentPublished = useWatch({ control, name: 'is_published' });
  const currentMotifId = useWatch({ control, name: 'motif_id' });

  // Tambah opsi jawaban (maksimal 6)
  const handleAddOption = () => {
    if (currentOpsi.length < 6) {
      setValue('opsi', [...currentOpsi, '']);
    }
  };

  // Hapus opsi jawaban dengan penyesuaian aman indeks jawaban_benar
  const handleRemoveOption = (indexToRemove: number) => {
    if (currentOpsi.length <= 2) {
      toast.error('Minimal harus ada 2 pilihan jawaban');
      return;
    }

    const nextOptions = currentOpsi.filter((_, idx) => idx !== indexToRemove);
    setValue('opsi', nextOptions);

    // Penyesuaian indeks jawaban_benar:
    if (currentJawabanBenar === indexToRemove) {
      setValue('jawaban_benar', 0);
    } else if (currentJawabanBenar > indexToRemove) {
      setValue('jawaban_benar', currentJawabanBenar - 1);
    }
  };

  const onSubmit = (data: QuizAdminInput) => {
    startSave(async () => {
      const res = await saveQuizQuestion(data);
      if (res.success) {
        toast.success(
          initialData ? 'Soal kuis berhasil diperbarui' : 'Soal kuis baru berhasil ditambahkan'
        );
        router.push('/admin/kuis');
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal menyimpan pertanyaan kuis');
      }
    });
  };

  const selectedMotifObj = availableMotifs.find((m) => m.id === currentMotifId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
      {/* Header Form */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E8D8C8] pb-4 dark:border-[rgba(246,233,220,0.16)]">
        <div>
          <Link
            href="/admin/kuis"
            className="inline-flex items-center gap-1.5 text-xs text-[#7A3A3A] hover:text-[#5E0F11] transition-colors dark:text-[#D9C3B5] dark:hover:text-[#F6E9DC] mb-1"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke Bank Soal
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            {initialData ? 'Ubah Pertanyaan Kuis' : 'Tambah Pertanyaan Kuis Baru'}
          </h1>
        </div>

        {/* Toggle Terbitkan Langsung */}
        <div className="flex items-center gap-3 rounded-xl border border-[#E8D8C8] bg-white px-4 py-2 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <Label htmlFor="is_published" className="text-xs font-semibold cursor-pointer">
            {currentPublished ? 'Status: Terbit' : 'Status: Draf'}
          </Label>
          <Switch
            id="is_published"
            checked={currentPublished}
            onCheckedChange={(checked) => setValue('is_published', checked)}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Kolom Kiri: Input Form (7 Kolom) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Soal & Motif */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Kalimat Pertanyaan
            </h2>

            {/* Pertanyaan */}
            <div className="space-y-1.5">
              <Label htmlFor="pertanyaan" className="text-xs font-semibold">
                Teks Soal <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="pertanyaan"
                rows={3}
                placeholder="Contoh: Motif tapis yang melambangkan tangga menuju kemuliaan dan keteguhan hati adalah..."
                {...register('pertanyaan')}
                className="rounded-xl border-[#E8D8C8] text-sm leading-relaxed"
              />
              {errors.pertanyaan && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.pertanyaan.message}
                </p>
              )}
            </div>

            {/* Motif Terkait */}
            <div className="space-y-1.5">
              <Label htmlFor="motif_id" className="text-xs font-semibold">
                Motif Terkait (Opsional)
              </Label>
              <select
                id="motif_id"
                value={currentMotifId || ''}
                onChange={(e) => setValue('motif_id', e.target.value || null)}
                className="h-10 w-full rounded-xl border border-[#E8D8C8] bg-white px-3 text-xs text-[#5E0F11] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
              >
                <option value="">-- Tidak Terkait Motif Khusus (Umum) --</option>
                {availableMotifs.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                Bila dikaitkan, pemain yang salah menjawab soal ini akan direkomendasikan membaca motif ini di halaman hasil.
              </p>
            </div>
          </div>

          {/* Card Opsi Jawaban Dinamis (2 - 6 Pilihan) */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                  Pilihan Jawaban (2–6 Opsi)
                </h2>
                <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                  Tandai radio bulat hijau pada pilihan yang merupakan jawaban benar.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentOpsi.length >= 6}
                onClick={handleAddOption}
                className="h-8 gap-1 rounded-full text-xs font-semibold border-[#E8D8C8]"
              >
                <Plus className="size-3.5" /> Tambah Opsi
              </Button>
            </div>

            {errors.opsi && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.opsi.message}
              </p>
            )}

            <div className="space-y-3 pt-2">
              {currentOpsi.map((_, idx) => {
                const isCorrect = currentJawabanBenar === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isCorrect
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600/30 dark:bg-emerald-950/30 dark:border-emerald-700'
                        : 'border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]'
                    }`}
                  >
                    {/* Radio Pemilih Jawaban Benar */}
                    <button
                      type="button"
                      onClick={() => setValue('jawaban_benar', idx)}
                      className={`size-6 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                        isCorrect
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-[#E8D8C8] bg-white hover:border-[#96640F] dark:bg-[#3A1D1E]'
                      }`}
                      title={isCorrect ? 'Jawaban Benar' : 'Jadikan Jawaban Benar'}
                    >
                      {isCorrect && <CheckCircle2 className="size-4 stroke-[2.5]" />}
                    </button>

                    {/* Label Huruf Opsi */}
                    <span className="font-bold text-xs text-[#7A3A3A] dark:text-[#D9C3B5] w-5 text-center">
                      {String.fromCharCode(65 + idx)}
                    </span>

                    {/* Input Teks Pilihan */}
                    <Input
                      placeholder={`Teks pilihan ${String.fromCharCode(65 + idx)}`}
                      {...register(`opsi.${idx}`)}
                      className="h-9 rounded-lg border-[#E8D8C8] text-xs bg-white dark:bg-[#3A1D1E]"
                    />

                    {/* Tombol Hapus Opsi */}
                    <button
                      type="button"
                      disabled={currentOpsi.length <= 2}
                      onClick={() => handleRemoveOption(idx)}
                      className="size-8 rounded-lg flex items-center justify-center text-[#7A3A3A] hover:text-destructive hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none dark:text-[#D9C3B5] dark:hover:bg-rose-950/40"
                      title="Hapus opsi ini"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Penjelasan */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Ulasan & Penjelasan
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="penjelasan" className="text-xs font-semibold">
                Penjelasan Jawaban (Muncul setelah pemain menjawab)
              </Label>
              <Textarea
                id="penjelasan"
                rows={3}
                placeholder="Jelaskan sejarah atau alasan budaya mengapa opsi tersebut merupakan jawaban yang benar..."
                {...register('penjelasan')}
                className="rounded-xl border-[#E8D8C8] text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pratinjau Kuis Interaktif (5 Kolom) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#96640F] dark:text-[#E8C36A]" />
              <h3 className="font-heading text-sm font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Pratinjau Soal di Web Publik
              </h3>
            </div>

            {/* Kartu Simulasi Kuis */}
            <div className="rounded-[24px] border border-[#E8D8C8] bg-white p-6 shadow-sm space-y-5 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
                  Pertanyaan Kebudayaan {selectedMotifObj ? `• Motif ${selectedMotifObj.nama}` : ''}
                </span>
                <h4 className="mt-1 font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC] leading-snug">
                  {currentPertanyaan || 'Pertanyaan kuis akan ditampilkan di sini...'}
                </h4>
              </div>

              {/* Simulasi Opsi */}
              <div className="space-y-2">
                {currentOpsi.map((optText, i) => {
                  const isCorrect = currentJawabanBenar === i;

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs transition-all ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold dark:bg-emerald-950/40 dark:border-emerald-600 dark:text-emerald-100'
                          : 'border-[#E8D8C8] bg-[#FFF8F0] text-[#5E0F11] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-black/5 text-[10px] font-bold dark:bg-white/10">
                          {i + 1}
                        </span>
                        <span>{optText || `(Opsi ${String.fromCharCode(65 + i)} kosong)`}</span>
                      </div>
                      {isCorrect && (
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 dark:text-emerald-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Simulasi Kotak Ulasan */}
              {currentPenjelasan && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Ulasan Kebudayaan</span>
                  </div>
                  <p className="leading-relaxed opacity-90">{currentPenjelasan}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Simpan Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <Link
          href="/admin/kuis"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#E8D8C8] bg-white px-6 text-xs font-semibold text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
        >
          Batal
        </Link>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-full bg-[#7A1212] px-8 text-xs font-bold text-[#FFF8F0] shadow-sm hover:bg-[#5E0F11] dark:bg-[#8F1A1A]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Menyimpan Soal...
            </>
          ) : (
            'Simpan Pertanyaan Kuis'
          )}
        </Button>
      </div>
    </form>
  );
}

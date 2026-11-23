'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  X,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { motifSchema, type MotifInput } from '@/lib/validators/motif';
import { saveMotif } from '@/app/actions/motif';
import type { Motif, Skintone } from '@/types/database';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface MotifFormProps {
  initialData?: Motif | null;
  initialMatches?: Array<{
    skintone_id: string;
    skor_kecocokan: number;
    catatan: string | null;
  }>;
  availableSkintones: Skintone[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function MotifForm({
  initialData,
  initialMatches = [],
  availableSkintones,
}: MotifFormProps) {
  const router = useRouter();
  const [isSaving, startSave] = useTransition();
  const [tagInput, setTagInput] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData));

  const defaultValues: MotifInput = {
    id: initialData?.id,
    nama: initialData?.nama || '',
    slug: initialData?.slug || '',
    daerah_asal: initialData?.daerah_asal || 'Lampung',
    deskripsi: initialData?.deskripsi || '',
    makna_filosofi: initialData?.makna_filosofi || '',
    sejarah: initialData?.sejarah || '',
    warna_dominan: initialData?.warna_dominan || [],
    gambar_url: initialData?.gambar_url || null,
    is_published: initialData?.is_published ?? false,
    skintone_matches: initialMatches.map((m) => ({
      skintone_id: m.skintone_id,
      skor_kecocokan: m.skor_kecocokan,
      catatan: m.catatan || '',
    })),
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MotifInput>({
    resolver: zodResolver(motifSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skintone_matches',
  });

  const currentWarnaDominan = useWatch({ control, name: 'warna_dominan' }) || [];
  const currentGambarUrl = useWatch({ control, name: 'gambar_url' });
  const currentPublished = useWatch({ control, name: 'is_published' });
  const currentSlug = useWatch({ control, name: 'slug' });

  // Otomatis buat slug saat nama diketik (jika belum diubah manual)
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('nama', val);
    if (!isSlugManual) {
      setValue('slug', slugify(val));
    }
  };

  // Tag warna dominan
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !currentWarnaDominan.includes(trimmed)) {
      setValue('warna_dominan', [...currentWarnaDominan, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setValue(
      'warna_dominan',
      currentWarnaDominan.filter((_, i) => i !== index)
    );
  };

  // Submit form
  const onSubmit = (data: MotifInput) => {
    startSave(async () => {
      const res = await saveMotif(data, initialData?.gambar_url);
      if (res.success) {
        toast.success(
          initialData ? 'Motif berhasil diperbarui' : 'Motif baru berhasil ditambahkan'
        );
        router.push('/admin/motif');
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal menyimpan data motif');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Header Form */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E8D8C8] pb-4 dark:border-[rgba(246,233,220,0.16)]">
        <div>
          <Link
            href="/admin/motif"
            className="inline-flex items-center gap-1.5 text-xs text-[#7A3A3A] hover:text-[#5E0F11] transition-colors dark:text-[#D9C3B5] dark:hover:text-[#F6E9DC] mb-1"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke Daftar Motif
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            {initialData ? `Ubah Motif: ${initialData.nama}` : 'Tambah Motif Baru'}
          </h1>
        </div>

        {/* Toggle Terbitkan Langsung di Header */}
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

      <div className="grid gap-8 md:grid-cols-12">
        {/* Kolom Kiri: Informasi Utama (8 Kolom) */}
        <div className="md:col-span-8 space-y-6">
          {/* Card Identitas Dasar */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Identitas Motif
            </h2>

            {/* Nama Motif */}
            <div className="space-y-1.5">
              <Label htmlFor="nama" className="text-xs font-semibold">
                Nama Motif <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Contoh: Pucuk Rebung"
                {...register('nama', { onChange: handleNamaChange })}
                className="h-10 rounded-xl border-[#E8D8C8] text-sm"
              />
              {errors.nama && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.nama.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug" className="text-xs font-semibold">
                  Slug URL <span className="text-destructive">*</span>
                </Label>
                <span className="text-[10px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                  Digunakan pada tautan: /motif/<strong>{currentSlug || 'slug'}</strong>
                </span>
              </div>
              <Input
                id="slug"
                placeholder="pucuk-rebung"
                {...register('slug', {
                  onChange: () => setIsSlugManual(true),
                })}
                className="h-10 rounded-xl border-[#E8D8C8] text-sm font-mono"
              />
              {errors.slug && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Asal Daerah */}
            <div className="space-y-1.5">
              <Label htmlFor="daerah_asal" className="text-xs font-semibold">
                Asal Daerah
              </Label>
              <Input
                id="daerah_asal"
                placeholder="Contoh: Lampung Selatan, Tulang Bawang, dll."
                {...register('daerah_asal')}
                className="h-10 rounded-xl border-[#E8D8C8] text-sm"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="deskripsi" className="text-xs font-semibold">
                Deskripsi Singkat
              </Label>
              <Textarea
                id="deskripsi"
                rows={3}
                placeholder="Deskripsi tampilan visual dan karakteristik motif tapis ini..."
                {...register('deskripsi')}
                className="rounded-xl border-[#E8D8C8] text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Card Makna Filosofi & Sejarah */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Kandungan Budaya
            </h2>

            {/* Makna Filosofi */}
            <div className="space-y-1.5">
              <Label htmlFor="makna_filosofi" className="text-xs font-semibold">
                Makna dan Filosofi
              </Label>
              <Textarea
                id="makna_filosofi"
                rows={3}
                placeholder="Nilai-nilai luhur dan simbolisme adat dalam motif ini..."
                {...register('makna_filosofi')}
                className="rounded-xl border-[#E8D8C8] text-sm leading-relaxed"
              />
            </div>

            {/* Sejarah */}
            <div className="space-y-1.5">
              <Label htmlFor="sejarah" className="text-xs font-semibold">
                Sejarah dan Asal-Usul
              </Label>
              <Textarea
                id="sejarah"
                rows={3}
                placeholder="Konteks sejarah perajin dan upacara adat di mana motif ini dipakai..."
                {...register('sejarah')}
                className="rounded-xl border-[#E8D8C8] text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Card Editor Kecocokan Skintone */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                  Editor Kecocokan Skintone
                </h2>
                <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                  Tentukan skor keselarasan warna kain dengan rona kulit Nusantara (0–100).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    skintone_id: availableSkintones[0]?.id || '',
                    skor_kecocokan: 85,
                    catatan: '',
                  })
                }
                className="h-8 gap-1 rounded-full text-xs font-semibold border-[#E8D8C8]"
              >
                <Plus className="size-3.5" /> Tambah Baris
              </Button>
            </div>

            {fields.length > 0 ? (
              <div className="space-y-3 pt-2">
                {fields.map((field, index) => {
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl border border-[#E8D8C8] bg-[#FFF8F0] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.12)]"
                    >
                      {/* Dropdown Skintone */}
                      <div className="w-full sm:w-48 shrink-0">
                        <Label className="text-[10px] text-[#7A3A3A] dark:text-[#D9C3B5] mb-1 block">
                          Warna Kulit
                        </Label>
                        <select
                          {...register(`skintone_matches.${index}.skintone_id`)}
                          className="h-9 w-full rounded-lg border border-[#E8D8C8] bg-white px-2.5 text-xs text-[#5E0F11] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
                        >
                          {availableSkintones.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.nama} ({s.undertone})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Input Skor (0-100) */}
                      <div className="w-24 shrink-0">
                        <Label className="text-[10px] text-[#7A3A3A] dark:text-[#D9C3B5] mb-1 block">
                          Skor (0–100)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          {...register(`skintone_matches.${index}.skor_kecocokan`, {
                            valueAsNumber: true,
                          })}
                          className="h-9 rounded-lg border-[#E8D8C8] bg-white text-xs text-center font-bold"
                        />
                      </div>

                      {/* Input Catatan */}
                      <div className="flex-1 w-full min-w-0">
                        <Label className="text-[10px] text-[#7A3A3A] dark:text-[#D9C3B5] mb-1 block">
                          Catatan Keserasian
                        </Label>
                        <Input
                          placeholder="Contoh: Emas menyatu hangat dengan kulit langsat"
                          {...register(`skintone_matches.${index}.catatan`)}
                          className="h-9 rounded-lg border-[#E8D8C8] bg-white text-xs"
                        />
                      </div>

                      {/* Tombol Hapus Baris */}
                      <div className="sm:self-end pb-0.5">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="size-8 rounded-lg flex items-center justify-center text-destructive hover:bg-rose-100 transition-colors dark:hover:bg-rose-950/40"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] italic p-4 rounded-xl border border-dashed border-[#E8D8C8] text-center">
                Belum ada data kecocokan skintone. Klik tombol &quot;Tambah Baris&quot; di atas untuk menambahkan.
              </p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Gambar & Warna Dominan (4 Kolom) */}
        <div className="md:col-span-4 space-y-6">
          {/* Card Unggah Gambar */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Foto Kain Motif
            </h2>

            <ImageUpload
              bucket="motifs"
              value={currentGambarUrl}
              onChange={(url) => setValue('gambar_url', url)}
              prefix={currentSlug || 'motif'}
              label="Foto Motif"
              aspectRatioClass="aspect-[4/5]"
            />
          </div>

          {/* Card Warna Dominan (Input Tag) */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Warna Dominan
            </h2>

            <div className="flex gap-2">
              <Input
                placeholder="Ketik warna (mis. emas)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="h-9 rounded-lg border-[#E8D8C8] text-xs"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddTag}
                className="h-9 rounded-lg bg-[#7A1212] px-3 text-xs font-semibold text-white hover:bg-[#5E0F11]"
              >
                Tambah
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentWarnaDominan.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F5E9DC] px-2.5 py-1 text-xs font-medium text-[#7A1212] capitalize dark:bg-[#3A1D1E] dark:text-[#E8C36A]"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="hover:text-destructive"
                    aria-label={`Hapus warna ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {currentWarnaDominan.length === 0 && (
                <span className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5] italic">
                  Belum ada tag warna ditambahkan.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Simpan Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <Link
          href="/admin/motif"
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
              Menyimpan Motif...
            </>
          ) : (
            'Simpan Data Motif'
          )}
        </Button>
      </div>
    </form>
  );
}

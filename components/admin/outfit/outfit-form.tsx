'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { outfitSchema, type OutfitInput } from '@/lib/validators/outfit';
import { saveOutfit } from '@/app/actions/outfit';
import type { Outfit } from '@/types/database';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface OutfitFormProps {
  initialData?: Outfit | null;
  initialMotifIds?: string[];
  availableMotifs: Array<{ id: string; nama: string; slug: string }>;
}

const KATEGORI_CHOICES = [
  { value: 'adat', label: 'Adat' },
  { value: 'formal', label: 'Formal' },
  { value: 'kasual', label: 'Kasual' },
  { value: 'modern', label: 'Modern' },
] as const;

export function OutfitForm({
  initialData,
  initialMotifIds = [],
  availableMotifs,
}: OutfitFormProps) {
  const router = useRouter();
  const [isSaving, startSave] = useTransition();

  const defaultValues: OutfitInput = {
    id: initialData?.id,
    nama: initialData?.nama || '',
    deskripsi: initialData?.deskripsi || '',
    kategori: (initialData?.kategori as 'adat' | 'formal' | 'kasual' | 'modern') || 'formal',
    warna_utama: initialData?.warna_utama || '',
    gambar_url: initialData?.gambar_url || null,
    is_published: initialData?.is_published ?? true,
    motif_ids: initialMotifIds,
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OutfitInput>({
    resolver: zodResolver(outfitSchema),
    defaultValues,
  });

  const currentGambarUrl = useWatch({ control, name: 'gambar_url' });
  const currentPublished = useWatch({ control, name: 'is_published' });
  const currentMotifIds = useWatch({ control, name: 'motif_ids' }) || [];
  const currentKategori = useWatch({ control, name: 'kategori' });

  const toggleMotifSelection = (motifId: string) => {
    if (currentMotifIds.includes(motifId)) {
      setValue(
        'motif_ids',
        currentMotifIds.filter((id) => id !== motifId)
      );
    } else {
      setValue('motif_ids', [...currentMotifIds, motifId]);
    }
  };

  const onSubmit = (data: OutfitInput) => {
    startSave(async () => {
      const res = await saveOutfit(data, initialData?.gambar_url);
      if (res.success) {
        toast.success(
          initialData ? 'Outfit berhasil diperbarui' : 'Outfit baru berhasil ditambahkan'
        );
        router.push('/admin/outfit');
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal menyimpan outfit');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Header Form */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E8D8C8] pb-4 dark:border-[rgba(246,233,220,0.16)]">
        <div>
          <Link
            href="/admin/outfit"
            className="inline-flex items-center gap-1.5 text-xs text-[#7A3A3A] hover:text-[#5E0F11] transition-colors dark:text-[#D9C3B5] dark:hover:text-[#F6E9DC] mb-1"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke Daftar Outfit
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            {initialData ? `Ubah Outfit: ${initialData.nama}` : 'Tambah Rekomendasi Outfit'}
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
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Rincian Outfit
            </h2>

            {/* Nama Outfit */}
            <div className="space-y-1.5">
              <Label htmlFor="nama" className="text-xs font-semibold">
                Nama Outfit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Contoh: Kebaya Modern Bordir Tapis Emas"
                {...register('nama')}
                className="h-10 rounded-xl border-[#E8D8C8] text-sm"
              />
              {errors.nama && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.nama.message}
                </p>
              )}
            </div>

            {/* Kategori Pilihan */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Kategori Busana <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {KATEGORI_CHOICES.map((choice) => {
                  const isSelected = currentKategori === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => setValue('kategori', choice.value)}
                      className={`flex h-10 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-[#7A1212] bg-[#7A1212] text-[#FFF8F0] shadow-xs dark:border-[#E8C36A] dark:bg-[#8F1A1A]'
                          : 'border-[#E8D8C8] bg-white text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]'
                      }`}
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
              {errors.kategori && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.kategori.message}
                </p>
              )}
            </div>

            {/* Warna Utama */}
            <div className="space-y-1.5">
              <Label htmlFor="warna_utama" className="text-xs font-semibold">
                Warna Utama Busana
              </Label>
              <Input
                id="warna_utama"
                placeholder="Contoh: Marun, Hitam, Emas"
                {...register('warna_utama')}
                className="h-10 rounded-xl border-[#E8D8C8] text-sm"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="deskripsi" className="text-xs font-semibold">
                Deskripsi dan Saran Padu Padan
              </Label>
              <Textarea
                id="deskripsi"
                rows={4}
                placeholder="Jelaskan keserasian outfit ini dengan kain tapis, perhiasan pelengkap, atau acara yang sesuai..."
                {...register('deskripsi')}
                className="rounded-xl border-[#E8D8C8] text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Multi-Pilih Motif Terkait */}
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <div>
              <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                Motif Tapis Terkait
              </h2>
              <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-0.5">
                Pilih motif tapis yang cocok dipadukan dengan busana ini. Data outfit dan motif terkait digunakan oleh aplikasi mobile.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto pr-1">
              {availableMotifs.map((motif) => {
                const isSelected = currentMotifIds.includes(motif.id);
                return (
                  <button
                    key={motif.id}
                    type="button"
                    onClick={() => toggleMotifSelection(motif.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#96640F] bg-[#FFF8F0] text-[#5E0F11] ring-1 ring-[#96640F] dark:bg-[#3A1D1E] dark:text-[#F6E9DC]'
                        : 'border-[#E8D8C8] bg-white text-[#7A3A3A] hover:bg-gray-50 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#D9C3B5]'
                    }`}
                  >
                    <span className="text-xs font-semibold truncate pr-2">
                      {motif.nama}
                    </span>
                    <div
                      className={`size-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#7A1212] border-[#7A1212] text-white dark:bg-[#E8C36A] dark:border-[#E8C36A] dark:text-black'
                          : 'border-[#E8D8C8] bg-white dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.2)]'
                      }`}
                    >
                      {isSelected && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {availableMotifs.length === 0 && (
              <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] italic">
                Belum ada motif terdaftar di database.
              </p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Foto Outfit (4 Kolom) */}
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs space-y-4 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
            <h2 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Foto Outfit
            </h2>

            <ImageUpload
              bucket="outfits"
              value={currentGambarUrl}
              onChange={(url) => setValue('gambar_url', url)}
              prefix="outfit"
              label="Foto Outfit"
              aspectRatioClass="aspect-[3/4]"
            />
          </div>
        </div>
      </div>

      {/* Tombol Simpan Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <Link
          href="/admin/outfit"
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
              Menyimpan Outfit...
            </>
          ) : (
            'Simpan Data Outfit'
          )}
        </Button>
      </div>
    </form>
  );
}

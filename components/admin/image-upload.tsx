'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/app/actions/storage';

interface ImageUploadProps {
  bucket: 'motifs' | 'outfits';
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  prefix?: string;
  label?: string;
  aspectRatioClass?: string;
}

export function ImageUpload({
  bucket,
  value,
  onChange,
  prefix,
  label = 'Foto',
  aspectRatioClass = 'aspect-[4/5]',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran berkas melebihi batas 5 MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (prefix) formData.append('prefix', prefix);

    setIsUploading(true);
    try {
      const res = await uploadImage(formData, bucket);
      if (res.success && res.url) {
        onChange(res.url);
        toast.success(`${label} berhasil diunggah`);
      } else {
        toast.error(res.error || 'Gagal mengunggah gambar');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Pratinjau Gambar */}
      <div
        className={`relative ${aspectRatioClass} w-full rounded-xl overflow-hidden border border-[#E8D8C8] bg-[#F5E9DC] dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)]`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={`Pratinjau ${label}`}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              title="Hapus gambar"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <ImageIcon className="size-10 text-[#7A3A3A]/40 mb-2 dark:text-[#D9C3B5]/40" />
            <span className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
              Belum ada {label.toLowerCase()} terpilih
            </span>
            <span className="text-[10px] text-muted-foreground mt-1">
              JPG, PNG, atau WebP (maks. 5 MB)
            </span>
          </div>
        )}
      </div>

      {/* Tombol Unggah */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-10 gap-2 rounded-xl border-[#E8D8C8] text-xs font-semibold"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengunggah...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              {value ? `Ganti ${label}` : `Pilih & Unggah ${label}`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

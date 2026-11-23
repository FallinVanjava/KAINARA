import { z } from 'zod';

export const outfitSchema = z.object({
  id: z.string().uuid().optional(),
  nama: z
    .string()
    .min(1, 'Nama outfit wajib diisi')
    .max(120, 'Nama outfit maksimal 120 karakter'),
  deskripsi: z.string().optional().nullable(),
  kategori: z.enum(['adat', 'formal', 'kasual', 'modern'], {
    error: 'Kategori harus berupa adat, formal, kasual, atau modern',
  }),
  warna_utama: z.string().optional().nullable(),
  gambar_url: z.string().url('URL gambar tidak valid').optional().nullable(),
  is_published: z.boolean(),
  motif_ids: z.array(z.string().uuid('ID motif tidak valid')),
});

export type OutfitInput = z.infer<typeof outfitSchema>;

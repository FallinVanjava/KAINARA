import { z } from 'zod';

export const skintoneMatchSchema = z.object({
  skintone_id: z.string().uuid('ID skintone tidak valid'),
  skor_kecocokan: z
    .number()
    .min(0, 'Skor minimal 0')
    .max(100, 'Skor maksimal 100'),
  catatan: z.string().optional().nullable(),
});

export const motifSchema = z.object({
  id: z.string().uuid().optional(),
  nama: z
    .string()
    .min(1, 'Nama motif wajib diisi')
    .max(100, 'Nama motif maksimal 100 karakter'),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Format slug hanya huruf kecil, angka, dan tanda hubung (-)'
    ),
  daerah_asal: z.string().max(100).optional().nullable(),
  deskripsi: z.string().optional().nullable(),
  makna_filosofi: z.string().optional().nullable(),
  sejarah: z.string().optional().nullable(),
  warna_dominan: z.array(z.string()),
  gambar_url: z.string().url('URL gambar tidak valid').optional().nullable(),
  is_published: z.boolean(),
  skintone_matches: z.array(skintoneMatchSchema),
});

export type MotifInput = z.infer<typeof motifSchema>;
export type SkintoneMatchInput = z.infer<typeof skintoneMatchSchema>;

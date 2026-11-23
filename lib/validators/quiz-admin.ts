import { z } from 'zod';

export const quizAdminSchema = z
  .object({
    id: z.string().uuid().optional(),
    pertanyaan: z
      .string()
      .min(5, 'Pertanyaan minimal 5 karakter')
      .max(500, 'Pertanyaan maksimal 500 karakter'),
    opsi: z
      .array(
        z.string().min(1, 'Teks pilihan jawaban tidak boleh kosong').max(255)
      )
      .min(2, 'Minimal harus ada 2 pilihan jawaban')
      .max(6, 'Maksimal 6 pilihan jawaban'),
    jawaban_benar: z
      .number()
      .min(0, 'Indeks jawaban benar tidak valid'),
    penjelasan: z.string().optional().nullable(),
    motif_id: z.string().uuid().optional().nullable(),
    is_published: z.boolean(),
  })
  .refine(
    (data) => data.jawaban_benar >= 0 && data.jawaban_benar < data.opsi.length,
    {
      message: 'Pilihan jawaban benar harus merujuk pada opsi yang tersedia',
      path: ['jawaban_benar'],
    }
  );

export type QuizAdminInput = z.infer<typeof quizAdminSchema>;

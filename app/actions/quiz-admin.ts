'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { quizAdminSchema, type QuizAdminInput } from '@/lib/validators/quiz-admin';

export interface ActionResponse {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Simpan data Soal Kuis (Tambah baru atau Ubah)
 */
export async function saveQuizQuestion(
  input: QuizAdminInput
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const parsed = quizAdminSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Data pertanyaan kuis tidak valid.',
      };
    }

    const data = parsed.data;
    const supabase = await createClient();

    // 1. Cek keunikan teks pertanyaan
    let queryCheck = supabase
      .from('quiz_questions')
      .select('id')
      .ilike('pertanyaan', data.pertanyaan);

    if (data.id) {
      queryCheck = queryCheck.neq('id', data.id);
    }

    const { data: existingQ } = await queryCheck.maybeSingle();
    if (existingQ) {
      return {
        success: false,
        error: 'Pertanyaan ini sudah ada di dalam bank soal. Buat kalimat pertanyaan yang berbeda.',
      };
    }

    let savedId = data.id;

    // 2. Simpan atau perbarui baris
    if (data.id) {
      const { error: updateError } = await supabase
        .from('quiz_questions')
        .update({
          pertanyaan: data.pertanyaan,
          opsi: data.opsi,
          jawaban_benar: data.jawaban_benar,
          penjelasan: data.penjelasan || null,
          motif_id: data.motif_id || null,
          is_published: data.is_published,
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error update quiz question:', updateError);
        return { success: false, error: updateError.message };
      }
    } else {
      const { data: newRow, error: insertError } = await supabase
        .from('quiz_questions')
        .insert({
          pertanyaan: data.pertanyaan,
          opsi: data.opsi,
          jawaban_benar: data.jawaban_benar,
          penjelasan: data.penjelasan || null,
          motif_id: data.motif_id || null,
          is_published: data.is_published,
        })
        .select('id')
        .single();

      if (insertError || !newRow) {
        console.error('Error insert quiz question:', insertError);
        return { success: false, error: insertError?.message || 'Gagal menambahkan soal kuis.' };
      }

      savedId = newRow.id;
    }

    // 3. Revalidasi cache
    revalidatePath('/kuis');
    revalidatePath('/admin/kuis');

    return {
      success: true,
      id: savedId,
    };
  } catch (err) {
    console.error('Error saat saveQuizQuestion:', err);
    return { success: false, error: 'Gagal menyimpan pertanyaan kuis.' };
  }
}

/**
 * Toggle status terbitkan soal kuis
 */
export async function togglePublishQuizQuestion(
  id: string,
  is_published: boolean
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from('quiz_questions')
      .update({ is_published })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/kuis');
    revalidatePath('/admin/kuis');

    return { success: true };
  } catch (err) {
    console.error('Error saat togglePublishQuizQuestion:', err);
    return { success: false, error: 'Gagal mengubah status terbit soal kuis.' };
  }
}

/**
 * Hapus soal kuis
 */
export async function deleteQuizQuestion(id: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/kuis');
    revalidatePath('/admin/kuis');

    return { success: true };
  } catch (err) {
    console.error('Error saat deleteQuizQuestion:', err);
    return { success: false, error: 'Gagal menghapus soal kuis.' };
  }
}

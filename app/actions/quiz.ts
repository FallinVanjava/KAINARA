'use server';

import { createClient } from '@/lib/supabase/server';

export interface SubmitQuizAttemptResult {
  success: boolean;
  error?: string;
}

export async function submitQuizAttempt(
  skor: number,
  total: number
): Promise<SubmitQuizAttemptResult> {
  try {
    // 1. Validasi batas angka skor dan pastikan nilai finite
    if (
      !Number.isInteger(skor) ||
      typeof skor !== 'number' ||
      !Number.isFinite(skor) ||
      typeof total !== 'number' ||
      !Number.isInteger(total) ||
      !Number.isFinite(total) ||
      total <= 0 ||
      skor < 0 ||
      skor > total
    ) {
      return { success: false, error: 'Skor atau total soal tidak valid.' };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;

    // Coba simpan via klien sesi pengguna biasa terlebih dahulu
    const { error: userError } = await supabase.from('quiz_attempts').insert({
      user_id: userId,
      skor,
      total,
    });

    if (userError) {
      // Jangan melewati RLS dengan service-role key untuk percobaan kuis.
      console.error('Gagal mencatat percobaan kuis:', userError.message);
      return { success: false, error: 'Gagal mencatat skor kuis ke server' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error saat submitQuizAttempt:', err);
    // Gagal simpan tidak boleh merusak UX pengguna (mereka tetap melihat skor)
    return { success: false, error: 'Gagal mencatat skor kuis ke server' };
  }
}

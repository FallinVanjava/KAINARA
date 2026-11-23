import { createClient } from '@/lib/supabase/server';
import type { QuizQuestion } from '@/types/database';

export interface QuizQuestionWithMotif extends QuizQuestion {
  motif?: {
    id: string;
    nama: string;
    slug: string;
  } | null;
}

export async function getRandomQuizQuestions(limit = 10): Promise<QuizQuestionWithMotif[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('get_random_quiz', { p_limit: limit })
    .select('*, motif:motifs(id, nama, slug)');

  if (error || !data) {
    console.error('Error fetching quiz questions:', error);
    // Fallback bila RPC terkendala: query langsung dari tabel
    const fallbackRes = await supabase
      .from('quiz_questions')
      .select('*, motif:motifs(id, nama, slug)')
      .eq('is_published', true)
      .limit(limit);

    if (fallbackRes.error || !fallbackRes.data) {
      return [];
    }
    return fallbackRes.data as unknown as QuizQuestionWithMotif[];
  }

  return data as unknown as QuizQuestionWithMotif[];
}

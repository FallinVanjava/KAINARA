import { createClient } from '@/lib/supabase/server';
import type { QuizQuestion } from '@/types/database';

export interface QuizQuestionWithMotif extends QuizQuestion {
  motif?: {
    id: string;
    nama: string;
    slug: string;
  } | null;
}

export interface GetAdminQuizParams {
  q?: string;
  sortBy?: 'pertanyaan' | 'created_at' | 'is_published';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetAdminQuizResult {
  items: QuizQuestionWithMotif[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getAdminQuizQuestions({
  q,
  sortBy = 'created_at',
  order = 'desc',
  page = 1,
  limit = 10,
}: GetAdminQuizParams = {}): Promise<GetAdminQuizResult> {
  const supabase = await createClient();

  let query = supabase
    .from('quiz_questions')
    .select('*, motif:motifs(id, nama, slug)', { count: 'exact' });

  if (q?.trim()) {
    query = query.ilike('pertanyaan', `%${q.trim()}%`);
  }

  query = query.order(sortBy, { ascending: order === 'asc' });

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error getAdminQuizQuestions:', error);
    return { items: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items: (data as unknown as QuizQuestionWithMotif[]) ?? [],
    total,
    page,
    totalPages,
  };
}

export async function getQuizQuestionForEdit(id: string): Promise<QuizQuestionWithMotif | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*, motif:motifs(id, nama, slug)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as unknown as QuizQuestionWithMotif;
}

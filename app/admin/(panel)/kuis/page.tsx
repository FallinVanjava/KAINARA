import { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminQuizQuestions } from '@/lib/queries/admin-quiz';
import { QuizTable } from '@/components/admin/quiz/quiz-table';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Kelola Soal Kuis | Admin Kainara',
  description: 'Daftar dan manajemen bank soal kuis tapis Lampung.',
};

interface AdminKuisPageProps {
  searchParams: Promise<{
    q?: string;
    sortBy?: 'pertanyaan' | 'created_at' | 'is_published';
    order?: 'asc' | 'desc';
    page?: string;
  }>;
}

async function QuizListContent({ searchParams }: AdminKuisPageProps) {
  await requireAdmin();
  const params = await searchParams;

  const q = typeof params.q === 'string' ? params.q : '';
  const sortBy = params.sortBy || 'created_at';
  const order = params.order || 'desc';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;

  const { items, total, totalPages } = await getAdminQuizQuestions({
    q,
    sortBy,
    order,
    page,
    limit: 10,
  });

  return (
    <QuizTable
      questions={items}
      total={total}
      page={page}
      totalPages={totalPages}
      currentQuery={q}
      currentSort={sortBy}
      currentOrder={order}
    />
  );
}

export default function AdminKuisPage({ searchParams }: AdminKuisPageProps) {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Kelola Soal Kuis
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
          Bank soal kuis interaktif, pilihan jawaban 0-indexed, ulasan budaya, dan keterkaitan motif.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-72 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        }
      >
        <QuizListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

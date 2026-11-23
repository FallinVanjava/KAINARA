import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllMotifsShort } from '@/lib/queries/admin-outfit';
import { getQuizQuestionForEdit } from '@/lib/queries/admin-quiz';
import { QuizForm } from '@/components/admin/quiz/quiz-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Ubah Soal Kuis | Admin Kainara',
  description: 'Ubah pertanyaan, pilihan jawaban, atau penjelasan kuis tapis Lampung.',
};

interface UbahKuisPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function UbahKuisContent({ params }: UbahKuisPageProps) {
  await requireAdmin();
  const { id } = await params;

  const [question, motifs] = await Promise.all([
    getQuizQuestionForEdit(id),
    getAllMotifsShort(),
  ]);

  if (!question) {
    notFound();
  }

  return (
    <QuizForm
      initialData={question}
      availableMotifs={motifs}
    />
  );
}

export default function UbahKuisPage({ params }: UbahKuisPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <UbahKuisContent params={params} />
    </Suspense>
  );
}

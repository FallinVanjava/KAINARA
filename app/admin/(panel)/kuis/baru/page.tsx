import { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllMotifsShort } from '@/lib/queries/admin-outfit';
import { QuizForm } from '@/components/admin/quiz/quiz-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Tambah Soal Kuis Baru | Admin Kainara',
  description: 'Tambah soal pertanyaan baru ke bank kuis tapis Lampung.',
};

async function TambahKuisContent() {
  await requireAdmin();
  const motifs = await getAllMotifsShort();

  return <QuizForm availableMotifs={motifs} />;
}

export default function TambahKuisPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <TambahKuisContent />
    </Suspense>
  );
}

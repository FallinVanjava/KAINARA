import { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllSkintones } from '@/lib/queries/admin-motif';
import { MotifForm } from '@/components/admin/motif/motif-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Tambah Motif Baru | Admin Kainara',
  description: 'Tambah data motif kain tapis Lampung baru.',
};

async function TambahMotifContent() {
  await requireAdmin();
  const skintones = await getAllSkintones();

  return <MotifForm availableSkintones={skintones} />;
}

export default function TambahMotifPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <TambahMotifContent />
    </Suspense>
  );
}

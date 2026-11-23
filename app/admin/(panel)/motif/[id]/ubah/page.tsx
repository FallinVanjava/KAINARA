import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllSkintones, getMotifForEdit } from '@/lib/queries/admin-motif';
import { MotifForm } from '@/components/admin/motif/motif-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Ubah Data Motif | Admin Kainara',
  description: 'Ubah data dan filosofi motif kain tapis Lampung.',
};

interface UbahMotifPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function UbahMotifContent({ params }: UbahMotifPageProps) {
  await requireAdmin();
  const { id } = await params;

  const [motifData, skintones] = await Promise.all([
    getMotifForEdit(id),
    getAllSkintones(),
  ]);

  if (!motifData) {
    notFound();
  }

  return (
    <MotifForm
      initialData={motifData.motif}
      initialMatches={motifData.matches}
      availableSkintones={skintones}
    />
  );
}

export default function UbahMotifPage({ params }: UbahMotifPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <UbahMotifContent params={params} />
    </Suspense>
  );
}

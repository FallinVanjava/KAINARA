import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllMotifsShort, getOutfitForEdit } from '@/lib/queries/admin-outfit';
import { OutfitForm } from '@/components/admin/outfit/outfit-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Ubah Data Outfit | Admin Kainara',
  description: 'Ubah data rekomendasi outfit kain tapis Lampung.',
};

interface UbahOutfitPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function UbahOutfitContent({ params }: UbahOutfitPageProps) {
  await requireAdmin();
  const { id } = await params;

  const [outfitData, motifs] = await Promise.all([
    getOutfitForEdit(id),
    getAllMotifsShort(),
  ]);

  if (!outfitData) {
    notFound();
  }

  return (
    <OutfitForm
      initialData={outfitData.outfit}
      initialMotifIds={outfitData.selectedMotifIds}
      availableMotifs={motifs}
    />
  );
}

export default function UbahOutfitPage({ params }: UbahOutfitPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <UbahOutfitContent params={params} />
    </Suspense>
  );
}

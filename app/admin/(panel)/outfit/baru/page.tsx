import { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { getAllMotifsShort } from '@/lib/queries/admin-outfit';
import { OutfitForm } from '@/components/admin/outfit/outfit-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Tambah Outfit Baru | Admin Kainara',
  description: 'Tambah rekomendasi outfit baru paduan kain tapis Lampung.',
};

async function TambahOutfitContent() {
  await requireAdmin();
  const motifs = await getAllMotifsShort();

  return <OutfitForm availableMotifs={motifs} />;
}

export default function TambahOutfitPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <TambahOutfitContent />
    </Suspense>
  );
}

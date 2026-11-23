import { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminOutfits } from '@/lib/queries/admin-outfit';
import { OutfitTable } from '@/components/admin/outfit/outfit-table';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Kelola Rekomendasi Outfit | Admin Kainara',
  description: 'Daftar dan manajemen paduan outfit kain tapis Lampung.',
};

interface AdminOutfitPageProps {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    sortBy?: 'nama' | 'kategori' | 'created_at' | 'is_published';
    order?: 'asc' | 'desc';
    page?: string;
  }>;
}

async function OutfitListContent({ searchParams }: AdminOutfitPageProps) {
  await requireAdmin();
  const params = await searchParams;

  const q = typeof params.q === 'string' ? params.q : '';
  const kategori = typeof params.kategori === 'string' ? params.kategori : '';
  const sortBy = params.sortBy || 'created_at';
  const order = params.order || 'desc';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;

  const { items, total, totalPages } = await getAdminOutfits({
    q,
    kategori,
    sortBy,
    order,
    page,
    limit: 10,
  });

  return (
    <OutfitTable
      outfits={items}
      total={total}
      page={page}
      totalPages={totalPages}
      currentQuery={q}
      currentKategori={kategori}
      currentSort={sortBy}
      currentOrder={order}
    />
  );
}

export default function AdminOutfitPage({ searchParams }: AdminOutfitPageProps) {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Kelola Rekomendasi Outfit
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
          Padu padan busana adat, formal, kasual, dan modern yang selaras dengan motif tapis Lampung.
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
        <OutfitListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

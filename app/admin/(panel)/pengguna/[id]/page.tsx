import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { getUserDetail } from '@/lib/queries/admin-users';
import { UserDetailView } from '@/components/admin/user/user-detail-view';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Detail Pengguna | Admin Kainara',
  description: 'Rincian aktivitas dan riwayat scan pengguna Kainara.',
};

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function UserDetailContent({ params }: UserDetailPageProps) {
  const { user: currentAdmin } = await requireAdmin();
  const { id } = await params;

  const data = await getUserDetail(id);
  if (!data) {
    notFound();
  }

  return <UserDetailView data={data} currentAdminId={currentAdmin.id} />;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-5xl">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      }
    >
      <UserDetailContent params={params} />
    </Suspense>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminUsers } from '@/lib/queries/admin-users';
import { UserTable } from '@/components/admin/user/user-table';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Kelola Pengguna | Admin Kainara',
  description: 'Daftar dan manajemen akun pengguna aplikasi Kainara.',
};

interface AdminPenggunaPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    sortBy?: 'nama' | 'email' | 'role' | 'created_at';
    order?: 'asc' | 'desc';
    page?: string;
  }>;
}

async function UserListContent({ searchParams }: AdminPenggunaPageProps) {
  const { user: currentAdmin } = await requireAdmin();
  const params = await searchParams;

  const q = typeof params.q === 'string' ? params.q : '';
  const role = typeof params.role === 'string' ? params.role : '';
  const status = typeof params.status === 'string' ? params.status : '';
  const sortBy = params.sortBy || 'created_at';
  const order = params.order || 'desc';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;

  const { items, total, totalPages } = await getAdminUsers({
    q,
    role,
    status,
    sortBy,
    order,
    page,
    limit: 10,
  });

  return (
    <UserTable
      users={items}
      total={total}
      page={page}
      totalPages={totalPages}
      currentQuery={q}
      currentRole={role}
      currentStatus={status}
      currentSort={sortBy}
      currentOrder={order}
      currentAdminId={currentAdmin.id}
    />
  );
}

export default function AdminPenggunaPage({ searchParams }: AdminPenggunaPageProps) {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Kelola Pengguna
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
          Daftar pengguna terdaftar, pengawasan hak akses peran, status keaktifan akun, dan preferensi skintone.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-72 rounded-xl" />
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        }
      >
        <UserListContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Shield,
  ShieldAlert,
  Power,
  PowerOff,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
  Filter,
} from 'lucide-react';
import type { ProfileWithSkintone } from '@/lib/queries/admin-users';
import { updateUserRole, toggleUserStatus } from '@/app/actions/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserTableProps {
  users: ProfileWithSkintone[];
  total: number;
  page: number;
  totalPages: number;
  currentQuery: string;
  currentRole: string;
  currentStatus: string;
  currentSort: string;
  currentOrder: string;
  currentAdminId: string;
}

const ROLE_OPTIONS = [
  { value: 'semua', label: 'Semua Peran' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User Biasa' },
];

const STATUS_OPTIONS = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'aktif', label: 'Akun Aktif' },
  { value: 'nonaktif', label: 'Akun Nonaktif' },
];

export function UserTable({
  users,
  total,
  page,
  totalPages,
  currentQuery,
  currentRole,
  currentStatus,
  currentSort,
  currentOrder,
  currentAdminId,
}: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(currentQuery);
  const [roleChangeTarget, setRoleChangeTarget] = useState<ProfileWithSkintone | null>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<ProfileWithSkintone | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '' || v === 'semua') {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    startTransition(() => {
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ''}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ q: searchVal.trim(), page: null });
  };

  const handleToggleSort = (field: string) => {
    const isCurrentField = currentSort === field;
    const nextOrder = isCurrentField && currentOrder === 'asc' ? 'desc' : 'asc';
    updateUrlParams({ sortBy: field, order: nextOrder, page: null });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeTarget) return;
    const nextRole = roleChangeTarget.role === 'admin' ? 'user' : 'admin';
    setIsProcessing(true);
    try {
      const res = await updateUserRole(roleChangeTarget.id, nextRole);
      if (res.success) {
        toast.success(
          `Peran ${roleChangeTarget.nama || roleChangeTarget.email} berhasil diubah menjadi ${nextRole}`
        );
        setRoleChangeTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal mengubah peran pengguna');
      }
    } catch {
      toast.error('Terjadi kesalahan saat memperbarui peran');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    const nextStatus = !statusChangeTarget.is_active;
    setIsProcessing(true);
    try {
      const res = await toggleUserStatus(statusChangeTarget.id, nextStatus);
      if (res.success) {
        toast.success(
          nextStatus
            ? `Akun ${statusChangeTarget.nama || statusChangeTarget.email} telah diaktifkan`
            : `Akun ${statusChangeTarget.nama || statusChangeTarget.email} telah dinonaktifkan`
        );
        setStatusChangeTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal mengubah status pengguna');
      }
    } catch {
      toast.error('Terjadi kesalahan saat memperbarui status');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kontrol Atas: Pencarian, Filter Peran & Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7A3A3A] dark:text-[#D9C3B5]" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            aria-label="Cari pengguna"
            className="h-10 w-full rounded-xl border border-[#E8D8C8] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#5E0F11] focus:border-[#96640F] focus:outline-none focus:ring-2 focus:ring-[#96640F]/20 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
          />
        </form>

        <div className="flex items-center gap-2">
          {/* Filter Peran */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#7A3A3A] dark:text-[#D9C3B5]" />
            <select
              value={currentRole || 'semua'}
              onChange={(e) => updateUrlParams({ role: e.target.value, page: null })}
              aria-label="Filter peran pengguna"
              className="h-10 appearance-none rounded-xl border border-[#E8D8C8] bg-white pl-8 pr-7 text-xs font-medium text-[#5E0F11] focus:border-[#96640F] focus:outline-none dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={currentStatus || 'semua'}
              onChange={(e) => updateUrlParams({ status: e.target.value, page: null })}
              aria-label="Filter status pengguna"
              className="h-10 appearance-none rounded-xl border border-[#E8D8C8] bg-white px-3.5 text-xs font-medium text-[#5E0F11] focus:border-[#96640F] focus:outline-none dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Data Pengguna */}
      <div className="rounded-2xl border border-[#E8D8C8] bg-white overflow-hidden shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F5E9DC] text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
              <TableRow className="border-b border-[#E8D8C8] dark:border-[rgba(246,233,220,0.12)]">
                <TableHead className="w-12 text-center font-bold text-xs uppercase">
                  #
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleToggleSort('nama')}
                    className="flex items-center gap-1.5 font-bold text-xs uppercase text-[#7A1212] dark:text-[#E8C36A]"
                  >
                    Pengguna <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleToggleSort('role')}
                    className="flex items-center gap-1.5 font-bold text-xs uppercase text-[#7A1212] dark:text-[#E8C36A]"
                  >
                    Peran <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-center font-bold text-xs uppercase">
                  Status
                </TableHead>
                <TableHead className="font-bold text-xs uppercase">
                  Skintone Terakhir
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleToggleSort('created_at')}
                    className="flex items-center gap-1.5 font-bold text-xs uppercase text-[#7A1212] dark:text-[#E8C36A]"
                  >
                    Terdaftar <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="w-32 text-right font-bold text-xs uppercase pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length > 0 ? (
                users.map((u, idx) => {
                  const isSelf = u.id === currentAdminId;
                  const displayName = u.nama || u.email?.split('@')[0] || 'Pengguna';

                  return (
                    <TableRow
                      key={u.id}
                      className="hover:bg-[#FFF8F0] dark:hover:bg-[#3A1D1E]/50 transition-colors border-b border-[#E8D8C8]/60 dark:border-[rgba(246,233,220,0.08)]"
                    >
                      {/* Nomor */}
                      <TableCell className="text-center text-xs text-[#7A3A3A] dark:text-[#D9C3B5] font-medium">
                        {(page - 1) * 10 + idx + 1}
                      </TableCell>

                      {/* Nama & Email */}
                      <TableCell className="font-medium text-[#5E0F11] dark:text-[#F6E9DC]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{displayName}</span>
                          {isSelf && (
                            <span className="inline-block rounded-md bg-[#7A1212] px-1.5 py-0.5 text-[10px] font-bold text-[#E8C36A]">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                          {u.email}
                        </div>
                      </TableCell>

                      {/* Peran */}
                      <TableCell>
                        <span
                          className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-[#7A1212] text-[#E8C36A]'
                              : 'bg-[#F5E9DC] text-[#5E0F11] dark:bg-[#3A1D1E] dark:text-[#F6E9DC]'
                          }`}
                        >
                          {u.role}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            u.is_active
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {u.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>

                      {/* Skintone Terakhir */}
                      <TableCell>
                        {u.skintone ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="size-4.5 rounded-full border border-black/10 shadow-2xs shrink-0"
                              style={{ backgroundColor: u.skintone.hex_color }}
                              title={`${u.skintone.nama} (${u.skintone.hex_color})`}
                            />
                            <span className="text-xs text-[#5E0F11] dark:text-[#F6E9DC] font-medium">
                              {u.skintone.nama}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] italic">
                            Belum scan
                          </span>
                        )}
                      </TableCell>

                      {/* Tanggal Daftar */}
                      <TableCell className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Detail */}
                          <Link
                            href={`/admin/pengguna/${u.id}`}
                            className="size-8 rounded-lg flex items-center justify-center text-[#5E0F11] hover:bg-[#F5E9DC] transition-colors dark:text-[#F6E9DC] dark:hover:bg-[#3A1D1E]"
                            title="Lihat riwayat scan & aktivitas pengguna"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {/* Tombol Ubah Peran (Kecuali Diri Sendiri) */}
                          {!isSelf ? (
                            <button
                              type="button"
                              onClick={() => setRoleChangeTarget(u)}
                              className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
                                u.role === 'admin'
                                  ? 'text-[#96640F] hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                  : 'text-[#5E0F11] hover:bg-[#F5E9DC] dark:text-[#F6E9DC] dark:hover:bg-[#3A1D1E]'
                              }`}
                              title={
                                u.role === 'admin'
                                  ? 'Turunkan menjadi User'
                                  : 'Naikkan menjadi Admin'
                              }
                            >
                              {u.role === 'admin' ? (
                                <ShieldAlert className="size-4" />
                              ) : (
                                <Shield className="size-4" />
                              )}
                            </button>
                          ) : (
                            <div className="size-8" />
                          )}

                          {/* Tombol Aktif / Nonaktif (Kecuali Diri Sendiri) */}
                          {!isSelf ? (
                            <button
                              type="button"
                              onClick={() => setStatusChangeTarget(u)}
                              className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
                                u.is_active
                                  ? 'text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                  : 'text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                              }`}
                              title={u.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                            >
                              {u.is_active ? (
                                <PowerOff className="size-4" />
                              ) : (
                                <Power className="size-4" />
                              )}
                            </button>
                          ) : (
                            <div className="size-8" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                    Belum ada akun pengguna yang sesuai dengan kriteria filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Paginasi */}
        <div className="flex items-center justify-between border-t border-[#E8D8C8] px-5 py-3 text-xs text-[#7A3A3A] dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
          <span>
            Total: <strong className="text-[#5E0F11] dark:text-[#F6E9DC]">{total}</strong> pengguna
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateUrlParams({ page: (page - 1).toString() })}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E8D8C8] disabled:opacity-40 hover:bg-[#F5E9DC] dark:border-[rgba(246,233,220,0.16)]"
                aria-label="Halaman sebelumnya"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <span className="px-1 font-medium">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateUrlParams({ page: (page + 1).toString() })}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E8D8C8] disabled:opacity-40 hover:bg-[#F5E9DC] dark:border-[rgba(246,233,220,0.16)]"
                aria-label="Halaman berikutnya"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Konfirmasi Ubah Peran */}
      <AlertDialog
        open={Boolean(roleChangeTarget)}
        onOpenChange={(open) => !open && setRoleChangeTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Ubah Peran Pengguna &quot;{roleChangeTarget?.nama || roleChangeTarget?.email}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
              Peran akun akan diubah dari{' '}
              <strong className="uppercase">{roleChangeTarget?.role}</strong> menjadi{' '}
              <strong className="uppercase text-[#7A1212] dark:text-[#E8C36A]">
                {roleChangeTarget?.role === 'admin' ? 'USER BIASA' : 'ADMIN'}
              </strong>
              .{' '}
              {roleChangeTarget?.role === 'user'
                ? 'Pengguna akan memiliki akses penuh ke seluruh pengelolaan konten dan data di Panel Admin.'
                : 'Akses administrator pengguna ini akan dicabut.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isProcessing}
              className="rounded-full border-[#E8D8C8] text-xs font-semibold"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isProcessing}
              onClick={handleConfirmRoleChange}
              className="rounded-full bg-[#7A1212] text-white hover:bg-[#5E0F11] text-xs font-bold"
            >
              {isProcessing ? 'Memproses...' : 'Ya, Ubah Peran'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Status Akun */}
      <AlertDialog
        open={Boolean(statusChangeTarget)}
        onOpenChange={(open) => !open && setStatusChangeTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              {statusChangeTarget?.is_active ? 'Nonaktifkan' : 'Aktifkan'} Akun &quot;
              {statusChangeTarget?.nama || statusChangeTarget?.email}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
              {statusChangeTarget?.is_active
                ? 'Akun yang dinonaktifkan tidak akan dapat masuk ke sistem atau mencatat riwayat pemindaian motif/skintone.'
                : 'Akun akan diaktifkan kembali sehingga pengguna dapat menggunakan layanan Kainara secara normal.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isProcessing}
              className="rounded-full border-[#E8D8C8] text-xs font-semibold"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isProcessing}
              onClick={handleConfirmStatusChange}
              className={`rounded-full text-white text-xs font-bold ${
                statusChangeTarget?.is_active
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {isProcessing
                ? 'Memproses...'
                : statusChangeTarget?.is_active
                  ? 'Ya, Nonaktifkan Akun'
                  : 'Ya, Aktifkan Akun'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import type { Motif } from '@/types/database';
import { togglePublishMotif, deleteMotif } from '@/app/actions/motif';
import { Switch } from '@/components/ui/switch';
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

interface MotifTableProps {
  motifs: Motif[];
  total: number;
  page: number;
  totalPages: number;
  currentQuery: string;
  currentSort: string;
  currentOrder: string;
}

export function MotifTable({
  motifs,
  total,
  page,
  totalPages,
  currentQuery,
  currentSort,
  currentOrder,
}: MotifTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(currentQuery);
  const [deleteTarget, setDeleteTarget] = useState<Motif | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
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

  const handleTogglePublish = (motif: Motif) => {
    const nextStatus = !motif.is_published;
    startTransition(async () => {
      const res = await togglePublishMotif(motif.id, nextStatus);
      if (res.success) {
        toast.success(
          nextStatus
            ? `Motif "${motif.nama}" berhasil diterbitkan`
            : `Motif "${motif.nama}" disembunyikan`
        );
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal mengubah status terbit');
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteMotif(deleteTarget.id);
      if (res.success) {
        toast.success(`Motif "${deleteTarget.nama}" berhasil dihapus`);
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal menghapus motif');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus motif');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kontrol Atas: Pencarian & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7A3A3A] dark:text-[#D9C3B5]" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari nama motif atau asal daerah..."
            aria-label="Cari motif"
            className="h-10 w-full rounded-xl border border-[#E8D8C8] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#5E0F11] focus:border-[#96640F] focus:outline-none focus:ring-2 focus:ring-[#96640F]/20 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
          />
        </form>

        <Link
          href="/admin/motif/baru"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7A1212] px-5 text-xs sm:text-sm font-bold text-[#FFF8F0] shadow-sm transition-all hover:bg-[#5E0F11] dark:bg-[#8F1A1A] shrink-0"
        >
          <Plus className="size-4" />
          <span>Tambah Motif</span>
        </Link>
      </div>

      {/* Tabel Data Motif */}
      <div className="rounded-2xl border border-[#E8D8C8] bg-white overflow-hidden shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F5E9DC] text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
              <TableRow className="border-b border-[#E8D8C8] dark:border-[rgba(246,233,220,0.12)]">
                <TableHead className="w-16 text-center font-bold text-xs uppercase">
                  Foto
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleToggleSort('nama')}
                    className="flex items-center gap-1.5 font-bold text-xs uppercase text-[#7A1212] dark:text-[#E8C36A]"
                  >
                    Nama Motif <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="font-bold text-xs uppercase">
                  Asal Daerah
                </TableHead>
                <TableHead className="font-bold text-xs uppercase">
                  Warna Dominan
                </TableHead>
                <TableHead className="text-center font-bold text-xs uppercase">
                  Terbit
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleToggleSort('created_at')}
                    className="flex items-center gap-1.5 font-bold text-xs uppercase text-[#7A1212] dark:text-[#E8C36A]"
                  >
                    Dibuat <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="w-24 text-right font-bold text-xs uppercase pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {motifs.length > 0 ? (
                motifs.map((motif) => (
                  <TableRow
                    key={motif.id}
                    className="hover:bg-[#FFF8F0] dark:hover:bg-[#3A1D1E]/50 transition-colors border-b border-[#E8D8C8]/60 dark:border-[rgba(246,233,220,0.08)]"
                  >
                    {/* Gambar Mini */}
                    <TableCell className="p-3 text-center">
                      <div className="relative size-11 rounded-lg overflow-hidden border border-[#E8D8C8] bg-[#F5E9DC] mx-auto shrink-0 dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)]">
                        {motif.gambar_url ? (
                          <Image
                            src={motif.gambar_url}
                            alt={motif.nama}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-heading text-xs font-bold text-[#7A1212] dark:text-[#E8C36A]">
                            {motif.nama.charAt(0)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Nama Motif & Slug */}
                    <TableCell className="font-medium text-[#5E0F11] dark:text-[#F6E9DC]">
                      <div className="font-semibold text-sm">{motif.nama}</div>
                      <div className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                        <span>id: {motif.slug}</span>
                      </div>
                    </TableCell>

                    {/* Asal Daerah */}
                    <TableCell className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                      {motif.daerah_asal || 'Lampung'}
                    </TableCell>

                    {/* Warna Dominan Tag */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {motif.warna_dominan?.slice(0, 3).map((w, i) => (
                          <span
                            key={i}
                            className="inline-block rounded-md bg-[#F5E9DC] px-2 py-0.5 text-[10px] font-medium text-[#7A1212] capitalize dark:bg-[#3A1D1E] dark:text-[#E8C36A]"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    {/* Toggle Terbitkan Langsung */}
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={motif.is_published}
                          onCheckedChange={() => handleTogglePublish(motif)}
                          disabled={isPending}
                          aria-label={`Status terbit ${motif.nama}`}
                        />
                      </div>
                    </TableCell>

                    {/* Tanggal Dibuat */}
                    <TableCell className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] whitespace-nowrap">
                      {new Date(motif.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>

                    {/* Aksi Ubah & Hapus */}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/motif/${motif.id}/ubah`}
                          className="size-8 rounded-lg flex items-center justify-center text-[#5E0F11] hover:bg-[#F5E9DC] hover:text-[#96640F] transition-colors dark:text-[#F6E9DC] dark:hover:bg-[#3A1D1E]"
                          title="Ubah motif"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(motif)}
                          className="size-8 rounded-lg flex items-center justify-center text-destructive hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/40"
                          title="Hapus motif"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                    Belum ada data motif yang sesuai dengan kata kunci pencarian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Paginasi */}
        <div className="flex items-center justify-between border-t border-[#E8D8C8] px-5 py-3 text-xs text-[#7A3A3A] dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
          <span>
            Total: <strong className="text-[#5E0F11] dark:text-[#F6E9DC]">{total}</strong> motif
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

      {/* Dialog Konfirmasi Hapus (Menyebut Nama Motif) */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Hapus Motif &quot;{deleteTarget?.nama}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Motif ini beserta foto dan relasi kecocokan skintone akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-full border-[#E8D8C8] text-xs font-semibold"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="rounded-full bg-destructive text-white hover:bg-destructive/90 text-xs font-bold"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus Motif'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

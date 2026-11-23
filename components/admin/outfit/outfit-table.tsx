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
  Filter,
} from 'lucide-react';
import type { OutfitWithMotifs } from '@/lib/queries/admin-outfit';
import { togglePublishOutfit, deleteOutfit } from '@/app/actions/outfit';
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

interface OutfitTableProps {
  outfits: OutfitWithMotifs[];
  total: number;
  page: number;
  totalPages: number;
  currentQuery: string;
  currentKategori: string;
  currentSort: string;
  currentOrder: string;
}

const KATEGORI_OPTIONS = [
  { value: 'semua', label: 'Semua Kategori' },
  { value: 'adat', label: 'Adat' },
  { value: 'formal', label: 'Formal' },
  { value: 'kasual', label: 'Kasual' },
  { value: 'modern', label: 'Modern' },
];

export function OutfitTable({
  outfits,
  total,
  page,
  totalPages,
  currentQuery,
  currentKategori,
  currentSort,
  currentOrder,
}: OutfitTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(currentQuery);
  const [deleteTarget, setDeleteTarget] = useState<OutfitWithMotifs | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '' || (k === 'kategori' && v === 'semua')) {
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

  const handleTogglePublish = (outfit: OutfitWithMotifs) => {
    const nextStatus = !outfit.is_published;
    startTransition(async () => {
      const res = await togglePublishOutfit(outfit.id, nextStatus);
      if (res.success) {
        toast.success(
          nextStatus
            ? `Outfit "${outfit.nama}" berhasil diterbitkan`
            : `Outfit "${outfit.nama}" disembunyikan`
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
      const res = await deleteOutfit(deleteTarget.id);
      if (res.success) {
        toast.success(`Outfit "${deleteTarget.nama}" berhasil dihapus`);
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal menghapus outfit');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus outfit');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kontrol Atas: Pencarian, Filter Kategori, & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row gap-2 max-w-lg">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7A3A3A] dark:text-[#D9C3B5]" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Cari nama outfit..."
              aria-label="Cari nama outfit"
              className="h-10 w-full rounded-xl border border-[#E8D8C8] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#5E0F11] focus:border-[#96640F] focus:outline-none focus:ring-2 focus:ring-[#96640F]/20 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
            />
          </form>

          {/* Filter Dropdown Kategori */}
          <div className="relative w-full sm:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#7A3A3A] dark:text-[#D9C3B5]" />
            <select
              value={currentKategori || 'semua'}
              onChange={(e) => updateUrlParams({ kategori: e.target.value, page: null })}
              aria-label="Filter kategori outfit"
              className="h-10 w-full appearance-none rounded-xl border border-[#E8D8C8] bg-white pl-8 pr-7 text-xs font-medium text-[#5E0F11] focus:border-[#96640F] focus:outline-none dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
            >
              {KATEGORI_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Link
          href="/admin/outfit/baru"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7A1212] px-5 text-xs sm:text-sm font-bold text-[#FFF8F0] shadow-sm transition-all hover:bg-[#5E0F11] dark:bg-[#8F1A1A] shrink-0"
        >
          <Plus className="size-4" />
          <span>Tambah Outfit</span>
        </Link>
      </div>

      {/* Tabel Data Outfit */}
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
                    Nama Outfit <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleToggleSort('kategori')}
                    className="flex items-center gap-1.5 font-bold text-xs uppercase text-[#7A1212] dark:text-[#E8C36A]"
                  >
                    Kategori <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="font-bold text-xs uppercase">
                  Motif Terkait
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
              {outfits.length > 0 ? (
                outfits.map((outfit) => {
                  const relatedMotifs = (outfit.outfit_motif || [])
                    .map((item) => item.motif?.nama)
                    .filter(Boolean);

                  return (
                    <TableRow
                      key={outfit.id}
                      className="hover:bg-[#FFF8F0] dark:hover:bg-[#3A1D1E]/50 transition-colors border-b border-[#E8D8C8]/60 dark:border-[rgba(246,233,220,0.08)]"
                    >
                      {/* Gambar Mini */}
                      <TableCell className="p-3 text-center">
                        <div className="relative size-11 rounded-lg overflow-hidden border border-[#E8D8C8] bg-[#F5E9DC] mx-auto shrink-0 dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)]">
                          {outfit.gambar_url ? (
                            <Image
                              src={outfit.gambar_url}
                              alt={outfit.nama}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-heading text-xs font-bold text-[#7A1212] dark:text-[#E8C36A]">
                              {outfit.nama.charAt(0)}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Nama Outfit & Warna */}
                      <TableCell className="font-medium text-[#5E0F11] dark:text-[#F6E9DC]">
                        <div className="font-semibold text-sm">{outfit.nama}</div>
                        {outfit.warna_utama && (
                          <div className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5]">
                            Warna: {outfit.warna_utama}
                          </div>
                        )}
                      </TableCell>

                      {/* Kategori Badge */}
                      <TableCell>
                        <span className="inline-block rounded-md bg-[#F5E9DC] px-2.5 py-1 text-[11px] font-semibold uppercase text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
                          {outfit.kategori || 'umum'}
                        </span>
                      </TableCell>

                      {/* Motif Terkait */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {relatedMotifs.length > 0 ? (
                            relatedMotifs.map((motifName, i) => (
                              <span
                                key={i}
                                className="inline-block rounded-md border border-[#E8D8C8] bg-white px-2 py-0.5 text-[10px] font-medium text-[#5E0F11] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
                              >
                                {motifName}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#7A3A3A] dark:text-[#D9C3B5] italic">
                              Belum ada motif
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Toggle Terbitkan Langsung */}
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={outfit.is_published}
                            onCheckedChange={() => handleTogglePublish(outfit)}
                            disabled={isPending}
                            aria-label={`Status terbit ${outfit.nama}`}
                          />
                        </div>
                      </TableCell>

                      {/* Tanggal Dibuat */}
                      <TableCell className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] whitespace-nowrap">
                        {new Date(outfit.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>

                      {/* Aksi Ubah & Hapus */}
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/outfit/${outfit.id}/ubah`}
                            className="size-8 rounded-lg flex items-center justify-center text-[#5E0F11] hover:bg-[#F5E9DC] hover:text-[#96640F] transition-colors dark:text-[#F6E9DC] dark:hover:bg-[#3A1D1E]"
                            title="Ubah outfit"
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(outfit)}
                            className="size-8 rounded-lg flex items-center justify-center text-destructive hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/40"
                            title="Hapus outfit"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
                    Belum ada rekomendasi outfit yang sesuai dengan filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Paginasi */}
        <div className="flex items-center justify-between border-t border-[#E8D8C8] px-5 py-3 text-xs text-[#7A3A3A] dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
          <span>
            Total: <strong className="text-[#5E0F11] dark:text-[#F6E9DC]">{total}</strong> outfit
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

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Hapus Outfit &quot;{deleteTarget?.nama}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Data outfit dan berkas fotonya di penyimpanan akan dihapus permanen.
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
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus Outfit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

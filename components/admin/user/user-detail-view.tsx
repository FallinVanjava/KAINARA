'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  Power,
  PowerOff,
  Palette,
  Layers,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { UserDetailResult } from '@/lib/queries/admin-users';
import { updateUserRole, toggleUserStatus } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
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

interface UserDetailViewProps {
  data: UserDetailResult;
  currentAdminId: string;
}

export function UserDetailView({ data, currentAdminId }: UserDetailViewProps) {
  const router = useRouter();
  const { profile, scanLogs } = data;
  const isSelf = profile.id === currentAdminId;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const displayName = profile.nama || profile.email?.split('@')[0] || 'Pengguna';

  const handleConfirmRoleChange = async () => {
    const nextRole = profile.role === 'admin' ? 'user' : 'admin';
    setIsProcessing(true);
    try {
      const res = await updateUserRole(profile.id, nextRole);
      if (res.success) {
        toast.success(`Peran ${displayName} berhasil diubah menjadi ${nextRole}`);
        setShowRoleDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal mengubah peran pengguna');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengubah peran');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    const nextStatus = !profile.is_active;
    setIsProcessing(true);
    try {
      const res = await toggleUserStatus(profile.id, nextStatus);
      if (res.success) {
        toast.success(
          nextStatus
            ? `Akun ${displayName} telah diaktifkan kembali`
            : `Akun ${displayName} telah dinonaktifkan`
        );
        setShowStatusDialog(false);
        router.refresh();
      } else {
        toast.error(res.error || 'Gagal mengubah status akun');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengubah status');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header & Navigasi Kembali */}
      <div className="border-b border-[#E8D8C8] pb-6 dark:border-[rgba(246,233,220,0.16)]">
        <Link
          href="/admin/pengguna"
          className="inline-flex items-center gap-1.5 text-xs text-[#7A3A3A] hover:text-[#5E0F11] transition-colors dark:text-[#D9C3B5] dark:hover:text-[#F6E9DC] mb-3"
        >
          <ArrowLeft className="size-3.5" /> Kembali ke Daftar Pengguna
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-[#7A1212] text-[#E8C36A] flex items-center justify-center font-heading text-2xl font-bold uppercase shadow-sm">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-2xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
                  {displayName}
                </h1>
                {isSelf && (
                  <span className="rounded-md bg-[#7A1212] px-2 py-0.5 text-xs font-bold text-[#E8C36A]">
                    Akun Anda
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-0.5 font-mono">
                {profile.email} • ID: {profile.id.slice(0, 8)}...
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                    profile.role === 'admin'
                      ? 'bg-[#7A1212] text-[#E8C36A]'
                      : 'bg-[#F5E9DC] text-[#5E0F11] dark:bg-[#3A1D1E] dark:text-[#F6E9DC]'
                  }`}
                >
                  {profile.role}
                </span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    profile.is_active
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {profile.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Admin */}
          {!isSelf ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRoleDialog(true)}
                className="h-10 gap-1.5 rounded-xl border-[#E8D8C8] text-xs font-semibold text-[#5E0F11] hover:bg-[#F5E9DC] dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
              >
                {profile.role === 'admin' ? (
                  <>
                    <ShieldAlert className="size-4 text-[#96640F]" />
                    <span>Turunkan ke User</span>
                  </>
                ) : (
                  <>
                    <Shield className="size-4 text-[#7A1212] dark:text-[#E8C36A]" />
                    <span>Jadikan Admin</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusDialog(true)}
                className={`h-10 gap-1.5 rounded-xl text-xs font-semibold ${
                  profile.is_active
                    ? 'border-destructive/30 text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    : 'border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                {profile.is_active ? (
                  <>
                    <PowerOff className="size-4" />
                    <span>Nonaktifkan</span>
                  </>
                ) : (
                  <>
                    <Power className="size-4" />
                    <span>Aktifkan</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <span className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] italic">
              (Kontrol mutasi akun sendiri dinonaktifkan demi keamanan)
            </span>
          )}
        </div>
      </div>

      {/* Grid Informasi & Statistik */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Skintone Terakhir */}
        <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-3">
          <div className="flex items-center gap-2 text-[#7A1212] dark:text-[#E8C36A]">
            <Palette className="size-4.5" />
            <h3 className="font-heading text-sm font-bold">Skintone Terakhir</h3>
          </div>

          {profile.skintone ? (
            <div className="flex items-center gap-3.5 pt-1">
              <div
                className="size-12 rounded-xl border border-black/10 shadow-xs shrink-0"
                style={{ backgroundColor: profile.skintone.hex_color }}
              />
              <div>
                <h4 className="font-bold text-sm text-[#5E0F11] dark:text-[#F6E9DC]">
                  {profile.skintone.nama}
                </h4>
                <div className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] font-mono">
                  {profile.skintone.hex_color} • Undertone: {profile.skintone.undertone}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2 text-xs text-[#7A3A3A] dark:text-[#D9C3B5] italic">
              Pengguna belum pernah melakukan pemindaian warna kulit.
            </div>
          )}
        </div>

        {/* Card Tanggal Bergabung */}
        <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-3">
          <div className="flex items-center gap-2 text-[#7A1212] dark:text-[#E8C36A]">
            <Calendar className="size-4.5" />
            <h3 className="font-heading text-sm font-bold">Waktu Bergabung</h3>
          </div>

          <div className="pt-1">
            <div className="text-sm font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              {new Date(profile.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-1 font-mono">
              Pembaruan terakhir:{' '}
              {new Date(profile.updated_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel 20 Riwayat Pemindaian Terakhir (Scan Logs) */}
      <div className="rounded-2xl border border-[#E8D8C8] bg-white p-6 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              20 Riwayat Pemindaian Terakhir
            </h3>
            <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5]">
              Catatan pemindaian motif tapis atau deteksi skintone dari aplikasi seluler Kainara.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#7A3A3A] dark:text-[#D9C3B5]">
            Total tercatat: {scanLogs.length}
          </span>
        </div>

        {scanLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E8D8C8] text-[#7A3A3A] dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 pr-4">Tipe Scan</th>
                  <th className="py-2.5 px-4">Hasil Deteksi</th>
                  <th className="py-2.5 px-4">Keyakinan (Confidence)</th>
                  <th className="py-2.5 pl-4 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C8]/60 dark:divide-[rgba(246,233,220,0.08)]">
                {scanLogs.map((log) => {
                  const isMotif = log.tipe === 'motif';
                  const hasilObj = log.hasil as Record<string, unknown> | undefined;
                  const confidence =
                    typeof hasilObj?.confidence === 'number'
                      ? Math.round(hasilObj.confidence * 100)
                      : null;

                  return (
                    <tr key={log.id} className="hover:bg-[#FFF8F0] dark:hover:bg-[#3A1D1E]/40">
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${
                            isMotif
                              ? 'bg-[#F5E9DC] text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A]'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                          }`}
                        >
                          {isMotif ? <Layers className="size-3" /> : <Palette className="size-3" />}
                          {log.tipe}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-[#5E0F11] dark:text-[#F6E9DC]">
                        {isMotif ? (
                          log.motif ? (
                            <span>Motif {log.motif.nama}</span>
                          ) : (
                            <span>{(hasilObj?.label as string) || 'Motif tidak dikenal'}</span>
                          )
                        ) : log.skintone ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="size-3.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: log.skintone.hex_color }}
                            />
                            <span>
                              {log.skintone.nama} ({log.skintone.hex_color})
                            </span>
                          </div>
                        ) : (
                          <span>{(hasilObj?.hex as string) || 'Warna kulit'}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[#7A3A3A] dark:text-[#D9C3B5]">
                        {confidence !== null ? `${confidence}%` : '-'}
                      </td>

                      <td className="py-3 pl-4 text-right text-[#7A3A3A] dark:text-[#D9C3B5] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(log.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dotted border-[#E8D8C8] p-8 text-center text-xs text-[#7A3A3A] dark:bg-[#3A1D1E]/20 dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
            <Sparkles className="size-6 text-[#96640F] mx-auto mb-2 opacity-60 dark:text-[#E8C36A]" />
            <p>Pengguna ini belum pernah melakukan pemindaian kain tapis atau skintone.</p>
          </div>
        )}
      </div>

      {/* Dialog Konfirmasi Ubah Peran */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent className="rounded-2xl border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              Ubah Peran Pengguna &quot;{displayName}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
              Peran akan diubah menjadi{' '}
              <strong className="uppercase text-[#7A1212] dark:text-[#E8C36A]">
                {profile.role === 'admin' ? 'USER BIASA' : 'ADMINISTRATOR'}
              </strong>
              .
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

      {/* Dialog Konfirmasi Status */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent className="rounded-2xl border-[#E8D8C8] bg-white dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
              {profile.is_active ? 'Nonaktifkan' : 'Aktifkan'} Akun &quot;{displayName}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
              {profile.is_active
                ? 'Pengguna tidak akan dapat mengakses aplikasi seluler atau menulis catatan pemindaian motif/skintone baru.'
                : 'Akun akan dipulihkan kembali ke status aktif.'}
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
                profile.is_active
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {isProcessing
                ? 'Memproses...'
                : profile.is_active
                  ? 'Ya, Nonaktifkan Akun'
                  : 'Ya, Aktifkan Akun'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

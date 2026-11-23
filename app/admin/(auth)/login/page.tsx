import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin/admin-login-form';

export const metadata: Metadata = {
  title: 'Masuk Panel Admin | Kainara',
  description: 'Halaman masuk khusus pengelola konten dan data budaya Kainara.',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8F0] px-4 py-12 dark:bg-[#1B0E0E]">
      <div className="w-full max-w-md space-y-6 rounded-[24px] border border-[#E8D8C8] bg-white p-7 sm:p-9 shadow-md dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
        {/* Header Form */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-block font-heading text-2xl font-bold tracking-wider text-[#7A1212] hover:text-[#96640F] transition-colors dark:text-[#E8C36A]"
          >
            KAINARA
          </Link>
          <h1 className="font-heading text-xl font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            Masuk Panel Admin
          </h1>
          <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
            Akses terbatas pengelola motif, outfit, soal kuis, dan data pengguna Kainara.
          </p>
        </div>

        {/* Form Komponen */}
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-muted" />}>
          <AdminLoginForm />
        </Suspense>

        {/* Tautan Kembali */}
        <div className="pt-2 text-center border-t border-dotted border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#7A1212] hover:text-[#96640F] transition-colors dark:text-[#E8C36A]"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

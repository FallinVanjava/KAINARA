import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8F0] px-5 py-16 text-center text-[#5E0F11] dark:bg-[#1B0E0E] dark:text-[#F6E9DC]">
      <div className="max-w-md space-y-6">
        <span className="inline-block rounded-full bg-[#F5E9DC] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#7A1212] dark:bg-[#3A1D1E] dark:text-[#E8C36A]">
          404: Halaman Tidak Ditemukan
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#7A1212] dark:text-[#E8C36A]">
          Jejak Terputus
        </h1>
        <p className="text-sm sm:text-base text-[#7A3A3A] dark:text-[#D9C3B5] leading-relaxed">
          Motif atau halaman yang kamu cari tidak ditemukan atau telah dipindahkan ke ragam hias lain.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#7A1212] px-6 text-sm font-medium text-[#FFF8F0] transition-colors hover:bg-[#5E0F11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96640F] focus-visible:ring-offset-2 dark:bg-[#8F1A1A] dark:hover:bg-[#7A1212]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

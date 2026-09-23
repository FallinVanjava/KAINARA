import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Labeler | KAINARA",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Navbar Khusus Admin */}
      <header className="bg-sogan-950 text-ivory px-6 py-4 flex justify-between items-center border-b border-sogan-800">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-xl tracking-wider text-emas">KAINARA</span>
          <span className="bg-emas/20 text-emas-300 text-xs px-2.5 py-0.5 rounded-full border border-emas/40 font-mono">
            ADMIN LABELER
          </span>
        </div>
        <Link
          href="/"
          className="text-xs sm:text-sm text-ivory/80 hover:text-emas transition-colors px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20"
        >
          Kembali ke Beranda
        </Link>
      </header>
      {children}
    </div>
  );
}

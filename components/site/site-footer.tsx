import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/site/theme-toggle';

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-[#E8D8C8] bg-[#FFF8F0] text-[#5E0F11] mt-auto dark:border-[rgba(246,233,220,0.16)] dark:bg-[#1B0E0E] dark:text-[#F6E9DC]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/icon-kainara.jpeg"
                alt="Logo KAINARA"
                width={36}
                height={36}
                className="size-9 rounded-lg object-cover"
              />
              <span className="font-heading text-2xl font-bold tracking-wider text-[#5E0F11] dark:text-[#F6E9DC]">
                KAINARA
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#7A3A3A] dark:text-[#D9C3B5]">
              Platform edukasi dan eksplorasi motif kain tapis Lampung. Menghubungkan tradisi luhur tapis dengan teknologi pencocokan skintone dan rekomendasi outfit busana modern.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
              <li>
                <Link href="/motif" className="transition-colors hover:text-[#96640F] dark:hover:text-[#E8C36A]">
                  Katalog Motif Tapis
                </Link>
              </li>
              <li>
                <Link href="/kuis" className="transition-colors hover:text-[#96640F] dark:hover:text-[#E8C36A]">
                  Kuis Pengetahuan
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
              Pengelola & Tampilan
            </h4>
            <ul className="space-y-2 text-sm text-[#7A3A3A] dark:text-[#D9C3B5]">
              <li>
                <Link href="/admin" className="transition-colors hover:text-[#96640F] dark:hover:text-[#E8C36A]">
                  Panel Admin
                </Link>
              </li>
              <li className="pt-2">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-dotted border-[#E8D8C8] pt-6 text-xs text-[#7A3A3A] sm:flex-row dark:border-[rgba(246,233,220,0.16)] dark:text-[#D9C3B5]">
          <p>© 2026 Kainara Lampung. Seluruh hak cipta dilindungi.</p>
          <p className="text-[#96640F] dark:text-[#E8C36A]">
            Melestarikan Khazanah Tapis Tradisional Lampung
          </p>
        </div>
      </div>
    </footer>
  );
}

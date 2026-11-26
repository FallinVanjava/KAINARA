'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/#top', label: 'Beranda' },
  { href: '/kuis', label: 'Kuesioner' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-[#FCF8F3]/90 backdrop-blur-md border-b border-[#E8DDD0]"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-heading text-xl font-bold tracking-wider text-[#6D0F0F] transition-colors group-hover:text-[#540B0B] dark:text-[#F6E9DC] dark:group-hover:text-[#E8C36A]">
            KAINARA
          </span>
          <span className="rounded-full bg-[#C8A84B] px-2 py-0.5 font-sans text-xs text-[#2D1810]">
            Lampung
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const isActive = link.href.includes('#')
              ? pathname === '/'
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[#540B0B] dark:hover:text-[#E8C36A] ${
                  isActive ? 'font-semibold text-[#6D0F0F] dark:text-[#F6E9DC]' : 'text-[#6D0F0F] dark:text-[#F6E9DC]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL && (
          <a
            href={process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center rounded-full bg-[#6D0F0F] px-5 text-xs font-semibold uppercase tracking-wider text-[#FFF8F0] transition-colors hover:bg-[#540B0B] md:inline-flex"
          >
            Terhubung Aplikasi
          </a>
        )}

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#6D0F0F] hover:bg-[#F5E9DC] hover:text-[#96640F] dark:text-[#F6E9DC] dark:hover:bg-[#3A1D1E] dark:hover:text-[#E8C36A]"
                  aria-label="Buka menu navigasi"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="border-l border-[#E8DDD0] bg-[#FCF8F3] p-6 text-[#6D0F0F] dark:border-[rgba(246,233,220,0.16)] dark:bg-[#1B0E0E] dark:text-[#F6E9DC]">
              <SheetTitle className="mb-6 text-left font-heading text-xl tracking-wider text-[#6D0F0F] dark:text-[#F6E9DC]">
                KAINARA
              </SheetTitle>
              <nav className="flex flex-col gap-4 text-base font-medium">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="py-2 transition-colors hover:text-[#540B0B] dark:hover:text-[#E8C36A]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* CTA ditampilkan hanya jika URL unduhan aplikasi tersedia. */}
              {process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#6D0F0F] px-6 text-xs font-semibold uppercase tracking-wider text-[#FFF8F0] transition-colors hover:bg-[#540B0B]"
                >
                  Terhubung Aplikasi
                </a>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
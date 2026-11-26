'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '#top', label: 'Beranda' },
  { href: '#galeri-motif', label: 'Contoh Motif' },
  { href: '#fitur-aplikasi', label: 'Fitur Aplikasi' },
  { href: '#kuesioner', label: 'Kuis Motif' },
];

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-30 w-full shrink-0 border-b border-[#262525]/8 bg-[#FEFEFE]/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="#top" className="flex items-center gap-2.5" aria-label="Beranda KAINARA">
          <Image
            src="/images/icon-kainara.jpeg"
            alt="Logo KAINARA"
            width={36}
            height={36}
            className="size-9 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight text-[#6D0F0F] leading-tight">
              KAINARA
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-[#C9A24D] uppercase">
              Wastra Lampung
            </span>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav
          aria-label="Navigasi desktop"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57524E]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#6D0F0F]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6D0F0F] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#560B0B]"
          >
            <Download className="size-3.5" />
            Download Aplikasi
          </a>
        </nav>

        {/* Menu Hamburger Mode Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="#download"
            className="inline-flex items-center gap-1 rounded-full bg-[#6D0F0F] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#560B0B]"
          >
            <Download className="size-3" />
            Download
          </a>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg text-[#6D0F0F] hover:bg-[#FCF8F3] hover:text-[#560B0B]"
                  aria-label="Buka menu navigasi"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-72 border-l border-[#262525]/10 bg-[#FCF8F3] p-6 text-[#262525]"
            >
              <div className="flex items-center gap-2.5 border-b border-[#262525]/8 pb-4">
                <Image
                  src="/images/icon-kainara.jpeg"
                  alt="Logo KAINARA"
                  width={36}
                  height={36}
                  className="size-9 rounded-lg object-cover"
                />
                <SheetTitle className="font-heading text-lg font-bold tracking-tight text-[#6D0F0F]">
                  KAINARA
                </SheetTitle>
              </div>

              <nav className="mt-5 flex flex-col gap-1 text-sm font-medium text-[#57524E]">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-3 py-2.5 transition-colors hover:bg-white hover:text-[#6D0F0F]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 border-t border-[#262525]/8 pt-5">
                <a
                  href="#download"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6D0F0F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#560B0B]"
                >
                  <Download className="size-3.5" />
                  Download Aplikasi
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Shirt,
  HelpCircle,
  Users,
  ExternalLink,
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/motif', label: 'Motif Tapis', icon: Layers, exact: false },
  { href: '/admin/outfit', label: 'Rekomendasi Outfit', icon: Shirt, exact: false },
  { href: '/admin/kuis', label: 'Soal Kuis', icon: HelpCircle, exact: false },
  { href: '/admin/pengguna', label: 'Pengguna', icon: Users, exact: false },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-[#E8D8C8] bg-[#FFF8F0] text-[#5E0F11] p-6 select-none dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415] dark:text-[#F6E9DC]">
      {/* Brand & Subtitle */}
      <div className="mb-8">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="font-heading text-2xl font-bold tracking-wider text-[#5E0F11] hover:text-[#96640F] transition-colors dark:text-[#F6E9DC] dark:hover:text-[#E8C36A]"
        >
          KAINARA
        </Link>
        <div className="text-[11px] text-[#7A3A3A] font-medium tracking-wide mt-0.5 dark:text-[#D9C3B5]">
          Panel Kelola Budaya
        </div>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 space-y-1.5 text-sm font-medium">
        {MENU_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                isActive
                  ? 'bg-[#F5E9DC] text-[#5E0F11] font-semibold border-l-4 border-[#96640F] dark:bg-[#3A1D1E] dark:text-[#F6E9DC] dark:border-[#E8C36A]'
                  : 'text-[#5E0F11] hover:bg-[#F5E9DC] hover:text-[#7A1212] dark:text-[#F6E9DC] dark:hover:bg-[#3A1D1E] dark:hover:text-[#E8C36A]'
              }`}
            >
              <Icon className={`size-4.5 shrink-0 ${isActive ? 'text-[#96640F] dark:text-[#E8C36A]' : 'text-[#7A3A3A] dark:text-[#D9C3B5]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tautan Luar ke Web Publik */}
      <div className="pt-4 border-t border-dotted border-[#E8D8C8] dark:border-[rgba(246,233,220,0.16)]">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-between text-xs text-[#5E0F11] hover:text-[#96640F] transition-colors dark:text-[#F6E9DC] dark:hover:text-[#E8C36A]"
        >
          <span>Buka Situs Publik</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}

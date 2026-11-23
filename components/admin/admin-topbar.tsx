'use client';

import { useState, useTransition } from 'react';
import { Menu, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { signOutAdmin } from '@/app/actions/auth';
import type { Profile } from '@/types/database';

interface AdminTopbarProps {
  profile: Profile;
}

export function AdminTopbar({ profile }: AdminTopbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();

  const handleSignOut = () => {
    startSignOut(async () => {
      await signOutAdmin();
    });
  };

  const displayName = profile.nama || profile.email?.split('@')[0] || 'Administrator';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E8D8C8] bg-white px-5 sm:px-8 dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)]">
      {/* Sisi Kiri: Tombol Menu Mobile & Indikator */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl border border-[#E8D8C8] text-[#5E0F11] hover:bg-[#F5E9DC] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
                  aria-label="Buka menu navigasi admin"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[260px] border-r border-[#E8D8C8] bg-[#FFF8F0] p-0 dark:border-[rgba(246,233,220,0.16)] dark:bg-[#2A1415]">
              <SheetTitle className="sr-only">Navigasi Admin Kainara</SheetTitle>
              <AdminSidebar onNavigate={() => setIsMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F] dark:text-[#E8C36A]">
            Kainara CMS
          </span>
          <div className="text-sm font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            Panel Administrator
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Info Profil & Tombol Keluar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-[#7A1212] text-[#E8C36A] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {displayName.charAt(0)}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-[#5E0F11] dark:text-[#F6E9DC] truncate max-w-[150px]">
              {displayName}
            </div>
            <div className="text-[10px] text-[#7A3A3A] dark:text-[#D9C3B5] font-medium capitalize">
              Peran: {profile.role}
            </div>
          </div>
        </div>

        {/* Tombol Keluar */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="h-9 gap-1.5 rounded-full border-[#E8D8C8] px-3.5 text-xs font-semibold text-[#7A1212] hover:bg-rose-50 hover:text-destructive hover:border-destructive/30 transition-colors dark:border-[rgba(246,233,220,0.16)] dark:text-[#E8C36A] dark:hover:bg-rose-950/40"
          title="Keluar dari akun admin"
        >
          {isSigningOut ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <LogOut className="size-3.5" />
          )}
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}

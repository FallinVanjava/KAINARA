import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';

async function AdminPanelContent({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#FFF8F0] dark:bg-[#1B0E0E] text-foreground">
      {/* Sidebar Desktop (260px) */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminTopbar profile={profile} />
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8F0] dark:bg-[#1B0E0E]">
          <div className="text-xs font-medium text-muted-foreground animate-pulse">
            Memuat panel admin...
          </div>
        </div>
      }
    >
      <AdminPanelContent>{children}</AdminPanelContent>
    </Suspense>
  );
}

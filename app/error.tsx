'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#FFF8F0] text-[#5E0F11]">
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="mb-4 size-10 text-[#96640F]" aria-hidden="true" />
          <h1 className="font-heading text-2xl font-bold">Terjadi kesalahan</h1>
          <p className="mt-2 max-w-md text-sm text-[#7A3A3A]">
            Halaman mengalami kendala. Coba muat ulang bagian ini.
          </p>
          <Button onClick={reset} className="mt-6 gap-2 rounded-xl bg-[#7A1212] text-white hover:bg-[#5E0F11]">
            <RefreshCw className="size-4" aria-hidden="true" />
            Coba lagi
          </Button>
        </main>
      </body>
    </html>
  );
}

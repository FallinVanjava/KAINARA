'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains('dark');
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-xs text-[#FFF8F0] hover:bg-[#7A1212] hover:text-[#E8C36A] gap-2 rounded-full h-8 px-3 transition-colors"
      aria-label="Ganti tema tampilan terang atau gelap"
    >
      {isDark ? (
        <>
          <Sun className="size-3.5 text-[#E8C36A]" />
          <span>Mode Terang</span>
        </>
      ) : (
        <>
          <Moon className="size-3.5 text-[#E8C36A]" />
          <span>Mode Gelap</span>
        </>
      )}
    </Button>
  );
}

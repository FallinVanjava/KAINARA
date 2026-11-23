'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react';
import { Search, X } from 'lucide-react';

interface MotifFilterProps {
  availableRegions: string[];
  currentQuery?: string;
  currentRegion?: string;
}

const FALLBACK_REGIONS = ['Semua Daerah', 'Menggala', 'Way Kanan', 'Pesisir', 'Pubian'];

export function MotifFilter({
  availableRegions,
  currentQuery = '',
  currentRegion = 'semua',
}: MotifFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(currentQuery);
  const [prevQuery, setPrevQuery] = useState(currentQuery);

  if (prevQuery !== currentQuery) {
    setPrevQuery(currentQuery);
    setSearchVal(currentQuery);
  }

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val.toLowerCase() === 'semua') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    params.delete('page');

    startTransition(() => {
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchVal.trim() });
  };

  const handleClearSearch = () => {
    setSearchVal('');
    updateFilters({ q: null });
  };

  const activeRegion = currentRegion.toLowerCase();
  const regions = availableRegions.length ? availableRegions : FALLBACK_REGIONS.slice(1);

  return (
    <div className="space-y-4 mb-8 sm:mb-10">
      {/* Input Pencarian Pill */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <div className="relative flex items-center">
          <Search className="absolute left-4 size-4.5 text-[#5C534E] pointer-events-none stroke-[2]" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari nama motif, asal daerah…"
            aria-label="Cari nama motif atau asal daerah"
            className="h-11 w-full rounded-full border border-[#E8DDD0] bg-[#FEFEFE] pl-11 pr-10 text-sm text-[#2D1810] placeholder:text-[#5C534E]/60 focus:border-[#C8A84B] focus:outline-none focus:ring-2 focus:ring-[#C8A84B]/25"
          />
          {searchVal && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 size-6 rounded-full flex items-center justify-center text-[#5C534E] hover:text-[#6D0F0F]"
              aria-label="Hapus pencarian"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      {/* Chip Filter Daerah */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5C534E] shrink-0 mr-1">
          Daerah:
        </span>

        <button
          type="button"
          onClick={() => updateFilters({ daerah: 'semua' })}
          className={`h-9 rounded-full px-4 text-xs font-semibold transition-colors shrink-0 ${
            activeRegion === 'semua' || !activeRegion
              ? 'bg-[#6D0F0F] text-[#FFF8F0] shadow-xs hover:bg-[#540B0B]'
              : 'bg-[#F7EFE5] text-[#2D1810] border border-[#E8DDD0] hover:bg-[#E8DDD0]'
          }`}
        >
          Semua Daerah
        </button>

        {regions.map((region) => {
          const isSelected = activeRegion === region.toLowerCase();
          return (
            <button
              key={region}
              type="button"
              onClick={() => updateFilters({ daerah: isSelected ? 'semua' : region })}
              className={`h-9 rounded-full px-4 text-xs font-semibold transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[#6D0F0F] text-[#FFF8F0] shadow-xs hover:bg-[#540B0B]'
                  : 'bg-[#F7EFE5] text-[#2D1810] border border-[#E8DDD0] hover:bg-[#E8DDD0]'
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>

      {isPending && (
        <div className="text-[11px] text-[#5C534E] animate-pulse">
          Memperbarui katalog motif...
        </div>
      )}
    </div>
  );
}

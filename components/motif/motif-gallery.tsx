'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MotifGalleryProps {
  src: string;
  nama: string;
}

const CROPS = [
  { label: 'Detail sulam', pos: 'object-[50%_15%]' },
  { label: 'Motif utama', pos: 'object-center' },
  { label: 'Benang emas', pos: 'object-[50%_85%]' },
];

export function MotifGallery({ src, nama }: MotifGalleryProps) {
  const [active, setActive] = useState(1);

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#E8DDD0] bg-[#F7EFE5]">
        <Image
          src={src}
          alt={`Kain tapis motif ${nama}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 520px"
          className={`object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06] ${CROPS[active].pos}`}
        />
      </div>

      <div className="flex gap-3">
        {CROPS.map((crop, idx) => (
          <button
            key={crop.label}
            type="button"
            aria-label={`Lihat ${crop.label} motif ${nama}`}
            aria-pressed={idx === active}
            onClick={() => setActive(idx)}
            className={`relative aspect-[4/3] flex-1 overflow-hidden rounded-xl border-2 transition-colors ${
              idx === active ? 'border-[#6D0F0F]' : 'border-[#E8DDD0] hover:border-[#C8A84B]'
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 30vw, 170px"
              className={`object-cover ${crop.pos}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

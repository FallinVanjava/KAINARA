@extends('layouts.app')

@section('title', 'Galeri Tapis: KAINARA')

@section('content')
    <section class="border-b border-charcoal/10 bg-[#FAF4ED]">
        <div class="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Arsip Visual Wastra</p>
            <h1 class="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">Katalog Motif Tapis Lampung</h1>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
                Telusuri ragam motif tapis berdasarkan nama atau daerah adat asalnya. Setiap lembar sulaman menyimpan rekaman sejarah, strata sosial, dan filosofi leluhur.
            </p>

            <form method="GET" action="{{ route('galeri.index') }}" class="mt-10 flex flex-col gap-4 border border-charcoal/15 bg-surface p-6 sm:flex-row sm:items-end">
                <div class="flex-1">
                    <label for="q" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Cari motif</label>
                    <input type="text" id="q" name="q" value="{{ $search }}"
                           placeholder="misal: cucuk pinggir, sasab..."
                           class="mt-2 w-full border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-maroon">
                </div>
                <div class="sm:w-72">
                    <label for="asal" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Daerah asal</label>
                    <select id="asal" name="asal" class="mt-2 w-full border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-maroon">
                        <option value="">Semua daerah adat</option>
                        @foreach ($origins as $origin)
                            <option value="{{ $origin }}" @selected($activeOrigin === $origin)>{{ $origin }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="bg-maroon px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">Cari</button>
                    <a href="{{ route('galeri.index') }}" class="border border-charcoal/30 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-maroon hover:text-maroon">Reset</a>
                </div>
            </form>
        </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
        @if ($motifs->isEmpty())
            <div class="border border-charcoal/15 bg-surface p-12 text-center">
                <p class="font-display text-2xl font-bold">Tidak ada motif yang sesuai</p>
                <p class="mt-2 text-sm leading-relaxed text-charcoal/70">
                    @if ($search || $activeOrigin)
                        Pencarian untuk "{{ $search }}" di daerah "{{ $activeOrigin ?: 'Semua' }}" tidak membuahkan hasil.
                    @else
                        Katalog motif saat ini masih kosong.
                    @endif
                </p>
                <a href="{{ route('galeri.index') }}" class="mt-6 inline-block bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream">
                    Reset Filter
                </a>
            </div>
        @else
            <div class="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
                @foreach ($motifs as $motif)
                    <a href="{{ route('galeri.detail', $motif) }}" class="group block" data-reveal>
                        <div class="overflow-hidden border border-charcoal/15 bg-surface p-2">
                            <x-image-frame :path="$motif->image_path" :name="$motif->name" class="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <span class="bg-maroon px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cream">
                                {{ $motif->origin_region }}
                            </span>
                            @if ($motif->dominant_color)
                                <span class="text-xs text-charcoal/70">· {{ $motif->dominant_color }}</span>
                            @endif
                        </div>
                        <h2 class="mt-2 font-display text-2xl leading-snug transition-colors group-hover:text-maroon">{{ $motif->name }}</h2>
                        @if ($motif->description)
                            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/70">{{ $motif->description }}</p>
                        @endif
                    </a>
                @endforeach
            </div>
        @endif
    </section>
@endsection
@extends('layouts.app')

@section('title', $motif->name.': KAINARA')

@section('content')
    <article class="mx-auto max-w-6xl px-6 py-16">
        <a href="{{ route('galeri.index') }}" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/70 transition-colors hover:text-maroon">
            <span>← Kembali ke Galeri Tapis</span>
        </a>

        <div class="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
                <div class="border border-charcoal/15 bg-surface p-3">
                    <x-image-frame :path="$motif->image_path" :name="$motif->name" class="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.015]" />
                </div>
                <button type="button"
                        x-data
                        @click="$store.favorites.toggle(@js([
                            'key' => 'motif:'.$motif->id,
                            'type' => 'motif',
                            'id' => $motif->id,
                            'name' => $motif->name,
                            'slug' => $motif->slug,
                            'image' => $motif->image_path ? asset('storage/'.$motif->image_path) : '',
                        ]))"
                        class="mt-6 w-full bg-maroon px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-charcoal sm:w-auto">
                    <span x-text="$store.favorites.has('motif', {{ $motif->id }}) ? '✓ Tersimpan di Favorit' : '+ Simpan ke Favorit'"></span>
                </button>
            </div>

            <div class="flex flex-col justify-start">
                <div class="flex items-center gap-2">
                    <span class="bg-maroon px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cream">
                        {{ $motif->origin_region }}
                    </span>
                    @if ($motif->dominant_color)
                        <span class="text-xs text-charcoal/70">· Dominan: {{ $motif->dominant_color }}</span>
                    @endif
                </div>

                <h1 class="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{{ $motif->name }}</h1>

                <div class="mt-8 border-y border-charcoal/15 py-6">
                    <p class="text-xs font-semibold uppercase tracking-[0.15em] text-maroon">Deskripsi Kain</p>
                    <p class="mt-3 text-base leading-relaxed text-charcoal/85">{{ $motif->description }}</p>
                </div>
            </div>
        </div>

        <div class="mt-16 grid gap-8 md:grid-cols-2">
            <div class="border border-charcoal/15 bg-surface p-6 sm:p-8" data-reveal>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Sejarah</p>
                <h2 class="mt-2 font-display text-2xl font-bold">Sejarah Motif</h2>
                <p class="mt-4 text-sm leading-relaxed text-charcoal/85">{{ $motif->history }}</p>
            </div>
            <div class="border border-charcoal/15 bg-surface p-6 sm:p-8" data-reveal>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Filosofi</p>
                <h2 class="mt-2 font-display text-2xl font-bold">Filosofi Sulaman</h2>
                <p class="mt-4 text-sm leading-relaxed text-charcoal/85">{{ $motif->philosophy }}</p>
            </div>
        </div>

        <div class="mt-16 border-t border-charcoal/10 pt-16">
            <div class="flex items-center justify-between" data-reveal>
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Inspirasi Busana</p>
                    <h2 class="mt-2 font-display text-3xl font-bold leading-[1.1]">Outfit yang Memakai Tapis Ini</h2>
                </div>
                <a href="{{ route('outfit.index') }}" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal underline decoration-charcoal/30 underline-offset-4 hover:text-maroon">
                    Semua outfit
                </a>
            </div>

            @if ($outfits->isEmpty())
                <p class="mt-6 border border-charcoal/10 bg-surface p-6 text-sm leading-relaxed text-charcoal/70">
                    Belum ada paduan outfit yang dikaitkan dengan motif ini di katalog.
                </p>
            @else
                <div class="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    @foreach ($outfits as $outfit)
                        <a href="{{ route('outfit.detail', $outfit) }}" class="group block border border-charcoal/15 bg-surface p-4 transition-colors hover:border-maroon/50" data-reveal>
                            <x-image-frame :path="$outfit->image_path" :name="$outfit->name" class="aspect-[4/5] w-full" />
                            <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-maroon">{{ $outfit->category }}</p>
                            <h3 class="mt-1 font-display text-xl leading-snug transition-colors group-hover:text-maroon">{{ $outfit->name }}</h3>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </article>
@endsection
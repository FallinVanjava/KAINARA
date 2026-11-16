@extends('layouts.app')

@section('title', $outfit->name.': KAINARA')

@section('content')
    <article class="mx-auto max-w-6xl px-6 py-16">
        <a href="{{ route('outfit.index') }}" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/70 transition-colors hover:text-maroon">
            <span>← Kembali ke Katalog Outfit</span>
        </a>

        <div class="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
                <div class="border border-charcoal/15 bg-surface p-3">
                    <x-image-frame :path="$outfit->image_path" :name="$outfit->name" class="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.015]" />
                </div>
                <button type="button"
                        x-data
                        @click="$store.favorites.toggle(@js([
                            'key' => 'outfit:'.$outfit->id,
                            'type' => 'outfit',
                            'id' => $outfit->id,
                            'name' => $outfit->name,
                            'slug' => $outfit->slug,
                            'image' => $outfit->image_path ? asset('storage/'.$outfit->image_path) : '',
                        ]))"
                        class="mt-6 w-full bg-maroon px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-charcoal sm:w-auto">
                    <span x-text="$store.favorites.has('outfit', {{ $outfit->id }}) ? '✓ Tersimpan di Favorit' : '+ Simpan ke Favorit'"></span>
                </button>
            </div>

            <div>
                <div class="flex flex-wrap items-center gap-2">
                    <span class="bg-[#F7E2C3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal">
                        Kategori: {{ $outfit->category }}
                    </span>
                    <span class="text-xs text-charcoal/70">
                        Skintone: <span class="font-medium text-maroon capitalize">{{ implode(', ', $outfit->skintone_match) }}</span>
                    </span>
                </div>

                <h1 class="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{{ $outfit->name }}</h1>

                <dl class="mt-8 grid grid-cols-[130px_1fr] gap-y-3 border-y border-charcoal/15 py-6 text-sm">
                    <dt class="text-charcoal/70">Kategori busana</dt>
                    <dd class="font-medium">{{ ucfirst($outfit->category) }}</dd>
                    <dt class="text-charcoal/70">Harmoni skintone</dt>
                    <dd class="capitalize font-medium text-maroon">{{ implode(', ', $outfit->skintone_match) }}</dd>
                    @if ($outfit->motifs->isNotEmpty())
                        <dt class="text-charcoal/70">Motif tapis</dt>
                        <dd class="flex flex-col gap-1">
                            @foreach ($outfit->motifs as $motif)
                                <a href="{{ route('galeri.detail', $motif) }}" class="w-fit text-maroon underline decoration-maroon/30 underline-offset-4 hover:decoration-maroon">{{ $motif->name }}</a>
                            @endforeach
                        </dd>
                    @endif
                </dl>

                <p class="mt-6 text-base leading-relaxed text-charcoal/85">{{ $outfit->description }}</p>
            </div>
        </div>

        <div class="mt-16" data-reveal>
            <div class="border border-charcoal/15 bg-surface p-6 sm:p-8">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Panduan Gaya</p>
                <h2 class="mt-2 font-display text-2xl font-bold">Catatan Mix &amp; Match</h2>
                <div class="mt-4 text-sm leading-relaxed text-charcoal/85">
                    @if ($outfit->mix_match_notes)
                        <p>{{ $outfit->mix_match_notes }}</p>
                    @else
                        <p class="text-charcoal/70">
                            Catatan padu padan untuk outfit ini belum didokumentasikan.
                        </p>
                    @endif
                </div>
            </div>
        </div>
    </article>
@endsection
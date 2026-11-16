@extends('layouts.app')

@section('title', 'Katalog Outfit: KAINARA')

@section('content')
    <section class="border-b border-charcoal/10 bg-[#FAF4ED]">
        <div class="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Kurasi Padu Padan</p>
            <h1 class="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">Katalog Outfit Wastra Tapis</h1>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
                Temukan inspirasi busana yang memadukan motif tapis Lampung dengan gaya kontemporer, diselaraskan berdasarkan kecocokan skintone pemakainya.
            </p>

            <form method="GET" action="{{ route('outfit.index') }}" class="mt-10 flex flex-col gap-4 border border-charcoal/15 bg-surface p-6 sm:flex-row sm:items-end">
                <div class="sm:w-52">
                    <label for="kategori" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Kategori</label>
                    <select id="kategori" name="kategori" class="mt-2 w-full border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-maroon">
                        <option value="">Semua Kategori</option>
                        @foreach (['atasan', 'bawahan', 'set'] as $kategori)
                            <option value="{{ $kategori }}" @selected($filters['kategori'] === $kategori)>{{ ucfirst($kategori) }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="sm:w-52">
                    <label for="skintone" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Skintone</label>
                    <select id="skintone" name="skintone" class="mt-2 w-full border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-maroon">
                        <option value="">Semua Skintone</option>
                        @foreach (['warm', 'neutral', 'cool'] as $skintone)
                            <option value="{{ $skintone }}" @selected($filters['skintone'] === $skintone)>{{ ucfirst($skintone) }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="sm:w-72">
                    <label for="motif" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Motif tapis</label>
                    <select id="motif" name="motif" class="mt-2 w-full border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-maroon">
                        <option value="">Semua Motif</option>
                        @foreach ($motifs as $motif)
                            <option value="{{ $motif->slug }}" @selected($filters['motif'] === $motif->slug)>{{ $motif->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="bg-maroon px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">Terapkan</button>
                    <a href="{{ route('outfit.index') }}" class="border border-charcoal/30 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-maroon hover:text-maroon">Reset</a>
                </div>
            </form>
        </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
        @if ($outfits->isEmpty())
            <div class="border border-charcoal/15 bg-surface p-12 text-center">
                <p class="font-display text-2xl font-bold">Tidak ada outfit yang cocok</p>
                <p class="mt-2 text-sm leading-relaxed text-charcoal/70">
                    Kombinasi kategori atau filter skintone yang Anda pilih belum memiliki padanan.
                </p>
                <a href="{{ route('outfit.index') }}" class="mt-6 inline-block bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream">
                    Reset Filter
                </a>
            </div>
        @else
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($outfits as $outfit)
                    <a href="{{ route('outfit.detail', $outfit) }}" class="group block border border-charcoal/15 bg-surface p-5 transition-colors hover:border-maroon/50" data-reveal>
                        <div class="overflow-hidden">
                            <x-image-frame :path="$outfit->image_path" :name="$outfit->name" class="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                        </div>
                        <div class="mt-4 flex flex-wrap items-center gap-2">
                            <span class="bg-[#F7E2C3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal">
                                {{ $outfit->category }}
                            </span>
                            <span class="text-xs text-charcoal/70">
                                Skintone: <span class="font-medium text-maroon capitalize">{{ implode(', ', $outfit->skintone_match) }}</span>
                            </span>
                        </div>
                        <h2 class="mt-2 font-display text-2xl leading-snug transition-colors group-hover:text-maroon">{{ $outfit->name }}</h2>
                        @if ($outfit->motifs->isNotEmpty())
                            <div class="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
                                @foreach ($outfit->motifs as $motif)
                                    <span class="border border-line bg-cream px-2 py-0.5 text-[11px] text-charcoal/75">{{ $motif->name }}</span>
                                @endforeach
                            </div>
                        @endif
                    </a>
                @endforeach
            </div>
        @endif
    </section>
@endsection
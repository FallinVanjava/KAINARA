@extends('layouts.app')

@section('title', 'KAINARA: Arsip Digital Tapis Lampung')

@section('content')
    {{-- Hero --}}
    <section class="relative">
        <div class="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-16">
            <div class="grid items-center gap-12 md:grid-cols-12 md:gap-10">
                <div class="md:col-span-7">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Arsip Digital &amp; Identifikasi AI</p>
                    <h1 class="mt-6 max-w-3xl font-display text-[2.9rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-[4.6rem]">
                        Mengenali Tapis Lampung lewat <span class="italic font-normal">motif</span> dan konteksnya.
                    </h1>
                    <p class="mt-6 max-w-xl text-base leading-relaxed text-charcoal/80">
                        KAINARA mengarsipkan motif tapis Lampung, mengenali kain dari satu foto dengan kecerdasan buatan, lalu mencocokkan padu padan outfit dengan skintone Anda.
                    </p>
                    <div class="mt-9 flex flex-wrap items-center gap-6">
                        <a href="#scan" class="bg-maroon px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-charcoal btn-press">
                            Scan Motif Tapis
                        </a>
                        <a href="{{ route('galeri.index') }}" class="text-sm font-medium text-charcoal underline decoration-charcoal/30 decoration-1 underline-offset-8 transition-colors hover:text-maroon">
                            Jelajahi Galeri Motif
                        </a>
                    </div>
                </div>

                <figure class="relative md:col-span-5" data-reveal>
                    <div class="relative border border-charcoal/15 bg-surface p-3">
                        <x-image-frame :path="optional($featuredMotifs->first())->image_path" :name="optional($featuredMotifs->first())->name ?? 'Tapis Lampung'" class="aspect-[4/5] w-full" />
                        <div class="mt-3 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.15em] text-charcoal/70">
                            <span>Wastra Lampung</span>
                            <span class="font-semibold text-maroon">Sulaman Emas</span>
                        </div>
                    </div>
                    <figcaption class="mt-3 text-xs leading-relaxed text-charcoal/70">
                        Dokumentasi ragam sulaman benang emas pada kain tenun tradisional Lampung.
                    </figcaption>
                </figure>
            </div>
        </div>
    </section>

    {{-- Direct Scan AI --}}
    <section id="scan" class="border-t border-charcoal/10 bg-[#FAF4ED]">
        <div class="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <div class="grid gap-12 md:grid-cols-12 md:gap-10" data-reveal>
                <div class="md:col-span-5">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Identifikasi AI</p>
                    <h2 class="mt-4 max-w-sm font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em]">
                        Scan langsung dari halaman ini.
                    </h2>
                    <p class="mt-5 max-w-sm text-sm leading-relaxed text-charcoal/80">
                        Unggah foto kain tapis atau potret wajah Anda. Citra dianalisis oleh model CNN di server dan langsung dihapus setelah inferensi selesai.
                    </p>
                    <dl class="mt-10 grid max-w-sm grid-cols-2 gap-6 border-t border-charcoal/20 pt-6 text-sm">
                        <div>
                            <dt class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/70">Motif Tapis</dt>
                            <dd class="mt-1 text-xs leading-relaxed text-charcoal/80">Nama motif, asal daerah, dan sejarah filosofisnya.</dd>
                        </div>
                        <div>
                            <dt class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/70">Skintone</dt>
                            <dd class="mt-1 text-xs leading-relaxed text-charcoal/80">Rekomendasi outfit tapis sesuai warna kulit.</dd>
                        </div>
                    </dl>
                </div>
                <div class="md:col-span-7">
                    <div class="border border-charcoal/15 bg-surface p-6 shadow-none sm:p-8">
                        @include('partials.scan-module')
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- Kurasi Motif --}}
    <section class="border-t border-charcoal/10 bg-cream">
        <div class="mx-auto max-w-6xl px-6 py-24">
            <div class="flex flex-wrap items-end justify-between gap-4" data-reveal>
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Kurasi Motif</p>
                    <h2 class="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em]">
                        Ragam Motif Tapis Lampung
                    </h2>
                </div>
                <a href="{{ route('galeri.index') }}" class="py-2 text-sm font-medium text-charcoal underline decoration-charcoal/30 decoration-1 underline-offset-4 transition-colors hover:text-maroon">
                    Lihat semua motif
                </a>
            </div>

            @if ($featuredMotifs->isEmpty())
                <p class="mt-14 max-w-xl text-sm leading-relaxed text-charcoal/70">
                    Katalog motif masih kosong. Admin dapat menambahkan motif melalui panel admin.
                </p>
            @else
                <div class="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
                    @foreach ($featuredMotifs as $motif)
                        <a href="{{ route('galeri.detail', $motif) }}" class="group block hover-lift" data-reveal>
                            <div class="overflow-hidden border border-charcoal/15 bg-surface p-2 img-zoom">
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
                            <h3 class="mt-2 font-display text-2xl leading-snug tracking-[-0.01em] transition-colors group-hover:text-maroon">{{ $motif->name }}</h3>
                            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/70">{{ $motif->description }}</p>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    {{-- Kurasi Outfit --}}
    <section class="border-t border-charcoal/10 bg-fog/50">
        <div class="mx-auto max-w-6xl px-6 py-24">
            <div class="flex flex-wrap items-end justify-between gap-4" data-reveal>
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Padu Padan Wastra</p>
                    <h2 class="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em]">
                        Inspirasi Busana &amp; Skintone
                    </h2>
                </div>
                <a href="{{ route('outfit.index') }}" class="py-2 text-sm font-medium text-charcoal underline decoration-charcoal/30 decoration-1 underline-offset-4 transition-colors hover:text-maroon">
                    Lihat katalog outfit
                </a>
            </div>

            @if ($featuredOutfits->isEmpty())
                <p class="mt-14 max-w-xl text-sm leading-relaxed text-charcoal/70">
                    Katalog outfit masih kosong. Admin dapat menambahkan outfit melalui panel admin.
                </p>
            @else
                <div class="mt-14 grid gap-8 md:grid-cols-2">
                    @foreach ($featuredOutfits as $outfit)
                        <a href="{{ route('outfit.detail', $outfit) }}" class="group grid gap-6 border border-charcoal/15 bg-surface p-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:p-6 transition-colors hover:border-maroon/40" data-reveal>
                            <div class="overflow-hidden">
                                <x-image-frame :path="$outfit->image_path" :name="$outfit->name" class="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                            </div>
                            <div class="flex flex-col justify-between py-1">
                                <div>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="bg-[#F7E2C3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal">
                                            {{ $outfit->category }}
                                        </span>
                                        <span class="text-xs text-charcoal/70">
                                            Skintone: <span class="font-medium text-maroon capitalize">{{ implode(', ', $outfit->skintone_match) }}</span>
                                        </span>
                                    </div>
                                    <h3 class="mt-3 font-display text-2xl leading-snug tracking-[-0.01em] transition-colors group-hover:text-maroon">{{ $outfit->name }}</h3>
                                    <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal/70">{{ $outfit->description }}</p>
                                </div>
                                @if ($outfit->motifs->isNotEmpty())
                                    <div class="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                                        @foreach ($outfit->motifs as $motif)
                                            <span class="border border-line bg-cream px-2.5 py-1 text-xs text-charcoal/75">{{ $motif->name }}</span>
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </section>
@endsection
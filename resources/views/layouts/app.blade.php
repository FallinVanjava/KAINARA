<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'KAINARA: Arsip Digital Tapis Lampung')</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-cream font-sans text-charcoal antialiased">
    <div id="scroll-progress" class="fixed top-0 left-0 z-50 h-[2px] bg-maroon pointer-events-none transition-[width] duration-75" style="width: 0%"></div>
    <nav x-data="{ open: false, scrolled: false }"
         @scroll.window.passive="scrolled = window.scrollY > 20"
         :class="scrolled ? 'border-charcoal/20 bg-cream/95 backdrop-blur-xs' : 'border-charcoal/10 bg-cream'"
         class="sticky top-0 z-40 border-b transition-colors duration-300">
        <div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
            <a href="{{ route('home') }}" class="font-display text-2xl font-bold tracking-tight text-charcoal">KAINARA</a>

            <div class="hidden items-center gap-8 md:flex">
                <a href="{{ route('galeri.index') }}" class="text-sm font-medium text-charcoal transition-colors hover:text-maroon">Galeri Tapis</a>
                <a href="{{ route('outfit.index') }}" class="text-sm font-medium text-charcoal transition-colors hover:text-maroon">Katalog Outfit</a>
                <a href="{{ route('scan') }}" class="text-sm font-medium text-charcoal transition-colors hover:text-maroon">Scan</a>
                <button type="button" @click="$store.favorites.open = true"
                        class="bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal transition-colors hover:bg-maroon hover:text-cream">
                    Favorit (<span x-text="$store.favorites.items.length">0</span>)
                </button>
            </div>

            <button type="button" class="p-2 -m-2 md:hidden" @click="open = !open" aria-label="Menu">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
        </div>

        <div x-show="open" class="border-t border-charcoal/10 px-6 pb-6 pt-4 md:hidden">
            <div class="flex flex-col gap-4">
                <a href="{{ route('galeri.index') }}" class="text-sm font-medium" @click="open = false">Galeri Tapis</a>
                <a href="{{ route('outfit.index') }}" class="text-sm font-medium" @click="open = false">Katalog Outfit</a>
                <a href="{{ route('scan') }}" class="text-sm font-medium" @click="open = false">Scan</a>
                <button type="button" @click="open = false; $store.favorites.open = true"
                        class="w-fit bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal">
                    Favorit (<span x-text="$store.favorites.items.length">0</span>)
                </button>
            </div>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <footer class="border-t border-gold/15 bg-charcoal text-cream">
        <div class="mx-auto flex max-w-6xl flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between">
            <div>
                <p class="font-display text-3xl font-bold">KAINARA</p>
                <p class="mt-3 max-w-md text-sm leading-relaxed text-gold/80">
                    Arsip digital motif tapis Lampung: identifikasi berbasis AI, cerita di balik setiap sulaman, dan padu padan outfit.
                </p>
            </div>
            <div class="flex flex-col gap-2 text-sm">
                <a href="mailto:halo@kainara.lampung" class="text-cream underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold">halo@kainara.lampung</a>
                <a href="https://www.instagram.com/explore/tags/tapislampung/" target="_blank" rel="noopener" class="text-cream underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold">Instagram</a>
                <a href="https://www.pinterest.com/search/pins/?q=tapis%20lampung" target="_blank" rel="noopener" class="text-cream underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold">Pinterest</a>
            </div>
        </div>
    </footer>

    <div x-data class="fixed inset-0 z-50" x-show="$store.favorites.open" x-cloak style="display: none;">
        <div class="absolute inset-0 bg-charcoal/40" @click="$store.favorites.open = false"></div>

        <aside role="dialog" aria-modal="true" aria-label="Favorit Anda" class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-cream"
               x-transition:enter="transition ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0"
               x-transition:leave="transition ease-in duration-200" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full"
               @keydown.escape.window="$store.favorites.open = false">

            <div class="flex items-center justify-between border-b border-line px-6 py-5">
                <p class="text-xs font-semibold uppercase tracking-[0.15em]">Favorit Anda</p>
                <button type="button" @click="$store.favorites.open = false" aria-label="Tutup favorit" class="p-2 -m-2 text-charcoal/60 hover:text-maroon">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-6">
                <p x-show="$store.favorites.items.length === 0" class="text-sm leading-relaxed text-charcoal/60">
                    Belum ada simpanan. Tekan tombol simpan pada motif atau outfit untuk menyimpannya di perangkat ini.
                </p>

                <ul class="flex flex-col gap-6">
                    <template x-for="item in $store.favorites.items" :key="item.key">
                        <li class="flex gap-4 border-b border-line pb-5">
                            <a x-bind:href="item.type === 'motif' ? '/galeri-tapis/' + item.slug : '/katalog-outfit/' + item.slug"
                               class="flex flex-1 gap-4">
                                <div x-show="item.image" class="h-20 w-16 shrink-0 overflow-hidden bg-gold">
                                    <img x-bind:src="item.image" x-bind:alt="item.name" class="h-full w-full object-cover">
                                </div>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.15em] text-charcoal/70" x-text="item.type === 'motif' ? 'Motif Tapis' : 'Outfit'"></p>
                                    <p class="mt-1 font-display text-lg leading-snug" x-text="item.name"></p>
                                    <p class="mt-1 text-xs text-maroon">Lihat detail</p>
                                </div>
                            </a>
                            <button type="button" @click="$store.favorites.remove(item.key)" class="self-center text-xs text-charcoal/70 underline underline-offset-4 hover:text-maroon">Hapus</button>
                        </li>
                    </template>
                </ul>
            </div>
        </aside>
    </div>
</body>
</html>
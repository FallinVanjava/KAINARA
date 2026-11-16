<div x-data="scanModule('{{ route('scan.motif') }}', '{{ route('scan.skintone') }}')" class="w-full">
    {{-- Tab --}}
    <div class="flex gap-8 border-b border-charcoal/15" role="tablist">
        <button type="button" role="tab"
                :class="tab === 'motif' ? 'border-maroon text-maroon font-bold' : 'border-transparent text-charcoal/60 hover:text-charcoal'"
                class="border-b-2 py-3 text-xs uppercase tracking-[0.15em] transition-colors"
                @click="reset(); tab = 'motif'">
            Scan Motif Tapis
        </button>
        <button type="button" role="tab"
                :class="tab === 'skintone' ? 'border-maroon text-maroon font-bold' : 'border-transparent text-charcoal/60 hover:text-charcoal'"
                class="border-b-2 py-3 text-xs uppercase tracking-[0.15em] transition-colors"
                @click="reset(); tab = 'skintone'">
            Scan Skintone
        </button>
    </div>

    <p class="mt-4 text-xs leading-relaxed text-charcoal/70">
        <span x-text="tab === 'motif' ? 'Unggah foto kain tapis. Model AI akan mengenali motif, asal daerah, dan filosofinya.' : 'Unggah foto wajah dengan pencahayaan netral. Model AI akan mengestimasi skintone dan mencocokkan outfit.'"></span>
    </p>

    {{-- Upload box --}}
    <div x-show="!result"
         @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="drop($event)"
         :class="dragging ? 'border-maroon bg-cream' : 'border-charcoal/30 bg-[#FCFBF8] hover:border-charcoal/60'"
         class="mt-6 flex flex-col items-center justify-center border-2 border-dashed px-6 py-12 text-center transition-colors">

        <input x-ref="input" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="pick($event)">

        <svg class="h-10 w-10 text-charcoal/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>

        <button type="button" class="mt-3 text-sm font-semibold text-charcoal underline decoration-charcoal/30 decoration-1 underline-offset-4 hover:text-maroon" @click="$refs.input.click()">
            Pilih gambar dari perangkat
        </button>
        <p class="mt-1 text-xs text-charcoal/70">atau seret berkas ke area ini · JPG, PNG, WEBP (maks. 2 MB)</p>

        <div x-show="fileName" x-cloak class="mt-4 inline-flex items-center gap-2 border border-charcoal/20 bg-gold/30 px-3 py-1.5 text-xs text-charcoal">
            <svg class="h-3.5 w-3.5 text-maroon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
            <span class="font-medium" x-text="fileName"></span>
        </div>
    </div>

    {{-- Error --}}
    <p x-show="error" x-cloak class="mt-4 border border-maroon bg-cream px-4 py-3 text-xs leading-relaxed text-maroon" x-text="error"></p>

    <div class="mt-6 flex flex-wrap items-center gap-4">
        <button type="button" x-show="!loading && file" @click="submit()"
                class="bg-maroon px-8 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">
            Proses Gambar
        </button>
        <button type="button" x-show="loading" disabled class="bg-maroon px-8 py-3.5 text-sm font-semibold text-cream opacity-80">
            Menganalisis citra…
        </button>
        <button type="button" x-show="result" @click="reset()" class="text-xs font-medium text-charcoal underline decoration-charcoal/30 underline-offset-4 hover:text-maroon">
            Scan gambar lain
        </button>
    </div>

    {{-- Hasil: motif --}}
    <div x-show="result && result.tab === 'motif'" x-cloak class="mt-8 border border-charcoal/15 bg-surface p-6 sm:p-7">
        <div class="flex items-center justify-between border-b border-charcoal/10 pb-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon">Hasil Klasifikasi AI</p>
            <span x-show="result && result.confidence > 0" class="border border-charcoal/15 bg-[#F7E2C3]/40 px-2 py-0.5 text-xs text-charcoal">
                Keyakinan: <span class="font-bold" x-text="result ? result.confidence : 0"></span>%
            </span>
        </div>

        <h3 class="mt-4 font-display text-3xl font-bold leading-tight" x-text="result ? result.label : ''"></h3>

        <template x-if="result && result.motif">
            <div class="mt-5 border-t border-line pt-5">
                <p class="text-sm leading-relaxed text-charcoal/85">
                    Tercatat dalam arsip KAINARA berasal dari daerah adat
                    <span class="font-bold text-maroon" x-text="result.motif.origin_region"></span>.
                </p>
                <div class="mt-5">
                    <a :href="result.motif.url" class="inline-block bg-maroon px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-charcoal">
                        Buka Detail Motif
                    </a>
                </div>
            </div>
        </template>
        <template x-if="result && !result.motif">
            <p class="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-charcoal/70">
                Nama motif ini belum terdaftar di katalog. Jelajahi galeri untuk mencari motif dengan pola sulaman serupa.
            </p>
        </template>
    </div>

    {{-- Hasil: skintone --}}
    <div x-show="result && result.tab === 'skintone'" x-cloak class="mt-8 border border-charcoal/15 bg-surface p-6 sm:p-7">
        <div class="border-b border-charcoal/10 pb-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon">Hasil Estimasi Skintone</p>
            <h3 class="mt-2 font-display text-3xl font-bold capitalize text-charcoal" x-text="result ? result.skintone : ''"></h3>
        </div>

        <div class="mt-6">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Outfit yang cocok</p>
            <p x-show="result && result.outfits.length === 0" class="mt-2 text-xs text-charcoal/70">Belum ada outfit untuk skintone ini.</p>
            <ul class="mt-3 flex flex-col gap-2">
                <template x-for="outfit in (result ? result.outfits : [])" :key="outfit.url">
                    <li class="border border-line bg-cream p-3">
                        <a :href="outfit.url" class="inline-flex items-center justify-between w-full text-sm font-medium hover:text-maroon">
                            <span x-text="outfit.name"></span>
                            <span class="text-xs text-maroon font-semibold">Buka detail</span>
                        </a>
                    </li>
                </template>
            </ul>
        </div>

        <div class="mt-6 border-t border-line pt-5">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Motif tapis yang dipakai</p>
            <p x-show="result && result.motifs.length === 0" class="mt-2 text-xs text-charcoal/70">Belum ada motif pada outfit ini.</p>
            <div class="mt-3 flex flex-wrap gap-2">
                <template x-for="motif in (result ? result.motifs : [])" :key="motif.url">
                    <a :href="motif.url" class="border border-line bg-cream px-3 py-1.5 text-xs text-charcoal hover:border-maroon hover:text-maroon" x-text="motif.name"></a>
                </template>
            </div>
        </div>
    </div>
</div>
@extends('layouts.app')

@section('title', 'Scan: KAINARA')

@section('content')
    <section class="border-b border-charcoal/10 bg-[#FAF4ED]">
        <div class="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div class="max-w-2xl">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Identifikasi Visi Komputer</p>
                <h1 class="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
                    Kenali motif tapis dan skintone Anda.
                </h1>
                <p class="mt-4 text-sm leading-relaxed text-charcoal/80">
                    Model CNN menganalisis citra kain tapis dan potret wajah secara real-time. Berkas diunggah sementara ke server dan otomatis dimusnahkan segera setelah inferensi tuntas.
                </p>
            </div>

            <div class="mt-10 border border-charcoal/15 bg-surface p-6 sm:p-10">
                @include('partials.scan-module')
            </div>
        </div>
    </section>

    <section class="bg-cream">
        <div class="mx-auto max-w-6xl px-6 py-20">
            <div class="flex flex-col gap-2">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-maroon">Panduan Pengambilan Citra</p>
                <h2 class="font-display text-3xl font-bold leading-[1.1]">Tips untuk Akurasi Maksimal</h2>
            </div>

            <div class="mt-8 grid gap-6 md:grid-cols-3">
                <div class="border border-charcoal/15 bg-surface p-6" data-reveal>
                    <p class="text-xs font-semibold uppercase tracking-[0.15em] text-maroon">Jarak &amp; Sudut</p>
                    <h3 class="mt-3 font-display text-xl font-bold">Fokus Pada Sulaman</h3>
                    <p class="mt-3 text-xs leading-relaxed text-charcoal/80">
                        Ambil gambar kain secara tegak lurus dengan jarak dekat agar tekstur sulaman benang emas dan pola motif terbaca jelas oleh arsitektur model.
                    </p>
                </div>
                <div class="border border-charcoal/15 bg-surface p-6" data-reveal>
                    <p class="text-xs font-semibold uppercase tracking-[0.15em] text-maroon">Pencahayaan</p>
                    <h3 class="mt-3 font-display text-xl font-bold">Cahaya Alami Netral</h3>
                    <p class="mt-3 text-xs leading-relaxed text-charcoal/80">
                        Gunakan penerangan siang hari yang merata tanpa filter atau bayangan tajam, terutama saat mengambil foto wajah untuk estimasi skintone.
                    </p>
                </div>
                <div class="border border-charcoal/15 bg-surface p-6" data-reveal>
                    <p class="text-xs font-semibold uppercase tracking-[0.15em] text-maroon">Konteks</p>
                    <h3 class="mt-3 font-display text-xl font-bold">Terhubung ke Arsip</h3>
                    <p class="mt-3 text-xs leading-relaxed text-charcoal/80">
                        Hasil analisis langsung terhubung ke arsip galeri. Anda dapat memeriksa asal daerah, filosofi kain, serta rekomendasi padu padan outfit.
                    </p>
                </div>
            </div>
        </div>
    </section>
@endsection
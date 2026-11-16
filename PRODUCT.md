# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Masyarakat umum yang tertarik budaya Lampung, pelajar dan mahasiswa yang mempelajari seni tradisi, serta peneliti budaya. Mereka menjelajah dari browser, sering dari ponsel, untuk mengenali kain tapis yang dilihat, memahami konteks motifnya, dan mencari ide padu padan.

## Product Purpose

KAINARA adalah arsip digital motif Tapis Lampung: katalog motif dengan sejarah dan filosofi, katalog outfit padu padan, dan identifikasi berbasis AI (klasifikasi motif dan estimasi skintone) yang terhubung ke API CNN. Bukan toko: tidak ada harga, transaksi, atau checkout. Pengunjung publik tidak login.

## Positioning

Satu tempat yang menghubungkan arsip budaya yang jujur dengan identifikasi AI yang dapat dipakai: pengunjung melihat foto kain, mendapat nama motif, asal daerah, cerita di baliknya, lalu rekomendasi outfit yang cocok dengan skintone mereka.

## Operating Context

Dibuka di desktop dan ponsel. Pengguna datang saat melihat kain tapis di acara budaya, pasar, atau konten media sosial, atau ketika mencari referensi busana tradisional. Scan dilakukan lewat unggah foto di browser.

## Capabilities and Constraints

- Galeri motif tapis dengan pencarian dan filter asal daerah.
- Katalog outfit dengan filter kategori, skintone, dan motif tapis.
- Scan motif tapis dan scan skintone berbasis model CNN di API terpisah (`ML_API_URL`, `ML_API_KEY`).
- Favorit dikelola di browser (`localStorage`), bukan akun.
- Panel admin terlindungi login: CRUD motif dan outfit, upload gambar.
- Tidak ada transaksi, harga, stok, atau akun pengunjung.
- Terminologi wajib Tapis Lampung, tidak boleh "batik".

## Brand Commitments

Nama KAINARA; panel admin memakai kredensial awal `admin@kainara.local` / `kainara2026` (diseeder, harus diganti). Seluruh aspek visual mengikuti brief Warm Cultural Editorial yang dikunci: palet 60/30/10 (cream `#FCF8F3`, gold `#F7E2C3`, fog `#F3F3F3`, maroon `#6D0F0F`), Playfair Display untuk heading, Plus Jakarta Sans untuk teks, sudut tajam tanpa box-shadow.

## Evidence on Hand

Enam motif tapis Lampung dengan sejarah dan filosofi di database: Cucuk Pinggir (Banda Lampung), Grevasia (Kotabumi), Ingin Sawa (Lampung Selatan), Sejarah (Lampung Tengah), Tanduk (Lampung Tengah), Sadis (Lampung Selatan). Empat outfit kurasi. Belum ada foto asli motif maupun outfit: saat ini memakai placeholder tipografis; admin dapat mengunggah gambar. Tidak ada testimoni, statistik, atau klaim sertifikasi.

## Product Principles

- Setiap klaim harus berasal dari database atau tidak ditampilkan.
- Arsip hadir sebelum penjualan: konteks dan cerita mendahului inspirasi busana.
- AI hanya membantu pengenalan, hasilnya harus bisa dilacak ke entri katalog.
- Sederhana dan cepat dimuat di ponsel; tidak ada transaksi yang bisa salah.
- Hormat pada budaya: bahasa jelas, tanpa sentimen romantisasi yang mengarang.

## Accessibility & Inclusion

Target WCAG AA: kontras teks, navigasi keyboard, fokus terlihat, dan dukungan `prefers-reduced-motion`.
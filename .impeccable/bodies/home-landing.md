# Surface: landing page (persuade)

- Scope: `/` (home.blade.php) only. Galeri, katalog, scan, admin stay as-is; nav and footer keep their current structure and wording.
- Audience: masyarakat umum, pelajar, peneliti budaya. Success: dalam satu viewport, pengunjung paham ini arsip Tapis Lampung dan bisa langsung memindai foto motif.
- Constraints: Warm Cultural Editorial 60/30/10 tetap dikunci (cream #FCF8F3, gold #F7E2C3, fog #F3F3F3, maroon #6D0F0F, charcoal #262525, garis #ECECEC), Playfair Display + Plus Jakarta Sans, sudut tajam tanpa box-shadow, tanpa e-commerce, tanpa kata "batik".

## Direction contract

THESIS: Halaman adalah satu gulungan kain tapis yang dibentangkan penuh: band warna full-bleed memisahkan isi, jahitan garis 1px menyambung band, dan foto kain menyilang jahitan di satu titik. Menolak hero terpusat + baris kartu seragam; warna dan irama datang dari band, bukan dekorasi.

OWN-WORLD: Ground cream #FCF8F3, band emas #F7E2C3 untuk zona scan, band fog #F3F3F3 untuk kurasi outfit, surface putih #FEFEFE untuk kartu bersih; maroon #6D0F0F hanya CTA, cap asal daerah, dan garis tab aktif; garis 1px #ECECEC sebagai jahitan; Playfair Display untuk judul (line-height 1.05, tracking -0.02em), Plus Jakarta Sans untuk teks dan label uppercase tracking 0.15em; radius 0 tanpa bayangan.

STORY: Pengunjung melihat nama dan wujud tapis, menemukan satu aksi (scan motif), lalu menuruni band ke kurasi motif dan outfit.

FIRST VIEWPORT: Nav krem datar dengan hairline; band hero cream asimetris (teks kiri ~55%, foto kain 4:5 kanan yang setengah menembus jahitan ke bawah); headline Playfair besar "Mengenali Tapis Lampung lewat motif dan konteksnya." dengan label maroon "ARSIP DIGITAL & IDENTIFIKASI AI" di atasnya, satu paragraf, CTA maroon "Scan Motif Tapis" + link garis "Jelajahi Galeri"; band emas scan (judul + dua tab + kotak upload putih garis putus-putus); awal band kurasi motif berupa kartu 4:5 bervariasi (bukan grid seragam).

FORM: Pilihan komposisi "Kain Terbentang" (dealt index 2, dibuat user lewat halaman keputusan). Comp gambar tidak tersedia (akun tanpa kredit): kanvas acuan komposisi adalah `.impeccable/mocks/decision/kain.html`. seed:66772d637a40d85c

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
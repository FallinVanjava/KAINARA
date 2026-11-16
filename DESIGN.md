# Design System — KAINARA

Warm Cultural Editorial, dikunci dari brief dan diwujudkan di landing page (`resources/views/home.blade.php`). Gaya: arsip budaya yang hangat dan editorial — band kain full-bleed, tipografi serif besar, garis rambut sebagai jahitan, tanpa dekorasi murahan.

## Mode

- Landing `/`: **Persuade**. Halaman lain (galeri, katalog, scan, admin): pertahankan sistem ini, jangan ubah tanpa kebutuhan.

## Tokens

### Warna (60/30/10)

| Token | Hex | Peran |
|---|---|---|
| `cream` | `#FCF8F3` | Ground 60%: kanvas halaman, navbar, area baca katalog |
| `gold` | `#F7E2C3` | 30%: blok konten terang (Direct Scan AI), frame placeholder, tombol Favorit |
| `fog` | `#F3F3F3` | 30%: blok konten terang (zona Kurasi Outfit) |
| `surface` | `#FEFEFE` | Kartu putih di atas band |
| `maroon` | `#6D0F0F` | 10%: CTA utama, badge di atas latar terang, tab aktif, teks eyebrow |
| `charcoal` | `#262525` | Teks |
| `line` | `#ECECEC` | Hairline: jahitan band, border kartu |

- Pasangan `charcoal`/opacity: gunakan `/80` untuk teks sekunder, `/70` untuk teks kecil di atas band berwarna, `/50` hanya untuk teks ≥ teks kecil di atas surface terang dan bukan informasi penting. Jangan abu-abu netral — tint dari charcoal.
- Maroon hanyalah aksi/stempel, bukan latar besar.
- Navbar `bg-cream` (kanvas sama), pemisah `border-b border-charcoal/10`; wordmark + link `charcoal`, hover `maroon`; tombol Favorit `bg-gold text-charcoal`, hover `bg-maroon text-cream`.
- Footer `bg-charcoal text-cream` sebagai bingkai bawah ("tinta" tipografi, bukan hue baru); teks sekunder `text-gold/80`, garis `border-gold/15`, link hover `text-gold`.
- Focus ring di footer pakai gold `#F7E2C3` (maroon tak kontras di charcoal) — sudah diatur di `app.css`.

### Tipografi

- Display: **Playfair Display** (600–700), `leading-[1.05]`, `tracking-[-0.02em]`, ukuran hero `text-[2.9rem]` → `text-6xl` → `lg:text-[4.6rem]`; section heading `text-4xl`; judul kartu `text-2xl`.
- Teks & label: **Plus Jakarta Sans**. Body `text-base`/`text-sm` `leading-relaxed`, ukur ≤ 65–75ch.
- Label mata (eyebrow/kicker): `text-xs` uppercase `tracking-[0.15em] font-semibold`, maroon atau `charcoal/60`.
- Nomor skala wajib jelas (hero → section → kartu → label), tanpa ukuran tengah yang tidak jelas perannya.

### Bentuk & kedalaman (Minimalis Bersih & Anti-Slop)

- **Minimalisme Hidup (Living Minimalism)**: 60% Warm Cream `#FCF8F3` sebagai kanvas dasar dan navbar. 30% Sekunder berupa `#FAF4ED` (zona direct scan AI), `#F3F3F3`/50 (zona outfit), surface kartu `#FEFEFE`, dan tombol Favorit soft gold `#F7E2C3`. 10% Aksen Deep Maroon `#6D0F0F` untuk tombol aksi primer, kicker kategori, dan pill asal daerah.
- **Bebas Elemen AI-Slop (antislop-ui)**:
  - Tanpa *colored left stripes* (garis vertikal dekoratif di sisi kiri kartu/deskripsi ditiadakan).
  - Tanpa *small arrows* di setiap tombol/link (label teks mandiri berbicara tanpa panah `→` dekoratif).
  - Tanpa *template 3-step filler* (seksi metrik kosong ditiadakan; fokus langsung pada alat dan data arsip).
  - Tanpa *decorative monospace number badges* (`01`, `02` buatan pada kartu motif dihapus).
- **Struktur Kartu & Bingkai**: Sudut tajam (`rounded-none`), tanpa `box-shadow`. Bingkai gambar menggunakan passe-partout putih (`bg-surface p-2` hingga `p-3` dengan `border border-charcoal/15`).
- **Hierarki Garis**: Hairline `border-charcoal/10` untuk pemisah seksi.

### Spasi & Tipografi

- Ritme vertikal lapang (`py-16` hingga `py-24`), kontainer `max-w-6xl px-6`.
- Kontras tipografi: Playfair Display untuk judul dengan aksen miring (*italic*) pada kata kunci, Plus Jakarta Sans untuk teks isi, metadata, dan kicker uppercase (`tracking-[0.18em]`).

## Komponen

- **Tombol solid**: `bg-maroon px-8 py-4 text-sm font-semibold text-cream hover:bg-charcoal`, sudut tajam tanpa panah dekoratif.
- **Tombol Favorit Nav**: `bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal hover:bg-maroon hover:text-cream`.
- **Badge asal daerah**: `bg-maroon px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-cream`.
- **Badge kategori outfit**: `bg-[#F7E2C3] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-charcoal`.
- **Kartu motif**: Matting putih dengan hairline border, badge daerah maroon, judul Playfair, seluruh kartu satu link dengan hover `scale-[1.02]`.
- **Kartu outfit**: Grid atau kartu surface bergaris tipis, tag skintone maroon, chip motif bergaris halus.
- **Nav & footer**: Nav krem hairline menyatu dengan kanvas atas; footer charcoal solid membingkai dasar halaman sebagai "tinta" tipografi.

## Motion & Performa (Ponytail YAGNI)

- Menggunakan fitur native browser: `scroll-behavior: smooth` dan CSS transitions.
- Dependensi GSAP ScrollTrigger dan Lenis dihapus dari runtime (-134 kB payload JS / -53%). Semua konten langsung tampil (zero risk of blank void / hydration delay).
- Menghormati `prefers-reduced-motion` secara alami via platform.

## Aksesibilitas

- WCAG AA: kontras teks (lihat aturan opacity di atas), fokus keyboard terlihat, target sentuh ≥ 44px, `alt` deskriptif dari nama motif/outfit.
- Bahasa Indonesia; larangan kata "batik"; tanpa em dash; klaim hanya dari database.

## Anti-pola (jangan dilakukan)

- Hero terpusat + baris kartu identik.
- Bayangan, radius besar, gradien dekoratif, ikon garis generik.
- Maroon sebagai latar luas atau teks abu-abu netral di atas band berwarna.
- Data/statistik yang tidak ada di database.

## Aturan Global Kualitas (ui-ux-pro-max, diterapkan semua halaman)

- Ring fokus keyboard: unlayered di `app.css`, `:focus-visible { outline: 2px solid #6D0F0F; outline-offset: 2px }` — berlaku semua elemen, mengalahkan `outline-none` utilitas. Jangan tambah ring per-komponen.
- `html { scroll-padding-top: 6rem }` — anchor dan fokus keyboard tidak tertutup nav sticky.
- `cursor: pointer` untuk `button:not(:disabled)`, `select`, `[role='tab']`.
- Label/dt/thead memakai `text-charcoal/70` (bukan /50) demi WCAG AA di atas cream/gold/fog.
- Tabel admin dibungkus `<div class="overflow-x-auto">` agar tidak meluber di layar sempit.
- Pola ringkasan error form: `<div id="form-errors" role="alert" tabindex="-1" x-init="$el.focus()">` di atas form + `@error` inline per field (motif form, outfit form, login).
- Judul halaman tanpa em dash; pemisah `': '`.
- Hover kartu konsisten: `transition-transform duration-500 group-hover:scale-[1.015]` pada `x-image-frame`.
- `prefers-reduced-motion` dihormati oleh sistem reveal (Native IntersectionObserver & CSS).

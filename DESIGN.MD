# design.md — Sistem Desain Website KAINARA

Dokumen ini adalah **sumber kebenaran visual** untuk website Kainara (landing edukasi + panel admin). Coding agent wajib membacanya sebelum membuat atau mengubah UI apa pun. Jika ada konflik antara dokumen ini dan kebiasaan bawaan agent, dokumen ini yang menang.

---

## 1. Identitas

- **Produk:** Kainara, aplikasi mobile untuk (1) scan motif tapis Lampung, (2) scan skintone untuk mencocokkan warna tapis dengan warna kulit, (3) rekomendasi outfit yang serasi dengan tapis tersebut.
- **Website:** dua bagian.
  - **Publik:** pengenalan aplikasi, katalog detail motif tapis, kuis interaktif.
  - **Admin:** kelola motif, outfit, soal kuis, akun pengguna, dan statistik aplikasi.
- **Audiens publik:** pelajar, wisatawan, pencinta budaya, calon pengguna aplikasi. Mayoritas membuka dari HP.
- **Audiens admin:** 1–5 pengelola konten. Mengutamakan kejelasan dan kecepatan kerja, bukan hiasan.
- **Bahasa antarmuka:** Indonesia, kalimat sentence case, nada hangat dan sopan ("kamu", bukan "Anda") di sisi publik; netral dan lugas di sisi admin.
- **Nuansa:** kain tapis, yaitu benang emas di atas dasar marun. Hangat, berbudaya, rapi. Bukan mewah-berlebihan dan bukan "startup biru-ungu".

## 2. Prinsip desain

1. **Satu momen yang diingat:** hero beranda (judul besar, angka yang menghitung naik, ilustrasi yang "disulam" dari kiri ke kanan). Bagian lain tenang dan disiplin.
2. **Warna mengikuti aplikasi mobile.** Web dan aplikasi harus terasa satu keluarga.
3. **Garis titik-titik (dotted)** adalah penanda struktur khas (diambil dari pembatas pada hero, menyerupai jahitan). Pakai untuk pemisah bagian dan pemisah menu, jangan untuk dekorasi acak.
4. **Konten nyata dahulu.** Gambar motif dan teks dari database adalah bintang halaman; antarmuka mengalah.
5. **Gerak hemat:** satu urutan masuk di hero, sisanya hanya respons terhadap aksi pengguna (hover, buka dropdown, jawaban kuis). Hormati `prefers-reduced-motion`.
6. **Aksesibel secara bawaan:** kontras cukup, fokus keyboard terlihat, target sentuh minimal 44px, teks alternatif gambar.

## 3. Warna — komposisi 60 / 30 / 10

| Porsi | Peran | Nama | Hex |
|---|---|---|---|
| **60%** | Latar utama | Krem | `#FFF8F0` |
| 60% | Permukaan kartu | Putih hangat | `#FFFFFF` |
| 60% | Permukaan redup (zebra tabel, input) | Krem tua | `#F5E9DC` |
| 60% | Garis & border | Krem garis | `#E8D8C8` |
| **30%** | Warna merek, header, blok CTA, footer, sidebar admin | Marun | `#7A1212` |
| 30% | Judul, teks utama | Marun tua | `#5E0F11` |
| 30% | Teks sekunder | Marun lembut | `#7A3A3A` |
| 30% | Hover tombol utama | Marun dalam | `#5E0F11` |
| **10%** | Angka statistik, ikon aktif, fokus, hover tautan, tanda kecil | Emas tua | `#96640F` |
| 10% | Emas di atas latar marun | Emas muda | `#E8C36A` |
| netral | Chip tidak aktif (seperti di aplikasi) | Abu | `#6F6F6F` |
| status | Sukses / bahaya / peringatan | Hijau, merah, kuning tua | `#2F6B3F` / `#B3261E` / `#8A5A00` |

**Aturan 60/30/10**
- Hitung berdasarkan luas tampilan satu halaman. Krem mendominasi; marun hadir sebagai blok tegas (header, satu blok CTA, footer), bukan di seluruh halaman; emas hanya potongan kecil.
- **Jangan memakai emas untuk blok besar atau latar teks.** Emas `#96640F` hanya untuk teks ≥ 18px atau ikon/garis. Di atas marun pakai emas muda `#E8C36A`.
- Tombol utama selalu marun dengan teks krem. Tombol sekunder: garis marun, latar transparan.
- Dilarang: gradien ungu/biru, bayangan abu pekat, pemakaian lebih dari satu warna aksen selain emas.

### Mode gelap (kelas `.dark`)

| Token | Hex |
|---|---|
| background | `#1B0E0E` |
| card / popover | `#2A1415` |
| muted | `#3A1D1E` |
| border | `rgba(246,233,220,.16)` |
| foreground | `#F6E9DC` |
| muted-foreground | `#D9C3B5` |
| primary (bar, tombol) | `#8F1A1A` dengan teks `#FFF8F0` |
| accent | `#E3B958` |

### Pemetaan ke token shadcn (`globals.css`)

Gunakan format yang dipakai shadcn pada versi terpasang (hex/oklch/HSL); nilai hex di atas adalah patokan.

| Token shadcn | Terang | Gelap |
|---|---|---|
| `--background` | `#FFF8F0` | `#1B0E0E` |
| `--foreground` | `#5E0F11` | `#F6E9DC` |
| `--card` | `#FFFFFF` | `#2A1415` |
| `--card-foreground` | `#5E0F11` | `#F6E9DC` |
| `--primary` | `#7A1212` | `#8F1A1A` |
| `--primary-foreground` | `#FFF8F0` | `#FFF8F0` |
| `--secondary` | `#F5E9DC` | `#3A1D1E` |
| `--secondary-foreground` | `#5E0F11` | `#F6E9DC` |
| `--muted` | `#F5E9DC` | `#3A1D1E` |
| `--muted-foreground` | `#7A3A3A` | `#D9C3B5` |
| `--accent` | `#96640F` | `#E3B958` |
| `--accent-foreground` | `#FFFFFF` | `#1B0E0E` |
| `--destructive` | `#B3261E` | `#E5645C` |
| `--border` / `--input` | `#E8D8C8` | `rgba(246,233,220,.16)` |
| `--ring` | `#96640F` | `#E3B958` |
| `--radius` | `1rem` | `1rem` |

Tambahkan juga token kustom: `--gold-on-maroon: #E8C36A`, `--chip-off: #6F6F6F`, `--success`, `--warning`.

## 4. Tipografi

| Peran | Font | Bobot | Catatan |
|---|---|---|---|
| Judul (H1–H3 situs) | **Playfair Display** | 600–700 | Serif elegan, selaras dengan judul di aplikasi |
| Teks, tombol, tabel, form | **Poppins** | 400 / 500 / 600 | Sama dengan aplikasi |
| Hero beranda | font bawaan komponen (Bricolage Grotesque + Newsreader) | | Biarkan dahulu; penyeragaman font adalah tugas opsional di fase polishing |

Muat lewat `next/font/google` (bukan tag `<link>`), dengan `display: swap` dan fallback `Georgia` / `system-ui`.

**Skala (mobile → desktop)**
- H1 halaman dalam: 32 → 48px, `line-height 1.1`
- H2 bagian: 26 → 36px, `1.2`
- H3 judul kartu: 18 → 20px, Poppins 600
- Teks: 16px, `line-height 1.65`; teks kecil 14px
- Panjang baris maksimal ~70 karakter (`max-w-prose`)
- Dilarang: huruf kapital semua untuk label, satu kata di judul diberi warna/italic berbeda, label kecil bertele-tele di atas judul.

## 5. Tata letak, jarak, bentuk

- **Grid:** kontainer `max-w-6xl` (1152px) untuk publik, padding sisi `px-5` mobile, `px-8` desktop. Admin: sidebar 260px + konten fluid `max-w-7xl`.
- **Skala jarak:** 4, 8, 12, 16, 24, 32, 48, 72, 112. Jarak antarbagian landing: 72px mobile, 112px desktop.
- **Radius:** kartu 20px; tombol, chip, dan input pencarian = pill (`rounded-full`) seperti di aplikasi; input form 12px; gambar di kartu mengikuti radius atas kartu.
- **Bayangan:** satu level lembut bertinta marun: `0 8px 24px -12px rgba(94,15,17,.25)`. Tidak ada bayangan lain.
- **Breakpoint:** 640 / 768 / 1024 / 1280. Rancang mobile-first.
- **Ikon:** `lucide-react`, stroke 1.75, ukuran 20px (24px untuk fitur). Ikon aktif berwarna emas atau marun.

## 6. Komponen inti

**Tombol**
- Utama: pill, marun, teks krem, tinggi 44px, hover marun dalam, fokus cincin emas 2px.
- Sekunder: pill, border marun 1.5px, teks marun.
- Hantu/ikon: transparan, hover latar `muted`.
- Berbahaya: merah `#B3261E`, hanya di dialog konfirmasi hapus.

**Chip filter** (kategori, filter warna): pill. Aktif = marun + teks krem; tidak aktif = abu `#6F6F6F` + teks putih. Persis gaya aplikasi.

**Kartu motif** (dipakai di beranda dan katalog)
```
┌──────────────────┐
│   gambar 4:5     │  radius atas 20px, object-cover
│                  │
├──────────────────┤
│ Pucuk Rebung     │  Poppins 600, marun tua
│ Motif berbentuk  │  2 baris, teks marun lembut, line-clamp-2
│ segitiga meru... │
└──────────────────┘
```
Hover: gambar zoom 1.03 halus + judul berubah emas tua. Seluruh kartu adalah satu tautan.

**Input pencarian:** pill putih, ikon kaca pembesar di kiri, placeholder "Cari nama motif, asal daerah…".

**Garis titik-titik:** `border-top: 2px dotted var(--border)` (atau `border-left` untuk pemisah vertikal).

**Form admin:** label di atas, bantuan di bawah, error merah dengan teks jelas. Validasi dengan zod + react-hook-form. Tombol simpan terkunci selama proses.

**Tabel admin:** header krem tua, teks marun, baris hover `muted`, aksi di kolom kanan (ikon + tooltip), paginasi di bawah, kolom status berupa badge.

**Badge:** Terbit = hijau lembut; Draf = abu; Admin = marun; Nonaktif = merah lembut.

**Toast:** `sonner`, kata kerja konsisten ("Motif disimpan", "Motif dihapus").

**Dialog konfirmasi hapus:** menyebut nama item, tombol berbahaya berlabel "Hapus motif" (bukan "Ya").

**Skeleton:** warna `muted`, bentuk sama dengan konten asli. **Keadaan kosong:** satu kalimat penjelasan + satu tombol aksi.

## 7. Halaman publik

### 7.1 Beranda `/`

Hero memakai komponen **SketchCityHero** apa adanya (jangan ubah tata letak komponen; tema warna lewat `kainara-hero.css`, pembungkus `kainara-hero.tsx`).

```
┌──────────────────────────────────────────────────────┐
│ [pin] KAINARA   Motif Tapis ▾ ┆ Kuis Tapis   ⌕ ♡ ☰   │  bar marun, teks krem
├──────────────────────────────────────────────────────┤
│ Warna yang Pas                                       │
│ untuk Gayamu                       ╭─ ilustrasi ─╮   │
│ 5 motif tapis, 5 rekomendasi       │  menjorok   │   │
│ outfit, 8 pilihan skintone.        │  ke kanan   │   │
│ Temukan tapis yang sesuai …        ╰─────────────╯   │
└──────────────────────────────────────────────────────┘
```
Angka pada baris statistik **diambil dari Supabase** (jumlah baris `motifs` terbit, `outfits` terbit, `skintones`), bukan hardcode.

Urutan bagian setelah hero:

1. **Fitur** — tiga kolom dipisah garis titik-titik vertikal (bukan tiga kartu identik): *Scan motif* (ikon `ScanLine`), *Scan skintone* (`Palette`), *Rekomendasi outfit* (`Shirt`). Masing-masing: ikon emas, judul H3, satu kalimat.
2. **Cara kerja** — tiga langkah berurutan (penomoran memang tepat karena ini urutan nyata): 1) Pindai kain tapis, 2) Pindai warna kulitmu, 3) Lihat outfit yang serasi. Tampilan horizontal desktop, vertikal mobile, dihubungkan garis titik-titik.
3. **Cuplikan motif** — 4 kartu motif terbaru dari DB + tombol "Lihat semua motif".
4. **Blok kuis (marun, satu-satunya blok marun besar di tengah halaman)** — "Seberapa kenal kamu dengan tapis Lampung?" + tombol krem "Mulai kuis".
5. **Unduh aplikasi** — penjelasan singkat + tombol unduh (URL dari `NEXT_PUBLIC_APP_DOWNLOAD_URL`; sembunyikan tombol jika belum diisi).
6. **Footer** — marun tua: nama, tautan (Motif, Kuis, Unduh), kredit budaya, hak cipta.

### 7.2 Katalog motif `/motif`

- Judul + deskripsi satu kalimat, input pencarian pill, deretan chip filter warna dominan (Semua, Emas, Marun, Hitam, Putih, …).
- Grid kartu motif: 2 kolom mobile, 3 tablet, 4 desktop.
- Pencarian dan filter lewat query string (`?q=&warna=`), dirender di server.
- Keadaan kosong: "Belum ada motif yang cocok. Coba kata kunci lain."

### 7.3 Detail motif `/motif/[slug]`

```
[ breadcrumb: Motif › Pucuk Rebung ]
┌─────────────┐  Pucuk Rebung  (H1)
│ gambar besar│  Asal: Lampung  · chip warna dominan
│             │  deskripsi
└─────────────┘
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  (dotted)
Makna dan filosofi        | Sejarah
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
Cocok untuk skintone  → deretan lingkaran warna (hex_color) + nama + skor + catatan
Outfit terkait        → kartu outfit
[ Coba scan di aplikasi Kainara ]  (CTA unduh)
```
Skintone ditampilkan sebagai swatch lingkaran dengan batang skor tipis (marun). Metadata SEO dan Open Graph per motif.

### 7.4 Kuis `/kuis`

- **Layar mulai:** judul, deskripsi (10 soal acak), tombol "Mulai kuis".
- **Layar soal:** satu soal per layar, progress bar marun, pilihan sebagai tombol lebar (tinggi ≥ 52px). Setelah memilih: jawaban benar ditandai hijau, salah merah, muncul penjelasan, tombol "Soal berikutnya". Gerak singkat (≤ 250ms) hanya sebagai respons terhadap pilihan.
- **Layar hasil:** skor besar (Playfair), badge level — 0–3 "Pemula Tapis", 4–6 "Penikmat Tapis", 7–8 "Pegiat Tapis", 9–10 "Pakar Tapis" — tombol "Ulangi kuis", "Bagikan", dan tautan ke motif yang salah dijawab.
- Soal tidak boleh membocorkan jawaban di DOM sebelum dijawab selama masih memungkinkan secara teknis; minimal jangan tampilkan penanda jawaban benar.

## 8. Panel admin

**Kerangka:** sidebar marun (260px; teks krem; item aktif memiliki penanda emas muda di kiri), topbar tipis dengan nama pengguna dan tombol keluar. Mobile: sidebar menjadi drawer.

Menu: **Dashboard · Motif · Outfit · Kuis · Pengguna**.

```
┌────────┬─────────────────────────────────────────┐
│ KAINARA│  Dashboard                  [7 hari ▾]  │
│        │  ┌────┐ ┌────┐ ┌────┐ ┌────┐             │
│ ▌Dash  │  │KPI │ │KPI │ │KPI │ │KPI │             │
│  Motif │  └────┘ └────┘ └────┘ └────┘             │
│  Outfit│  ┌──────────────────────┐ ┌───────────┐  │
│  Kuis  │  │ Scan per hari (garis)│ │ Skintone  │  │
│  Peng. │  └──────────────────────┘ │  (pie)    │  │
│        │  ┌──────────────────────┐ └───────────┘  │
│        │  │ 10 motif terpopuler  │ ┌───────────┐  │
│        │  └──────────────────────┘ │ Skor kuis │  │
└────────┴─────────────────────────────────────────┘
```

**Dashboard**
- Filter rentang: 7 / 30 / 90 hari + rentang kustom. Default 30 hari.
- Kartu KPI (6): Total pengguna, Pengguna baru 7 hari, Scan motif, Scan skintone, Percobaan kuis, Rata-rata skor kuis (persen).
- Grafik (Recharts, responsif, ada tooltip dan sumbu berlabel):
  - **Garis:** scan per hari — seri *Scan motif* marun `#7A1212`, seri *Scan skintone* emas `#96640F`.
  - **Batang horizontal:** 10 motif paling sering di-scan — marun.
  - **Pie/donat:** distribusi skintone — **setiap irisan memakai `hex_color` skintone itu sendiri**, dengan label nama.
  - **Angka besar + indikator:** rata-rata skor kuis dan jumlah percobaan.
- Data kosong: tampilkan keadaan kosong ("Belum ada data scan pada rentang ini"), jangan grafik kosong.
- Kartu KPI: angka Playfair besar, label kecil Poppins, ikon emas; tanpa gradien.

**Tabel motif/outfit/kuis/pengguna:** cari, urutkan, paginasi, tombol "Tambah …" di kanan atas. Form tambah/ubah berupa halaman terpisah (bukan modal) agar mudah di mobile. Toggle "Terbitkan" langsung di tabel.

**Form motif:** nama, slug (otomatis dari nama, bisa diubah), asal daerah, deskripsi, makna filosofi, sejarah, warna dominan (input tag), unggah gambar dengan pratinjau, editor kecocokan skintone (pilih skintone → skor 0–100 → catatan; bisa banyak baris), toggle terbit.

**Form outfit:** nama, deskripsi, kategori (adat/formal/kasual/modern), warna utama, gambar, multi-pilih motif terkait, toggle terbit.

**Form kuis:** pertanyaan, 2–6 pilihan, penanda pilihan yang benar (disimpan sebagai **indeks mulai 0**), penjelasan, motif terkait (opsional), toggle terbit.

**Pengguna:** pencarian, filter peran/status, ubah peran, aktifkan/nonaktifkan, detail + riwayat scan terakhir. Admin tidak bisa mengubah role/status dirinya sendiri (disembunyikan di UI dan diblokir di database).

## 9. Gerak

- **Hero:** animasi bawaan komponen (judul naik per kata, angka menghitung, ilustrasi "tersulam"). Jangan ditambah atau diubah.
- **Selain hero:** hanya transisi respons (hover kartu, buka dropdown, jawaban kuis, toast). Durasi 150–250ms, easing `cubic-bezier(.2,.7,.2,1)`.
- Dilarang: fade-slide-up di setiap bagian saat scroll, efek parallax tambahan, animasi dekoratif yang berulang.
- Semua animasi mati di bawah `prefers-reduced-motion: reduce`.

## 10. Aksesibilitas dan performa

- Kontras teks ≥ 4.5:1 (≥ 3:1 untuk teks besar). Cek khusus: abu `#6F6F6F` hanya untuk teks putih di chip; emas `#96640F` bukan untuk teks kecil.
- Semua kontrol bisa dioperasikan keyboard; `:focus-visible` berupa cincin emas 2px offset 2px.
- Target sentuh ≥ 44×44px. Gambar bermakna punya `alt` deskriptif ("Kain tapis motif Kapal dengan sulam benang emas"); gambar dekoratif `alt=""`.
- Gambar lewat `next/image` dengan `sizes` yang tepat; gambar di atas lipatan diberi `priority`.
- Halaman publik dirender di server (Server Components); ISR atau `revalidate` untuk katalog agar cepat. Tidak ada layout shift saat gambar dimuat.
- Hormati `prefers-color-scheme`; sediakan tombol tema terang/gelap di footer atau menu.

## 11. Tulisan (microcopy)

- Kalimat sentence case, kata kerja aktif, konsisten. Tombol menyebut hasilnya: "Simpan motif", "Hapus motif", "Mulai kuis", "Unduh aplikasi".
- Konfirmasi memakai kata kerja yang sama: tombol "Simpan motif" → toast "Motif disimpan".
- Error menjelaskan apa yang terjadi dan cara memperbaikinya, tanpa permintaan maaf berlebihan: "Gambar terlalu besar. Pilih berkas JPG, PNG, atau WebP di bawah 5 MB."
- Hindari klise ("jelajahi keajaiban…"). Tulis konkret: "Pindai kain tapis, lihat nama motif dan maknanya."
- Istilah baku: *motif*, *tapis*, *skintone* (dicetak biasa), *outfit*, *pindai/scan* (pakai "scan" di label fitur agar sama dengan aplikasi).

## 12. Pemetaan data → UI

| UI | Sumber |
|---|---|
| Angka hero | `count` tabel `motifs` (terbit), `outfits` (terbit), `skintones` |
| Katalog & detail motif | `motifs` + `motif_skintone_match` + `skintones` + `outfit_motif` + `outfits` |
| Kuis | RPC `get_random_quiz(10)`; simpan hasil ke `quiz_attempts` |
| KPI dashboard | RPC `admin_dashboard_summary()` |
| Garis scan | RPC `admin_scan_per_day(p_start, p_end)` |
| Motif terpopuler | RPC `admin_top_motifs(p_start, p_end, p_limit)` |
| Pie skintone | RPC `admin_skintone_distribution()` |
| Statistik kuis | RPC `admin_quiz_stats(p_start, p_end)` |
| Gambar | Storage bucket `motifs`, `outfits` |

Skema database final ada di `docs/kainara_schema.sql`. **Jangan mengubah skema.**

## 13. Daftar larangan

- Jangan memakai `SUPABASE_SERVICE_ROLE_KEY` di komponen client atau mengawali variabelnya dengan `NEXT_PUBLIC_`.
- Jangan mengubah tata letak komponen SketchCityHero; hanya tema warna dan props.
- Jangan menambah warna aksen baru di luar palet.
- Jangan menaruh teks penting di dalam gambar.
- Jangan membuat kartu identik berderet untuk bagian fitur; ikuti pola kolom bergaris titik.
- Jangan menampilkan data mentah atau error teknis ke pengguna; tampilkan pesan ramah dan catat detailnya di log server.
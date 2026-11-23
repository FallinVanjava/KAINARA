# MEGAPROMPT — Website Kainara (Landing Edukasi + Panel Admin + Statistik)

> **Cara pakai:** salin seluruh isi file ini sebagai prompt pertama ke coding agent Anda (Claude Code, Cursor, dll.). Pastikan sebelumnya file berikut sudah ada di proyek:
> `docs/kainara_schema.sql`, `design.md`, `components/ui/sketch-city-hero.tsx`, `kainara-hero.css`, `kainara-hero.tsx`.
> Isi `.env.local` sendiri. **Jangan menempel secret key di chat.**

---

## PERAN DAN TUJUAN

Kamu adalah engineer full-stack senior sekaligus desainer front-end. Bangun website **Kainara**: aplikasi mobile Kainara memindai motif kain tapis Lampung, memindai skintone untuk mencocokkan warna tapis dengan warna kulit, dan merekomendasikan outfit. Website ini punya dua bagian:

- **Publik:** landing page pengenalan aplikasi, katalog dan detail motif tapis, kuis interaktif.
- **Admin:** kelola motif, outfit, soal kuis, pengguna, dan lihat statistik penggunaan aplikasi.

Website dan aplikasi mobile memakai **satu database Supabase yang sama**. Perubahan di panel admin harus langsung terlihat di aplikasi mobile.

## BAHAN WAJIB DIBACA SEBELUM MENULIS KODE

1. `docs/kainara_schema.sql` — skema database final (tabel, RLS, fungsi RPC, storage). **Sumber kebenaran data.**
2. `design.md` — sistem desain final (warna 60/30/10, tipografi, komponen, wireframe, aturan). **Sumber kebenaran visual.**
3. `components/ui/sketch-city-hero.tsx`, `kainara-hero.css`, `kainara-hero.tsx` — hero beranda.

Jika `PROJECT.md` belum ada, buat dengan ringkasan di bagian "Peran dan Tujuan" di atas.

## ATURAN KERJA (BERLAKU DI SEMUA FASE)

1. **Jangan mengubah skema database.** Pakai nama tabel, kolom, dan fungsi RPC persis seperti di `docs/kainara_schema.sql`. Jika menurutmu skema perlu diubah, **berhenti dan jelaskan alasannya**; jika disetujui, tulis SQL-nya di file terpisah (`docs/perubahan_NN.sql`) untuk saya jalankan sendiri di Supabase.
2. **Jangan mengubah tata letak `SketchCityHero`.** Hanya props dan tema warna (`kainara-hero.css`). Periksa baris `].join(` di komponen: separatornya harus `"\n"` dalam satu baris; perbaiki jika rusak.
3. **Keamanan:**
   - `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di kode server (server action, route handler), tidak boleh masuk bundle client dan tidak boleh berawalan `NEXT_PUBLIC_`.
   - Untuk otorisasi, selalu pakai `supabase.auth.getUser()` di server (bukan `getSession()`).
   - Setiap server action admin memverifikasi lagi bahwa pemanggil adalah admin aktif, walaupun middleware sudah memblokir.
   - Validasi semua input di server dengan zod. Jangan percaya data dari client.
4. **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (diisi publishable key), `SUPABASE_SERVICE_ROLE_KEY` (secret key, server saja), `NEXT_PUBLIC_APP_DOWNLOAD_URL` (opsional), `NEXT_PUBLIC_SITE_URL`. Buat `.env.example` tanpa nilai asli.
5. **Stack:** Next.js terbaru (App Router, TypeScript strict), Tailwind CSS, shadcn/ui, `@supabase/supabase-js` + `@supabase/ssr`, `zod`, `react-hook-form` + `@hookform/resolvers`, `recharts`, `sonner`, `lucide-react`, `date-fns`. Ikuti konvensi versi Next.js yang terpasang (mis. `middleware.ts` atau `proxy.ts` pada versi yang memakai nama baru). Jangan menambah library besar lain tanpa alasan.
6. **Server Components secara default;** `"use client"` hanya untuk bagian interaktif. Setelah mutasi admin, panggil `revalidatePath` untuk halaman publik yang terdampak.
7. **UI berbahasa Indonesia**, mengikuti `design.md` (nada, label tombol, pesan error). Data kosong, loading (skeleton), dan error harus ditangani di setiap halaman.
8. **Kualitas:** setiap fase harus lolos `npm run build` dan `npm run lint` tanpa error, tanpa `any` yang tidak perlu, dan tanpa `console.log` tertinggal.
9. **Aksesibilitas dan responsif** adalah syarat, bukan tambahan: mobile-first, fokus keyboard terlihat, target sentuh ≥ 44px, `alt` gambar bermakna, `prefers-reduced-motion` dihormati.
10. **Mode kerja:** kerjakan **satu fase, lalu berhenti** dan laporkan hasilnya dengan format laporan di bawah. Tunggu saya mengetik "lanjut" sebelum fase berikutnya. (Jika saya menulis "kerjakan semua", jalankan semua fase berurutan, tetapi tetap lakukan verifikasi dan laporan singkat di tiap fase.)

### Format laporan di akhir tiap fase

- Apa yang dibuat (daftar file penting).
- Hasil `build` dan `lint`.
- Cara saya mengujinya secara manual (langkah singkat).
- Hal yang kamu putuskan sendiri atau asumsikan.
- Pertanyaan yang butuh jawaban saya (jika ada).

---

## FASE 1 — Fondasi proyek

**Tujuan:** proyek jalan, tema Kainara terpasang, koneksi ke Supabase terbukti.

1. Inisialisasi Next.js (App Router, TypeScript, Tailwind, alias `@/*`). Jalankan `shadcn init`, lalu tambah komponen: `button, input, textarea, label, select, checkbox, switch, badge, table, dialog, alert-dialog, dropdown-menu, tabs, skeleton, tooltip, sheet, separator, form, calendar, popover`. Pasang `sonner` untuk toast.
2. Pasang token warna dari `design.md` §3 ke `app/globals.css` (mode terang dan `.dark`) serta token kustom (`--gold-on-maroon`, `--chip-off`, `--success`, `--warning`). Atur `--radius: 1rem`.
3. Muat font lewat `next/font/google`: **Playfair Display** (judul) dan **Poppins** (teks). Terapkan skala tipografi `design.md` §4.
4. Letakkan `kainara-hero.css` di `app/` dan impor di `globals.css`. Pastikan `components/ui/sketch-city-hero.tsx` dan `components/kainara-hero.tsx` ada.
5. Struktur folder:
   ```
   app/(public)/(home)/page.tsx
   app/(public)/(inner)/layout.tsx      ← memakai SiteHeader + SiteFooter
   app/(public)/(inner)/motif/...
   app/(public)/(inner)/kuis/...
   app/admin/(auth)/login/page.tsx
   app/admin/(panel)/layout.tsx         ← sidebar admin
   lib/supabase/{client.ts,server.ts,admin.ts,middleware.ts}
   lib/validators/   lib/queries/   lib/utils.ts
   types/database.ts                    ← tipe sesuai docs/kainara_schema.sql
   components/{site,admin,motif,quiz,charts}/
   ```
6. Buat tiga klien Supabase: browser, server (cookies), dan admin (`service_role`, diberi komentar peringatan dan `import "server-only"`).
7. Buat `types/database.ts` yang mencerminkan semua tabel dan fungsi RPC di file SQL.
8. Buat halaman sementara `/tes-koneksi` yang membaca `motifs` dan `skintones` dan menampilkan JSON, serta mencoba memanggil `get_random_quiz(3)`. Tampilkan pesan error yang jelas bila gagal.
9. Konfigurasi `next.config` agar `next/image` mengizinkan domain Supabase Storage (`remotePatterns` dari `NEXT_PUBLIC_SUPABASE_URL`) dan, selama masih dipakai, domain gambar hero.

**Selesai bila:** `/tes-koneksi` menampilkan 5 motif, 8 skintone, 3 soal kuis; build dan lint lolos; font dan warna terpasang. **Hapus `/tes-koneksi` di fase 11.**

---

## FASE 2 — Landing page (beranda)

**Tujuan:** beranda sesuai `design.md` §7.1.

1. Buat `lib/queries/home.ts`: hitung `motifs` terbit, `outfits` terbit, `skintones` (`select('*', { count: 'exact', head: true })`), dan ambil 4 motif terbit terbaru. Server-side, dengan `revalidate` (mis. 300 detik).
2. `app/(public)/(home)/page.tsx` merender `KainaraHero` dengan angka dari database. Pada layout beranda **jangan** pasang `SiteHeader` karena hero sudah punya header sendiri.
3. Bagian setelah hero, berurutan:
   - **Fitur:** tiga kolom dipisah garis titik-titik vertikal (ikon `ScanLine`, `Palette`, `Shirt`, berwarna emas). Bukan tiga kartu identik.
   - **Cara kerja:** tiga langkah berurutan (horizontal di desktop, vertikal di mobile), dihubungkan garis titik-titik.
   - **Cuplikan motif:** 4 kartu motif (komponen `MotifCard` reusable) + tombol "Lihat semua motif".
   - **Blok kuis:** blok marun penuh lebar, tombol krem "Mulai kuis".
   - **Unduh aplikasi:** teks singkat + tombol dari `NEXT_PUBLIC_APP_DOWNLOAD_URL` (sembunyikan jika kosong).
4. `SiteFooter` marun tua (dipakai juga di halaman dalam) dan `SiteHeader` bergaya sama dengan bar hero (marun, teks krem) untuk halaman dalam. Menu mobile memakai `Sheet`.
5. Metadata SEO + Open Graph beranda, `app/sitemap.ts`, `app/robots.ts`, halaman `not-found.tsx` bertema Kainara.
6. Tombol tema terang/gelap (mis. di footer), memakai kelas `.dark`.

**Selesai bila:** beranda tampil benar di 360px, 768px, dan 1280px; hero beranimasi; komposisi warna mengikuti 60/30/10; angka hero berubah saat data di Supabase berubah; skor Lighthouse mobile: Aksesibilitas ≥ 95.

---

## FASE 3 — Katalog dan detail motif

**Tujuan:** `design.md` §7.2 dan §7.3.

1. `/motif`: judul, input pencarian pill, chip filter warna dominan (dibentuk dari data), grid `MotifCard` (2/3/4 kolom). Pencarian dan filter lewat query string (`?q=&warna=`), dirender di server. Gunakan `ilike` pada `nama` dan `daerah_asal`; filter warna dengan operator array (`warna_dominan @> {warna}`). Paginasi atau "Muat lebih banyak" bila data > 12.
2. `/motif/[slug]`: gambar besar, nama, asal, chip warna, deskripsi, bagian makna dan sejarah (dipisah garis titik-titik), **skintone yang cocok** (swatch lingkaran dari `hex_color`, nama, skor, catatan; urut skor tertinggi), **outfit terkait** (dari `outfit_motif`), CTA unduh aplikasi.
3. `generateMetadata` per motif (judul, deskripsi, gambar OG); `generateStaticParams` untuk motif terbit dengan `revalidate`. Slug tidak ditemukan atau draf → `notFound()`.
4. Komponen kartu outfit (`OutfitCard`) untuk dipakai ulang.
5. Skeleton (`loading.tsx`) untuk kedua halaman. Gambar memakai `next/image` + `sizes`.

**Selesai bila:** pencarian, filter, dan detail bekerja dengan data seed; motif draf tidak tampil publik; tautan antar halaman benar.

---

## FASE 4 — Kuis interaktif

**Tujuan:** `design.md` §7.4.

1. `/kuis`: layar mulai → soal → hasil, sebagai komponen client dengan state yang rapi (`useReducer`).
2. Ambil soal lewat RPC `get_random_quiz(10)` di server (atau route handler) dan kirim ke client. Ingat: `opsi` adalah array JSON, `jawaban_benar` adalah **indeks mulai 0**. Jika soal < 10, pakai berapa pun yang tersedia dan sesuaikan teks.
3. Satu soal per layar, progress bar, pilihan tombol lebar, umpan balik benar/salah + penjelasan setelah memilih, tombol "Soal berikutnya". Pilihan tidak bisa diubah setelah dijawab. Navigasi keyboard penuh (angka 1–4 memilih).
4. Halaman hasil: skor besar, badge level (0–3 Pemula, 4–6 Penikmat, 7–8 Pegiat, 9–10 Pakar Tapis), "Ulangi kuis", "Bagikan" (Web Share API, fallback salin tautan), dan daftar motif terkait dari soal yang salah.
5. Simpan ke `quiz_attempts` lewat server action: `user_id` diisi jika login, `null` jika tamu; validasi `skor ≤ total`. Tangani gagal simpan tanpa merusak pengalaman (pengguna tetap melihat hasil).

**Selesai bila:** kuis bisa diselesaikan sebagai tamu, baris baru muncul di `quiz_attempts`, tampilan nyaman di mobile.

---

## FASE 5 — Autentikasi dan proteksi admin

1. `/admin/login`: form email + password (zod + react-hook-form), tombol "Masuk", pesan error ramah ("Email atau kata sandi salah"). Tidak ada pendaftaran publik untuk admin.
2. Middleware (atau `proxy.ts`): segarkan sesi Supabase di setiap request; untuk `/admin/*` (kecuali `/admin/login`) wajib login **dan** `profiles.role = 'admin'` **dan** `is_active = true`; jika tidak, arahkan ke `/admin/login` (pengguna biasa yang login diberi pesan "Akun ini tidak memiliki akses admin"). Sudah login sebagai admin dan membuka `/admin/login` → arahkan ke `/admin`.
3. Helper server `requireAdmin()` dipakai di semua server action dan halaman admin sebagai lapisan kedua.
4. Layout admin sesuai `design.md` §8: sidebar marun (Dashboard, Motif, Outfit, Kuis, Pengguna), topbar dengan nama pengguna dan tombol "Keluar" (server action `signOut`). Mobile: sidebar menjadi `Sheet`.
5. Halaman `/admin` sementara berisi placeholder "Selamat datang, {nama}".

**Selesai bila:** pengguna tanpa login atau non-admin tidak bisa masuk `/admin`; admin bisa login dan keluar; sesi bertahan setelah refresh.

---

## FASE 6 — Admin: kelola Motif

1. `/admin/motif`: tabel (gambar mini, nama, asal, warna, status terbit, tanggal), pencarian, urutan, paginasi, toggle "Terbitkan", tombol "Tambah motif", aksi Ubah/Hapus (dialog konfirmasi menyebut nama motif).
2. `/admin/motif/baru` dan `/admin/motif/[id]/ubah` memakai satu komponen form (`MotifForm`): nama, slug (otomatis dari nama, unik, bisa diubah), asal daerah, deskripsi, makna filosofi, sejarah, warna dominan (input tag), unggah gambar, toggle terbit.
3. **Editor kecocokan skintone:** daftar baris dinamis (pilih skintone, skor 0–100, catatan). Simpan ke `motif_skintone_match` dengan cara yang atomik (hapus lalu sisipkan ulang dalam satu aksi, atau upsert + hapus yang dibuang).
4. **Unggah gambar** ke bucket `motifs`: validasi tipe (JPG/PNG/WebP) dan ukuran ≤ 5 MB di client **dan** server, nama berkas aman (`slug-timestamp.ext`), pratinjau, tombol ganti/hapus. Hapus berkas lama dari storage saat gambar diganti atau motif dihapus.
5. Validasi zod bersama (`lib/validators/motif.ts`) dipakai form dan server action. Tangani slug duplikat dengan pesan jelas.
6. Setelah simpan/hapus: toast ("Motif disimpan", "Motif dihapus"), `revalidatePath('/')`, `/motif`, dan `/motif/[slug]`.

**Selesai bila:** saya bisa menambah, mengubah, menerbitkan, menyembunyikan, dan menghapus motif, dan perubahan langsung terlihat di situs publik.

---

## FASE 7 — Admin: kelola Outfit dan soal Kuis

1. **Outfit** (`/admin/outfit`): pola identik dengan motif. Form: nama (unik), deskripsi, kategori (adat/formal/kasual/modern), warna utama, gambar (bucket `outfits`), multi-pilih motif terkait (`outfit_motif`, simpan atomik), toggle terbit. Ekstrak komponen tabel dan upload gambar agar dipakai ulang, bukan disalin.
2. **Kuis** (`/admin/kuis`): tabel soal (pertanyaan, motif terkait, status), cari, paginasi, toggle terbit. Form: pertanyaan (unik), 2–6 pilihan dinamis, pilihan benar (radio; **disimpan sebagai indeks mulai 0**, pastikan tetap benar saat pilihan diurutkan/dihapus), penjelasan, motif terkait (opsional), terbit. Tampilkan pratinjau soal.
3. Tambahkan pesan kesalahan ramah untuk pelanggaran unik (`pertanyaan`, `nama`).

**Selesai bila:** CRUD outfit dan soal kuis berfungsi; soal baru muncul di `/kuis`; outfit terkait tampil di halaman detail motif.

---

## FASE 8 — Admin: kelola Pengguna

1. `/admin/pengguna`: tabel `profiles` (nama, email, peran, status, skintone terakhir, tanggal daftar), pencarian, filter peran dan status, paginasi.
2. Aksi lewat server action (verifikasi admin, lalu gunakan klien `service_role` hanya jika perlu): ubah peran (user/admin), aktifkan/nonaktifkan akun. **Admin tidak boleh mengubah peran atau status dirinya sendiri:** sembunyikan kontrolnya di UI, tolak di server, dan tangani error database (kode `42501`) dengan pesan ramah.
3. Dialog konfirmasi untuk setiap perubahan peran dan penonaktifan, menyebut nama pengguna.
4. Halaman detail `/admin/pengguna/[id]`: info profil, skintone terakhir (swatch), 20 riwayat scan terakhir (tipe, motif/skintone, waktu), jumlah percobaan kuis.
5. Jangan menampilkan atau mencatat kata sandi/token apa pun.

**Selesai bila:** saya bisa menaikkan dan menurunkan peran pengguna lain, menonaktifkan akun (akun nonaktif tidak bisa lagi menulis `scan_logs`), dan percobaan mengubah diri sendiri ditolak dengan jelas.

---

## FASE 9 — Dashboard statistik

**Tujuan:** `design.md` §8 (Dashboard). **Jangan menulis query agregasi sendiri;** pakai RPC yang sudah ada.

1. Filter rentang tanggal (7 / 30 / 90 hari + kustom, default 30), disimpan di query string (`?dari=&sampai=`) agar bisa dibagikan. Hitung tanggal dalam zona waktu `Asia/Jakarta`.
2. Ambil data di server, paralel (`Promise.all`):
   - `admin_dashboard_summary()` → kartu KPI: `total_pengguna`, `pengguna_baru_7hari`, `total_scan_motif`, `total_scan_skintone`, `total_percobaan_kuis`, `rata_rata_skor_kuis` (persen).
   - `admin_scan_per_day(p_start, p_end)` → grafik garis (seri `scan_motif` marun, `scan_skintone` emas).
   - `admin_top_motifs(p_start, p_end, p_limit := 10)` → batang horizontal (marun).
   - `admin_skintone_distribution()` → donat; **warna irisan = `hex_color`** tiap skintone.
   - `admin_quiz_stats(p_start, p_end)` → angka besar rata-rata skor dan jumlah percobaan.
3. Komponen grafik (`components/charts/*`) berupa client component Recharts yang responsif (`ResponsiveContainer`), dengan tooltip berbahasa Indonesia, sumbu berlabel, legenda, dan format tanggal `d MMM`. Warna dari token desain.
4. Setiap kartu/grafik punya `Suspense` + skeleton sendiri, dan **keadaan kosong** yang informatif ("Belum ada data scan pada rentang ini") bila hasil nol.
5. Tambahkan tombol "Ekspor CSV" untuk data scan per hari (dibuat di server atau client dari data yang sudah ada).
6. Tangani error RPC (mis. akses ditolak) dengan pesan ramah dan tombol "Coba lagi".

**Selesai bila:** dengan data seed (scan kosong) dashboard menampilkan keadaan kosong tanpa error; setelah saya memasukkan beberapa baris `scan_logs` uji melalui SQL Editor, grafik dan angka berubah sesuai; filter tanggal bekerja.

---

## FASE 10 — Kontrak untuk aplikasi mobile

Buat `docs/API.md` agar tim mobile terhubung ke Supabase yang sama:

1. Variabel koneksi (URL dan publishable key; **bukan** secret key).
2. Tabel yang dibaca mobile (`motifs`, `outfits`, `outfit_motif`, `skintones`, `motif_skintone_match`) dengan contoh query (filter `is_published = true`).
3. Tabel yang ditulis mobile (`profiles` via trigger saat daftar, `scan_logs`) dengan **contoh payload JSON** untuk `tipe = 'motif'` dan `tipe = 'skintone'`, termasuk bentuk `hasil`.
4. Catatan RLS: pengguna hanya bisa menulis/membaca `scan_logs` miliknya; akun `is_active = false` tidak bisa menulis; `profiles.role` tidak bisa diubah sendiri.
5. Pola pengambilan gambar dari Storage (URL publik bucket).
6. Saran: scan skintone harus menyertakan `skintone_id` agar `profiles.skintone_terakhir` dan statistik terisi.

**Selesai bila:** dokumen bisa diberikan ke agent mobile tanpa penjelasan tambahan.

---

## FASE 11 — Penyempurnaan, keamanan, dan rilis

1. **Audit keamanan:** cari kebocoran `service_role` di bundle client; pastikan semua route/aksi admin terlindungi; periksa tidak ada query admin yang berjalan dengan klien anon; cek header keamanan dasar (`next.config`).
2. **Audit UI:** bandingkan semua halaman dengan `design.md` (komposisi 60/30/10, tipografi, jarak, larangan di §13). Perbaiki penyimpangan.
3. **Aksesibilitas:** navigasi keyboard di seluruh alur (menu, dropdown hero, kuis, form), kontras warna, label form, urutan fokus, `aria-live` untuk toast/umpan balik kuis.
4. **Performa:** `next/image` + `sizes` di semua gambar, tidak ada layout shift, `revalidate` yang wajar, bundle client wajar (Recharts hanya dimuat di dashboard dengan `dynamic` bila perlu).
5. Hapus `/tes-koneksi` dan kode sementara. Tambahkan `error.tsx` dan `loading.tsx` global.
6. (Opsional) Seragamkan font hero dengan font situs jika tidak mengubah tata letak; jika berisiko, laporkan dan jangan lakukan.
7. **README.md:** prasyarat, cara setup Supabase (jalankan `docs/kainara_schema.sql`, buat admin pertama dengan perintah `update public.profiles set role = 'admin' where email = '…'`), variabel env, menjalankan lokal, struktur folder, dan **panduan deploy Vercel** (impor GitHub, isi env, atur *Site URL* dan *Redirect URLs* di Supabase Auth, tambahkan domain gambar).
8. Pastikan `npm run build`, `npm run lint`, dan pemeriksaan tipe (`tsc --noEmit`) lolos bersih.

**Selesai bila:** semua alur utama diuji manual (beranda → motif → kuis; login admin → CRUD → dashboard) di mobile dan desktop; README cukup untuk orang baru menjalankan proyek.

---

## MULAI SEKARANG

Konfirmasi bahwa kamu sudah membaca `docs/kainara_schema.sql`, `design.md`, dan komponen hero, ringkas pemahamanmu dalam maksimal 8 poin (termasuk hal yang kamu anggap berisiko atau ambigu), lalu kerjakan **Fase 1**. Berhenti di akhir Fase 1 dan laporkan sesuai format.
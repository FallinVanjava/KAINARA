# Kainara Web

Portal Kainara untuk eksplorasi motif tapis Lampung, rekomendasi outfit, kuis budaya, dan pengelolaan konten admin. Dibangun dengan Next.js App Router, TypeScript, Tailwind CSS v4, dan Supabase.

## Prasyarat

- Node.js 20 atau lebih baru
- npm
- Proyek Supabase dengan skema Kainara

## Setup lokal

1. Clone repository dan masuk ke folder proyek.
2. Pasang dependency yang dikunci di lockfile:

   ```bash
   npm ci
   ```

3. Salin `.env.example` menjadi `.env.local`, lalu isi nilai yang sesuai. Jangan commit file `.env*` atau secret.
4. Jalankan skema database dari `docs/kainara_schema.sql` di Supabase SQL Editor. Terapkan migrasi yang diperlukan secara terpisah setelah review.
5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

   Buka `http://localhost:3000`.

## Environment variables

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` hanya untuk server-side dan tidak boleh diberi prefix `NEXT_PUBLIC_`, ditampilkan di log, atau dipakai di browser/mobile. Jangan gunakan key produksi untuk pengembangan lokal.

## Perintah

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

Build tetap dapat dibuat tanpa kredensial Supabase. Untuk menjalankan fitur yang membaca database, isi environment variables terlebih dahulu.

## Struktur utama

- `app/(public)/` - halaman publik, katalog motif, detail motif, kuis
- `app/admin/` - login dan panel admin
- `app/actions/` - server actions
- `components/` - komponen UI
- `lib/queries/` - query Supabase
- `lib/validators/` - validasi input
- `lib/supabase/` - klien Supabase server, browser, dan service role
- `docs/kainara_schema.sql` - skema database dan kebijakan RLS
- `docs/API.md` - kontrak integrasi aplikasi mobile
- `docs/migrations/` - migrasi database yang ditinjau
- `DESIGN.MD` - pedoman visual

## Deploy ke Vercel

1. Impor repository GitHub ke Vercel.
2. Tambahkan environment variables yang dibutuhkan di setiap environment Vercel. Simpan service role key sebagai secret server-only.
3. Atur `NEXT_PUBLIC_SITE_URL` ke domain yang digunakan.
4. Di Supabase Authentication, atur Site URL dan Redirect URLs untuk domain produksi dan preview yang diperlukan.
5. Pastikan bucket Storage dan konfigurasi gambar cocok dengan proyek Supabase.
6. Deploy, lalu uji halaman publik, login admin, upload, dan redirect Auth.

## Keamanan

- Operasi admin harus memverifikasi sesi melalui `requireAdmin()` sebelum mutasi atau penggunaan service role.
- Pertahankan RLS untuk akses dengan publishable key.
- Jangan commit `.env.local`, `.env`, atau secret key.
- Jangan menjalankan migrasi produksi tanpa review dan backup.

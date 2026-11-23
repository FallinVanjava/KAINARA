# Kontrak Integrasi API & Database Mobile Kainara

Dokumen ini adalah panduan teknis integrasi untuk pengembang aplikasi mobile (Flutter / React Native / Kotlin / Swift) agar terhubung ke backend Supabase yang sama dengan web portal Kainara.

---

## 1. Kredensial & Variabel Lingkungan

Gunakan hanya **Anon / Publishable Key** di aplikasi mobile. **DILARANG KERAS** menyematkan `SUPABASE_SERVICE_ROLE_KEY` di kode sumber aplikasi mobile karena dapat diekstrak melalui dekompilasi APK/IPA.

| Variabel | Nilai | Keterangan |
| :--- | :--- | :--- |
| **`SUPABASE_URL`** | `https://rfbjdaxsbkckaqxjqdes.supabase.co` | URL endpoint Supabase project |
| **`SUPABASE_ANON_KEY`** | `sb_publishable_yYkkHIbtCmGarcH58b0pdw_QCtbKbGB` | Kunci publik aman untuk client-side RLS |

---

## 2. Autentikasi & Profil Pengguna

### A. Registrasi Pengguna Baru (`signUp`)
Saat pengguna mendaftar melalui Supabase Auth, trigger basis data `on_auth_user_created` akan otomatis membuat baris profil di tabel `public.profiles`.

```typescript
// Contoh TypeScript / JavaScript
const { data, error } = await supabase.auth.signUp({
  email: 'pengguna@contoh.com',
  password: 'PasswordAman123!',
  options: {
    data: {
      nama: 'Siti Rahma', // Akan otomatis disalin ke profiles.nama
    },
  },
});
```

```dart
// Contoh Flutter (supabase_flutter)
final res = await supabase.auth.signUp(
  email: 'pengguna@contoh.com',
  password: 'PasswordAman123!',
  data: {'nama': 'Siti Rahma'},
);
```

### B. Membaca Profil Pengguna
Aplikasi mobile dapat membaca profil akun yang sedang login:
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('id, nama, email, role, skintone_terakhir, is_active, created_at')
  .eq('id', currentUser.id)
  .single();
```

### C. Memperbarui Nama Pengguna
Pengguna hanya diizinkan memperbarui kolom `nama`. Kolom `role`, `is_active`, dan `email` dilindungi trigger keamanan `protect_profile_columns()`:
```typescript
const { error } = await supabase
  .from('profiles')
  .update({
    nama: 'Siti Rahma Updated',
    updated_at: new Date().toISOString(),
  })
  .eq('id', currentUser.id);
```

---

## 3. Data Master & Koleksi Budaya (Read-Only)

Semua query koleksi publik **wajib menyertakan filter `is_published = true`** (kecuali tabel `skintones` dan tabel relasi penghubung).

### A. Daftar Motif Tapis (`motifs`)
Mengambil semua motif kain tapis yang telah diterbitkan admin:
```typescript
const { data: motifs, error } = await supabase
  .from('motifs')
  .select('id, nama, slug, deskripsi, filosofi, sejarah, asal_daerah, gambar_url, created_at')
  .eq('is_published', true)
  .order('nama', { ascending: true });
```

### B. Master Skintone & Undertone (`skintones`)
Mengambil 8 tipe warna kulit standar Kainara untuk palet atau klasifikasi kamera:
```typescript
const { data: skintones, error } = await supabase
  .from('skintones')
  .select('id, nama, hex_color, undertone, deskripsi')
  .order('nama', { ascending: true });
```

### C. Kecocokan Motif Berdasarkan Skintone Pengguna (`motif_skintone_match`)
Mengambil rekomendasi motif tapis yang paling cocok dengan skintone pengguna:
```typescript
const { data: recommendations, error } = await supabase
  .from('motif_skintone_match')
  .select(`
    skor,
    keterangan,
    motif:motifs!inner (
      id,
      nama,
      slug,
      deskripsi,
      gambar_url,
      is_published
    )
  `)
  .eq('skintone_id', userSkintoneId)
  .eq('motif.is_published', true)
  .order('skor', { ascending: false });
```

### D. Rekomendasi Outfit (`outfits`) & Motif Terkait
Mengambil daftar pakaian dan padu padan motif:
```typescript
const { data: outfits, error } = await supabase
  .from('outfits')
  .select(`
    id,
    nama,
    deskripsi,
    kategori,
    warna_utama,
    gambar_url,
    outfit_motif (
      motif:motifs (
        id,
        nama,
        slug,
        gambar_url
      )
    )
  `)
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

### E. Bank Soal Kuis Acak (RPC `get_random_quiz`)
Untuk sesi kuis interaktif di mobile, panggil fungsi RPC bawaan yang telah mengacak 10 soal terbit secara otomatis:
```typescript
// Mengambil 10 soal acak
const { data: quizQuestions, error } = await supabase.rpc('get_random_quiz', {
  p_limit: 10,
});
```

*Struktur Objek `quiz_questions`:*
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "pertanyaan": "Motif Tapis Pucuk Rebung melambangkan apa dalam falsafah hidup masyarakat Lampung?",
  "opsi": [
    "Kekuatan dan kemakmuran yang terus bertumbuh",
    "Perjalanan leluhur mengarungi samudra",
    "Hubungan manusia dengan alam gaib",
    "Perniagaan rempah-rempah nusantara"
  ],
  "jawaban_benar": 0,
  "penjelasan": "Pucuk rebung merupakan simbol bambu muda yang terus tumbuh tegak ke atas...",
  "motif_id": "987fcdeb-51a2-43f1-b890-123456789abc"
}
```
> **Catatan Penting:** Kolom `jawaban_benar` adalah indeks array berbasis **0-based** (`0` merujuk ke opsi pertama, `1` ke opsi kedua, dst.).

---

## 4. Pencatatan Pemindaian Kamera (`scan_logs`)

Tabel `scan_logs` digunakan untuk mencatat riwayat pemindaian kamera (model computer vision deteksi motif atau deteksi warna kulit).

### A. Format Pemindaian Motif Tapis (`tipe = 'motif'`)
Saat model ML pada mobile mengenali kain tapis:

```typescript
const { data, error } = await supabase
  .from('scan_logs')
  .insert({
    user_id: currentUser.id,
    tipe: 'motif',
    motif_id: detectedMotifId, // UUID dari tabel motifs (opsional, jika teridentifikasi)
    skintone_id: null,
    hasil: {
      label: 'pucuk-rebung',
      confidence: 0.94,
      model_version: 'v1.2.0',
    },
  })
  .select('id')
  .single();
```

### B. Format Pemindaian Skintone (`tipe = 'skintone'`)
Saat kamera mendeteksi warna kulit pengguna:

```typescript
const { data, error } = await supabase
  .from('scan_logs')
  .insert({
    user_id: currentUser.id,
    tipe: 'skintone',
    motif_id: null,
    skintone_id: detectedSkintoneId, // WAJIB DISERTAKAN agar trigger otomatis bekerja
    hasil: {
      hex: '#D9A877',
      undertone: 'warm',
      confidence: 0.89,
    },
  })
  .select('id')
  .single();
```

> **Sangat Penting (Trigger Pembaruan Otomatis):**
> Jika `skintone_id` diisi pada insert `scan_logs`, trigger database `trg_scan_last_skintone` akan **secara otomatis memperbarui kolom `profiles.skintone_terakhir`** milik pengguna tersebut. Tim mobile tidak perlu melakukan update manual ke tabel `profiles`.

### C. Membaca Riwayat Pemindaian Pengguna Sendiri
Pengguna dapat melihat daftar pemindaian yang pernah mereka lakukan:
```typescript
const { data: logs, error } = await supabase
  .from('scan_logs')
  .select(`
    id,
    tipe,
    hasil,
    created_at,
    motif:motifs (id, nama, slug, gambar_url),
    skintone:skintones (id, nama, hex_color, undertone)
  `)
  .eq('user_id', currentUser.id)
  .order('created_at', { ascending: false })
  .limit(30);
```

---

## 5. Pencatatan Hasil Sesi Kuis (`quiz_attempts`)

Setelah pengguna menyelesaikan sesi kuis, kirimkan skor ke tabel `quiz_attempts`:

```typescript
const { error } = await supabase
  .from('quiz_attempts')
  .insert({
    user_id: currentUser ? currentUser.id : null, // Tamu tanpa akun boleh null
    skor: 8,  // Jumlah jawaban benar
    total: 10, // Total soal dalam kuis
  });
```

---

## 6. Aturan Keamanan & RLS (Row Level Security)

1. **Akses `scan_logs`:**
   - Pengguna hanya diizinkan membaca (`SELECT`) dan menulis (`INSERT`) data yang memiliki `user_id = auth.uid()`.
   - Menulis log untuk `user_id` milik orang lain akan ditolak oleh sistem dengan error `42501 (Permission Denied)`.
2. **Akun Dinonaktifkan (`is_active = false`):**
   - Jika administrator menonaktifkan akun seorang pengguna, kebijakan RLS `public.is_active_user()` akan memblokir setiap operasi `INSERT` ke `scan_logs`.
3. **Pencegahan Mutasi Role:**
   - Pengguna biasa tidak dapat menaikkan hak akses dirinya menjadi `admin`. Upaya manipulasi field `role` di tabel `profiles` akan diabaikan atau memicu exception dari fungsi `protect_profile_columns()`.
4. **Penghapusan Data:**
   - Pengguna aplikasi mobile tidak memiliki izin menghapus baris di `scan_logs` atau `quiz_attempts` (penghapusan hanya dapat dilakukan oleh admin).

---

## 7. Pengambilan Aset Gambar (Supabase Storage)

Kainara menggunakan dua bucket penyimpanan publik:
1. `motifs` - Foto kain tapis Lampung
2. `outfits` - Foto busana dan padu padan

### Format URL Publik
Seluruh file dalam bucket ini dapat diakses langsung tanpa otentikasi melalui URL:
```
https://rfbjdaxsbkckaqxjqdes.supabase.co/storage/v1/object/public/{bucket}/{nama_file}
```

*Contoh:*
- `https://rfbjdaxsbkckaqxjqdes.supabase.co/storage/v1/object/public/motifs/motif-pucuk-rebung-1732000000000.webp`
- `https://rfbjdaxsbkckaqxjqdes.supabase.co/storage/v1/object/public/outfits/outfit-tapis-formal-1732000000000.webp`

Kolom `gambar_url` pada respon tabel `motifs` dan `outfits` sudah berisi URL publik lengkap atau siap digunakan langsung pada pustaka caching gambar mobile (`CachedNetworkImage` di Flutter, `FastImage` di React Native, atau `AsyncImage` di SwiftUI).

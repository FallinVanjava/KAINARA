# Frontend Design System: KAINARA
**Status:** Active  
**Prinsip Utama:** Modern Digital Editorial, Bento Grid, Core Web Vitals Optimized, Accessible (WCAG AA).

---

## 1. Arsitektur & Aturan
- **Performa:** Wajib Core Web Vitals (LCP, CLS, FID).
- **Layout:** Bento Grid. Pakai CSS Grid (`grid-cols-1 md:grid-cols-3 md:grid-rows-2`), `gap-4` atau `gap-6`.
- **Glassmorphism:** Hanya untuk Floating Navbar dan Bottom Sheet (`bg-white/70 backdrop-blur-md border border-white/20`). Jangan ditumpuk.
- **Spacing:** Ikuti skala Tailwind (`p-6`, `py-12`, `mb-8`). Jangan custom padding sembarangan.

---

## 2. Palet Warna (Design Tokens)
Pastikan rasio kontras teks/background aman (WCAG AA 4.5:1):
- **Base/Background (`bg-kainara-base`):** `Ivory / Warm Beige (#EDE3DA)`
- **Surface (`bg-kainara-surface`):** `Peach Sand (#F7E2C3)`
- **Neutral (`bg-kainara-neutral`):** `Soft Grey (#D9D9D9)` (border/separator)
- **Primary Text (`text-kainara-primary`):** `Charcoal Black (#1C1B19)`
- **Accent Interaktif (`bg-kainara-accent`):** `Emas Siger (#D2AA36)`. Teks di atasnya harus putih/coklat gelap.
- **Accent Tapis (`bg-kainara-merah`):** `Merah Marun (#6D0F0F)`
- **Cards:** Putih murni `#FFFFFF` untuk kartu, `rgba(237,227,218,0.7)` untuk elemen melayang.

---

## 3. Tipografi
- **Headlines (H1, H2):** `Playfair Display`. Kelas: `text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight`. Gunakan *italic* untuk aksen kata.
- **Body Text:** `Plus Jakarta Sans`. Kelas: `text-base text-gray-700 font-sans leading-relaxed`. Ukuran tidak boleh lebih kecil dari 14px (`text-sm`).

---

## 4. UI Elements
Selalu tambahkan state `hover`, `focus`, dan `disabled`:
- **Border Radius:**
  - Bento Box/Kartu: `rounded-2xl` atau `rounded-3xl`.
  - Button: `rounded-full`, wajib ada `focus-visible:ring-2 focus-visible:ring-[#D2AA36] focus-visible:ring-offset-2`.
  - Image: `rounded-xl` atau `rounded-2xl`.
- **Shadow:** Pakai `shadow-lg shadow-[#6B4C3A]/5` untuk elemen melayang. Hindari shadow tebal dan menyebar.
- **Images:** Selalu pakai `<Image>` dari Next.js, format `.webp` atau `.png`.

---

## 5. Layout Blueprint
- **Landing Page:**
  - Floating Navbar: `fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full`, transparan + blur (`bg-white/70 backdrop-blur-md border border-white/20`).
  - Hero: Teks headline di tengah, gambar Tapis visual dengan animasi halus naik-turun (max Y 20px). Tombol CTA emas.
  - Bento Grid: Susunan kotak asimetris menggunakan `display: grid`.
- **Scanner UI:**
  - Fullscreen viewfinder kamera, tanpa background tebal.
  - HUD: Kotak crop tengah `border-2 border-white/50 rounded-2xl`.
  - Loading/Scan: Animasi garis vertikal emas pakai CSS Keyframes (`animate-scanline`). Teks "Memproses..." statis saat menunggu AI.
- **Detail (Bottom Sheet):**
  - Area handle bar di bagian atas untuk indikator swipe/dismiss.
  - Nama motif besar (Serif) dan skor akurasi (Emas Siger).
- **Lookbook:**
  - Horizontal scroll: `flex overflow-x-auto snap-x snap-mandatory`.
  - Kartu model bernuansa warna bumi (earth tone).
  - Tombol simpan wajib memiliki atribut `<button aria-label="Simpan Favorit">`.

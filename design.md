# 📐 Frontend Design System & UI/UX Guideline: KAINARA

**Status:** Active / Production Ready  
**Role:** Senior Frontend Engineer & UI/UX Lead  
**Core Principles:** Modern Editorial, Bento Grid, High-Performance, Accessible  

## 1. Visi Desain & Arsitektur Frontend
KAINARA mengadopsi estetika **Majalah Mode Digital (Digital Fashion Editorial)** berpadu dengan fungsionalitas aplikasi *lifestyle*[cite: 2]. Namun, implementasi kode harus memprioritaskan Core Web Vitals (LCP, CLS, FID) dan menghindari *over-engineering* visual (AI-slop).

**3 Pilar Implementasi Visual:**
1. **Strict Bento Grid UI:** Penggunaan kotak asimetris dengan sudut membulat untuk menampilkan informasi[cite: 2]. Diimplementasikan menggunakan CSS Grid (`grid-cols-1 md:grid-cols-3 md:grid-rows-2`) dengan `gap-4` atau `gap-6`.
2. **Restricted Glassmorphism:** Efek kaca buram digunakan *secara eksklusif* pada Floating Navbar dan Bottom Sheet[cite: 2]. Dilarang menumpuk elemen *glass* untuk mencegah *frame drop* pada perangkat *low-end*. (Gunakan utilitas: `bg-white/70 backdrop-blur-md border border-white/20`).
3. **Calculated Whitespace:** Ruang kosong digunakan untuk fokus pada keindahan motif[cite: 2]. Diatur ketat menggunakan skala Tailwind (`p-6`, `py-12`, `mb-8`) untuk konsistensi, bukan nilai *padding* acak.

---

## 2. Palet Warna (Design Tokens & WCAG Compliance)
Warna diambil dari elemen alam dan budaya Lampung[cite: 2]. Semua kombinasi teks dan *background* wajib memenuhi standar kontras WCAG AA (minimal rasio 4.5:1).

*   **Background Base (`bg-kainara-base`):** `Ivory / Off-White (#FAF9F6)` — Kesan kanvas kain mentah yang hangat[cite: 2]. 
*   **Primary Brand (`text-kainara-primary`, `bg-kainara-primary`):** `Coklat Sogan (#6B4C3A)` — Digunakan untuk teks utama, batas (*border*), dan tombol sekunder[cite: 2].
*   **Accent/Highlight (`bg-kainara-accent`):** `Emas Siger (#D4AF37)` — Digunakan *hanya* untuk interaksi krusial (Tombol "Scan Sekarang", *loading progress*, *badge* status)[cite: 2]. Teks di atas warna ini wajib menggunakan putih atau coklat tua gelap demi keterbacaan.
*   **Surface/Cards:** `White (#FFFFFF)` murni untuk kartu reguler, dan `rgba(255,255,255,0.7)` untuk elemen yang melayang[cite: 2].

---

## 3. Tipografi & Skala Responsif
Kombinasi font Serif elegan dan Sans-Serif geometris[cite: 2]. Dilarang keras memaksakan ukuran *oversized* di *mobile* yang menyebabkan teks terpotong.

*   **Display & Headline (H1, H2):** `Playfair Display` (Serif)[cite: 2].
    *   *Implementation:* Gunakan `text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight`. Teks *italic* digunakan untuk penekanan (contoh: Kenali *Wastra* Lampung)[cite: 2].
*   **Body & UI Text (H3, p, label):** `Plus Jakarta Sans` (Sans-Serif)[cite: 2].
    *   *Implementation:* Gunakan `text-base text-gray-700 font-sans leading-relaxed`[cite: 2]. Jangan pernah menggunakan ukuran di bawah `text-sm` (14px) demi aksesibilitas.

---

## 4. Elemen UI, Styling Attributes & State
Setiap elemen interaktif harus memiliki *state* yang jelas (`hover`, `focus`, `disabled`).

### A. Sudut Membulat (Border Radius)
*   **Kartu/Bento Box:** Diperbarui ke `rounded-2xl` (16px) atau `rounded-3xl` (24px) agar lebih proporsional di layar HP, menghindari hilangnya area konten yang terjadi jika menggunakan 32px[cite: 2].
*   **Tombol/Pill:** `rounded-full` (bentuk pil kapsul penuh)[cite: 2]. Wajib menyertakan `focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2`.
*   **Gambar/Thumbnail:** `rounded-xl` atau `rounded-2xl` (12px - 16px) agar selaras dengan kontainernya[cite: 2].

### B. Bayangan Lembut (Performance-Optimized Shadows)
Bayangan tebal dihindari[cite: 2].
*   *Implementation:* Gunakan `shadow-lg shadow-[#6B4C3A]/5` untuk *floating state*. Dilarang menggunakan *box-shadow* berat dengan *spread* ekstrem yang merusak performa *scroll* CSS[cite: 2].

### C. Fotografi & Optimasi Gambar
*   Gambar wastra/kain menonjolkan tekstur serat dengan kontras tinggi pada motif benang emas[cite: 2].
*   *Implementation:* Wajib menggunakan komponen `<Image>` dari Next.js. Gambar berwujud *cut-out* (tanpa *background*) yang diletakkan di Bento Box untuk efek 3D pop-out[cite: 2] harus menggunakan format `.webp` atau `.png` yang terkompresi.

---

## 5. Layout Blueprint (Mobile-First Implementation)

### 5.1. Beranda (Landing Page)
*   **Floating Navbar:** Berbentuk pil, transparan dengan efek *blur*[cite: 2] (`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full`).
*   **Hero Section:** Teks Headline raksasa di tengah dengan gambar Tapis melayang perlahan[cite: 2] (animasi *parallax* ringan maksimal translasi sumbu Y 20px). Tombol CTA utama berwarna emas[cite: 2].
*   **Fitur Section (Bento Grid):** 3 kotak asimetris menggunakan eksekusi `display: grid`. Kotak besar untuk Video/GIF UI Scanner, kotak kecil untuk ikon "Scan Wastra" dan "Mix & Match"[cite: 2].

### 5.2. AI Scanner UI (Kamera)
*   **Visual:** Layar *viewfinder* kamera secara penuh (*Immersive*) tanpa warna latar belakang[cite: 2].
*   **Overlay HUD:** Kotak *crop* berbingkai putih tipis dengan sudut membulat (`border-2 border-white/50 rounded-2xl`)[cite: 2].
*   **Scanning Effect:** Animasi garis laser Emas Siger bergerak secara vertikal[cite: 2] dikendalikan murni menggunakan CSS Keyframes (bukan JS) untuk mencegah *main-thread blocking* saat model AI sedang bekerja.

### 5.3. Motif Detail Card (Bottom Sheet)
*   Muncul dari laci bawah dengan *Glassmorphism*[cite: 2]. 
*   Menampilkan nama motif menggunakan Serif besar, dan Skor Akurasi menggunakan font raksasa Emas Siger[cite: 2]. Wajib memiliki fungsi aksesibilitas "geser ke bawah untuk menutup" (*swipe down to dismiss*).

### 5.4. Outfit Mix & Match (Lookbook)
*   Gaya *Carousel/Slider* horizontal[cite: 2] (implementasi `flex overflow-x-auto snap-x snap-mandatory`).
*   Kartu model bernuansa *earth tone* terinspirasi kain yang di-scan[cite: 2].
*   Ikon "Love" di sudut kanan atas[cite: 2] wajib diimplementasikan sebagai `<button aria-label="Simpan Favorit">` agar dapat diakses oleh *screen reader*.
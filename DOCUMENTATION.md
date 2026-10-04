# LAPORAN DOKUMENTASI SISTEM KAINARA
**Tapis Lampung Cultural Heritage & Fashion AI Platform**

---

## 1. Ringkasan Eksekutif & Visi Produk

**KAINARA** adalah platform digital berbasis Artificial Intelligence (AI) dan Web modern yang berfokus pada identifikasi wastra tradisional **Tapis Lampung** serta personalisasi gaya busana modern (*fashion styling* & *skin undertone analysis*). 

Sistem mencocokkan motif Tapis teridentifikasi dengan *skin undertone* pengguna guna memberikan rekomendasi padu-padan *outfit* kasual, semi-formal, maupun formal yang selaras secara estetika dan etika budaya.

### Masalah & Nilai Tambah:
- **Gap Pengenalan Visual**: Mesin pencari visual umum (Google Lens, Pinterest Lens) bersifat *Western-centric* dan tidak mengenali motif Tapis lokal serta makna sakralnya.
- **Konteks Budaya & Fesyen**: KAINARA menjembatani **pelestarian warisan budaya** (makna filosofis dan etika pemakaian busana) dengan **rekomendasi gaya busana personal** (warna pakaian, hijab-friendly outfit, dan palet warna kulit).

---

## 2. Arsitektur Sistem (System Architecture)

KAINARA mengadopsi arsitektur **Decoupled Client-Server** yang dioptimalkan untuk latensi rendah (*low-latency*) dan efisiensi sumber daya:

```text
                              [ Pengguna / Browser ]
                                        │ (Max 2MB Upload)
                                        ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │ 1. Frontend: Next.js 16 (App Router) + React 19                        │
    │    - UI: Bento Grid Layout, Modern Editorial Aesthetic                │
    │    - Capture: MediaDevices Camera API + react-easy-crop Canvas         │
    │    - Preprocessing: Client-side JPEG Compression (imageUtils.ts)       │
    │    - State: Zustand Persist Middleware (localStorage)                  │
    └───────────────────────────────────┬────────────────────────────────────┘
                                        │ HTTP POST / Multipart Form-Data
                                        ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │ 2. Backend Gateway: FastAPI (Python 3.12 / Uvicorn)                    │
    │    - CORS Middleware & Request Validation (Pydantic)                   │
    │    - Standardisasi Tensor & Normalisasi (Pillow / NumPy)               │
    │    - Payload Size Guard (Maksimal 2MB)                                 │
    └───────────────────┬───────────────────────────────┬────────────────────┘
                        │ (ONNX Runtime / PyTorch)      │ (ONNX Runtime / PyTorch)
                        ▼                               ▼
    ┌───────────────────────────────────────┐ ┌──────────────────────────────┐
    │ 3. Wastra AI Engine (Tapis Lampung)   │ │ 4. Skin Tone AI Engine       │
    │    - Backbone: ResNet50 (ONNX/PyTorch)│ │    - Backbone: MobileNetV2   │
    │    - Single-Pass / TTA Inference      │ │    - Anti-Lighting Bias Jitter│
    │    - Klasifikasi Motif Tapis & Wastra │ │    - 3-Class Undertone       │
    └───────────────────┬───────────────────┘ └──────────────────────────────┘
                        │
                        ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │ 5. Active Learning & Human-in-the-Loop (HITL)                          │
    │    - Feedback Loop Endpoint: /v1/scan/feedback (Hard Negatives)        │
    │    - Admin Labeler GUI: /admin/labeler                                 │
    │    - Controlled Offline Retraining Pipeline: scripts/retrain_resnet50.py│
    └────────────────────────────────────────────────────────────────────────┘
```

### Alur Kerja Inferensi (Inference Flow):
1. **Client-side Compression & Validation**: Input kamera/file divalidasi (maksimal 2MB) dan dikompresi di browser melalui `HTMLCanvasElement` (800x800 px, JPEG quality 0.8) guna mempercepat transfer data.
2. **Standardisasi Tensor**: Backend melakukan normalisasi ImageNet standar ($\mu = [0.485, 0.456, 0.406]$, $\sigma = [0.229, 0.224, 0.225]$).
3. **Inference Execution**:
   - **Mode Produksi Berkecepatan Tinggi**: Inferensi *Single-Pass* melalui **ONNX Runtime** (Resize 256x256 -> CenterCrop 224x224) untuk latensi inferensi di bawah 200ms pada CPU.
   - **Mode Akurasi Tinggi**: Inferensi *Test-Time Augmentation (TTA)* 3-view (Original, Horizontal Flip, Center Crop) menggunakan PyTorch Engine.
4. **Enrichment**: Output probabilitas Softmax dipetakan ke repositori filosofi budaya dan rekomendasi busana.

---

## 3. Tech Stack & Dependencies

### Frontend (`kainara-web`)
| Komponen | Teknologi | Versi | Fungsi |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.3.5 | Server-Side Rendering (SSR), API Client, Routing |
| **Library UI** | React & React DOM | 19.2.8 | Komponen UI deklaratif |
| **Language** | TypeScript | ^5.0 | *Type-safety* data motif, busana, dan skintone |
| **Styling** | Tailwind CSS | ^4.0 | Utilitas styling modern & Token Desain KAINARA |
| **Animation** | Framer Motion | ^13.4.0 | Animasi layout bento, transisi kartu, HUD laser scanner |
| **State Store** | Zustand | ^5.0.15 | State management atomik dengan persistensi `localStorage` |
| **Image Tool** | react-easy-crop | ^6.2.3 | Pemangkasan interaktif area wajah/kulit |

### Backend (`backend`)
| Komponen | Teknologi | Versi | Fungsi |
|---|---|---|---|
| **Framework** | FastAPI | ^2.1.0 | RESTful API berkinerja tinggi |
| **Server** | Uvicorn | Standar | ASGI Server produksi |
| **Inference Engine** | ONNX Runtime / PyTorch | 2.x | Inferensi model AI CPU-optimized dengan alokasi memori rendah |
| **Numerik & Image** | NumPy, Pillow (PIL) | Standar | Operasi array tensor & prapemrosesan citra |
| **Data Collection** | BeautifulSoup / Scraper | Standar | Pengumpulan data wastra dari arsip web terpercaya |

---

## 4. Arsitektur Model AI & Dataset

### A. Model Motif Wastra & Tapis Lampung (ResNet50)
- **Backbone**: ResNet50 dengan Custom Deep Classification Head:
  $$\text{Linear}(2048 \rightarrow 512) \rightarrow \text{BatchNorm1d} \rightarrow \text{GELU} \rightarrow \text{Dropout}(0.3) \rightarrow \text{Linear}(512 \rightarrow 128) \rightarrow \text{BatchNorm1d} \rightarrow \text{GELU} \rightarrow \text{Dropout}(0.15) \rightarrow \text{Linear}(128 \rightarrow N)$$
- **Katalog Kelas Motif Tapis & Wastra Lampung**:
  1. `motif_pucuk_rebung` / `tapis_pucuk_rebung` (Pucuk Rebung / Tumpal)
  2. `motif_siger` (Mahkota Siger Lampung)
  3. `motif_gajah` (Gajah Way Kambas)
  4. `motif_kapal` (Kapal / Palepai)
  5. `motif_sembagi` (Sembagi Lampung)
  6. `motif_gamolan` (Gamolan Pekhing)
  7. `motif_belah_ketupat` (Belah Ketupat)
  8. `motif_bunga_ashar` (Bunga Ashar)
  *(Serta kelas pengembangan Tapis seperti `tapis_bintang_perak`).*
- **Pipeline Data Augmentation (7-View)**:
  1. Citra Asli (224x224)
  2. Horizontal Flip
  3. Rotasi 180°
  4. Center Crop (85%)
  5. Color Jitter (Kecerahan, Kontras, Saturasi)
  6. Random Crop (80%) + Color Jitter
  7. Gaussian Blur (Simulasi kamera ponsel beresolusi rendah)
- **Performa Pelatihan**: Akurasi validasi mencapai **99.24%** dengan *loss function* Label-Smoothed Class-Weighted Cross Entropy.

### B. Model Analisis Warna Kulit (MobileNetV2)
- **Arsitektur**: MobileNetV2 (arsitektur *lightweight* berkecepatan tinggi).
- **Kelas Output**: `cool`, `neutral`, `warm`.
- **Anti-Lighting Bias**: Dilatih dengan Color Jitter acak (brightness=0.3, contrast=0.2, saturation=0.3, hue=0.1) untuk menolak bias cahaya lampu ruangan kuning/biru.
- **Rule-based Palette Mapping**:
  - **Warm**: Palet Marun Sakral (`#6D0F0F`), Emas Siger (`#D2AA36`), Hitam Arang (`#1C1B19`), Peach Sand (`#F7E2C3`).
  - **Cool**: Palet Biru Laut (`#2C3E6B`), Abu-abu Lembut (`#D9D9D9`), Warm Beige (`#EDE3DA`), Hitam (`#1C1B19`).
  - **Neutral**: Palet harmoni seimbang multi-kombinasi.

### C. Pipeline Retraining Terkendali (Offline Retraining)
- **Controlled Retraining**: Proses pelatihan ulang dijalankan secara *offline/manual* oleh pengembang menggunakan `scripts/retrain_resnet50.py` guna menghindari *catastrophic forgetting*.
- **Export Pipeline**: Bobot model PyTorch (`.pth`) dapat diekspor ke format ONNX (`.onnx`) untuk deployment server dengan latensi minimal.

---

## 5. Struktur Direktori Proyek

```text
KAINARA/
├── backend/
│   ├── dataset_raw/                  # Repositori citra dataset per kelas
│   ├── dataset/
│   │   ├── hard_negatives/           # Gambar koreksi dari user (Feedback Loop)
│   │   ├── unlabeled/                # Gambar mentah untuk antarmuka HITL Labeler
│   │   └── skintone/                 # Dataset citra wajah/undertone
│   ├── scripts/
│   │   ├── retrain_resnet50.py       # Skrip training ResNet50 (Two-stage feature caching)
│   │   ├── train_skintone_mobilenet.py # Skrip training MobileNetV2 Skintone
│   │   ├── visualize_gradcam.py      # Skrip visualisasi aktivasi Grad-CAM
│   │   ├── audit_dataset.py          # Verifikasi resolusi & integritas dataset
│   │   ├── sanitize_dataset.py       # Pembersihan duplikasi data citra
│   │   └── setup_unlabeled.py        # Pengelolaan direktori unlabeled
│   ├── models/                       # Direktori bobot model (ONNX / PyTorch)
│   ├── best_model_weights.pth        # Checkpoint bobot ResNet50
│   ├── skintone_mobilenet_v2.pth     # Checkpoint bobot MobileNetV2
│   ├── features_cache.pt             # Cache tensor embedding ResNet50
│   └── main.py                       # Server API FastAPI
│
├── kainara-web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page (Hero, Bento Grid, Lookbook)
│   │   │   ├── scanner/page.tsx      # Kamera Scanner Wastra Real-time
│   │   │   ├── skintone/page.tsx     # Scanner Warna Kulit & Palette Matching
│   │   │   ├── education/
│   │   │   │   ├── page.tsx          # Katalog Ensiklopedia & Koleksi Favorit
│   │   │   │   └── [slug]/page.tsx   # Detail Motif, Sejarah & Etika Busana
│   │   │   └── admin/labeler/page.tsx # GUI Admin Human-in-the-Loop Labeler
│   │   ├── components/
│   │   │   ├── layout/               # Floating Navbar & Footer
│   │   │   └── ui/                   # Reusable UI Tokens (Button, Badge)
│   │   ├── features/
│   │   │   ├── scanner/              # WebScannerUI, MotifDetailCard, useScanner hook
│   │   │   ├── skintone/             # SkinScannerUI, SkinToneResultCard, colorAnalyzer
│   │   │   ├── home/                 # OutfitCarousel (Hijab-Friendly Filter)
│   │   │   └── education/            # MotifGridCard, FavoriteButton
│   │   ├── store/
│   │   │   └── useFavoriteStore.ts   # Zustand atomic store (Motif & Outfit)
│   │   ├── lib/
│   │   │   ├── api.ts                # Client fetch HTTP ke backend AI
│   │   │   ├── imageUtils.ts         # Kompresi canvas sisi klien
│   │   │   └── constants/mockData.ts # Data filosofi, konteks acara, & busana
│   │   └── types/
│   │       └── index.ts              # Type definitions TypeScript
│   ├── package.json
│   └── tsconfig.json
│
├── PROGRESS.md                       # Log milestone & status pengerjaan fitur
├── design.md                         # Spesifikasi Design System & UI/UX guideline
├── DOCUMENTATION.md                  # Dokumen utama arsitektur dan sistem KAINARA
└── scraper.py                        # Utilitas penarikan dataset
```

---

## 6. Spesifikasi Kontrak API (Endpoints)

### 1. `POST /v1/scan`
Memindai dan mengklasifikasikan motif wastra/Tapis Lampung.

* **Content-Type**: `multipart/form-data`
* **Payload**: `image` (File citra, Maksimal 2MB)
* **Response Sukses (200 OK)**:
```json
{
  "success": true,
  "data": {
    "motif_id": "motif_pucuk_rebung",
    "name": "Motif Pucuk Rebung",
    "confidence": 0.9854,
    "philosophy": "Susunan segitiga berderet dari tunas bambu melambangkan kekuatan menghadapi rintangan hidup...",
    "alternatives": [
      { "motif_id": "motif_siger", "name": "Motif Siger", "confidence": 0.0112 }
    ]
  }
}
```
* **Status Error Standar**:
  - `400 Bad Request`: `{"success": false, "code": "INVALID_FORMAT", "message": "File harus berupa gambar."}`
  - `413 Payload Too Large`: `{"success": false, "code": "PAYLOAD_TOO_LARGE", "message": "Ukuran file melebihi batas 2MB."}`
  - `500 Internal Server Error`: `{"success": false, "code": "INFERENCE_ERROR", "message": "Inference engine failure."}`

---

### 2. `POST /v1/skintone`
Menganalisis *undertone* kulit wajah pengguna.

* **Content-Type**: `multipart/form-data`
* **Payload**: `image` (File citra crop area kulit, Maksimal 2MB)
* **Response Sukses (200 OK)**:
```json
{
  "success": true,
  "data": {
    "tone": "warm",
    "confidence": 0.9412
  }
}
```

---

### 3. `POST /v1/scan/feedback`
Menyimpan koreksi pengguna ke direktori *hard negatives* untuk siklus pelatihan berikutnya.

* **Content-Type**: `multipart/form-data`
* **Payload**: `image` (File citra), `correct_motif_id` (String ID kelas yang benar)
* **Response Sukses (200 OK)**:
```json
{
  "success": true,
  "message": "Terima kasih! Laporan feedback berhasil disimpan."
}
```

---

### 4. `GET /v1/admin/unlabeled` & `POST /v1/admin/label`
* **`GET /v1/admin/unlabeled`**: Mengambil satu gambar acak dari pool `dataset/unlabeled/` beserta representasi Base64 dan tebakan awal AI.
* **`POST /v1/admin/label`**: Memindahkan citra dari direktori *unlabeled* ke kelas definitif `dataset_raw/<motif_id>/`.

---

## 7. Fitur Unggulan Sistem

1. **AI Scanner Tapis Real-time**: Menggunakan kamera perangkat dengan HUD *viewfinder*, animasi laser scanning berbasis CSS, dan inferensi presisi tinggi.
2. **Konteks Budaya & Etika Busana (*Event Context*)**: Menyediakan edukasi makna filosofi motif serta rekomendasi etika waktu pemakaian (misal: "Acara Formal", "Upacara Adat") untuk mencegah *cultural appropriation*.
3. **Penyelarasan Warna Kulit (*Skin Undertone to Outfit Bridge*)**: Pemindaian *skin undertone* (Warm/Cool/Neutral) otomatis merekomendasikan palet warna HEX dan katalog busana Tapis yang serasi.
4. **Filter Hijab-Friendly**: Opsi filter khusus pada katalog lookbook untuk demografi busana muslimah tertutup (*modest fashion*).
5. **Koleksi Favorit Atomik**: Fitur simpan motif dan busana favorit dengan manajemen state Zustand atomik yang tersimpan di `localStorage` bebas *race condition*.
6. **Viral Loop (Native Web Share API)**: Integrasi `navigator.share()` untuk membagikan kartu hasil pemindaian motif ke Instagram Stories dan WhatsApp.
7. **Human-in-the-Loop Active Learning**: Mekanisme koreksi pengguna dan dashboard pelabelan admin untuk pengayaan dataset berkelanjutan.

---

## 8. Design System & UI/UX Tokens

Antarmuka KAINARA dirancang dengan estetika **Digital Fashion Editorial**:

* **Palet Warna Budaya**:
  * `bg-kainara-base`: `Ivory / Warm Beige (#EDE3DA)` — Latar kanvas kain mentah alami.
  * `bg-kainara-surface`: `Peach Sand (#F7E2C3)` — Latar kartu hangat.
  * `bg-kainara-neutral`: `Soft Grey (#D9D9D9)` — Separator dan batas netral.
  * `text-kainara-primary`: `Charcoal Black (#1C1B19)` — Teks utama dengan kontras tinggi (WCAG AA).
  * `bg-kainara-accent`: `Emas Siger (#D2AA36)` — Aksen tombol utama dan status aktif.
  * `bg-kainara-merah`: `Merah Marun (#6D0F0F)` — Aksen sakral wastra Tapis.
* **Tipografi**:
  * Display / Headline: `Playfair Display` (Serif editorial elegan).
  * Body / UI Text: `Plus Jakarta Sans` (Sans-Serif modern dan ergonomis).
* **Komposisi Layout**:
  * *Strict Bento Grid*: Grid asimetris responsif untuk menampilkan informasi visual secara harmonis.
  * *Restricted Glassmorphism*: Efek kaca buram halus pada floating navbar dan bottom sheet modal (`backdrop-blur-md border border-white/20`).

---

## 9. Panduan Menjalankan Sistem (Getting Started)

### Menjalankan Backend:
```bash
cd backend
pip install fastapi uvicorn torch torchvision pillow pydantic python-multipart numpy onnxruntime
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Menjalankan Frontend:
```bash
cd kainara-web
npm install
npm run dev
```
Aplikasi web dapat diakses di `http://localhost:3000`.

### Pelatihan Model ResNet50 (Offline Retraining):
```bash
cd backend
python scripts/retrain_resnet50.py
```
Skrip akan mengekstrak fitur, melatih classification head secara lokal, dan memperbarui bobot `best_model_weights.pth`.

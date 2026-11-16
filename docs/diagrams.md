# ERD & Class Diagram: KAINARA

## 1. Entity-Relationship Diagram (ERD)

ERD hanya memuat **tabel database**. Fitur scan tidak masuk ERD karena scan tidak menyimpan apa pun ke database: alurnya stateless (unggah file sementara, kirim ke API ML, hapus file, cocokkan hasil ke tabel yang ada). ERD hanya menggambar data yang tersimpan, jadi scan tidak punya entitas di sini.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFFFFF", "primaryTextColor": "#262525", "primaryBorderColor": "#262525", "lineColor": "#262525", "secondaryColor": "#FFFFFF", "tertiaryColor": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px"}}}%%
erDiagram
    TAPIS_MOTIFS ||--o{ MOTIF_OUTFIT : "dikaitkan dengan"
    OUTFITS ||--o{ MOTIF_OUTFIT : "menggunakan"

    USERS {
        bigint id PK
        string name
        string email UK
        string password
        string remember_token "nullable"
        timestamp email_verified_at "nullable"
        timestamp created_at
        timestamp updated_at
    }

    TAPIS_MOTIFS {
        bigint id PK
        string name
        string slug UK
        string origin_region
        string dominant_color "nullable"
        text description
        text history
        text philosophy
        string image_path "nullable"
        timestamp created_at
        timestamp updated_at
    }

    OUTFITS {
        bigint id PK
        string name
        string slug UK
        enum category "atasan, bawahan, set"
        json skintone_match "array cast"
        text description
        text mix_match_notes "nullable"
        string image_path "nullable"
        timestamp created_at
        timestamp updated_at
    }

    MOTIF_OUTFIT {
        bigint tapis_motif_id PK, FK "cascadeOnDelete"
        bigint outfit_id PK, FK "cascadeOnDelete"
    }
```

Tabel infrastruktur bawaan Laravel (bukan domain, tidak digambar): `migrations` (pencatatan versi skema). Tabel `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `password_reset_tokens` sudah dihapus karena tidak dipakai (cache dan queue beralih ke file/sync).

---

## 2. Class Diagram: Domain Aplikasi

Class diagram dibagi dua agar rapi: diagram ini untuk domain inti (model + controller CRUD/paging), diagram terpisah di bagian 3 untuk alur scan.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFFFFF", "primaryTextColor": "#262525", "primaryBorderColor": "#262525", "lineColor": "#262525", "secondaryColor": "#FFFFFF", "tertiaryColor": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px"}}}%%
classDiagram
    direction LR

    class TapisMotif {
        +name
        +slug
        +origin_region
        +dominant_color
        +image_path
        +outfits() BelongsToMany
    }

    class Outfit {
        +name
        +slug
        +category
        +skintone_match
        +image_path
        +motifs() BelongsToMany
    }

    class User {
        +name
        +email
        +password
    }

    class PublicController {
        +home()
        +galeri()
        +motifDetail()
        +outfitIndex()
        +outfitDetail()
    }

    class AdminTapisController {
        +index()
        +create()
        +store()
        +edit()
        +update()
        +destroy()
    }

    class AdminOutfitController {
        +index()
        +create()
        +store()
        +edit()
        +update()
        +destroy()
    }

    class AdminAuthController {
        +loginForm()
        +login()
        +logout()
    }

    PublicController ..> TapisMotif
    PublicController ..> Outfit
    AdminTapisController ..> TapisMotif
    AdminOutfitController ..> Outfit
    AdminAuthController ..> User
    TapisMotif "0..*" -- "0..*" Outfit : motif_outfit
```

Relasi `TapisMotif` - `Outfit` many-to-many via tabel pivot `motif_outfit`. Semua class model memakai `slug` sebagai route key (`getRouteKeyName()`).

---

## 3. Class Diagram: Alur Scan

Diagram fokus alur scan saja, dari browser sampai hasil. Node ditekan ke lima class inti: facade `Http` dan `Storage` tidak digambar terpisah karena hanya detail implementasi, mereka disebut di penjelasan langkah.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFFFFF", "primaryTextColor": "#262525", "primaryBorderColor": "#262525", "lineColor": "#262525", "secondaryColor": "#FFFFFF", "tertiaryColor": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px"}}}%%
classDiagram
    class scanModule {
        <<browser>>
        +submit()
        +reset()
    }

    class ScanController {
        <<backend>>
        +motif()
        +skintone()
        -predict()
    }

    class MlService {
        <<eksternal>>
        +predictMotif()
        +predictSkintone()
    }

    class TapisMotif {
        <<database>>
        +name
        +slug
    }

    class Outfit {
        <<database>>
        +skintone_match
    }

    scanModule ..> ScanController : POST
    ScanController ..> MlService : API
    ScanController ..> TapisMotif : label
    ScanController ..> Outfit : skintone
```

Alur per langkah:
1. `scanModule` (Alpine.js) validasi gambar (JPG/PNG/WEBP, maks 2 MB) lalu `fetch POST` ke `/scan/motif` atau `/scan/skintone` (`throttle:10,1`).
2. `ScanController::predict()` simpan file via facade `Storage` ke `storage/scan-temp`, kirim ke ML via facade `Http::attach()`, hapus file di semua jalur (sukses, error jaringan, respons gagal).
3. Hasil dicocokkan ke database yang sudah ada: label motif ke `TapisMotif::name` (case-insensitive), skintone ke `Outfit::skintone_match` via `whereJsonContains`.
4. Respons JSON kembali ke browser, ditampilkan, tidak disimpan ke database.

Dilewati: `scanPageStore` (favorit) tidak relevan untuk alur scan, ditiadakan dari diagram.
Risiko: tidak ada. Basis kode asli: `ScanController.php`, `resources/js/app.js`, `config/services.php`.

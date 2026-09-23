"""
Dataset Sanity Check (Audit Dataset KAINARA)

Skrip ini memindai seluruh folder dataset training (Original & Hard Negatives).
Menggunakan algoritma Perceptual Hash (Phash) via library `imagehash` 
untuk mendeteksi gambar yang identik atau sangat mirip secara visual.

Tujuan:
Mencegah "Data Leakage" (Data Bocor), di mana satu gambar fisik yang sama 
berada di folder kelas yang berbeda (contoh: Way Kambas bocor ke folder Gamolan),
yang membuat AI kebingungan dan gagal fokus.
"""

import os
import glob
from pathlib import Path
from PIL import Image
import imagehash
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = (BASE_DIR / "dataset_raw") if (BASE_DIR / "dataset_raw").exists() else (BASE_DIR / "dataset")

def get_image_files(directory: Path):
    extensions = ["*.jpg", "*.jpeg", "*.png", "*.webp"]
    files = []
    for ext in extensions:
        files.extend(directory.rglob(ext))
        # Juga cari format uppercase
        files.extend(directory.rglob(ext.upper()))
    return files

def audit_dataset():
    print(f"Memulai Audit Dataset di: {DATASET_DIR}")
    image_files = get_image_files(DATASET_DIR)
    
    if not image_files:
        print("Dataset kosong atau folder tidak ditemukan.")
        return

    print(f"Ditemukan total {len(image_files)} gambar. Menghitung Perceptual Hash...")

    # Dictionary untuk menyimpan: { hash_value : [list_of_filepaths] }
    hash_dict = defaultdict(list)

    for idx, filepath in enumerate(image_files):
        try:
            with Image.open(filepath) as img:
                # Phash mengabaikan rotasi kecil, warna, dan kompresi
                # Sangat kuat mendeteksi gambar yang sama meski di-resize
                h = str(imagehash.phash(img))
                hash_dict[h].append(filepath)
        except Exception as e:
            print(f"[ERROR] Gagal memproses gambar {filepath.name}: {e}")

        if (idx + 1) % 50 == 0:
            print(f"  ... Diproses {idx + 1}/{len(image_files)} gambar.")

    print("\n[HASIL AUDIT] Pencarian Duplikat Lintas Kelas:")
    
    found_duplicates = False
    for h, filepaths in hash_dict.items():
        if len(filepaths) > 1:
            # Cek apakah duplikat tersebut berada di kelas (folder) yang BERBEDA
            # Struktur path biasanya: dataset/original/namakelas/gambar.jpg
            # Parent directory name adalah nama kelasnya
            classes = set([f.parent.name for f in filepaths])
            
            if len(classes) > 1:
                found_duplicates = True
                print("\n[CRITICAL WARNING] Ditemukan Kebocoran Lintas Kelas!")
                print(f"Gambar yang sama persis berada di {len(classes)} kelas berbeda:")
                for f in filepaths:
                    print(f"  -> Kelas: {f.parent.name} | File: {f.relative_to(BASE_DIR)}")
                    
            elif len(filepaths) > 1:
                # Duplikat di kelas yang sama tidak merusak model secara label,
                # tapi menyebabkan memori mubazir dan potensi overfitting ringan
                print(f"\n[INFO] Duplikat di dalam satu kelas yang sama ({list(classes)[0]}):")
                for f in filepaths:
                    print(f"  -> File: {f.relative_to(BASE_DIR)}")

    if not found_duplicates:
        print("\n[OK] Dataset BERSIH. Tidak ditemukan kebocoran gambar lintas kelas.")
    else:
        print("\n[TINDAKAN DIPERLUKAN] Harap hapus file-file berlabel ganda di atas agar AI tidak kebingungan.")

if __name__ == "__main__":
    audit_dataset()

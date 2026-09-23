"""
KAINARA Dataset Sanitizer & Deduplication Tool
Removes cross-class leaks and intra-class exact/near-identical duplicates using Perceptual Hashing (phash).
"""

import os
from collections import defaultdict
from pathlib import Path
from PIL import Image
import imagehash

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset_raw"


def sanitize_dataset():
    print(f"=== KAINARA Dataset Sanitizer ===")
    print(f"Dataset Path: {DATASET_DIR}\n")

    extensions = ["*.jpg", "*.jpeg", "*.png", "*.webp"]
    all_files = []
    for ext in extensions:
        all_files.extend(list(DATASET_DIR.rglob(ext)))

    print(f"Total file awal: {len(all_files)} gambar. Menghitung visual hash...")

    hash_map = defaultdict(list)
    for f in all_files:
        try:
            with Image.open(f) as img:
                h = str(imagehash.phash(img))
                hash_map[h].append(f)
        except Exception as e:
            print(f"  [CORRUPT] Menghapus file rusak: {f.name}")
            f.unlink(missing_ok=True)

    deleted_cross_leaks = 0
    deleted_intra_duplicates = 0

    for h, files in hash_map.items():
        if len(files) <= 1:
            continue

        # Cek apakah ada di kelas berbeda (cross-class leak)
        classes = set(f.parent.name for f in files)
        if len(classes) > 1:
            # Konflik label: gambar sama ada di kelas berbeda! Hapus SEMUA salinannya agar AI tidak bingung
            for f in files:
                if f.exists():
                    f.unlink()
                    deleted_cross_leaks += 1
        else:
            # Duplikat di kelas yang sama: simpan 1 file pertama, hapus sisanya
            for f in files[1:]:
                if f.exists():
                    f.unlink()
                    deleted_intra_duplicates += 1

    print(f"\n[HASIL PEMBERSIHAN DATASET]")
    print(f"  - Dihapus kebocoran lintas kelas (kontradiksi label): {deleted_cross_leaks} file")
    print(f"  - Dihapus duplikat dalam kelas yang sama: {deleted_intra_duplicates} file")

    # Re-index nama file di setiap folder
    print("\n[RE-INDEXING FILE]")
    total_clean = 0
    for folder in sorted(DATASET_DIR.iterdir()):
        if not folder.is_dir():
            continue
        valid_files = sorted([f for f in folder.iterdir() if f.is_file()], key=lambda x: x.name)
        prefix = folder.name.lower()
        for idx, f in enumerate(valid_files, 1):
            target_name = folder / f"{prefix}_{idx:03d}.jpg"
            if f != target_name:
                if target_name.exists():
                    target_name.unlink()
                f.rename(target_name)
        count = len(list(folder.glob("*.jpg")))
        total_clean += count
        print(f"  - {folder.name}: {count} gambar bersih unik")

    print(f"\nTotal Dataset Bersih & Unik: {total_clean} gambar!")


if __name__ == "__main__":
    sanitize_dataset()

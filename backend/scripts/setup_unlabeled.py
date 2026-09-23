"""
Utility Script: Unlabeled Folder Setup
Untuk menyiapkan contoh data unlabeled (jika folder kosong).
Biasanya di production data ini berasal dari upload pengguna yang ragu.
"""

import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UNLABELED_DIR = BASE_DIR / "dataset" / "unlabeled"

def setup_unlabeled_demo():
    UNLABELED_DIR.mkdir(parents=True, exist_ok=True)
    
    # Kita buat dummy file agar folder ini tidak kosong saat demo
    dummy_file = UNLABELED_DIR / "dummy_waykambas.jpg"
    if not dummy_file.exists():
        # Buat gambar kosong merah berukuran 10x10 px (Sebagai contoh saja)
        from PIL import Image
        img = Image.new('RGB', (10, 10), color = 'red')
        img.save(dummy_file)
        print(f"Created demo file at {dummy_file}")
    else:
        print(f"Directory {UNLABELED_DIR} already has files.")

if __name__ == "__main__":
    setup_unlabeled_demo()

"""
Downloader & Curator Khusus Dataset Tapis Lampung
Mengunduh dan menyusun dataset untuk:
1. tapis_pucuk_rebung (Tapis Pucuk Rebung)
2. tapis_bintang_perak (Tapis Bintang Perak)
"""

import json
import re
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
import shutil
import requests
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_TAPIS_DIR = BASE_DIR / "dataset_tapis"
DATASET_RAW_DIR = BASE_DIR / "dataset_raw"

TAPIS_QUERIES = {
    "tapis_bintang_perak": [
        "kain tapis motif bintang perak lampung",
        "tapis lampung bintang perak",
        "kain tapis bintang perak benang perak",
        "motif bintang perak tapis lampung",
        "tapis lampung bintang berantai",
        "motif bintang kain tapis lampung",
        "kain tapis antik bintang perak lampung",
        "lampung gold silver star tapis cloth",
    ],
    "tapis_pucuk_rebung": [
        "kain tapis pucuk rebung lampung",
        "motif tumpal pucuk rebung tapis lampung",
        "kain tenun tapis pucuk rebung",
        "tapis sasab pucuk rebung lampung",
        "kain tapis lampung pucuk rebung antik",
    ]
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}

def extract_image_urls(query: str, max_urls=80) -> list:
    encoded = urllib.parse.quote_plus(query)
    url = f"https://www.bing.com/images/search?q={encoded}&first=1&scenario=ImageBasicHover"
    urls = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            # Cari link gambar dari atribut murl
            matches = re.findall(r'&quot;murl&quot;:&quot;(.*?)&quot;', res.text)
            for m in matches:
                clean_url = m.replace(r'\/', '/')
                if clean_url.startswith("http") and clean_url not in urls:
                    urls.append(clean_url)
                if len(urls) >= max_urls:
                    break
    except Exception as e:
        print(f"  [ERROR search] {query}: {e}")
    return urls

def download_image(url: str, dest_path: Path) -> bool:
    try:
        res = requests.get(url, headers=HEADERS, timeout=6)
        if res.status_code != 200 or len(res.content) < 4000:
            return False
        
        with Image.open(BytesIO(res.content)) as img:
            img = img.convert("RGB")
            if img.size[0] < 120 or img.size[1] < 120:
                return False
            img.save(dest_path, "JPEG", quality=90)
            return True
    except Exception:
        return False

def build_tapis_dataset():
    DATASET_TAPIS_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("       MEMBANGUN DATASET KHUSUS TAPIS LAMPUNG       ")
    print(f"       Target Direktori: {DATASET_TAPIS_DIR}")
    print("=" * 60)

    # 1. Salin gambar Pucuk Rebung yang sudah ada di dataset_raw/Pucuk_Rebung
    target_pucuk = DATASET_TAPIS_DIR / "tapis_pucuk_rebung"
    target_pucuk.mkdir(parents=True, exist_ok=True)
    source_pucuk = DATASET_RAW_DIR / "Pucuk_Rebung"
    
    if source_pucuk.exists():
        existing_pucuk = list(source_pucuk.glob("*.jpg")) + list(source_pucuk.glob("*.png"))
        print(f"\n[1/2] Menyalin {len(existing_pucuk)} gambar Pucuk Rebung yang sudah ada...")
        for idx, f in enumerate(existing_pucuk, 1):
            dest = target_pucuk / f"pucuk_rebung_{idx:03d}.jpg"
            shutil.copy2(f, dest)
        print(f"  -> {len(existing_pucuk)} gambar tapis_pucuk_rebung siap di {target_pucuk.name}")

    # 2. Unduh gambar untuk tapis_bintang_perak
    target_bintang = DATASET_TAPIS_DIR / "tapis_bintang_perak"
    target_bintang.mkdir(parents=True, exist_ok=True)
    
    print(f"\n[2/2] Mengumpulkan citra untuk tapis_bintang_perak...")
    bintang_urls = []
    for q in TAPIS_QUERIES["tapis_bintang_perak"]:
        urls = extract_image_urls(q, max_urls=60)
        print(f"  Query '{q}': {len(urls)} URL ditemukan")
        for u in urls:
            if u not in bintang_urls:
                bintang_urls.append(u)

    print(f"  Total URL unik untuk tapis_bintang_perak: {len(bintang_urls)}")
    print("  Mengunduh gambar...")

    saved_count = len(list(target_bintang.glob("*.jpg")))
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = []
        for i, url in enumerate(bintang_urls):
            dest = target_bintang / f"bintang_perak_{saved_count + i + 1:03d}.jpg"
            futures.append(executor.submit(download_image, url, dest))

        success = 0
        for f in as_completed(futures):
            if f.result():
                success += 1

    # Rapikan penamaan file bintang perak
    valid_bintang = sorted(list(target_bintang.glob("*.jpg")))
    for idx, f in enumerate(valid_bintang, 1):
        clean_name = target_bintang / f"bintang_perak_{idx:03d}.jpg"
        if f != clean_name:
            if clean_name.exists():
                clean_name.unlink()
            f.rename(clean_name)

    total_pucuk = len(list(target_pucuk.glob("*.jpg")))
    total_bintang = len(list(target_bintang.glob("*.jpg")))

    print("\n" + "=" * 60)
    print("RINGKASAN DATASET TAPIS LAMPUNG:")
    print(f"  1. tapis_pucuk_rebung : {total_pucuk} gambar")
    print(f"  2. tapis_bintang_perak: {total_bintang} gambar")
    print("=" * 60)

if __name__ == "__main__":
    build_tapis_dataset()

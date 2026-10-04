"""
Scraper Khusus Pinterest untuk Tapis Bintang Perak Lampung
1. Menghapus total dataset bintang perak lama
2. Mengumpulkan gambar Tapis Bintang Perak asli dari Pinterest (direct + domain search)
3. Mengunduh dengan resolusi tinggi (736x / originals)
"""

import json
import re
import shutil
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
import requests
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

BASE_DIR = Path(__file__).resolve().parent.parent
TARGET_DIR = BASE_DIR / "dataset_tapis" / "tapis_bintang_perak"
CACHE_PATH = BASE_DIR / "tapis_features_cache.pt"

PINTEREST_QUERIES = [
    "kain tapis bintang perak lampung",
    "tapis bintang perak lampung",
    "motif bintang perak tapis",
    "kain tapis bintang berantai",
    "tapis lampung bintang berantai",
    "tapis lampung motif bintang",
    "kain tapis lampung benang perak",
    "tapis lampung bintang emas perak",
    "tapis sasab bintang perak lampung",
    "antique lampung tapis silver star",
    "tapis lampung star pattern textile",
    "kain tapis raja medal bintang",
    "tapis bintang perak",
    "kain tapis motif bintang",
    "lampung tapis gold silver thread star",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def clean_old_dataset():
    print("[1/4] Menghapus total dataset tapis_bintang_perak yang lama...")
    if TARGET_DIR.exists():
        shutil.rmtree(TARGET_DIR)
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    if CACHE_PATH.exists():
        CACHE_PATH.unlink()
        print(f"  [OK] Cache {CACHE_PATH.name} dihapus untuk retraining bersih.")
    print(f"  [OK] Direktori {TARGET_DIR} telah dikosongkan.")

def harvest_pinterest_direct(driver, query: str) -> set:
    urls = set()
    search_url = f"https://www.pinterest.com/search/pins/?q={urllib.parse.quote_plus(query)}&rs=typed"
    try:
        driver.get(search_url)
        time.sleep(2.5)
        for _ in range(5):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1.2)
            for img in driver.find_elements(By.TAG_NAME, "img"):
                src = img.get_attribute("src")
                if src and "pinimg.com" in src:
                    # Filter out tiny avatars (60x60, 75x75)
                    if "/60x60/" in src or "/75x75/" in src:
                        continue
                    high_res = re.sub(r'/(236x|474x|564x)/', '/736x/', src)
                    urls.add(high_res)
    except Exception as e:
        print(f"  [Direct error on '{query}']: {e}")
    return urls

def harvest_pinterest_via_search(query: str) -> set:
    urls = set()
    search_url = f"https://www.bing.com/images/search?q=site:pinterest.com+{urllib.parse.quote_plus(query)}&first=1&scenario=ImageBasicHover"
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=8)
        if r.status_code == 200:
            matches = re.findall(r'&quot;murl&quot;:&quot;(.*?)&quot;', r.text)
            for m in matches:
                clean = m.replace(r'\/', '/')
                if "pinimg.com" in clean:
                    if "/60x60/" in clean or "/75x75/" in clean:
                        continue
                    high_res = re.sub(r'/(236x|474x|564x)/', '/736x/', clean)
                    urls.add(high_res)
    except Exception:
        pass
    return urls

def download_and_validate(url: str, dest_path: Path) -> bool:
    try:
        res = requests.get(url, headers=HEADERS, timeout=8)
        if res.status_code != 200 or len(res.content) < 3000:
            return False
        with Image.open(BytesIO(res.content)) as img:
            img = img.convert("RGB")
            if img.size[0] < 120 or img.size[1] < 120:
                return False
            img.save(dest_path, "JPEG", quality=92)
            return True
    except Exception:
        return False

def main():
    print("=" * 65)
    print("   PINTEREST SCRAPER: TAPIS BINTANG PERAK LAMPUNG   ")
    print("=" * 65)

    clean_old_dataset()

    print("\n[2/4] Mengumpulkan URL citra Tapis Bintang Perak dari Pinterest...")
    all_pinimg_urls = set()

    # Metode 1: Search engine Pinterest-specific indexing
    for q in PINTEREST_QUERIES:
        found = harvest_pinterest_via_search(q)
        all_pinimg_urls.update(found)
        print(f"  [Domain Search] '{q}': {len(found)} URL (Total sementara: {len(all_pinimg_urls)})")

    # Metode 2: Direct Pinterest crawl via Selenium
    print("\n  Menjalankan direct Pinterest browser crawler...")
    driver = setup_driver()
    try:
        for q in PINTEREST_QUERIES[:6]:
            found_direct = harvest_pinterest_direct(driver, q)
            all_pinimg_urls.update(found_direct)
            print(f"  [Pinterest Direct] '{q}': {len(found_direct)} URL (Total unik: {len(all_pinimg_urls)})")
    finally:
        driver.quit()

    print(f"\n[3/4] Total citra Pinterest unik terkumpul: {len(all_pinimg_urls)} URL")
    print("  Mengunduh dan memvalidasi citra...")

    saved_count = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for i, url in enumerate(all_pinimg_urls):
            dest = TARGET_DIR / f"temp_{i:04d}.jpg"
            futures.append(executor.submit(download_and_validate, url, dest))

        for f in as_completed(futures):
            if f.result():
                saved_count += 1

    # Format dan beri nama rapi
    valid_files = sorted(list(TARGET_DIR.glob("temp_*.jpg")))
    for idx, f in enumerate(valid_files, 1):
        target = TARGET_DIR / f"bintang_perak_pinterest_{idx:03d}.jpg"
        f.rename(target)

    final_count = len(list(TARGET_DIR.glob("bintang_perak_pinterest_*.jpg")))
    print(f"\n[4/4] SUKSES! Total {final_count} citra Pinterest tersimpan di: {TARGET_DIR}")
    print("=" * 65)

if __name__ == "__main__":
    main()

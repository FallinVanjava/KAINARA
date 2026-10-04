"""
Perluas pengambilan data Pinterest untuk Tapis Bintang Perak
"""

import json
import re
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

MORE_PINTEREST_QUERIES = [
    "tapis lampung sasab bintang",
    "kain tapis lampung antik",
    "tapis lampung benang perak emas",
    "tapis bintang perak sumatera",
    "lampung tapis embroidery star",
    "lampung silver star textile",
    "kain tapis pengantin bintang",
    "lampung tapis star motif",
    "tapis sasab lampung",
    "kain tapis antik lampung benang perak",
    "tapis raja tunggal lampung",
    "tapis cucuk andak bintang lampung",
    "lampung tapis silver thread textile",
    "traditional lampung tapis cloth",
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

def harvest_pinterest_direct(driver, query: str) -> set:
    urls = set()
    search_url = f"https://www.pinterest.com/search/pins/?q={urllib.parse.quote_plus(query)}&rs=typed"
    try:
        driver.get(search_url)
        time.sleep(2.5)
        for _ in range(6):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1.2)
            for img in driver.find_elements(By.TAG_NAME, "img"):
                src = img.get_attribute("src")
                if src and "pinimg.com" in src:
                    if "/60x60/" in src or "/75x75/" in src:
                        continue
                    high_res = re.sub(r'/(236x|474x|564x)/', '/736x/', src)
                    urls.add(high_res)
    except Exception as e:
        print(f"  [Error query '{query}']: {e}")
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
    existing_files = list(TARGET_DIR.glob("bintang_perak_pinterest_*.jpg"))
    print(f"File Pinterest yang sudah ada: {len(existing_files)}")
    
    driver = setup_driver()
    new_urls = set()
    try:
        for q in MORE_PINTEREST_QUERIES:
            urls = harvest_pinterest_direct(driver, q)
            print(f"Query '{q}': {len(urls)} URL Pinterest ditemukan")
            new_urls.update(urls)
    finally:
        driver.quit()

    print(f"Total URL baru dari Pinterest: {len(new_urls)}")
    start_idx = len(existing_files) + 1
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for i, url in enumerate(new_urls):
            dest = TARGET_DIR / f"temp_extra_{i:04d}.jpg"
            futures.append(executor.submit(download_and_validate, url, dest))
        for f in as_completed(futures):
            f.result()

    for idx, f in enumerate(sorted(list(TARGET_DIR.glob("temp_extra_*.jpg"))), start_idx):
        target = TARGET_DIR / f"bintang_perak_pinterest_{idx:03d}.jpg"
        f.rename(target)

    final_count = len(list(TARGET_DIR.glob("bintang_perak_pinterest_*.jpg")))
    print(f"\nTOTAL AKHIR DATASET PINTEREST TAPIS BINTANG PERAK: {final_count} gambar")

if __name__ == "__main__":
    main()

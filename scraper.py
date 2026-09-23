import concurrent.futures
import json
import os
import time
import urllib.parse
from io import BytesIO
from pathlib import Path
import requests
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "backend" / "dataset_raw"
MAX_IMAGES_PER_CLASS = 150
MAX_DOWNLOAD_WORKERS = 16

MOTIF_QUERIES = {
    "Sembagi": [
        "kain batik sembagi lampung",
        "batik sembagi lampung motif",
        "kain tenun sembagi lampung",
        "motif sembagi kuno sumatera",
    ],
    "Siger": [
        "kain batik motif siger lampung",
        "kain tapis siger lampung",
        "batik mahkota siger lampung",
        "tapis lampung benang emas siger",
    ],
    "Gajah": [
        "batik way kambas gajah lampung",
        "kain tapis motif gajah lampung",
        "tenun gajah lampung motif",
        "batik motif gajah lampung",
    ],
    "Kapal": [
        "kain palepai kapal lampung",
        "kain tenun kapal lampung",
        "kain tampan ship cloth lampung",
        "palepai textile lampung indonesia",
    ],
    "Pucuk_Rebung": [
        "tapis pucuk rebung lampung",
        "motif tumpal pucuk rebung tapis",
        "kain tapis lampung pucuk rebung",
        "tenun pucuk rebung sumatera",
    ],
    "Belah_Ketupat": [
        "batik belah ketupat lampung",
        "kain batik motif belah ketupat",
        "kain tapis motif belah ketupat",
        "motif geometris tapis lampung",
    ],
    "Bunga_Ashar": [
        "batik bunga ashar lampung",
        "kain motif kembang ashar lampung",
        "batik lampung motif bunga ashar",
        "kain tenun bunga ashar",
    ],
    "Gamolan": [
        "batik motif gamolan lampung",
        "kain batik alat musik gamolan",
        "batik gamolan pekhing lampung",
        "kain tenun gamolan lampung",
    ],
}

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.page_load_strategy = "eager"
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(15)
    return driver

def fetch_and_validate_image(url: str) -> bytes:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        }
        res = requests.get(url, timeout=(2.0, 3.5), headers=headers)
        if res.status_code != 200 or len(res.content) < 3000:
            return None

        with Image.open(BytesIO(res.content)) as img:
            img.verify()
            if img.size[0] < 100 or img.size[1] < 100:
                return None

        return res.content
    except Exception:
        return None

def extract_bing_image_urls(driver, query: str) -> list:
    encoded = urllib.parse.quote_plus(query)
    search_url = f"https://www.bing.com/images/search?q={encoded}&first=1&scenario=ImageBasicHover"
    try:
        driver.get(search_url)
    except Exception:
        pass
    time.sleep(1.0)

    urls = []
    seen = set()

    for scroll in range(4):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.8)

        try:
            more_btn = driver.find_element(By.CSS_SELECTOR, "a.btn_seemore, .btn_seemore")
            if more_btn.is_displayed():
                more_btn.click()
                time.sleep(0.6)
        except Exception:
            pass

        elements = driver.find_elements(By.CSS_SELECTOR, "a.iusc")
        for el in elements:
            m_attr = el.get_attribute("m")
            if not m_attr:
                continue
            try:
                data = json.loads(m_attr)
                img_url = data.get("murl") or data.get("turl")
                if img_url and img_url not in seen:
                    seen.add(img_url)
                    urls.append(img_url)
            except Exception:
                continue

    return urls

def clean_folder(folder_path: Path, prefix: str):
    """Menghapus file temp dan memastikan file dinomori rapi maksimal 150."""
    # Hapus semua file temp
    for f in folder_path.glob("temp_*"):
        f.unlink(missing_ok=True)

    # Ambil file valid yang berformat benar
    valid_files = sorted(
        [f for f in folder_path.iterdir() if f.is_file() and not f.name.startswith("temp_")],
        key=lambda x: x.name
    )

    # Batasi ke MAX_IMAGES_PER_CLASS
    if len(valid_files) > MAX_IMAGES_PER_CLASS:
        for f in valid_files[MAX_IMAGES_PER_CLASS:]:
            f.unlink(missing_ok=True)
        valid_files = valid_files[:MAX_IMAGES_PER_CLASS]

    # Re-index secara berurutan jika perlu
    for idx, f in enumerate(valid_files, 1):
        target_name = folder_path / f"{prefix}_{idx:03d}.jpg"
        if f != target_name:
            if target_name.exists():
                target_name.unlink(missing_ok=True)
            f.rename(target_name)

    return len(list(folder_path.glob(f"{prefix}_*.jpg")))

def scrape_motif(driver, motif: str, queries: list):
    folder_path = OUTPUT_DIR / motif
    folder_path.mkdir(parents=True, exist_ok=True)
    prefix = motif.lower()

    # Bersihkan dan hitung file valid yang sudah ada
    current_count = clean_folder(folder_path, prefix)

    if current_count >= MAX_IMAGES_PER_CLASS:
        print(f"[{motif}] Sudah lengkap ({current_count}/{MAX_IMAGES_PER_CLASS} gambar). Lanjut ke motif berikutnya.")
        return

    print(f"\n=======================================================")
    print(f"[+] SCRAPING MOTIF: {motif} (Saat ini: {current_count}/{MAX_IMAGES_PER_CLASS})")
    print(f"=======================================================")

    all_candidate_urls = []
    seen_urls = set()

    # 1. Kumpulkan semua URL kandidat dari queries
    for q in queries:
        query_urls = extract_bing_image_urls(driver, q)
        for u in query_urls:
            if u not in seen_urls:
                seen_urls.add(u)
                all_candidate_urls.append(u)
        print(f"  -> '{q}': {len(query_urls)} URL (Total: {len(all_candidate_urls)} kandidat)")
        if len(all_candidate_urls) >= (MAX_IMAGES_PER_CLASS - current_count) * 2:
            break

    # 2. Unduh secara paralel dengan thread pool
    needed = MAX_IMAGES_PER_CLASS - current_count
    print(f"\n  [*] Mengunduh {needed} gambar secara paralel (16 worker)...")

    saved = current_count
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_DOWNLOAD_WORKERS) as executor:
        future_to_url = {executor.submit(fetch_and_validate_image, u): u for u in all_candidate_urls}
        for future in concurrent.futures.as_completed(future_to_url):
            if saved >= MAX_IMAGES_PER_CLASS:
                break
            img_bytes = future.result()
            if img_bytes:
                saved += 1
                dest = folder_path / f"{prefix}_{saved:03d}.jpg"
                with open(dest, "wb") as f:
                    f.write(img_bytes)
                if saved % 5 == 0 or saved == MAX_IMAGES_PER_CLASS:
                    print(f"  Mengunduh {saved}/{MAX_IMAGES_PER_CLASS} untuk motif {motif}...")

    final_total = clean_folder(folder_path, prefix)
    print(f"  [SELESAI] {motif}: Total {final_total} gambar tersimpan di {folder_path}\n")

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("=====================================================")
    print("   KAINARA PARALLEL HIGH-RES VISUAL SCRAPER          ")
    print(f"   Output Direktori: {OUTPUT_DIR}                   ")
    print(f"   Jumlah Motif: {len(MOTIF_QUERIES)} kelas          ")
    print("=====================================================\n")

    driver = setup_driver()
    try:
        for motif, queries in MOTIF_QUERIES.items():
            scrape_motif(driver, motif, queries)
    finally:
        driver.quit()
        print("\n=====================================================")
        print("   SEMUA 8 MOTIF SELESAI DIKUMPULKAN!               ")
        print(f"   Silakan cek folder: {OUTPUT_DIR}                 ")
        print("=====================================================")

if __name__ == "__main__":
    main()

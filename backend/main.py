import os
import io
import shutil
import uuid
import random
from pathlib import Path
from typing import List
import base64

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ML Imports
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image

# ONNX Runtime (Optional for production inference)
try:
    import onnxruntime as ort
    HAS_ONNX = True
except ImportError:
    HAS_ONNX = False

app = FastAPI(title="KAINARA AI Backend", version="2.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = (BASE_DIR / "dataset_tapis") if (BASE_DIR / "dataset_tapis").exists() else ((BASE_DIR / "dataset_raw") if (BASE_DIR / "dataset_raw").exists() else (BASE_DIR / "dataset"))
ORIGINAL_DIR = DATASET_DIR
HARD_NEGATIVES_DIR = BASE_DIR / "dataset" / "hard_negatives"
UNLABELED_DIR = BASE_DIR / "dataset" / "unlabeled"
MODELS_DIR = BASE_DIR / "models"

MODEL_WEIGHTS_PATH = BASE_DIR / "best_model_weights.pth"
SKINTONE_WEIGHTS_PATH = BASE_DIR / "skintone_mobilenet_v2.pth"
ONNX_BATIK_PATH = MODELS_DIR / "tapis_resnet50.onnx"
ONNX_SKIN_PATH = MODELS_DIR / "skintone_mobilenet.onnx"

MAX_UPLOAD_SIZE = 2 * 1024 * 1024  # 2MB
MINIMUM_CONFIDENCE = 0.30

# === CONFIG TAPIS SCANNER (Fokus Wastra Tapis Lampung) ===
CLASS_NAMES = [
    "tapis_bintang_perak",
    "tapis_pucuk_rebung",
]

# HARDCODED PHILOSOPHY TAPIS LAMPUNG
MOTIF_PHILOSOPHY = {
    "tapis_bintang_perak": "Pola bintang perak bersulam benang perak dan emas melambangkan kemilau harapan, kejayaan leluhur maritim, serta ketinggian derajat budi pekerti wanita Lampung dalam upacara adat agung.",
    "tapis_pucuk_rebung": "Susunan segitiga berderet dari tunas bambu melambangkan kekuatan menghadapi rintangan hidup, pertumbuhan budi pekerti yang kokoh dari generasi ke generasi, dan tatanan hirarki kepemimpinan adat yang luhur.",
}

def get_motif_philosophy(motif_id: str) -> str:
    return MOTIF_PHILOSOPHY.get(motif_id, "Filosofi motif Tapis tidak ditemukan.")

# === CONFIG SKIN TONE SCANNER ===
SKIN_CLASS_NAMES = ["cool", "neutral", "warm"]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INIT] Memuat AI Models menggunakan device: {device}")

def create_tapis_head(num_classes: int = len(CLASS_NAMES)):
    return torch.nn.Sequential(
        torch.nn.Linear(2048, 256),
        torch.nn.BatchNorm1d(256),
        torch.nn.GELU(),
        torch.nn.Dropout(p=0.3),
        torch.nn.Linear(256, 64),
        torch.nn.BatchNorm1d(64),
        torch.nn.GELU(),
        torch.nn.Dropout(p=0.15),
        torch.nn.Linear(64, num_classes),
    )

# 1. INIT TAPIS MODEL (PyTorch & ONNX support)
model_batik = models.resnet50(weights=None)
model_batik.fc = create_tapis_head()
HAS_TRAINED_BATIK = False
onnx_batik_session = None

if HAS_ONNX and ONNX_BATIK_PATH.exists():
    try:
        onnx_batik_session = ort.InferenceSession(str(ONNX_BATIK_PATH), providers=["CPUExecutionProvider"])
        print(f"[INIT] Tapis ONNX Model DIMUAT dari {ONNX_BATIK_PATH.name}.")
    except Exception as e:
        print(f"[INIT] Peringatan: Gagal memuat ONNX Tapis ({e}).")

if onnx_batik_session is None:
    try:
        model_batik.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location=device))
        HAS_TRAINED_BATIK = True
        print(f"[INIT] Tapis Model (ResNet50 Production Head) DIMUAT dari {MODEL_WEIGHTS_PATH.name}.")
    except Exception as e:
        print(f"[INIT] Peringatan: Gagal memuat bobot model ({e}). Menggunakan Fallback Mock.")
    model_batik.to(device)
    model_batik.eval()

# 2. INIT SKIN TONE MODEL (PyTorch & ONNX support)
model_skin = models.mobilenet_v2(pretrained=False)
model_skin.classifier[1] = torch.nn.Linear(model_skin.classifier[1].in_features, len(SKIN_CLASS_NAMES))
HAS_TRAINED_SKIN = False
onnx_skin_session = None

if HAS_ONNX and ONNX_SKIN_PATH.exists():
    try:
        onnx_skin_session = ort.InferenceSession(str(ONNX_SKIN_PATH), providers=["CPUExecutionProvider"])
        print(f"[INIT] Skin Tone ONNX Model DIMUAT dari {ONNX_SKIN_PATH.name}.")
    except Exception as e:
        print(f"[INIT] Peringatan: Gagal memuat ONNX Skin Tone ({e}).")

if onnx_skin_session is None:
    try:
        model_skin.load_state_dict(torch.load(SKINTONE_WEIGHTS_PATH, map_location=device))
        HAS_TRAINED_SKIN = True
        print(f"[INIT] Skin Tone Model (MobileNetV2) DIMUAT.")
    except FileNotFoundError:
        print("[INIT] Peringatan: Skin Tone Model bobot tidak ditemukan. Menggunakan Fallback Mock.")
    model_skin.to(device)
    model_skin.eval()

# PREPROCESSING STANDARD
preprocess_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),         
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# ==============================================================
# ROUTE 1: BATIK SCANNER
# ==============================================================
def simulate_inference_batik(filename: str) -> List[float]:
    probs = [random.uniform(0.01, 0.05) for _ in range(len(CLASS_NAMES))]
    filename_lower = filename.lower()
    
    if "pucuk" in filename_lower or "rebung" in filename_lower or "tumpal" in filename_lower:
        probs[CLASS_NAMES.index("tapis_pucuk_rebung")] = 0.92
    elif "bintang" in filename_lower or "perak" in filename_lower or "star" in filename_lower:
        probs[CLASS_NAMES.index("tapis_bintang_perak")] = 0.94
    elif "blur" in filename_lower or "bukantapis" in filename_lower:
        probs = [0.20, 0.20]
    else:
        seed = random.choice([0, 1])
        probs[seed] = random.uniform(0.80, 0.96)
    return [p / sum(probs) for p in probs]

@app.post("/v1/scan")
async def scan_batik(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"success": False, "code": "INVALID_FORMAT", "message": "File harus berupa gambar."})
    
    file_bytes = await image.read()
    if len(file_bytes) > MAX_UPLOAD_SIZE:
        return JSONResponse(status_code=413, content={"success": False, "code": "PAYLOAD_TOO_LARGE", "message": "Ukuran file melebihi batas 2MB."})

    try:
        if onnx_batik_session is not None:
            # Single-pass fast inference via ONNX
            img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            input_tensor = preprocess_transform(img).unsqueeze(0).numpy()
            ort_inputs = {onnx_batik_session.get_inputs()[0].name: input_tensor}
            ort_outs = onnx_batik_session.run(None, ort_inputs)
            logits = torch.from_numpy(ort_outs[0])
            probs = F.softmax(logits, dim=1).squeeze().tolist()
        elif HAS_TRAINED_BATIK:
            img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            
            # Test-Time Augmentation (TTA): 3-view averaging for maximum accuracy
            t1 = preprocess_transform(img).unsqueeze(0)
            t2 = preprocess_transform(img.transpose(Image.FLIP_LEFT_RIGHT)).unsqueeze(0)
            
            w, h = img.size
            crop_box = (int(w * 0.08), int(h * 0.08), int(w * 0.92), int(h * 0.92))
            t3 = preprocess_transform(img.crop(crop_box)).unsqueeze(0)

            batch_tensor = torch.cat([t1, t2, t3], dim=0).to(device)
            with torch.no_grad():
                outputs = model_batik(batch_tensor)
                probs_batch = F.softmax(outputs, dim=1)
                probs = probs_batch.mean(dim=0).squeeze().tolist()
        else:
            probs = simulate_inference_batik(image.filename)
    except Exception as e:
        print(f"[ERROR] Inference scan_batik: {e}")
        return JSONResponse(status_code=500, content={"success": False, "code": "INFERENCE_ERROR", "message": "Inference engine failure."})
    
    results_scored = [(CLASS_NAMES[i], p, i) for i, p in enumerate(probs)]
    results_scored.sort(key=lambda x: x[1], reverse=True)
    top_motif_id, top_confidence, raw_index = results_scored[0]
    
    if top_confidence < MINIMUM_CONFIDENCE:
        return JSONResponse(status_code=200, content={"success": False, "code": "LOW_CONFIDENCE", "message": "Motif tidak teridentifikasi dengan jelas.", "confidence": round(top_confidence, 4)})

    return {
        "success": True,
        "data": {
            "motif_id": top_motif_id,
            "name": top_motif_id.replace("_", " ").title(),
            "confidence": round(top_confidence, 4),
            "philosophy": get_motif_philosophy(top_motif_id), 
            "alternatives": [{"motif_id": m, "name": m.replace("_", " ").title(), "confidence": round(c, 4)} for m, c, _ in results_scored[1:3]]
        }
    }

# ==============================================================
# ROUTE 2: SKIN TONE SCANNER
# ==============================================================
def simulate_inference_skin() -> List[float]:
    probs = [random.uniform(0.1, 0.3) for _ in range(len(SKIN_CLASS_NAMES))]
    seed = random.randint(0, 2)
    probs[seed] = random.uniform(0.7, 0.9)
    return [p / sum(probs) for p in probs]

@app.post("/v1/skintone")
async def scan_skintone(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"success": False, "code": "INVALID_FORMAT", "message": "File harus berupa gambar."})
    
    file_bytes = await image.read()
    if len(file_bytes) > MAX_UPLOAD_SIZE:
        return JSONResponse(status_code=413, content={"success": False, "code": "PAYLOAD_TOO_LARGE", "message": "Ukuran file melebihi batas 2MB."})

    try:
        if onnx_skin_session is not None:
            img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            input_tensor = preprocess_transform(img).unsqueeze(0).numpy()
            ort_inputs = {onnx_skin_session.get_inputs()[0].name: input_tensor}
            ort_outs = onnx_skin_session.run(None, ort_inputs)
            logits = torch.from_numpy(ort_outs[0])
            probs = F.softmax(logits, dim=1).squeeze().tolist()
        elif HAS_TRAINED_SKIN:
            img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            input_tensor = preprocess_transform(img).unsqueeze(0).to(device)
            with torch.no_grad():
                outputs = model_skin(input_tensor)
                probs = F.softmax(outputs, dim=1).squeeze().tolist()
        else:
            probs = simulate_inference_skin()
    except Exception as e:
        print(f"[ERROR] Inference scan_skintone: {e}")
        return JSONResponse(status_code=500, content={"success": False, "code": "INFERENCE_ERROR", "message": "Inference engine failure."})
    
    results_scored = [(SKIN_CLASS_NAMES[i], p) for i, p in enumerate(probs)]
    results_scored.sort(key=lambda x: x[1], reverse=True)
    top_tone, top_confidence = results_scored[0]
    
    return {"success": True, "data": {"tone": top_tone, "confidence": round(top_confidence, 4)}}

# ==============================================================
# ROUTE 3: FEEDBACK LOOP
# ==============================================================
@app.post("/v1/scan/feedback")
async def scan_feedback(image: UploadFile = File(...), correct_motif_id: str = Form(...)):
    if correct_motif_id not in CLASS_NAMES: raise HTTPException(status_code=400, detail="ID Motif tidak valid.")
    class_dir = HARD_NEGATIVES_DIR / correct_motif_id
    class_dir.mkdir(parents=True, exist_ok=True)
    ext = os.path.splitext(image.filename)[1] or ".jpg"
    unique_filename = f"feedback_{uuid.uuid4().hex[:8]}{ext}"
    file_path = class_dir / unique_filename
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal menyimpan gambar feedback.")
    return {"success": True, "message": "Terima kasih! Laporan feedback berhasil disimpan."}


# ==============================================================
# ROUTE 4: ADMIN LABELER (HITL)
# ==============================================================
class LabelRequest(BaseModel):
    filename: str
    motif_id: str

@app.get("/v1/admin/unlabeled")
async def get_unlabeled_images():
    """Mengambil satu gambar acak dari folder unlabeled beserta prediksi AI sementaranya."""
    UNLABELED_DIR.mkdir(parents=True, exist_ok=True)
    files = [f for f in os.listdir(UNLABELED_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    if not files:
        return {"success": True, "data": None, "message": "Folder unlabeled kosong."}
    
    # Ambil 1 file acak untuk dilabeli
    target_file = random.choice(files)
    file_path = UNLABELED_DIR / target_file
    
    # Baca gambar menjadi Base64 agar frontend bisa merendernya
    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
    # AI mencoba menebak (Meskipun AI bodoh, ini bisa jadi patokan awal)
    try:
        with open(file_path, "rb") as image_file:
            file_bytes = image_file.read()
            if HAS_TRAINED_BATIK:
                img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
                input_tensor = preprocess_transform(img).unsqueeze(0).to(device)
                with torch.no_grad():
                    outputs = model_batik(input_tensor)
                    probs = F.softmax(outputs, dim=1).squeeze().tolist()
            else:
                probs = simulate_inference_batik(target_file)
                
        results_scored = [(CLASS_NAMES[i], p) for i, p in enumerate(probs)]
        results_scored.sort(key=lambda x: x[1], reverse=True)
        top_motif_id, top_confidence = results_scored[0]
        ai_guess = {"motif_id": top_motif_id, "confidence": round(top_confidence, 4)}
    except Exception:
        ai_guess = None

    return {
        "success": True,
        "data": {
            "filename": target_file,
            "image_base64": f"data:image/jpeg;base64,{encoded_string}",
            "ai_guess": ai_guess,
            "remaining": len(files)
        }
    }

@app.post("/v1/admin/label")
async def process_label(req: LabelRequest):
    """Memindahkan file dari unlabeled ke original folder berdasarkan label user."""
    if req.motif_id not in CLASS_NAMES:
        raise HTTPException(status_code=400, detail="ID Motif tidak valid.")
        
    source_path = UNLABELED_DIR / req.filename
    if not source_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan di folder unlabeled.")
        
    # Buat direktori kelas tujuan di original
    target_dir = ORIGINAL_DIR / req.motif_id
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Beri nama unik agar tidak bentrok
    ext = os.path.splitext(req.filename)[1] or ".jpg"
    new_filename = f"labeled_{uuid.uuid4().hex[:8]}{ext}"
    target_path = target_dir / new_filename
    
    # Pindahkan file
    try:
        shutil.move(str(source_path), str(target_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memindahkan file: {str(e)}")
        
    return {"success": True, "message": f"Gambar berhasil dilabeli dan disimpan ke {req.motif_id}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

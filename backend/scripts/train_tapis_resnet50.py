"""
KAINARA Tapis-Only ResNet50 Training & Export Pipeline
Fokus khusus pada klasifikasi motif Tapis Lampung:
1. tapis_pucuk_rebung (Tapis Pucuk Rebung)
2. tapis_bintang_perak (Tapis Bintang Perak)
"""

import copy
import random
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from PIL import Image, ImageEnhance, ImageFilter
from torch.utils.data import DataLoader, TensorDataset, random_split
from torchvision import models

torch.set_num_threads(8)

TAPIS_CLASS_NAMES = [
    "tapis_bintang_perak",
    "tapis_pucuk_rebung",
]

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_TAPIS_DIR = BASE_DIR / "dataset_tapis"
CACHE_PATH = BASE_DIR / "tapis_features_cache.pt"
MODEL_SAVE_PATH = BASE_DIR / "best_model_weights.pth"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
ONNX_SAVE_PATH = MODELS_DIR / "tapis_resnet50.onnx"

BATCH_SIZE = 16
NUM_EPOCHS = 60
TARGET_SIZE = 224

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 1, 3)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 1, 3)


def build_tapis_head(num_classes: int = len(TAPIS_CLASS_NAMES)):
    return nn.Sequential(
        nn.Linear(2048, 256),
        nn.BatchNorm1d(256),
        nn.GELU(),
        nn.Dropout(p=0.3),
        nn.Linear(256, 64),
        nn.BatchNorm1d(64),
        nn.GELU(),
        nn.Dropout(p=0.15),
        nn.Linear(64, num_classes),
    )


def img_to_tensor(pil_img):
    arr = np.array(pil_img.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.BILINEAR), dtype=np.float32)
    arr = (arr / 255.0 - MEAN) / STD
    return arr.transpose(2, 0, 1)


def random_color_jitter(img):
    img = ImageEnhance.Brightness(img).enhance(random.uniform(0.75, 1.25))
    img = ImageEnhance.Contrast(img).enhance(random.uniform(0.75, 1.25))
    img = ImageEnhance.Color(img).enhance(random.uniform(0.75, 1.25))
    return img


def random_crop(img, scale=0.85):
    w, h = img.size
    nw, nh = int(w * scale), int(h * scale)
    x = random.randint(0, max(1, w - nw))
    y = random.randint(0, max(1, h - nh))
    return img.crop((x, y, x + nw, y + nh))


def augment_tapis_image(img_rgb):
    views = []
    base = img_rgb.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.BILINEAR)

    # 1. Original
    views.append(img_to_tensor(base))
    # 2. H-Flip
    views.append(img_to_tensor(base.transpose(Image.FLIP_LEFT_RIGHT)))
    # 3. 180 Rotation
    views.append(img_to_tensor(base.transpose(Image.ROTATE_180)))
    # 4. Center crop 85%
    w, h = img_rgb.size
    box = (int(w * 0.075), int(h * 0.075), int(w * 0.925), int(h * 0.925))
    views.append(img_to_tensor(img_rgb.crop(box)))
    # 5. Color Jitter
    views.append(img_to_tensor(random_color_jitter(base)))
    # 6. Random crop + jitter
    views.append(img_to_tensor(random_color_jitter(random_crop(img_rgb, 0.8))))
    # 7. Gaussian Blur
    views.append(img_to_tensor(base.filter(ImageFilter.GaussianBlur(radius=1.0))))

    return views


def extract_and_cache_tapis():
    print("[1/2] Membaca dataset Tapis dan menjalankan 7-view augmentation...", flush=True)
    classes = TAPIS_CLASS_NAMES
    tensors, labels = [], []

    for cls_idx, cls_name in enumerate(classes):
        folder = DATASET_TAPIS_DIR / cls_name
        files = list(folder.glob("*.jpg")) + list(folder.glob("*.png")) + list(folder.glob("*.webp"))
        for img_p in files:
            try:
                with Image.open(img_p) as img:
                    img_rgb = img.convert("RGB")
                    for v in augment_tapis_image(img_rgb):
                        tensors.append(v)
                        labels.append(cls_idx)
            except Exception as e:
                print(f"  [SKIP] {img_p.name}: {e}", flush=True)
        print(f"  {cls_name}: {len(files)} raw images ({len(files)*7} augmented views)", flush=True)

    X_raw = torch.tensor(np.array(tensors), dtype=torch.float32)
    y_raw = torch.tensor(labels, dtype=torch.long)
    print(f"Total Tapis Tensor: {X_raw.shape}", flush=True)

    print("\n[2/2] Mengekstrak ResNet50 Feature Embeddings...", flush=True)
    t0 = time.time()
    device = torch.device("cpu")
    base_model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    feature_extractor = nn.Sequential(*list(base_model.children())[:-1]).to(device)
    feature_extractor.eval()

    feats_list = []
    with torch.no_grad():
        for i in range(0, len(X_raw), 64):
            batch = X_raw[i : i + 64]
            out = feature_extractor(batch)
            feats_list.append(torch.flatten(out, 1))
            done = min(i + 64, len(X_raw))
            if (i // 64) % 10 == 0 or done == len(X_raw):
                print(f"  -> {done}/{len(X_raw)} ({time.time() - t0:.0f}s)", flush=True)

    X_feats = torch.cat(feats_list, dim=0)
    print(f"Ekstraksi selesai dalam {time.time() - t0:.1f}s. Menyimpan cache ke {CACHE_PATH}...", flush=True)
    torch.save({"feats": X_feats, "labels": y_raw}, CACHE_PATH)
    return X_feats, y_raw


def train_tapis_model():
    if CACHE_PATH.exists():
        print(f"Memuat features dari cache: {CACHE_PATH}", flush=True)
        cached_data = torch.load(CACHE_PATH)
        X_feats, y_raw = cached_data["feats"], cached_data["labels"]
    else:
        X_feats, y_raw = extract_and_cache_tapis()

    print(f"\nDataset Tapis: {X_feats.shape}, Labels: {y_raw.shape}", flush=True)
    device = torch.device("cpu")

    # Split 80/20
    val_size = int(0.20 * len(X_feats))
    train_size = len(X_feats) - val_size
    gen = torch.Generator().manual_seed(42)
    train_ds, val_ds = random_split(TensorDataset(X_feats, y_raw), [train_size, val_size], generator=gen)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, drop_last=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

    print(f"Training set: {train_size} samples | Validation set: {val_size} samples")

    # Head Training
    head = build_tapis_head().to(device)
    optimizer = optim.AdamW(head.parameters(), lr=1.5e-3, weight_decay=1e-2)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.03)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=NUM_EPOCHS, eta_min=1e-5)

    best_val_acc = 0.0
    best_head_state = copy.deepcopy(head.state_dict())

    print(f"\nMelatih Model Tapis ({NUM_EPOCHS} epochs, AdamW)...")
    for epoch in range(NUM_EPOCHS):
        head.train()
        train_correct, train_total = 0, 0
        for feats, lbls in train_loader:
            optimizer.zero_grad()
            logits = head(feats)
            loss = criterion(logits, lbls)
            loss.backward()
            optimizer.step()
            train_correct += (logits.argmax(1) == lbls).sum().item()
            train_total += lbls.size(0)
        scheduler.step()

        head.eval()
        val_correct, val_total = 0, 0
        with torch.no_grad():
            for feats, lbls in val_loader:
                preds = head(feats).argmax(1)
                val_correct += (preds == lbls).sum().item()
                val_total += lbls.size(0)

        val_acc = val_correct / val_total * 100
        train_acc = train_correct / train_total * 100

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_head_state = copy.deepcopy(head.state_dict())
            marker = " *BEST*"
        else:
            marker = ""

        if (epoch + 1) % 10 == 0 or epoch == 0 or marker:
            print(f"  Epoch {epoch+1:02d}/{NUM_EPOCHS} | Train: {train_acc:.1f}% | Val: {val_acc:.2f}%{marker}", flush=True)

    # Per-class accuracy
    head.load_state_dict(best_head_state)
    head.eval()
    per_class_correct = [0] * len(TAPIS_CLASS_NAMES)
    per_class_total = [0] * len(TAPIS_CLASS_NAMES)
    with torch.no_grad():
        for feats, lbls in val_loader:
            preds = head(feats).argmax(1)
            for p, l in zip(preds.tolist(), lbls.tolist()):
                per_class_total[l] += 1
                if p == l:
                    per_class_correct[l] += 1

    print("\nAkurasi Per-Kelas Tapis Lampung pada Validation Set:", flush=True)
    for i, cn in enumerate(TAPIS_CLASS_NAMES):
        acc = per_class_correct[i] / max(per_class_total[i], 1) * 100
        print(f"  {cn:25s}: {per_class_correct[i]:3d}/{per_class_total[i]:3d} = {acc:.2f}%")

    # Build and Save Full PyTorch Model
    print("\nMenyimpan bobot lengkap model Tapis ke .pth...", flush=True)
    base_model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    full_model = models.resnet50(weights=None)
    full_model.fc = build_tapis_head()

    full_dict = full_model.state_dict()
    for k, v in base_model.state_dict().items():
        if k in full_dict and not k.startswith("fc."):
            full_dict[k] = v
    for k, v in best_head_state.items():
        full_dict[f"fc.{k}"] = v

    full_model.load_state_dict(full_dict)
    torch.save(full_model.state_dict(), MODEL_SAVE_PATH)
    print(f"  [OK] Model PyTorch tersimpan di: {MODEL_SAVE_PATH}")

    # Export to ONNX
    print("Mengekspor model Tapis ke format ONNX untuk produksi...", flush=True)
    try:
        full_model.eval()
        dummy_input = torch.randn(1, 3, 224, 224, requires_grad=False)
        torch.onnx.export(
            full_model,
            dummy_input,
            str(ONNX_SAVE_PATH),
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=["input"],
            output_names=["output"],
            dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
        )
        print(f"  [OK] Model ONNX tersimpan di: {ONNX_SAVE_PATH}")
    except Exception as e:
        print(f"  [INFO] Ekspor ONNX dilewati ({e}). Model PyTorch .pth siap digunakan sepenuhnya.")
    print(f"\nPELATIHAN SELESAI DENGAN AKURASI VALIDASI: {best_val_acc:.2f}%\n")
    return best_val_acc


if __name__ == "__main__":
    train_tapis_model()

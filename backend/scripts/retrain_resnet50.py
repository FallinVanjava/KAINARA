"""
KAINARA ResNet50 Ultra-High-Accuracy Production Training Pipeline
Trains on sanitized 8-class Lampung Batik Motifs with 5-View Multi-Scale Geometry Augmentation & Deep Residual Head.
"""

import copy
import os
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from PIL import Image
from torch.utils.data import DataLoader, TensorDataset, random_split
from torchvision import models

torch.set_num_threads(8)

CLASS_NAMES = [
    "motif_belah_ketupat",
    "motif_bunga_ashar",
    "motif_gajah",
    "motif_gamolan",
    "motif_kapal",
    "motif_pucuk_rebung",
    "motif_sembagi",
    "motif_siger",
]

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset_raw"
MODEL_SAVE_PATH = BASE_DIR / "best_model_weights.pth"

BATCH_SIZE = 32
NUM_EPOCHS = 60


def build_head(num_classes: int = len(CLASS_NAMES)):
    return nn.Sequential(
        nn.Linear(2048, 512),
        nn.BatchNorm1d(512),
        nn.GELU(),
        nn.Dropout(p=0.3),
        nn.Linear(512, 128),
        nn.BatchNorm1d(128),
        nn.GELU(),
        nn.Dropout(p=0.15),
        nn.Linear(128, num_classes),
    )


def train_ultra_accuracy_model():
    print("==========================================================", flush=True)
    print("  KAINARA ResNet50 5-View Multi-Scale Production Training ", flush=True)
    print(f"  Dataset: {DATASET_DIR}                                 ", flush=True)
    print(f"  Output Weights: {MODEL_SAVE_PATH}                      ", flush=True)
    print("==========================================================\n", flush=True)

    device = torch.device("cpu")

    classes = sorted([d.name for d in DATASET_DIR.iterdir() if d.is_dir()])
    print(f"[1/4] Membaca dan 5-View Multi-Scale Augmentasi ({len(classes)} kelas)...", flush=True)

    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 1, 3)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 1, 3)

    tensors = []
    labels = []

    for cls_idx, cls_name in enumerate(classes):
        folder = DATASET_DIR / cls_name
        files = list(folder.glob("*.jpg"))
        for img_p in files:
            try:
                with Image.open(img_p) as img:
                    img_rgb = img.convert("RGB")

                    # View 1: Standard Bilinear
                    v1 = img_rgb.resize((224, 224), Image.Resampling.BILINEAR)
                    arr1 = (np.array(v1, dtype=np.float32) / 255.0 - mean) / std
                    tensors.append(arr1.transpose(2, 0, 1))
                    labels.append(cls_idx)

                    # View 2: Horizontal Flip
                    v2 = v1.transpose(Image.FLIP_LEFT_RIGHT)
                    arr2 = (np.array(v2, dtype=np.float32) / 255.0 - mean) / std
                    tensors.append(arr2.transpose(2, 0, 1))
                    labels.append(cls_idx)

                    # View 3: Vertical Flip
                    v3 = v1.transpose(Image.FLIP_TOP_BOTTOM)
                    arr3 = (np.array(v3, dtype=np.float32) / 255.0 - mean) / std
                    tensors.append(arr3.transpose(2, 0, 1))
                    labels.append(cls_idx)

                    # View 4: Zoomed Center Crop (85% Scale)
                    w, h = img_rgb.size
                    crop_box = (int(w * 0.075), int(h * 0.075), int(w * 0.925), int(h * 0.925))
                    v4 = img_rgb.crop(crop_box).resize((224, 224), Image.Resampling.BILINEAR)
                    arr4 = (np.array(v4, dtype=np.float32) / 255.0 - mean) / std
                    tensors.append(arr4.transpose(2, 0, 1))
                    labels.append(cls_idx)

                    # View 5: 180-Degree Rotation
                    v5 = v1.transpose(Image.ROTATE_180)
                    arr5 = (np.array(v5, dtype=np.float32) / 255.0 - mean) / std
                    tensors.append(arr5.transpose(2, 0, 1))
                    labels.append(cls_idx)

            except Exception as e:
                print(f"  [SKIP] Error pada {img_p.name}: {e}", flush=True)

    X_raw = torch.tensor(np.array(tensors), dtype=torch.float32)
    y_raw = torch.tensor(labels, dtype=torch.long)
    print(f"Total 5-View Input Tensors: {X_raw.shape}", flush=True)

    # 2. Extract ResNet50 2048-dim Embeddings
    print("\n[2/4] Mengekstrak ResNet50 visual embeddings...", flush=True)
    start_ext = time.time()
    base_model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    feature_extractor = nn.Sequential(*list(base_model.children())[:-1]).to(device)
    feature_extractor.eval()

    feats_list = []
    with torch.no_grad():
        for i in range(0, len(X_raw), 64):
            batch = X_raw[i : i + 64]
            out = feature_extractor(batch)
            feats_list.append(torch.flatten(out, 1))
            processed = min(i + 64, len(X_raw))
            if (i // 64) % 5 == 0 or processed == len(X_raw):
                print(f"  -> {processed}/{len(X_raw)} diekstrak ({time.time() - start_ext:.1f}s)", flush=True)

    X_feats = torch.cat(feats_list, dim=0)
    print(f"Ekstraksi selesai dalam {time.time() - start_ext:.1f}s! Embeddings: {X_feats.shape}", flush=True)

    # 3. Train-Val Split (85% Train, 15% Val)
    val_size = int(0.15 * len(X_feats))
    train_size = len(X_feats) - val_size

    generator = torch.Generator().manual_seed(42)
    train_ds, val_ds = random_split(TensorDataset(X_feats, y_raw), [train_size, val_size], generator=generator)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

    train_targets = [y_raw[idx].item() for idx in train_ds.indices]
    counts = np.bincount(train_targets, minlength=len(CLASS_NAMES))
    weights = [len(train_ds) / (len(CLASS_NAMES) * max(c, 1)) for c in counts]
    weights_tensor = torch.FloatTensor(weights).to(device)

    # 4. Train Deep Head
    print(f"\n[3/4] Melatih Multi-Layer Deep Head ({NUM_EPOCHS} Epochs)...", flush=True)
    head = build_head().to(device)

    optimizer = optim.AdamW(head.parameters(), lr=1.5e-3, weight_decay=1e-2)
    criterion = nn.CrossEntropyLoss(weight=weights_tensor, label_smoothing=0.03)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=NUM_EPOCHS, eta_min=1e-5)

    best_val_acc = 0.0
    best_head_state = copy.deepcopy(head.state_dict())

    for epoch in range(NUM_EPOCHS):
        head.train()
        train_loss, train_correct, train_total = 0.0, 0, 0

        for feats, lbls in train_loader:
            optimizer.zero_grad()
            logits = head(feats)
            loss = criterion(logits, lbls)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * feats.size(0)
            preds = logits.argmax(dim=1)
            train_correct += (preds == lbls).sum().item()
            train_total += lbls.size(0)

        scheduler.step()

        head.eval()
        val_loss, val_correct, val_total = 0.0, 0, 0
        with torch.no_grad():
            for feats, lbls in val_loader:
                logits = head(feats)
                loss = criterion(logits, lbls)
                val_loss += loss.item() * feats.size(0)
                preds = logits.argmax(dim=1)
                val_correct += (preds == lbls).sum().item()
                val_total += lbls.size(0)

        val_acc = (val_correct / val_total) * 100
        train_acc = (train_correct / train_total) * 100

        if (epoch + 1) % 5 == 0 or epoch == NUM_EPOCHS - 1 or val_acc > best_val_acc:
            print(
                f"  Epoch {epoch+1:02d}/{NUM_EPOCHS} | Train Acc: {train_acc:.1f}% | Val Acc: {val_acc:.2f}% | Val Loss: {val_loss/val_total:.4f}",
                flush=True,
            )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_head_state = copy.deepcopy(head.state_dict())

    # 5. Save End-to-End ResNet50 Model
    print("\n[4/4] Menyimpan bobot ResNet50 lengkap ke file...", flush=True)
    full_model = models.resnet50(weights=None)
    full_model.fc = build_head()

    full_dict = full_model.state_dict()
    for k, v in base_model.state_dict().items():
        if k in full_dict and not k.startswith("fc."):
            full_dict[k] = v

    for k, v in best_head_state.items():
        full_dict[f"fc.{k}"] = v

    full_model.load_state_dict(full_dict)
    torch.save(full_model.state_dict(), MODEL_SAVE_PATH)

    print(f"SUKSES! Model disimpan di: {MODEL_SAVE_PATH}")
    print(f"Akurasi Validasi Tertinggi: {best_val_acc:.2f}%\n", flush=True)
    return best_val_acc


if __name__ == "__main__":
    train_ultra_accuracy_model()

"""
Blueprint Training Model MobileNetV2 KAINARA (Skin Tone Analysis).
Skrip ini dikhususkan untuk melatih model AI penentu Undertone Kulit (Warm, Cool, Neutral).
Menggunakan MobileNetV2 karena ukurannya sangat kecil, cepat, namun akurat untuk tugas klasifikasi wajah.
"""

import os
import copy
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
from pathlib import Path

# Parameter Pelatihan
BATCH_SIZE = 32
NUM_EPOCHS = 15
LEARNING_RATE = 1e-4

# WAJIB ALFABETIS (Single Source of Truth untuk API Skin Tone)
CLASS_NAMES = ["cool", "neutral", "warm"]

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset" / "skintone"
MODEL_SAVE_PATH = BASE_DIR / "skintone_mobilenet_v2.pth"

# === 1. DATA AUGMENTATION KHUSUS KULIT WAJAH ===
train_transforms = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    # Rotasi dibatasi karena wajah manusia biasanya tegak lurus
    transforms.RandomRotation(10), 
    
    # [KRITIKAL] COLOR JITTER
    # Inilah vaksin AI melawan "Lighting Bias" (Cahaya ruangan kuning/biru).
    # Model dipaksa menebak warna kulit meskipun fotonya dibuat lebih kuning/biru/gelap oleh fungsi ini.
    transforms.ColorJitter(brightness=0.3, contrast=0.2, saturation=0.3, hue=0.1),
    
    transforms.ToTensor(),
    # Preprocessing Normalisasi ImageNet standar
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def create_dataloaders():
    print(f"Loading Skin Tone Dataset dari: {DATASET_DIR}...")
    try:
        full_dataset = datasets.ImageFolder(DATASET_DIR)
        actual_classes = list(full_dataset.class_to_idx.keys())
        assert actual_classes == CLASS_NAMES, f"Class mismatch! Expected {CLASS_NAMES}, got {actual_classes}"
    except FileNotFoundError:
        print("[CRITICAL] Folder dataset/skintone tidak ditemukan. Jalankan script download_dataset.py terlebih dahulu.")
        return None, None, 0

    num_classes = len(full_dataset.classes)
    
    # Train-Validation Split (80:20)
    total_size = len(full_dataset)
    val_size = int(0.2 * total_size)
    train_size = total_size - val_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    
    # Hack untuk menerapkan transform yang berbeda (Data Augmentation hanya di Train)
    train_dataset.dataset.transform = train_transforms
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

    return train_loader, val_loader, num_classes

def train_mobilenet():
    train_loader, val_loader, num_classes = create_dataloaders()
    if not train_loader:
        return
        
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\nMenggunakan device: {device}")

    # Load MobileNetV2 (Lebih ringan dan cepat dari ResNet50)
    print("Loading pre-trained MobileNetV2...")
    model = models.mobilenet_v2(pretrained=True)
    
    # Freeze seluruh feature extractor (tubuh model)
    for param in model.parameters():
        param.requires_grad = False
        
    # Ganti classification head terakhir (classifier)
    # MobileNetV2 classifier layer structure: Dropout(p=0.2), Linear(...)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model = model.to(device)

    # Label Smoothing 0.1 untuk mencegah "Overconfident Misclassification"
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    
    # Hanya melatih head (classifier)
    optimizer = optim.AdamW(model.classifier.parameters(), lr=LEARNING_RATE, weight_decay=1e-3)

    best_val_acc = 0.0
    best_model_wts = copy.deepcopy(model.state_dict())

    print("\nMulai Training Skin Tone Analyzer...")
    for epoch in range(NUM_EPOCHS):
        # --- TRAINING PHASE ---
        model.train()
        train_loss = 0.0
        train_correct = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * inputs.size(0)
            _, predicted = torch.max(outputs.data, 1)
            train_correct += (predicted == labels).sum().item()

        epoch_train_loss = train_loss / len(train_loader.dataset)
        epoch_train_acc = (train_correct / len(train_loader.dataset)) * 100

        # --- VALIDATION PHASE ---
        model.eval()
        val_loss = 0.0
        val_correct = 0

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                # Pada MobileNetV2, kita hanya panggil model() dan mendapatkan logits
                outputs = model(inputs)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * inputs.size(0)
                _, predicted = torch.max(outputs.data, 1)
                val_correct += (predicted == labels).sum().item()

        epoch_val_loss = val_loss / len(val_loader.dataset)
        epoch_val_acc = (val_correct / len(val_loader.dataset)) * 100

        print(f"Epoch {epoch+1}/{NUM_EPOCHS} "
              f"| Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.2f}% "
              f"| Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.2f}%")

        if epoch_val_acc > best_val_acc:
            print(f"  -> Validation Accuracy meningkat ({best_val_acc:.2f}% --> {epoch_val_acc:.2f}%). Menyimpan bobot terbaik...")
            best_val_acc = epoch_val_acc
            best_model_wts = copy.deepcopy(model.state_dict())
            torch.save(best_model_wts, MODEL_SAVE_PATH)

    print(f"\nTraining selesai! Bobot model TERBAIK telah disimpan di: {MODEL_SAVE_PATH}")
    print(f"Akurasi Validasi Tertinggi: {best_val_acc:.2f}%")

if __name__ == "__main__":
    # train_mobilenet() # Uncomment untuk mengeksekusi
    pass

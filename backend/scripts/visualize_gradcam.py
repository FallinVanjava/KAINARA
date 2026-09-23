"""
Grad-CAM (Gradient-weighted Class Activation Mapping) untuk KAINARA

Skrip Explainable AI (XAI) ini berfungsi memvisualisasikan "Mata AI".
Ia menunjukkan piksel / area gambar mana yang diandalkan oleh ResNet50 
untuk menebak motif tersebut.

CARA MEMBACA HEATMAP:
1. Warna MERAH / KUNING: Area yang paling difokuskan AI (Aktivasi Tinggi).
2. Warna BIRU / GELAP: Area yang diabaikan AI.
3. KESIMPULAN SHORTCUT LEARNING:
   - Jika warna merah menutupi pola asli motif batik -> AI Sehat (Fokus ke motif).
   - Jika warna merah malah menempel di background (kayu, meja, lantai) atau 
     di area kain kosong yang tidak berpola -> AI Mengalami Shortcut Learning (Rusak).
"""

import os
import argparse
import cv2
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import matplotlib.pyplot as plt
from pathlib import Path

# Setup Konfigurasi
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_WEIGHTS_PATH = BASE_DIR / "best_model_weights.pth"

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

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Pasang Hook (Pengait) untuk merekam Gradien Backward dan Aktivasi Forward
        target_layer.register_forward_hook(self.save_activation)
        target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate_heatmap(self, input_tensor, class_idx=None):
        # Forward pass
        logits = self.model(input_tensor)
        
        if class_idx is None:
            # Ambil tebakan tertinggi jika user tidak menentukan kelas spesifik
            class_idx = logits.argmax(dim=1).item()

        # Bersihkan gradien lama
        self.model.zero_grad()
        
        # Lakukan Backward pass KHUSUS untuk kelas target
        target = logits[0][class_idx]
        target.backward(retain_graph=True)

        # Ambil gradien dan aktivasi dari Hook
        gradients = self.gradients.data.cpu().numpy()[0]
        activations = self.activations.data.cpu().numpy()[0]

        # Global Average Pooling pada gradien (Bobot Neuron)
        weights = np.mean(gradients, axis=(1, 2))

        # Kalikan bobot dengan aktivasi masing-masing feature map (Linear Combination)
        heatmap = np.zeros(activations.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            heatmap += w * activations[i]

        # ReLU pada heatmap (Hanya ambil pengaruh positif)
        heatmap = np.maximum(heatmap, 0)

        # Normalisasi ke skala 0 - 1
        if np.max(heatmap) != 0:
             heatmap = heatmap / np.max(heatmap)
             
        return heatmap, logits, class_idx

def visualize_gradcam(image_path: str):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Grad-CAM] Menjalankan menggunakan: {device}")

    # 1. Siapkan Model
    model = models.resnet50(weights=None)
    model.fc = torch.nn.Sequential(
        torch.nn.Linear(2048, 512),
        torch.nn.BatchNorm1d(512),
        torch.nn.GELU(),
        torch.nn.Dropout(p=0.3),
        torch.nn.Linear(512, 128),
        torch.nn.BatchNorm1d(128),
        torch.nn.GELU(),
        torch.nn.Dropout(p=0.15),
        torch.nn.Linear(128, len(CLASS_NAMES)),
    )
    try:
        model.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location=device))
    except Exception as e:
        print(f"[WARNING] Gagal memuat bobot: {e}")
    
    model.to(device)
    model.eval()

    # 2. Siapkan Grad-CAM pada Target Layer Terakhir Konvolusi (layer4)
    # Pada ResNet50, features extraction terakhir ada di model.layer4[-1]
    target_layer = model.layer4[-1]
    grad_cam = GradCAM(model, target_layer)

    # 3. Muat dan Preproses Gambar Asli
    img_pil = Image.open(image_path).convert("RGB")
    
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    input_tensor = preprocess(img_pil).unsqueeze(0).to(device)

    # 4. Generate Heatmap
    heatmap, logits, predicted_class_idx = grad_cam.generate_heatmap(input_tensor)
    predicted_label = CLASS_NAMES[predicted_class_idx]
    
    # Hitung probabilitas Softmax
    probs = F.softmax(logits, dim=1).squeeze()
    confidence = probs[predicted_class_idx].item() * 100

    print(f"\n[HASIL] Prediksi AI: {predicted_label} ({confidence:.2f}%)")

    # 5. Gabungkan Heatmap ke Gambar Asli
    # Resize gambar asli ke 224x224 (untuk pencocokan yang akurat dengan tensor AI)
    img_cv2 = cv2.cvtColor(np.array(img_pil.resize((224, 224))), cv2.COLOR_RGB2BGR)
    
    # Resize heatmap dari (7x7) ke (224x224) menggunakan interpolasi
    heatmap_resized = cv2.resize(heatmap, (img_cv2.shape[1], img_cv2.shape[0]))
    
    # Ubah heatmap grayscale (0-1) jadi skala warna jet (0-255) (MERAH = tinggi, BIRU = rendah)
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)

    # Blend (gabungkan) Heatmap dengan gambar asli
    superimposed_img = cv2.addWeighted(img_cv2, 0.5, heatmap_colored, 0.5, 0)

    # 6. Plot dan Tampilkan
    fig, axes = plt.subplots(1, 2, figsize=(10, 5))
    
    axes[0].imshow(img_pil)
    axes[0].set_title(f"Gambar Asli")
    axes[0].axis('off')
    
    # Konversi BGR ke RGB untuk Matplotlib
    axes[1].imshow(cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB))
    axes[1].set_title(f"Mata AI (Grad-CAM)\nPrediksi: {predicted_label} ({confidence:.1f}%)")
    axes[1].axis('off')
    
    plt.tight_layout()
    # Simpan hasil visualisasi
    out_name = f"gradcam_result.jpg"
    plt.savefig(out_name)
    print(f"[SELESAI] Visualisasi Grad-CAM disimpan sebagai: {out_name}")
    print("Silakan cek area yang disorot warna merah. Jika AI melihat ke background, dataset Anda perlu dibersihkan!")
    
    # Matikan popup display jika berjalan di server non-GUI, jika di lokal biarkan plt.show()
    # plt.show()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Grad-CAM untuk gambar batik.")
    parser.add_argument("--image", type=str, required=True, help="Path absolut atau relatif ke file gambar.")
    args = parser.parse_args()
    
    visualize_gradcam(args.image)

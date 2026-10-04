"""
Script Konversi Model PyTorch ke ONNX (KAINARA Tapis & Skintone Engine)
Mengonversi .pth ke .onnx untuk inferensi CPU-optimized berlatensi rendah (<200ms).
"""

from pathlib import Path
import torch
import torch.nn as nn
from torchvision import models

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_WEIGHTS_PATH = BASE_DIR / "best_model_weights.pth"
SKINTONE_WEIGHTS_PATH = BASE_DIR / "skintone_mobilenet_v2.pth"

ONNX_BATIK_PATH = MODELS_DIR / "tapis_resnet50.onnx"
ONNX_SKIN_PATH = MODELS_DIR / "skintone_mobilenet.onnx"

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

SKIN_CLASS_NAMES = ["cool", "neutral", "warm"]


def build_batik_head(num_classes: int = len(CLASS_NAMES)):
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


def export_batik_model():
    print(f"[EXPORT] Mengekspor model Tapis ResNet50 ke ONNX...")
    if not MODEL_WEIGHTS_PATH.exists():
        print(f"[SKIP] File bobot {MODEL_WEIGHTS_PATH.name} tidak ditemukan.")
        return

    model = models.resnet50(weights=None)
    model.fc = build_batik_head()
    model.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location="cpu"))
    model.eval()

    dummy_input = torch.randn(1, 3, 224, 224, requires_grad=False)
    torch.onnx.export(
        model,
        dummy_input,
        str(ONNX_BATIK_PATH),
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
    )
    print(f"[SUKSES] Model Tapis berhasil disimpan di: {ONNX_BATIK_PATH}")


def export_skintone_model():
    print(f"[EXPORT] Mengekspor model Skintone MobileNetV2 ke ONNX...")
    if not SKINTONE_WEIGHTS_PATH.exists():
        print(f"[SKIP] File bobot {SKINTONE_WEIGHTS_PATH.name} tidak ditemukan.")
        return

    model = models.mobilenet_v2(pretrained=False)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, len(SKIN_CLASS_NAMES))
    model.load_state_dict(torch.load(SKINTONE_WEIGHTS_PATH, map_location="cpu"))
    model.eval()

    dummy_input = torch.randn(1, 3, 224, 224, requires_grad=False)
    torch.onnx.export(
        model,
        dummy_input,
        str(ONNX_SKIN_PATH),
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
    )
    print(f"[SUKSES] Model Skintone berhasil disimpan di: {ONNX_SKIN_PATH}")


if __name__ == "__main__":
    export_batik_model()
    export_skintone_model()

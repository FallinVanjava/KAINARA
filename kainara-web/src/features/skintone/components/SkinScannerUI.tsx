"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/Button";

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SkinScannerUIProps {
  onAnalyze: (blob: Blob) => void;
  isAnalyzing: boolean;
}

async function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Gagal menginisialisasi canvas context");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    120,
    120
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Canvas kosong"));
        else resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
}

function FaceIcon() {
  return (
    <div className="size-16 rounded-full bg-emas/15 flex items-center justify-center text-emas mb-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm3.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
        />
      </svg>
    </div>
  );
}

export function SkinScannerUI({ onAnalyze, isAnalyzing }: SkinScannerUIProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: PixelCrop, croppedAreaPixels: PixelCrop) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      setImageSrc(reader.result?.toString() || null)
    );
    reader.readAsDataURL(file);
  };

  const processCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onAnalyze(blob);
    } catch (e) {
      console.error("Gagal crop foto:", e);
    }
  };

  if (imageSrc && isAnalyzing) {
    return (
      <div className="w-full max-w-md mx-auto h-80 relative rounded-3xl overflow-hidden bg-sogan-900 border border-sogan-700/60 shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          className="w-full h-full object-cover opacity-30 blur-xs"
          alt="Proses analisis pigmen kulit"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="size-16 rounded-full bg-emas/20 flex items-center justify-center border border-emas/40"
          >
            <div className="size-8 rounded-full bg-emas shadow-[0_0_16px_rgba(212,175,55,0.8)]" />
          </motion.div>
          <div>
            <p className="text-emas-300 font-serif font-bold text-lg tracking-wide">
              Menganalisis Pigmen Kulit...
            </p>
            <p className="text-sogan-300 text-xs mt-1">
              Menghitung rona warm, cool, atau neutral pada ruang warna RGB
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (imageSrc) {
    return (
      <div className="w-full max-w-md mx-auto space-y-5">
        <div className="relative w-full h-80 bg-sogan-900 rounded-3xl overflow-hidden shadow-[var(--shadow-ethereal)] border border-sogan-700/60">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-xs border border-sogan-200/80">
          <p className="text-xs sm:text-sm text-sogan-600 font-medium mb-3 text-center">
            Pusatkan lingkaran pada area kulit Anda (pipi atau dahi) yang bebas bayangan tajam.
          </p>
          <div className="flex items-center justify-between gap-4 px-2">
            <span className="text-xs font-bold text-sogan-500 uppercase tracking-wider">
              Zoom
            </span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={4}
              step={0.1}
              aria-label="Atur pembesaran area wajah"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-emas"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setImageSrc(null)}
          >
            Ganti Foto
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={processCrop}
          >
            Analisis Warna
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Unggah foto wajah untuk analisis skin tone"
        className="relative flex flex-col items-center justify-center gap-3 h-72 sm:h-80 rounded-3xl bg-white border-2 border-dashed border-sogan-300/80 hover:border-emas hover:bg-sogan-50/50 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] cursor-pointer transition-all duration-300 group px-6 text-center focus-visible:outline-2 focus-visible:outline-emas"
      >
        <FaceIcon />
        <div>
          <p className="text-sogan-900 font-serif font-bold text-lg group-hover:text-emas-600 transition-colors">
            Pilih Foto Wajah
          </p>
          <p className="text-sogan-500 text-xs sm:text-sm mt-1 leading-relaxed max-w-xs">
            Foto diproses secara privat di perangkat Anda tanpa disimpan di server.
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

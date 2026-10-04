"use client";

import { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/Button";
import type { ScannerStatus } from "@/types";

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WebScannerUIProps {
  onCapture: (blob: Blob, filename?: string) => void;
  status: ScannerStatus;
}

async function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Gagal menginisialisasi canvas context");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    512,
    512
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Canvas tidak menghasilkan blob"));
        else resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
}

function UploadIcon() {
  return (
    <div className="size-16 rounded-full bg-emas/15 flex items-center justify-center text-emas-600 mb-2">
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
          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
        />
      </svg>
    </div>
  );
}

export function WebScannerUI({ onCapture, status }: WebScannerUIProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

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
    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      setImageSrc(reader.result?.toString() || null)
    );
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const processCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCapture(blob, originalFile?.name);
    } catch (e) {
      console.error(e);
    }
  };

  const isScanning = status === "scanning";

  // Scanning Viewfinder Animation (design.md 5.2)
  if (imageSrc && (isScanning || status === "success" || status === "unrecognized")) {
    return (
      <div className="w-full max-w-lg mx-auto h-80 sm:h-96 relative rounded-3xl overflow-hidden bg-sogan-900 border-2 border-emas/60 shadow-[0_12px_45px_rgba(212,175,55,0.25)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          className="w-full h-full object-cover opacity-40 blur-xs"
          alt="Proses pemindaian wastra"
        />

        {/* HUD Viewfinder Central Crop Box (design_kainara_v3.md) */}
        <div className="absolute inset-8 border-2 border-white/50 rounded-2xl pointer-events-none" />

        {isScanning && (
          <>
            {/* CSS Keyframe Laser Scanning Line (design_kainara_v3.md) */}
            <div className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-emas to-transparent shadow-[0_0_18px_rgba(210,170,54,1)] animate-scanline pointer-events-none z-10" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sogan-900/80 backdrop-blur-md border border-emas/40 text-emas font-serif text-sm font-bold tracking-wide shadow-lg">
                Memproses...
              </span>
              <p className="text-sogan-300 text-xs mt-2">
                Mengidentifikasi motif Tapis Lampung via AI Vision
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // Cropping & Framing Mode
  if (imageSrc) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-5">
        <div className="relative w-full h-80 sm:h-96 bg-sogan-900 rounded-3xl overflow-hidden shadow-[var(--shadow-ethereal)] border border-sogan-700/60">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-xs border border-sogan-200/80">
          <p className="text-xs sm:text-sm text-sogan-600 text-center font-medium mb-3">
            Posisikan motif utama batik di dalam kotak untuk akurasi maksimal.
          </p>
          <div className="flex items-center justify-between gap-4 px-2">
            <span className="text-xs font-bold text-sogan-500 uppercase tracking-wider">
              Zoom
            </span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Atur pembesaran gambar"
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
            Scan Motif Ini
          </Button>
        </div>
      </div>
    );
  }

  // Initial Upload Box
  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Unggah foto kain batik untuk dipindai"
        className="relative flex flex-col items-center justify-center gap-3 h-72 sm:h-80 rounded-3xl bg-white border-2 border-dashed border-sogan-300/80 hover:border-emas hover:bg-sogan-50/50 shadow-[var(--shadow-ethereal)] hover:shadow-[var(--shadow-ethereal-hover)] cursor-pointer transition-all duration-300 group px-6 text-center focus-visible:outline-2 focus-visible:outline-emas"
      >
        <UploadIcon />
        <div>
          <p className="text-sogan-900 font-serif font-bold text-lg group-hover:text-emas-600 transition-colors">
            Ambil Foto atau Pilih Gambar
          </p>
          <p className="text-sogan-500 text-xs sm:text-sm mt-1 max-w-xs leading-relaxed">
            Seret &amp; lepas foto wastra Anda di sini, atau klik untuk memilih file dari perangkat Anda.
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

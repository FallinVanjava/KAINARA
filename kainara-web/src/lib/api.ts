import type { ScanResult } from "@/types";
import { compressImage } from "./imageUtils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponseError(res: Response, fallbackPrefix: string): Promise<never> {
  let errorMsg = `${fallbackPrefix} (${res.status})`;
  try {
    const errorJson = await res.json();
    if (errorJson?.message) {
      errorMsg = errorJson.message;
    }
  } catch {
    const rawText = await res.text().catch(() => "");
    if (rawText) errorMsg = rawText;
  }
  throw new Error(errorMsg);
}

export async function scanMotif(
  imageFile: File | Blob,
  signal?: AbortSignal
): Promise<ScanResult> {
  // Kompresi sebelum kirim (maks 800x800, jpeg 0.8)
  const compressedBlob = await compressImage(imageFile, 800, 800, 0.8);

  const form = new FormData();
  form.append("image", compressedBlob, "scan.jpg");

  const res = await fetch(`${API_BASE}/v1/scan`, {
    method: "POST",
    body: form,
    signal,
  });

  if (!res.ok) {
    await handleResponseError(res, "Scan gagal");
  }

  return res.json() as Promise<ScanResult>;
}

export async function scanSkintone(
  imageBlob: Blob,
  signal?: AbortSignal
): Promise<{ success: boolean; data: { tone: string; confidence: number } }> {
  // Khusus skintone, pastikan gambar sudah dicrop dari canvas di UI
  const compressedBlob = await compressImage(imageBlob, 224, 224, 0.9);

  const form = new FormData();
  form.append("image", compressedBlob, "skintone.jpg");

  const res = await fetch(`${API_BASE}/v1/skintone`, {
    method: "POST",
    body: form,
    signal,
  });

  if (!res.ok) {
    await handleResponseError(res, "Skintone scan gagal");
  }

  return res.json();
}

export async function submitFeedbackCorrection(
  imageBlob: Blob,
  correctMotifId: string
): Promise<{ success: boolean; message: string }> {
  const form = new FormData();
  form.append("image", imageBlob, "feedback.jpg");
  form.append("correct_motif_id", correctMotifId);

  const res = await fetch(`${API_BASE}/v1/scan/feedback`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    await handleResponseError(res, "Feedback gagal dikirim");
  }

  return res.json();
}

"use client";

import { useCallback, useReducer, useRef, useEffect } from "react";
import type { ScanResult, ScannerStatus, Motif } from "@/types";
import { getMotifById } from "@/lib/constants/mockData";
import { scanMotif } from "@/lib/api";

interface ScannerState {
  status: ScannerStatus;
  result: ScanResult | null;
  error: string | null;
  scannedBlob: Blob | null;
}

type ScannerAction =
  | { type: "SCAN_START" }
  | { type: "SCAN_SUCCESS"; payload: { result: ScanResult; blob: Blob } }
  | { type: "SCAN_UNRECOGNIZED"; payload: string }
  | { type: "SCAN_ERROR"; payload: string }
  | { type: "RESET" };

function reducer(state: ScannerState, action: ScannerAction): ScannerState {
  switch (action.type) {
    case "SCAN_START":
      return { status: "scanning", result: null, error: null, scannedBlob: null };
    case "SCAN_SUCCESS":
      return { status: "success", result: action.payload.result, error: null, scannedBlob: action.payload.blob };
    case "SCAN_UNRECOGNIZED":
      return { status: "unrecognized", result: null, error: action.payload, scannedBlob: null };
    case "SCAN_ERROR":
      return { status: "error", result: null, error: action.payload, scannedBlob: null };
    case "RESET":
      return { status: "idle", result: null, error: null, scannedBlob: null };
    default:
      return state;
  }
}

function createFallbackMotif(id: string, name: string): Motif {
  return {
    id,
    name: name || id.replace("_", " "),
    slug: id.replace("_", "-"),
    category: "Terdeteksi AI",
    philosophy: "Motif ini berhasil dikenali oleh AI, namun belum terdapat data detail (filosofi, warna) di dalam database frontend kami. Kami akan terus memperbarui katalog ini.",
    origin: "Lampung",
    colors: ["#DDDDDD"],
    imageUrl: "/images/placeholder.jpg",
  };
}

interface ScanResponseData {
  success: boolean;
  code?: string;
  message?: string;
  data?: {
    motif_id: string;
    confidence: number;
    name: string;
    alternatives?: Array<{ motif_id: string; name: string; confidence: number }>;
  };
}

export function useScanner() {
  const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    result: null,
    error: null,
    scannedBlob: null,
  });
  
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const scan = useCallback(async (blob: Blob) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    dispatch({ type: "SCAN_START" });

    try {
      // Kita gunakan lib api.ts yang memanggil /v1/scan dengan support compresi dll
      const resData = await scanMotif(blob, abortRef.current.signal) as unknown as ScanResponseData;
      
      // Jika resData memiliki success: false / LOW_CONFIDENCE
      if (!resData?.success) {
        if (resData?.code === "LOW_CONFIDENCE") {
           dispatch({ type: "SCAN_UNRECOGNIZED", payload: resData.message || "Keyakinan rendah." });
           return;
        }
      }

      if (!resData?.success || !resData.data) {
        throw new Error("Respons server tidak valid.");
      }
      
      const motifId = resData.data.motif_id;
      const confidence = resData.data.confidence;
      const motifName = resData.data.name;

      // Ambil data motif, atau fallback jika motif tersebut adalah class baru dari backend
      const motif = getMotifById(motifId) || createFallbackMotif(motifId, motifName);

      const resultPayload: ScanResult = {
        motif,
        accuracy: Math.round(confidence * 100),
        alternatives: (resData.data.alternatives || []).map((alt) => ({
          motif: getMotifById(alt.motif_id) || createFallbackMotif(alt.motif_id, alt.name),
          accuracy: Math.round(alt.confidence * 100)
        }))
      };

      dispatch({ type: "SCAN_SUCCESS", payload: { result: resultPayload, blob } });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      
      const isNetworkError = err instanceof TypeError && err.message === "Failed to fetch";
      if (isNetworkError) {
        dispatch({ type: "SCAN_ERROR", payload: "Tidak dapat terhubung ke Server AI. Pastikan backend (http://localhost:8000) sedang berjalan." });
      } else {
        dispatch({ type: "SCAN_ERROR", payload: err instanceof Error ? err.message : "Terjadi kesalahan." });
      }
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return { ...state, scan, reset, isScanning: state.status === "scanning" };
}

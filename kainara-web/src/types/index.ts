export interface Motif {
  id: string;
  name: string;
  slug: string;
  category: string;
  philosophy: string;
  origin: string;
  colors: string[];
  imageUrl: string;
  accuracy?: number;
}

export interface Outfit {
  id: string;
  title: string;
  category: "formal" | "casual" | "tradisional" | "semi-formal";
  motifId: string;
  imageUrl: string;
  tags: string[];
}

export interface ScanResult {
  motif: Motif;
  accuracy: number;
  alternatives: Array<{ motif: Motif; accuracy: number }>;
}

export interface SkinToneResult {
  tone: "warm" | "cool" | "neutral";
  palette: string[];
  recommendedMotifs: Motif[];
  recommendations: Outfit[];
}

export type ScannerStatus =
  | "idle"
  | "requesting-permission"
  | "ready"
  | "scanning"
  | "success"
  | "unrecognized"
  | "error";

export type CameraPermission = "granted" | "denied" | "prompt";

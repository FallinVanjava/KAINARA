import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Scanner Motif Batik",
  description: "Identifikasi motif Batik Lampung dari foto menggunakan AI ResNet50.",
};

export default function ScannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

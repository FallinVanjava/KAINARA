import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Katalog Edukasi Motif",
  description: "Jelajahi berbagai motif Batik Lampung, filosofi, sejarah, dan makna budaya di baliknya.",
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

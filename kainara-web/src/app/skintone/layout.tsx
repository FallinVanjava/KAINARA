import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Skin Tone Analysis",
  description: "Temukan padu padan warna Batik Lampung yang paling cocok dengan rona kulit Anda.",
};

export default function SkinToneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

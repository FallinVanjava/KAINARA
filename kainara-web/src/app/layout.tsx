import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KAINARA | Kenali Kain Nusantara",
    template: "%s | KAINARA",
  },
  description:
    "Platform digital pelestarian budaya Batik Lampung. Pelajari filosofi motif, scan batik dengan AI, dan temukan rekomendasi padu padan berdasarkan warna kulit Anda.",
  keywords: ["batik lampung", "kain nusantara", "motif batik", "AI scanner", "budaya lampung", "fashion editorial"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "KAINARA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="min-h-dvh flex flex-col bg-[#EDE3DA] text-[#1C1B19] antialiased selection:bg-[#D2AA36]/30 selection:text-[#1C1B19]">
        {children}
      </body>
    </html>
  );
}

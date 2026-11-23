import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kainara.id'),
  title: 'Kainara: Budaya Tapis Lampung & Rekomendasi Outfit',
  description:
    'Eksplorasi keanggunan motif kain tapis tradisional Lampung, cocokkan warna dengan skintone, dan temukan rekomendasi outfit busana yang serasi.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Kainara',
    title: 'Kainara: Budaya Tapis Lampung & Rekomendasi Outfit',
    description:
      'Eksplorasi motif tapis Lampung, temukan kecocokan skintone, dan rekomendasi outfit.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${poppins.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}

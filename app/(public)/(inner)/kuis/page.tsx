import type { Metadata } from 'next';
import { MotifMatchingQuiz, type MatchingMotif } from '@/components/quiz/motif-matching-quiz';

export const metadata: Metadata = {
  title: 'Kuis Pencocokan Motif Tapis | Kainara',
  description:
    'Seberapa kenal kamu dengan kain tapis Lampung? Uji pengetahuanmu seputar sejarah, filosofi adat, dan motif tapis Lampung.',
  openGraph: {
    title: 'Kuis Pencocokan Motif Tapis | Kainara',
    description:
      'Seberapa kenal kamu dengan kain tapis Lampung? Uji pengetahuanmu seputar sejarah, filosofi adat, dan motif tapis Lampung.',
  },
};

const QUIZ_MOTIFS: MatchingMotif[] = [
  { id: 'jung-sarat', nama: 'Tapis Jung Sarat', gambar_url: '/images/jung sarat.jpg', daerah_asal: 'Menggala' },
  { id: 'raja-medal', nama: 'Tapis Raja Medal', gambar_url: '/images/raja medal.webp', daerah_asal: 'Way Kanan' },
  { id: 'pucuk-rebung', nama: 'Tapis Pucuk Rebung', gambar_url: '/images/pucukk rebung.jpg', daerah_asal: 'Kalianda' },
  { id: 'inuh', nama: 'Tapis Inuh', gambar_url: '/images/inuh.jpg', daerah_asal: 'Pesisir Barat' },
];

export default function KuisPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F]">Kuis Budaya Lampung</span>
        <h1 className="mt-2 font-heading text-3xl font-bold text-[#2D1810] sm:text-4xl">Kuis Pencocokan Motif Tapis</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C534E] sm:text-base">
          Tarik garis penghubung dari gambar motif di sebelah kiri ke nama motif yang sesuai di sebelah kanan.
        </p>
      </header>
      <MotifMatchingQuiz motifs={QUIZ_MOTIFS} />
    </div>
  );
}
import type { Metadata } from 'next';
import { getMotifs } from '@/lib/queries/motifs';
import { MotifMatchingQuiz } from '@/components/quiz/motif-matching-quiz';

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

export default async function KuisPage() {
  const { items } = await getMotifs({ limit: 4 });

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#96640F]">Kuis Budaya Lampung</span>
        <h1 className="mt-2 font-heading text-3xl font-bold text-[#2D1810] sm:text-4xl">Kuis Pencocokan Motif Tapis</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C534E] sm:text-base">
          Tarik garis penghubung dari gambar motif di sebelah kiri ke nama motif yang sesuai di sebelah kanan.
        </p>
      </header>
      <MotifMatchingQuiz motifs={items} />
    </div>
  );
}
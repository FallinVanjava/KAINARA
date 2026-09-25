import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MOTIF_DATA } from "@/lib/constants/mockData";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/features/education/components/FavoriteButton";

export function generateStaticParams() {
  return MOTIF_DATA.map((motif) => ({
    slug: motif.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const motif = MOTIF_DATA.find((m) => m.slug === slug);
  if (!motif) return { title: "Motif Tidak Ditemukan" };
  return {
    title: `${motif.name} | Ragam Hias Wastra KAINARA`,
    description: motif.philosophy.slice(0, 150) + "...",
  };
}

export default async function MotifDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const motif = MOTIF_DATA.find((m) => m.slug === slug);

  if (!motif) {
    notFound();
  }

  return (
    <main className="flex-1 w-full bg-[#FAF9F6] pb-24">
      {/* ── HERO BACKDROP WITH EDITORIAL IMAGE ──────────────────────── */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] bg-sogan-950 overflow-hidden">
        <Image
          src={motif.imageUrl}
          alt={motif.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sogan-950 via-sogan-950/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-28 sm:pb-36">
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link
                href="/education"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-ivory text-xs font-semibold hover:bg-white/25 transition-colors border border-white/20"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali ke Katalog
              </Link>

              <FavoriteButton id={motif.id} name={motif.name} type="motif" />
            </div>

            <Badge variant="gold" className="mb-3">
              {motif.category}
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {motif.name}
            </h1>
            <p className="text-ivory/80 mt-2 text-sm sm:text-base">
              Asal Daerah: <span className="font-semibold text-emas-300">{motif.origin}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION (Floating Bento Editorial Card) ────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[var(--shadow-ethereal-hover)] border border-sogan-200/80">
          <span className="text-xs font-bold uppercase tracking-widest text-emas-600 mb-3 block">
            Filosofi &amp; Makna Simbolis
          </span>
          <p className="font-serif text-sogan-900 text-lg sm:text-2xl leading-relaxed font-normal mb-10">
            {motif.philosophy}
          </p>

          <div className="batik-divider opacity-30 my-8" aria-hidden="true" />

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sogan-500 mb-4 block">
              Palet Warna Tradisional Motif
            </span>
            <div className="flex flex-wrap gap-4">
              {motif.colors.map((hex) => (
                <div
                  key={hex}
                  className="flex items-center gap-3 bg-sogan-50 px-4 py-2 rounded-full border border-sogan-200"
                >
                  <div
                    className="size-8 rounded-full shadow-inner border-2 border-white ring-1 ring-black/5"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                  <span className="text-xs font-mono font-bold text-sogan-700 uppercase">
                    {hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-sogan-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-sogan-500 text-center sm:text-left">
              Ingin menguji kain Anda sendiri dengan motif ini?
            </p>
            <Link
              href="/scanner"
              className="px-6 py-2.5 rounded-full bg-emas text-sogan-900 text-xs font-bold hover:bg-emas-400 transition-colors shadow-xs"
            >
              Uji dengan Scanner AI
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

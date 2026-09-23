import Link from "next/link";

const navItems = [
  { href: "/education", label: "Edukasi Motif" },
  { href: "/scanner", label: "Scan Wastra AI" },
  { href: "/skintone", label: "Skin Tone Analysis" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-sogan-900 text-sogan-200 text-sm border-t border-sogan-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-serif text-2xl text-ivory font-bold tracking-wider mb-2">
            KAINARA
          </p>
          <p className="text-sogan-300 leading-relaxed text-xs sm:text-sm">
            Kenali Kain Nusantara: Ruang digital editorial untuk merayakan filosofi, kemewahan tenun, dan keagungan Batik Lampung.
          </p>
        </div>

        <div>
          <p className="font-semibold text-emas-400 text-xs tracking-widest uppercase mb-3">
            Eksplorasi
          </p>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sogan-200 hover:text-emas-300 transition-colors inline-block text-xs sm:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-emas-400 text-xs tracking-widest uppercase mb-3">
            Filosofi Budaya
          </p>
          <p className="text-sogan-300 leading-relaxed text-xs sm:text-sm">
            Menghubungkan generasi muda dengan akar warisan wastra tradisional melalui kurasi visual dan kecerdasan buatan.
          </p>
        </div>
      </div>

      <div className="batik-divider opacity-30" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-sogan-400 gap-2">
        <p>© {new Date().getFullYear()} KAINARA. Hak Cipta Dilindungi.</p>
        <p className="font-serif italic text-sogan-300">Merawat Warisan, Menenun Masa Depan.</p>
      </div>
    </footer>
  );
}

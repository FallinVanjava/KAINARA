"use client"

import * as React from "react"

export interface TapisMotif {
  id: string
  name: string
  origin: string
  philosophy: string
  usage: string
  skintoneMatch: string
  patternColor: string
}

const TAPIS_DATA: TapisMotif[] = [
  {
    id: "jung-sarat",
    name: "Tapis Jung Sarat",
    origin: "Menggala",
    philosophy:
      "Melambangkan perahu agung pembawa kemakmuran dan persatuan keluarga besar dalam tradisi adat Lampung Pepadun.",
    usage: "Dipakai oleh pengantin wanita dan pemuka adat pada upacara pernikahan serta Begawi Cakak Pepadun.",
    skintoneMatch: "Warm Olive, Sawo Matang, Deep Tan",
    patternColor: "#6D0F0F",
  },
  {
    id: "raja-medal",
    name: "Tapis Raja Medal",
    origin: "Way Kanan",
    philosophy:
      "Simbol kehormatan, kepemimpinan bijaksana, dan keteguhan hati dalam menjaga marwah keluarga.",
    usage: "Dikenakan oleh tokoh adat pria dan wanita pada prosesi penyambutan tamu kehormatan.",
    skintoneMatch: "Medium Neutral, Warm Beige, Deep Espresso",
    patternColor: "#7F1D1D",
  },
  {
    id: "inuh",
    name: "Tapis Inuh",
    origin: "Pesisir",
    philosophy:
      "Menggambarkan keharmonisan manusia dengan alam semesta serta doa keselamatan dalam setiap perjalanan.",
    usage: "Busana kebesaran adat masyarakat Lampung Saibatin pada acara perhelatan resmi.",
    skintoneMatch: "Fair Cool, Light Warm, Olive",
    patternColor: "#58111A",
  },
  {
    id: "cucuk-andak",
    name: "Tapis Cucuk Andak",
    origin: "Pubian",
    philosophy:
      "Motif geometris pucuk rebung bertingkat yang bermakna pertumbuhan, harapan baik, dan keluhuran budi.",
    usage: "Cocok dipadukan dengan kebaya modern untuk acara wisuda, lamaran, maupun perayaan formal.",
    skintoneMatch: "Semua Skintone (Netral & Hangat)",
    patternColor: "#6D0F0F",
  },
]

const REGIONS = ["Semua", "Menggala", "Way Kanan", "Pesisir", "Pubian"]

/** Ilustrasi pola geometris Tapis SVG sebagai placeholder/thumbnail motif */
function TapisPatternPreview({ accent = "#6D0F0F", variant = 0 }: { accent?: string; variant?: number }) {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full object-cover" aria-hidden="true">
      <rect width="320" height="200" fill={accent} />
      {/* Garis tenun horizontal */}
      <g stroke="#C8A84B" strokeWidth="2" opacity="0.85">
        <line x1="0" y1="26" x2="320" y2="26" />
        <line x1="0" y1="34" x2="320" y2="34" strokeDasharray="6 4" />
        <line x1="0" y1="166" x2="320" y2="166" strokeDasharray="6 4" />
        <line x1="0" y1="174" x2="320" y2="174" />
      </g>
      {/* Ornamen Pucuk Rebung & Belah Ketupat */}
      <g fill="none" stroke="#FAF3EB" strokeWidth="1.8" opacity="0.9">
        {[40, 120, 200, 280].map((cx, idx) => (
          <g key={cx} transform={`translate(${cx}, 100)`}>
            <polygon points="0,-42 32,0 0,42 -32,0" stroke="#C8A84B" strokeWidth="2.5" />
            <polygon points="0,-24 18,0 0,24 -18,0" />
            {variant % 2 === idx % 2 ? (
              <circle cx="0" cy="0" r="6" fill="#C8A84B" stroke="none" />
            ) : (
              <path d="M-8 0 L0 -8 L8 0 L0 8 Z" fill="#FAF3EB" stroke="none" />
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ============================================================================
   1. SECTION JELAJAH MOTIF (Sesuai Alur Diagram Jelajah Motif)
   ============================================================================ */
export function JelajahMotifSection() {
  const [selectedRegion, setSelectedRegion] = React.useState("Semua")
  const [search, setSearch] = React.useState("")
  const [activeMotif, setActiveMotif] = React.useState<TapisMotif | null>(null)

  const filteredMotifs = TAPIS_DATA.filter((m) => {
    const matchRegion = selectedRegion === "Semua" || m.origin === selectedRegion
    const matchQuery =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.origin.toLowerCase().includes(search.toLowerCase())
    return matchRegion && matchQuery
  })

  return (
    <section id="jelajah-motif" className="py-20 px-5 sm:px-8 border-t border-[#2d1810]/10 bg-[#faf3eb]">
      <div className="max-w-[1220px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-[#6D0F0F] bg-white px-3.5 py-1.5 rounded-full border border-[#2d1810]/15">
              Arsip Wastra Lampung
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2d1810] mt-4 tracking-tight">
              Jelajah Motif Tapis
            </h2>
            <p className="font-editorial text-[#5c534e] text-lg mt-2 leading-relaxed">
              Pilih motif kain Tapis untuk mempelajari asal daerah, makna filosofis, serta etika pemakaiannya.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama motif atau daerah..."
              className="w-full font-display text-sm bg-white border border-[#2d1810]/15 rounded-full pl-10 pr-4 py-2.5 text-[#2d1810] placeholder:text-[#5c534e]/60 focus:outline-none focus:border-[#6D0F0F]"
            />
            <svg
              className="w-4 h-4 text-[#5c534e] absolute left-3.5 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {REGIONS.map((region) => {
            const active = selectedRegion === region
            return (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`font-display text-sm font-medium px-4 py-2 rounded-full transition-all cursor-pointer ${
                  active
                    ? "bg-[#6D0F0F] text-white shadow-sm"
                    : "bg-white text-[#2d1810] border border-[#2d1810]/15 hover:border-[#6D0F0F]"
                }`}
              >
                {region}
              </button>
            )
          })}
        </div>

        {/* Grid Katalog Motif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMotifs.map((motif, idx) => (
            <article
              key={motif.id}
              onClick={() => setActiveMotif(motif)}
              className="group bg-white rounded-3xl border border-[#2d1810]/12 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="h-44 overflow-hidden relative">
                <TapisPatternPreview accent={motif.patternColor} variant={idx} />
                <span className="absolute top-3 left-3 font-display text-xs font-semibold bg-[#faf3eb]/95 text-[#6D0F0F] px-3 py-1 rounded-full">
                  {motif.origin}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display text-lg font-bold text-[#2d1810] group-hover:text-[#6D0F0F] transition-colors">
                  {motif.name}
                </h3>
                <p className="font-editorial text-sm text-[#5c534e] mt-2 line-clamp-2 flex-1">
                  {motif.philosophy}
                </p>
                <div className="mt-4 pt-3 border-t border-[#2d1810]/10 flex items-center justify-between font-display text-xs font-semibold text-[#6D0F0F]">
                  <span>Lihat Informasi Motif</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Informasi Motif */}
      {activeMotif && (
        <div
          className="fixed inset-0 z-50 bg-[#2d1810]/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveMotif(null)}
        >
          <div
            className="bg-[#faf3eb] border border-[#2d1810]/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-48 relative">
              <TapisPatternPreview accent={activeMotif.patternColor} variant={1} />
              <button
                type="button"
                onClick={() => setActiveMotif(null)}
                aria-label="Tutup detail motif"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#2d1810] grid place-items-center shadow-md cursor-pointer hover:bg-[#6D0F0F] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs font-semibold bg-[#6D0F0F] text-white px-3 py-1 rounded-full">
                  Asal: {activeMotif.origin}
                </span>
                <span className="font-display text-xs font-medium bg-white border border-[#2d1810]/15 text-[#2d1810] px-3 py-1 rounded-full">
                  Skintone: {activeMotif.skintoneMatch}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2d1810]">{activeMotif.name}</h3>
              <div className="bg-white rounded-2xl p-4 border border-[#2d1810]/10">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#6D0F0F] mb-1">
                  Makna Filosofis
                </h4>
                <p className="font-editorial text-[#2d1810] text-base leading-relaxed">{activeMotif.philosophy}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#2d1810]/10">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#6D0F0F] mb-1">
                  Etika &amp; Peruntukan Acara
                </h4>
                <p className="font-editorial text-[#2d1810] text-base leading-relaxed">{activeMotif.usage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ============================================================================
   2. SECTION KUESIONER PENCOCOKAN GARIS (Sesuai Alur Diagram Kuesioner)
   ============================================================================ */
const SHUFFLED_OPTIONS: TapisMotif[] = [
  TAPIS_DATA[2], // Inuh
  TAPIS_DATA[0], // Jung Sarat
  TAPIS_DATA[3], // Cucuk Andak
  TAPIS_DATA[1], // Raja Medal
]

export function KuesionerMotifSection() {
  const [selectedLeft, setSelectedLeft] = React.useState<string | null>(null)
  const [connections, setConnections] = React.useState<Record<string, string>>({})
  const [submitted, setSubmitted] = React.useState(false)
  const arenaRef = React.useRef<HTMLDivElement | null>(null)
  const leftDotRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const rightDotRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const [lines, setLines] = React.useState<Array<{ fromId: string; toId: string; x1: number; y1: number; x2: number; y2: number }>>([])

  const recalcLines = React.useCallback(() => {
    const arena = arenaRef.current
    if (!arena) return
    const arenaRect = arena.getBoundingClientRect()
    const nextLines: Array<{ fromId: string; toId: string; x1: number; y1: number; x2: number; y2: number }> = []

    Object.entries(connections).forEach(([leftId, rightId]) => {
      const lEl = leftDotRefs.current[leftId]
      const rEl = rightDotRefs.current[rightId]
      if (!lEl || !rEl) return
      const lRect = lEl.getBoundingClientRect()
      const rRect = rEl.getBoundingClientRect()
      nextLines.push({
        fromId: leftId,
        toId: rightId,
        x1: lRect.left + lRect.width / 2 - arenaRect.left,
        y1: lRect.top + lRect.height / 2 - arenaRect.top,
        x2: rRect.left + rRect.width / 2 - arenaRect.left,
        y2: rRect.top + rRect.height / 2 - arenaRect.top,
      })
    })
    setLines(nextLines)
  }, [connections])

  React.useEffect(() => {
    recalcLines()
    window.addEventListener("resize", recalcLines)
    return () => window.removeEventListener("resize", recalcLines)
  }, [recalcLines])

  const handleRightSelect = (rightId: string) => {
    if (!selectedLeft || submitted) return
    setConnections((prev) => {
      const updated = { ...prev }
      // Hapus koneksi lama jika titik kanan sudah dipakai
      Object.keys(updated).forEach((k) => {
        if (updated[k] === rightId) delete updated[k]
      })
      updated[selectedLeft] = rightId
      return updated
    })
    setSelectedLeft(null)
  }

  const score = Object.entries(connections).filter(([l, r]) => l === r).length * 25
  const allConnected = Object.keys(connections).length === TAPIS_DATA.length

  const resetQuiz = () => {
    setConnections({})
    setSelectedLeft(null)
    setSubmitted(false)
  }

  return (
    <section id="kuesioner" className="py-20 px-5 sm:px-8 border-t border-[#2d1810]/10 bg-[#f5ebe0]/65">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-[#6D0F0F] bg-white px-3.5 py-1.5 rounded-full border border-[#2d1810]/15">
            Uji Pemahaman Wastra
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2d1810] mt-4">
            Kuesioner Pencocokan Motif
          </h2>
          <p className="font-editorial text-[#5c534e] text-lg mt-2">
            Klik titik pada gambar motif di kiri lalu hubungkan ke nama motif yang tepat di sebelah kanan.
          </p>
        </div>

        {/* Arena Pencocokan 2 Kolom + Garis SVG */}
        <div ref={arenaRef} className="relative grid grid-cols-2 gap-10 sm:gap-24 items-center">
          {/* Overlay Garis Penghubung SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
            {lines.map((ln) => {
              const isCorrect = ln.fromId === ln.toId
              const strokeColor = !submitted ? "#6D0F0F" : isCorrect ? "#15803d" : "#b91c1c"
              const midX = (ln.x1 + ln.x2) / 2
              return (
                <path
                  key={ln.fromId}
                  d={`M ${ln.x1} ${ln.y1} C ${midX} ${ln.y1}, ${midX} ${ln.y2}, ${ln.x2} ${ln.y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {/* Kolom Kiri: Gambar Motif */}
          <div className="space-y-4">
            {TAPIS_DATA.map((item, idx) => {
              const isSelected = selectedLeft === item.id
              const isConnected = Boolean(connections[item.id])
              return (
                <div
                  key={item.id}
                  onClick={() => !submitted && setSelectedLeft(isSelected ? null : item.id)}
                  className={`relative bg-white rounded-2xl p-2.5 border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "border-[#6D0F0F] ring-2 ring-[#6D0F0F]/25"
                      : "border-[#2d1810]/15 hover:border-[#6D0F0F]"
                  }`}
                >
                  <div className="w-full h-16 sm:h-20 rounded-xl overflow-hidden">
                    <TapisPatternPreview accent={item.patternColor} variant={idx} />
                  </div>
                  <button
                    ref={(el) => {
                      leftDotRefs.current[item.id] = el
                    }}
                    type="button"
                    aria-label={`Pilih gambar motif ${idx + 1}`}
                    className={`w-5 h-5 rounded-full border-2 -mr-5 z-20 transition-transform cursor-pointer ${
                      isSelected || isConnected
                        ? "bg-[#6D0F0F] border-[#faf3eb] scale-110"
                        : "bg-[#C8A84B] border-white"
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Kolom Kanan: Nama Motif */}
          <div className="space-y-4">
            {SHUFFLED_OPTIONS.map((option) => {
              const connectedFrom = Object.keys(connections).find((k) => connections[k] === option.id)
              return (
                <div
                  key={option.id}
                  onClick={() => handleRightSelect(option.id)}
                  className={`relative bg-white rounded-2xl px-4 py-5 sm:py-6 border transition-all flex items-center gap-3 cursor-pointer ${
                    selectedLeft
                      ? "border-[#C8A84B] hover:border-[#6D0F0F] hover:bg-[#faf3eb]"
                      : "border-[#2d1810]/15"
                  }`}
                >
                  <button
                    ref={(el) => {
                      rightDotRefs.current[option.id] = el
                    }}
                    type="button"
                    aria-label={`Hubungkan ke ${option.name}`}
                    className={`w-5 h-5 rounded-full border-2 -ml-6.5 z-20 shrink-0 cursor-pointer ${
                      connectedFrom ? "bg-[#6D0F0F] border-[#faf3eb]" : "bg-[#C8A84B] border-white"
                    }`}
                  />
                  <span className="font-display text-sm sm:text-base font-semibold text-[#2d1810]">
                    {option.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tombol Selesai & Skor */}
        <div className="mt-10 flex flex-col items-center gap-4">
          {!submitted ? (
            <button
              type="button"
              disabled={!allConnected}
              onClick={() => setSubmitted(true)}
              className="font-display font-semibold text-sm px-8 py-3.5 rounded-full bg-[#6D0F0F] text-white disabled:opacity-40 hover:bg-[#540b0b] transition-all cursor-pointer shadow-sm"
            >
              Selesai ({Object.keys(connections).length}/{TAPIS_DATA.length} Terhubung)
            </button>
          ) : (
            <div className="bg-white border border-[#2d1810]/15 rounded-3xl p-6 text-center max-w-md w-full shadow-sm">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-[#6D0F0F]">
                Hasil Kuesioner Anda
              </p>
              <p className="font-display text-4xl font-bold text-[#2d1810] mt-1">{score} / 100</p>
              <p className="font-editorial text-[#5c534e] text-base mt-2">
                {score === 100
                  ? "Sempurna! Anda berhasil mengenali seluruh motif Tapis Lampung dengan tepat."
                  : "Garis hijau menandakan jawaban tepat, sedangkan garis merah perlu dicoba kembali."}
              </p>
              <button
                type="button"
                onClick={resetQuiz}
                className="mt-4 font-display text-sm font-semibold px-6 py-2.5 rounded-full border border-[#6D0F0F] text-[#6D0F0F] hover:bg-[#6D0F0F] hover:text-white transition-colors cursor-pointer"
              >
                Ulangi Kuesioner
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   3. SECTION TERHUBUNG APLIKASI (Selaras Desain Mockup Aplikasi & Landing Page)
   ============================================================================ */
export function TerhubungAplikasiSection({
  mascotSrc = "/images/kainara-mascot-hero.png",
}: {
  mascotSrc?: string
}) {
  return (
    <section id="terhubung-aplikasi" className="py-20 px-5 sm:px-8 border-t border-[#2d1810]/10 bg-[#faf3eb]">
      <div className="max-w-[1220px] mx-auto bg-white border border-[#2d1810]/12 rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 relative z-10">
            <span className="inline-block font-display text-xs font-semibold uppercase tracking-widest text-[#6D0F0F] bg-[#faf3eb] px-4 py-1.5 rounded-full border border-[#2d1810]/15">
              Fitur Eksklusif Aplikasi KAINARA
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2d1810] leading-tight">
              Pindai Kain Tapis &amp; Cocokkan Skintone di Ponselmu
            </h2>
            <p className="font-editorial text-lg text-[#5c534e] leading-relaxed max-w-2xl">
              Bawa pengalaman edukasi wastra Lampung ke genggaman Anda. Identifikasi motif kain secara instan dan
              dapatkan rekomendasi warna busana yang paling serasi dengan rona kulit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#faf3eb] border border-[#2d1810]/10 rounded-2xl p-5">
                <h3 className="font-display font-bold text-[#2d1810] text-base">Scan Motif Tapis AI</h3>
                <p className="font-editorial text-sm text-[#5c534e] mt-1.5 leading-relaxed">
                  Arahkan kamera ke kain tapis fisik untuk mengetahui nama motif, filosofi, dan daerah asalnya.
                </p>
              </div>
              <div className="bg-[#faf3eb] border border-[#2d1810]/10 rounded-2xl p-5">
                <h3 className="font-display font-bold text-[#2d1810] text-base">Scan Skintone &amp; Outfit</h3>
                <p className="font-editorial text-sm text-[#5c534e] mt-1.5 leading-relaxed">
                  Analisis warna kulit untuk rekomendasi padu padan warna tapis dan kebaya/beskap yang selaras.
                </p>
              </div>
            </div>

            <div className="pt-3">
              <a
                href="#download-apk"
                className="inline-flex items-center gap-2.5 font-display font-semibold text-sm bg-[#6D0F0F] hover:bg-[#540b0b] text-white px-7 py-3.5 rounded-full shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Unduh Aplikasi KAINARA</span>
              </a>
            </div>
          </div>

          {/* Kartu Pratinjau Maskot & Skintone */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-[#faf3eb] border border-[#2d1810]/12 rounded-3xl p-6 pb-0 overflow-hidden text-center">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-[#6D0F0F]">
                Asisten Pintar Wastra Lampung
              </p>
              <p className="font-editorial text-sm text-[#5c534e] mt-1 mb-4">
                Rekomendasi palet warna personal langsung dari kamera HP
              </p>
              <img
                src={mascotSrc}
                alt="Maskot KAINARA memegang palet skintone"
                className="w-64 h-64 object-contain object-bottom mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
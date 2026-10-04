import type { Motif, Outfit } from "@/types";

export const MOTIF_DATA: Motif[] = [
  {
    id: "motif_belah_ketupat",
    name: "Motif Belah Ketupat",
    slug: "motif-belah-ketupat",
    category: "Geometris Ragam Hias Tapis",
    origin: "Lampung (Saibatin & Pepadun)",
    philosophy:
      "Ragam geometris belah ketupat melambangkan empat pilar kehidupan masyarakat adat Lampung, yaitu keselarasan mikrokosmos dan makrokosmos, kesucian batin, serta keseimbangan moral dalam setiap musyawarah adat.",
    eventContext: "Acara Formal, Upacara Adat, Pernikahan",
    colors: ["#6D0F0F", "#D2AA36", "#1C1B19", "#EDE3DA"],
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80&fit=crop",
  },
  {
    id: "motif_bunga_ashar",
    name: "Motif Bunga Ashar (Kembang Asar)",
    slug: "motif-bunga-ashar",
    category: "Ragam Flora Lambang Ketepatan Waktu",
    origin: "Lampung",
    philosophy:
      "Terinspirasi dari flora kembang asar (bunga pukul empat) yang senantiasa mekar menjelang sore. Menjadi simbol kedisiplinan hidup, pengingat waktu ibadah, serta keanggunan dan kehalusan budi pekerti kaum wanita Lampung.",
    eventContext: "Semi-Formal, Pertemuan Kasual, Pakaian Keseharian",
    colors: ["#D2AA36", "#1C1B19", "#EDE3DA", "#F7E2C3"],
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80&fit=crop",
  },
  {
    id: "motif_gajah",
    name: "Motif Gajah Way Kambas",
    slug: "motif-gajah",
    category: "Simbol Fauna Kebanggaan & Kesetiaan",
    origin: "Way Kambas, Lampung Timur",
    philosophy:
      "Gajah merupakan fauna ikonik bumi Ruwa Jurai yang merepresentasikan kekuatan jiwa, kebijaksanaan seorang pemimpin, loyalitas keluarga, serta tanggung jawab mulia menjaga kelestarian alam lingkungan.",
    eventContext: "Kasual Harian, Seragam Komunitas, Acara Semi-Formal",
    colors: ["#1C1B19", "#D2AA36", "#2C3E6B", "#EDE3DA"],
    imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80&fit=crop",
  },
  {
    id: "motif_gamolan",
    name: "Motif Gamolan Pekhing",
    slug: "motif-gamolan",
    category: "Seni Musik Tradisional & Harmoni",
    origin: "Lampung Barat",
    philosophy:
      "Mengabadikan instrumen gamolan bambu purba Lampung ke dalam pola kain tenun. Melambangkan keharmonisan hubungan sosial antar-warga, kekayaan musikal leluhur, dan kegembiraan perayaan kebudayaan.",
    eventContext: "Festival Budaya, Pentas Seni, Kasual",
    colors: ["#D9D9D9", "#1C1B19", "#D2AA36", "#0F0E0D"],
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80&fit=crop",
  },
  {
    id: "motif_kapal",
    name: "Motif Palepai Kapal (Ship Cloth)",
    slug: "motif-kapal",
    category: "Kain Sakral Upacara Adat",
    origin: "Lampung Selatan (Pesisir Saibatin)",
    philosophy:
      "Kapal melambangkan bahtera transisi siklus kehidupan manusia, mulai dari kelahiran, kedewasaan, pernikahan, hingga akhir hayat, serta simbol persatuan antarsuku masyarakat pesisir Lampung.",
    eventContext: "Sangat Sakral (Tidak Sembarangan), Pernikahan, Penyambutan Tamu Agung",
    colors: ["#6D0F0F", "#2C3E6B", "#D2AA36", "#EDE3DA"],
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80&fit=crop",
  },
  {
    id: "tapis_pucuk_rebung",
    name: "Tapis Pucuk Rebung (Tumpal)",
    slug: "tapis-pucuk-rebung",
    category: "Geometris Sakral Tapis",
    origin: "Lampung (Pesisir & Pedalaman)",
    philosophy:
      "Susunan segitiga berderet dari tunas bambu melambangkan kekuatan menghadapi rintangan hidup, pertumbuhan budi pekerti yang kokoh dari generasi ke generasi, dan tatanan hirarki kepemimpinan adat yang luhur.",
    eventContext: "Bawahan Resmi Tapis, Upacara Adat Begawi, Pernikahan",
    colors: ["#D2AA36", "#6D0F0F", "#1C1B19", "#F7E2C3"],
    imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80&fit=crop",
  },
  {
    id: "tapis_bintang_perak",
    name: "Tapis Bintang Perak (Bintang Berantai)",
    slug: "tapis-bintang-perak",
    category: "Ragam Hias Tapis Benang Perak & Emas",
    origin: "Lampung (Pepadun & Saibatin)",
    philosophy:
      "Pola bintang perak bersulam benang perak dan emas melambangkan kemilau harapan, kejayaan leluhur maritim, serta ketinggian derajat budi pekerti wanita Lampung dalam upacara adat agung.",
    eventContext: "Pernikahan Tradisional, Upacara Adat Penyambutan, Busana Pengantin",
    colors: ["#D9D9D9", "#D2AA36", "#1C1B19", "#EDE3DA"],
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80&fit=crop",
  },
  {
    id: "motif_sembagi",
    name: "Motif Sembagi Lampung",
    slug: "motif-sembagi",
    category: "Warisan Jalur Rempah & Wastra Klasik",
    origin: "Lampung (Pepadun)",
    philosophy:
      "Perpaduan kearifan wastra lokal dengan pengaruh perdagangan rempah nusantara. Menyimbolkan kemakmuran, derajat martabat keluarga terpandang, dan keagungan busana kebesaran para tetua adat.",
    eventContext: "Acara Formal, Busana Kerja, Seragam",
    colors: ["#1C1B19", "#6D0F0F", "#D2AA36", "#EDE3DA"],
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80&fit=crop",
  },
  {
    id: "motif_siger",
    name: "Motif Mahkota Siger",
    slug: "motif-siger",
    category: "Mahkota Pengantin & Keagungan",
    origin: "Lampung",
    philosophy:
      "Mahkota emas sembilan lekuk kehormatan wanita Lampung. Melambangkan kepemimpinan sembilan marga besar (Abung Siwo Mego), martabat luhur kaum ibu, serta simbol identitas tertinggi tanah Lampung.",
    eventContext: "Pernikahan, Formal Pejabat, Sambutan Besar",
    colors: ["#D2AA36", "#B89222", "#1C1B19", "#EDE3DA"],
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&fit=crop",
  }
];

export function getMotifById(id: string): Motif | undefined {
  const direct = MOTIF_DATA.find((m) => m.id === id);
  if (direct) return direct;

  // Alias lookup (misal: motif_pucuk_rebung <-> tapis_pucuk_rebung)
  if (id === "motif_pucuk_rebung") return MOTIF_DATA.find((m) => m.id === "tapis_pucuk_rebung");
  if (id === "tapis_pucuk_rebung") return MOTIF_DATA.find((m) => m.id === "tapis_pucuk_rebung");
  return undefined;
}

export const OUTFIT_DATA: Outfit[] = [
  {
    id: "o1",
    title: "Kebaya Modern Tapis Bintang Perak",
    category: "tradisional",
    motifId: "tapis_bintang_perak",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=85&fit=crop",
    tags: ["wanita", "tradisional", "adat", "tapis-bintang-perak", "bintang-perak", "hijab-friendly", "gold-accent", "earth-tone"],
  },
  {
    id: "o2",
    title: "Jas Formal Etnik Tapis Pucuk Rebung",
    category: "formal",
    motifId: "tapis_pucuk_rebung",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=85&fit=crop",
    tags: ["pria", "formal", "kantor", "pucuk-rebung", "tapis-pucuk-rebung", "earth-tone"],
  },
  {
    id: "o3",
    title: "Tunik Modest Sulam Tapis Emas",
    category: "semi-formal",
    motifId: "tapis_pucuk_rebung",
    imageUrl: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&q=85&fit=crop",
    tags: ["wanita", "semi-formal", "modern-etnik", "tapis-pucuk-rebung", "hijab-friendly", "earth-tone"],
  },
  {
    id: "o4",
    title: "Rok Lilit Tapis Sasab Bintang Perak",
    category: "casual",
    motifId: "tapis_bintang_perak",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=85&fit=crop",
    tags: ["wanita", "bawahan", "kasual", "tapis-bintang-perak", "bintang-perak", "earth-tone"],
  },
  {
    id: "o5",
    title: "Kemeja Etnik Tenun Tapis Pria",
    category: "casual",
    motifId: "tapis_pucuk_rebung",
    imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=85&fit=crop",
    tags: ["pria", "kasual", "sehari-hari", "tapis-pucuk-rebung", "earth-tone"],
  },
  {
    id: "o6",
    title: "Outer Kimono Sulam Tapis Kontemporer",
    category: "semi-formal",
    motifId: "tapis_bintang_perak",
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=85&fit=crop",
    tags: ["unisex", "semi-formal", "tapis-bintang-perak", "monokrom", "hijab-friendly"],
  },
  {
    id: "o7",
    title: "Blazer Tenun Tapis Mahkota Siger",
    category: "formal",
    motifId: "motif_siger",
    imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=85&fit=crop",
    tags: ["wanita", "formal", "siger", "monokrom", "hijab-friendly"],
  },
  {
    id: "o8",
    title: "Gaun Malam Couture Tapis Lampung",
    category: "tradisional",
    motifId: "tapis_bintang_perak",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=85&fit=crop",
    tags: ["wanita", "tradisional", "pesta", "tapis-bintang-perak", "earth-tone"],
  },
];

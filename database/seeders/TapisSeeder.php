<?php

namespace Database\Seeders;

use App\Models\Outfit;
use App\Models\TapisMotif;
use Illuminate\Database\Seeder;

class TapisSeeder extends Seeder
{
    public function run(): void
    {
        $motifs = [
            [
                'name' => 'Tapis Cucuk Pinggir',
                'slug' => 'tapis-cucuk-pinggir',
                'origin_region' => 'Banda Lampung',
                'dominant_color' => 'Emas pada kain dasar gelap',
                'description' => 'Motif tapis paling ikonik dari pesisir Lampung. Sulaman benang emas dan kaca memenuhi pinggir kain membentuk ragam hias bunga cucuk pinggir yang padat dan berkilau.',
                'history' => 'Dikembangkan di lingkungan Kesultanan Banten-Lampung pada abad ke-19 sebagai kain pernikahan dan upacara adat. Penggunaannya menandai status sosial pemakainya.',
                'philosophy' => 'Rapatan sulaman di tepi kain menggambarkan keutuhan hidup dan kebersamaan keluarga. Semakin padat sulamannya, semakin tinggi rasa hormat yang ingin ditunjukkan pemakainya.',
            ],
            [
                'name' => 'Tapis Grevasia',
                'slug' => 'tapis-grevasia',
                'origin_region' => 'Kotabumi, Lampung Utara',
                'dominant_color' => 'Emas dan merah',
                'description' => 'Motif dengan susunan sulaman vertikal dan horizontal yang tersusun seperti jalinan grasi, mencampur benang emas dengan kain dasar merah atau hitam.',
                'history' => 'Berkembang di wilayah Abung Semaka, Lampung Utara, terutama di lingkungan keluarga bangsawan dan penari adat untuk membedakan diri dalam upacara adat.',
                'philosophy' => 'Jalinan pola melambangkan hubungan antar manusia yang saling terikat, dan semangat gotong royong masyarakat Lampung.',
            ],
            [
                'name' => 'Tapis Ingin Sawa',
                'slug' => 'tapis-ingin-sawa',
                'origin_region' => 'Lampung Selatan',
                'dominant_color' => 'Emas dan biru',
                'description' => 'Motif yang menampilkan ragam hias sulaman emas pada kain dengan warna latar cerah. Sulamannya berpola rangkaian bunga dan daun yang melingkar.',
                'history' => 'Dikenal di daerah pesisir Lampung Selatan dan digunakan dalam upacara adat perkawinan serta tarian adat setempat.',
                'philosophy' => 'Bunga yang melingkar melambangkan harapan kehidupan yang selalu berputar dan berkembang, tidak pernah berhenti pada satu keadaan.',
            ],
            [
                'name' => 'Tapis Sejarah',
                'slug' => 'tapis-sejarah',
                'origin_region' => 'Lampung Tengah',
                'dominant_color' => 'Emas',
                'description' => 'Motif naratif yang menggambarkan kisah perjalanan hidup dan peristiwa sejarah masyarakat Lampung melalui rangkaian sulaman emas pada kain dasar gelap.',
                'history' => 'Digunakan oleh masyarakat pesisir Lampung untuk menceritakan kisah keluarganya, biasanya pada upacara pernikahan dan adat besar.',
                'philosophy' => 'Kain sebagai catatan hidup: setiap sulaman adalah bab yang harus diingat dan diteruskan kepada keturunan.',
            ],
            [
                'name' => 'Tapis Tanduk',
                'slug' => 'tapis-tanduk',
                'origin_region' => 'Lampung Tengah',
                'dominant_color' => 'Emas dan hitam',
                'description' => 'Motif dengan pola sulaman seperti tanduk hewan yang melengkung, memadukan benang emas dan kaca pada kain dasar hitam.',
                'history' => 'Terkait erat dengan tradisi perburuan dan hasil hutan masyarakat Lampung Tengah, sering digunakan pada upacara adat.',
                'philosophy' => 'Tanduk melambangkan ketangguhan dan kemampuan melindungi keluarga, warisan nilai yang diwariskan dari generasi ke generasi.',
            ],
            [
                'name' => 'Tapis Sadis',
                'slug' => 'tapis-sadis',
                'origin_region' => 'Lampung Selatan',
                'dominant_color' => 'Emas dan hijau',
                'description' => 'Motif bergambar tanaman sawit yang tumbuh di Lampung, dikerjakan dengan sulaman emas pada kain dasar berwarna tua.',
                'history' => 'Muncul di paruh kedua abad ke-20 ketika perkebunan sawit masuk Lampung, lalu diadopsi perajin tapis sebagai cerita baru dari tanah sendiri.',
                'philosophy' => 'Menunjukkan bagaimana tradisi tapis tumbuh bersama masa kini, tanpa kehilangan akar budayanya.',
            ],
        ];

        foreach ($motifs as $motif) {
            TapisMotif::firstOrCreate(['slug' => $motif['slug']], $motif);
        }

        $outfits = [
            [
                'name' => 'Makuta Emas Bertabur',
                'slug' => 'makuta-emas-bertabur',
                'category' => 'set',
                'skintone_match' => ['warm'],
                'description' => 'Set dua potong dengan motif cucuk pinggir pada panel dada. Potongan siluet tegas dengan sulaman emas di bagian pinggir.',
                'mix_match_notes' => 'Pakai dengan alas kaki kulit berwarna cokelat tua dan aksesori emas tipis agar sulaman tapis tetap menjadi pusat perhatian.',
                'motifs' => ['tapis-cucuk-pinggir'],
            ],
            [
                'name' => 'Kemeja Maroon Gradasi Tapis',
                'slug' => 'kemeja-maroon-gradasi-tapis',
                'category' => 'atasan',
                'skintone_match' => ['warm', 'neutral'],
                'description' => 'Kemeja maroon dengan kain tapis terpasang pada satu sisi bahu. Cocok dipadukan dengan bawahan polos berwarna netral.',
                'mix_match_notes' => 'Padukan dengan rok atau celana hitam polos dan sepatu minimalis, jangan pakai aksen warna lain yang ramai.',
                'motifs' => ['tapis-cucuk-pinggir', 'tapis-grevasia'],
            ],
            [
                'name' => 'Rok Cigading Grevasia',
                'slug' => 'rok-cigading-grevasia',
                'category' => 'bawahan',
                'skintone_match' => ['neutral', 'cool'],
                'description' => 'Rok lurus panjang dengan panel sulaman grevasia pada bagian bawah. Warna dasar rok mengikuti skema warna tapis.',
                'mix_match_notes' => 'Pakai atasan putih polos atau warna cream agar kontras sulaman emas terlihat jelas.',
                'motifs' => ['tapis-grevasia'],
            ],
            [
                'name' => 'Bawahan Kulonprogo Cigading',
                'slug' => 'bawahan-kulonprogo-cigading',
                'category' => 'bawahan',
                'skintone_match' => ['cool'],
                'description' => 'Bawahan berwarna gelap dengan aksen sulaman tapis pada pinggir. Bentuk longgar agar nyaman dipakai sehari-hari.',
                'mix_match_notes' => 'Padukan dengan kemeja polos berwarna gelap dan biarkan aksen tapis muncul di bagian bawah.',
                'motifs' => ['tapis-sejarah'],
            ],
        ];

        foreach ($outfits as $outfit) {
            $motifSlugs = $outfit['motifs'];
            unset($outfit['motifs']);

            $outfit = Outfit::firstOrCreate(['slug' => $outfit['slug']], $outfit);
            $motifIds = TapisMotif::whereIn('slug', $motifSlugs)->pluck('id');
            $outfit->motifs()->syncWithoutDetaching($motifIds);
        }
    }
}
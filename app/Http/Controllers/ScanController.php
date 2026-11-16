<?php

namespace App\Http\Controllers;

use App\Models\Outfit;
use App\Models\TapisMotif;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ScanController extends Controller
{
    public function scan(): View
    {
        return view('scan');
    }

    public function motif(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048']);

        $payload = $this->predict($request, '/predict-motif');

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $label = collect(['motif', 'label', 'prediction'])
            ->map(fn (string $key) => $payload[$key] ?? null)
            ->filter()
            ->first();

        if (! $label) {
            return response()->json([
                'ok' => false,
                'message' => 'Hasil analisis tidak dikenali. Coba foto yang lebih jelas.',
            ], 422);
        }

        $motif = TapisMotif::query()
            ->whereRaw('LOWER(name) = ?', [mb_strtolower(trim($label))])
            ->first();

        return response()->json([
            'ok' => true,
            'tab' => 'motif',
            'label' => $label,
            'confidence' => round(100 * (float) ($payload['confidence'] ?? $payload['score'] ?? 0), 1),
            'motif' => $motif ? [
                'name' => $motif->name,
                'slug' => $motif->slug,
                'origin_region' => $motif->origin_region,
                'url' => route('galeri.detail', $motif->slug),
            ] : null,
        ]);
    }

    public function skintone(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048']);

        $payload = $this->predict($request, '/predict-skintone');

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $tone = collect(['skintone', 'skin_tone', 'tone', 'label'])
            ->map(fn (string $key) => $payload[$key] ?? null)
            ->filter()
            ->first();

        if (! $tone) {
            return response()->json([
                'ok' => false,
                'message' => 'Hasil analisis tidak dikenali. Coba foto yang lebih terang.',
            ], 422);
        }

        $tone = mb_strtolower(trim($tone));

        $outfits = Outfit::query()
            ->whereJsonContains('skintone_match', $tone)
            ->with('motifs')
            ->get();

        $motifs = $outfits->flatMap->motifs->unique('id')->values()->map(
            fn (TapisMotif $m) => [
                'name' => $m->name,
                'slug' => $m->slug,
                'url' => route('galeri.detail', $m->slug),
            ],
        )->values();

        return response()->json([
            'ok' => true,
            'tab' => 'skintone',
            'skintone' => $tone,
            'outfits' => $outfits->map(fn (Outfit $o) => [
                'name' => $o->name,
                'url' => route('outfit.detail', $o->slug),
            ])->values(),
            'motifs' => $motifs,
        ]);
    }

    /**
     * Kirim gambar ke layanan ML, file sementara dihapus di semua jalur.
     *
     * @return array|JsonResponse array payload ML, atau JsonResponse error
     */
    private function predict(Request $request, string $endpoint): array|JsonResponse
    {
        if (! config('services.ml.url')) {
            return response()->json([
                'ok' => false,
                'message' => 'Layanan AI belum dikonfigurasi. Hubungi pengelola situs.',
            ], 503);
        }

        $url = rtrim(config('services.ml.url'), '/').$endpoint;
        $path = $request->file('image')->store('scan-temp');

        try {
            $headers = config('services.ml.key') ? ['Authorization' => 'Bearer '.config('services.ml.key')] : [];

            $response = Http::timeout(30)
                ->withHeaders($headers)
                ->attach('image', Storage::get($path), 'upload.jpg')
                ->post($url);
        } catch (\Throwable) {
            Storage::delete($path);

            return response()->json([
                'ok' => false,
                'message' => 'Koneksi ke layanan AI gagal. Coba beberapa saat lagi.',
            ], 502);
        }

        Storage::delete($path);

        if ($response->failed()) {
            return response()->json([
                'ok' => false,
                'message' => 'Model AI sedang tidak merespons. Coba beberapa saat lagi.',
            ], 502);
        }

        return $response->json() ?? [];
    }
}

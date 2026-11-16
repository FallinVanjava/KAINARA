<?php

namespace App\Http\Controllers;

use App\Models\Outfit;
use App\Models\TapisMotif;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home(): View
    {
        return view('home', [
            'featuredMotifs' => TapisMotif::query()->latest('id')->take(6)->get(),
            'featuredOutfits' => Outfit::query()->with('motifs')->latest('id')->take(4)->get(),
        ]);
    }

    public function galeri(Request $request): View
    {
        $query = TapisMotif::query();

        if ($search = trim((string) $request->input('q'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('origin_region', 'like', "%{$search}%");
            });
        }

        if ($origin = $request->input('asal')) {
            $query->where('origin_region', $origin);
        }

        return view('galeri.index', [
            'motifs' => $query->latest('id')->get(),
            'origins' => TapisMotif::query()->distinct()->orderBy('origin_region')->pluck('origin_region'),
            'search' => $search,
            'activeOrigin' => $origin,
        ]);
    }

    public function motifDetail(TapisMotif $motif): View
    {
        return view('galeri.show', [
            'motif' => $motif,
            'outfits' => $motif->outfits()->get(),
        ]);
    }

    public function outfitIndex(Request $request): View
    {
        $query = Outfit::query()->with('motifs');

        if (in_array($request->input('kategori'), ['atasan', 'bawahan', 'set'], true)) {
            $query->where('category', $request->input('kategori'));
        }

        if ($skintone = $request->input('skintone')) {
            if (in_array($skintone, ['warm', 'neutral', 'cool'], true)) {
                $query->whereJsonContains('skintone_match', $skintone);
            }
        }

        if ($motifSlug = $request->input('motif')) {
            $query->whereHas('motifs', fn ($q) => $q->where('slug', $motifSlug));
        }

        return view('outfit.index', [
            'outfits' => $query->latest('id')->get(),
            'motifs' => TapisMotif::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => [
                'kategori' => $request->input('kategori'),
                'skintone' => $request->input('skintone'),
                'motif' => $request->input('motif'),
            ],
        ]);
    }

    public function outfitDetail(Outfit $outfit): View
    {
        return view('outfit.show', [
            'outfit' => $outfit->load('motifs'),
        ]);
    }
}

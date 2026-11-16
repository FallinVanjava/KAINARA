<?php

namespace App\Http\Controllers;

use App\Models\Outfit;
use App\Models\TapisMotif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminOutfitController extends Controller
{
    public function index()
    {
        return view('admin.outfits.index', [
            'outfits' => Outfit::query()->with('motifs')->latest('id')->get(),
        ]);
    }

    public function create()
    {
        return $this->form(new Outfit());
    }

    public function edit(Outfit $outfit)
    {
        return $this->form($outfit);
    }

    public function store(Request $request)
    {
        $data = $this->validateOutfit($request);
        $data['image_path'] = $this->storeImage($request);

        $outfit = Outfit::create($data);
        $outfit->motifs()->sync($request->input('motifs', []));

        return redirect()->route('admin.outfits.index')->with('status', 'Outfit ditambahkan.');
    }

    public function update(Request $request, Outfit $outfit)
    {
        $data = $this->validateOutfit($request, $outfit);

        if ($request->hasFile('image')) {
            $this->deleteImage($outfit->image_path);
            $data['image_path'] = $this->storeImage($request);
        }

        $outfit->update($data);
        $outfit->motifs()->sync($request->input('motifs', []));

        return redirect()->route('admin.outfits.index')->with('status', 'Outfit diperbarui.');
    }

    public function destroy(Outfit $outfit)
    {
        $this->deleteImage($outfit->image_path);
        $outfit->delete();

        return redirect()->route('admin.outfits.index')->with('status', 'Outfit dihapus.');
    }

    private function form(Outfit $outfit)
    {
        return view('admin.outfits.form', [
            'outfit' => $outfit,
            'motifs' => TapisMotif::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    private function validateOutfit(Request $request, ?Outfit $outfit = null): array
    {
        $unique = $outfit ? ','.$outfit->id : '';

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:outfits,slug'.$unique,
            'category' => 'required|in:atasan,bawahan,set',
            'skintone_match' => 'required|array|min:1',
            'skintone_match.*' => 'in:warm,neutral,cool',
            'description' => 'required|string',
            'mix_match_notes' => 'nullable|string',
            'image' => $outfit ? 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048' : 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $data;
    }

    private function storeImage(Request $request): string
    {
        return $request->file('image')->store('outfit', 'public');
    }

    private function deleteImage(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
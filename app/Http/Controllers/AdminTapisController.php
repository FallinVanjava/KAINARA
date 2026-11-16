<?php

namespace App\Http\Controllers;

use App\Models\TapisMotif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminTapisController extends Controller
{
    public function index()
    {
        return view('admin.motifs.index', [
            'motifs' => TapisMotif::query()->latest('id')->get(),
        ]);
    }

    public function create()
    {
        return view('admin.motifs.form', ['motif' => new TapisMotif()]);
    }

    public function store(Request $request)
    {
        $data = $this->validateMotif($request);
        $data['image_path'] = $this->storeImage($request);

        TapisMotif::create($data);

        return redirect()->route('admin.motifs.index')->with('status', 'Motif tapis ditambahkan.');
    }

    public function edit(TapisMotif $motif)
    {
        return view('admin.motifs.form', ['motif' => $motif]);
    }

    public function update(Request $request, TapisMotif $motif)
    {
        $data = $this->validateMotif($request, $motif);

        if ($request->hasFile('image')) {
            $this->deleteImage($motif->image_path);
            $data['image_path'] = $this->storeImage($request);
        }

        $motif->update($data);

        return redirect()->route('admin.motifs.index')->with('status', 'Motif tapis diperbarui.');
    }

    public function destroy(TapisMotif $motif)
    {
        $this->deleteImage($motif->image_path);
        $motif->delete();

        return redirect()->route('admin.motifs.index')->with('status', 'Motif tapis dihapus.');
    }

    private function validateMotif(Request $request, ?TapisMotif $motif = null): array
    {
        $unique = $motif ? ','.$motif->id : '';

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:tapis_motifs,slug'.$unique,
            'origin_region' => 'required|string|max:255',
            'dominant_color' => 'nullable|string|max:255',
            'description' => 'required|string',
            'history' => 'required|string',
            'philosophy' => 'required|string',
            'image' => $motif ? 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048' : 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $data;
    }

    private function storeImage(Request $request): string
    {
        return $request->file('image')->store('tapis', 'public');
    }

    private function deleteImage(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
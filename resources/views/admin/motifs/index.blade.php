@extends('layouts.admin')

@section('title', 'Kelola Motif Tapis: Admin KAINARA')

@section('content')
    <div class="flex items-center justify-between">
        <h1 class="font-display text-3xl font-bold">Motif Tapis</h1>
        <a href="{{ route('admin.motifs.create') }}" class="bg-maroon px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">Tambah Motif</a>
    </div>

    @if ($motifs->isEmpty())
        <p class="mt-10 text-sm text-charcoal/70">Belum ada motif tapis. Klik "Tambah Motif" untuk memulai.</p>
    @else
        <div class="overflow-x-auto">
            <table class="mt-8 w-full border-collapse text-left text-sm">
            <thead>
                <tr class="border-b border-charcoal text-xs uppercase tracking-[0.15em] text-charcoal/70">
                    <th class="py-3 pr-4">Gambar</th>
                    <th class="py-3 pr-4">Nama</th>
                    <th class="py-3 pr-4">Asal Daerah</th>
                    <th class="py-3 pr-4">Outfit Terkait</th>
                    <th class="py-3 pr-4"></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($motifs as $motif)
                    <tr class="border-b border-line">
                        <td class="py-3 pr-4">
                            <div class="h-14 w-12 overflow-hidden bg-gold">
                                @if ($motif->image_path)
                                    <img src="{{ asset('storage/'.$motif->image_path) }}" alt="{{ $motif->name }}" class="h-full w-full object-cover">
                                @endif
                            </div>
                        </td>
                        <td class="py-3 pr-4 font-medium">{{ $motif->name }}</td>
                        <td class="py-3 pr-4">{{ $motif->origin_region }}</td>
                        <td class="py-3 pr-4">{{ $motif->outfits()->count() }}</td>
                        <td class="py-3 pr-4 whitespace-nowrap">
                            <a href="{{ route('admin.motifs.edit', $motif) }}" class="underline underline-offset-4 hover:text-maroon">Edit</a>
                            <form method="POST" action="{{ route('admin.motifs.destroy', $motif) }}" class="inline"
                                  onsubmit="return confirm('Hapus motif ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="ml-3 text-charcoal/60 underline underline-offset-4 hover:text-maroon">Hapus</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
            </table>
        </div>
    @endif
@endsection
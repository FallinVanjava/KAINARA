@extends('layouts.admin')

@section('title', 'Kelola Outfit: Admin KAINARA')

@section('content')
    <div class="flex items-center justify-between">
        <h1 class="font-display text-3xl font-bold">Outfit</h1>
        <a href="{{ route('admin.outfits.create') }}" class="bg-maroon px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">Tambah Outfit</a>
    </div>

    @if ($outfits->isEmpty())
        <p class="mt-10 text-sm text-charcoal/70">Belum ada outfit. Klik "Tambah Outfit" untuk memulai.</p>
    @else
        <div class="overflow-x-auto">
            <table class="mt-8 w-full border-collapse text-left text-sm">
            <thead>
                <tr class="border-b border-charcoal text-xs uppercase tracking-[0.15em] text-charcoal/70">
                    <th class="py-3 pr-4">Gambar</th>
                    <th class="py-3 pr-4">Nama</th>
                    <th class="py-3 pr-4">Kategori</th>
                    <th class="py-3 pr-4">Skintone</th>
                    <th class="py-3 pr-4">Motif Tapis</th>
                    <th class="py-3 pr-4"></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($outfits as $outfit)
                    <tr class="border-b border-line">
                        <td class="py-3 pr-4">
                            <div class="h-14 w-12 overflow-hidden bg-gold">
                                @if ($outfit->image_path)
                                    <img src="{{ asset('storage/'.$outfit->image_path) }}" alt="{{ $outfit->name }}" class="h-full w-full object-cover">
                                @endif
                            </div>
                        </td>
                        <td class="py-3 pr-4 font-medium">{{ $outfit->name }}</td>
                        <td class="py-3 pr-4">{{ $outfit->category }}</td>
                        <td class="py-3 pr-4 capitalize">{{ implode(', ', $outfit->skintone_match) }}</td>
                        <td class="py-3 pr-4 text-xs text-charcoal/70">{{ $outfit->motifs->pluck('name')->implode(', ') ?: '-' }}</td>
                        <td class="py-3 pr-4 whitespace-nowrap">
                            <a href="{{ route('admin.outfits.edit', $outfit) }}" class="underline underline-offset-4 hover:text-maroon">Edit</a>
                            <form method="POST" action="{{ route('admin.outfits.destroy', $outfit) }}" class="inline"
                                  onsubmit="return confirm('Hapus outfit ini?')">
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
@extends('layouts.admin')

@section('title', ($motif->exists ? 'Edit' : 'Tambah').' Motif Tapis: Admin KAINARA')

@section('content')
    <a href="{{ route('admin.motifs.index') }}" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60 hover:text-maroon">← Motif Tapis</a>
    <h1 class="mt-4 font-display text-3xl font-bold">{{ $motif->exists ? 'Edit Motif' : 'Tambah Motif' }}</h1>

    <form method="POST" action="{{ $motif->exists ? route('admin.motifs.update', $motif) : route('admin.motifs.store') }}"
          enctype="multipart/form-data" class="mt-8 flex max-w-2xl flex-col gap-6">
        @csrf
        @if ($motif->exists)
            @method('PUT')
        @endif

        @if ($errors->any())
            <div id="form-errors" role="alert" tabindex="-1" x-init="$el.focus()"
                 class="border border-maroon px-4 py-3 text-sm text-maroon">
                <ul class="list-inside list-disc">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div>
            <label for="name" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Nama motif</label>
            <input type="text" id="name" name="name" required value="{{ old('name', $motif->name) }}"
                   class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            @error('name') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="slug" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Slug (opsional, kosongkan untuk otomatis)</label>
            <input type="text" id="slug" name="slug" value="{{ old('slug', $motif->slug) }}"
                   class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            @error('slug') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="origin_region" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Asal daerah</label>
            <input type="text" id="origin_region" name="origin_region" required value="{{ old('origin_region', $motif->origin_region) }}"
                   placeholder="misal: Banda Lampung"
                   class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            @error('origin_region') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="dominant_color" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Warna dominan (opsional)</label>
            <input type="text" id="dominant_color" name="dominant_color" value="{{ old('dominant_color', $motif->dominant_color) }}"
                   class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            @error('dominant_color') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="description" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Deskripsi</label>
            <textarea id="description" name="description" rows="3" required
                      class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">{{ old('description', $motif->description) }}</textarea>
            @error('description') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="history" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Sejarah</label>
            <textarea id="history" name="history" rows="3" required
                      class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">{{ old('history', $motif->history) }}</textarea>
            @error('history') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="philosophy" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Filosofi</label>
            <textarea id="philosophy" name="philosophy" rows="3" required
                      class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">{{ old('philosophy', $motif->philosophy) }}</textarea>
            @error('philosophy') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="image" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">
                Gambar {{ $motif->exists ? '(kosongkan bila tidak diganti)' : '' }}
            </label>
            <input type="file" id="image" name="image" accept="image/jpeg,image/png,image/webp"
                   {{ $motif->exists ? '' : 'required' }}
                   class="mt-2 block w-full text-sm text-charcoal/70 file:mr-4 file:border-0 file:bg-gold file:px-4 file:py-3 file:text-sm file:font-medium">
            @if ($motif->image_path)
                <img src="{{ asset('storage/'.$motif->image_path) }}" alt="{{ $motif->name }}" class="mt-4 h-32 w-24 object-cover">
            @endif
            @error('image') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <button type="submit" class="w-fit bg-maroon px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">
            {{ $motif->exists ? 'Simpan Perubahan' : 'Tambah Motif' }}
        </button>
    </form>
@endsection
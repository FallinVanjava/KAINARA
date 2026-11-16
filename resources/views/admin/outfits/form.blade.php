@extends('layouts.admin')

@section('title', ($outfit->exists ? 'Edit' : 'Tambah').' Outfit: Admin KAINARA')

@section('content')
    <a href="{{ route('admin.outfits.index') }}" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60 hover:text-maroon">← Outfit</a>
    <h1 class="mt-4 font-display text-3xl font-bold">{{ $outfit->exists ? 'Edit Outfit' : 'Tambah Outfit' }}</h1>

    <form method="POST" action="{{ $outfit->exists ? route('admin.outfits.update', $outfit) : route('admin.outfits.store') }}"
          enctype="multipart/form-data" class="mt-8 flex max-w-2xl flex-col gap-6">
        @csrf
        @if ($outfit->exists)
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
            <label for="name" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Nama outfit</label>
            <input type="text" id="name" name="name" required value="{{ old('name', $outfit->name) }}"
                   class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            @error('name') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="slug" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Slug (opsional, kosongkan untuk otomatis)</label>
            <input type="text" id="slug" name="slug" value="{{ old('slug', $outfit->slug) }}"
                   class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            @error('slug') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="category" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Kategori</label>
            <select id="category" name="category" required
                    class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
                @foreach (['atasan', 'bawahan', 'set'] as $kategori)
                    <option value="{{ $kategori }}" @selected(old('category', $outfit->category) === $kategori)>{{ ucfirst($kategori) }}</option>
                @endforeach
            </select>
            @error('category') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <fieldset>
            <legend class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Kecocokan skintone</legend>
            <div class="mt-3 flex gap-6">
                @foreach (['warm', 'neutral', 'cool'] as $skintone)
                    <label class="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="skintone_match[]" value="{{ $skintone }}"
                               {{ in_array($skintone, old('skintone_match', $outfit->skintone_match ?? []), true) ? 'checked' : '' }}
                               class="h-4 w-4 accent-[#6D0F0F]">
                        {{ ucfirst($skintone) }}
                    </label>
                @endforeach
            </div>
        </fieldset>

        <fieldset>
            <legend class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Motif tapis yang dipakai</legend>
            <div class="mt-3 grid gap-2">
                @foreach ($motifs as $motif)
                    <label class="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="motifs[]" value="{{ $motif->id }}"
                               {{ in_array($motif->id, old('motifs', $outfit->motifs->pluck('id')->all()), true) ? 'checked' : '' }}
                               class="h-4 w-4 accent-[#6D0F0F]">
                        {{ $motif->name }}
                    </label>
                @endforeach
            </div>
        </fieldset>

        <div>
            <label for="description" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Deskripsi</label>
            <textarea id="description" name="description" rows="3" required
                      class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">{{ old('description', $outfit->description) }}</textarea>
            @error('description') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="mix_match_notes" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Catatan mix &amp; match (opsional)</label>
            <textarea id="mix_match_notes" name="mix_match_notes" rows="3"
                      class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">{{ old('mix_match_notes', $outfit->mix_match_notes) }}</textarea>
            @error('mix_match_notes') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="image" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">
                Gambar {{ $outfit->exists ? '(kosongkan bila tidak diganti)' : '' }}
            </label>
            <input type="file" id="image" name="image" accept="image/jpeg,image/png,image/webp"
                   {{ $outfit->exists ? '' : 'required' }}
                   class="mt-2 block w-full text-sm text-charcoal/70 file:mr-4 file:border-0 file:bg-gold file:px-4 file:py-3 file:text-sm file:font-medium">
            @if ($outfit->image_path)
                <img src="{{ asset('storage/'.$outfit->image_path) }}" alt="{{ $outfit->name }}" class="mt-4 h-32 w-24 object-cover">
            @endif
            @error('image') <p class="mt-1 text-xs text-maroon">{{ $message }}</p> @enderror
        </div>

        <button type="submit" class="w-fit bg-maroon px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">
            {{ $outfit->exists ? 'Simpan Perubahan' : 'Tambah Outfit' }}
        </button>
    </form>
@endsection
@extends('layouts.admin')

@section('title', 'Dashboard Admin: KAINARA')

@section('content')
    <h1 class="font-display text-3xl font-bold">Dashboard</h1>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 md:max-w-2xl">
        <a href="{{ route('admin.motifs.index') }}" class="border border-line bg-surface p-8 transition-colors hover:border-maroon">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Motif Tapis</p>
            <p class="mt-3 font-display text-5xl font-bold">{{ $motifCount }}</p>
        </a>
        <a href="{{ route('admin.outfits.index') }}" class="border border-line bg-surface p-8 transition-colors hover:border-maroon">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Outfit</p>
            <p class="mt-3 font-display text-5xl font-bold">{{ $outfitCount }}</p>
        </a>
    </div>
@endsection
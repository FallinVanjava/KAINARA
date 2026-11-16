@extends('layouts.admin')

@section('title', 'Masuk Admin: KAINARA')

@section('content')
    <div class="mx-auto max-w-sm border border-line bg-surface p-8">
        <h1 class="font-display text-3xl font-bold">Masuk Admin</h1>
        <p class="mt-2 text-sm text-charcoal/70">Panel pengelolaan katalog motif tapis dan outfit.</p>

        <form method="POST" action="{{ route('admin.login.attempt') }}" class="mt-8 flex flex-col gap-5">
            @csrf
            <div>
                <label for="email" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Email</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus
                       class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            </div>
            <div>
                <label for="password" class="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/70">Password</label>
                <input type="password" id="password" name="password" required
                       class="mt-2 w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-maroon">
            </div>
            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="remember" class="h-4 w-4 accent-[#6D0F0F]">
                    Ingat saya
                </label>
            </div>

            @error('email')
                <p role="alert" class="border border-maroon px-4 py-3 text-sm text-maroon">{{ $message }}</p>
            @enderror

            <button type="submit" class="bg-maroon px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-charcoal">
                Masuk
            </button>
        </form>
    </div>
@endsection
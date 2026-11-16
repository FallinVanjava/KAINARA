<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin KAINARA')</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-cream font-sans text-charcoal antialiased">
    <nav class="border-b border-line bg-cream">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <div class="flex items-center gap-6">
                <a href="{{ route('admin.dashboard') }}" class="font-display text-xl font-bold">KAINARA<span class="text-charcoal/40"> Admin</span></a>
                <a href="{{ route('admin.motifs.index') }}" class="text-sm hover:text-maroon">Motif</a>
                <a href="{{ route('admin.outfits.index') }}" class="text-sm hover:text-maroon">Outfit</a>
            </div>
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit" class="text-sm text-charcoal/60 underline underline-offset-4 hover:text-maroon">Keluar</button>
            </form>
        </div>
    </nav>

    <main class="mx-auto max-w-6xl px-6 py-10">
        @if (session('status'))
            <p class="mb-6 border border-charcoal bg-gold px-4 py-3 text-sm">{{ session('status') }}</p>
        @endif

        @yield('content')
    </main>
</body>
</html>
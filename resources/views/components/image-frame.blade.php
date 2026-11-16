@props(['path' => null, 'name' => ''])

<div {{ $attributes->merge(['class' => 'relative overflow-hidden bg-gold'.($path ? '' : ' outline outline-1 -outline-offset-1 outline-charcoal/20')]) }}>
    @if ($path)
        <img src="{{ asset('storage/'.$path) }}" alt="{{ $name }}" class="absolute inset-0 h-full w-full object-cover">
    @else
        <span class="absolute inset-x-0 bottom-0 p-6 font-display text-2xl leading-tight text-maroon">{{ $name }}</span>
    @endif
</div>
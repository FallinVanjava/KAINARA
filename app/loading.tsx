export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6 sm:p-8"
      role="status"
      aria-label="Memuat halaman"
    >
      <span className="sr-only">Memuat halaman...</span>
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-[#E8D8C8]" />
      <div className="h-6 w-1/2 animate-pulse rounded-lg bg-[#E8D8C8]/70" />
      <div className="h-72 w-full animate-pulse rounded-2xl bg-[#E8D8C8]/50" />
    </main>
  );
}
